import {
  ASSET_BLUEPRINTS,
  DEFAULT_ORDER_FORM,
  MARKET_FLOW_CONFIG,
  SCENARIOS,
  SECTOR_LEADERSHIP_CONFIG,
  SECTORS,
  VALUATION_DRIVE_CONFIG,
} from "./constants";
import {
  advanceMarketFlowMonth,
  buildMarketFlowNews,
  createMarketFlowState,
} from "./marketFlow";
import { evolveAssetMicroState } from "./microeconomy";
import { FINANCIAL_STATEMENTS } from "./financials.generated";
import {
  clamp,
  deepClone,
  fmtMoney,
  rand,
  randChoice,
  randn,
  timeLabel,
  weightedPick,
} from "./utils";
import {
  buildSessionBlueprint,
  decodeSessionBlueprint,
  packSessionBlueprint,
  SESSION_MINUTES,
  summarizeSessionBars,
} from "./sessionModel";

const DEFAULT_START_DATE = MARKET_FLOW_CONFIG.startDate || "2026-01-05";
const MAX_CANDLE_STORE = 12000;
const BOOTSTRAP_CACHE_KEY = "trade-simulator-bootstrap-v4";
const BOOTSTRAP_CACHE_VERSION = 5;

function parseIsoDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`);
}

function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addCalendarDays(isoDate, days) {
  const date = parseIsoDate(isoDate);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function isWeekend(isoDate) {
  const day = parseIsoDate(isoDate).getDay();
  return day === 0 || day === 6;
}

function monthKey(isoDate) {
  return typeof isoDate === "string" && isoDate.length >= 7 ? isoDate.slice(0, 7) : "M0";
}

function yearOf(isoDate) {
  return parseIsoDate(isoDate).getFullYear();
}

function fract(value) {
  return value - Math.floor(value);
}

function hashNoise1D(x, seed = 0) {
  const n = Math.sin((x + seed) * 127.1 + seed * 311.7) * 43758.5453123;
  return fract(n) * 2 - 1;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function valueNoise1D(x, seed = 0) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = smoothstep(x - x0);
  const v0 = hashNoise1D(x0, seed);
  const v1 = hashNoise1D(x1, seed);
  return v0 + (v1 - v0) * t;
}

function perlin1D(x, seed = 0, octaves = 4, persistence = 0.55) {
  let amplitude = 1;
  let frequency = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += valueNoise1D(x * frequency, seed + i * 17) * amplitude;
    norm += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }
  return norm > 0 ? sum / norm : 0;
}

function sectorSeed(sector) {
  return String(sector || "")
    .split("")
    .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
}

function isMarketClosedDate(isoDate, holidaySet) {
  return isWeekend(isoDate) || holidaySet.has(isoDate);
}

function normalizeStartDate(startDate, holidaySet) {
  let date = typeof startDate === "string" ? startDate : DEFAULT_START_DATE;
  for (let i = 0; i < 370; i += 1) {
    if (!isMarketClosedDate(date, holidaySet)) return date;
    date = addCalendarDays(date, 1);
  }
  return DEFAULT_START_DATE;
}

function previousOpenDate(fromDate, holidaySet) {
  let cursor = addCalendarDays(fromDate, -1);
  for (let i = 0; i < 370; i += 1) {
    if (!isMarketClosedDate(cursor, holidaySet)) return cursor;
    cursor = addCalendarDays(cursor, -1);
  }
  return fromDate;
}

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function roundPrice(value, digits = 6) {
  return Number(Number(value || 0).toFixed(digits));
}

export class TradingEngine {
  constructor() {
    this.listeners = new Set();
    this.toastTimers = new Map();
    this.toastSeq = 0;
    this.version = 0;
    this.bootPromise = null;
    this.state = this.createInitialState();
  }

  createInitialState() {
    return {
      boot: {
        active: true,
        progress: 0,
        message: "Preparing market simulation",
      },
      selected: "ALP",
      scenario: null,
      assets: {},
      assetList: [],
      speed: 1,
      paused: false,
      autoSlow: true,
      autoSlowRestore: null,
      autoSlowUntil: null,
      marketMinute: 0,
      day: 1,
      calendarDate: DEFAULT_START_DATE,
      marketHolidays: [...(MARKET_FLOW_CONFIG.holidays || [])],
      baseMinutesPerSecond: 2.4,
      accumulator: 0,
      lastFrame: 0,
      timeframe: 1,
      chartZoom: 1,
      chartScale: "linear",
      chartAutoScale: true,
      chartOffset: 0,
      chartFollowLatest: true,
      chartIndicators: {
        ma20: { enabled: true, period: 20, color: "ma20" },
        ma50: { enabled: true, period: 50, color: "ma50" },
        vwap: { enabled: true, mode: "rolling", color: "vwap" },
        macd: { enabled: true, fast: 12, slow: 26, signal: 9 },
      },
      news: [],
      reactionWindows: [],
      cash: 100000,
      positions: {},
      openOrders: [],
      orderHistory: [],
      positionHistory: [],
      selectedTab: "invest",
      selectedBookTab: "openPositions",
      orderForm: { ...DEFAULT_ORDER_FORM },
      watchlistPinned: false,
      eventSchedule: 0,
      macroFlow: null,
      sectorLeadership: null,
      needsRender: true,
      toasts: [],
    };
  }

  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.version;

  flush() {
    this.version += 1;
    for (const listener of this.listeners) listener();
  }

  requestRender(emit = true) {
    this.state.needsRender = true;
    if (emit) {
      this.state.needsRender = false;
      this.flush();
    }
  }

  destroy() {
    for (const timer of this.toastTimers.values()) {
      clearTimeout(timer);
    }
    this.toastTimers.clear();
    this.listeners.clear();
  }

  setBootState(patch = {}, emit = true) {
    this.state.boot = {
      ...(this.state.boot || {}),
      ...patch,
    };
    if (emit) this.requestRender(true);
  }

  yieldToBrowser() {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => resolve());
        return;
      }
      setTimeout(resolve, 0);
    });
  }

  initialize = async (emit = true) => {
    if (this.bootPromise) return this.bootPromise;
    this.bootPromise = this.resetState(emit).finally(() => {
      this.bootPromise = null;
    });
    return this.bootPromise;
  };

  createAsset(bp) {
    return {
      ...bp,
      basePrice: bp.price,
      baseVol: bp.vol,
      baseBorrow: bp.borrow,
      baseSpreadBps: 2,
      baseLiquidity: 60,
      price: bp.price,
      prevClose: bp.price,
      open: bp.price,
      high: bp.price,
      low: bp.price,
      close: bp.price,
      anchor: bp.price,
      historyMean: bp.price,
      trend: 0,
      swingState: 0,
      effects: [],
      candles: [],
      sessionPlan: null,
      eventMarkers: [],
      dayPV: 0,
      dayVol: 0,
      lastVolume: 0,
      spreadBps: 2,
      changePct: 0,
      liquidity: 60,
      squeezeMeter: 0,
      intradayNoise: 0,
      intradayDeviation: 0,
      intradayPulse: 0,
      intradayPulseLife: 0,
      intradayPhase: rand(0, Math.PI * 2),
      micro: null,
      financials: FINANCIAL_STATEMENTS[bp.symbol] || { symbol: bp.symbol, quarterly: [], yearly: [] },
    };
  }

  getAssetPriceFloor(asset) {
    const basePrice = Math.max(1, Number(asset?.basePrice || asset?.price || 10));
    return Math.max(0.5, basePrice * 0.04);
  }

  getAssetPriceCeiling(asset) {
    const basePrice = Math.max(1, Number(asset?.basePrice || asset?.price || 10));
    const sectorMultiple =
      asset?.sector === "MEME"
        ? 180000
        : asset?.sector === "AI" || asset?.sector === "SEMI"
          ? 95000
          : 60000;
    const betaBoost = 1 + Math.max(0, Number(asset?.beta || 1) - 1) * 0.8;
    return basePrice * sectorMultiple * betaBoost;
  }

  pickScenario() {
    return deepClone(randChoice(SCENARIOS));
  }

  seedHistory(asset, minutes = 240, seedDate = null) {
    const historyDate = seedDate || this.state.calendarDate || DEFAULT_START_DATE;
    let price = asset.price * rand(0.96, 1.04);
    let pv = 0;
    let volTotal = 0;
    for (let i = 0; i < minutes; i += 1) {
      const open = price;
      const ret =
        randn() * asset.vol * 0.55 +
        (this.state.scenario.sectorBias[asset.sector] || 0) * 0.32;
      const close = Math.max(1, open * Math.exp(ret));
      const wig = Math.max(open, close) * asset.vol * rand(0.12, 0.48);
      const high = Math.max(open, close) + wig;
      const low = Math.max(0.5, Math.min(open, close) - wig);
      const volume = Math.floor(
        (70000 + Math.abs(ret) * 2300000 + Math.random() * 22000) *
          (1 + (asset.sector === "MEME" ? 0.4 : 0)),
      );
      pv += close * volume;
      volTotal += volume;
      price = close;
      asset.candles.push({
        t: -minutes + i,
        day: 0,
        date: historyDate,
        minute: i,
        open,
        high,
        low,
        close,
        volume,
        vwap: pv / Math.max(1, volTotal),
        event: null,
      });
    }
    asset.price = price;
    asset.prevClose = price;
    asset.open = price;
    asset.high = price;
    asset.low = price;
    asset.close = price;
    asset.anchor = price;
    asset.dayPV = 0;
    asset.dayVol = 0;
  }

  collectHistoricalOpenDates(endDate, count, holidaySet) {
    const dates = [];
    let cursor = endDate;
    let guard = 0;
    const maxGuard = Math.max(1200, count * 5);
    while (dates.length < count && guard < maxGuard) {
      if (!isMarketClosedDate(cursor, holidaySet)) {
        dates.unshift(cursor);
      }
      cursor = addCalendarDays(cursor, -1);
      guard += 1;
    }
    return dates;
  }

  collectOpenDatesInRange(startDate, endDate, holidaySet) {
    const dates = [];
    let cursor = startDate;
    let guard = 0;
    while (cursor <= endDate && guard < 5000) {
      if (!isMarketClosedDate(cursor, holidaySet)) dates.push(cursor);
      cursor = addCalendarDays(cursor, 1);
      guard += 1;
    }
    return dates;
  }

  createSectorMap(valueOrFactory = 0) {
    const useFactory = typeof valueOrFactory === "function";
    return Object.fromEntries(
      Object.keys(SECTORS).map((sector) => [
        sector,
        useFactory ? valueOrFactory(sector) : valueOrFactory,
      ]),
    );
  }

  createInitialWeightScores() {
    const heuristic = SECTOR_LEADERSHIP_CONFIG.heuristicWeights || {};
    const scores = {};
    for (const sector of Object.keys(SECTORS)) {
      const base = Math.max(0.0001, Number(heuristic[sector] || 1));
      scores[sector] = Math.log(base);
    }
    return scores;
  }

  softmaxSectorWeights(scoreMap = {}) {
    const sectors = Object.keys(SECTORS);
    const rawScores = sectors.map((sector) => Number(scoreMap[sector] || 0));
    const maxScore = Math.max(...rawScores);
    const exps = rawScores.map((score) => Math.exp(score - maxScore));
    const sum = exps.reduce((a, b) => a + b, 0) || 1;
    const multiplier = sectors.length;
    return Object.fromEntries(
      sectors.map((sector, index) => [sector, (exps[index] / sum) * multiplier]),
    );
  }

  evolveSectorWeightScores(prevScores = {}, baselineScores = {}) {
    const sigma = Math.max(0.001, Number(SECTOR_LEADERSHIP_CONFIG.weightSigma || 0.2));
    const meanReversion = clamp(
      Number(SECTOR_LEADERSHIP_CONFIG.weightMeanReversion || 0.2),
      0,
      1,
    );
    const scoreClamp = Math.max(0.5, Number(SECTOR_LEADERSHIP_CONFIG.weightScoreClamp || 2.4));
    const next = {};
    for (const sector of Object.keys(SECTORS)) {
      const prev = Number(prevScores[sector] || 0);
      const base = Number(baselineScores[sector] || 0);
      const residual = clamp(randn() * sigma, -sigma * 2.5, sigma * 2.5);
      const score = prev + residual + (base - prev) * meanReversion;
      next[sector] = clamp(score, -scoreClamp, scoreClamp);
    }
    return next;
  }

  syncSectorWeightsForYear(leadership, targetYear, { emitNews = false } = {}) {
    if (!leadership) return false;
    const baselineScores = this.createInitialWeightScores();
    const intervalYears = Math.max(1, Number(SECTOR_LEADERSHIP_CONFIG.weightUpdateYears || 1));

    if (!leadership.weightScores) leadership.weightScores = { ...baselineScores };
    if (!leadership.weights) leadership.weights = this.softmaxSectorWeights(leadership.weightScores);
    if (leadership.lastWeightYear == null) {
      leadership.lastWeightYear = targetYear;
      leadership.nextWeightYear = targetYear + intervalYears;
      return false;
    }

    let changed = false;
    while (targetYear >= leadership.nextWeightYear) {
      leadership.weightScores = this.evolveSectorWeightScores(
        leadership.weightScores,
        baselineScores,
      );
      leadership.weights = this.softmaxSectorWeights(leadership.weightScores);
      leadership.lastWeightYear = leadership.nextWeightYear;
      leadership.nextWeightYear += intervalYears;
      changed = true;
    }

    if (changed && emitNews) {
      const topWeights = Object.entries(leadership.weights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([sector, weight]) => `${SECTORS[sector]?.name || sector} ${weight.toFixed(2)}`)
        .join(" / ");
      this.addNews(
        {
          scope: "Macro",
          severity: "blue",
          headline: `Sector Weight Rebalance (${targetYear})`,
          body: `Updated yearly sector weight profile (softmax, mean=1). Top weights: ${topWeights}.`,
        },
        false,
        false,
      );
    }

    return changed;
  }

  pickWeightedSectorLeaders(randomFn = Math.random, sourceWeights = null) {
    const weights =
      sourceWeights ||
      this.state.sectorLeadership?.weights ||
      SECTOR_LEADERSHIP_CONFIG.heuristicWeights ||
      {};
    const count = Math.max(1, Math.floor(SECTOR_LEADERSHIP_CONFIG.topCount || 2));
    const available = Object.keys(SECTORS);
    const leaders = [];

    while (leaders.length < count && available.length) {
      const total = available.reduce(
        (sum, sector) => sum + Math.max(0.0001, Number(weights[sector] || 1)),
        0,
      );
      let ticket = randomFn() * total;
      let chosenIndex = 0;
      for (let i = 0; i < available.length; i += 1) {
        const sector = available[i];
        ticket -= Math.max(0.0001, Number(weights[sector] || 1));
        if (ticket <= 0) {
          chosenIndex = i;
          break;
        }
      }
      const [picked] = available.splice(chosenIndex, 1);
      leaders.push(picked);
    }
    return leaders;
  }

  getQuarterFinancialSnapshot(financials, cursorState, isoDate) {
    if (!financials?.quarterly?.length) return null;
    const list = financials.quarterly;
    const cursor = cursorState || { index: 0 };

    while (
      cursor.index + 1 < list.length &&
      list[cursor.index + 1].endDate <= isoDate
    ) {
      cursor.index += 1;
    }
    if (list[cursor.index].endDate > isoDate) return list[0];
    return list[cursor.index];
  }

  getQuarterFinancialAtDate(financials, isoDate) {
    if (!financials?.quarterly?.length) return null;
    const list = financials.quarterly;
    let selected = list[0];
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].endDate <= isoDate) selected = list[i];
      else break;
    }
    return selected;
  }

  deriveQuarterPsr(quarter) {
    if (!quarter) return null;
    const direct = Number(quarter.psr);
    if (Number.isFinite(direct) && direct > 0) return direct;
    const per = Number(quarter.per);
    const netMargin = Number(quarter.netMargin);
    if (Number.isFinite(per) && Number.isFinite(netMargin) && netMargin > 0) {
      return Math.max(0.1, per * netMargin);
    }
    return null;
  }

  buildFundamentalTilt(quarter) {
    if (!quarter) return 0;
    const revenueYoY = Number.isFinite(quarter.revenueYoY) ? quarter.revenueYoY : 0;
    const netMargin = Number(quarter.netMargin || 0);
    const roe = Number(quarter.roe || 0);
    const debtToEquity = Number(quarter.debtToEquity || 1);
    const fcfRatio =
      quarter.revenue && Number(quarter.revenue) !== 0
        ? Number(quarter.freeCashFlow || 0) / Number(quarter.revenue)
        : 0;

    const tilt =
      revenueYoY * 0.0018 +
      (netMargin - 0.09) * 0.0032 +
      (roe - 0.16) * 0.0012 +
      (fcfRatio - 0.08) * 0.0021 -
      (debtToEquity - 1.0) * 0.00065;
    return clamp(tilt, -0.0038, 0.0038);
  }

  buildAssetMicroState(
    asset,
    flowState,
    isoDate,
    leadership,
    previousState = asset?.micro || null,
    quarter = null,
  ) {
    if (!asset || !flowState || !isoDate) return null;
    const resolvedQuarter = quarter || this.getQuarterFinancialAtDate(asset.financials, isoDate);
    return evolveAssetMicroState({
      asset,
      quarter: resolvedQuarter,
      flowState,
      leadership,
      calendarDate: isoDate,
      previousState,
    });
  }

  applyMicroSurface(asset) {
    if (!asset) return;
    const surface = asset.micro?.surface;
    const baseBorrow = Number(asset.baseBorrow ?? asset.borrow ?? 0.02);
    asset.borrow = clamp(
      baseBorrow * Number(surface?.borrowMult || 1),
      0.005,
      0.45,
    );
  }

  syncMicroEconomy(flowState, isoDate, { force = false, emitNews = true } = {}) {
    if (!flowState || !isoDate) return false;
    const targetMonthKey = monthKey(isoDate);
    const revisions = [];
    let changed = false;

    for (const symbol of this.state.assetList) {
      const asset = this.state.assets[symbol];
      if (!asset) continue;
      if (!force && asset.micro?.monthKey === targetMonthKey) continue;

      const previousState = asset.micro;
      const nextState = this.buildAssetMicroState(
        asset,
        flowState,
        isoDate,
        this.state.sectorLeadership,
        previousState,
      );
      if (!nextState) continue;

      asset.micro = nextState;
      this.applyMicroSurface(asset);
      changed = true;

      const prevEarnings = Number(previousState?.signals?.earnings || 0);
      const nextEarnings = Number(nextState.signals?.earnings || 0);
      const delta = nextEarnings - prevEarnings;
      revisions.push({
        symbol,
        asset,
        delta,
        nextState,
        previousRegime: previousState?.regime || null,
      });
    }

    if (!changed || !emitNews) return changed;

    const meaningful = revisions
      .filter(
        (item) =>
          Math.abs(item.delta) >= 0.58 ||
          item.previousRegime !== item.nextState.regime,
      )
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 2);

    for (const item of meaningful) {
      const direction = item.delta >= 0 ? 1 : -1;
      const severity = item.delta >= 0 ? "good" : "bad";
      const tone = item.delta >= 0 ? "improves" : "deteriorates";
      this.addNews(
        {
          scope: item.symbol,
          severity,
          symbol: item.symbol,
          direction,
          headline: `${item.symbol} micro regime ${tone}`,
          body: `${item.asset.name} shifts into ${item.nextState.regime.toLowerCase()} as macro pressure flows into demand, margin, and funding conditions.`,
        },
        false,
        false,
      );
    }

    return changed;
  }

  buildSectorValuationSnapshot(isoDate) {
    if (!isoDate || !this.state?.assetList?.length) return null;
    const sectorAgg = this.createSectorMap(() => ({
      per: 0,
      perCount: 0,
      pbr: 0,
      pbrCount: 0,
      psr: 0,
      psrCount: 0,
    }));
    const global = {
      per: 0,
      perCount: 0,
      pbr: 0,
      pbrCount: 0,
      psr: 0,
      psrCount: 0,
    };

    for (const symbol of this.state.assetList) {
      const asset = this.state.assets[symbol];
      if (!asset) continue;
      const quarter = this.getQuarterFinancialAtDate(asset.financials, isoDate);
      if (!quarter) continue;
      const bucket = sectorAgg[asset.sector];
      if (!bucket) continue;

      const per = Number(quarter.per);
      if (Number.isFinite(per) && per > 0) {
        bucket.per += per;
        bucket.perCount += 1;
        global.per += per;
        global.perCount += 1;
      }

      const pbr = Number(quarter.pbr);
      if (Number.isFinite(pbr) && pbr > 0) {
        bucket.pbr += pbr;
        bucket.pbrCount += 1;
        global.pbr += pbr;
        global.pbrCount += 1;
      }

      const psr = Number(this.deriveQuarterPsr(quarter));
      if (Number.isFinite(psr) && psr > 0) {
        bucket.psr += psr;
        bucket.psrCount += 1;
        global.psr += psr;
        global.psrCount += 1;
      }
    }

    const globalPer = global.perCount ? global.per / global.perCount : 10;
    const globalPbr = global.pbrCount ? global.pbr / global.pbrCount : 1.5;
    const globalPsr = global.psrCount ? global.psr / global.psrCount : 2.5;
    return this.createSectorMap((sector) => {
      const agg = sectorAgg[sector];
      return {
        per: agg.perCount ? agg.per / agg.perCount : globalPer,
        pbr: agg.pbrCount ? agg.pbr / agg.pbrCount : globalPbr,
        psr: agg.psrCount ? agg.psr / agg.psrCount : globalPsr,
      };
    });
  }

  updateValuationExpectations(
    leadership,
    flowState,
    isoDate,
    { force = false, emitNews = false } = {},
  ) {
    if (!leadership || !flowState || !isoDate) return false;
    const currentMonthKey = monthKey(isoDate);
    if (!force && leadership.lastExpectationMonthKey === currentMonthKey) return false;

    const snapshot = this.buildSectorValuationSnapshot(isoDate);
    if (!snapshot) return false;

    if (!leadership.valuationExpectations) {
      leadership.valuationExpectations = deepClone(snapshot);
    }
    if (!leadership.leaderPersistence) {
      leadership.leaderPersistence = this.createSectorMap(0);
    }
    if (!leadership.valuationCycleState) {
      leadership.valuationCycleState = this.createSectorMap(0);
    }

    const cfg = VALUATION_DRIVE_CONFIG;
    const response = clamp(Number(cfg.expectationResponse || 0.14), 0.01, 0.95);
    const weightPremiumScale = Number(cfg.weightPremiumScale || 0.22);
    const persistencePremiumScale = Number(cfg.persistencePremiumScale || 0.052);
    const nonLeaderDiscountScale = Number(cfg.nonLeaderDiscountScale || 0.08);
    const sentimentScale = Number(cfg.sentimentScale || 0.06);
    const persistenceDecay = clamp(Number(cfg.persistenceDecay || 0.94), 0.5, 0.995);
    const persistenceBump = Math.max(0.1, Number(cfg.persistenceBump || 1));
    const maxPersistence = Math.max(3, Number(cfg.maxPersistence || 36));
    const minMultiplier = Math.max(0.2, Number(cfg.minMultiplier || 0.62));
    const maxMultiplier = Math.max(minMultiplier + 0.05, Number(cfg.maxMultiplier || 1.72));
    const sentimentE = clamp(Number(flowState.factors?.E || 0), -3.2, 3.2);
    const reversionCfg = cfg.meanReversionNoise || {};
    const reversionPeriod = Math.max(4, Number(reversionCfg.periodMonths || 14));
    const reversionOctaves = Math.max(1, Number(reversionCfg.octaves || 3));
    const reversionPersistence = clamp(Number(reversionCfg.persistence || 0.58), 0.1, 0.95);
    const reversionBaseProb = clamp(Number(reversionCfg.baseProb || 0.28), 0.02, 0.92);
    const reversionWaveProbScale = Number(reversionCfg.waveProbScale || 0.16);
    const reversionStressBoost = Number(reversionCfg.stressBoost || 0.05);
    const reversionPullStrength = clamp(Number(reversionCfg.pullStrength || 0.44), 0.02, 0.92);
    const reversionWaveScale = Number(reversionCfg.waveScale || 0.05);
    const monthOrdinal = Number(flowState.month || 0);
    const factors = flowState.factors || {};
    const axes = flowState.axes || {};

    const leaders = leadership.leaders || [];
    const leaderSet = new Set(leaders);
    for (const sector of Object.keys(SECTORS)) {
      const isLeader = leaderSet.has(sector);
      const leaderRank = leaders.indexOf(sector);
      const previousPersistence = Number(leadership.leaderPersistence[sector] || 0);
      const nextPersistence = clamp(
        previousPersistence * persistenceDecay + (isLeader ? persistenceBump : 0),
        0,
        maxPersistence,
      );
      leadership.leaderPersistence[sector] = nextPersistence;
      const persistenceUnits = nextPersistence / 12;
      const weight = Number(leadership.weights?.[sector] || 1);
      const correctionUntil = Number(leadership.correctionUntilMonth?.[sector] ?? -1);
      const correctionActive = monthOrdinal <= correctionUntil;
      const cyclePrev = Number(leadership.valuationCycleState[sector] || 0);
      const macroImpulse =
        Number(axes.realEconomy || 0) * 0.16 +
        Number(factors.D || 0) * 0.08 +
        Number(factors.E || 0) * 0.18 -
        Number(axes.policy || 0) * 0.15 -
        Math.max(0, Number(axes.inflation || 0)) * 0.12 -
        Number(axes.externalShock || 0) * 0.11 -
        Math.max(0, Number(factors.F || 0)) * 0.1;
      const leadershipImpulse =
        leaderRank === 0
          ? 0.28
          : leaderRank === 1
            ? 0.18
            : -0.11 - Math.min(0.18, previousPersistence * 0.012);
      const valuationWave = perlin1D(
        monthOrdinal / 11 + sectorSeed(sector) * 0.0011,
        sectorSeed(sector) + monthOrdinal * 7,
        3,
        0.6,
      );
      const expansionImpulse =
        Math.max(0, macroImpulse) * (isLeader ? 0.42 : 0.14) +
        persistenceUnits * 0.06 +
        valuationWave * 0.08;
      const overheating = Math.max(0, cyclePrev - 0.58);
      const coolingImpulse =
        overheating *
          (0.18 +
            (correctionActive ? 0.26 : 0) +
            Math.max(0, -macroImpulse) * 0.34 +
            (isLeader ? 0.02 : 0.12)) +
        (correctionActive ? 0.22 : 0);
      const cycleNext = clamp(
        cyclePrev * 0.9 +
          expansionImpulse +
          leadershipImpulse * 0.24 +
          macroImpulse * 0.2 -
          coolingImpulse,
        -1.3,
        1.9,
      );
      leadership.valuationCycleState[sector] = cycleNext;

      let rawMultiplier =
        1 +
        (weight - 1) * weightPremiumScale * 0.22 +
        persistenceUnits * persistencePremiumScale * 0.72 +
        sentimentE * sentimentScale * 0.55 +
        cycleNext * 0.42 -
        (isLeader ? 0 : nonLeaderDiscountScale * 0.45);

      // Non-leaders still get stochastic mean-reversion opportunities.
      if (!isLeader) {
        const reversionWave = perlin1D(
          monthOrdinal / reversionPeriod + sectorSeed(sector) * 0.0009,
          sectorSeed(sector) + monthOrdinal * 19,
          reversionOctaves,
          reversionPersistence,
        );
        const reversionProb = clamp(
          reversionBaseProb +
            reversionWave * reversionWaveProbScale +
            Math.max(0, -sentimentE) * reversionStressBoost,
          0.02,
          0.9,
        );
        const reversionHit = rand(0, 1) < reversionProb;
        const towardMean = (1 - rawMultiplier) * (reversionHit ? reversionPullStrength : reversionPullStrength * 0.24);
        rawMultiplier += towardMean + reversionWave * reversionWaveScale;
      }
      if (correctionActive) {
        rawMultiplier -= 0.08 + Math.max(0, cyclePrev) * 0.06;
      }

      const multiplier = clamp(rawMultiplier, minMultiplier, maxMultiplier);

      const base = snapshot[sector];
      const target = {
        per: base.per * multiplier,
        pbr: base.pbr * multiplier,
        psr: base.psr * multiplier,
      };
      const prev = leadership.valuationExpectations[sector] || base;
      leadership.valuationExpectations[sector] = {
        per: prev.per + (target.per - prev.per) * response,
        pbr: prev.pbr + (target.pbr - prev.pbr) * response,
        psr: prev.psr + (target.psr - prev.psr) * response,
      };
    }

    leadership.lastExpectationMonthKey = currentMonthKey;

    if (emitNews) {
      const headlineTone = sentimentE >= 0 ? "upward" : "downward";
      this.addNews(
        {
          scope: "Macro",
          severity: "blue",
          headline: `Valuation Expectations (${currentMonthKey})`,
          body: `Expectation band repriced ${headlineTone} with sentiment E=${sentimentE.toFixed(
            2,
          )}.`,
        },
        false,
        false,
      );
    }
    return true;
  }

  buildValuationMacroPressure({
    sector,
    quarter,
    flowState,
    leadership = null,
    leaderRank = -1,
    dayIndex = 0,
    correctionActive = false,
  }) {
    if (!flowState || !sector) return 0;
    const cfg = VALUATION_DRIVE_CONFIG;

    const expectation = leadership?.valuationExpectations?.[sector];
    const expectedPer = Number(expectation?.per);
    const expectedPbr = Number(expectation?.pbr);
    const expectedPsr = Number(expectation?.psr);
    const fallbackPer = Number(quarter?.per || 10);
    const fallbackPbr = Number(quarter?.pbr || 1.5);
    const fallbackPsr = Number(this.deriveQuarterPsr(quarter) || 2.5);
    const targetPer =
      Number.isFinite(expectedPer) && expectedPer > 0 ? expectedPer : fallbackPer;
    const targetPbr =
      Number.isFinite(expectedPbr) && expectedPbr > 0 ? expectedPbr : fallbackPbr;
    const targetPsr =
      Number.isFinite(expectedPsr) && expectedPsr > 0 ? expectedPsr : fallbackPsr;

    const actualPer = Number(quarter?.per || targetPer);
    const actualPbr = Number(quarter?.pbr || targetPbr);
    const actualPsr = Number(this.deriveQuarterPsr(quarter) || targetPsr);
    const gapClamp = Math.max(0.1, Number(cfg.gapClamp || 0.85));
    const gapPer = clamp((targetPer - actualPer) / Math.max(1, targetPer), -gapClamp, gapClamp);
    const gapPbr = clamp((targetPbr - actualPbr) / Math.max(0.2, targetPbr), -gapClamp, gapClamp);
    const gapPsr = clamp((targetPsr - actualPsr) / Math.max(0.2, targetPsr), -gapClamp, gapClamp);
    const w = cfg.valuationWeights || { per: 0.4, pbr: 0.35, psr: 0.25 };
    const valuationGap = gapPer * w.per + gapPbr * w.pbr + gapPsr * w.psr;
    const valuationTerm = valuationGap * Number(cfg.valuationScale || 0.0032);
    const cycleState = Number(leadership?.valuationCycleState?.[sector] || 0);
    const cycleTerm = clamp(cycleState * 0.0012, -0.0024, 0.0028);

    const factors = flowState.factors || {};
    const axes = flowState.axes || {};
    const macroScore =
      Number(axes.realEconomy || 0) * 0.46 -
      Number(axes.policy || 0) * 0.4 -
      Number(axes.externalShock || 0) * 0.34 -
      Math.max(0, Number(axes.inflation || 0)) * 0.24 +
      Number(factors.E || 0) * 0.58 -
      Math.max(0, Number(factors.F || 0)) * 0.18;
    const macroTerm = clamp(macroScore * Number(cfg.macroScale || 0.0016), -0.0038, 0.0038);

    const perlinCfg = cfg.perlin || {};
    const periodDays = Math.max(8, Number(perlinCfg.periodDays || 96));
    const octaves = Math.max(1, Number(perlinCfg.octaves || 4));
    const persistence = clamp(Number(perlinCfg.persistence || 0.56), 0.1, 0.95);
    const noise = perlin1D(
      dayIndex / periodDays + sectorSeed(sector) * 0.0009,
      sectorSeed(sector) + Number(flowState.month || 0) * 13,
      octaves,
      persistence,
    );
    const noiseTerm = noise * Number(perlinCfg.noiseScale || 0.00125);

    const leaderTrend = leaderRank >= 0
      ? Number(cfg.trendLeader?.[Math.min(leaderRank, cfg.trendLeader.length - 1)] || 0)
      : 0;
    const correctionTerm =
      correctionActive && leaderRank < 0
        ? -Math.abs(Number(cfg.correctionDrift || 0.00032)) * (1 + Math.max(0, cycleState) * 0.45)
        : 0;

    return clamp(
      valuationTerm + macroTerm + noiseTerm + cycleTerm + leaderTrend + correctionTerm,
      -0.0068,
      0.0068,
    );
  }

  buildMacroSectorBias(flowState, baseBias, leaders = []) {
    const factors = flowState.factors;
    const axes = flowState.axes;
    const demandTilt = factors.D * 0.00004 + factors.E * 0.00003;
    const stressTilt = factors.F * 0.00005 + factors.M * 0.00004 + factors.X * 0.00004;
    const inflationTilt = axes.inflation * 0.00003;
    const leaderBoost = SECTOR_LEADERSHIP_CONFIG.rankBoost || [];
    const nonLeaderDrag = Math.max(0, Number(SECTOR_LEADERSHIP_CONFIG.nonLeaderDrag || 0));
    const leaderSet = new Set(leaders);

    const nextBias = {
      AI: (baseBias.AI || 0) + demandTilt * 1.08 - stressTilt * 0.95,
      SEMI: (baseBias.SEMI || 0) + demandTilt * 0.98 - stressTilt * 0.9,
      BIO: (baseBias.BIO || 0) + demandTilt * 0.4 - stressTilt * 0.55,
      ENR: (baseBias.ENR || 0) + inflationTilt + factors.X * 0.00005,
      CONS: (baseBias.CONS || 0) + demandTilt * 0.74 - stressTilt * 0.68,
      MEME: (baseBias.MEME || 0) + demandTilt * 1.32 - stressTilt * 1.2,
    };

    for (const sector of Object.keys(nextBias)) {
      const rank = leaders.indexOf(sector);
      if (rank >= 0) {
        const boost = leaderBoost[Math.min(rank, leaderBoost.length - 1)] || 0;
        nextBias[sector] += boost;
      } else if (!leaderSet.has(sector)) {
        nextBias[sector] -= nonLeaderDrag;
      }
      const cap = sector === "MEME" ? 0.00085 : 0.00065;
      nextBias[sector] = clamp(nextBias[sector], -cap, cap);
    }
    return nextBias;
  }

  buildHistoricalTrendPressure({
    asset,
    flowState,
    leaderRank = -1,
    correctionActive = false,
    dayIndex = 0,
    swingState = 0,
  }) {
    if (!asset || !flowState) return 0;
    const factors = flowState.factors || {};
    const axes = flowState.axes || {};
    const assetSeed = sectorSeed(`${asset.symbol}:${asset.sector}`);
    const longWave = perlin1D(
      dayIndex / 188 + assetSeed * 0.0008,
      assetSeed + 31,
      4,
      0.62,
    );
    const mediumWave = perlin1D(
      dayIndex / 61 + assetSeed * 0.0017,
      assetSeed + Number(flowState.month || 0) * 9,
      3,
      0.58,
    );
    const shortWave = perlin1D(
      dayIndex / 23 + assetSeed * 0.0029,
      assetSeed + 97,
      2,
      0.64,
    );
    const macroBias =
      Number(axes.realEconomy || 0) * 0.00074 +
      Number(factors.D || 0) * 0.00028 +
      Number(factors.E || 0) * 0.00046 -
      Number(axes.policy || 0) * 0.00056 -
      Math.max(0, Number(axes.inflation || 0)) * 0.00042 -
      Number(axes.externalShock || 0) * 0.00058 -
      Math.max(0, Number(factors.F || 0)) * 0.00036;
    const sectorRotation =
      leaderRank === 0 ? 0.00036 : leaderRank === 1 ? 0.00018 : -0.00012;
    const correctionBias =
      correctionActive && leaderRank < 0
        ? -0.00055
        : correctionActive
          ? -0.00022
          : 0;
    const swingReversion = clamp(-swingState * 0.16, -0.0012, 0.0012);
    return clamp(
      macroBias +
        longWave * 0.00135 +
        mediumWave * 0.00086 +
        shortWave * 0.00032 +
        sectorRotation +
        correctionBias +
        swingReversion,
      -0.0042,
      0.0042,
    );
  }

  getBootstrapCacheKey() {
    return BOOTSTRAP_CACHE_KEY;
  }

  loadBootstrapCache() {
    if (!canUseStorage()) return null;
    try {
      const raw = window.localStorage.getItem(this.getBootstrapCacheKey());
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.version !== BOOTSTRAP_CACHE_VERSION) return null;
      if (parsed?.startDate !== MARKET_FLOW_CONFIG.financialStartDate) return null;
      if (!Array.isArray(parsed?.dates) || !parsed.dates.length) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  saveBootstrapCache(payload) {
    if (!canUseStorage()) return false;
    try {
      window.localStorage.setItem(this.getBootstrapCacheKey(), JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }

  hydrateBootstrapCache(cache) {
    if (!cache?.dates?.length) return null;
    const dates = cache.dates;
    const candlesBySymbol = cache.candles || {};
    const assetSnapshots = cache.assets || {};

    for (const symbol of this.state.assetList) {
      const asset = this.state.assets[symbol];
      const packedCandles = candlesBySymbol[symbol] || [];
      asset.candles = packedCandles.map((row, index) => {
        const dayIndex = index - dates.length + 1;
        return {
          t: dayIndex * SESSION_MINUTES,
          day: dayIndex,
          date: dates[index],
          minute: 0,
          open: Number(row[0] || asset.price),
          high: Number(row[1] || asset.price),
          low: Number(row[2] || asset.price),
          close: Number(row[3] || asset.price),
          volume: Math.max(1, Math.floor(Number(row[4] || 1))),
          vwap: Number(row[5] || row[3] || asset.price),
          event: null,
          session: row[6] || null,
        };
      });
      const snapshot = assetSnapshots[symbol];
      if (!snapshot) continue;
      asset.price = Number(snapshot.price || asset.price);
      asset.prevClose = Number(snapshot.prevClose || asset.price);
      asset.open = asset.price;
      asset.high = asset.price;
      asset.low = asset.price;
      asset.close = asset.price;
      asset.anchor = Number(snapshot.anchor || asset.anchor || asset.price);
      asset.historyMean = Number(snapshot.historyMean || asset.historyMean || asset.price);
      asset.trend = Number(snapshot.trend || 0);
      asset.swingState = Number(snapshot.swingState || 0);
      asset.lastVolume = Math.max(0, Math.floor(Number(snapshot.lastVolume || 0)));
      asset.micro = snapshot.micro || asset.micro;
      asset.borrow = Number(snapshot.borrow || asset.borrow || asset.baseBorrow || 0.02);
      asset.squeezeMeter = Number(snapshot.squeezeMeter || 0);
      this.applyMicroSurface(asset);
    }

    return {
      flow: cache.flow || null,
      leadership: cache.leadership || null,
    };
  }

  buildAssetSessionContext({
    asset,
    flowState,
    isoDate,
    dayIndex = 0,
    leadership = this.state.sectorLeadership,
    sectorBiasMap = this.state.scenario?.sectorBias || {},
    microState = asset.micro,
  }) {
    if (!asset || !flowState || !isoDate) return null;
    const quarter = this.getQuarterFinancialAtDate(asset.financials, isoDate);
    const leaderRank = leadership?.leaders?.indexOf(asset.sector) ?? -1;
    const correctionUntil = leadership?.correctionUntilMonth?.[asset.sector] ?? -1;
    const correctionActive =
      Number(flowState.month || -1) <= Number(correctionUntil);
    const valuationMacroPressure = this.buildValuationMacroPressure({
      sector: asset.sector,
      quarter,
      flowState,
      leadership,
      leaderRank,
      dayIndex,
      correctionActive,
    });
    const trendPressure = this.buildHistoricalTrendPressure({
      asset,
      flowState,
      leaderRank,
      correctionActive,
      dayIndex,
      swingState: Number(asset.swingState || 0),
    });
    const fundamentalTilt = this.buildFundamentalTilt(quarter);
    const marketDrift = Number(flowState.regime?.drift || 0) * Number(asset.beta || 1) * 0.9;
    const sectorDrift = Number(sectorBiasMap?.[asset.sector] || 0) * 0.94;
    const microDrift = Number(microState?.surface?.drift || 0) * 0.42;
    const baseDailyVol = clamp(
      (asset.baseVol || asset.vol) *
        Number(microState?.surface?.volMultiplier || 1) *
        Number(flowState.regime?.vol || 1) *
        1.72 +
        0.0038,
      0.006,
      0.085,
    );
    const priceFloor = this.getAssetPriceFloor(asset);
    const priceCeiling = this.getAssetPriceCeiling(asset);
    const prevClose = clamp(
      Number(asset.price || asset.prevClose || asset.basePrice || 1),
      priceFloor,
      priceCeiling,
    );
    const anchorGap = clamp(
      Math.log(
        Math.max(priceFloor, Number(asset.anchor || prevClose)) /
          Math.max(priceFloor, prevClose),
      ),
      -0.24,
      0.24,
    );
    const meanGap = clamp(
      Math.log(
        Math.max(priceFloor, Number(asset.historyMean || prevClose)) /
          Math.max(priceFloor, prevClose),
      ),
      -0.24,
      0.24,
    );
    const stress = clamp(
      Math.max(0, Number(flowState.axes?.externalShock || 0)) +
        Math.max(0, Number(flowState.axes?.policy || 0)) * 0.72 +
        Math.max(0, Number(flowState.factors?.F || 0)) * 0.84 +
        Math.max(0, Number(flowState.axes?.inflation || 0)) * 0.32,
      0,
      6,
    );
    const totalPressure =
      marketDrift * 0.54 +
      sectorDrift * 0.82 +
      fundamentalTilt * 0.18 +
      valuationMacroPressure * 0.92 +
      microDrift * 0.18 +
      trendPressure * 1.02 +
      Number(asset.trend || 0) * 0.16;

    return {
      isoDate,
      quarter,
      leaderRank,
      correctionActive,
      valuationMacroPressure,
      trendPressure,
      fundamentalTilt,
      marketDrift,
      sectorDrift,
      microDrift,
      baseDailyVol,
      priceFloor,
      priceCeiling,
      prevClose,
      anchorGap,
      meanGap,
      stress,
      totalPressure,
      preTrend: Number(asset.trend || 0),
      preAnchor: Number(asset.anchor || prevClose),
      preHistoryMean: Number(asset.historyMean || prevClose),
      preSwingState: Number(asset.swingState || 0),
      microState,
    };
  }

  createSessionPlan(asset, context) {
    if (!asset || !context) return null;
    const blueprint = buildSessionBlueprint({
      symbol: asset.symbol,
      sector: asset.sector,
      calendarDate: context.isoDate,
      prevClose: context.prevClose,
      priceFloor: context.priceFloor,
      priceCeiling: context.priceCeiling,
      baseDailyVol: context.baseDailyVol,
      totalPressure: context.totalPressure,
      anchorGap: context.anchorGap,
      meanGap: context.meanGap,
      stress: context.stress,
      shortInterest: Number(asset.shortInterest || 0),
      leaderRank: context.leaderRank,
      correctionActive: context.correctionActive,
      swingState: context.preSwingState,
    });
    const bars = decodeSessionBlueprint(blueprint, 1);
    const summary = summarizeSessionBars(bars);
    return summary ? { blueprint, bars, summary, context } : null;
  }

  applySessionStateTransition(asset, context, summary) {
    if (!asset || !context || !summary) return;
    const priceFloor = context.priceFloor;
    const priceCeiling = context.priceCeiling;
    const sessionClose = clamp(
      Number(summary.close || context.prevClose),
      priceFloor,
      priceCeiling,
    );
    const closeVsPrev = Math.log(
      Math.max(priceFloor, sessionClose) / Math.max(priceFloor, context.prevClose),
    );
    const intradayLogReturn = Number(summary.logReturn || 0);

    asset.price = sessionClose;
    asset.prevClose = sessionClose;
    asset.open = Number(summary.open || sessionClose);
    asset.high = Number(summary.high || sessionClose);
    asset.low = Number(summary.low || sessionClose);
    asset.close = sessionClose;
    asset.lastVolume = Math.max(0, Math.floor(Number(summary.volume || 0)));
    asset.dayPV = sessionClose * asset.lastVolume;
    asset.dayVol = asset.lastVolume;
    asset.changePct =
      ((sessionClose / Math.max(priceFloor, context.prevClose)) - 1) * 100;
    asset.anchor = clamp(
      context.preAnchor *
        Math.exp(
          clamp(
            context.marketDrift * 0.24 +
              context.sectorDrift * 0.3 +
              context.valuationMacroPressure * 0.48 +
              context.microDrift * 0.14 +
              closeVsPrev * 0.18,
            -0.04,
            0.04,
          ),
        ),
      priceFloor,
      priceCeiling,
    );
    asset.historyMean = clamp(
      context.preHistoryMean *
        Math.exp(
          clamp(
            context.marketDrift * 0.15 +
              context.sectorDrift * 0.18 +
              context.fundamentalTilt * 0.08 +
              context.microDrift * 0.05 +
              closeVsPrev * 0.08,
            -0.03,
            0.03,
          ),
        ),
      priceFloor,
      priceCeiling,
    );
    asset.trend = clamp(
      context.preTrend * 0.72 +
        intradayLogReturn * 0.46 +
        context.trendPressure * 0.22,
      -0.022,
      0.022,
    );
    asset.swingState = clamp(
      context.preSwingState * 0.78 +
        intradayLogReturn * 0.58 -
        context.meanGap * 0.12 +
        context.totalPressure * 0.08,
      -0.06,
      0.06,
    );
    asset.sessionPlan = null;
  }

  prepareSessionPlansForDate(isoDate, dayIndex) {
    const sectorBiasMap = this.state.scenario?.sectorBias || {};
    for (const symbol of this.state.assetList) {
      const asset = this.state.assets[symbol];
      const context = this.buildAssetSessionContext({
        asset,
        flowState: this.state.macroFlow,
        isoDate,
        dayIndex,
        leadership: this.state.sectorLeadership,
        sectorBiasMap,
        microState: asset.micro,
      });
      const plan = this.createSessionPlan(asset, context);
      if (!plan) continue;
      asset.sessionPlan = plan;
      asset.prevClose = context.prevClose;
      asset.open = plan.summary.open;
      asset.high = plan.summary.open;
      asset.low = plan.summary.open;
      asset.close = plan.summary.open;
      asset.price = plan.summary.open;
      asset.dayPV = 0;
      asset.dayVol = 0;
      asset.lastVolume = 0;
      asset.changePct =
        ((plan.summary.open / Math.max(context.priceFloor, context.prevClose)) - 1) * 100;
      asset.intradayNoise = 0;
      asset.intradayDeviation = 0;
      asset.intradayPulse = 0;
      asset.intradayPulseLife = 0;
      asset.intradayPhase = rand(0, Math.PI * 2);
    }
  }

  async seedHistoricalYears(years, endDate, holidaySet, onProgress = null) {
    const normalizedYears = Math.max(1, Number(years) || 1);
    const tradingDays = Math.max(140, Math.floor(normalizedYears * 252));
    const financialStartDate = MARKET_FLOW_CONFIG.financialStartDate;
    const dates =
      typeof financialStartDate === "string" && financialStartDate <= endDate
        ? this.collectOpenDatesInRange(financialStartDate, endDate, holidaySet)
        : this.collectHistoricalOpenDates(endDate, tradingDays, holidaySet);
    if (!dates.length) return null;

    let historyFlow = createMarketFlowState(MARKET_FLOW_CONFIG, dates[0]);
    const leadership = this.createSectorLeadershipState(yearOf(dates[0]));
    leadership.leaders = this.pickWeightedSectorLeaders(Math.random, leadership.weights);
    this.updateValuationExpectations(leadership, historyFlow, dates[0], {
      force: true,
      emitNews: false,
    });
    let nextRotationMonth =
      historyFlow.month + Math.max(1, Number(SECTOR_LEADERSHIP_CONFIG.intervalMonths || 3));
    leadership.nextRebalanceMonth = nextRotationMonth;
    const baseBias = this.createSectorMap(0);
    const financialCursor = Object.fromEntries(
      this.state.assetList.map((symbol) => [symbol, { index: 0 }]),
    );
    const microStates = {};
    const packedCandles = Object.fromEntries(
      this.state.assetList.map((symbol) => [symbol, []]),
    );
    for (const symbol of this.state.assetList) {
      const asset = this.state.assets[symbol];
      const quarter = this.getQuarterFinancialSnapshot(
        asset.financials,
        financialCursor[symbol],
        dates[0],
      );
      microStates[symbol] = this.buildAssetMicroState(
        asset,
        historyFlow,
        dates[0],
        leadership,
        null,
        quarter,
      );
    }

    for (let i = 0; i < dates.length; i += 1) {
      if (
        onProgress &&
        (i === 0 || i === dates.length - 1 || i % 24 === 0)
      ) {
        onProgress({
          progress: dates.length > 1 ? i / (dates.length - 1) : 1,
          message: `Synthesizing historical tape ${i + 1}/${dates.length}`,
        });
        await this.yieldToBrowser();
      }
      const date = dates[i];
      const dateYear = yearOf(date);
      this.syncSectorWeightsForYear(leadership, dateYear, { emitNews: false });

      if (monthKey(date) !== historyFlow.monthKey) {
        historyFlow = advanceMarketFlowMonth(historyFlow, MARKET_FLOW_CONFIG, { calendarDate: date });
        if (historyFlow.month >= nextRotationMonth) {
          const prevLeaders = leadership.leaders || [];
          leadership.leaders = this.pickWeightedSectorLeaders(
            Math.random,
            leadership.weights,
          );
          leadership.lastRebalanceMonth = historyFlow.month;
          if (!leadership.correctionUntilMonth) leadership.correctionUntilMonth = {};
          const correctionWindow = Math.max(
            1,
            Math.floor(Number(VALUATION_DRIVE_CONFIG.correctionDays || 18) / 21),
          );
          for (const sector of prevLeaders) {
            if (!leadership.leaders.includes(sector)) {
              leadership.correctionUntilMonth[sector] = historyFlow.month + correctionWindow;
            }
          }
          for (const sector of leadership.leaders) {
            delete leadership.correctionUntilMonth[sector];
          }
          nextRotationMonth =
            historyFlow.month + Math.max(1, Number(SECTOR_LEADERSHIP_CONFIG.intervalMonths || 3));
          leadership.nextRebalanceMonth = nextRotationMonth;
        }
        this.updateValuationExpectations(leadership, historyFlow, date, {
          force: true,
          emitNews: false,
        });
        for (const symbol of this.state.assetList) {
          const asset = this.state.assets[symbol];
          const quarter = this.getQuarterFinancialSnapshot(
            asset.financials,
            financialCursor[symbol],
            date,
          );
          microStates[symbol] = this.buildAssetMicroState(
            asset,
            historyFlow,
            date,
            leadership,
            microStates[symbol],
            quarter,
          );
        }
      }

      const sectorBias = this.buildMacroSectorBias(historyFlow, baseBias, leadership.leaders);
      const dayIndex = i - dates.length + 1;

      for (const symbol of this.state.assetList) {
        const asset = this.state.assets[symbol];
        const microState =
          microStates[symbol] ||
          this.buildAssetMicroState(
            asset,
            historyFlow,
            date,
            leadership,
            null,
            this.getQuarterFinancialSnapshot(asset.financials, financialCursor[symbol], date),
          );
        const context = this.buildAssetSessionContext({
          asset,
          flowState: historyFlow,
          isoDate: date,
          dayIndex: i,
          leadership,
          sectorBiasMap: sectorBias,
          microState,
        });
        const plan = this.createSessionPlan(asset, context);
        if (!plan) continue;
        asset.candles.push({
          t: dayIndex * SESSION_MINUTES,
          day: dayIndex,
          date,
          minute: 0,
          open: plan.summary.open,
          high: plan.summary.high,
          low: plan.summary.low,
          close: plan.summary.close,
          volume: plan.summary.volume,
          vwap: plan.summary.vwap,
          event: null,
          session: packSessionBlueprint(plan.blueprint),
        });
        packedCandles[symbol].push([
          roundPrice(plan.summary.open),
          roundPrice(plan.summary.high),
          roundPrice(plan.summary.low),
          roundPrice(plan.summary.close),
          Math.max(1, Math.floor(plan.summary.volume)),
          roundPrice(plan.summary.vwap),
          packSessionBlueprint(plan.blueprint),
        ]);
        asset.micro = microState;
        this.applySessionStateTransition(asset, context, plan.summary);
      }
    }
    for (const symbol of this.state.assetList) {
      this.applyMicroSurface(this.state.assets[symbol]);
    }
    const assetSnapshots = Object.fromEntries(
      this.state.assetList.map((symbol) => {
        const asset = this.state.assets[symbol];
        return [
          symbol,
          {
            price: roundPrice(asset.price),
            prevClose: roundPrice(asset.prevClose),
            anchor: roundPrice(asset.anchor),
            historyMean: roundPrice(asset.historyMean),
            trend: roundPrice(asset.trend, 8),
            swingState: roundPrice(asset.swingState, 8),
            borrow: roundPrice(asset.borrow, 8),
            lastVolume: Math.max(0, Math.floor(asset.lastVolume || 0)),
            squeezeMeter: roundPrice(asset.squeezeMeter || 0, 4),
            micro: asset.micro || null,
          },
        ];
      }),
    );
    return {
      flow: historyFlow,
      leadership,
      cache: {
        version: BOOTSTRAP_CACHE_VERSION,
        startDate: MARKET_FLOW_CONFIG.financialStartDate,
        endDate,
        dates,
        candles: packedCandles,
        assets: assetSnapshots,
        flow: historyFlow,
        leadership,
      },
    };
  }

  async resetState(emit = true) {
    const next = this.createInitialState();
    this.state = next;
    this.setBootState(
      {
        active: true,
        progress: 0.02,
        message: "Preparing simulation shell",
      },
      emit,
    );
    await this.yieldToBrowser();

    const holidaySet = new Set(next.marketHolidays || []);
    next.calendarDate = normalizeStartDate(
      MARKET_FLOW_CONFIG.startDate || next.calendarDate,
      holidaySet,
    );
    next.scenario = this.pickScenario();
    next.scenario.baseSectorBias = { ...next.scenario.sectorBias };
    next.assets = {};
    next.assetList = ASSET_BLUEPRINTS.map((asset) => asset.symbol);
    next.sectorLeadership = this.createSectorLeadershipState(yearOf(next.calendarDate));
    next.eventSchedule = Math.floor(rand(16, 40));
    next.marketMinute = 0;
    next.day = 1;

    const historyDate = previousOpenDate(next.calendarDate, holidaySet);

    for (const bp of ASSET_BLUEPRINTS) {
      const asset = this.createAsset(bp);
      next.assets[bp.symbol] = asset;
    }
    this.setBootState(
      {
        progress: 0.1,
        message: "Building market state and asset universe",
      },
      emit,
    );
    await this.yieldToBrowser();

    this.setBootState(
      {
        progress: 0.14,
        message: "Loading cached historical tape",
      },
      emit,
    );
    let historyResult = this.hydrateBootstrapCache(this.loadBootstrapCache());
    if (!historyResult) {
      this.setBootState(
        {
          progress: 0.16,
          message: "Synthesizing market history 2016-01 to 2026-01",
        },
        emit,
      );
      await this.yieldToBrowser();
      historyResult = await this.seedHistoricalYears(
        MARKET_FLOW_CONFIG.historyYears || 10,
        historyDate,
        holidaySet,
        ({ progress, message }) => {
          this.setBootState(
            {
              progress: 0.16 + progress * 0.6,
              message,
            },
            true,
          );
        },
      );
      if (historyResult?.cache) this.saveBootstrapCache(historyResult.cache);
    } else {
      this.setBootState(
        {
          progress: 0.74,
          message: "Restoring cached state",
        },
        emit,
      );
      await this.yieldToBrowser();
    }
    for (const symbol of next.assetList) {
      const asset = next.assets[symbol];
      if (!asset.candles.length) {
        this.seedHistory(asset, 240, historyDate);
      }
    }

    if (historyResult?.leadership) {
      next.sectorLeadership = historyResult.leadership;
    }
    next.macroFlow = historyResult?.flow || createMarketFlowState(MARKET_FLOW_CONFIG, next.calendarDate);
    next.macroFlow = {
      ...next.macroFlow,
      calendarDate: next.calendarDate,
      monthKey: monthKey(next.calendarDate),
    };
    this.syncSectorWeightsForYear(next.sectorLeadership, yearOf(next.calendarDate), {
      emitNews: false,
    });
    this.rebalanceSectorLeadership(next.macroFlow.month, { force: true, emitNews: false });
    this.applyMacroFlowToScenario(next.macroFlow);
    this.updateValuationExpectations(
      next.sectorLeadership,
      next.macroFlow,
      next.calendarDate,
      { force: true, emitNews: false },
    );
    this.syncMicroEconomy(next.macroFlow, next.calendarDate, {
      force: true,
      emitNews: false,
    });
    this.setBootState(
      {
        progress: 0.86,
        message: "Synchronizing macro, micro, and valuation layers",
      },
      emit,
    );
    await this.yieldToBrowser();

    for (const symbol of next.assetList) {
      const asset = next.assets[symbol];
      const priceFloor = this.getAssetPriceFloor(asset);
      const priceCeiling = this.getAssetPriceCeiling(asset);
      if (!Number.isFinite(asset.price) || asset.price <= 0 || asset.price > priceCeiling) {
        asset.price = clamp(Number(asset.basePrice || 50), priceFloor, priceCeiling);
      }
      asset.price = clamp(asset.price, priceFloor, priceCeiling);
      asset.prevClose = asset.price;
      asset.open = asset.price;
      asset.high = asset.price;
      asset.low = asset.price;
      asset.close = asset.price;
      asset.anchor = clamp(
        Number(asset.anchor || asset.price),
        priceFloor,
        priceCeiling,
      );
      asset.historyMean = clamp(
        Number(asset.historyMean || asset.price),
        priceFloor,
        priceCeiling,
      );
      asset.trend = clamp(Number(asset.trend || 0), -0.022, 0.022);
      asset.swingState = clamp(Number(asset.swingState || 0), -0.06, 0.06);
      asset.dayPV = 0;
      asset.dayVol = 0;
      asset.intradayNoise = 0;
      asset.intradayDeviation = 0;
      asset.intradayPulse = 0;
      asset.intradayPulseLife = 0;
      asset.intradayPhase = rand(0, Math.PI * 2);
    }
    this.setBootState(
      {
        progress: 0.94,
        message: "Preparing first live session",
      },
      emit,
    );
    this.prepareSessionPlansForDate(next.calendarDate, next.day);
    await this.yieldToBrowser();

    this.addNews(
      {
        scope: "System",
        severity: "blue",
        headline: `Scenario Loaded: ${next.scenario.title}`,
        body: next.scenario.desc,
      },
      false,
      false,
    );
    if (next.sectorLeadership?.leaders?.length) {
      const leadNames = next.sectorLeadership.leaders
        .map((sector) => SECTORS[sector]?.name || sector)
        .join(" / ");
      this.addNews(
        {
          scope: "Macro",
          severity: "blue",
          headline: "Sector Leadership Initialized",
          body: `Current lead sectors: ${leadNames}.`,
        },
        false,
        false,
      );
    }
    this.addNews(buildMarketFlowNews(next.macroFlow), false, false);
    this.addNews(
      {
        scope: "System",
        severity: "warn",
        headline: "Market Open",
        body: "Volatility is elevated. Leverage discipline matters from the first minute.",
      },
      false,
      false,
    );
    this.setBootState(
      {
        active: false,
        progress: 1,
        message: "Simulation ready",
      },
      emit,
    );
    if (emit) this.requestRender(true);
  }

  maintenanceRate(leverage) {
    return clamp(0.42 / leverage, 0.08, 0.35);
  }

  getUsedMargin() {
    return Object.values(this.state.positions).reduce(
      (sum, pos) => sum + pos.margin,
      0,
    );
  }

  getUnrealizedPnl(pos) {
    const asset = this.state.assets[pos.symbol];
    return (asset.price - pos.avg) * pos.qty;
  }

  getEquity() {
    return (
      this.state.cash +
      Object.values(this.state.positions).reduce(
        (sum, pos) => sum + pos.margin + this.getUnrealizedPnl(pos),
        0,
      )
    );
  }

  getGrossNotional() {
    return Object.values(this.state.positions).reduce(
      (sum, pos) =>
        sum + Math.abs(pos.qty * this.state.assets[pos.symbol].price),
      0,
    );
  }

  getMaintenanceRequirement() {
    return Object.values(this.state.positions).reduce((sum, pos) => {
      const notional = Math.abs(pos.qty * this.state.assets[pos.symbol].price);
      return sum + notional * this.maintenanceRate(pos.leverage);
    }, 0);
  }

  getMarginHealth() {
    const requirement = this.getMaintenanceRequirement();
    if (requirement <= 0) return 999;
    return this.getEquity() / requirement;
  }

  getCurrentPosition(symbol = this.state.selected) {
    return this.state.positions[symbol] || null;
  }

  commission(qty) {
    return Math.max(1, 0.004 * Math.abs(qty) + 0.8);
  }

  slippage(asset, side, qty = 0) {
    const spread = asset.price * (asset.spreadBps / 10000) * 0.62;
    const sizeImpact =
      asset.price * (Math.abs(qty) / Math.max(1500, asset.liquidity * 45)) * 0.006;
    const trendImpact = asset.price * Math.abs(asset.trend) * 0.22;
    return (spread + sizeImpact + trendImpact) * (side === "buy" ? 1 : -1);
  }

  addToast(kind, title, text, emit = true) {
    const id = `toast-${Date.now()}-${this.toastSeq++}`;
    this.state.toasts.unshift({ id, kind, title, text });
    this.state.toasts = this.state.toasts.slice(0, 8);
    if (emit) this.requestRender(true);

    const timer = setTimeout(() => {
      this.state.toasts = this.state.toasts.filter((toast) => toast.id !== id);
      this.toastTimers.delete(id);
      this.requestRender(true);
    }, 3200);
    this.toastTimers.set(id, timer);
  }

  dismissToast(id) {
    const timer = this.toastTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.toastTimers.delete(id);
    }
    this.state.toasts = this.state.toasts.filter((toast) => toast.id !== id);
    this.requestRender(true);
  }

  currentTimeLabel(minuteOfDay = this.state.marketMinute, date = this.state.calendarDate) {
    return timeLabel(this.state.day, minuteOfDay, date);
  }

  getHolidaySet() {
    return new Set(this.state.marketHolidays || []);
  }

  isMarketClosed(isoDate) {
    return isMarketClosedDate(isoDate, this.getHolidaySet());
  }

  createSectorLeadershipState(startYear = null) {
    const initialScores = this.createInitialWeightScores();
    const intervalYears = Math.max(1, Number(SECTOR_LEADERSHIP_CONFIG.weightUpdateYears || 1));
    const normalizedStartYear = Number.isFinite(startYear) ? startYear : null;
    return {
      leaders: [],
      lastRebalanceMonth: -1,
      nextRebalanceMonth: 0,
      correctionUntilMonth: {},
      weightScores: initialScores,
      weights: this.softmaxSectorWeights(initialScores),
      leaderPersistence: this.createSectorMap(0),
      valuationExpectations: null,
      lastExpectationMonthKey: null,
      lastWeightYear: normalizedStartYear,
      nextWeightYear:
        normalizedStartYear == null ? null : normalizedStartYear + intervalYears,
    };
  }

  rebalanceSectorLeadership(currentMonth, { force = false, emitNews = true } = {}) {
    if (!this.state.sectorLeadership) {
      this.state.sectorLeadership = this.createSectorLeadershipState(
        yearOf(this.state.calendarDate),
      );
    }
    const leadership = this.state.sectorLeadership;
    this.syncSectorWeightsForYear(leadership, yearOf(this.state.calendarDate), { emitNews });
    if (!force && currentMonth < leadership.nextRebalanceMonth) return false;

    const prevLeaders = leadership.leaders || [];
    const leaders = this.pickWeightedSectorLeaders(Math.random, leadership.weights);
    leadership.leaders = leaders;
    leadership.lastRebalanceMonth = currentMonth;
    leadership.nextRebalanceMonth =
      currentMonth + Math.max(1, Number(SECTOR_LEADERSHIP_CONFIG.intervalMonths || 3));
    if (!leadership.correctionUntilMonth) leadership.correctionUntilMonth = {};
    const correctionWindow = Math.max(1, Math.floor(Number(VALUATION_DRIVE_CONFIG.correctionDays || 18) / 21));
    for (const sector of prevLeaders) {
      if (!leaders.includes(sector)) {
        leadership.correctionUntilMonth[sector] = currentMonth + correctionWindow;
      }
    }
    for (const sector of leaders) {
      delete leadership.correctionUntilMonth[sector];
    }

    if (emitNews && leaders.length) {
      const leadNames = leaders.map((sector) => SECTORS[sector]?.name || sector).join(" / ");
      this.addNews(
        {
          scope: "Macro",
          severity: "blue",
          headline: `Sector Leadership Rotation (${currentMonth}M)`,
          body: `Top sectors for the next 3 months: ${leadNames}.`,
        },
        false,
        false,
      );
    }
    return true;
  }

  applyMacroFlowToScenario(flowState) {
    if (!flowState || !this.state.scenario) return;
    this.state.scenario.regime = {
      ...this.state.scenario.regime,
      name: flowState.regime.name,
      drift: flowState.regime.drift,
      vol: flowState.regime.vol,
    };
    this.state.scenario.tag = flowState.regime.tag || flowState.regime.name;

    const baseBias = this.state.scenario.baseSectorBias || this.state.scenario.sectorBias;
    const leaders = this.state.sectorLeadership?.leaders || [];
    this.state.scenario.sectorBias = this.buildMacroSectorBias(flowState, baseBias, leaders);
  }

  maybeAdvanceMacroMonth(targetDate) {
    if (!this.state.macroFlow) return;
    const nextMonthKey = monthKey(targetDate);
    if (nextMonthKey === this.state.macroFlow.monthKey) return;

    this.state.macroFlow = advanceMarketFlowMonth(this.state.macroFlow, MARKET_FLOW_CONFIG, {
      calendarDate: targetDate,
    });
    this.syncSectorWeightsForYear(
      this.state.sectorLeadership,
      yearOf(targetDate),
      { emitNews: true },
    );
    this.rebalanceSectorLeadership(this.state.macroFlow.month, { force: false, emitNews: true });
    this.applyMacroFlowToScenario(this.state.macroFlow);
    this.updateValuationExpectations(
      this.state.sectorLeadership,
      this.state.macroFlow,
      targetDate,
      { force: true, emitNews: false },
    );
    this.syncMicroEconomy(this.state.macroFlow, targetDate, {
      force: true,
      emitNews: true,
    });
    this.addNews(buildMarketFlowNews(this.state.macroFlow), false, false);
  }

  maybeGenerateClosedMarketShock(closedDate) {
    const flow = this.state.macroFlow;
    if (!flow) return;
    const externalPressure = Math.max(0, Number(flow.factors.X || 0));
    const financialStress = Math.max(0, Number(flow.factors.F || 0));
    const shockProbability = clamp(
      0.012 + externalPressure * 0.065 + financialStress * 0.034,
      0.01,
      0.44,
    );
    if (Math.random() > shockProbability) return;

    const driftShock = clamp(
      0.0005 + externalPressure * 0.00045 + financialStress * 0.00022,
      0.0005,
      0.0032,
    );
    const volShock = clamp(0.1 + externalPressure * 0.11 + financialStress * 0.08, 0.1, 0.58);

    this.applyEventEffect({
      kind: "global",
      drift: -driftShock,
      vol: volShock,
      duration: Math.floor(rand(20, 54)),
    });

    const venue = isWeekend(closedDate) ? "Weekend" : "Holiday";
    this.addNews(
      {
        scope: "Macro",
        severity: "bad",
        headline: `${venue} External Shock`,
        body: `${closedDate} closed-session headline spikes risk premium before next open.`,
      },
      false,
      false,
    );
  }

  advanceToNextSessionDate() {
    let candidate = addCalendarDays(this.state.calendarDate, 1);
    for (let guard = 0; guard < 380; guard += 1) {
      this.state.calendarDate = candidate;
      this.maybeAdvanceMacroMonth(candidate);
      if (!this.isMarketClosed(candidate)) return;
      this.maybeGenerateClosedMarketShock(candidate);
      candidate = addCalendarDays(candidate, 1);
    }
  }

  addNews(evt, autoSlow = true, emit = true) {
    const item = {
      id: Math.random().toString(36).slice(2),
      day: this.state.day,
      date: this.state.calendarDate,
      minute: this.state.marketMinute,
      time: this.currentTimeLabel(),
      scope: evt.scope,
      severity: evt.severity || "blue",
      headline: evt.headline,
      body: evt.body || "",
      symbol: evt.symbol || null,
      direction: evt.direction || 0,
    };
    this.state.news.unshift(item);
    this.state.news = this.state.news.slice(0, 60);

    if (evt.symbol && evt.direction) {
      this.state.reactionWindows.push({
        symbol: evt.symbol,
        direction: evt.direction,
        expiresDay: this.state.day,
        expiresMinute: Math.min(SESSION_MINUTES - 1, this.state.marketMinute + 20),
        used: false,
      });
    }

    if (
      autoSlow &&
      this.state.autoSlow &&
      this.state.speed > 1 &&
      ["good", "bad", "warn"].includes(item.severity)
    ) {
      this.state.autoSlowRestore = this.state.speed;
      this.state.speed = item.severity === "warn" ? 4 : 1;
      this.state.autoSlowUntil = {
        day: this.state.day,
        minute: Math.min(SESSION_MINUTES - 1, this.state.marketMinute + 12),
      };
      this.addToast("warn", "AUTO SLOW", item.headline, false);
    }

    if (emit) this.requestRender(true);
  }

  maybeEndAutoSlow() {
    const slowUntil = this.state.autoSlowUntil;
    if (!slowUntil || this.state.autoSlowRestore == null) return;
    if (
      this.state.day > slowUntil.day ||
      (this.state.day === slowUntil.day &&
        this.state.marketMinute >= slowUntil.minute)
    ) {
      this.state.speed = this.state.autoSlowRestore;
      this.state.autoSlowRestore = null;
      this.state.autoSlowUntil = null;
    }
  }

  applyEventEffect(effect) {
    if (effect.kind === "global") {
      this.state.scenario.regime.drift += effect.drift * 0.35;
      for (const symbol of this.state.assetList) {
        this.state.assets[symbol].effects.push({ ...effect });
      }
    } else if (effect.kind === "sector") {
      for (const symbol of this.state.assetList) {
        const asset = this.state.assets[symbol];
        if (asset.sector === effect.sector) asset.effects.push({ ...effect });
      }
    } else if (effect.kind === "symbol") {
      const asset = this.state.assets[effect.symbol];
      asset.effects.push({ ...effect });
      asset.anchor *= 1 + effect.drift * 10;
      if (effect.squeeze) asset.squeezeMeter = clamp(asset.squeezeMeter + 22, 0, 100);
    }
  }

  generateEvent() {
    const scenario = this.state.scenario;
    const eventType = weightedPick([
      { value: "macroBull", weight: scenario.weights.macroBull },
      { value: "macroBear", weight: scenario.weights.macroBear },
      { value: "sectorBull", weight: scenario.weights.sectorBull },
      { value: "sectorBear", weight: scenario.weights.sectorBear },
      { value: "companyBull", weight: scenario.weights.companyBull },
      { value: "companyBear", weight: scenario.weights.companyBear },
      { value: "squeeze", weight: scenario.weights.squeeze },
    ]);

    const sectorKey = randChoice(Object.keys(SECTORS));
    const targetSym = randChoice(this.state.assetList);
    const asset = this.state.assets[targetSym];
    let evt = null;

    const macroBull = [
      ["Fed tone softens", "Risk appetite expands as policy pressure eases."],
      ["Yields fade", "High duration growth names catch a bid."],
      ["Large fund inflows", "Momentum broadens into leading sectors."],
    ];
    const macroBear = [
      ["Hot inflation print", "Valuation compression hits high beta baskets."],
      ["Rate shock headline", "Derisking accelerates across leverage-heavy books."],
      ["Geopolitical stress", "Volatility spikes and liquidity thins quickly."],
    ];
    const sectorBull = {
      AI: ["AI spending beat", "Cloud and AI infrastructure guides higher."],
      SEMI: ["Fab cycle upturn", "Semiconductor utilization trends improve."],
      BIO: ["FDA timeline clarity", "Biotech risk premium compresses."],
      ENR: ["Supply discipline", "Energy pricing expectations improve."],
      CONS: ["Retail demand surprise", "Consumer names see estimate upgrades."],
      MEME: ["Crowd accumulation", "Speculative names receive strong flow."],
    };
    const sectorBear = {
      AI: ["AI regulation concern", "Multiple compression pressures the group."],
      SEMI: ["Memory weakness", "ASP concerns drag semis lower."],
      BIO: ["Trial uncertainty", "Pipeline risk widens dispersion."],
      ENR: ["Commodity fade", "Energy cash-flow assumptions reset lower."],
      CONS: ["Demand softness", "Consumer margin risk returns."],
      MEME: ["Crowding unwind", "Speculative unwind hits crowded names."],
    };
    const companyBull = [
      (a) => [`${a.symbol} guidance raised`, `${a.name} raises near-term outlook.`],
      (a) => [`${a.symbol} strategic deal`, `${a.name} announces a favorable partnership.`],
      (a) => [`${a.symbol} contract win`, `Revenue visibility improves after new contract news.`],
    ];
    const companyBear = [
      (a) => [`${a.symbol} guidance cut risk`, `${a.name} faces estimate downside risk.`],
      (a) => [`${a.symbol} regulatory overhang`, `Uncertainty increases valuation discount.`],
      (a) => [`${a.symbol} launch delay`, `Product timeline concerns pressure sentiment.`],
    ];

    if (eventType === "macroBull") {
      const [headline, body] = randChoice(macroBull);
      evt = {
        scope: "Macro",
        severity: "good",
        headline,
        body,
        effect: { kind: "global", drift: 0.00085, vol: 0.22, duration: 34 },
      };
    } else if (eventType === "macroBear") {
      const [headline, body] = randChoice(macroBear);
      evt = {
        scope: "Macro",
        severity: "bad",
        headline,
        body,
        effect: { kind: "global", drift: -0.001, vol: 0.34, duration: 36 },
      };
    } else if (eventType === "sectorBull") {
      const [headline, body] = sectorBull[sectorKey];
      evt = {
        scope: sectorKey,
        severity: "good",
        headline,
        body,
        effect: {
          kind: "sector",
          sector: sectorKey,
          drift: 0.0013,
          vol: 0.16,
          duration: 28,
        },
      };
    } else if (eventType === "sectorBear") {
      const [headline, body] = sectorBear[sectorKey];
      evt = {
        scope: sectorKey,
        severity: "bad",
        headline,
        body,
        effect: {
          kind: "sector",
          sector: sectorKey,
          drift: -0.0014,
          vol: 0.22,
          duration: 30,
        },
      };
    } else if (eventType === "companyBull") {
      const [headline, body] = randChoice(companyBull)(asset);
      evt = {
        scope: asset.symbol,
        severity: "good",
        headline,
        body,
        symbol: asset.symbol,
        direction: 1,
        effect: {
          kind: "symbol",
          symbol: asset.symbol,
          drift: 0.0022,
          vol: 0.24,
          duration: 38,
        },
      };
    } else if (eventType === "companyBear") {
      const [headline, body] = randChoice(companyBear)(asset);
      evt = {
        scope: asset.symbol,
        severity: "bad",
        headline,
        body,
        symbol: asset.symbol,
        direction: -1,
        effect: {
          kind: "symbol",
          symbol: asset.symbol,
          drift: -0.0024,
          vol: 0.27,
          duration: 40,
        },
      };
    } else {
      const candidates = this.state.assetList
        .map((symbol) => this.state.assets[symbol])
        .sort((a, b) => b.shortInterest - a.shortInterest);
      const target =
        Math.random() < 0.7 ? candidates[0] : randChoice(candidates.slice(0, 4));
      evt = {
        scope: target.symbol,
        severity: "warn",
        headline: `${target.symbol} squeeze trigger`,
        body: `Fast crowd flow hits ${target.name} with elevated short pressure.`,
        symbol: target.symbol,
        direction: 1,
        effect: {
          kind: "symbol",
          symbol: target.symbol,
          drift: 0.0034 + target.shortInterest * 0.01,
          vol: 0.34,
          duration: 22,
          squeeze: true,
        },
      };
    }

    this.applyEventEffect(evt.effect);
    this.addNews(evt, true, false);
    if (evt.effect.kind === "symbol") {
      this.state.assets[evt.effect.symbol].eventMarkers.push({
        day: this.state.day,
        minute: this.state.marketMinute,
        text: evt.headline,
        severity: evt.severity,
      });
    }
    this.state.eventSchedule = Math.floor(rand(16, 42));
  }

  updateEffects(asset) {
    let drift = 0;
    let volBoost = 0;
    asset.effects = asset.effects.filter((effect) => {
      effect.duration -= 1;
      if (effect.duration > 0) {
        drift += effect.drift;
        volBoost += effect.vol;
        return true;
      }
      return false;
    });
    asset.squeezeMeter = clamp(asset.squeezeMeter * 0.97, 0, 100);
    return { drift, volBoost };
  }

  stepAsset(asset) {
    if (!asset?.sessionPlan?.bars?.length) {
      this.prepareSessionPlansForDate(this.state.calendarDate, this.state.day);
    }
    const fx = this.updateEffects(asset);
    const baseBar =
      asset.sessionPlan?.bars?.[
        Math.min(this.state.marketMinute, asset.sessionPlan.bars.length - 1)
      ];
    if (!baseBar) return asset.candles[asset.candles.length - 1] || null;
    const session = asset.sessionPlan;
    const microSurface = asset.micro?.surface || null;
    const microSignals = asset.micro?.signals || null;
    const squeezeBoost =
      asset.squeezeMeter > 0 && asset.shortInterest > 0.2
        ? asset.squeezeMeter * 0.0000018
        : 0;
    const baseMove = Math.log(
      Math.max(0.000001, baseBar.close) / Math.max(0.000001, baseBar.open),
    );
    const upperPct = Math.max(
      0,
      Math.log(
        Math.max(baseBar.high, baseBar.open, baseBar.close) /
          Math.max(baseBar.open, baseBar.close),
      ),
    );
    const lowerPct = Math.max(
      0,
      Math.log(
        Math.min(baseBar.open, baseBar.close) / Math.max(0.000001, baseBar.low),
      ),
    );
    const minuteSigma = clamp(
      session.blueprint.baseSigma *
        (0.86 +
          Math.max(0, Number(microSurface?.volMultiplier || 1) - 1) * 0.24 +
          fx.volBoost * 0.18) +
        Math.abs(baseMove) * 0.32 +
        0.00003,
      0.00005,
      0.0042,
    );
    const open = asset.price;
    const priceFloor = this.getAssetPriceFloor(asset);
    const priceCeiling = this.getAssetPriceCeiling(asset);
    const effectDistortion = clamp(
      fx.drift * 0.18 +
        squeezeBoost +
        randn() * minuteSigma * (0.16 + fx.volBoost * 0.04),
      -minuteSigma * 2.4,
      minuteSigma * 2.4,
    );
    const close = clamp(
      open * Math.exp(clamp(baseMove + effectDistortion, -0.03, 0.03)),
      priceFloor,
      priceCeiling,
    );
    const bodyPct = Math.abs(
      Math.log(Math.max(priceFloor, close) / Math.max(priceFloor, open)),
    );
    const totalRangePct = Math.max(
      bodyPct * 1.16,
      upperPct + lowerPct + minuteSigma * (0.42 + Math.abs(randn()) * 0.24),
    );
    const upperShare = clamp(
      upperPct / Math.max(0.000001, upperPct + lowerPct) + fx.volBoost * 0.02,
      0.16,
      0.84,
    );
    const high = Math.min(
      priceCeiling,
      Math.max(open, close) * Math.exp(totalRangePct * upperShare),
    );
    const low = Math.max(
      priceFloor,
      Math.min(open, close) * Math.exp(-totalRangePct * (1 - upperShare)),
    );
    const volume = Math.floor(
      Math.max(400, baseBar.volume) *
        (1 +
          Math.max(0, Number(microSignals?.revenue || 0)) * 0.06 +
          fx.volBoost * 0.24 +
          asset.squeezeMeter / 90 +
          Math.abs(effectDistortion) * 55 +
          (asset.sector === "MEME" ? 0.28 : 0)),
    );

    asset.price = close;
    asset.close = close;
    asset.high = Math.max(asset.high, high);
    asset.low = Math.min(asset.low, low);
    asset.lastVolume = volume;
    asset.dayPV += close * volume;
    asset.dayVol += volume;
    asset.changePct = ((close / asset.prevClose) - 1) * 100;
    asset.trend = clamp(
      asset.trend * 0.94 +
        Math.log(Math.max(priceFloor, close) / Math.max(priceFloor, open)) * 0.66,
      -0.02,
      0.02,
    );
    asset.intradayDeviation = clamp(
      asset.intradayDeviation * 0.84 +
        Math.log(Math.max(priceFloor, close) / Math.max(priceFloor, open)),
      -0.012,
      0.012,
    );
    asset.spreadBps = clamp(
      (asset.baseSpreadBps || 2) +
        session.blueprint.baseSigma * 1800 +
        Number(microSurface?.spreadBpsAdj || 0) +
        fx.volBoost * 2.6 +
        asset.squeezeMeter / 18 +
        (asset.baseVol || asset.vol) * 100,
      1,
      25,
    );
    asset.liquidity = clamp(
      (asset.baseLiquidity || 60) +
        Number(microSurface?.liquidityAdj || 0) -
        (asset.spreadBps - (asset.baseSpreadBps || 2)) * 2.2,
      12,
      95,
    );

    asset.candles.push({
      t: this.state.day * 10000 + this.state.marketMinute,
      day: this.state.day,
      date: this.state.calendarDate,
      minute: this.state.marketMinute,
      open,
      high,
      low,
      close,
      volume,
      vwap: asset.dayPV / Math.max(1, asset.dayVol),
      event: null,
    });
    if (asset.candles.length > MAX_CANDLE_STORE) asset.candles.shift();
    return asset.candles[asset.candles.length - 1];
  }

  applyHoldingCosts() {
    for (const pos of Object.values(this.state.positions)) {
      if (pos.qty < 0) {
        const asset = this.state.assets[pos.symbol];
        const borrowCost =
          Math.abs(pos.qty * asset.price) * (asset.borrow / 252 / SESSION_MINUTES);
        this.state.cash -= borrowCost;
      }
    }
  }

  recordOrderHistory(entry) {
    this.state.orderHistory.unshift(entry);
    this.state.orderHistory = this.state.orderHistory.slice(0, 140);
  }

  onTradeReaction(symbol, direction) {
    for (const reactionWindow of this.state.reactionWindows) {
      if (reactionWindow.used) continue;
      if (
        reactionWindow.symbol !== symbol ||
        reactionWindow.direction !== direction
      ) {
        continue;
      }
      if (
        this.state.day > reactionWindow.expiresDay ||
        (this.state.day === reactionWindow.expiresDay &&
          this.state.marketMinute > reactionWindow.expiresMinute)
      ) {
        continue;
      }
      reactionWindow.used = true;
      this.addToast(
        "blue",
        "Fast Reaction",
        `${symbol} trade aligned with active news momentum.`,
        false,
      );
      return;
    }
  }

  executeFill(symbol, qtyDelta, leverage, fillPrice, source = "market") {
    if (!qtyDelta) return false;
    const fee = this.commission(qtyDelta);
    const prev = this.state.positions[symbol] || null;
    const prevQty = prev ? prev.qty : 0;
    const prevAvg = prev ? prev.avg : 0;
    const prevMargin = prev ? prev.margin : 0;
    let cashDelta = -fee;
    let realized = 0;
    let newPosition = prev ? { ...prev } : null;

    if (!prev || prevQty === 0 || Math.sign(prevQty) === Math.sign(qtyDelta)) {
      const addMargin = Math.abs(fillPrice * qtyDelta) / leverage;
      if (this.state.cash < addMargin + fee) {
        this.addToast(
          "bad",
          "Order Rejected",
          "Insufficient cash for margin requirement.",
          false,
        );
        this.recordOrderHistory({
          timestamp: this.currentTimeLabel(),
          symbol,
          side: qtyDelta > 0 ? "LONG" : "SHORT",
          qty: Math.abs(qtyDelta),
          leverage,
          type: source.toUpperCase(),
          status: "REJECTED",
          note: "INSUFFICIENT CASH",
        });
        return false;
      }
      cashDelta -= addMargin;
      const newQty = prevQty + qtyDelta;
      const newAvg =
        prevQty === 0
          ? fillPrice
          : (prevAvg * Math.abs(prevQty) + fillPrice * Math.abs(qtyDelta)) /
            Math.abs(newQty);
      const margin = prevMargin + addMargin;
      newPosition = {
        symbol,
        qty: newQty,
        avg: newAvg,
        margin,
        leverage: Math.abs(newQty * newAvg) / Math.max(1, margin),
        createdAt:
          prev && prev.createdAt
            ? prev.createdAt
            : this.currentTimeLabel(),
      };
    } else {
      const closingQtyAbs = Math.min(Math.abs(prevQty), Math.abs(qtyDelta));
      const closingQtySigned = closingQtyAbs * Math.sign(prevQty);
      realized += (fillPrice - prevAvg) * closingQtySigned;
      const releasedMargin = prevMargin * (closingQtyAbs / Math.abs(prevQty));
      cashDelta += releasedMargin + realized;

      const remainingQty = prevQty + qtyDelta;
      if (remainingQty === 0) {
        newPosition = null;
      } else if (Math.sign(remainingQty) === Math.sign(prevQty)) {
        const margin = prevMargin - releasedMargin;
        newPosition = {
          ...prev,
          qty: remainingQty,
          avg: prevAvg,
          margin,
          leverage: Math.abs(remainingQty * prevAvg) / Math.max(1, margin),
        };
      } else {
        const openQty = Math.abs(remainingQty);
        const addMargin = Math.abs(fillPrice * openQty) / leverage;
        if (this.state.cash + cashDelta < addMargin) {
          this.state.cash += cashDelta;
          delete this.state.positions[symbol];
          this.recordOrderHistory({
            timestamp: this.currentTimeLabel(),
            symbol,
            side: qtyDelta > 0 ? "LONG" : "SHORT",
            qty: closingQtyAbs,
            leverage: prev.leverage,
            type: source.toUpperCase(),
            status: "FILLED",
            fillPrice,
            note: "CLOSE ONLY: CASH LIMIT",
          });
          this.addToast("warn", "Close Only Fill", `${symbol} reversed size clipped.`, false);
          return true;
        }
        cashDelta -= addMargin;
        newPosition = {
          symbol,
          qty: remainingQty,
          avg: fillPrice,
          margin: addMargin,
          leverage,
          createdAt: this.currentTimeLabel(),
        };
      }
    }

    this.state.cash += cashDelta;
    if (newPosition) this.state.positions[symbol] = newPosition;
    else delete this.state.positions[symbol];

    if (prev && prev.qty !== 0 && Math.sign(prev.qty) !== Math.sign(qtyDelta)) {
      this.state.positionHistory.unshift({
        symbol,
        side: prev.qty > 0 ? "LONG" : "SHORT",
        qty: Math.min(Math.abs(prev.qty), Math.abs(qtyDelta)),
        entryAvg: prev.avg,
        exitPrice: fillPrice,
        realized,
        leverage: prev.leverage,
        openedAt: prev.createdAt,
        closedAt: this.currentTimeLabel(),
      });
      this.state.positionHistory = this.state.positionHistory.slice(0, 120);
    }

    this.recordOrderHistory({
      timestamp: this.currentTimeLabel(),
      symbol,
      side: qtyDelta > 0 ? "LONG" : "SHORT",
      qty: Math.abs(qtyDelta),
      leverage,
      type: source.toUpperCase(),
      status: "FILLED",
      fillPrice,
      note: realized ? `REALIZED ${fmtMoney(realized)}` : "",
    });

    this.onTradeReaction(symbol, qtyDelta > 0 ? 1 : -1);
    this.addToast(
      realized >= 0 ? "good" : "bad",
      `${symbol} ${qtyDelta > 0 ? "BUY/LONG" : "SELL/SHORT"} ${Math.abs(qtyDelta)}`,
      `${fmtMoney(fillPrice)}${realized ? ` | Realized ${fmtMoney(realized)}` : ""}`,
      false,
    );
    return true;
  }

  processOpenOrdersForAsset(asset, candle) {
    const remaining = [];
    for (const order of this.state.openOrders) {
      if (order.symbol !== asset.symbol) {
        remaining.push(order);
        continue;
      }
      const shouldFill =
        order.side === "long"
          ? candle.low <= order.limitPrice
          : candle.high >= order.limitPrice;
      if (!shouldFill) {
        remaining.push(order);
        continue;
      }
      const qtyDelta = order.side === "long" ? order.qty : -order.qty;
      const filled = this.executeFill(
        order.symbol,
        qtyDelta,
        order.leverage,
        order.limitPrice,
        "limit",
      );
      if (!filled) remaining.push(order);
    }
    this.state.openOrders = remaining;
  }

  closePosition(symbol, fraction = 1) {
    const pos = this.state.positions[symbol];
    if (!pos) return;
    const qty = Math.max(1, Math.floor(Math.abs(pos.qty) * fraction));
    const qtyDelta = pos.qty > 0 ? -qty : qty;
    const asset = this.state.assets[symbol];
    const fill = asset.price + this.slippage(asset, qtyDelta > 0 ? "buy" : "sell", qty);
    this.executeFill(symbol, qtyDelta, pos.leverage, fill, "market");
    this.requestRender(true);
  }

  forceReduceWorstPosition() {
    const entries = Object.values(this.state.positions).map((pos) => {
      const asset = this.state.assets[pos.symbol];
      return {
        symbol: pos.symbol,
        notional: Math.abs(pos.qty * asset.price),
        pnl: this.getUnrealizedPnl(pos),
      };
    });
    if (!entries.length) return;
    entries.sort((a, b) => b.notional - a.notional || a.pnl - b.pnl);
    this.closePosition(entries[0].symbol, 0.5);
    this.addToast(
      "bad",
      "Forced De-risk",
      `${entries[0].symbol} position reduced by 50% due to margin stress.`,
      false,
    );
  }

  maybeMarginCall() {
    let guard = 0;
    while (this.getMarginHealth() < 1 && Object.keys(this.state.positions).length && guard < 5) {
      this.forceReduceWorstPosition();
      guard += 1;
    }
  }

  finalizeCurrentSession() {
    for (const symbol of this.state.assetList) {
      const asset = this.state.assets[symbol];
      const context = asset.sessionPlan?.context;
      if (!context) continue;
      this.applySessionStateTransition(asset, context, {
        open: asset.open,
        high: asset.high,
        low: asset.low,
        close: asset.close,
        volume: asset.dayVol,
        vwap: asset.dayVol > 0 ? asset.dayPV / Math.max(1, asset.dayVol) : asset.close,
        logReturn: Math.log(
          Math.max(context.priceFloor, asset.close) /
            Math.max(context.priceFloor, asset.open || context.prevClose),
        ),
      });
    }
  }

  nextDay() {
    this.finalizeCurrentSession();
    this.state.marketMinute = 0;
    this.advanceToNextSessionDate();
    this.state.day += 1;
    this.prepareSessionPlansForDate(this.state.calendarDate, this.state.day);
    this.addNews(
      {
        scope: "System",
        severity: "blue",
        headline: `${this.state.calendarDate} Open`,
        body: "Session reset complete. Open orders and positions remain active.",
      },
      false,
      false,
    );
    this.state.eventSchedule = Math.floor(rand(12, 28));
  }

  stepMinute() {
    const selectedAsset = this.state.assets[this.state.selected];
    const prevAggregatedCount = selectedAsset
      ? this.aggregateCandles(selectedAsset, this.state.timeframe).length
      : 0;

    for (const symbol of this.state.assetList) {
      const candle = this.stepAsset(this.state.assets[symbol]);
      this.processOpenOrdersForAsset(this.state.assets[symbol], candle);
    }
    this.applyHoldingCosts();
    this.state.eventSchedule -= 1;
    if (this.state.eventSchedule <= 0) this.generateEvent();
    this.maybeEndAutoSlow();
    this.maybeMarginCall();
    this.state.marketMinute += 1;
    if (this.state.marketMinute >= SESSION_MINUTES) this.nextDay();

    if (!this.state.chartFollowLatest && selectedAsset) {
      const nextAggregatedCount = this.aggregateCandles(selectedAsset, this.state.timeframe).length;
      const deltaBars = Math.max(0, nextAggregatedCount - prevAggregatedCount);
      if (deltaBars > 0) {
        const maxOffset = this.getMaxChartOffset();
        this.state.chartOffset = clamp(
          (this.state.chartOffset || 0) + deltaBars,
          0,
          maxOffset,
        );
      }
    } else if (this.state.chartFollowLatest && this.state.chartOffset !== 0) {
      this.state.chartOffset = 0;
    }

    this.state.needsRender = true;
  }

  frame(ts) {
    if (!this.state.lastFrame) this.state.lastFrame = ts;
    const dt = Math.min(0.25, (ts - this.state.lastFrame) / 1000);
    this.state.lastFrame = ts;

    if (this.state.boot?.active) {
      if (this.state.needsRender) {
        this.state.needsRender = false;
        this.flush();
      }
      return;
    }

    if (!this.state.paused) {
      this.state.accumulator += dt * this.state.baseMinutesPerSecond * this.state.speed;
      while (this.state.accumulator >= 1) {
        this.stepMinute();
        this.state.accumulator -= 1;
      }
    }

    if (this.state.needsRender) {
      this.state.needsRender = false;
      this.flush();
    }
  }

  jumpToNextCatalyst() {
    const before = this.state.news.length;
    let safety = 520;
    while (this.state.news.length === before && safety > 0) {
      this.stepMinute();
      safety -= 1;
    }
    this.requestRender(true);
  }

  aggregateCandles(asset, frame) {
    const source = asset.candles;
    const normalizedFrame = Math.max(1, Math.floor(Number(frame) || 1));
    const effectiveFrame = normalizedFrame === 1440 ? SESSION_MINUTES : normalizedFrame;
    const maxPoints = MAX_CANDLE_STORE;
    if (effectiveFrame === 1) return source.slice(-maxPoints);

    const result = [];
    let bucket = null;
    let bucketIndex = -1;
    for (const candle of source) {
      const absoluteMinute = candle.day * SESSION_MINUTES + candle.minute;
      const index = Math.floor(absoluteMinute / effectiveFrame);
      if (index !== bucketIndex) {
        if (bucket) result.push(bucket);
        bucketIndex = index;
        bucket = { ...candle };
      } else {
        bucket.high = Math.max(bucket.high, candle.high);
        bucket.low = Math.min(bucket.low, candle.low);
        bucket.close = candle.close;
        bucket.day = candle.day;
        bucket.date = candle.date || bucket.date;
        bucket.minute = candle.minute;
        bucket.t = candle.t;
        bucket.volume += candle.volume;
        bucket.vwap = candle.vwap;
        if (candle.event) bucket.event = candle.event;
      }
    }
    if (bucket) result.push(bucket);
    const sliced = result.slice(-maxPoints);
    if (
      effectiveFrame > 1 &&
      sliced.length &&
      this.state.marketMinute > 0 &&
      this.state.marketMinute % effectiveFrame !== 0
    ) {
      const last = sliced[sliced.length - 1];
      const isCurrentSessionBucket =
        Number(last?.day) === Number(this.state.day) && Number(last?.day) >= 0;
      if (isCurrentSessionBucket) sliced.pop();
    }
    return sliced.slice(-maxPoints);
  }

  movingAverage(series, period, accessor = (item) => item.close) {
    const output = [];
    let sum = 0;
    for (let i = 0; i < series.length; i += 1) {
      sum += accessor(series[i]);
      if (i >= period) sum -= accessor(series[i - period]);
      output.push(i >= period - 1 ? sum / period : null);
    }
    return output;
  }

  buildOrderBookPreview(asset) {
    const levels = [];
    const step = Math.max(0.01, (asset.price * asset.spreadBps) / 10000);
    for (let i = 0; i < 5; i += 1) {
      levels.push({
        bid: asset.price - step * (i + 1),
        ask: asset.price + step * (i + 1),
        bidSize: Math.round(200 + asset.liquidity * 9 + Math.random() * 420),
        askSize: Math.round(200 + asset.liquidity * 9 + Math.random() * 420),
      });
    }
    return levels;
  }

  getSectorAverages() {
    const map = {};
    for (const key of Object.keys(SECTORS)) map[key] = [];
    this.state.assetList.forEach((symbol) => {
      map[this.state.assets[symbol].sector].push(this.state.assets[symbol].changePct);
    });
    return Object.fromEntries(
      Object.entries(map).map(([key, arr]) => [
        key,
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0,
      ]),
    );
  }

  newsSector(item) {
    if (item.scope === "Macro" || item.scope === "System") return item.scope;
    if (SECTORS[item.scope]) return item.scope;
    if (item.symbol && this.state.assets[item.symbol]) {
      return this.state.assets[item.symbol].sector;
    }
    if (this.state.assets[item.scope]) return this.state.assets[item.scope].sector;
    return "System";
  }

  setTab(tab) {
    this.state.selectedTab = tab;
    this.requestRender(true);
  }

  setBookTab(tab) {
    this.state.selectedBookTab = tab;
    this.requestRender(true);
  }

  setSpeed(speed) {
    this.state.paused = false;
    this.state.speed = Number(speed);
    this.requestRender(true);
  }

  togglePause() {
    this.state.paused = !this.state.paused;
    this.requestRender(true);
  }

  setSelectedSymbol(symbol) {
    if (!this.state.assets[symbol]) return;
    this.state.selected = symbol;
    this.state.chartOffset = 0;
    this.state.chartFollowLatest = true;
    if (this.state.orderForm.type === "limit") {
      this.state.orderForm.limitPrice = this.state.assets[symbol].price;
    }
    this.requestRender(true);
  }

  toggleWatchlistPinned() {
    this.state.watchlistPinned = !this.state.watchlistPinned;
    this.requestRender(true);
  }

  setTimeframe(timeframe) {
    const parsed = Math.max(1, Math.floor(Number(timeframe) || 1));
    this.state.timeframe = parsed;
    this.state.chartOffset = 0;
    this.state.chartFollowLatest = true;
    this.requestRender(true);
  }

  setChartZoom(zoom) {
    const parsed = Number(zoom);
    if (!Number.isFinite(parsed)) return;
    this.state.chartZoom = clamp(parsed, 0.45, 4);
    this.requestRender(true);
  }

  adjustChartZoom(deltaY) {
    const factor = Math.exp(-deltaY * 0.0016);
    this.setChartZoom((this.state.chartZoom || 1) * factor);
  }

  resetChartZoom() {
    this.state.chartZoom = 1;
    this.requestRender(true);
  }

  setChartScale(scale) {
    if (!["linear", "log"].includes(scale)) return;
    this.state.chartScale = scale;
    this.requestRender(true);
  }

  setChartAutoScale(enabled) {
    this.state.chartAutoScale = !!enabled;
    this.requestRender(true);
  }

  toggleChartIndicator(indicator) {
    if (!indicator) return;
    const prev = this.state.chartIndicators?.[indicator];
    if (!prev) return;
    const next = { ...this.state.chartIndicators };
    next[indicator] = { ...prev, enabled: !(prev.enabled !== false) };
    this.state.chartIndicators = next;
    this.requestRender(true);
  }

  removeChartIndicator(indicator) {
    if (!indicator) return;
    const prev = this.state.chartIndicators?.[indicator];
    if (!prev || prev.enabled === false) return;
    const next = { ...this.state.chartIndicators };
    next[indicator] = { ...prev, enabled: false };
    this.state.chartIndicators = next;
    this.requestRender(true);
  }

  setChartIndicatorEnabled(indicator, enabled) {
    if (!indicator) return;
    const prev = this.state.chartIndicators?.[indicator];
    if (!prev) return;
    const next = { ...this.state.chartIndicators };
    next[indicator] = { ...prev, enabled: !!enabled };
    this.state.chartIndicators = next;
    this.requestRender(true);
  }

  setChartIndicatorPeriod(indicator, period) {
    const prev = this.state.chartIndicators?.[indicator];
    if (!prev) return;
    const parsed = Math.max(2, Math.floor(Number(period) || 2));
    const next = { ...this.state.chartIndicators };
    next[indicator] = { ...prev, period: parsed, enabled: true };
    this.state.chartIndicators = next;
    this.requestRender(true);
  }

  setMacdSettings(settings = {}) {
    const prev = this.state.chartIndicators?.macd;
    if (!prev) return;
    const fast = clamp(Math.floor(Number(settings.fast ?? prev.fast) || prev.fast), 2, 120);
    const slow = clamp(Math.floor(Number(settings.slow ?? prev.slow) || prev.slow), fast + 1, 240);
    const signal = clamp(Math.floor(Number(settings.signal ?? prev.signal) || prev.signal), 2, 120);
    const next = { ...this.state.chartIndicators };
    next.macd = { ...prev, fast, slow, signal, enabled: true };
    this.state.chartIndicators = next;
    this.requestRender(true);
  }

  getMaxChartOffset() {
    const asset = this.state.assets[this.state.selected];
    if (!asset) return 0;
    const data = this.aggregateCandles(asset, this.state.timeframe);
    return Math.max(0, data.length - 24);
  }

  shiftChartOffset(deltaBars) {
    const parsed = Number(deltaBars);
    if (!Number.isFinite(parsed) || parsed === 0) return;
    const maxOffset = this.getMaxChartOffset();
    const prevOffset = this.state.chartOffset || 0;
    const nextOffset = clamp(
      Math.round(prevOffset + parsed),
      0,
      maxOffset,
    );
    const nextFollowLatest = nextOffset === 0;
    if (
      nextOffset === prevOffset &&
      this.state.chartFollowLatest === nextFollowLatest
    ) {
      return;
    }
    this.state.chartOffset = nextOffset;
    this.state.chartFollowLatest = nextFollowLatest;
    this.requestRender(true);
  }

  jumpChartBySessions(sessionDelta) {
    const parsed = Number(sessionDelta);
    if (!Number.isFinite(parsed) || parsed === 0) return;
    const timeframe = Math.max(1, Number(this.state.timeframe) || 1);
    const barsPerSession = Math.max(1, Math.round(SESSION_MINUTES / timeframe));
    this.shiftChartOffset(parsed > 0 ? barsPerSession : -barsPerSession);
  }

  jumpChartToLatest() {
    if (this.state.chartOffset === 0 && this.state.chartFollowLatest) return;
    this.state.chartOffset = 0;
    this.state.chartFollowLatest = true;
    this.requestRender(true);
  }

  setOrderSide(side) {
    if (!["long", "short"].includes(side)) return;
    this.state.orderForm.side = side;
    this.requestRender(true);
  }

  setOrderMarginMode(mode) {
    if (!["cross", "isolated"].includes(mode)) return;
    this.state.orderForm.marginMode = mode;
    this.requestRender(true);
  }

  setOrderType(type) {
    this.state.orderForm.type = type;
    if (type === "limit" && !this.state.orderForm.limitPrice) {
      this.state.orderForm.limitPrice = this.state.assets[this.state.selected].price;
    }
    this.requestRender(true);
  }

  setOrderQty(qty) {
    this.state.orderForm.qty = Math.max(1, Math.floor(Number(qty || 1)));
    this.requestRender(true);
  }

  setOrderLeverage(leverage) {
    this.state.orderForm.leverage = clamp(Number(leverage || 1), 1, 50);
    this.requestRender(true);
  }

  setLimitPrice(price) {
    const parsed = Number(price);
    this.state.orderForm.limitPrice = Number.isFinite(parsed) ? parsed : null;
    this.requestRender(true);
  }

  clearOrderForm() {
    this.state.orderForm = {
      ...DEFAULT_ORDER_FORM,
      limitPrice: this.state.assets[this.state.selected].price,
    };
    this.requestRender(true);
  }

  submitOrder() {
    const symbol = this.state.selected;
    const qty = Math.max(1, Math.floor(Number(this.state.orderForm.qty || 1)));
    const leverage = clamp(Number(this.state.orderForm.leverage || 1), 1, 5);
    const side = this.state.orderForm.side;
    const orderType = this.state.orderForm.type;
    const asset = this.state.assets[symbol];
    const qtyDelta = side === "long" ? qty : -qty;
    const ts = this.currentTimeLabel();

    if (orderType === "market") {
      const fill = asset.price + this.slippage(asset, qtyDelta > 0 ? "buy" : "sell", qty);
      this.executeFill(symbol, qtyDelta, leverage, fill, "market");
      this.requestRender(true);
      return;
    }

    const limitPrice = Number(this.state.orderForm.limitPrice || 0);
    if (!(limitPrice > 0)) {
      this.addToast("bad", "Order Rejected", "Enter a valid limit price.");
      return;
    }

    const order = {
      id: Math.random().toString(36).slice(2),
      symbol,
      side,
      qty,
      leverage,
      type: "limit",
      limitPrice,
      submittedAt: ts,
    };

    const marketable = side === "long" ? limitPrice >= asset.price : limitPrice <= asset.price;
    if (marketable) {
      const fill =
        side === "long"
          ? Math.min(limitPrice, asset.price + Math.max(0, this.slippage(asset, "buy", qty)))
          : Math.max(limitPrice, asset.price + Math.min(0, this.slippage(asset, "sell", qty)));
      this.executeFill(symbol, qtyDelta, leverage, fill, "limit");
    } else {
      this.state.openOrders.unshift(order);
      this.state.openOrders = this.state.openOrders.slice(0, 100);
      this.recordOrderHistory({
        timestamp: ts,
        symbol,
        side: side.toUpperCase(),
        qty,
        leverage,
        type: "LIMIT",
        status: "OPEN",
        fillPrice: null,
        note: `AT ${fmtMoney(limitPrice)}`,
      });
      this.addToast(
        "blue",
        "Limit Order Submitted",
        `${symbol} ${side === "long" ? "LONG" : "SHORT"} ${qty} @ ${fmtMoney(limitPrice)}`,
        false,
      );
    }

    this.requestRender(true);
  }

  cancelOrder(id) {
    const index = this.state.openOrders.findIndex((order) => order.id === id);
    if (index < 0) return;
    const order = this.state.openOrders[index];
    this.state.openOrders.splice(index, 1);
    this.recordOrderHistory({
      timestamp: this.currentTimeLabel(),
      symbol: order.symbol,
      side: order.side.toUpperCase(),
      qty: order.qty,
      leverage: order.leverage,
      type: "LIMIT",
      status: "CANCELLED",
      fillPrice: null,
      note: `AT ${fmtMoney(order.limitPrice)}`,
    });
    this.addToast(
      "warn",
      "Order Cancelled",
      `${order.symbol} ${order.side.toUpperCase()} ${order.qty}`,
      false,
    );
    this.requestRender(true);
  }
}
