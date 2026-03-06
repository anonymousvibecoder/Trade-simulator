// src/simulator/constants.js
var SECTORS = {
  AI: { name: "AI", tone: "blue" },
  SEMI: { name: "Semis", tone: "violet" },
  BIO: { name: "Biotech", tone: "good" },
  ENR: { name: "Energy", tone: "warn" },
  CONS: { name: "Consumer", tone: "neutral" },
  MEME: { name: "Meme", tone: "bad" }
};
var ASSET_BLUEPRINTS = [
  { symbol: "ALP", name: "Alpha Neural", sector: "AI", price: 142, vol: 62e-4, shortInterest: 0.12, borrow: 0.028, beta: 1.32 },
  { symbol: "SYN", name: "Synapse Cloud", sector: "AI", price: 96, vol: 58e-4, shortInterest: 0.09, borrow: 0.022, beta: 1.18 },
  { symbol: "QNT", name: "QuantForge", sector: "SEMI", price: 88, vol: 5e-3, shortInterest: 0.08, borrow: 0.018, beta: 1.14 },
  { symbol: "FAB", name: "FabWorks", sector: "SEMI", price: 62, vol: 56e-4, shortInterest: 0.11, borrow: 0.02, beta: 1.08 },
  { symbol: "BIO", name: "HelixBio", sector: "BIO", price: 54, vol: 0.0108, shortInterest: 0.16, borrow: 0.072, beta: 1.42 },
  { symbol: "CRN", name: "CuraNova", sector: "BIO", price: 31, vol: 0.0134, shortInterest: 0.21, borrow: 0.085, beta: 1.48 },
  { symbol: "ENR", name: "NovaEnergy", sector: "ENR", price: 71, vol: 46e-4, shortInterest: 0.07, borrow: 0.014, beta: 0.95 },
  { symbol: "OIL", name: "TerraDrill", sector: "ENR", price: 44, vol: 52e-4, shortInterest: 0.09, borrow: 0.017, beta: 0.92 },
  { symbol: "RET", name: "UrbanCart", sector: "CONS", price: 39, vol: 56e-4, shortInterest: 0.1, borrow: 0.021, beta: 0.97 },
  { symbol: "PAY", name: "PayFlow", sector: "CONS", price: 51, vol: 53e-4, shortInterest: 0.09, borrow: 0.019, beta: 1.02 },
  { symbol: "MEM", name: "MemeWorks", sector: "MEME", price: 24, vol: 0.0158, shortInterest: 0.33, borrow: 0.18, beta: 1.86 }
];
var SCENARIOS = [
  {
    title: "AI Rotation Rally",
    tag: "Risk-On",
    desc: "AI and semiconductors lead the tape with frequent squeezes and fast mean reversion.",
    regime: { name: "Risk-On", drift: 15e-5, vol: 0.66 },
    sectorBias: { AI: 22e-5, SEMI: 14e-5, BIO: 1e-5, ENR: -4e-5, CONS: 2e-5, MEME: 8e-5 },
    weights: { macroBull: 1.4, macroBear: 0.7, sectorBull: 1.6, sectorBear: 1, companyBull: 1.4, companyBear: 0.9, squeeze: 1.1 }
  },
  {
    title: "Macro Vol Regime",
    tag: "Macro Vol",
    desc: "Rates and inflation headlines drive rotations. Defensive groups outperform high beta names.",
    regime: { name: "Macro Vol", drift: -5e-5, vol: 1.08 },
    sectorBias: { AI: -12e-5, SEMI: -9e-5, BIO: -3e-5, ENR: 18e-5, CONS: -5e-5, MEME: -9e-5 },
    weights: { macroBull: 0.7, macroBear: 1.7, sectorBull: 0.95, sectorBear: 1.3, companyBull: 1, companyBear: 1.15, squeeze: 0.8 }
  },
  {
    title: "Idiosyncratic Vol",
    tag: "Idio Vol",
    desc: "Single name catalysts dominate. Market drift is small but dispersion stays elevated.",
    regime: { name: "Idio Vol", drift: 3e-5, vol: 0.96 },
    sectorBias: { AI: 2e-5, SEMI: 2e-5, BIO: 1e-5, ENR: 0, CONS: 0, MEME: 3e-5 },
    weights: { macroBull: 0.8, macroBear: 0.8, sectorBull: 1, sectorBear: 1, companyBull: 1.5, companyBear: 1.5, squeeze: 1 }
  },
  {
    title: "Gamma Frenzy",
    tag: "Gamma Frenzy",
    desc: "High short-interest names trend hard on crowd positioning and rapid momentum feedback.",
    regime: { name: "Gamma Frenzy", drift: 7e-5, vol: 1.18 },
    sectorBias: { AI: 6e-5, SEMI: 2e-5, BIO: 5e-5, ENR: -2e-5, CONS: 1e-5, MEME: 27e-5 },
    weights: { macroBull: 0.8, macroBear: 0.8, sectorBull: 1.2, sectorBear: 1, companyBull: 1.3, companyBear: 1, squeeze: 2.2 }
  },
  {
    title: "Risk-Off Drift",
    tag: "Risk-Off",
    desc: "Broad risk reduction with occasional panic bursts. Margin discipline is critical.",
    regime: { name: "Risk-Off", drift: -13e-5, vol: 0.93 },
    sectorBias: { AI: -14e-5, SEMI: -11e-5, BIO: -8e-5, ENR: 4e-5, CONS: -4e-5, MEME: -18e-5 },
    weights: { macroBull: 0.9, macroBear: 1.4, sectorBull: 0.9, sectorBear: 1.3, companyBull: 0.9, companyBear: 1.2, squeeze: 1.3 }
  }
];
var DEFAULT_ORDER_FORM = {
  side: "long",
  type: "market",
  marginMode: "cross",
  qty: 25,
  leverage: 2,
  limitPrice: null
};
var MARKET_FLOW_CONFIG = {
  startDate: "2026-01-05",
  holidays: [],
  historyYears: 10,
  financialStartDate: "2016-01-01",
  mean: 0,
  bound: 3.2,
  reversionBand: 2.15,
  sigma: {
    D: 0.34,
    Q: 0.28,
    M: 0.26,
    F: 0.31,
    X: 0.27,
    E: 0.33
  },
  coupling: {
    D: { E: 0.06, F: -0.05, M: -0.04, X: -0.03, Q: 0.02 },
    Q: { X: -0.05, M: -0.03, E: 0.02, D: 0.03 },
    M: { F: 0.07, X: 0.03, D: 0.02, E: -0.04, Q: -0.02 },
    F: { X: 0.08, M: 0.06, E: -0.05, D: -0.03, Q: -0.02 },
    X: { F: 0.08, M: 0.03, E: -0.03, Q: -0.04 },
    E: { D: 0.07, F: -0.06, M: -0.05, X: -0.03, Q: 0.02 }
  },
  initial: {
    D: 0.2,
    Q: 0.1,
    M: 0,
    F: 0,
    X: 0.05,
    E: 0.15
  }
};
var SECTOR_LEADERSHIP_CONFIG = {
  intervalMonths: 3,
  weightUpdateYears: 1,
  weightSigma: 0.22,
  weightMeanReversion: 0.24,
  weightScoreClamp: 2.4,
  topCount: 2,
  // Heuristic fixed weights: tech-first priority.
  heuristicWeights: {
    AI: 1.72,
    SEMI: 1.54,
    BIO: 1.02,
    ENR: 0.92,
    CONS: 0.86,
    MEME: 0.74
  },
  rankBoost: [18e-5, 11e-5],
  nonLeaderDrag: 15e-6
};
var VALUATION_DRIVE_CONFIG = {
  expectationResponse: 0.18,
  weightPremiumScale: 0.12,
  persistencePremiumScale: 0.052,
  nonLeaderDiscountScale: 0.06,
  sentimentScale: 0.05,
  persistenceDecay: 0.93,
  persistenceBump: 1,
  maxPersistence: 42,
  meanReversionNoise: {
    periodMonths: 14,
    octaves: 3,
    persistence: 0.58,
    baseProb: 0.28,
    waveProbScale: 0.16,
    stressBoost: 0.05,
    pullStrength: 0.44,
    waveScale: 0.05
  },
  minMultiplier: 0.48,
  maxMultiplier: 2.35,
  valuationWeights: { per: 0.44, pbr: 0.33, psr: 0.23 },
  gapClamp: 0.85,
  // daily-scale pressure; combine with macro + noise
  valuationScale: 38e-4,
  macroScale: 19e-4,
  trendLeader: [105e-5, 62e-5],
  correctionDrift: 52e-5,
  correctionDays: 63,
  perlin: {
    periodDays: 96,
    octaves: 4,
    persistence: 0.56,
    noiseScale: 135e-5
  }
};

// src/simulator/utils.js
var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
var lerp = (a, b, t) => a + (b - a) * t;
var rand = (a, b) => a + Math.random() * (b - a);
var randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
function randn() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let ticket = Math.random() * total;
  for (const item of items) {
    ticket -= item.weight;
    if (ticket <= 0) return item.value;
  }
  return items[items.length - 1].value;
}
function fmtMoney(value, digits = 2) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}`;
}
function marketClockLabel(minuteOfDay) {
  const total = Math.floor(minuteOfDay);
  const minutes = 570 + total;
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function timeLabel(day, minuteOfDay, calendarDate = null) {
  const clock = marketClockLabel(minuteOfDay);
  if (calendarDate) return `${calendarDate} ${clock}`;
  return `Day ${day} - ${clock}`;
}
function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

// src/simulator/marketFlow.js
var FACTOR_KEYS = ["D", "Q", "M", "F", "X", "E"];
function monthKeyFromDate(calendarDate) {
  if (typeof calendarDate !== "string" || calendarDate.length < 7) return "M0";
  return calendarDate.slice(0, 7);
}
function mapFactors(factory) {
  return Object.fromEntries(FACTOR_KEYS.map((key) => [key, factory(key)]));
}
function emptyFactorMap() {
  return mapFactors(() => 0);
}
function resolveSigma(config, key) {
  const sigma = Number(config?.sigma?.[key]);
  return Number.isFinite(sigma) && sigma > 0 ? sigma : 0.25;
}
function calcResidualBounds(value, sigma, config) {
  const mean = Number(config?.mean ?? 0);
  const bound = Math.max(0.5, Number(config?.bound ?? 3));
  const reversionBand = Math.max(0.25, Number(config?.reversionBand ?? 2));
  const deviation = value - mean;
  const pressure = clamp(deviation / reversionBand, -2.5, 2.5);
  const widthScale = clamp(
    1 - Math.min(0.68, Math.abs(deviation) / (bound * 1.3)),
    0.18,
    1
  );
  const halfRange = sigma * widthScale;
  const centerShift = -pressure * sigma * 0.82;
  let min = -halfRange + centerShift;
  let max = halfRange + centerShift;
  if (min >= max) {
    const center = (min + max) / 2;
    min = center - Math.max(0.02, sigma * 0.05);
    max = center + Math.max(0.02, sigma * 0.05);
  }
  return { min, max };
}
function calcCouplingEffect(key, factors, config) {
  const map = config?.coupling?.[key];
  if (!map) return 0;
  const mean = Number(config?.mean ?? 0);
  let sum = 0;
  for (const [other, weight] of Object.entries(map)) {
    if (!FACTOR_KEYS.includes(other)) continue;
    const w = Number(weight);
    if (!Number.isFinite(w) || w === 0) continue;
    sum += (Number(factors[other]) - mean) * w;
  }
  return sum * 0.16;
}
function deriveMarketAxes(factors) {
  const realEconomy = clamp(
    0.38 * factors.D + 0.3 * factors.Q + 0.26 * factors.E - 0.24 * factors.F - 0.12 * factors.M - 0.08 * factors.X,
    -3.5,
    3.5
  );
  const inflation = clamp(
    0.46 * factors.D - 0.31 * factors.Q + 0.24 * factors.X + 0.16 * factors.E + 0.06 * factors.F,
    -3.5,
    3.5
  );
  const policy = clamp(
    0.58 * factors.M + 0.19 * factors.F + 0.23 * inflation - 0.18 * realEconomy,
    -3.5,
    3.5
  );
  const externalShock = clamp(
    0.7 * factors.X + 0.22 * factors.F + 0.12 * factors.M - 0.2 * factors.E,
    -3.5,
    3.5
  );
  return { realEconomy, inflation, policy, externalShock };
}
function deriveMacroRegime(axes, factors) {
  const riskScore = axes.realEconomy * 0.68 + factors.E * 0.56 - axes.policy * 0.64 - axes.externalShock * 0.58 - factors.F * 0.34;
  const stressScore = Math.max(
    0,
    factors.F * 0.76 + factors.X * 0.8 + axes.policy * 0.52 + Math.abs(axes.inflation) * 0.2
  );
  let name = "Macro Vol";
  if (riskScore > 1.3) name = "Risk-On";
  else if (riskScore > 0.35) name = "Balanced Expansion";
  else if (riskScore > -0.65) name = "Macro Vol";
  else if (riskScore > -1.6) name = "Risk-Off";
  else name = "Stress Regime";
  const drift = clamp(
    43e-6 * riskScore - 28e-6 * axes.policy - 22e-6 * axes.externalShock + 14e-6 * factors.E,
    -24e-5,
    24e-5
  );
  const vol = clamp(
    0.68 + stressScore * 0.23 + Math.abs(axes.inflation) * 0.045,
    0.62,
    1.52
  );
  return {
    name,
    tag: name,
    drift,
    vol,
    riskScore,
    stressScore
  };
}
function createMarketFlowState(config, calendarDate = null) {
  const mean = Number(config?.mean ?? 0);
  const bound = Math.max(0.5, Number(config?.bound ?? 3));
  const factors = mapFactors(
    (key) => clamp(
      Number(config?.initial?.[key] ?? mean),
      mean - bound,
      mean + bound
    )
  );
  const axes = deriveMarketAxes(factors);
  const regime = deriveMacroRegime(axes, factors);
  const state = {
    month: 0,
    monthKey: monthKeyFromDate(calendarDate),
    calendarDate,
    factors,
    residuals: emptyFactorMap(),
    residualBounds: mapFactors(
      (key) => calcResidualBounds(factors[key], resolveSigma(config, key), config)
    ),
    axes,
    regime,
    history: []
  };
  state.history.push({
    month: state.month,
    monthKey: state.monthKey,
    calendarDate: state.calendarDate,
    factors: { ...state.factors },
    axes: { ...state.axes },
    regime: { ...state.regime },
    residuals: { ...state.residuals }
  });
  return state;
}
function advanceMarketFlowMonth(prevState, config, options = {}) {
  const mean = Number(config?.mean ?? 0);
  const bound = Math.max(0.5, Number(config?.bound ?? 3));
  const previousFactors = { ...prevState.factors };
  const residualBounds = {};
  const residuals = {};
  for (const key of FACTOR_KEYS) {
    const sigma = resolveSigma(config, key);
    const bounds = calcResidualBounds(previousFactors[key], sigma, config);
    residualBounds[key] = bounds;
    residuals[key] = rand(bounds.min, bounds.max);
  }
  const nextFactors = {};
  for (const key of FACTOR_KEYS) {
    const couplingEffect = calcCouplingEffect(key, previousFactors, config);
    const value = previousFactors[key] + residuals[key] + couplingEffect;
    nextFactors[key] = clamp(value, mean - bound, mean + bound);
  }
  const axes = deriveMarketAxes(nextFactors);
  const regime = deriveMacroRegime(axes, nextFactors);
  const month = Number(prevState.month || 0) + 1;
  const monthKey2 = monthKeyFromDate(options.calendarDate ?? prevState.calendarDate);
  const next = {
    month,
    monthKey: monthKey2,
    calendarDate: options.calendarDate ?? prevState.calendarDate,
    factors: nextFactors,
    residuals,
    residualBounds,
    axes,
    regime,
    history: [...prevState.history || []]
  };
  next.history.push({
    month,
    monthKey: monthKey2,
    calendarDate: next.calendarDate,
    factors: { ...nextFactors },
    axes: { ...axes },
    regime: { ...regime },
    residuals: { ...residuals }
  });
  if (next.history.length > 160) next.history.shift();
  return next;
}
function fmtSigned(value) {
  if (!Number.isFinite(value)) return "0.00";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}
function buildMarketFlowNews(flowState) {
  const regimeName = flowState?.regime?.name || "Macro Vol";
  let severity = "blue";
  if (regimeName === "Risk-On" || regimeName === "Balanced Expansion") severity = "good";
  else if (regimeName === "Risk-Off" || regimeName === "Stress Regime") severity = "bad";
  else severity = "warn";
  const factors = flowState?.factors || {};
  const axes = flowState?.axes || {};
  return {
    scope: "Macro",
    severity,
    headline: `Macro Flow (${flowState.monthKey}) -> ${regimeName}`,
    body: `D ${fmtSigned(factors.D)}, Q ${fmtSigned(factors.Q)}, M ${fmtSigned(
      factors.M
    )}, F ${fmtSigned(factors.F)}, X ${fmtSigned(factors.X)}, E ${fmtSigned(
      factors.E
    )} | Real ${fmtSigned(axes.realEconomy)}, Infl ${fmtSigned(
      axes.inflation
    )}, Policy ${fmtSigned(axes.policy)}, External ${fmtSigned(
      axes.externalShock
    )}`
  };
}

// src/simulator/microeconomy.js
var MICRO_STATE_LIMIT = 3.2;
var SECTOR_MICRO_PROFILE = {
  AI: {
    demand: 1.28,
    pricing: 1.18,
    financing: 1.14,
    supply: 0.72,
    external: 0.58,
    inventory: 0.62,
    capex: 1.22
  },
  SEMI: {
    demand: 1.02,
    pricing: 0.94,
    financing: 1.02,
    supply: 1.34,
    external: 1.18,
    inventory: 1.28,
    capex: 1.16
  },
  BIO: {
    demand: 0.44,
    pricing: 0.74,
    financing: 1.34,
    supply: 0.34,
    external: 0.32,
    inventory: 0.24,
    capex: 1.08
  },
  ENR: {
    demand: 0.72,
    pricing: 1.08,
    financing: 0.84,
    supply: 0.62,
    external: 1.26,
    inventory: 0.88,
    capex: 0.92
  },
  CONS: {
    demand: 1.18,
    pricing: 0.76,
    financing: 0.78,
    supply: 0.86,
    external: 0.48,
    inventory: 1.18,
    capex: 0.82
  },
  MEME: {
    demand: 0.96,
    pricing: 0.58,
    financing: 1.42,
    supply: 0.22,
    external: 0.42,
    inventory: 0.38,
    capex: 0.52
  }
};
var MICRO_CONFIG = {
  persistence: 0.76,
  residualSigma: 0.18,
  leaderBoost: [0.42, 0.24],
  nonLeaderFade: 0.08,
  priceSurface: {
    driftScale: 16e-5,
    secondaryScale: 6e-5,
    balanceScale: 3e-5,
    volSignalScale: 0.07,
    spreadScale: 1.45,
    liquidityScale: 6.2,
    borrowStressScale: 0.24
  }
};
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
function symbolSeed(symbol) {
  return String(symbol || "").split("").reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
}
function clampMicro(value) {
  return clamp(value, -MICRO_STATE_LIMIT, MICRO_STATE_LIMIT);
}
function getQuarterFcfRatio(quarter) {
  if (!quarter?.revenue) return 0;
  return Number(quarter.freeCashFlow || 0) / Math.max(1, Number(quarter.revenue));
}
function getSectorProfile(sector) {
  return SECTOR_MICRO_PROFILE[sector] || SECTOR_MICRO_PROFILE.CONS;
}
function buildFundamentalBase(asset2, quarter) {
  const revenueYoY = Number.isFinite(quarter?.revenueYoY) ? Number(quarter.revenueYoY) : 0;
  const netMargin = Number(quarter?.netMargin || 0.1);
  const roe = Number(quarter?.roe || 0.14);
  const debtToEquity = Number(quarter?.debtToEquity || 1);
  const fcfRatio = getQuarterFcfRatio(quarter);
  return {
    growth: clamp(revenueYoY * 0.06, -1.4, 1.8),
    margin: clamp((netMargin - 0.1) * 8, -1.5, 1.5),
    leverage: clamp((debtToEquity - 0.8) * 1.1, -1.2, 1.8),
    cashGen: clamp((fcfRatio - 0.08) * 10, -1.4, 1.8),
    quality: clamp((roe - 0.14) * 4 + (Number(asset2.beta || 1) - 1) * 0.25, -1.5, 1.8)
  };
}
function createInitialComponents(asset2, quarter) {
  const profile = getSectorProfile(asset2.sector);
  const base = buildFundamentalBase(asset2, quarter);
  return {
    demand: clampMicro(base.growth * 0.92 + randn() * 0.09),
    pricingPower: clampMicro(base.margin * 0.84 + profile.pricing * 0.12 + randn() * 0.08),
    costPressure: clampMicro(0.18 - base.margin * 0.55 + randn() * 0.08),
    fundingStress: clampMicro(base.leverage * 0.74 - base.cashGen * 0.42 + randn() * 0.09),
    inventoryStress: clampMicro(profile.inventory * 0.1 + randn() * 0.11),
    capexAppetite: clampMicro(base.quality * 0.58 + base.growth * 0.36 + randn() * 0.08),
    laborPressure: clampMicro(base.growth * 0.22 + randn() * 0.06)
  };
}
function buildSignalBundle(components, base, leaderRank) {
  const leaderCarry = leaderRank >= 0 ? leaderRank === 0 ? 0.22 : 0.12 : 0;
  const revenue = clampMicro(
    components.demand * 0.6 + components.pricingPower * 0.22 - components.inventoryStress * 0.18 - components.fundingStress * 0.08 + base.growth * 0.24 + leaderCarry
  );
  const margin = clampMicro(
    components.pricingPower * 0.52 - components.costPressure * 0.44 - components.laborPressure * 0.16 - components.fundingStress * 0.12 + base.margin * 0.24
  );
  const cashFlow = clampMicro(
    revenue * 0.42 + margin * 0.34 - components.capexAppetite * 0.22 - components.inventoryStress * 0.18 + base.cashGen * 0.18
  );
  const balanceSheet = clampMicro(
    cashFlow * 0.22 - components.fundingStress * 0.76 - base.leverage * 0.22 + base.cashGen * 0.18
  );
  const earnings = clampMicro(
    revenue * 0.46 + margin * 0.34 + cashFlow * 0.12 + balanceSheet * 0.08 + leaderCarry
  );
  return { revenue, margin, cashFlow, balanceSheet, earnings };
}
function buildSurface(signals, components) {
  const cfg = MICRO_CONFIG.priceSurface;
  return {
    drift: signals.earnings * cfg.driftScale + signals.revenue * cfg.secondaryScale + signals.balanceSheet * cfg.balanceScale,
    volMultiplier: clamp(
      1 + Math.max(0, components.costPressure) * cfg.volSignalScale + Math.max(0, components.fundingStress) * (cfg.volSignalScale + 0.04) + Math.abs(signals.revenue) * 0.045,
      0.82,
      1.95
    ),
    spreadBpsAdj: clamp(
      Math.max(0, components.fundingStress) * cfg.spreadScale + Math.max(0, components.inventoryStress) * 0.85 - Math.max(0, signals.balanceSheet) * 0.8,
      -2,
      8
    ),
    liquidityAdj: clamp(
      signals.balanceSheet * cfg.liquidityScale - components.fundingStress * 6 - components.inventoryStress * 2.6,
      -24,
      18
    ),
    borrowMult: clamp(
      1 + Math.max(0, components.fundingStress) * cfg.borrowStressScale + Math.max(0, -signals.earnings) * 0.1,
      0.82,
      2.6
    )
  };
}
function buildRegimeLabel(signals, components) {
  if (signals.earnings > 0.95 && signals.margin > 0.55) return "Operating Leverage";
  if (components.fundingStress > 0.95) return "Funding Strain";
  if (components.inventoryStress > 0.9) return "Inventory Drag";
  if (signals.revenue > 0.7) return "Demand Expansion";
  if (signals.earnings < -0.8 && signals.balanceSheet < -0.45) return "Earnings Reset";
  return "Balanced";
}
function evolveAssetMicroState({
  asset: asset2,
  quarter,
  flowState,
  leadership,
  calendarDate,
  previousState = null
}) {
  const profile = getSectorProfile(asset2.sector);
  const base = buildFundamentalBase(asset2, quarter);
  const leaderRank = leadership?.leaders?.indexOf(asset2.sector) ?? -1;
  const leaderBoost = leaderRank >= 0 ? MICRO_CONFIG.leaderBoost[Math.min(leaderRank, MICRO_CONFIG.leaderBoost.length - 1)] || 0 : -MICRO_CONFIG.nonLeaderFade;
  const month = Number(flowState?.month || 0);
  const seed = symbolSeed(asset2.symbol);
  const factors = flowState?.factors || {};
  const axes = flowState?.axes || {};
  const prevComponents = previousState?.components || createInitialComponents(asset2, quarter);
  const persistence = MICRO_CONFIG.persistence;
  const residualSigma = MICRO_CONFIG.residualSigma;
  const noise = (offset, scale = 0.18, octaves = 3) => perlin1D(month / 6.5 + seed * 13e-4 + offset, seed + offset * 19, octaves, 0.56) * scale;
  const target = {
    demand: clampMicro(
      base.growth * 0.78 + Number(factors.D || 0) * (0.44 + profile.demand * 0.14) + Number(factors.E || 0) * (0.28 + profile.demand * 0.12) - Number(factors.M || 0) * 0.16 * profile.financing - Number(factors.F || 0) * 0.24 * profile.financing - Number(factors.X || 0) * 0.14 * profile.external + leaderBoost + noise(1, 0.22)
    ),
    pricingPower: clampMicro(
      base.margin * 0.72 + Number(factors.E || 0) * 0.22 * profile.pricing + Number(factors.D || 0) * 0.12 * profile.pricing - Math.max(0, Number(axes.inflation || 0)) * 0.1 + leaderBoost * 0.55 + noise(2, 0.16)
    ),
    costPressure: clampMicro(
      Math.max(0, Number(axes.inflation || 0)) * (0.28 + (1.2 - profile.pricing) * 0.08) + Math.max(0, Number(factors.X || 0)) * 0.2 * profile.external + Math.max(0, Number(factors.D || 0) - Number(factors.Q || 0)) * 0.18 * profile.inventory - Number(factors.Q || 0) * 0.12 * profile.supply - base.margin * 0.14 + noise(3, 0.18)
    ),
    fundingStress: clampMicro(
      base.leverage * 0.72 - base.cashGen * 0.24 + Number(factors.M || 0) * 0.36 * profile.financing + Number(factors.F || 0) * 0.5 * profile.financing - Number(factors.E || 0) * 0.16 + noise(4, 0.16)
    ),
    inventoryStress: clampMicro(
      (Number(factors.D || 0) - Number(factors.Q || 0)) * 0.24 * profile.inventory + Number(factors.X || 0) * 0.16 * profile.external - base.growth * 0.12 + noise(5, 0.18)
    ),
    capexAppetite: clampMicro(
      base.quality * 0.46 + base.growth * 0.24 + Number(factors.E || 0) * 0.18 * profile.capex + leaderBoost * 0.42 - Number(factors.M || 0) * 0.24 * profile.financing - Number(factors.F || 0) * 0.2 * profile.financing + noise(6, 0.16)
    ),
    laborPressure: clampMicro(
      Number(axes.realEconomy || 0) * 0.14 + Number(factors.D || 0) * 0.18 - Number(factors.Q || 0) * 0.1 + Number(factors.E || 0) * 0.08 + noise(7, 0.12)
    )
  };
  const components = {};
  for (const [key, targetValue] of Object.entries(target)) {
    const prev = Number(prevComponents[key] || 0);
    components[key] = clampMicro(
      prev * persistence + targetValue * (1 - persistence) + randn() * residualSigma
    );
  }
  const signals = buildSignalBundle(components, base, leaderRank);
  const surface = buildSurface(signals, components);
  return {
    updatedAt: calendarDate,
    monthKey: typeof calendarDate === "string" && calendarDate.length >= 7 ? calendarDate.slice(0, 7) : null,
    base,
    components,
    signals,
    surface,
    regime: buildRegimeLabel(signals, components)
  };
}

// src/simulator/financials.generated.js
var FINANCIAL_STATEMENTS = {
  "ALP": {
    "symbol": "ALP",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 1963.23,
        "operatingIncome": 483.97,
        "netIncome": 333.41,
        "eps": 0.3809,
        "assets": 3996.45,
        "liabilities": 1126.01,
        "equity": 2870.43,
        "freeCashFlow": 286.45,
        "dividendPerShare": 0.0434,
        "per": 33.78,
        "pbr": 3.92,
        "dividendYield": 34e-4,
        "roe": 0.4646,
        "debtToEquity": 0.3923,
        "netMargin": 0.1698,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 2067.56,
        "operatingIncome": 498.96,
        "netIncome": 349.56,
        "eps": 0.3993,
        "assets": 4035.06,
        "liabilities": 1084.91,
        "equity": 2950.16,
        "freeCashFlow": 268.67,
        "dividendPerShare": 0.0386,
        "per": 38.94,
        "pbr": 4.61,
        "dividendYield": 25e-4,
        "roe": 0.474,
        "debtToEquity": 0.3677,
        "netMargin": 0.1691,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 2137.68,
        "operatingIncome": 522.2,
        "netIncome": 353.38,
        "eps": 0.4037,
        "assets": 4147.36,
        "liabilities": 1269.27,
        "equity": 2878.09,
        "freeCashFlow": 368.09,
        "dividendPerShare": 0.0396,
        "per": 42.66,
        "pbr": 5.24,
        "dividendYield": 23e-4,
        "roe": 0.4911,
        "debtToEquity": 0.441,
        "netMargin": 0.1653,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 2364.16,
        "operatingIncome": 595.8,
        "netIncome": 370.43,
        "eps": 0.4231,
        "assets": 4206.04,
        "liabilities": 1385.49,
        "equity": 2820.55,
        "freeCashFlow": 245.27,
        "dividendPerShare": 0.0355,
        "per": 37.49,
        "pbr": 4.92,
        "dividendYield": 22e-4,
        "roe": 0.5253,
        "debtToEquity": 0.4912,
        "netMargin": 0.1567,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 2476.17,
        "operatingIncome": 615.49,
        "netIncome": 396.29,
        "eps": 0.4527,
        "assets": 4343.04,
        "liabilities": 1396.51,
        "equity": 2946.53,
        "freeCashFlow": 415.75,
        "dividendPerShare": 0.0381,
        "per": 37.12,
        "pbr": 4.99,
        "dividendYield": 23e-4,
        "roe": 0.538,
        "debtToEquity": 0.4739,
        "netMargin": 0.16,
        "revenueYoY": 0.2613
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 2684.53,
        "operatingIncome": 705.23,
        "netIncome": 484.57,
        "eps": 0.5535,
        "assets": 4424.28,
        "liabilities": 1419.91,
        "equity": 3004.37,
        "freeCashFlow": 307.8,
        "dividendPerShare": 0.0458,
        "per": 33.92,
        "pbr": 5.47,
        "dividendYield": 24e-4,
        "roe": 0.6452,
        "debtToEquity": 0.4726,
        "netMargin": 0.1805,
        "revenueYoY": 0.2984
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 2827.1,
        "operatingIncome": 682.6,
        "netIncome": 485.91,
        "eps": 0.5551,
        "assets": 4494.3,
        "liabilities": 1340.51,
        "equity": 3153.79,
        "freeCashFlow": 512.42,
        "dividendPerShare": 0.0402,
        "per": 39.36,
        "pbr": 6.06,
        "dividendYield": 18e-4,
        "roe": 0.6163,
        "debtToEquity": 0.425,
        "netMargin": 0.1719,
        "revenueYoY": 0.3225
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 3159.34,
        "operatingIncome": 795.43,
        "netIncome": 545.98,
        "eps": 0.6237,
        "assets": 4595,
        "liabilities": 1377.39,
        "equity": 3217.6,
        "freeCashFlow": 379.58,
        "dividendPerShare": 0.0433,
        "per": 38.47,
        "pbr": 6.53,
        "dividendYield": 18e-4,
        "roe": 0.6787,
        "debtToEquity": 0.4281,
        "netMargin": 0.1728,
        "revenueYoY": 0.3363
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 3155.65,
        "operatingIncome": 774.57,
        "netIncome": 530.14,
        "eps": 0.6056,
        "assets": 4666.33,
        "liabilities": 1427.49,
        "equity": 3238.84,
        "freeCashFlow": 533.13,
        "dividendPerShare": 0.0379,
        "per": 37.71,
        "pbr": 6.17,
        "dividendYield": 17e-4,
        "roe": 0.6547,
        "debtToEquity": 0.4407,
        "netMargin": 0.168,
        "revenueYoY": 0.2744
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 3425.74,
        "operatingIncome": 815.15,
        "netIncome": 605.9,
        "eps": 0.6921,
        "assets": 4794.52,
        "liabilities": 1443.01,
        "equity": 3351.51,
        "freeCashFlow": 398.57,
        "dividendPerShare": 0.0337,
        "per": 33.44,
        "pbr": 6.04,
        "dividendYield": 15e-4,
        "roe": 0.7231,
        "debtToEquity": 0.4306,
        "netMargin": 0.1769,
        "revenueYoY": 0.2761
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 3571.31,
        "operatingIncome": 862.22,
        "netIncome": 604.77,
        "eps": 0.6908,
        "assets": 4859.58,
        "liabilities": 1509.6,
        "equity": 3349.99,
        "freeCashFlow": 622.34,
        "dividendPerShare": 0.0442,
        "per": 34.63,
        "pbr": 6.25,
        "dividendYield": 18e-4,
        "roe": 0.7221,
        "debtToEquity": 0.4506,
        "netMargin": 0.1693,
        "revenueYoY": 0.2632
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 3934,
        "operatingIncome": 943.68,
        "netIncome": 633.14,
        "eps": 0.7232,
        "assets": 4952.57,
        "liabilities": 1534.84,
        "equity": 3417.73,
        "freeCashFlow": 391.43,
        "dividendPerShare": 0.0394,
        "per": 36.51,
        "pbr": 6.76,
        "dividendYield": 15e-4,
        "roe": 0.741,
        "debtToEquity": 0.4491,
        "netMargin": 0.1609,
        "revenueYoY": 0.2452
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 4027.72,
        "operatingIncome": 981.88,
        "netIncome": 599.27,
        "eps": 0.6846,
        "assets": 5054.16,
        "liabilities": 1496.16,
        "equity": 3557.99,
        "freeCashFlow": 496.65,
        "dividendPerShare": 0.0403,
        "per": 41.96,
        "pbr": 7.07,
        "dividendYield": 14e-4,
        "roe": 0.6737,
        "debtToEquity": 0.4205,
        "netMargin": 0.1488,
        "revenueYoY": 0.2764
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 4343.27,
        "operatingIncome": 1010.62,
        "netIncome": 734.89,
        "eps": 0.8395,
        "assets": 5101.32,
        "liabilities": 1409.8,
        "equity": 3691.52,
        "freeCashFlow": 507.33,
        "dividendPerShare": 0.0452,
        "per": 41.73,
        "pbr": 8.31,
        "dividendYield": 13e-4,
        "roe": 0.7963,
        "debtToEquity": 0.3819,
        "netMargin": 0.1692,
        "revenueYoY": 0.2678
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 4496.33,
        "operatingIncome": 1081.27,
        "netIncome": 716.53,
        "eps": 0.8185,
        "assets": 5268.49,
        "liabilities": 1417.37,
        "equity": 3851.12,
        "freeCashFlow": 505.97,
        "dividendPerShare": 0.0434,
        "per": 39.47,
        "pbr": 7.34,
        "dividendYield": 13e-4,
        "roe": 0.7442,
        "debtToEquity": 0.368,
        "netMargin": 0.1594,
        "revenueYoY": 0.259
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 4921.34,
        "operatingIncome": 1181.72,
        "netIncome": 852.09,
        "eps": 0.9734,
        "assets": 5471.82,
        "liabilities": 1508.16,
        "equity": 3963.66,
        "freeCashFlow": 884.47,
        "dividendPerShare": 0.0372,
        "per": 38.86,
        "pbr": 8.35,
        "dividendYield": 1e-3,
        "roe": 0.8599,
        "debtToEquity": 0.3805,
        "netMargin": 0.1731,
        "revenueYoY": 0.251
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 4988.39,
        "operatingIncome": 1209.08,
        "netIncome": 811.51,
        "eps": 0.927,
        "assets": 5549.81,
        "liabilities": 1414.33,
        "equity": 4135.48,
        "freeCashFlow": 549.82,
        "dividendPerShare": 0.045,
        "per": 31.95,
        "pbr": 6.27,
        "dividendYield": 15e-4,
        "roe": 0.7849,
        "debtToEquity": 0.342,
        "netMargin": 0.1627,
        "revenueYoY": 0.2385
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 5255.05,
        "operatingIncome": 1229.78,
        "netIncome": 976.81,
        "eps": 1.1158,
        "assets": 5631.92,
        "liabilities": 1377.64,
        "equity": 4254.27,
        "freeCashFlow": 671.44,
        "dividendPerShare": 0.043,
        "per": 40.1,
        "pbr": 9.21,
        "dividendYield": 1e-3,
        "roe": 0.9184,
        "debtToEquity": 0.3238,
        "netMargin": 0.1859,
        "revenueYoY": 0.2099
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 5412.78,
        "operatingIncome": 1165.18,
        "netIncome": 864.28,
        "eps": 0.9873,
        "assets": 5673.07,
        "liabilities": 1468.54,
        "equity": 4204.53,
        "freeCashFlow": 653.66,
        "dividendPerShare": 0.0464,
        "per": 34.83,
        "pbr": 7.16,
        "dividendYield": 13e-4,
        "roe": 0.8222,
        "debtToEquity": 0.3493,
        "netMargin": 0.1597,
        "revenueYoY": 0.2038
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 5893.75,
        "operatingIncome": 1377.51,
        "netIncome": 946.28,
        "eps": 1.0809,
        "assets": 5836.72,
        "liabilities": 1491.26,
        "equity": 4345.46,
        "freeCashFlow": 781.33,
        "dividendPerShare": 0.0394,
        "per": 38.9,
        "pbr": 8.47,
        "dividendYield": 9e-4,
        "roe": 0.871,
        "debtToEquity": 0.3432,
        "netMargin": 0.1606,
        "revenueYoY": 0.1976
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 5959.13,
        "operatingIncome": 1358.84,
        "netIncome": 884.72,
        "eps": 1.0106,
        "assets": 5928.68,
        "liabilities": 1527.2,
        "equity": 4401.48,
        "freeCashFlow": 871.48,
        "dividendPerShare": 0.0451,
        "per": 35.57,
        "pbr": 7.15,
        "dividendYield": 13e-4,
        "roe": 0.804,
        "debtToEquity": 0.347,
        "netMargin": 0.1485,
        "revenueYoY": 0.1946
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 6212.8,
        "operatingIncome": 1431.92,
        "netIncome": 968.99,
        "eps": 1.1069,
        "assets": 6092.33,
        "liabilities": 1477.02,
        "equity": 4615.32,
        "freeCashFlow": 677.87,
        "dividendPerShare": 0.0353,
        "per": 43.97,
        "pbr": 9.23,
        "dividendYield": 7e-4,
        "roe": 0.8398,
        "debtToEquity": 0.32,
        "netMargin": 0.156,
        "revenueYoY": 0.1823
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 6325.85,
        "operatingIncome": 1458.36,
        "netIncome": 967.69,
        "eps": 1.1054,
        "assets": 6210.53,
        "liabilities": 1473.09,
        "equity": 4737.44,
        "freeCashFlow": 788.79,
        "dividendPerShare": 0.0382,
        "per": 33.68,
        "pbr": 6.88,
        "dividendYield": 1e-3,
        "roe": 0.8171,
        "debtToEquity": 0.3109,
        "netMargin": 0.153,
        "revenueYoY": 0.1687
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 6594.32,
        "operatingIncome": 1517.38,
        "netIncome": 1082.1,
        "eps": 1.2361,
        "assets": 6339.33,
        "liabilities": 1406.12,
        "equity": 4933.21,
        "freeCashFlow": 1119.51,
        "dividendPerShare": 0.0342,
        "per": 37.12,
        "pbr": 8.14,
        "dividendYield": 7e-4,
        "roe": 0.8774,
        "debtToEquity": 0.285,
        "netMargin": 0.1641,
        "revenueYoY": 0.1189
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 6596.74,
        "operatingIncome": 1614.24,
        "netIncome": 1098.72,
        "eps": 1.2551,
        "assets": 6441.29,
        "liabilities": 1378.42,
        "equity": 5062.87,
        "freeCashFlow": 1130.89,
        "dividendPerShare": 0.0362,
        "per": 40.1,
        "pbr": 8.7,
        "dividendYield": 7e-4,
        "roe": 0.8681,
        "debtToEquity": 0.2723,
        "netMargin": 0.1666,
        "revenueYoY": 0.107
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 6807.22,
        "operatingIncome": 1683.48,
        "netIncome": 1061.71,
        "eps": 1.2128,
        "assets": 6549.99,
        "liabilities": 1337.11,
        "equity": 5212.88,
        "freeCashFlow": 639.58,
        "dividendPerShare": 0.0345,
        "per": 36.21,
        "pbr": 7.37,
        "dividendYield": 8e-4,
        "roe": 0.8147,
        "debtToEquity": 0.2565,
        "netMargin": 0.156,
        "revenueYoY": 0.0957
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 6935.53,
        "operatingIncome": 1673.05,
        "netIncome": 995.65,
        "eps": 1.1373,
        "assets": 6744.8,
        "liabilities": 1382.59,
        "equity": 5362.21,
        "freeCashFlow": 905.78,
        "dividendPerShare": 0.0457,
        "per": 42.09,
        "pbr": 7.82,
        "dividendYield": 1e-3,
        "roe": 0.7427,
        "debtToEquity": 0.2578,
        "netMargin": 0.1436,
        "revenueYoY": 0.0964
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 7529.35,
        "operatingIncome": 1674.86,
        "netIncome": 1119.3,
        "eps": 1.2786,
        "assets": 6837.3,
        "liabilities": 1544.4,
        "equity": 5292.9,
        "freeCashFlow": 932.68,
        "dividendPerShare": 0.0414,
        "per": 32.68,
        "pbr": 6.91,
        "dividendYield": 1e-3,
        "roe": 0.8459,
        "debtToEquity": 0.2918,
        "netMargin": 0.1487,
        "revenueYoY": 0.1418
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 7301.35,
        "operatingIncome": 1672.6,
        "netIncome": 1198.17,
        "eps": 1.3687,
        "assets": 7045.05,
        "liabilities": 1533.77,
        "equity": 5511.28,
        "freeCashFlow": 1228.24,
        "dividendPerShare": 0.0429,
        "per": 35.43,
        "pbr": 7.7,
        "dividendYield": 9e-4,
        "roe": 0.8696,
        "debtToEquity": 0.2783,
        "netMargin": 0.1641,
        "revenueYoY": 0.1068
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 7473.23,
        "operatingIncome": 1832.75,
        "netIncome": 1078.46,
        "eps": 1.2319,
        "assets": 7055.9,
        "liabilities": 1649.19,
        "equity": 5406.71,
        "freeCashFlow": 711.87,
        "dividendPerShare": 0.0412,
        "per": 44.1,
        "pbr": 8.8,
        "dividendYield": 8e-4,
        "roe": 0.7979,
        "debtToEquity": 0.305,
        "netMargin": 0.1443,
        "revenueYoY": 0.0978
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 7225.99,
        "operatingIncome": 1493.74,
        "netIncome": 1072.53,
        "eps": 1.2252,
        "assets": 7116.04,
        "liabilities": 1698.4,
        "equity": 5417.64,
        "freeCashFlow": 872.98,
        "dividendPerShare": 0.0415,
        "per": 35.86,
        "pbr": 7.1,
        "dividendYield": 9e-4,
        "roe": 0.7919,
        "debtToEquity": 0.3135,
        "netMargin": 0.1484,
        "revenueYoY": 0.0419
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 7355.16,
        "operatingIncome": 1621.82,
        "netIncome": 1196.5,
        "eps": 1.3668,
        "assets": 7155.73,
        "liabilities": 1595.8,
        "equity": 5559.93,
        "freeCashFlow": 793.18,
        "dividendPerShare": 0.0343,
        "per": 33.12,
        "pbr": 7.13,
        "dividendYield": 8e-4,
        "roe": 0.8608,
        "debtToEquity": 0.287,
        "netMargin": 0.1627,
        "revenueYoY": -0.0231
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 7004.65,
        "operatingIncome": 1722.91,
        "netIncome": 1114.86,
        "eps": 1.2735,
        "assets": 7245.92,
        "liabilities": 1503.48,
        "equity": 5742.44,
        "freeCashFlow": 1015.56,
        "dividendPerShare": 0.0336,
        "per": 36.8,
        "pbr": 7.14,
        "dividendYield": 7e-4,
        "roe": 0.7766,
        "debtToEquity": 0.2618,
        "netMargin": 0.1592,
        "revenueYoY": -0.0406
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 7192.05,
        "operatingIncome": 1718.69,
        "netIncome": 1136.95,
        "eps": 1.2987,
        "assets": 7383.88,
        "liabilities": 1476.69,
        "equity": 5907.19,
        "freeCashFlow": 889.22,
        "dividendPerShare": 0.0328,
        "per": 33.82,
        "pbr": 6.51,
        "dividendYield": 7e-4,
        "roe": 0.7699,
        "debtToEquity": 0.25,
        "netMargin": 0.1581,
        "revenueYoY": -0.0376
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 7064.61,
        "operatingIncome": 1672.04,
        "netIncome": 1171.53,
        "eps": 1.3382,
        "assets": 7614.52,
        "liabilities": 1485.67,
        "equity": 6128.86,
        "freeCashFlow": 902.13,
        "dividendPerShare": 0.035,
        "per": 38.54,
        "pbr": 7.37,
        "dividendYield": 7e-4,
        "roe": 0.7646,
        "debtToEquity": 0.2424,
        "netMargin": 0.1658,
        "revenueYoY": -0.0223
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 7569.62,
        "operatingIncome": 1728.32,
        "netIncome": 1083.35,
        "eps": 1.2375,
        "assets": 7789.77,
        "liabilities": 1461.82,
        "equity": 6327.95,
        "freeCashFlow": 986.38,
        "dividendPerShare": 0.0349,
        "per": 40.15,
        "pbr": 6.87,
        "dividendYield": 7e-4,
        "roe": 0.6848,
        "debtToEquity": 0.231,
        "netMargin": 0.1431,
        "revenueYoY": 0.0292
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 7352.75,
        "operatingIncome": 1745.42,
        "netIncome": 1077.46,
        "eps": 1.2308,
        "assets": 7946.26,
        "liabilities": 1809.19,
        "equity": 6137.07,
        "freeCashFlow": 1139.06,
        "dividendPerShare": 0.0351,
        "per": 41.46,
        "pbr": 7.28,
        "dividendYield": 7e-4,
        "roe": 0.7023,
        "debtToEquity": 0.2948,
        "netMargin": 0.1465,
        "revenueYoY": 0.0497
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 7401.26,
        "operatingIncome": 1727.6,
        "netIncome": 1083.09,
        "eps": 1.2372,
        "assets": 8278.85,
        "liabilities": 1934.9,
        "equity": 6343.95,
        "freeCashFlow": 802.59,
        "dividendPerShare": 0.0414,
        "per": 46.63,
        "pbr": 7.96,
        "dividendYield": 7e-4,
        "roe": 0.6829,
        "debtToEquity": 0.305,
        "netMargin": 0.1463,
        "revenueYoY": 0.0291
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 7447.53,
        "operatingIncome": 1711.45,
        "netIncome": 1160.42,
        "eps": 1.3256,
        "assets": 8473.97,
        "liabilities": 2045.76,
        "equity": 6428.21,
        "freeCashFlow": 795.28,
        "dividendPerShare": 0.0456,
        "per": 34.83,
        "pbr": 6.29,
        "dividendYield": 1e-3,
        "roe": 0.7221,
        "debtToEquity": 0.3182,
        "netMargin": 0.1558,
        "revenueYoY": 0.0542
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 7904.93,
        "operatingIncome": 1859.62,
        "netIncome": 1215.39,
        "eps": 1.3883,
        "assets": 8707.9,
        "liabilities": 2217.59,
        "equity": 6490.32,
        "freeCashFlow": 894.69,
        "dividendPerShare": 0.046,
        "per": 39.01,
        "pbr": 7.31,
        "dividendYield": 8e-4,
        "roe": 0.749,
        "debtToEquity": 0.3417,
        "netMargin": 0.1538,
        "revenueYoY": 0.0443
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 8532.64,
        "operatingIncome": 2100.93,
        "netIncome": 1406.78,
        "freeCashFlow": 1168.48,
        "dividendPerShare": 0.157,
        "assets": 4206.04,
        "liabilities": 1385.49,
        "equity": 2820.55,
        "per": 37.49,
        "pbr": 4.92,
        "dividendYield": 22e-4,
        "roe": 0.4988,
        "debtToEquity": 0.4912,
        "netMargin": 0.1649
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 11147.14,
        "operatingIncome": 2798.76,
        "netIncome": 1912.74,
        "freeCashFlow": 1615.54,
        "dividendPerShare": 0.1673,
        "assets": 4595,
        "liabilities": 1377.39,
        "equity": 3217.6,
        "per": 38.47,
        "pbr": 6.53,
        "dividendYield": 18e-4,
        "roe": 0.5945,
        "debtToEquity": 0.4281,
        "netMargin": 0.1716
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 14086.7,
        "operatingIncome": 3395.61,
        "netIncome": 2373.95,
        "freeCashFlow": 1945.46,
        "dividendPerShare": 0.1552,
        "assets": 4952.57,
        "liabilities": 1534.84,
        "equity": 3417.73,
        "per": 36.51,
        "pbr": 6.76,
        "dividendYield": 15e-4,
        "roe": 0.6946,
        "debtToEquity": 0.4491,
        "netMargin": 0.1685
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 17788.66,
        "operatingIncome": 4255.5,
        "netIncome": 2902.79,
        "freeCashFlow": 2394.42,
        "dividendPerShare": 0.1662,
        "assets": 5471.82,
        "liabilities": 1508.16,
        "equity": 3963.66,
        "per": 38.86,
        "pbr": 8.35,
        "dividendYield": 1e-3,
        "roe": 0.7324,
        "debtToEquity": 0.3805,
        "netMargin": 0.1632
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 21549.97,
        "operatingIncome": 4981.55,
        "netIncome": 3598.87,
        "freeCashFlow": 2656.25,
        "dividendPerShare": 0.1737,
        "assets": 5836.72,
        "liabilities": 1491.26,
        "equity": 4345.46,
        "per": 38.9,
        "pbr": 8.47,
        "dividendYield": 9e-4,
        "roe": 0.8282,
        "debtToEquity": 0.3432,
        "netMargin": 0.167
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 25092.1,
        "operatingIncome": 5766.49,
        "netIncome": 3903.5,
        "freeCashFlow": 3457.65,
        "dividendPerShare": 0.1528,
        "assets": 6339.33,
        "liabilities": 1406.12,
        "equity": 4933.21,
        "per": 37.12,
        "pbr": 8.14,
        "dividendYield": 7e-4,
        "roe": 0.7913,
        "debtToEquity": 0.285,
        "netMargin": 0.1556
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 27868.85,
        "operatingIncome": 6645.62,
        "netIncome": 4275.38,
        "freeCashFlow": 3608.93,
        "dividendPerShare": 0.1577,
        "assets": 6837.3,
        "liabilities": 1544.4,
        "equity": 5292.9,
        "per": 32.68,
        "pbr": 6.91,
        "dividendYield": 1e-3,
        "roe": 0.8078,
        "debtToEquity": 0.2918,
        "netMargin": 0.1534
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 29355.74,
        "operatingIncome": 6620.91,
        "netIncome": 4545.66,
        "freeCashFlow": 3606.27,
        "dividendPerShare": 0.1599,
        "assets": 7155.73,
        "liabilities": 1595.8,
        "equity": 5559.93,
        "per": 33.12,
        "pbr": 7.13,
        "dividendYield": 8e-4,
        "roe": 0.8176,
        "debtToEquity": 0.287,
        "netMargin": 0.1548
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 28830.94,
        "operatingIncome": 6841.96,
        "netIncome": 4506.7,
        "freeCashFlow": 3793.3,
        "dividendPerShare": 0.1363,
        "assets": 7789.77,
        "liabilities": 1461.82,
        "equity": 6327.95,
        "per": 40.15,
        "pbr": 6.87,
        "dividendYield": 7e-4,
        "roe": 0.7122,
        "debtToEquity": 0.231,
        "netMargin": 0.1563
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 30106.47,
        "operatingIncome": 7044.09,
        "netIncome": 4536.36,
        "freeCashFlow": 3631.61,
        "dividendPerShare": 0.1681,
        "assets": 8707.9,
        "liabilities": 2217.59,
        "equity": 6490.32,
        "per": 39.01,
        "pbr": 7.31,
        "dividendYield": 8e-4,
        "roe": 0.6989,
        "debtToEquity": 0.3417,
        "netMargin": 0.1507
      }
    ]
  },
  "SYN": {
    "symbol": "SYN",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 1467.17,
        "operatingIncome": 289.94,
        "netIncome": 195.9,
        "eps": 0.213,
        "assets": 2984.05,
        "liabilities": 956.06,
        "equity": 2027.99,
        "freeCashFlow": 134.58,
        "dividendPerShare": 0.0308,
        "per": 36.6,
        "pbr": 3.54,
        "dividendYield": 4e-3,
        "roe": 0.3864,
        "debtToEquity": 0.4714,
        "netMargin": 0.1335,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 1553.96,
        "operatingIncome": 363.55,
        "netIncome": 218.31,
        "eps": 0.2373,
        "assets": 2993.06,
        "liabilities": 996.96,
        "equity": 1996.1,
        "freeCashFlow": 160.65,
        "dividendPerShare": 0.0379,
        "per": 32.91,
        "pbr": 3.6,
        "dividendYield": 48e-4,
        "roe": 0.4375,
        "debtToEquity": 0.4995,
        "netMargin": 0.1405,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 1666.13,
        "operatingIncome": 392.83,
        "netIncome": 227.22,
        "eps": 0.247,
        "assets": 2986.12,
        "liabilities": 981.29,
        "equity": 2004.83,
        "freeCashFlow": 239.71,
        "dividendPerShare": 0.0327,
        "per": 36.26,
        "pbr": 4.11,
        "dividendYield": 37e-4,
        "roe": 0.4533,
        "debtToEquity": 0.4895,
        "netMargin": 0.1364,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 1868.89,
        "operatingIncome": 451.82,
        "netIncome": 284.93,
        "eps": 0.3097,
        "assets": 2945.55,
        "liabilities": 950.22,
        "equity": 1995.33,
        "freeCashFlow": 185.55,
        "dividendPerShare": 0.0322,
        "per": 36.08,
        "pbr": 5.15,
        "dividendYield": 29e-4,
        "roe": 0.5712,
        "debtToEquity": 0.4762,
        "netMargin": 0.1525,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 1925.39,
        "operatingIncome": 437.12,
        "netIncome": 270.69,
        "eps": 0.2943,
        "assets": 2981.5,
        "liabilities": 931.07,
        "equity": 2050.43,
        "freeCashFlow": 213.07,
        "dividendPerShare": 0.0289,
        "per": 36.79,
        "pbr": 4.86,
        "dividendYield": 27e-4,
        "roe": 0.5281,
        "debtToEquity": 0.4541,
        "netMargin": 0.1406,
        "revenueYoY": 0.3123
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 2037.98,
        "operatingIncome": 450.85,
        "netIncome": 274.87,
        "eps": 0.2988,
        "assets": 3051.92,
        "liabilities": 944.65,
        "equity": 2107.27,
        "freeCashFlow": 280,
        "dividendPerShare": 0.0383,
        "per": 33.62,
        "pbr": 4.39,
        "dividendYield": 38e-4,
        "roe": 0.5218,
        "debtToEquity": 0.4483,
        "netMargin": 0.1349,
        "revenueYoY": 0.3115
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 2121.16,
        "operatingIncome": 532.24,
        "netIncome": 316.8,
        "eps": 0.3444,
        "assets": 3107.39,
        "liabilities": 943.21,
        "equity": 2164.19,
        "freeCashFlow": 271.07,
        "dividendPerShare": 0.0386,
        "per": 37.1,
        "pbr": 5.43,
        "dividendYield": 3e-3,
        "roe": 0.5855,
        "debtToEquity": 0.4358,
        "netMargin": 0.1494,
        "revenueYoY": 0.2731
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 2365.49,
        "operatingIncome": 551.12,
        "netIncome": 357.4,
        "eps": 0.3885,
        "assets": 3175.66,
        "liabilities": 903.79,
        "equity": 2271.87,
        "freeCashFlow": 285.92,
        "dividendPerShare": 0.034,
        "per": 29.23,
        "pbr": 4.6,
        "dividendYield": 3e-3,
        "roe": 0.6293,
        "debtToEquity": 0.3978,
        "netMargin": 0.1511,
        "revenueYoY": 0.2657
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 2462.11,
        "operatingIncome": 543.39,
        "netIncome": 341.03,
        "eps": 0.3707,
        "assets": 3234.18,
        "liabilities": 934.86,
        "equity": 2299.32,
        "freeCashFlow": 317.55,
        "dividendPerShare": 0.0402,
        "per": 35.99,
        "pbr": 5.34,
        "dividendYield": 3e-3,
        "roe": 0.5933,
        "debtToEquity": 0.4066,
        "netMargin": 0.1385,
        "revenueYoY": 0.2788
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 2683.06,
        "operatingIncome": 548.17,
        "netIncome": 422.42,
        "eps": 0.4592,
        "assets": 3289.2,
        "liabilities": 939.28,
        "equity": 2349.92,
        "freeCashFlow": 460,
        "dividendPerShare": 0.0398,
        "per": 32.82,
        "pbr": 5.9,
        "dividendYield": 26e-4,
        "roe": 0.719,
        "debtToEquity": 0.3997,
        "netMargin": 0.1574,
        "revenueYoY": 0.3165
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 2882.2,
        "operatingIncome": 684.22,
        "netIncome": 427.58,
        "eps": 0.4648,
        "assets": 3304.95,
        "liabilities": 1002.15,
        "equity": 2302.8,
        "freeCashFlow": 442.89,
        "dividendPerShare": 0.0358,
        "per": 35.45,
        "pbr": 6.58,
        "dividendYield": 22e-4,
        "roe": 0.7427,
        "debtToEquity": 0.4352,
        "netMargin": 0.1484,
        "revenueYoY": 0.3588
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 3228.19,
        "operatingIncome": 772.46,
        "netIncome": 458.4,
        "eps": 0.4983,
        "assets": 3310.06,
        "liabilities": 993.57,
        "equity": 2316.48,
        "freeCashFlow": 472.81,
        "dividendPerShare": 0.0365,
        "per": 35.8,
        "pbr": 7.09,
        "dividendYield": 2e-3,
        "roe": 0.7916,
        "debtToEquity": 0.4289,
        "netMargin": 0.142,
        "revenueYoY": 0.3647
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 3308.96,
        "operatingIncome": 768.33,
        "netIncome": 467.29,
        "eps": 0.508,
        "assets": 3331.8,
        "liabilities": 968.48,
        "equity": 2363.32,
        "freeCashFlow": 412.15,
        "dividendPerShare": 0.038,
        "per": 32.38,
        "pbr": 6.4,
        "dividendYield": 23e-4,
        "roe": 0.7909,
        "debtToEquity": 0.4098,
        "netMargin": 0.1412,
        "revenueYoY": 0.344
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 3423.66,
        "operatingIncome": 804.52,
        "netIncome": 545.7,
        "eps": 0.5932,
        "assets": 3351.8,
        "liabilities": 994.3,
        "equity": 2357.5,
        "freeCashFlow": 477.2,
        "dividendPerShare": 0.0368,
        "per": 33.06,
        "pbr": 7.65,
        "dividendYield": 19e-4,
        "roe": 0.9259,
        "debtToEquity": 0.4218,
        "netMargin": 0.1594,
        "revenueYoY": 0.276
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 3473.27,
        "operatingIncome": 718.48,
        "netIncome": 485.47,
        "eps": 0.5278,
        "assets": 3413.97,
        "liabilities": 988.87,
        "equity": 2425.1,
        "freeCashFlow": 519.05,
        "dividendPerShare": 0.0368,
        "per": 34.11,
        "pbr": 6.83,
        "dividendYield": 2e-3,
        "roe": 0.8007,
        "debtToEquity": 0.4078,
        "netMargin": 0.1398,
        "revenueYoY": 0.2051
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 3757.7,
        "operatingIncome": 816.33,
        "netIncome": 532.97,
        "eps": 0.5794,
        "assets": 3507.94,
        "liabilities": 1036.38,
        "equity": 2471.57,
        "freeCashFlow": 561.82,
        "dividendPerShare": 0.034,
        "per": 35.93,
        "pbr": 7.75,
        "dividendYield": 16e-4,
        "roe": 0.8626,
        "debtToEquity": 0.4193,
        "netMargin": 0.1418,
        "revenueYoY": 0.164
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 3671.81,
        "operatingIncome": 845.97,
        "netIncome": 536.81,
        "eps": 0.5836,
        "assets": 3516.08,
        "liabilities": 1080.27,
        "equity": 2435.81,
        "freeCashFlow": 529.56,
        "dividendPerShare": 0.0299,
        "per": 35.45,
        "pbr": 7.81,
        "dividendYield": 14e-4,
        "roe": 0.8815,
        "debtToEquity": 0.4435,
        "netMargin": 0.1462,
        "revenueYoY": 0.1097
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 3896.36,
        "operatingIncome": 852.06,
        "netIncome": 550.13,
        "eps": 0.598,
        "assets": 3547.06,
        "liabilities": 1026.71,
        "equity": 2520.35,
        "freeCashFlow": 529.08,
        "dividendPerShare": 0.0359,
        "per": 39.33,
        "pbr": 8.58,
        "dividendYield": 15e-4,
        "roe": 0.8731,
        "debtToEquity": 0.4074,
        "netMargin": 0.1412,
        "revenueYoY": 0.1381
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 3986.21,
        "operatingIncome": 862.35,
        "netIncome": 540.85,
        "eps": 0.588,
        "assets": 3601.54,
        "liabilities": 1047.41,
        "equity": 2554.14,
        "freeCashFlow": 567.73,
        "dividendPerShare": 0.0343,
        "per": 30.77,
        "pbr": 6.52,
        "dividendYield": 19e-4,
        "roe": 0.847,
        "debtToEquity": 0.4101,
        "netMargin": 0.1357,
        "revenueYoY": 0.1477
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 4289.61,
        "operatingIncome": 984.52,
        "netIncome": 575.04,
        "eps": 0.6251,
        "assets": 3616.57,
        "liabilities": 1038.3,
        "equity": 2578.26,
        "freeCashFlow": 555.32,
        "dividendPerShare": 0.0362,
        "per": 31.95,
        "pbr": 7.13,
        "dividendYield": 18e-4,
        "roe": 0.8921,
        "debtToEquity": 0.4027,
        "netMargin": 0.1341,
        "revenueYoY": 0.1416
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 4295.6,
        "operatingIncome": 904.54,
        "netIncome": 568.23,
        "eps": 0.6177,
        "assets": 3633.11,
        "liabilities": 1037.56,
        "equity": 2595.56,
        "freeCashFlow": 348.17,
        "dividendPerShare": 0.0323,
        "per": 32.88,
        "pbr": 7.2,
        "dividendYield": 16e-4,
        "roe": 0.8757,
        "debtToEquity": 0.3997,
        "netMargin": 0.1323,
        "revenueYoY": 0.1699
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 4412.67,
        "operatingIncome": 969.69,
        "netIncome": 622.11,
        "eps": 0.6763,
        "assets": 3726.36,
        "liabilities": 1118.03,
        "equity": 2608.34,
        "freeCashFlow": 533.46,
        "dividendPerShare": 0.0382,
        "per": 39.09,
        "pbr": 9.32,
        "dividendYield": 14e-4,
        "roe": 0.954,
        "debtToEquity": 0.4286,
        "netMargin": 0.141,
        "revenueYoY": 0.1325
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 4365.16,
        "operatingIncome": 1006.07,
        "netIncome": 621,
        "eps": 0.6751,
        "assets": 3793.06,
        "liabilities": 1114.93,
        "equity": 2678.13,
        "freeCashFlow": 543.16,
        "dividendPerShare": 0.0317,
        "per": 29.5,
        "pbr": 6.84,
        "dividendYield": 16e-4,
        "roe": 0.9275,
        "debtToEquity": 0.4163,
        "netMargin": 0.1423,
        "revenueYoY": 0.0951
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 4679.87,
        "operatingIncome": 1025.67,
        "netIncome": 645.4,
        "eps": 0.7016,
        "assets": 3847.99,
        "liabilities": 1203.93,
        "equity": 2644.06,
        "freeCashFlow": 559.38,
        "dividendPerShare": 0.0406,
        "per": 34.08,
        "pbr": 8.32,
        "dividendYield": 17e-4,
        "roe": 0.9764,
        "debtToEquity": 0.4553,
        "netMargin": 0.1379,
        "revenueYoY": 0.091
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 4595.9,
        "operatingIncome": 901.53,
        "netIncome": 610.1,
        "eps": 0.6632,
        "assets": 3996.71,
        "liabilities": 1306.22,
        "equity": 2690.49,
        "freeCashFlow": 439.75,
        "dividendPerShare": 0.0341,
        "per": 31.46,
        "pbr": 7.13,
        "dividendYield": 16e-4,
        "roe": 0.9071,
        "debtToEquity": 0.4855,
        "netMargin": 0.1327,
        "revenueYoY": 0.0699
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 4600.24,
        "operatingIncome": 918.61,
        "netIncome": 659.35,
        "eps": 0.7168,
        "assets": 4024.07,
        "liabilities": 1339.4,
        "equity": 2684.67,
        "freeCashFlow": 594.4,
        "dividendPerShare": 0.0368,
        "per": 34.92,
        "pbr": 8.58,
        "dividendYield": 15e-4,
        "roe": 0.9824,
        "debtToEquity": 0.4989,
        "netMargin": 0.1433,
        "revenueYoY": 0.0425
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 4567.34,
        "operatingIncome": 890.07,
        "netIncome": 549.85,
        "eps": 0.5977,
        "assets": 4130.83,
        "liabilities": 1383.32,
        "equity": 2747.51,
        "freeCashFlow": 562.1,
        "dividendPerShare": 0.0362,
        "per": 28.21,
        "pbr": 5.65,
        "dividendYield": 21e-4,
        "roe": 0.8005,
        "debtToEquity": 0.5035,
        "netMargin": 0.1204,
        "revenueYoY": 0.0463
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 4629.38,
        "operatingIncome": 922.54,
        "netIncome": 634.38,
        "eps": 0.6896,
        "assets": 4185.42,
        "liabilities": 1332.39,
        "equity": 2853.03,
        "freeCashFlow": 629.14,
        "dividendPerShare": 0.0353,
        "per": 34.4,
        "pbr": 7.65,
        "dividendYield": 15e-4,
        "roe": 0.8894,
        "debtToEquity": 0.467,
        "netMargin": 0.137,
        "revenueYoY": -0.0108
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 4317.44,
        "operatingIncome": 949.53,
        "netIncome": 646.78,
        "eps": 0.7031,
        "assets": 4215.34,
        "liabilities": 1449.43,
        "equity": 2765.9,
        "freeCashFlow": 484.02,
        "dividendPerShare": 0.0383,
        "per": 33.66,
        "pbr": 7.87,
        "dividendYield": 16e-4,
        "roe": 0.9354,
        "debtToEquity": 0.524,
        "netMargin": 0.1498,
        "revenueYoY": -0.0606
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 4470.21,
        "operatingIncome": 873.04,
        "netIncome": 593.92,
        "eps": 0.6456,
        "assets": 4302.65,
        "liabilities": 1498.03,
        "equity": 2804.61,
        "freeCashFlow": 532.93,
        "dividendPerShare": 0.0364,
        "per": 31.36,
        "pbr": 6.64,
        "dividendYield": 18e-4,
        "roe": 0.8471,
        "debtToEquity": 0.5341,
        "netMargin": 0.1329,
        "revenueYoY": -0.0283
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 4501.98,
        "operatingIncome": 897.44,
        "netIncome": 604.46,
        "eps": 0.6571,
        "assets": 4378.47,
        "liabilities": 1598.51,
        "equity": 2779.96,
        "freeCashFlow": 637.27,
        "dividendPerShare": 0.038,
        "per": 34.04,
        "pbr": 7.4,
        "dividendYield": 17e-4,
        "roe": 0.8697,
        "debtToEquity": 0.575,
        "netMargin": 0.1343,
        "revenueYoY": -0.0143
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 4707.13,
        "operatingIncome": 979.66,
        "netIncome": 612.55,
        "eps": 0.6659,
        "assets": 4455.15,
        "liabilities": 1597.16,
        "equity": 2857.99,
        "freeCashFlow": 656.32,
        "dividendPerShare": 0.0303,
        "per": 38.63,
        "pbr": 8.28,
        "dividendYield": 12e-4,
        "roe": 0.8573,
        "debtToEquity": 0.5588,
        "netMargin": 0.1301,
        "revenueYoY": 0.0168
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 4506.64,
        "operatingIncome": 961.51,
        "netIncome": 581.83,
        "eps": 0.6325,
        "assets": 4446.62,
        "liabilities": 1631.32,
        "equity": 2815.3,
        "freeCashFlow": 514.71,
        "dividendPerShare": 0.0318,
        "per": 33.38,
        "pbr": 6.9,
        "dividendYield": 15e-4,
        "roe": 0.8267,
        "debtToEquity": 0.5794,
        "netMargin": 0.1291,
        "revenueYoY": 0.0438
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 4462.07,
        "operatingIncome": 1012.36,
        "netIncome": 679.01,
        "eps": 0.7381,
        "assets": 4571.46,
        "liabilities": 1729.36,
        "equity": 2842.1,
        "freeCashFlow": 458.56,
        "dividendPerShare": 0.029,
        "per": 33.58,
        "pbr": 8.02,
        "dividendYield": 12e-4,
        "roe": 0.9556,
        "debtToEquity": 0.6085,
        "netMargin": 0.1522,
        "revenueYoY": -18e-4
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 4437.71,
        "operatingIncome": 930.26,
        "netIncome": 596.37,
        "eps": 0.6483,
        "assets": 4526.34,
        "liabilities": 1696.69,
        "equity": 2829.65,
        "freeCashFlow": 630.95,
        "dividendPerShare": 0.0337,
        "per": 41.9,
        "pbr": 8.83,
        "dividendYield": 12e-4,
        "roe": 0.843,
        "debtToEquity": 0.5996,
        "netMargin": 0.1344,
        "revenueYoY": -0.0143
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 4594.23,
        "operatingIncome": 943.27,
        "netIncome": 700.77,
        "eps": 0.7618,
        "assets": 4636.33,
        "liabilities": 1772.71,
        "equity": 2863.62,
        "freeCashFlow": 691.29,
        "dividendPerShare": 0.0312,
        "per": 32.25,
        "pbr": 7.89,
        "dividendYield": 13e-4,
        "roe": 0.9789,
        "debtToEquity": 0.619,
        "netMargin": 0.1525,
        "revenueYoY": -0.024
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 4421.58,
        "operatingIncome": 967.87,
        "netIncome": 698.61,
        "eps": 0.7594,
        "assets": 4708.25,
        "liabilities": 1816.05,
        "equity": 2892.2,
        "freeCashFlow": 713.52,
        "dividendPerShare": 0.0412,
        "per": 31.94,
        "pbr": 7.72,
        "dividendYield": 17e-4,
        "roe": 0.9662,
        "debtToEquity": 0.6279,
        "netMargin": 0.158,
        "revenueYoY": -0.0189
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 4544.87,
        "operatingIncome": 968.27,
        "netIncome": 621.95,
        "eps": 0.6761,
        "assets": 4814.61,
        "liabilities": 1843.69,
        "equity": 2970.92,
        "freeCashFlow": 618.87,
        "dividendPerShare": 0.035,
        "per": 29.64,
        "pbr": 6.2,
        "dividendYield": 17e-4,
        "roe": 0.8374,
        "debtToEquity": 0.6206,
        "netMargin": 0.1368,
        "revenueYoY": 0.0186
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 4675.56,
        "operatingIncome": 913.34,
        "netIncome": 624.73,
        "eps": 0.6791,
        "assets": 4822.53,
        "liabilities": 1875.01,
        "equity": 2947.53,
        "freeCashFlow": 654.85,
        "dividendPerShare": 0.0371,
        "per": 28.04,
        "pbr": 5.94,
        "dividendYield": 19e-4,
        "roe": 0.8478,
        "debtToEquity": 0.6361,
        "netMargin": 0.1336,
        "revenueYoY": 0.0536
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 4900.37,
        "operatingIncome": 989.03,
        "netIncome": 681.22,
        "eps": 0.7405,
        "assets": 4906.67,
        "liabilities": 1904.47,
        "equity": 3002.2,
        "freeCashFlow": 739.05,
        "dividendPerShare": 0.0394,
        "per": 30.26,
        "pbr": 6.87,
        "dividendYield": 18e-4,
        "roe": 0.9076,
        "debtToEquity": 0.6344,
        "netMargin": 0.139,
        "revenueYoY": 0.0666
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 6556.15,
        "operatingIncome": 1498.14,
        "netIncome": 926.36,
        "freeCashFlow": 720.49,
        "dividendPerShare": 0.1336,
        "assets": 2945.55,
        "liabilities": 950.22,
        "equity": 1995.33,
        "per": 36.08,
        "pbr": 5.15,
        "dividendYield": 29e-4,
        "roe": 0.4643,
        "debtToEquity": 0.4762,
        "netMargin": 0.1413
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 8450.03,
        "operatingIncome": 1971.33,
        "netIncome": 1219.75,
        "freeCashFlow": 1050.06,
        "dividendPerShare": 0.1398,
        "assets": 3175.66,
        "liabilities": 903.79,
        "equity": 2271.87,
        "per": 29.23,
        "pbr": 4.6,
        "dividendYield": 3e-3,
        "roe": 0.5369,
        "debtToEquity": 0.3978,
        "netMargin": 0.1443
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 11255.56,
        "operatingIncome": 2548.24,
        "netIncome": 1649.44,
        "freeCashFlow": 1693.26,
        "dividendPerShare": 0.1522,
        "assets": 3310.06,
        "liabilities": 993.57,
        "equity": 2316.48,
        "per": 35.8,
        "pbr": 7.09,
        "dividendYield": 2e-3,
        "roe": 0.712,
        "debtToEquity": 0.4289,
        "netMargin": 0.1465
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 13963.59,
        "operatingIncome": 3107.67,
        "netIncome": 2031.44,
        "freeCashFlow": 1970.2,
        "dividendPerShare": 0.1456,
        "assets": 3507.94,
        "liabilities": 1036.38,
        "equity": 2471.57,
        "per": 35.93,
        "pbr": 7.75,
        "dividendYield": 16e-4,
        "roe": 0.8219,
        "debtToEquity": 0.4193,
        "netMargin": 0.1455
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 15843.99,
        "operatingIncome": 3544.9,
        "netIncome": 2202.83,
        "freeCashFlow": 2181.69,
        "dividendPerShare": 0.1363,
        "assets": 3616.57,
        "liabilities": 1038.3,
        "equity": 2578.26,
        "per": 31.95,
        "pbr": 7.13,
        "dividendYield": 18e-4,
        "roe": 0.8544,
        "debtToEquity": 0.4027,
        "netMargin": 0.139
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 17753.29,
        "operatingIncome": 3905.96,
        "netIncome": 2456.75,
        "freeCashFlow": 1984.17,
        "dividendPerShare": 0.1428,
        "assets": 3847.99,
        "liabilities": 1203.93,
        "equity": 2644.06,
        "per": 34.08,
        "pbr": 8.32,
        "dividendYield": 17e-4,
        "roe": 0.9292,
        "debtToEquity": 0.4553,
        "netMargin": 0.1384
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 18392.86,
        "operatingIncome": 3632.76,
        "netIncome": 2453.69,
        "freeCashFlow": 2225.4,
        "dividendPerShare": 0.1423,
        "assets": 4185.42,
        "liabilities": 1332.39,
        "equity": 2853.03,
        "per": 34.4,
        "pbr": 7.65,
        "dividendYield": 15e-4,
        "roe": 0.86,
        "debtToEquity": 0.467,
        "netMargin": 0.1334
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 17996.76,
        "operatingIncome": 3699.67,
        "netIncome": 2457.72,
        "freeCashFlow": 2310.55,
        "dividendPerShare": 0.1431,
        "assets": 4455.15,
        "liabilities": 1597.16,
        "equity": 2857.99,
        "per": 38.63,
        "pbr": 8.28,
        "dividendYield": 12e-4,
        "roe": 0.8599,
        "debtToEquity": 0.5588,
        "netMargin": 0.1366
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 18000.65,
        "operatingIncome": 3847.4,
        "netIncome": 2557.98,
        "freeCashFlow": 2295.51,
        "dividendPerShare": 0.1257,
        "assets": 4636.33,
        "liabilities": 1772.71,
        "equity": 2863.62,
        "per": 32.25,
        "pbr": 7.89,
        "dividendYield": 13e-4,
        "roe": 0.8933,
        "debtToEquity": 0.619,
        "netMargin": 0.1421
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 18542.38,
        "operatingIncome": 3838.51,
        "netIncome": 2626.51,
        "freeCashFlow": 2726.28,
        "dividendPerShare": 0.1527,
        "assets": 4906.67,
        "liabilities": 1904.47,
        "equity": 3002.2,
        "per": 30.26,
        "pbr": 6.87,
        "dividendYield": 18e-4,
        "roe": 0.8749,
        "debtToEquity": 0.6344,
        "netMargin": 0.1416
      }
    ]
  },
  "QNT": {
    "symbol": "QNT",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 2233.42,
        "operatingIncome": 477.4,
        "netIncome": 286.16,
        "eps": 0.4627,
        "assets": 4805.38,
        "liabilities": 1668.06,
        "equity": 3137.32,
        "freeCashFlow": 251.36,
        "dividendPerShare": 0.0622,
        "per": 27.79,
        "pbr": 2.53,
        "dividendYield": 48e-4,
        "roe": 0.3648,
        "debtToEquity": 0.5317,
        "netMargin": 0.1281,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 2321.11,
        "operatingIncome": 447.07,
        "netIncome": 369.18,
        "eps": 0.5969,
        "assets": 4942.22,
        "liabilities": 1730.06,
        "equity": 3212.16,
        "freeCashFlow": 223.64,
        "dividendPerShare": 0.0616,
        "per": 31.65,
        "pbr": 3.64,
        "dividendYield": 33e-4,
        "roe": 0.4597,
        "debtToEquity": 0.5386,
        "netMargin": 0.1591,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 2337.5,
        "operatingIncome": 457.47,
        "netIncome": 339.97,
        "eps": 0.5497,
        "assets": 5081.86,
        "liabilities": 1827.07,
        "equity": 3254.79,
        "freeCashFlow": 300.17,
        "dividendPerShare": 0.0619,
        "per": 25.72,
        "pbr": 2.69,
        "dividendYield": 44e-4,
        "roe": 0.4178,
        "debtToEquity": 0.5613,
        "netMargin": 0.1454,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 2593.48,
        "operatingIncome": 479.93,
        "netIncome": 299.11,
        "eps": 0.4836,
        "assets": 5091.86,
        "liabilities": 1797.95,
        "equity": 3293.92,
        "freeCashFlow": 255.02,
        "dividendPerShare": 0.0537,
        "per": 27.61,
        "pbr": 2.51,
        "dividendYield": 4e-3,
        "roe": 0.3632,
        "debtToEquity": 0.5458,
        "netMargin": 0.1153,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 2533.46,
        "operatingIncome": 505.49,
        "netIncome": 359.03,
        "eps": 0.5805,
        "assets": 5218.27,
        "liabilities": 1848.85,
        "equity": 3369.41,
        "freeCashFlow": 382.08,
        "dividendPerShare": 0.0576,
        "per": 31.95,
        "pbr": 3.4,
        "dividendYield": 31e-4,
        "roe": 0.4262,
        "debtToEquity": 0.5487,
        "netMargin": 0.1417,
        "revenueYoY": 0.1343
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 2639.74,
        "operatingIncome": 471.11,
        "netIncome": 360.02,
        "eps": 0.5821,
        "assets": 5270.3,
        "liabilities": 1895.24,
        "equity": 3375.06,
        "freeCashFlow": 271.51,
        "dividendPerShare": 0.0604,
        "per": 30.14,
        "pbr": 3.21,
        "dividendYield": 34e-4,
        "roe": 0.4267,
        "debtToEquity": 0.5615,
        "netMargin": 0.1364,
        "revenueYoY": 0.1373
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 2734.06,
        "operatingIncome": 584.77,
        "netIncome": 384.83,
        "eps": 0.6222,
        "assets": 5387.67,
        "liabilities": 2024.77,
        "equity": 3362.9,
        "freeCashFlow": 253.02,
        "dividendPerShare": 0.0458,
        "per": 25.79,
        "pbr": 2.95,
        "dividendYield": 29e-4,
        "roe": 0.4577,
        "debtToEquity": 0.6021,
        "netMargin": 0.1408,
        "revenueYoY": 0.1696
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 2980.3,
        "operatingIncome": 650.5,
        "netIncome": 416.01,
        "eps": 0.6726,
        "assets": 5513.73,
        "liabilities": 1996.01,
        "equity": 3517.72,
        "freeCashFlow": 370.18,
        "dividendPerShare": 0.0644,
        "per": 27.81,
        "pbr": 3.29,
        "dividendYield": 34e-4,
        "roe": 0.473,
        "debtToEquity": 0.5674,
        "netMargin": 0.1396,
        "revenueYoY": 0.1492
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 3048.97,
        "operatingIncome": 655.27,
        "netIncome": 424.43,
        "eps": 0.6862,
        "assets": 5609.62,
        "liabilities": 1996.37,
        "equity": 3613.25,
        "freeCashFlow": 271.21,
        "dividendPerShare": 0.0499,
        "per": 27.03,
        "pbr": 3.18,
        "dividendYield": 27e-4,
        "roe": 0.4699,
        "debtToEquity": 0.5525,
        "netMargin": 0.1392,
        "revenueYoY": 0.2035
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 3293.01,
        "operatingIncome": 765.47,
        "netIncome": 403.35,
        "eps": 0.6521,
        "assets": 5681.66,
        "liabilities": 2080.77,
        "equity": 3600.89,
        "freeCashFlow": 273.44,
        "dividendPerShare": 0.056,
        "per": 27.96,
        "pbr": 3.13,
        "dividendYield": 31e-4,
        "roe": 0.4481,
        "debtToEquity": 0.5779,
        "netMargin": 0.1225,
        "revenueYoY": 0.2475
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 3477.89,
        "operatingIncome": 726.48,
        "netIncome": 546.57,
        "eps": 0.8837,
        "assets": 5787.96,
        "liabilities": 1982.9,
        "equity": 3805.06,
        "freeCashFlow": 518.56,
        "dividendPerShare": 0.0525,
        "per": 22.96,
        "pbr": 3.3,
        "dividendYield": 26e-4,
        "roe": 0.5746,
        "debtToEquity": 0.5211,
        "netMargin": 0.1572,
        "revenueYoY": 0.2721
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 3785.72,
        "operatingIncome": 701.78,
        "netIncome": 492,
        "eps": 0.7955,
        "assets": 5945.09,
        "liabilities": 2093.31,
        "equity": 3851.78,
        "freeCashFlow": 491.53,
        "dividendPerShare": 0.0502,
        "per": 30.2,
        "pbr": 3.86,
        "dividendYield": 21e-4,
        "roe": 0.5109,
        "debtToEquity": 0.5435,
        "netMargin": 0.13,
        "revenueYoY": 0.2702
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 3882.42,
        "operatingIncome": 800.68,
        "netIncome": 532.58,
        "eps": 0.8611,
        "assets": 5975.81,
        "liabilities": 2003.23,
        "equity": 3972.58,
        "freeCashFlow": 538.62,
        "dividendPerShare": 0.0597,
        "per": 30.86,
        "pbr": 4.14,
        "dividendYield": 22e-4,
        "roe": 0.5363,
        "debtToEquity": 0.5043,
        "netMargin": 0.1372,
        "revenueYoY": 0.2734
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 3914.08,
        "operatingIncome": 818.93,
        "netIncome": 613.14,
        "eps": 0.9913,
        "assets": 6020.21,
        "liabilities": 1993.19,
        "equity": 4027.02,
        "freeCashFlow": 377.99,
        "dividendPerShare": 0.0621,
        "per": 29.73,
        "pbr": 4.53,
        "dividendYield": 21e-4,
        "roe": 0.609,
        "debtToEquity": 0.495,
        "netMargin": 0.1566,
        "revenueYoY": 0.1886
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 4037.07,
        "operatingIncome": 877.76,
        "netIncome": 579.82,
        "eps": 0.9375,
        "assets": 6133.82,
        "liabilities": 2093.68,
        "equity": 4040.14,
        "freeCashFlow": 504.55,
        "dividendPerShare": 0.0522,
        "per": 26.52,
        "pbr": 3.81,
        "dividendYield": 21e-4,
        "roe": 0.5741,
        "debtToEquity": 0.5182,
        "netMargin": 0.1436,
        "revenueYoY": 0.1608
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 4286.07,
        "operatingIncome": 806.76,
        "netIncome": 550.79,
        "eps": 0.8905,
        "assets": 6305.75,
        "liabilities": 2056.82,
        "equity": 4248.93,
        "freeCashFlow": 439.71,
        "dividendPerShare": 0.0479,
        "per": 28.94,
        "pbr": 3.75,
        "dividendYield": 19e-4,
        "roe": 0.5185,
        "debtToEquity": 0.4841,
        "netMargin": 0.1285,
        "revenueYoY": 0.1322
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 4229.33,
        "operatingIncome": 892.64,
        "netIncome": 593.14,
        "eps": 0.959,
        "assets": 6404.95,
        "liabilities": 2180.23,
        "equity": 4224.71,
        "freeCashFlow": 405.99,
        "dividendPerShare": 0.0533,
        "per": 29.52,
        "pbr": 4.14,
        "dividendYield": 19e-4,
        "roe": 0.5616,
        "debtToEquity": 0.5161,
        "netMargin": 0.1402,
        "revenueYoY": 0.0894
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 4331.88,
        "operatingIncome": 860.12,
        "netIncome": 581.68,
        "eps": 0.9405,
        "assets": 6508.09,
        "liabilities": 2188.39,
        "equity": 4319.7,
        "freeCashFlow": 612.81,
        "dividendPerShare": 0.0466,
        "per": 28.1,
        "pbr": 3.78,
        "dividendYield": 18e-4,
        "roe": 0.5386,
        "debtToEquity": 0.5066,
        "netMargin": 0.1343,
        "revenueYoY": 0.1067
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 4530.18,
        "operatingIncome": 868.72,
        "netIncome": 549.71,
        "eps": 0.8888,
        "assets": 6645.52,
        "liabilities": 2311.22,
        "equity": 4334.3,
        "freeCashFlow": 571.22,
        "dividendPerShare": 0.0633,
        "per": 25.35,
        "pbr": 3.21,
        "dividendYield": 28e-4,
        "roe": 0.5073,
        "debtToEquity": 0.5332,
        "netMargin": 0.1213,
        "revenueYoY": 0.1221
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 4712.59,
        "operatingIncome": 1055.37,
        "netIncome": 477.53,
        "eps": 0.7721,
        "assets": 6744.32,
        "liabilities": 2461.75,
        "equity": 4282.57,
        "freeCashFlow": 434.95,
        "dividendPerShare": 0.0587,
        "per": 28.14,
        "pbr": 3.14,
        "dividendYield": 27e-4,
        "roe": 0.446,
        "debtToEquity": 0.5748,
        "netMargin": 0.1013,
        "revenueYoY": 0.0995
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 4513.43,
        "operatingIncome": 804.49,
        "netIncome": 619.85,
        "eps": 1.0022,
        "assets": 6862.61,
        "liabilities": 2589.4,
        "equity": 4273.21,
        "freeCashFlow": 617.43,
        "dividendPerShare": 0.0593,
        "per": 26,
        "pbr": 3.77,
        "dividendYield": 23e-4,
        "roe": 0.5802,
        "debtToEquity": 0.606,
        "netMargin": 0.1373,
        "revenueYoY": 0.0672
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 4573.65,
        "operatingIncome": 933.05,
        "netIncome": 669.84,
        "eps": 1.083,
        "assets": 6899.05,
        "liabilities": 2594.94,
        "equity": 4304.11,
        "freeCashFlow": 716.81,
        "dividendPerShare": 0.0473,
        "per": 27.57,
        "pbr": 4.29,
        "dividendYield": 16e-4,
        "roe": 0.6225,
        "debtToEquity": 0.6029,
        "netMargin": 0.1465,
        "revenueYoY": 0.0558
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 4621.97,
        "operatingIncome": 885.22,
        "netIncome": 626.3,
        "eps": 1.0126,
        "assets": 6955.24,
        "liabilities": 2654.44,
        "equity": 4300.79,
        "freeCashFlow": 470.46,
        "dividendPerShare": 0.0576,
        "per": 30.01,
        "pbr": 4.37,
        "dividendYield": 19e-4,
        "roe": 0.5825,
        "debtToEquity": 0.6172,
        "netMargin": 0.1355,
        "revenueYoY": 0.0203
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 4839.28,
        "operatingIncome": 1073.83,
        "netIncome": 693.5,
        "eps": 1.1213,
        "assets": 6948.03,
        "liabilities": 2754.47,
        "equity": 4193.56,
        "freeCashFlow": 484.24,
        "dividendPerShare": 0.0527,
        "per": 27.32,
        "pbr": 4.52,
        "dividendYield": 17e-4,
        "roe": 0.6615,
        "debtToEquity": 0.6568,
        "netMargin": 0.1433,
        "revenueYoY": 0.0269
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 4734.59,
        "operatingIncome": 956.79,
        "netIncome": 653.08,
        "eps": 1.0559,
        "assets": 7049.38,
        "liabilities": 2716.29,
        "equity": 4333.09,
        "freeCashFlow": 660.75,
        "dividendPerShare": 0.0631,
        "per": 31.74,
        "pbr": 4.78,
        "dividendYield": 19e-4,
        "roe": 0.6029,
        "debtToEquity": 0.6269,
        "netMargin": 0.1379,
        "revenueYoY": 0.049
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 4709.1,
        "operatingIncome": 1002.85,
        "netIncome": 586.36,
        "eps": 0.948,
        "assets": 7021.93,
        "liabilities": 2669.37,
        "equity": 4352.57,
        "freeCashFlow": 407.43,
        "dividendPerShare": 0.0607,
        "per": 26.45,
        "pbr": 3.56,
        "dividendYield": 24e-4,
        "roe": 0.5389,
        "debtToEquity": 0.6133,
        "netMargin": 0.1245,
        "revenueYoY": 0.0296
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 4722.74,
        "operatingIncome": 954.4,
        "netIncome": 560.01,
        "eps": 0.9054,
        "assets": 7238.45,
        "liabilities": 2816.46,
        "equity": 4421.98,
        "freeCashFlow": 591.84,
        "dividendPerShare": 0.0472,
        "per": 32.38,
        "pbr": 4.1,
        "dividendYield": 16e-4,
        "roe": 0.5066,
        "debtToEquity": 0.6369,
        "netMargin": 0.1186,
        "revenueYoY": 0.0218
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 4900.89,
        "operatingIncome": 963.45,
        "netIncome": 623.33,
        "eps": 1.0078,
        "assets": 7309.73,
        "liabilities": 2721.19,
        "equity": 4588.54,
        "freeCashFlow": 429.96,
        "dividendPerShare": 0.0546,
        "per": 24.83,
        "pbr": 3.37,
        "dividendYield": 22e-4,
        "roe": 0.5434,
        "debtToEquity": 0.593,
        "netMargin": 0.1272,
        "revenueYoY": 0.0127
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 4599.13,
        "operatingIncome": 878.29,
        "netIncome": 567.56,
        "eps": 0.9176,
        "assets": 7318.55,
        "liabilities": 2661.74,
        "equity": 4656.81,
        "freeCashFlow": 380.35,
        "dividendPerShare": 0.0574,
        "per": 29.35,
        "pbr": 3.58,
        "dividendYield": 21e-4,
        "roe": 0.4875,
        "debtToEquity": 0.5716,
        "netMargin": 0.1234,
        "revenueYoY": -0.0286
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 4592.01,
        "operatingIncome": 783.98,
        "netIncome": 613.52,
        "eps": 0.9919,
        "assets": 7316.49,
        "liabilities": 2534.34,
        "equity": 4782.14,
        "freeCashFlow": 634.69,
        "dividendPerShare": 0.0541,
        "per": 26.46,
        "pbr": 3.4,
        "dividendYield": 21e-4,
        "roe": 0.5132,
        "debtToEquity": 0.53,
        "netMargin": 0.1336,
        "revenueYoY": -0.0249
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 4389.23,
        "operatingIncome": 806.3,
        "netIncome": 547.05,
        "eps": 0.8845,
        "assets": 7382.82,
        "liabilities": 2446.3,
        "equity": 4936.52,
        "freeCashFlow": 578.16,
        "dividendPerShare": 0.0613,
        "per": 32.11,
        "pbr": 3.56,
        "dividendYield": 22e-4,
        "roe": 0.4433,
        "debtToEquity": 0.4956,
        "netMargin": 0.1246,
        "revenueYoY": -0.0706
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 4611.26,
        "operatingIncome": 905.85,
        "netIncome": 613.13,
        "eps": 0.9913,
        "assets": 7403.98,
        "liabilities": 2264.91,
        "equity": 5139.08,
        "freeCashFlow": 585.15,
        "dividendPerShare": 0.0556,
        "per": 27.44,
        "pbr": 3.27,
        "dividendYield": 2e-3,
        "roe": 0.4772,
        "debtToEquity": 0.4407,
        "netMargin": 0.133,
        "revenueYoY": -0.0591
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 4206.5,
        "operatingIncome": 802.89,
        "netIncome": 596.51,
        "eps": 0.9645,
        "assets": 7492.75,
        "liabilities": 2264.96,
        "equity": 5227.79,
        "freeCashFlow": 638.3,
        "dividendPerShare": 0.0597,
        "per": 28.01,
        "pbr": 3.2,
        "dividendYield": 22e-4,
        "roe": 0.4564,
        "debtToEquity": 0.4333,
        "netMargin": 0.1418,
        "revenueYoY": -0.0854
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 4221.43,
        "operatingIncome": 867.61,
        "netIncome": 601.22,
        "eps": 0.9721,
        "assets": 7659.91,
        "liabilities": 2187.48,
        "equity": 5472.42,
        "freeCashFlow": 366.64,
        "dividendPerShare": 0.0589,
        "per": 26.54,
        "pbr": 2.92,
        "dividendYield": 23e-4,
        "roe": 0.4395,
        "debtToEquity": 0.3997,
        "netMargin": 0.1424,
        "revenueYoY": -0.0807
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 4139.16,
        "operatingIncome": 800.17,
        "netIncome": 499.44,
        "eps": 0.8075,
        "assets": 7838.93,
        "liabilities": 2255.49,
        "equity": 5583.44,
        "freeCashFlow": 523.64,
        "dividendPerShare": 0.0621,
        "per": 24.4,
        "pbr": 2.18,
        "dividendYield": 32e-4,
        "roe": 0.3578,
        "debtToEquity": 0.404,
        "netMargin": 0.1207,
        "revenueYoY": -0.057
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 4350.34,
        "operatingIncome": 854.92,
        "netIncome": 511.36,
        "eps": 0.8268,
        "assets": 7933.57,
        "liabilities": 2216.93,
        "equity": 5716.64,
        "freeCashFlow": 458.67,
        "dividendPerShare": 0.0512,
        "per": 26.27,
        "pbr": 2.35,
        "dividendYield": 24e-4,
        "roe": 0.3578,
        "debtToEquity": 0.3878,
        "netMargin": 0.1175,
        "revenueYoY": -0.0566
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 4247.08,
        "operatingIncome": 886.32,
        "netIncome": 581.93,
        "eps": 0.9409,
        "assets": 8095.07,
        "liabilities": 2250.56,
        "equity": 5844.51,
        "freeCashFlow": 496.86,
        "dividendPerShare": 0.0613,
        "per": 23.74,
        "pbr": 2.36,
        "dividendYield": 27e-4,
        "roe": 0.3983,
        "debtToEquity": 0.3851,
        "netMargin": 0.137,
        "revenueYoY": 96e-4
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 4309.14,
        "operatingIncome": 707.43,
        "netIncome": 463.64,
        "eps": 0.7496,
        "assets": 8258.34,
        "liabilities": 2175.89,
        "equity": 6082.46,
        "freeCashFlow": 394.55,
        "dividendPerShare": 0.0558,
        "per": 30.78,
        "pbr": 2.35,
        "dividendYield": 24e-4,
        "roe": 0.3049,
        "debtToEquity": 0.3577,
        "netMargin": 0.1076,
        "revenueYoY": 0.0208
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 4346.05,
        "operatingIncome": 913.99,
        "netIncome": 552.51,
        "eps": 0.8933,
        "assets": 8317.23,
        "liabilities": 2226.63,
        "equity": 6090.6,
        "freeCashFlow": 576.74,
        "dividendPerShare": 0.0482,
        "per": 31.28,
        "pbr": 2.84,
        "dividendYield": 17e-4,
        "roe": 0.3629,
        "debtToEquity": 0.3656,
        "netMargin": 0.1271,
        "revenueYoY": 0.05
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 4468.83,
        "operatingIncome": 881.08,
        "netIncome": 540.7,
        "eps": 0.8742,
        "assets": 8435.59,
        "liabilities": 2144.44,
        "equity": 6291.15,
        "freeCashFlow": 553.15,
        "dividendPerShare": 0.0582,
        "per": 29.61,
        "pbr": 2.54,
        "dividendYield": 22e-4,
        "roe": 0.3438,
        "debtToEquity": 0.3409,
        "netMargin": 0.121,
        "revenueYoY": 0.0272
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 9485.51,
        "operatingIncome": 1861.87,
        "netIncome": 1294.41,
        "freeCashFlow": 1030.2,
        "dividendPerShare": 0.2393,
        "assets": 5091.86,
        "liabilities": 1797.95,
        "equity": 3293.92,
        "per": 27.61,
        "pbr": 2.51,
        "dividendYield": 4e-3,
        "roe": 0.393,
        "debtToEquity": 0.5458,
        "netMargin": 0.1365
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 10887.55,
        "operatingIncome": 2211.86,
        "netIncome": 1519.89,
        "freeCashFlow": 1276.79,
        "dividendPerShare": 0.2282,
        "assets": 5513.73,
        "liabilities": 1996.01,
        "equity": 3517.72,
        "per": 27.81,
        "pbr": 3.29,
        "dividendYield": 34e-4,
        "roe": 0.4321,
        "debtToEquity": 0.5674,
        "netMargin": 0.1396
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 13605.59,
        "operatingIncome": 2849.01,
        "netIncome": 1866.36,
        "freeCashFlow": 1554.73,
        "dividendPerShare": 0.2087,
        "assets": 5945.09,
        "liabilities": 2093.31,
        "equity": 3851.78,
        "per": 30.2,
        "pbr": 3.86,
        "dividendYield": 21e-4,
        "roe": 0.4845,
        "debtToEquity": 0.5435,
        "netMargin": 0.1372
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 16119.65,
        "operatingIncome": 3304.13,
        "netIncome": 2276.33,
        "freeCashFlow": 1860.89,
        "dividendPerShare": 0.2218,
        "assets": 6305.75,
        "liabilities": 2056.82,
        "equity": 4248.93,
        "per": 28.94,
        "pbr": 3.75,
        "dividendYield": 19e-4,
        "roe": 0.5357,
        "debtToEquity": 0.4841,
        "netMargin": 0.1412
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 17803.98,
        "operatingIncome": 3676.85,
        "netIncome": 2202.06,
        "freeCashFlow": 2024.97,
        "dividendPerShare": 0.2218,
        "assets": 6744.32,
        "liabilities": 2461.75,
        "equity": 4282.57,
        "per": 28.14,
        "pbr": 3.14,
        "dividendYield": 27e-4,
        "roe": 0.5142,
        "debtToEquity": 0.5748,
        "netMargin": 0.1237
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 18548.33,
        "operatingIncome": 3696.59,
        "netIncome": 2609.5,
        "freeCashFlow": 2288.94,
        "dividendPerShare": 0.2168,
        "assets": 6948.03,
        "liabilities": 2754.47,
        "equity": 4193.56,
        "per": 27.32,
        "pbr": 4.52,
        "dividendYield": 17e-4,
        "roe": 0.6223,
        "debtToEquity": 0.6568,
        "netMargin": 0.1407
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 19067.33,
        "operatingIncome": 3877.49,
        "netIncome": 2422.78,
        "freeCashFlow": 2089.98,
        "dividendPerShare": 0.2255,
        "assets": 7309.73,
        "liabilities": 2721.19,
        "equity": 4588.54,
        "per": 24.83,
        "pbr": 3.37,
        "dividendYield": 22e-4,
        "roe": 0.528,
        "debtToEquity": 0.593,
        "netMargin": 0.1271
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 18191.64,
        "operatingIncome": 3374.42,
        "netIncome": 2341.26,
        "freeCashFlow": 2178.34,
        "dividendPerShare": 0.2285,
        "assets": 7403.98,
        "liabilities": 2264.91,
        "equity": 5139.08,
        "per": 27.44,
        "pbr": 3.27,
        "dividendYield": 2e-3,
        "roe": 0.4556,
        "debtToEquity": 0.4407,
        "netMargin": 0.1287
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 16917.43,
        "operatingIncome": 3325.6,
        "netIncome": 2208.53,
        "freeCashFlow": 1987.25,
        "dividendPerShare": 0.2319,
        "assets": 7933.57,
        "liabilities": 2216.93,
        "equity": 5716.64,
        "per": 26.27,
        "pbr": 2.35,
        "dividendYield": 24e-4,
        "roe": 0.3863,
        "debtToEquity": 0.3878,
        "netMargin": 0.1305
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 17371.1,
        "operatingIncome": 3388.81,
        "netIncome": 2138.78,
        "freeCashFlow": 2021.29,
        "dividendPerShare": 0.2235,
        "assets": 8435.59,
        "liabilities": 2144.44,
        "equity": 6291.15,
        "per": 29.61,
        "pbr": 2.54,
        "dividendYield": 22e-4,
        "roe": 0.34,
        "debtToEquity": 0.3409,
        "netMargin": 0.1231
      }
    ]
  },
  "FAB": {
    "symbol": "FAB",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 1725.47,
        "operatingIncome": 341.89,
        "netIncome": 182.78,
        "eps": 0.3096,
        "assets": 3497,
        "liabilities": 1210.84,
        "equity": 2286.15,
        "freeCashFlow": 166.87,
        "dividendPerShare": 0.0693,
        "per": 25.13,
        "pbr": 2.01,
        "dividendYield": 89e-4,
        "roe": 0.3198,
        "debtToEquity": 0.5296,
        "netMargin": 0.1059,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 1800.47,
        "operatingIncome": 324.96,
        "netIncome": 184.47,
        "eps": 0.3125,
        "assets": 3531.09,
        "liabilities": 1207.41,
        "equity": 2323.68,
        "freeCashFlow": 190.99,
        "dividendPerShare": 0.0764,
        "per": 21.63,
        "pbr": 1.72,
        "dividendYield": 0.0113,
        "roe": 0.3175,
        "debtToEquity": 0.5196,
        "netMargin": 0.1025,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 1818.24,
        "operatingIncome": 327.63,
        "netIncome": 225.5,
        "eps": 0.382,
        "assets": 3615.44,
        "liabilities": 1217.74,
        "equity": 2397.7,
        "freeCashFlow": 215.53,
        "dividendPerShare": 0.0742,
        "per": 22.75,
        "pbr": 2.14,
        "dividendYield": 85e-4,
        "roe": 0.3762,
        "debtToEquity": 0.5079,
        "netMargin": 0.124,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 1949.83,
        "operatingIncome": 322.51,
        "netIncome": 219.41,
        "eps": 0.3716,
        "assets": 3650.26,
        "liabilities": 1245.85,
        "equity": 2404.4,
        "freeCashFlow": 227.58,
        "dividendPerShare": 0.0775,
        "per": 21.53,
        "pbr": 1.96,
        "dividendYield": 97e-4,
        "roe": 0.365,
        "debtToEquity": 0.5182,
        "netMargin": 0.1125,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 1922.77,
        "operatingIncome": 379.75,
        "netIncome": 217.54,
        "eps": 0.3685,
        "assets": 3703.23,
        "liabilities": 1282.42,
        "equity": 2420.81,
        "freeCashFlow": 201.79,
        "dividendPerShare": 0.0592,
        "per": 22.63,
        "pbr": 2.03,
        "dividendYield": 71e-4,
        "roe": 0.3595,
        "debtToEquity": 0.5297,
        "netMargin": 0.1131,
        "revenueYoY": 0.1143
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 2043.21,
        "operatingIncome": 353,
        "netIncome": 221.55,
        "eps": 0.3753,
        "assets": 3751.26,
        "liabilities": 1259.88,
        "equity": 2491.38,
        "freeCashFlow": 201.35,
        "dividendPerShare": 0.0593,
        "per": 26.81,
        "pbr": 2.38,
        "dividendYield": 59e-4,
        "roe": 0.3557,
        "debtToEquity": 0.5057,
        "netMargin": 0.1084,
        "revenueYoY": 0.1348
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 2146.82,
        "operatingIncome": 460.01,
        "netIncome": 322.85,
        "eps": 0.5469,
        "assets": 3852.49,
        "liabilities": 1252.75,
        "equity": 2599.73,
        "freeCashFlow": 250.74,
        "dividendPerShare": 0.0638,
        "per": 28.22,
        "pbr": 3.51,
        "dividendYield": 41e-4,
        "roe": 0.4967,
        "debtToEquity": 0.4819,
        "netMargin": 0.1504,
        "revenueYoY": 0.1807
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 2368.58,
        "operatingIncome": 446.3,
        "netIncome": 266.37,
        "eps": 0.4512,
        "assets": 3877.99,
        "liabilities": 1311.49,
        "equity": 2566.5,
        "freeCashFlow": 208.06,
        "dividendPerShare": 0.0629,
        "per": 23.29,
        "pbr": 2.42,
        "dividendYield": 6e-3,
        "roe": 0.4152,
        "debtToEquity": 0.511,
        "netMargin": 0.1125,
        "revenueYoY": 0.2148
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 2417.83,
        "operatingIncome": 420.09,
        "netIncome": 269.8,
        "eps": 0.457,
        "assets": 3982.08,
        "liabilities": 1308.76,
        "equity": 2673.32,
        "freeCashFlow": 176.97,
        "dividendPerShare": 0.0615,
        "per": 22.14,
        "pbr": 2.23,
        "dividendYield": 61e-4,
        "roe": 0.4037,
        "debtToEquity": 0.4896,
        "netMargin": 0.1116,
        "revenueYoY": 0.2575
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 2634.72,
        "operatingIncome": 499.26,
        "netIncome": 346.58,
        "eps": 0.587,
        "assets": 4035.5,
        "liabilities": 1376.27,
        "equity": 2659.23,
        "freeCashFlow": 264.74,
        "dividendPerShare": 0.0814,
        "per": 21.93,
        "pbr": 2.86,
        "dividendYield": 63e-4,
        "roe": 0.5213,
        "debtToEquity": 0.5175,
        "netMargin": 0.1315,
        "revenueYoY": 0.2895
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 2814.62,
        "operatingIncome": 549.44,
        "netIncome": 359.39,
        "eps": 0.6087,
        "assets": 4051.67,
        "liabilities": 1338.22,
        "equity": 2713.45,
        "freeCashFlow": 388.99,
        "dividendPerShare": 0.075,
        "per": 21.84,
        "pbr": 2.89,
        "dividendYield": 56e-4,
        "roe": 0.5298,
        "debtToEquity": 0.4932,
        "netMargin": 0.1277,
        "revenueYoY": 0.3111
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 3203.65,
        "operatingIncome": 610.94,
        "netIncome": 321.82,
        "eps": 0.5451,
        "assets": 4136.24,
        "liabilities": 1375.34,
        "equity": 2760.9,
        "freeCashFlow": 333.89,
        "dividendPerShare": 0.066,
        "per": 24.7,
        "pbr": 2.88,
        "dividendYield": 49e-4,
        "roe": 0.4663,
        "debtToEquity": 0.4981,
        "netMargin": 0.1005,
        "revenueYoY": 0.3526
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 3312.44,
        "operatingIncome": 628.26,
        "netIncome": 419.11,
        "eps": 0.7099,
        "assets": 4166.12,
        "liabilities": 1343.54,
        "equity": 2822.58,
        "freeCashFlow": 425.25,
        "dividendPerShare": 0.068,
        "per": 21.51,
        "pbr": 3.19,
        "dividendYield": 45e-4,
        "roe": 0.5939,
        "debtToEquity": 0.476,
        "netMargin": 0.1265,
        "revenueYoY": 0.37
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 3565.36,
        "operatingIncome": 721.75,
        "netIncome": 451.13,
        "eps": 0.7641,
        "assets": 4292.73,
        "liabilities": 1399.44,
        "equity": 2893.29,
        "freeCashFlow": 496.22,
        "dividendPerShare": 0.0616,
        "per": 19.46,
        "pbr": 3.03,
        "dividendYield": 41e-4,
        "roe": 0.6237,
        "debtToEquity": 0.4837,
        "netMargin": 0.1265,
        "revenueYoY": 0.3532
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 3645.02,
        "operatingIncome": 675.03,
        "netIncome": 402.18,
        "eps": 0.6812,
        "assets": 4384.58,
        "liabilities": 1460.75,
        "equity": 2923.83,
        "freeCashFlow": 300.38,
        "dividendPerShare": 0.0795,
        "per": 26.51,
        "pbr": 3.65,
        "dividendYield": 44e-4,
        "roe": 0.5502,
        "debtToEquity": 0.4996,
        "netMargin": 0.1103,
        "revenueYoY": 0.295
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 3868.34,
        "operatingIncome": 767.3,
        "netIncome": 475.35,
        "eps": 0.8052,
        "assets": 4412.72,
        "liabilities": 1515.29,
        "equity": 2897.43,
        "freeCashFlow": 465.65,
        "dividendPerShare": 0.0673,
        "per": 21.57,
        "pbr": 3.54,
        "dividendYield": 39e-4,
        "roe": 0.6562,
        "debtToEquity": 0.523,
        "netMargin": 0.1229,
        "revenueYoY": 0.2075
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 3787.08,
        "operatingIncome": 691.75,
        "netIncome": 332.33,
        "eps": 0.5629,
        "assets": 4481.54,
        "liabilities": 1526.81,
        "equity": 2954.73,
        "freeCashFlow": 297.04,
        "dividendPerShare": 0.0826,
        "per": 21.96,
        "pbr": 2.47,
        "dividendYield": 67e-4,
        "roe": 0.4499,
        "debtToEquity": 0.5167,
        "netMargin": 0.0878,
        "revenueYoY": 0.1433
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 3926.72,
        "operatingIncome": 743.08,
        "netIncome": 430.1,
        "eps": 0.7285,
        "assets": 4483.27,
        "liabilities": 1491.52,
        "equity": 2991.75,
        "freeCashFlow": 290.47,
        "dividendPerShare": 0.0583,
        "per": 22.46,
        "pbr": 3.23,
        "dividendYield": 36e-4,
        "roe": 0.575,
        "debtToEquity": 0.4985,
        "netMargin": 0.1095,
        "revenueYoY": 0.1014
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 4062.63,
        "operatingIncome": 747.38,
        "netIncome": 511.42,
        "eps": 0.8662,
        "assets": 4556.53,
        "liabilities": 1493.42,
        "equity": 3063.12,
        "freeCashFlow": 444.79,
        "dividendPerShare": 0.0687,
        "per": 23.4,
        "pbr": 3.91,
        "dividendYield": 34e-4,
        "roe": 0.6678,
        "debtToEquity": 0.4875,
        "netMargin": 0.1259,
        "revenueYoY": 0.1146
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 4264.78,
        "operatingIncome": 695.15,
        "netIncome": 479.22,
        "eps": 0.8117,
        "assets": 4585.45,
        "liabilities": 1535.95,
        "equity": 3049.5,
        "freeCashFlow": 388.9,
        "dividendPerShare": 0.0729,
        "per": 19.15,
        "pbr": 3.01,
        "dividendYield": 47e-4,
        "roe": 0.6286,
        "debtToEquity": 0.5037,
        "netMargin": 0.1124,
        "revenueYoY": 0.1025
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 4311.56,
        "operatingIncome": 664.03,
        "netIncome": 439.38,
        "eps": 0.7442,
        "assets": 4619.44,
        "liabilities": 1545.73,
        "equity": 3073.71,
        "freeCashFlow": 295.47,
        "dividendPerShare": 0.0777,
        "per": 24.25,
        "pbr": 3.47,
        "dividendYield": 43e-4,
        "roe": 0.5718,
        "debtToEquity": 0.5029,
        "netMargin": 0.1019,
        "revenueYoY": 0.1385
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 4355.12,
        "operatingIncome": 803.29,
        "netIncome": 538.86,
        "eps": 0.9127,
        "assets": 4775.88,
        "liabilities": 1495.57,
        "equity": 3280.3,
        "freeCashFlow": 440.44,
        "dividendPerShare": 0.0688,
        "per": 23.61,
        "pbr": 3.88,
        "dividendYield": 32e-4,
        "roe": 0.6571,
        "debtToEquity": 0.4559,
        "netMargin": 0.1237,
        "revenueYoY": 0.1091
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 4533.26,
        "operatingIncome": 865.48,
        "netIncome": 474.96,
        "eps": 0.8045,
        "assets": 4840.87,
        "liabilities": 1623.84,
        "equity": 3217.03,
        "freeCashFlow": 358.84,
        "dividendPerShare": 0.0822,
        "per": 21.01,
        "pbr": 3.1,
        "dividendYield": 49e-4,
        "roe": 0.5906,
        "debtToEquity": 0.5048,
        "netMargin": 0.1048,
        "revenueYoY": 0.1158
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 4704.6,
        "operatingIncome": 747.04,
        "netIncome": 485.18,
        "eps": 0.8218,
        "assets": 4848.77,
        "liabilities": 1717.72,
        "equity": 3131.05,
        "freeCashFlow": 341.93,
        "dividendPerShare": 0.067,
        "per": 23.26,
        "pbr": 3.6,
        "dividendYield": 35e-4,
        "roe": 0.6198,
        "debtToEquity": 0.5486,
        "netMargin": 0.1031,
        "revenueYoY": 0.1031
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 4643.93,
        "operatingIncome": 854.07,
        "netIncome": 487.12,
        "eps": 0.8251,
        "assets": 4938.71,
        "liabilities": 1763.7,
        "equity": 3175.01,
        "freeCashFlow": 351.82,
        "dividendPerShare": 0.0786,
        "per": 18.35,
        "pbr": 2.81,
        "dividendYield": 52e-4,
        "roe": 0.6137,
        "debtToEquity": 0.5555,
        "netMargin": 0.1049,
        "revenueYoY": 0.0771
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 4653.05,
        "operatingIncome": 759.97,
        "netIncome": 511.32,
        "eps": 0.8661,
        "assets": 5087.74,
        "liabilities": 1827.74,
        "equity": 3259.99,
        "freeCashFlow": 445.96,
        "dividendPerShare": 0.0681,
        "per": 20.58,
        "pbr": 3.23,
        "dividendYield": 38e-4,
        "roe": 0.6274,
        "debtToEquity": 0.5607,
        "netMargin": 0.1099,
        "revenueYoY": 0.0684
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 4675.62,
        "operatingIncome": 817.4,
        "netIncome": 441.18,
        "eps": 0.7473,
        "assets": 5192.57,
        "liabilities": 1903.87,
        "equity": 3288.69,
        "freeCashFlow": 378.08,
        "dividendPerShare": 0.0775,
        "per": 21.99,
        "pbr": 2.95,
        "dividendYield": 47e-4,
        "roe": 0.5366,
        "debtToEquity": 0.5789,
        "netMargin": 0.0944,
        "revenueYoY": 0.0314
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 4915.97,
        "operatingIncome": 772.74,
        "netIncome": 524.52,
        "eps": 0.8884,
        "assets": 5279.04,
        "liabilities": 1895.2,
        "equity": 3383.84,
        "freeCashFlow": 468.34,
        "dividendPerShare": 0.0794,
        "per": 20.13,
        "pbr": 3.12,
        "dividendYield": 44e-4,
        "roe": 0.62,
        "debtToEquity": 0.5601,
        "netMargin": 0.1067,
        "revenueYoY": 0.0449
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 4724.57,
        "operatingIncome": 805.51,
        "netIncome": 471.53,
        "eps": 0.7987,
        "assets": 5271.89,
        "liabilities": 1956.12,
        "equity": 3315.77,
        "freeCashFlow": 427.11,
        "dividendPerShare": 0.0741,
        "per": 21.8,
        "pbr": 3.1,
        "dividendYield": 43e-4,
        "roe": 0.5688,
        "debtToEquity": 0.5899,
        "netMargin": 0.0998,
        "revenueYoY": 0.0174
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 4640.43,
        "operatingIncome": 770.91,
        "netIncome": 509.08,
        "eps": 0.8623,
        "assets": 5312.19,
        "liabilities": 1937.06,
        "equity": 3375.13,
        "freeCashFlow": 421.21,
        "dividendPerShare": 0.0806,
        "per": 26.76,
        "pbr": 4.04,
        "dividendYield": 35e-4,
        "roe": 0.6033,
        "debtToEquity": 0.5739,
        "netMargin": 0.1097,
        "revenueYoY": -27e-4
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 4561.01,
        "operatingIncome": 845.2,
        "netIncome": 488.55,
        "eps": 0.8275,
        "assets": 5424.12,
        "liabilities": 2016.11,
        "equity": 3408.01,
        "freeCashFlow": 348.01,
        "dividendPerShare": 0.0669,
        "per": 23.01,
        "pbr": 3.3,
        "dividendYield": 35e-4,
        "roe": 0.5734,
        "debtToEquity": 0.5916,
        "netMargin": 0.1071,
        "revenueYoY": -0.0245
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 4758.19,
        "operatingIncome": 786.05,
        "netIncome": 514.95,
        "eps": 0.8722,
        "assets": 5511.47,
        "liabilities": 2034.56,
        "equity": 3476.91,
        "freeCashFlow": 550.97,
        "dividendPerShare": 0.0617,
        "per": 23.84,
        "pbr": 3.53,
        "dividendYield": 3e-3,
        "roe": 0.5924,
        "debtToEquity": 0.5852,
        "netMargin": 0.1082,
        "revenueYoY": -0.0321
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 4353.23,
        "operatingIncome": 775.59,
        "netIncome": 523.3,
        "eps": 0.8864,
        "assets": 5572.06,
        "liabilities": 2008.73,
        "equity": 3563.33,
        "freeCashFlow": 496.26,
        "dividendPerShare": 0.0778,
        "per": 23.3,
        "pbr": 3.42,
        "dividendYield": 38e-4,
        "roe": 0.5874,
        "debtToEquity": 0.5637,
        "netMargin": 0.1202,
        "revenueYoY": -0.0786
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 4330,
        "operatingIncome": 769.47,
        "netIncome": 305.49,
        "eps": 0.5174,
        "assets": 5715.56,
        "liabilities": 1998.31,
        "equity": 3717.25,
        "freeCashFlow": 266.08,
        "dividendPerShare": 0.065,
        "per": 25.92,
        "pbr": 2.13,
        "dividendYield": 48e-4,
        "roe": 0.3287,
        "debtToEquity": 0.5376,
        "netMargin": 0.0706,
        "revenueYoY": -0.0669
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 4197.37,
        "operatingIncome": 718.65,
        "netIncome": 404.02,
        "eps": 0.6843,
        "assets": 5883.3,
        "liabilities": 2014.53,
        "equity": 3868.78,
        "freeCashFlow": 329.4,
        "dividendPerShare": 0.0609,
        "per": 20.87,
        "pbr": 2.18,
        "dividendYield": 43e-4,
        "roe": 0.4177,
        "debtToEquity": 0.5207,
        "netMargin": 0.0963,
        "revenueYoY": -0.0797
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 4360.41,
        "operatingIncome": 750.62,
        "netIncome": 401.99,
        "eps": 0.6809,
        "assets": 5939.77,
        "liabilities": 2013.71,
        "equity": 3926.06,
        "freeCashFlow": 307.49,
        "dividendPerShare": 0.0741,
        "per": 23.66,
        "pbr": 2.42,
        "dividendYield": 46e-4,
        "roe": 0.4096,
        "debtToEquity": 0.5129,
        "netMargin": 0.0922,
        "revenueYoY": -0.0836
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 4201.03,
        "operatingIncome": 676.32,
        "netIncome": 547.76,
        "eps": 0.9278,
        "assets": 6036.67,
        "liabilities": 2048.01,
        "equity": 3988.66,
        "freeCashFlow": 475.68,
        "dividendPerShare": 0.0656,
        "per": 23.36,
        "pbr": 3.21,
        "dividendYield": 3e-3,
        "roe": 0.5493,
        "debtToEquity": 0.5135,
        "netMargin": 0.1304,
        "revenueYoY": -0.035
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 4227.75,
        "operatingIncome": 759.73,
        "netIncome": 465.25,
        "eps": 0.7881,
        "assets": 6105.75,
        "liabilities": 2074.14,
        "equity": 4031.6,
        "freeCashFlow": 437.14,
        "dividendPerShare": 0.0786,
        "per": 23.64,
        "pbr": 2.73,
        "dividendYield": 42e-4,
        "roe": 0.4616,
        "debtToEquity": 0.5145,
        "netMargin": 0.11,
        "revenueYoY": -0.0236
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 4259.48,
        "operatingIncome": 779.6,
        "netIncome": 492.9,
        "eps": 0.8349,
        "assets": 6189.66,
        "liabilities": 2029.1,
        "equity": 4160.56,
        "freeCashFlow": 520.49,
        "dividendPerShare": 0.064,
        "per": 20.9,
        "pbr": 2.48,
        "dividendYield": 37e-4,
        "roe": 0.4739,
        "debtToEquity": 0.4877,
        "netMargin": 0.1157,
        "revenueYoY": 0.0148
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 4471.74,
        "operatingIncome": 801.33,
        "netIncome": 458.83,
        "eps": 0.7772,
        "assets": 6206.37,
        "liabilities": 2017.55,
        "equity": 4188.82,
        "freeCashFlow": 414.85,
        "dividendPerShare": 0.0583,
        "per": 21.5,
        "pbr": 2.35,
        "dividendYield": 35e-4,
        "roe": 0.4381,
        "debtToEquity": 0.4817,
        "netMargin": 0.1026,
        "revenueYoY": 0.0255
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 7294.02,
        "operatingIncome": 1316.99,
        "netIncome": 812.15,
        "freeCashFlow": 800.96,
        "dividendPerShare": 0.2973,
        "assets": 3650.26,
        "liabilities": 1245.85,
        "equity": 2404.4,
        "per": 21.53,
        "pbr": 1.96,
        "dividendYield": 97e-4,
        "roe": 0.3378,
        "debtToEquity": 0.5182,
        "netMargin": 0.1113
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 8481.39,
        "operatingIncome": 1639.06,
        "netIncome": 1028.31,
        "freeCashFlow": 861.94,
        "dividendPerShare": 0.2452,
        "assets": 3877.99,
        "liabilities": 1311.49,
        "equity": 2566.5,
        "per": 23.29,
        "pbr": 2.42,
        "dividendYield": 6e-3,
        "roe": 0.4007,
        "debtToEquity": 0.511,
        "netMargin": 0.1212
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 11070.82,
        "operatingIncome": 2079.73,
        "netIncome": 1297.59,
        "freeCashFlow": 1164.59,
        "dividendPerShare": 0.284,
        "assets": 4136.24,
        "liabilities": 1375.34,
        "equity": 2760.9,
        "per": 24.7,
        "pbr": 2.88,
        "dividendYield": 49e-4,
        "roe": 0.47,
        "debtToEquity": 0.4981,
        "netMargin": 0.1172
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 14391.16,
        "operatingIncome": 2792.34,
        "netIncome": 1747.77,
        "freeCashFlow": 1687.51,
        "dividendPerShare": 0.2764,
        "assets": 4412.72,
        "liabilities": 1515.29,
        "equity": 2897.43,
        "per": 21.57,
        "pbr": 3.54,
        "dividendYield": 39e-4,
        "roe": 0.6032,
        "debtToEquity": 0.523,
        "netMargin": 0.1214
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 16041.21,
        "operatingIncome": 2877.36,
        "netIncome": 1753.07,
        "freeCashFlow": 1421.21,
        "dividendPerShare": 0.2825,
        "assets": 4585.45,
        "liabilities": 1535.95,
        "equity": 3049.5,
        "per": 19.15,
        "pbr": 3.01,
        "dividendYield": 47e-4,
        "roe": 0.5749,
        "debtToEquity": 0.5037,
        "netMargin": 0.1093
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 17904.55,
        "operatingIncome": 3079.83,
        "netIncome": 1938.38,
        "freeCashFlow": 1436.68,
        "dividendPerShare": 0.2957,
        "assets": 4848.77,
        "liabilities": 1717.72,
        "equity": 3131.05,
        "per": 23.26,
        "pbr": 3.6,
        "dividendYield": 35e-4,
        "roe": 0.6191,
        "debtToEquity": 0.5486,
        "netMargin": 0.1083
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 18888.58,
        "operatingIncome": 3204.18,
        "netIncome": 1964.14,
        "freeCashFlow": 1644.2,
        "dividendPerShare": 0.3037,
        "assets": 5279.04,
        "liabilities": 1895.2,
        "equity": 3383.84,
        "per": 20.13,
        "pbr": 3.12,
        "dividendYield": 44e-4,
        "roe": 0.5804,
        "debtToEquity": 0.5601,
        "netMargin": 0.104
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 18684.2,
        "operatingIncome": 3207.67,
        "netIncome": 1984.12,
        "freeCashFlow": 1747.29,
        "dividendPerShare": 0.2832,
        "assets": 5511.47,
        "liabilities": 2034.56,
        "equity": 3476.91,
        "per": 23.84,
        "pbr": 3.53,
        "dividendYield": 3e-3,
        "roe": 0.5707,
        "debtToEquity": 0.5852,
        "netMargin": 0.1062
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 17241.01,
        "operatingIncome": 3014.32,
        "netIncome": 1634.8,
        "freeCashFlow": 1399.23,
        "dividendPerShare": 0.2778,
        "assets": 5939.77,
        "liabilities": 2013.71,
        "equity": 3926.06,
        "per": 23.66,
        "pbr": 2.42,
        "dividendYield": 46e-4,
        "roe": 0.4164,
        "debtToEquity": 0.5129,
        "netMargin": 0.0948
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 17160,
        "operatingIncome": 3016.98,
        "netIncome": 1964.75,
        "freeCashFlow": 1848.16,
        "dividendPerShare": 0.2665,
        "assets": 6206.37,
        "liabilities": 2017.55,
        "equity": 4188.82,
        "per": 21.5,
        "pbr": 2.35,
        "dividendYield": 35e-4,
        "roe": 0.469,
        "debtToEquity": 0.4817,
        "netMargin": 0.1145
      }
    ]
  },
  "BIO": {
    "symbol": "BIO",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 953.12,
        "operatingIncome": 166.72,
        "netIncome": 83.3,
        "eps": 0.0973,
        "assets": 2166.35,
        "liabilities": 874.08,
        "equity": 1292.28,
        "freeCashFlow": 64.75,
        "dividendPerShare": 0.0133,
        "per": 30.14,
        "pbr": 1.94,
        "dividendYield": 45e-4,
        "roe": 0.2579,
        "debtToEquity": 0.6764,
        "netMargin": 0.0874,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 999.62,
        "operatingIncome": 126.44,
        "netIncome": 102.65,
        "eps": 0.1199,
        "assets": 2153.46,
        "liabilities": 887.04,
        "equity": 1266.42,
        "freeCashFlow": 72.9,
        "dividendPerShare": 0.0124,
        "per": 32.67,
        "pbr": 2.65,
        "dividendYield": 32e-4,
        "roe": 0.3242,
        "debtToEquity": 0.7004,
        "netMargin": 0.1027,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 1029.37,
        "operatingIncome": 159.95,
        "netIncome": 79.01,
        "eps": 0.0923,
        "assets": 2183.89,
        "liabilities": 906.28,
        "equity": 1277.61,
        "freeCashFlow": 79.68,
        "dividendPerShare": 0.0127,
        "per": 33.02,
        "pbr": 2.04,
        "dividendYield": 42e-4,
        "roe": 0.2474,
        "debtToEquity": 0.7094,
        "netMargin": 0.0768,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 1107.49,
        "operatingIncome": 167.39,
        "netIncome": 89.46,
        "eps": 0.1045,
        "assets": 2239.3,
        "liabilities": 940.53,
        "equity": 1298.77,
        "freeCashFlow": 95.43,
        "dividendPerShare": 0.0171,
        "per": 26.04,
        "pbr": 1.79,
        "dividendYield": 63e-4,
        "roe": 0.2755,
        "debtToEquity": 0.7242,
        "netMargin": 0.0808,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 1132.19,
        "operatingIncome": 158.86,
        "netIncome": 87.61,
        "eps": 0.1023,
        "assets": 2258.08,
        "liabilities": 946.51,
        "equity": 1311.57,
        "freeCashFlow": 77.24,
        "dividendPerShare": 0.0148,
        "per": 28.17,
        "pbr": 1.88,
        "dividendYield": 51e-4,
        "roe": 0.2672,
        "debtToEquity": 0.7217,
        "netMargin": 0.0774,
        "revenueYoY": 0.1879
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 1202.16,
        "operatingIncome": 170.38,
        "netIncome": 102.67,
        "eps": 0.1199,
        "assets": 2300.56,
        "liabilities": 992.83,
        "equity": 1307.73,
        "freeCashFlow": 93.05,
        "dividendPerShare": 0.0138,
        "per": 33.15,
        "pbr": 2.6,
        "dividendYield": 35e-4,
        "roe": 0.3141,
        "debtToEquity": 0.7592,
        "netMargin": 0.0854,
        "revenueYoY": 0.2026
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 1274.25,
        "operatingIncome": 194.81,
        "netIncome": 95.34,
        "eps": 0.1114,
        "assets": 2315.1,
        "liabilities": 1035.09,
        "equity": 1280.01,
        "freeCashFlow": 92.78,
        "dividendPerShare": 0.0159,
        "per": 36.97,
        "pbr": 2.75,
        "dividendYield": 39e-4,
        "roe": 0.2979,
        "debtToEquity": 0.8087,
        "netMargin": 0.0748,
        "revenueYoY": 0.2379
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 1409.17,
        "operatingIncome": 232.6,
        "netIncome": 132.77,
        "eps": 0.1551,
        "assets": 2317.14,
        "liabilities": 1025.43,
        "equity": 1291.71,
        "freeCashFlow": 81.01,
        "dividendPerShare": 0.0124,
        "per": 31.06,
        "pbr": 3.19,
        "dividendYield": 26e-4,
        "roe": 0.4111,
        "debtToEquity": 0.7939,
        "netMargin": 0.0942,
        "revenueYoY": 0.2724
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 1411.91,
        "operatingIncome": 241.95,
        "netIncome": 135.68,
        "eps": 0.1585,
        "assets": 2351.78,
        "liabilities": 1044.92,
        "equity": 1306.86,
        "freeCashFlow": 142.92,
        "dividendPerShare": 0.0155,
        "per": 30.4,
        "pbr": 3.16,
        "dividendYield": 32e-4,
        "roe": 0.4153,
        "debtToEquity": 0.7996,
        "netMargin": 0.0961,
        "revenueYoY": 0.2471
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 1522.3,
        "operatingIncome": 259.61,
        "netIncome": 133.92,
        "eps": 0.1564,
        "assets": 2421.77,
        "liabilities": 1105.55,
        "equity": 1316.22,
        "freeCashFlow": 95.06,
        "dividendPerShare": 0.0158,
        "per": 30.7,
        "pbr": 3.12,
        "dividendYield": 33e-4,
        "roe": 0.407,
        "debtToEquity": 0.8399,
        "netMargin": 0.088,
        "revenueYoY": 0.2663
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 1589.05,
        "operatingIncome": 285.54,
        "netIncome": 118.04,
        "eps": 0.1379,
        "assets": 2452.08,
        "liabilities": 1114.08,
        "equity": 1338,
        "freeCashFlow": 91.23,
        "dividendPerShare": 0.0143,
        "per": 32.52,
        "pbr": 2.87,
        "dividendYield": 32e-4,
        "roe": 0.3529,
        "debtToEquity": 0.8327,
        "netMargin": 0.0743,
        "revenueYoY": 0.247
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 1757.54,
        "operatingIncome": 257.84,
        "netIncome": 136.65,
        "eps": 0.1596,
        "assets": 2472.56,
        "liabilities": 1152.77,
        "equity": 1319.78,
        "freeCashFlow": 132.34,
        "dividendPerShare": 0.014,
        "per": 29.88,
        "pbr": 3.09,
        "dividendYield": 29e-4,
        "roe": 0.4141,
        "debtToEquity": 0.8735,
        "netMargin": 0.0777,
        "revenueYoY": 0.2472
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 1784.26,
        "operatingIncome": 299.95,
        "netIncome": 169.23,
        "eps": 0.1977,
        "assets": 2512.94,
        "liabilities": 1146.32,
        "equity": 1366.62,
        "freeCashFlow": 167.09,
        "dividendPerShare": 0.0159,
        "per": 32.02,
        "pbr": 3.96,
        "dividendYield": 25e-4,
        "roe": 0.4953,
        "debtToEquity": 0.8388,
        "netMargin": 0.0948,
        "revenueYoY": 0.2637
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 1905.27,
        "operatingIncome": 309.12,
        "netIncome": 145.45,
        "eps": 0.1699,
        "assets": 2543.64,
        "liabilities": 1182.45,
        "equity": 1361.2,
        "freeCashFlow": 153.47,
        "dividendPerShare": 0.0129,
        "per": 33.5,
        "pbr": 3.58,
        "dividendYield": 23e-4,
        "roe": 0.4274,
        "debtToEquity": 0.8687,
        "netMargin": 0.0763,
        "revenueYoY": 0.2516
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 2003.26,
        "operatingIncome": 289.68,
        "netIncome": 148.57,
        "eps": 0.1735,
        "assets": 2601.69,
        "liabilities": 1208.82,
        "equity": 1392.87,
        "freeCashFlow": 110.02,
        "dividendPerShare": 0.0153,
        "per": 29.55,
        "pbr": 3.15,
        "dividendYield": 3e-3,
        "roe": 0.4267,
        "debtToEquity": 0.8679,
        "netMargin": 0.0742,
        "revenueYoY": 0.2607
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 2183.74,
        "operatingIncome": 359.39,
        "netIncome": 161.92,
        "eps": 0.1891,
        "assets": 2671.27,
        "liabilities": 1240.59,
        "equity": 1430.68,
        "freeCashFlow": 97.9,
        "dividendPerShare": 0.0138,
        "per": 29.53,
        "pbr": 3.34,
        "dividendYield": 25e-4,
        "roe": 0.4527,
        "debtToEquity": 0.8671,
        "netMargin": 0.0741,
        "revenueYoY": 0.2425
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 2206.32,
        "operatingIncome": 327.3,
        "netIncome": 202.58,
        "eps": 0.2366,
        "assets": 2713.9,
        "liabilities": 1241.97,
        "equity": 1471.94,
        "freeCashFlow": 139.14,
        "dividendPerShare": 0.0126,
        "per": 34.75,
        "pbr": 4.78,
        "dividendYield": 15e-4,
        "roe": 0.5505,
        "debtToEquity": 0.8438,
        "netMargin": 0.0918,
        "revenueYoY": 0.2365
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 2291.57,
        "operatingIncome": 342.11,
        "netIncome": 203.41,
        "eps": 0.2376,
        "assets": 2733.5,
        "liabilities": 1249.15,
        "equity": 1484.35,
        "freeCashFlow": 131.28,
        "dividendPerShare": 0.0171,
        "per": 29.87,
        "pbr": 4.09,
        "dividendYield": 24e-4,
        "roe": 0.5482,
        "debtToEquity": 0.8415,
        "netMargin": 0.0888,
        "revenueYoY": 0.2028
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 2340.14,
        "operatingIncome": 383.68,
        "netIncome": 250.08,
        "eps": 0.2921,
        "assets": 2746.57,
        "liabilities": 1264.33,
        "equity": 1482.24,
        "freeCashFlow": 176.12,
        "dividendPerShare": 0.0141,
        "per": 35.06,
        "pbr": 5.92,
        "dividendYield": 14e-4,
        "roe": 0.6749,
        "debtToEquity": 0.853,
        "netMargin": 0.1069,
        "revenueYoY": 0.1682
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 2499.51,
        "operatingIncome": 467.03,
        "netIncome": 246.36,
        "eps": 0.2878,
        "assets": 2783.9,
        "liabilities": 1273.44,
        "equity": 1510.46,
        "freeCashFlow": 242.41,
        "dividendPerShare": 0.0148,
        "per": 29.73,
        "pbr": 4.85,
        "dividendYield": 17e-4,
        "roe": 0.6524,
        "debtToEquity": 0.8431,
        "netMargin": 0.0986,
        "revenueYoY": 0.1446
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 2438.22,
        "operatingIncome": 424.93,
        "netIncome": 195.83,
        "eps": 0.2287,
        "assets": 2812.33,
        "liabilities": 1305.14,
        "equity": 1507.19,
        "freeCashFlow": 186.85,
        "dividendPerShare": 0.013,
        "per": 31.41,
        "pbr": 4.08,
        "dividendYield": 18e-4,
        "roe": 0.5197,
        "debtToEquity": 0.8659,
        "netMargin": 0.0803,
        "revenueYoY": 0.1051
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 2660.43,
        "operatingIncome": 423.26,
        "netIncome": 167.39,
        "eps": 0.1955,
        "assets": 2884.84,
        "liabilities": 1328.36,
        "equity": 1556.48,
        "freeCashFlow": 152.87,
        "dividendPerShare": 0.0154,
        "per": 34.96,
        "pbr": 3.76,
        "dividendYield": 23e-4,
        "roe": 0.4302,
        "debtToEquity": 0.8534,
        "netMargin": 0.0629,
        "revenueYoY": 0.161
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 2657.87,
        "operatingIncome": 466.15,
        "netIncome": 197.97,
        "eps": 0.2312,
        "assets": 2956.13,
        "liabilities": 1345.48,
        "equity": 1610.65,
        "freeCashFlow": 199.21,
        "dividendPerShare": 0.0147,
        "per": 28.43,
        "pbr": 3.49,
        "dividendYield": 22e-4,
        "roe": 0.4917,
        "debtToEquity": 0.8354,
        "netMargin": 0.0745,
        "revenueYoY": 0.1358
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 2897.56,
        "operatingIncome": 398.89,
        "netIncome": 237.94,
        "eps": 0.2779,
        "assets": 3001.03,
        "liabilities": 1372.84,
        "equity": 1628.18,
        "freeCashFlow": 153.77,
        "dividendPerShare": 0.0134,
        "per": 30.47,
        "pbr": 4.45,
        "dividendYield": 16e-4,
        "roe": 0.5846,
        "debtToEquity": 0.8432,
        "netMargin": 0.0821,
        "revenueYoY": 0.1593
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 2928.3,
        "operatingIncome": 387.84,
        "netIncome": 217.32,
        "eps": 0.2538,
        "assets": 3023.11,
        "liabilities": 1419.73,
        "equity": 1603.38,
        "freeCashFlow": 168.36,
        "dividendPerShare": 0.0144,
        "per": 28.87,
        "pbr": 3.91,
        "dividendYield": 2e-3,
        "roe": 0.5422,
        "debtToEquity": 0.8855,
        "netMargin": 0.0742,
        "revenueYoY": 0.201
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 2960.99,
        "operatingIncome": 480.25,
        "netIncome": 182.85,
        "eps": 0.2136,
        "assets": 3020.79,
        "liabilities": 1416.74,
        "equity": 1604.06,
        "freeCashFlow": 189.81,
        "dividendPerShare": 0.0169,
        "per": 24.59,
        "pbr": 2.8,
        "dividendYield": 32e-4,
        "roe": 0.456,
        "debtToEquity": 0.8832,
        "netMargin": 0.0618,
        "revenueYoY": 0.113
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 2968.09,
        "operatingIncome": 441.5,
        "netIncome": 251.05,
        "eps": 0.2932,
        "assets": 3077.09,
        "liabilities": 1463.61,
        "equity": 1613.48,
        "freeCashFlow": 251.07,
        "dividendPerShare": 0.0123,
        "per": 29.73,
        "pbr": 4.63,
        "dividendYield": 14e-4,
        "roe": 0.6224,
        "debtToEquity": 0.9071,
        "netMargin": 0.0846,
        "revenueYoY": 0.1167
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 3205.88,
        "operatingIncome": 434.24,
        "netIncome": 257.21,
        "eps": 0.3004,
        "assets": 3123.27,
        "liabilities": 1484.62,
        "equity": 1638.65,
        "freeCashFlow": 196.27,
        "dividendPerShare": 0.0128,
        "per": 29.61,
        "pbr": 4.65,
        "dividendYield": 14e-4,
        "roe": 0.6279,
        "debtToEquity": 0.906,
        "netMargin": 0.0802,
        "revenueYoY": 0.1064
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 3131.39,
        "operatingIncome": 398.34,
        "netIncome": 248.74,
        "eps": 0.2905,
        "assets": 3159.59,
        "liabilities": 1495.26,
        "equity": 1664.33,
        "freeCashFlow": 159.86,
        "dividendPerShare": 0.0147,
        "per": 31.43,
        "pbr": 4.7,
        "dividendYield": 16e-4,
        "roe": 0.5978,
        "debtToEquity": 0.8984,
        "netMargin": 0.0794,
        "revenueYoY": 0.0694
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 3244.98,
        "operatingIncome": 457.75,
        "netIncome": 270.81,
        "eps": 0.3163,
        "assets": 3272.45,
        "liabilities": 1533.51,
        "equity": 1738.94,
        "freeCashFlow": 262.68,
        "dividendPerShare": 0.0169,
        "per": 28.43,
        "pbr": 4.43,
        "dividendYield": 19e-4,
        "roe": 0.6229,
        "debtToEquity": 0.8819,
        "netMargin": 0.0835,
        "revenueYoY": 0.0959
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 3249.13,
        "operatingIncome": 522.86,
        "netIncome": 294.95,
        "eps": 0.3445,
        "assets": 3373.93,
        "liabilities": 1581.14,
        "equity": 1792.79,
        "freeCashFlow": 229.37,
        "dividendPerShare": 0.0129,
        "per": 35.03,
        "pbr": 5.76,
        "dividendYield": 11e-4,
        "roe": 0.6581,
        "debtToEquity": 0.8819,
        "netMargin": 0.0908,
        "revenueYoY": 0.0947
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 3369.46,
        "operatingIncome": 431.99,
        "netIncome": 197.77,
        "eps": 0.231,
        "assets": 3401.03,
        "liabilities": 1617.1,
        "equity": 1783.93,
        "freeCashFlow": 135.64,
        "dividendPerShare": 0.0148,
        "per": 35.45,
        "pbr": 3.93,
        "dividendYield": 18e-4,
        "roe": 0.4435,
        "debtToEquity": 0.9065,
        "netMargin": 0.0587,
        "revenueYoY": 0.051
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 3178.7,
        "operatingIncome": 398.7,
        "netIncome": 250.8,
        "eps": 0.2929,
        "assets": 3492.48,
        "liabilities": 1709.36,
        "equity": 1783.12,
        "freeCashFlow": 270.02,
        "dividendPerShare": 0.0156,
        "per": 35.04,
        "pbr": 4.93,
        "dividendYield": 15e-4,
        "roe": 0.5626,
        "debtToEquity": 0.9586,
        "netMargin": 0.0789,
        "revenueYoY": 0.0151
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 3246.58,
        "operatingIncome": 467.1,
        "netIncome": 241.97,
        "eps": 0.2826,
        "assets": 3532.64,
        "liabilities": 1724.88,
        "equity": 1807.75,
        "freeCashFlow": 212.19,
        "dividendPerShare": 0.0132,
        "per": 28.38,
        "pbr": 3.8,
        "dividendYield": 16e-4,
        "roe": 0.5354,
        "debtToEquity": 0.9542,
        "netMargin": 0.0745,
        "revenueYoY": 5e-4
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 3217.08,
        "operatingIncome": 444.73,
        "netIncome": 240.1,
        "eps": 0.2804,
        "assets": 3548.63,
        "liabilities": 1753.49,
        "equity": 1795.13,
        "freeCashFlow": 170.88,
        "dividendPerShare": 0.0144,
        "per": 31.2,
        "pbr": 4.17,
        "dividendYield": 16e-4,
        "roe": 0.535,
        "debtToEquity": 0.9768,
        "netMargin": 0.0746,
        "revenueYoY": -99e-4
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 3423.79,
        "operatingIncome": 476.73,
        "netIncome": 276.07,
        "eps": 0.3225,
        "assets": 3581.42,
        "liabilities": 1731.82,
        "equity": 1849.6,
        "freeCashFlow": 187.61,
        "dividendPerShare": 0.0162,
        "per": 23.42,
        "pbr": 3.5,
        "dividendYield": 21e-4,
        "roe": 0.597,
        "debtToEquity": 0.9363,
        "netMargin": 0.0806,
        "revenueYoY": 0.0161
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 3256.87,
        "operatingIncome": 443.98,
        "netIncome": 307.14,
        "eps": 0.3587,
        "assets": 3612.69,
        "liabilities": 1787.44,
        "equity": 1825.25,
        "freeCashFlow": 261.88,
        "dividendPerShare": 0.015,
        "per": 33.77,
        "pbr": 5.68,
        "dividendYield": 12e-4,
        "roe": 0.6731,
        "debtToEquity": 0.9793,
        "netMargin": 0.0943,
        "revenueYoY": 0.0246
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 3332,
        "operatingIncome": 438.93,
        "netIncome": 244.75,
        "eps": 0.2859,
        "assets": 3670.85,
        "liabilities": 1834.87,
        "equity": 1835.97,
        "freeCashFlow": 247.51,
        "dividendPerShare": 0.0137,
        "per": 32.93,
        "pbr": 4.39,
        "dividendYield": 15e-4,
        "roe": 0.5332,
        "debtToEquity": 0.9994,
        "netMargin": 0.0735,
        "revenueYoY": 0.0263
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 3408.62,
        "operatingIncome": 483.68,
        "netIncome": 241.2,
        "eps": 0.2817,
        "assets": 3634.19,
        "liabilities": 1794.91,
        "equity": 1839.29,
        "freeCashFlow": 244.08,
        "dividendPerShare": 0.0175,
        "per": 30.55,
        "pbr": 4.01,
        "dividendYield": 2e-3,
        "roe": 0.5245,
        "debtToEquity": 0.9759,
        "netMargin": 0.0708,
        "revenueYoY": 0.0595
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 3592.15,
        "operatingIncome": 482.53,
        "netIncome": 284.59,
        "eps": 0.3324,
        "assets": 3713.82,
        "liabilities": 1847.08,
        "equity": 1866.74,
        "freeCashFlow": 273.17,
        "dividendPerShare": 0.0173,
        "per": 28.89,
        "pbr": 4.4,
        "dividendYield": 18e-4,
        "roe": 0.6098,
        "debtToEquity": 0.9895,
        "netMargin": 0.0792,
        "revenueYoY": 0.0492
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 4089.59,
        "operatingIncome": 620.5,
        "netIncome": 354.42,
        "freeCashFlow": 312.77,
        "dividendPerShare": 0.0555,
        "assets": 2239.3,
        "liabilities": 940.53,
        "equity": 1298.77,
        "per": 26.04,
        "pbr": 1.79,
        "dividendYield": 63e-4,
        "roe": 0.2729,
        "debtToEquity": 0.7242,
        "netMargin": 0.0867
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 5017.78,
        "operatingIncome": 756.65,
        "netIncome": 418.4,
        "freeCashFlow": 344.08,
        "dividendPerShare": 0.0569,
        "assets": 2317.14,
        "liabilities": 1025.43,
        "equity": 1291.71,
        "per": 31.06,
        "pbr": 3.19,
        "dividendYield": 26e-4,
        "roe": 0.3239,
        "debtToEquity": 0.7939,
        "netMargin": 0.0834
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 6280.8,
        "operatingIncome": 1044.94,
        "netIncome": 524.29,
        "freeCashFlow": 461.55,
        "dividendPerShare": 0.0596,
        "assets": 2472.56,
        "liabilities": 1152.77,
        "equity": 1319.78,
        "per": 29.88,
        "pbr": 3.09,
        "dividendYield": 29e-4,
        "roe": 0.3973,
        "debtToEquity": 0.8735,
        "netMargin": 0.0835
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 7876.53,
        "operatingIncome": 1258.14,
        "netIncome": 625.17,
        "freeCashFlow": 528.47,
        "dividendPerShare": 0.0578,
        "assets": 2671.27,
        "liabilities": 1240.59,
        "equity": 1430.68,
        "per": 29.53,
        "pbr": 3.34,
        "dividendYield": 25e-4,
        "roe": 0.437,
        "debtToEquity": 0.8671,
        "netMargin": 0.0794
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 9337.54,
        "operatingIncome": 1520.12,
        "netIncome": 902.42,
        "freeCashFlow": 688.95,
        "dividendPerShare": 0.0586,
        "assets": 2783.9,
        "liabilities": 1273.44,
        "equity": 1510.46,
        "per": 29.73,
        "pbr": 4.85,
        "dividendYield": 17e-4,
        "roe": 0.5975,
        "debtToEquity": 0.8431,
        "netMargin": 0.0966
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 10654.08,
        "operatingIncome": 1713.24,
        "netIncome": 799.13,
        "freeCashFlow": 692.7,
        "dividendPerShare": 0.0565,
        "assets": 3001.03,
        "liabilities": 1372.84,
        "equity": 1628.18,
        "per": 30.47,
        "pbr": 4.45,
        "dividendYield": 16e-4,
        "roe": 0.4908,
        "debtToEquity": 0.8432,
        "netMargin": 0.075
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 12063.26,
        "operatingIncome": 1743.83,
        "netIncome": 908.42,
        "freeCashFlow": 805.51,
        "dividendPerShare": 0.0565,
        "assets": 3123.27,
        "liabilities": 1484.62,
        "equity": 1638.65,
        "per": 29.61,
        "pbr": 4.65,
        "dividendYield": 14e-4,
        "roe": 0.5544,
        "debtToEquity": 0.906,
        "netMargin": 0.0753
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 12994.96,
        "operatingIncome": 1810.93,
        "netIncome": 1012.27,
        "freeCashFlow": 787.55,
        "dividendPerShare": 0.0592,
        "assets": 3401.03,
        "liabilities": 1617.1,
        "equity": 1783.93,
        "per": 35.45,
        "pbr": 3.93,
        "dividendYield": 18e-4,
        "roe": 0.5674,
        "debtToEquity": 0.9065,
        "netMargin": 0.0779
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 13066.14,
        "operatingIncome": 1787.25,
        "netIncome": 1008.93,
        "freeCashFlow": 840.7,
        "dividendPerShare": 0.0594,
        "assets": 3581.42,
        "liabilities": 1731.82,
        "equity": 1849.6,
        "per": 23.42,
        "pbr": 3.5,
        "dividendYield": 21e-4,
        "roe": 0.5455,
        "debtToEquity": 0.9363,
        "netMargin": 0.0772
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 13589.65,
        "operatingIncome": 1849.13,
        "netIncome": 1077.68,
        "freeCashFlow": 1026.64,
        "dividendPerShare": 0.0634,
        "assets": 3713.82,
        "liabilities": 1847.08,
        "equity": 1866.74,
        "per": 28.89,
        "pbr": 4.4,
        "dividendYield": 18e-4,
        "roe": 0.5773,
        "debtToEquity": 0.9895,
        "netMargin": 0.0793
      }
    ]
  },
  "CRN": {
    "symbol": "CRN",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 824.51,
        "operatingIncome": 107.6,
        "netIncome": 43.43,
        "eps": 0.0451,
        "assets": 1875.34,
        "liabilities": 731.91,
        "equity": 1143.43,
        "freeCashFlow": 38.84,
        "dividendPerShare": 92e-4,
        "per": 29.5,
        "pbr": 1.12,
        "dividendYield": 69e-4,
        "roe": 0.1519,
        "debtToEquity": 0.6401,
        "netMargin": 0.0527,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 859.42,
        "operatingIncome": 119.41,
        "netIncome": 65.59,
        "eps": 0.0681,
        "assets": 1898.19,
        "liabilities": 745.52,
        "equity": 1152.68,
        "freeCashFlow": 40.42,
        "dividendPerShare": 97e-4,
        "per": 31.32,
        "pbr": 1.78,
        "dividendYield": 45e-4,
        "roe": 0.2276,
        "debtToEquity": 0.6468,
        "netMargin": 0.0763,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 872.72,
        "operatingIncome": 95.23,
        "netIncome": 47.42,
        "eps": 0.0492,
        "assets": 1938.12,
        "liabilities": 768.89,
        "equity": 1169.23,
        "freeCashFlow": 38.44,
        "dividendPerShare": 9e-3,
        "per": 30.25,
        "pbr": 1.23,
        "dividendYield": 61e-4,
        "roe": 0.1622,
        "debtToEquity": 0.6576,
        "netMargin": 0.0543,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 945.93,
        "operatingIncome": 130.62,
        "netIncome": 56.13,
        "eps": 0.0583,
        "assets": 1978.96,
        "liabilities": 799.25,
        "equity": 1179.71,
        "freeCashFlow": 36.83,
        "dividendPerShare": 94e-4,
        "per": 28.94,
        "pbr": 1.38,
        "dividendYield": 56e-4,
        "roe": 0.1903,
        "debtToEquity": 0.6775,
        "netMargin": 0.0593,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 931.07,
        "operatingIncome": 151.26,
        "netIncome": 55.13,
        "eps": 0.0572,
        "assets": 2007.11,
        "liabilities": 792.87,
        "equity": 1214.24,
        "freeCashFlow": 34.19,
        "dividendPerShare": 0.0101,
        "per": 27.9,
        "pbr": 1.27,
        "dividendYield": 63e-4,
        "roe": 0.1816,
        "debtToEquity": 0.653,
        "netMargin": 0.0592,
        "revenueYoY": 0.1292
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 997.27,
        "operatingIncome": 134.21,
        "netIncome": 71.45,
        "eps": 0.0742,
        "assets": 2055.66,
        "liabilities": 801.78,
        "equity": 1253.88,
        "freeCashFlow": 71.83,
        "dividendPerShare": 89e-4,
        "per": 31.03,
        "pbr": 1.77,
        "dividendYield": 39e-4,
        "roe": 0.2279,
        "debtToEquity": 0.6394,
        "netMargin": 0.0716,
        "revenueYoY": 0.1604
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 1020.35,
        "operatingIncome": 151.99,
        "netIncome": 60.17,
        "eps": 0.0625,
        "assets": 2058.75,
        "liabilities": 828.89,
        "equity": 1229.86,
        "freeCashFlow": 53.83,
        "dividendPerShare": 87e-4,
        "per": 28.99,
        "pbr": 1.42,
        "dividendYield": 48e-4,
        "roe": 0.1957,
        "debtToEquity": 0.674,
        "netMargin": 0.059,
        "revenueYoY": 0.1692
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 1112.05,
        "operatingIncome": 166.09,
        "netIncome": 81.93,
        "eps": 0.0851,
        "assets": 2084.79,
        "liabilities": 829.36,
        "equity": 1255.43,
        "freeCashFlow": 63.99,
        "dividendPerShare": 92e-4,
        "per": 29.93,
        "pbr": 1.95,
        "dividendYield": 36e-4,
        "roe": 0.261,
        "debtToEquity": 0.6606,
        "netMargin": 0.0737,
        "revenueYoY": 0.1756
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 1136.13,
        "operatingIncome": 150.73,
        "netIncome": 67.1,
        "eps": 0.0697,
        "assets": 2098.95,
        "liabilities": 837.33,
        "equity": 1261.62,
        "freeCashFlow": 63,
        "dividendPerShare": 0.0101,
        "per": 30.97,
        "pbr": 1.65,
        "dividendYield": 47e-4,
        "roe": 0.2127,
        "debtToEquity": 0.6637,
        "netMargin": 0.0591,
        "revenueYoY": 0.2202
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 1216.49,
        "operatingIncome": 142.71,
        "netIncome": 61.98,
        "eps": 0.0644,
        "assets": 2131,
        "liabilities": 837.33,
        "equity": 1293.66,
        "freeCashFlow": 54.65,
        "dividendPerShare": 87e-4,
        "per": 31.28,
        "pbr": 1.5,
        "dividendYield": 43e-4,
        "roe": 0.1916,
        "debtToEquity": 0.6473,
        "netMargin": 0.0509,
        "revenueYoY": 0.2198
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 1280.51,
        "operatingIncome": 176.63,
        "netIncome": 90.59,
        "eps": 0.0941,
        "assets": 2189.68,
        "liabilities": 884.71,
        "equity": 1304.97,
        "freeCashFlow": 71.87,
        "dividendPerShare": 9e-3,
        "per": 28.96,
        "pbr": 2.01,
        "dividendYield": 33e-4,
        "roe": 0.2777,
        "debtToEquity": 0.678,
        "netMargin": 0.0707,
        "revenueYoY": 0.255
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 1398.65,
        "operatingIncome": 176.99,
        "netIncome": 66.74,
        "eps": 0.0693,
        "assets": 2238.48,
        "liabilities": 880.89,
        "equity": 1357.59,
        "freeCashFlow": 46.99,
        "dividendPerShare": 82e-4,
        "per": 31.16,
        "pbr": 1.53,
        "dividendYield": 38e-4,
        "roe": 0.1966,
        "debtToEquity": 0.6489,
        "netMargin": 0.0477,
        "revenueYoY": 0.2577
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 1452.29,
        "operatingIncome": 223.96,
        "netIncome": 118.47,
        "eps": 0.123,
        "assets": 2264.13,
        "liabilities": 889.7,
        "equity": 1374.43,
        "freeCashFlow": 108.89,
        "dividendPerShare": 0.0118,
        "per": 26.36,
        "pbr": 2.27,
        "dividendYield": 36e-4,
        "roe": 0.3448,
        "debtToEquity": 0.6473,
        "netMargin": 0.0816,
        "revenueYoY": 0.2783
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 1565.21,
        "operatingIncome": 179.67,
        "netIncome": 88.8,
        "eps": 0.0922,
        "assets": 2294.37,
        "liabilities": 935.22,
        "equity": 1359.15,
        "freeCashFlow": 76.3,
        "dividendPerShare": 0.0101,
        "per": 28.76,
        "pbr": 1.88,
        "dividendYield": 38e-4,
        "roe": 0.2614,
        "debtToEquity": 0.6881,
        "netMargin": 0.0567,
        "revenueYoY": 0.2867
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 1657.59,
        "operatingIncome": 224.37,
        "netIncome": 135.64,
        "eps": 0.1408,
        "assets": 2309.63,
        "liabilities": 963.88,
        "equity": 1345.76,
        "freeCashFlow": 82.12,
        "dividendPerShare": 0.0107,
        "per": 30.87,
        "pbr": 3.11,
        "dividendYield": 25e-4,
        "roe": 0.4032,
        "debtToEquity": 0.7162,
        "netMargin": 0.0818,
        "revenueYoY": 0.2945
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 1766.23,
        "operatingIncome": 224.8,
        "netIncome": 105.89,
        "eps": 0.11,
        "assets": 2340.25,
        "liabilities": 986.07,
        "equity": 1354.18,
        "freeCashFlow": 65.89,
        "dividendPerShare": 83e-4,
        "per": 23.3,
        "pbr": 1.82,
        "dividendYield": 32e-4,
        "roe": 0.3128,
        "debtToEquity": 0.7282,
        "netMargin": 0.06,
        "revenueYoY": 0.2628
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 1798.05,
        "operatingIncome": 223.49,
        "netIncome": 145.83,
        "eps": 0.1514,
        "assets": 2323.42,
        "liabilities": 993.01,
        "equity": 1330.42,
        "freeCashFlow": 126.72,
        "dividendPerShare": 0.0108,
        "per": 30.53,
        "pbr": 3.35,
        "dividendYield": 23e-4,
        "roe": 0.4384,
        "debtToEquity": 0.7464,
        "netMargin": 0.0811,
        "revenueYoY": 0.2381
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 1886,
        "operatingIncome": 237.28,
        "netIncome": 101.73,
        "eps": 0.1056,
        "assets": 2340.1,
        "liabilities": 1021.03,
        "equity": 1319.07,
        "freeCashFlow": 111.36,
        "dividendPerShare": 85e-4,
        "per": 29,
        "pbr": 2.24,
        "dividendYield": 28e-4,
        "roe": 0.3085,
        "debtToEquity": 0.7741,
        "netMargin": 0.0539,
        "revenueYoY": 0.205
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 1918.82,
        "operatingIncome": 286.79,
        "netIncome": 118.23,
        "eps": 0.1228,
        "assets": 2390.35,
        "liabilities": 1034.91,
        "equity": 1355.44,
        "freeCashFlow": 122.89,
        "dividendPerShare": 0.0109,
        "per": 25.93,
        "pbr": 2.26,
        "dividendYield": 34e-4,
        "roe": 0.3489,
        "debtToEquity": 0.7635,
        "netMargin": 0.0616,
        "revenueYoY": 0.1576
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 2093.83,
        "operatingIncome": 304.91,
        "netIncome": 138.25,
        "eps": 0.1435,
        "assets": 2403.53,
        "liabilities": 1057.29,
        "equity": 1346.24,
        "freeCashFlow": 148.95,
        "dividendPerShare": 0.0111,
        "per": 33.8,
        "pbr": 3.47,
        "dividendYield": 23e-4,
        "roe": 0.4108,
        "debtToEquity": 0.7854,
        "netMargin": 0.066,
        "revenueYoY": 0.1855
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 2082.93,
        "operatingIncome": 268.01,
        "netIncome": 131.93,
        "eps": 0.137,
        "assets": 2426.23,
        "liabilities": 1072.99,
        "equity": 1353.24,
        "freeCashFlow": 141.54,
        "dividendPerShare": 0.0113,
        "per": 31.32,
        "pbr": 3.05,
        "dividendYield": 26e-4,
        "roe": 0.39,
        "debtToEquity": 0.7929,
        "netMargin": 0.0633,
        "revenueYoY": 0.1584
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 2176.51,
        "operatingIncome": 302.48,
        "netIncome": 131.22,
        "eps": 0.1362,
        "assets": 2508.06,
        "liabilities": 1080.3,
        "equity": 1427.75,
        "freeCashFlow": 138.42,
        "dividendPerShare": 91e-4,
        "per": 29.72,
        "pbr": 2.73,
        "dividendYield": 23e-4,
        "roe": 0.3676,
        "debtToEquity": 0.7566,
        "netMargin": 0.0603,
        "revenueYoY": 0.154
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 2222.71,
        "operatingIncome": 376.95,
        "netIncome": 126.61,
        "eps": 0.1315,
        "assets": 2599.54,
        "liabilities": 1091.51,
        "equity": 1508.03,
        "freeCashFlow": 89.88,
        "dividendPerShare": 0.0102,
        "per": 32.92,
        "pbr": 2.76,
        "dividendYield": 23e-4,
        "roe": 0.3358,
        "debtToEquity": 0.7238,
        "netMargin": 0.057,
        "revenueYoY": 0.1584
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 2365.64,
        "operatingIncome": 335.11,
        "netIncome": 209.23,
        "eps": 0.2173,
        "assets": 2647.63,
        "liabilities": 1121.21,
        "equity": 1526.42,
        "freeCashFlow": 221,
        "dividendPerShare": 96e-4,
        "per": 33.76,
        "pbr": 4.63,
        "dividendYield": 13e-4,
        "roe": 0.5483,
        "debtToEquity": 0.7345,
        "netMargin": 0.0884,
        "revenueYoY": 0.1298
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 2359.68,
        "operatingIncome": 280.38,
        "netIncome": 153.78,
        "eps": 0.1597,
        "assets": 2668.54,
        "liabilities": 1116.03,
        "equity": 1552.51,
        "freeCashFlow": 163.01,
        "dividendPerShare": 97e-4,
        "per": 30.51,
        "pbr": 3.02,
        "dividendYield": 2e-3,
        "roe": 0.3962,
        "debtToEquity": 0.7189,
        "netMargin": 0.0652,
        "revenueYoY": 0.1329
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 2423.89,
        "operatingIncome": 319.99,
        "netIncome": 147.81,
        "eps": 0.1535,
        "assets": 2674.89,
        "liabilities": 1104.76,
        "equity": 1570.13,
        "freeCashFlow": 105.09,
        "dividendPerShare": 82e-4,
        "per": 33.27,
        "pbr": 3.13,
        "dividendYield": 16e-4,
        "roe": 0.3766,
        "debtToEquity": 0.7036,
        "netMargin": 0.061,
        "revenueYoY": 0.1137
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 2358.51,
        "operatingIncome": 236.31,
        "netIncome": 103.22,
        "eps": 0.1072,
        "assets": 2737.96,
        "liabilities": 1144.26,
        "equity": 1593.7,
        "freeCashFlow": 110.54,
        "dividendPerShare": 0.0116,
        "per": 31.91,
        "pbr": 2.07,
        "dividendYield": 34e-4,
        "roe": 0.2591,
        "debtToEquity": 0.718,
        "netMargin": 0.0438,
        "revenueYoY": 0.0611
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 2434.97,
        "operatingIncome": 300.71,
        "netIncome": 133.6,
        "eps": 0.1387,
        "assets": 2798.22,
        "liabilities": 1124.94,
        "equity": 1673.28,
        "freeCashFlow": 92.15,
        "dividendPerShare": 0.0117,
        "per": 29.25,
        "pbr": 2.34,
        "dividendYield": 29e-4,
        "roe": 0.3194,
        "debtToEquity": 0.6723,
        "netMargin": 0.0549,
        "revenueYoY": 0.0293
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 2374.11,
        "operatingIncome": 290.72,
        "netIncome": 124.43,
        "eps": 0.1292,
        "assets": 2799.02,
        "liabilities": 1097.05,
        "equity": 1701.97,
        "freeCashFlow": 120.37,
        "dividendPerShare": 0.0111,
        "per": 31.03,
        "pbr": 2.27,
        "dividendYield": 28e-4,
        "roe": 0.2924,
        "debtToEquity": 0.6446,
        "netMargin": 0.0524,
        "revenueYoY": 61e-4
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 2416.82,
        "operatingIncome": 278.08,
        "netIncome": 144.22,
        "eps": 0.1497,
        "assets": 2824.82,
        "liabilities": 1085.93,
        "equity": 1738.89,
        "freeCashFlow": 134.67,
        "dividendPerShare": 91e-4,
        "per": 37.11,
        "pbr": 3.08,
        "dividendYield": 16e-4,
        "roe": 0.3318,
        "debtToEquity": 0.6245,
        "netMargin": 0.0597,
        "revenueYoY": -29e-4
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 2383,
        "operatingIncome": 288.32,
        "netIncome": 162.41,
        "eps": 0.1686,
        "assets": 2857.75,
        "liabilities": 1136.16,
        "equity": 1721.58,
        "freeCashFlow": 153.16,
        "dividendPerShare": 0.0105,
        "per": 28.88,
        "pbr": 2.72,
        "dividendYield": 22e-4,
        "roe": 0.3773,
        "debtToEquity": 0.66,
        "netMargin": 0.0682,
        "revenueYoY": 0.0104
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 2456.2,
        "operatingIncome": 298.24,
        "netIncome": 142.62,
        "eps": 0.1481,
        "assets": 2903.07,
        "liabilities": 1139.06,
        "equity": 1764.01,
        "freeCashFlow": 117.1,
        "dividendPerShare": 95e-4,
        "per": 33.9,
        "pbr": 2.74,
        "dividendYield": 19e-4,
        "roe": 0.3234,
        "debtToEquity": 0.6457,
        "netMargin": 0.0581,
        "revenueYoY": 87e-4
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 2355.88,
        "operatingIncome": 329.52,
        "netIncome": 169.98,
        "eps": 0.1765,
        "assets": 2944.35,
        "liabilities": 1130.13,
        "equity": 1814.21,
        "freeCashFlow": 161.6,
        "dividendPerShare": 98e-4,
        "per": 34.37,
        "pbr": 3.22,
        "dividendYield": 16e-4,
        "roe": 0.3748,
        "debtToEquity": 0.6229,
        "netMargin": 0.0721,
        "revenueYoY": -77e-4
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 2364.93,
        "operatingIncome": 246.77,
        "netIncome": 159.58,
        "eps": 0.1657,
        "assets": 2976.32,
        "liabilities": 1113.34,
        "equity": 1862.99,
        "freeCashFlow": 133.12,
        "dividendPerShare": 82e-4,
        "per": 30.8,
        "pbr": 2.64,
        "dividendYield": 16e-4,
        "roe": 0.3426,
        "debtToEquity": 0.5976,
        "netMargin": 0.0675,
        "revenueYoY": -0.0215
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 2324.74,
        "operatingIncome": 243.32,
        "netIncome": 83.86,
        "eps": 0.0871,
        "assets": 2995.06,
        "liabilities": 1104.43,
        "equity": 1890.63,
        "freeCashFlow": 74.94,
        "dividendPerShare": 0.0105,
        "per": 26.55,
        "pbr": 1.18,
        "dividendYield": 46e-4,
        "roe": 0.1774,
        "debtToEquity": 0.5842,
        "netMargin": 0.0361,
        "revenueYoY": -0.0245
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 2380.42,
        "operatingIncome": 332.81,
        "netIncome": 98.96,
        "eps": 0.1027,
        "assets": 3034.43,
        "liabilities": 1149.76,
        "equity": 1884.67,
        "freeCashFlow": 62.59,
        "dividendPerShare": 99e-4,
        "per": 32.59,
        "pbr": 1.71,
        "dividendYield": 29e-4,
        "roe": 0.21,
        "debtToEquity": 0.6101,
        "netMargin": 0.0416,
        "revenueYoY": -0.0309
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 2284.59,
        "operatingIncome": 298.2,
        "netIncome": 170.98,
        "eps": 0.1775,
        "assets": 3068.62,
        "liabilities": 1153.89,
        "equity": 1914.73,
        "freeCashFlow": 180.03,
        "dividendPerShare": 96e-4,
        "per": 27.34,
        "pbr": 2.44,
        "dividendYield": 2e-3,
        "roe": 0.3572,
        "debtToEquity": 0.6026,
        "netMargin": 0.0748,
        "revenueYoY": -0.0303
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 2294.19,
        "operatingIncome": 281.86,
        "netIncome": 164.55,
        "eps": 0.1709,
        "assets": 3103.02,
        "liabilities": 1217.73,
        "equity": 1885.29,
        "freeCashFlow": 162.66,
        "dividendPerShare": 94e-4,
        "per": 30.11,
        "pbr": 2.63,
        "dividendYield": 18e-4,
        "roe": 0.3491,
        "debtToEquity": 0.6459,
        "netMargin": 0.0717,
        "revenueYoY": -0.0299
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 2323.82,
        "operatingIncome": 290.97,
        "netIncome": 180.91,
        "eps": 0.1878,
        "assets": 3101.38,
        "liabilities": 1249.72,
        "equity": 1851.65,
        "freeCashFlow": 130.57,
        "dividendPerShare": 0.0111,
        "per": 27.58,
        "pbr": 2.69,
        "dividendYield": 21e-4,
        "roe": 0.3908,
        "debtToEquity": 0.6749,
        "netMargin": 0.0778,
        "revenueYoY": -4e-4
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 2476.79,
        "operatingIncome": 289.25,
        "netIncome": 112.46,
        "eps": 0.1168,
        "assets": 3172.47,
        "liabilities": 1298.81,
        "equity": 1873.67,
        "freeCashFlow": 80.17,
        "dividendPerShare": 0.0112,
        "per": 26.94,
        "pbr": 1.62,
        "dividendYield": 36e-4,
        "roe": 0.2401,
        "debtToEquity": 0.6932,
        "netMargin": 0.0454,
        "revenueYoY": 0.0405
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 3502.58,
        "operatingIncome": 452.86,
        "netIncome": 212.57,
        "freeCashFlow": 154.53,
        "dividendPerShare": 0.0373,
        "assets": 1978.96,
        "liabilities": 799.25,
        "equity": 1179.71,
        "per": 28.94,
        "pbr": 1.38,
        "dividendYield": 56e-4,
        "roe": 0.1802,
        "debtToEquity": 0.6775,
        "netMargin": 0.0607
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 4060.74,
        "operatingIncome": 603.55,
        "netIncome": 268.67,
        "freeCashFlow": 223.83,
        "dividendPerShare": 0.037,
        "assets": 2084.79,
        "liabilities": 829.36,
        "equity": 1255.43,
        "per": 29.93,
        "pbr": 1.95,
        "dividendYield": 36e-4,
        "roe": 0.214,
        "debtToEquity": 0.6606,
        "netMargin": 0.0662
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 5031.78,
        "operatingIncome": 647.05,
        "netIncome": 286.41,
        "freeCashFlow": 236.51,
        "dividendPerShare": 0.0361,
        "assets": 2238.48,
        "liabilities": 880.89,
        "equity": 1357.59,
        "per": 31.16,
        "pbr": 1.53,
        "dividendYield": 38e-4,
        "roe": 0.211,
        "debtToEquity": 0.6489,
        "netMargin": 0.0569
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 6441.32,
        "operatingIncome": 852.81,
        "netIncome": 448.81,
        "freeCashFlow": 333.21,
        "dividendPerShare": 0.0409,
        "assets": 2340.25,
        "liabilities": 986.07,
        "equity": 1354.18,
        "per": 23.3,
        "pbr": 1.82,
        "dividendYield": 32e-4,
        "roe": 0.3314,
        "debtToEquity": 0.7282,
        "netMargin": 0.0697
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 7696.69,
        "operatingIncome": 1052.47,
        "netIncome": 504.04,
        "freeCashFlow": 509.92,
        "dividendPerShare": 0.0413,
        "assets": 2403.53,
        "liabilities": 1057.29,
        "equity": 1346.24,
        "per": 33.8,
        "pbr": 3.47,
        "dividendYield": 23e-4,
        "roe": 0.3744,
        "debtToEquity": 0.7854,
        "netMargin": 0.0655
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 8847.78,
        "operatingIncome": 1282.56,
        "netIncome": 598.99,
        "freeCashFlow": 590.84,
        "dividendPerShare": 0.0402,
        "assets": 2647.63,
        "liabilities": 1121.21,
        "equity": 1526.42,
        "per": 33.76,
        "pbr": 4.63,
        "dividendYield": 13e-4,
        "roe": 0.3924,
        "debtToEquity": 0.7345,
        "netMargin": 0.0677
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 9577.05,
        "operatingIncome": 1137.39,
        "netIncome": 538.42,
        "freeCashFlow": 470.79,
        "dividendPerShare": 0.0412,
        "assets": 2798.22,
        "liabilities": 1124.94,
        "equity": 1673.28,
        "per": 29.25,
        "pbr": 2.34,
        "dividendYield": 29e-4,
        "roe": 0.3218,
        "debtToEquity": 0.6723,
        "netMargin": 0.0562
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 9630.13,
        "operatingIncome": 1155.36,
        "netIncome": 573.68,
        "freeCashFlow": 525.3,
        "dividendPerShare": 0.0401,
        "assets": 2903.07,
        "liabilities": 1139.06,
        "equity": 1764.01,
        "per": 33.9,
        "pbr": 2.74,
        "dividendYield": 19e-4,
        "roe": 0.3252,
        "debtToEquity": 0.6457,
        "netMargin": 0.0596
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 9425.97,
        "operatingIncome": 1152.41,
        "netIncome": 512.37,
        "freeCashFlow": 432.25,
        "dividendPerShare": 0.0384,
        "assets": 3034.43,
        "liabilities": 1149.76,
        "equity": 1884.67,
        "per": 32.59,
        "pbr": 1.71,
        "dividendYield": 29e-4,
        "roe": 0.2719,
        "debtToEquity": 0.6101,
        "netMargin": 0.0544
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 9379.39,
        "operatingIncome": 1160.28,
        "netIncome": 628.89,
        "freeCashFlow": 553.42,
        "dividendPerShare": 0.0414,
        "assets": 3172.47,
        "liabilities": 1298.81,
        "equity": 1873.67,
        "per": 26.94,
        "pbr": 1.62,
        "dividendYield": 36e-4,
        "roe": 0.3356,
        "debtToEquity": 0.6932,
        "netMargin": 0.0671
      }
    ]
  },
  "ENR": {
    "symbol": "ENR",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 2784.21,
        "operatingIncome": 482.49,
        "netIncome": 255.38,
        "eps": 0.5397,
        "assets": 6396.16,
        "liabilities": 2688.5,
        "equity": 3707.66,
        "freeCashFlow": 180.62,
        "dividendPerShare": 0.1604,
        "per": 14.24,
        "pbr": 0.98,
        "dividendYield": 0.0209,
        "roe": 0.2755,
        "debtToEquity": 0.7251,
        "netMargin": 0.0917,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 2943.86,
        "operatingIncome": 448.97,
        "netIncome": 290.94,
        "eps": 0.6149,
        "assets": 6379.68,
        "liabilities": 2599.79,
        "equity": 3779.89,
        "freeCashFlow": 215.15,
        "dividendPerShare": 0.2114,
        "per": 15.7,
        "pbr": 1.21,
        "dividendYield": 0.0219,
        "roe": 0.3079,
        "debtToEquity": 0.6878,
        "netMargin": 0.0988,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 2962.16,
        "operatingIncome": 567.03,
        "netIncome": 271.2,
        "eps": 0.5731,
        "assets": 6422.17,
        "liabilities": 2631.88,
        "equity": 3790.29,
        "freeCashFlow": 231.37,
        "dividendPerShare": 0.2043,
        "per": 14.03,
        "pbr": 1,
        "dividendYield": 0.0254,
        "roe": 0.2862,
        "debtToEquity": 0.6944,
        "netMargin": 0.0916,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 3159.92,
        "operatingIncome": 481.08,
        "netIncome": 325.2,
        "eps": 0.6873,
        "assets": 6503.18,
        "liabilities": 2677.62,
        "equity": 3825.56,
        "freeCashFlow": 216.67,
        "dividendPerShare": 0.1533,
        "per": 19.2,
        "pbr": 1.63,
        "dividendYield": 0.0116,
        "roe": 0.34,
        "debtToEquity": 0.6999,
        "netMargin": 0.1029,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 3100.95,
        "operatingIncome": 554.63,
        "netIncome": 314.32,
        "eps": 0.6643,
        "assets": 6628.32,
        "liabilities": 2669.9,
        "equity": 3958.42,
        "freeCashFlow": 309.3,
        "dividendPerShare": 0.1952,
        "per": 16.59,
        "pbr": 1.32,
        "dividendYield": 0.0177,
        "roe": 0.3176,
        "debtToEquity": 0.6745,
        "netMargin": 0.1014,
        "revenueYoY": 0.1138
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 3276.62,
        "operatingIncome": 555.01,
        "netIncome": 386.33,
        "eps": 0.8164,
        "assets": 6733.59,
        "liabilities": 2622.63,
        "equity": 4110.95,
        "freeCashFlow": 311.43,
        "dividendPerShare": 0.152,
        "per": 14.62,
        "pbr": 1.37,
        "dividendYield": 0.0127,
        "roe": 0.3759,
        "debtToEquity": 0.638,
        "netMargin": 0.1179,
        "revenueYoY": 0.113
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 3449.87,
        "operatingIncome": 614.42,
        "netIncome": 440.82,
        "eps": 0.9316,
        "assets": 6808.7,
        "liabilities": 2547.09,
        "equity": 4261.61,
        "freeCashFlow": 323.91,
        "dividendPerShare": 0.1878,
        "per": 14.12,
        "pbr": 1.46,
        "dividendYield": 0.0143,
        "roe": 0.4138,
        "debtToEquity": 0.5977,
        "netMargin": 0.1278,
        "revenueYoY": 0.1646
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 3688.67,
        "operatingIncome": 687.99,
        "netIncome": 386.91,
        "eps": 0.8177,
        "assets": 6775.08,
        "liabilities": 2534.82,
        "equity": 4240.26,
        "freeCashFlow": 400.85,
        "dividendPerShare": 0.1871,
        "per": 16.41,
        "pbr": 1.5,
        "dividendYield": 0.0139,
        "roe": 0.365,
        "debtToEquity": 0.5978,
        "netMargin": 0.1049,
        "revenueYoY": 0.1673
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 3733.78,
        "operatingIncome": 703.4,
        "netIncome": 377.54,
        "eps": 0.7979,
        "assets": 6854.42,
        "liabilities": 2600.78,
        "equity": 4253.64,
        "freeCashFlow": 287.64,
        "dividendPerShare": 0.2006,
        "per": 16.29,
        "pbr": 1.45,
        "dividendYield": 0.0154,
        "roe": 0.355,
        "debtToEquity": 0.6114,
        "netMargin": 0.1011,
        "revenueYoY": 0.2041
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 4132.5,
        "operatingIncome": 714.18,
        "netIncome": 403.05,
        "eps": 0.8518,
        "assets": 6916.72,
        "liabilities": 2639.41,
        "equity": 4277.31,
        "freeCashFlow": 316.71,
        "dividendPerShare": 0.1774,
        "per": 15.39,
        "pbr": 1.45,
        "dividendYield": 0.0135,
        "roe": 0.3769,
        "debtToEquity": 0.6171,
        "netMargin": 0.0975,
        "revenueYoY": 0.2612
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 4249.3,
        "operatingIncome": 809.63,
        "netIncome": 441.52,
        "eps": 0.9331,
        "assets": 7047.46,
        "liabilities": 2587.9,
        "equity": 4459.56,
        "freeCashFlow": 422.5,
        "dividendPerShare": 0.1889,
        "per": 16.52,
        "pbr": 1.64,
        "dividendYield": 0.0123,
        "roe": 0.396,
        "debtToEquity": 0.5803,
        "netMargin": 0.1039,
        "revenueYoY": 0.2317
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 4612.09,
        "operatingIncome": 886.34,
        "netIncome": 463.67,
        "eps": 0.9799,
        "assets": 7091.02,
        "liabilities": 2575.43,
        "equity": 4515.59,
        "freeCashFlow": 354.19,
        "dividendPerShare": 0.1643,
        "per": 15.55,
        "pbr": 1.6,
        "dividendYield": 0.0108,
        "roe": 0.4107,
        "debtToEquity": 0.5703,
        "netMargin": 0.1005,
        "revenueYoY": 0.2503
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 4613.35,
        "operatingIncome": 783.42,
        "netIncome": 435.58,
        "eps": 0.9205,
        "assets": 7126.56,
        "liabilities": 2720.08,
        "equity": 4406.49,
        "freeCashFlow": 382.95,
        "dividendPerShare": 0.1896,
        "per": 16.34,
        "pbr": 1.62,
        "dividendYield": 0.0126,
        "roe": 0.3954,
        "debtToEquity": 0.6173,
        "netMargin": 0.0944,
        "revenueYoY": 0.2356
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 4859.54,
        "operatingIncome": 953.28,
        "netIncome": 559.81,
        "eps": 1.183,
        "assets": 7005.77,
        "liabilities": 2608.66,
        "equity": 4397.11,
        "freeCashFlow": 407.24,
        "dividendPerShare": 0.168,
        "per": 11.27,
        "pbr": 1.43,
        "dividendYield": 0.0126,
        "roe": 0.5093,
        "debtToEquity": 0.5933,
        "netMargin": 0.1152,
        "revenueYoY": 0.1759
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 5116.83,
        "operatingIncome": 954,
        "netIncome": 543.56,
        "eps": 1.1487,
        "assets": 7025.54,
        "liabilities": 2601,
        "equity": 4424.54,
        "freeCashFlow": 595.54,
        "dividendPerShare": 0.149,
        "per": 15.23,
        "pbr": 1.87,
        "dividendYield": 85e-4,
        "roe": 0.4914,
        "debtToEquity": 0.5879,
        "netMargin": 0.1062,
        "revenueYoY": 0.2042
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 5438.35,
        "operatingIncome": 1015.53,
        "netIncome": 567.64,
        "eps": 1.1996,
        "assets": 7073.28,
        "liabilities": 2405.52,
        "equity": 4667.76,
        "freeCashFlow": 538.9,
        "dividendPerShare": 0.1877,
        "per": 16.96,
        "pbr": 2.06,
        "dividendYield": 92e-4,
        "roe": 0.4864,
        "debtToEquity": 0.5153,
        "netMargin": 0.1044,
        "revenueYoY": 0.1791
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 5437.63,
        "operatingIncome": 954.3,
        "netIncome": 555.82,
        "eps": 1.1746,
        "assets": 7146.5,
        "liabilities": 2376.18,
        "equity": 4770.32,
        "freeCashFlow": 431.64,
        "dividendPerShare": 0.1684,
        "per": 16.76,
        "pbr": 1.95,
        "dividendYield": 86e-4,
        "roe": 0.4661,
        "debtToEquity": 0.4981,
        "netMargin": 0.1022,
        "revenueYoY": 0.1787
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 5766.53,
        "operatingIncome": 1056.63,
        "netIncome": 512.44,
        "eps": 1.0829,
        "assets": 7071.78,
        "liabilities": 2408.19,
        "equity": 4663.59,
        "freeCashFlow": 471.05,
        "dividendPerShare": 0.2013,
        "per": 19.21,
        "pbr": 2.11,
        "dividendYield": 97e-4,
        "roe": 0.4395,
        "debtToEquity": 0.5164,
        "netMargin": 0.0889,
        "revenueYoY": 0.1866
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 5852.8,
        "operatingIncome": 1168.68,
        "netIncome": 674.57,
        "eps": 1.4256,
        "assets": 7164.02,
        "liabilities": 2433.24,
        "equity": 4730.78,
        "freeCashFlow": 724.4,
        "dividendPerShare": 0.1954,
        "per": 16.29,
        "pbr": 2.32,
        "dividendYield": 84e-4,
        "roe": 0.5704,
        "debtToEquity": 0.5143,
        "netMargin": 0.1153,
        "revenueYoY": 0.1438
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 6206.12,
        "operatingIncome": 1075.38,
        "netIncome": 532.35,
        "eps": 1.125,
        "assets": 7232.2,
        "liabilities": 2356.54,
        "equity": 4875.66,
        "freeCashFlow": 465.32,
        "dividendPerShare": 0.1806,
        "per": 16.15,
        "pbr": 1.76,
        "dividendYield": 99e-4,
        "roe": 0.4367,
        "debtToEquity": 0.4833,
        "netMargin": 0.0858,
        "revenueYoY": 0.1412
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 6240.63,
        "operatingIncome": 1039.94,
        "netIncome": 776.41,
        "eps": 1.6408,
        "assets": 7318.79,
        "liabilities": 2395.37,
        "equity": 4923.41,
        "freeCashFlow": 849.18,
        "dividendPerShare": 0.1868,
        "per": 14.42,
        "pbr": 2.27,
        "dividendYield": 79e-4,
        "roe": 0.6308,
        "debtToEquity": 0.4865,
        "netMargin": 0.1244,
        "revenueYoY": 0.1477
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 6323.62,
        "operatingIncome": 1104.58,
        "netIncome": 668.42,
        "eps": 1.4126,
        "assets": 7413.66,
        "liabilities": 2438.21,
        "equity": 4975.45,
        "freeCashFlow": 410.74,
        "dividendPerShare": 0.1856,
        "per": 14.5,
        "pbr": 1.95,
        "dividendYield": 91e-4,
        "roe": 0.5374,
        "debtToEquity": 0.49,
        "netMargin": 0.1057,
        "revenueYoY": 0.0966
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 6216.71,
        "operatingIncome": 922.17,
        "netIncome": 522.43,
        "eps": 1.104,
        "assets": 7538.81,
        "liabilities": 2350.29,
        "equity": 5188.52,
        "freeCashFlow": 445.45,
        "dividendPerShare": 0.2006,
        "per": 17.72,
        "pbr": 1.78,
        "dividendYield": 0.0103,
        "roe": 0.4028,
        "debtToEquity": 0.453,
        "netMargin": 0.084,
        "revenueYoY": 0.0622
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 6679.56,
        "operatingIncome": 1154.68,
        "netIncome": 643.18,
        "eps": 1.3592,
        "assets": 7554.16,
        "liabilities": 2328.99,
        "equity": 5225.17,
        "freeCashFlow": 558.78,
        "dividendPerShare": 0.1881,
        "per": 17.84,
        "pbr": 2.2,
        "dividendYield": 78e-4,
        "roe": 0.4924,
        "debtToEquity": 0.4457,
        "netMargin": 0.0963,
        "revenueYoY": 0.0763
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 6325.24,
        "operatingIncome": 1079.17,
        "netIncome": 537.94,
        "eps": 1.1368,
        "assets": 7515.29,
        "liabilities": 2336.36,
        "equity": 5178.93,
        "freeCashFlow": 549.02,
        "dividendPerShare": 0.1746,
        "per": 14.29,
        "pbr": 1.48,
        "dividendYield": 0.0107,
        "roe": 0.4155,
        "debtToEquity": 0.4511,
        "netMargin": 0.085,
        "revenueYoY": 0.0136
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 6373.11,
        "operatingIncome": 1155.09,
        "netIncome": 471.52,
        "eps": 0.9965,
        "assets": 7612.94,
        "liabilities": 2412.63,
        "equity": 5200.31,
        "freeCashFlow": 292.34,
        "dividendPerShare": 0.1868,
        "per": 16.81,
        "pbr": 1.52,
        "dividendYield": 0.0112,
        "roe": 0.3627,
        "debtToEquity": 0.4639,
        "netMargin": 0.074,
        "revenueYoY": 78e-4
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 6492.56,
        "operatingIncome": 993.51,
        "netIncome": 689.57,
        "eps": 1.4573,
        "assets": 7563.45,
        "liabilities": 2338.87,
        "equity": 5224.58,
        "freeCashFlow": 660.3,
        "dividendPerShare": 0.1943,
        "per": 12.38,
        "pbr": 1.63,
        "dividendYield": 0.0108,
        "roe": 0.5279,
        "debtToEquity": 0.4477,
        "netMargin": 0.1062,
        "revenueYoY": 0.0444
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 6789.28,
        "operatingIncome": 1222.91,
        "netIncome": 743.69,
        "eps": 1.5716,
        "assets": 7466.55,
        "liabilities": 2287.03,
        "equity": 5179.52,
        "freeCashFlow": 508.95,
        "dividendPerShare": 0.1785,
        "per": 17.43,
        "pbr": 2.5,
        "dividendYield": 65e-4,
        "roe": 0.5743,
        "debtToEquity": 0.4416,
        "netMargin": 0.1095,
        "revenueYoY": 0.0164
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 6356.51,
        "operatingIncome": 1044.48,
        "netIncome": 549.35,
        "eps": 1.1609,
        "assets": 7613.96,
        "liabilities": 2420.2,
        "equity": 5193.76,
        "freeCashFlow": 393.57,
        "dividendPerShare": 0.1849,
        "per": 14.48,
        "pbr": 1.53,
        "dividendYield": 0.011,
        "roe": 0.4231,
        "debtToEquity": 0.466,
        "netMargin": 0.0864,
        "revenueYoY": 49e-4
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 6341.1,
        "operatingIncome": 1065.34,
        "netIncome": 634.87,
        "eps": 1.3417,
        "assets": 7588.13,
        "liabilities": 2357.51,
        "equity": 5230.61,
        "freeCashFlow": 438.98,
        "dividendPerShare": 0.2003,
        "per": 15.82,
        "pbr": 1.92,
        "dividendYield": 94e-4,
        "roe": 0.4855,
        "debtToEquity": 0.4507,
        "netMargin": 0.1001,
        "revenueYoY": -5e-3
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 6176,
        "operatingIncome": 956.33,
        "netIncome": 668.14,
        "eps": 1.412,
        "assets": 7596.51,
        "liabilities": 2344.89,
        "equity": 5251.62,
        "freeCashFlow": 585.15,
        "dividendPerShare": 0.1874,
        "per": 16.56,
        "pbr": 2.11,
        "dividendYield": 8e-3,
        "roe": 0.5089,
        "debtToEquity": 0.4465,
        "netMargin": 0.1082,
        "revenueYoY": -0.0488
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 6411.66,
        "operatingIncome": 923.68,
        "netIncome": 582.79,
        "eps": 1.2316,
        "assets": 7617.4,
        "liabilities": 2235.76,
        "equity": 5381.64,
        "freeCashFlow": 624.36,
        "dividendPerShare": 0.1894,
        "per": 16.23,
        "pbr": 1.76,
        "dividendYield": 95e-4,
        "roe": 0.4332,
        "debtToEquity": 0.4154,
        "netMargin": 0.0909,
        "revenueYoY": -0.0556
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 6125.03,
        "operatingIncome": 966.05,
        "netIncome": 535.52,
        "eps": 1.1317,
        "assets": 7706.68,
        "liabilities": 2210.15,
        "equity": 5496.52,
        "freeCashFlow": 465.93,
        "dividendPerShare": 0.1805,
        "per": 18.02,
        "pbr": 1.76,
        "dividendYield": 88e-4,
        "roe": 0.3897,
        "debtToEquity": 0.4021,
        "netMargin": 0.0874,
        "revenueYoY": -0.0364
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 6253.9,
        "operatingIncome": 993.52,
        "netIncome": 575.82,
        "eps": 1.2169,
        "assets": 7774.28,
        "liabilities": 2263.68,
        "equity": 5510.59,
        "freeCashFlow": 410.81,
        "dividendPerShare": 0.1913,
        "per": 14.21,
        "pbr": 1.48,
        "dividendYield": 0.0111,
        "roe": 0.418,
        "debtToEquity": 0.4108,
        "netMargin": 0.0921,
        "revenueYoY": -0.0138
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 6019.84,
        "operatingIncome": 978.13,
        "netIncome": 517.17,
        "eps": 1.0929,
        "assets": 7790.41,
        "liabilities": 2255.86,
        "equity": 5534.55,
        "freeCashFlow": 321.68,
        "dividendPerShare": 0.1638,
        "per": 16.4,
        "pbr": 1.53,
        "dividendYield": 91e-4,
        "roe": 0.3738,
        "debtToEquity": 0.4076,
        "netMargin": 0.0859,
        "revenueYoY": -0.0253
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 6191.11,
        "operatingIncome": 848.01,
        "netIncome": 450.23,
        "eps": 0.9515,
        "assets": 7843.52,
        "liabilities": 2429.61,
        "equity": 5413.92,
        "freeCashFlow": 469.91,
        "dividendPerShare": 0.1795,
        "per": 17.25,
        "pbr": 1.43,
        "dividendYield": 0.0109,
        "roe": 0.3326,
        "debtToEquity": 0.4488,
        "netMargin": 0.0727,
        "revenueYoY": -0.0344
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 5875.29,
        "operatingIncome": 963.73,
        "netIncome": 687.86,
        "eps": 1.4537,
        "assets": 8023,
        "liabilities": 2309.93,
        "equity": 5713.07,
        "freeCashFlow": 548.69,
        "dividendPerShare": 0.2022,
        "per": 17.13,
        "pbr": 2.06,
        "dividendYield": 81e-4,
        "roe": 0.4816,
        "debtToEquity": 0.4043,
        "netMargin": 0.1171,
        "revenueYoY": -0.0408
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 5990.71,
        "operatingIncome": 842.8,
        "netIncome": 557.96,
        "eps": 1.1791,
        "assets": 8109.38,
        "liabilities": 2443.93,
        "equity": 5665.45,
        "freeCashFlow": 386.79,
        "dividendPerShare": 0.1761,
        "per": 17.52,
        "pbr": 1.73,
        "dividendYield": 85e-4,
        "roe": 0.3939,
        "debtToEquity": 0.4314,
        "netMargin": 0.0931,
        "revenueYoY": -0.0421
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 5790.47,
        "operatingIncome": 943.33,
        "netIncome": 511.9,
        "eps": 1.0818,
        "assets": 8184.51,
        "liabilities": 2406.15,
        "equity": 5778.36,
        "freeCashFlow": 397.48,
        "dividendPerShare": 0.1551,
        "per": 16.28,
        "pbr": 1.44,
        "dividendYield": 88e-4,
        "roe": 0.3544,
        "debtToEquity": 0.4164,
        "netMargin": 0.0884,
        "revenueYoY": -0.0381
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 5846.73,
        "operatingIncome": 1081.7,
        "netIncome": 558.42,
        "eps": 1.1801,
        "assets": 8278.54,
        "liabilities": 2450.36,
        "equity": 5828.19,
        "freeCashFlow": 473.53,
        "dividendPerShare": 0.1828,
        "per": 12.5,
        "pbr": 1.2,
        "dividendYield": 0.0124,
        "roe": 0.3833,
        "debtToEquity": 0.4204,
        "netMargin": 0.0955,
        "revenueYoY": -0.0556
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 11850.15,
        "operatingIncome": 1979.57,
        "netIncome": 1142.72,
        "freeCashFlow": 843.82,
        "dividendPerShare": 0.7293,
        "assets": 6503.18,
        "liabilities": 2677.62,
        "equity": 3825.56,
        "per": 19.2,
        "pbr": 1.63,
        "dividendYield": 0.0116,
        "roe": 0.2987,
        "debtToEquity": 0.6999,
        "netMargin": 0.0964
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 13516.11,
        "operatingIncome": 2412.05,
        "netIncome": 1528.39,
        "freeCashFlow": 1345.48,
        "dividendPerShare": 0.7221,
        "assets": 6775.08,
        "liabilities": 2534.82,
        "equity": 4240.26,
        "per": 16.41,
        "pbr": 1.5,
        "dividendYield": 0.0139,
        "roe": 0.3604,
        "debtToEquity": 0.5978,
        "netMargin": 0.1131
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 16727.68,
        "operatingIncome": 3113.54,
        "netIncome": 1685.77,
        "freeCashFlow": 1381.04,
        "dividendPerShare": 0.7312,
        "assets": 7091.02,
        "liabilities": 2575.43,
        "equity": 4515.59,
        "per": 15.55,
        "pbr": 1.6,
        "dividendYield": 0.0108,
        "roe": 0.3733,
        "debtToEquity": 0.5703,
        "netMargin": 0.1008
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 20028.07,
        "operatingIncome": 3706.23,
        "netIncome": 2106.59,
        "freeCashFlow": 1924.63,
        "dividendPerShare": 0.6944,
        "assets": 7073.28,
        "liabilities": 2405.52,
        "equity": 4667.76,
        "per": 16.96,
        "pbr": 2.06,
        "dividendYield": 92e-4,
        "roe": 0.4513,
        "debtToEquity": 0.5153,
        "netMargin": 0.1052
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 23263.08,
        "operatingIncome": 4254.98,
        "netIncome": 2275.18,
        "freeCashFlow": 2092.41,
        "dividendPerShare": 0.7458,
        "assets": 7232.2,
        "liabilities": 2356.54,
        "equity": 4875.66,
        "per": 16.15,
        "pbr": 1.76,
        "dividendYield": 99e-4,
        "roe": 0.4666,
        "debtToEquity": 0.4833,
        "netMargin": 0.0978
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 25460.52,
        "operatingIncome": 4221.37,
        "netIncome": 2610.44,
        "freeCashFlow": 2264.15,
        "dividendPerShare": 0.7611,
        "assets": 7554.16,
        "liabilities": 2328.99,
        "equity": 5225.17,
        "per": 17.84,
        "pbr": 2.2,
        "dividendYield": 78e-4,
        "roe": 0.4996,
        "debtToEquity": 0.4457,
        "netMargin": 0.1025
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 25980.19,
        "operatingIncome": 4450.69,
        "netIncome": 2442.72,
        "freeCashFlow": 2010.6,
        "dividendPerShare": 0.7341,
        "assets": 7466.55,
        "liabilities": 2287.03,
        "equity": 5179.52,
        "per": 17.43,
        "pbr": 2.5,
        "dividendYield": 65e-4,
        "roe": 0.4716,
        "debtToEquity": 0.4416,
        "netMargin": 0.094
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 25285.28,
        "operatingIncome": 3989.83,
        "netIncome": 2435.15,
        "freeCashFlow": 2042.06,
        "dividendPerShare": 0.762,
        "assets": 7617.4,
        "liabilities": 2235.76,
        "equity": 5381.64,
        "per": 16.23,
        "pbr": 1.76,
        "dividendYield": 95e-4,
        "roe": 0.4525,
        "debtToEquity": 0.4154,
        "netMargin": 0.0963
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 24589.87,
        "operatingIncome": 3785.7,
        "netIncome": 2078.74,
        "freeCashFlow": 1668.33,
        "dividendPerShare": 0.7151,
        "assets": 7843.52,
        "liabilities": 2429.61,
        "equity": 5413.92,
        "per": 17.25,
        "pbr": 1.43,
        "dividendYield": 0.0109,
        "roe": 0.384,
        "debtToEquity": 0.4488,
        "netMargin": 0.0845
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 23503.2,
        "operatingIncome": 3831.56,
        "netIncome": 2316.13,
        "freeCashFlow": 1806.49,
        "dividendPerShare": 0.7162,
        "assets": 8278.54,
        "liabilities": 2450.36,
        "equity": 5828.19,
        "per": 12.5,
        "pbr": 1.2,
        "dividendYield": 0.0124,
        "roe": 0.3974,
        "debtToEquity": 0.4204,
        "netMargin": 0.0985
      }
    ]
  },
  "OIL": {
    "symbol": "OIL",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 2364.19,
        "operatingIncome": 290.73,
        "netIncome": 267.09,
        "eps": 0.295,
        "assets": 5261.09,
        "liabilities": 2314.64,
        "equity": 2946.45,
        "freeCashFlow": 227.28,
        "dividendPerShare": 0.1966,
        "per": 12.57,
        "pbr": 1.14,
        "dividendYield": 0.053,
        "roe": 0.3626,
        "debtToEquity": 0.7856,
        "netMargin": 0.113,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 2439.83,
        "operatingIncome": 408.28,
        "netIncome": 231.5,
        "eps": 0.2557,
        "assets": 5132.34,
        "liabilities": 2260.91,
        "equity": 2871.43,
        "freeCashFlow": 167.34,
        "dividendPerShare": 0.1877,
        "per": 12.74,
        "pbr": 1.03,
        "dividendYield": 0.0576,
        "roe": 0.3225,
        "debtToEquity": 0.7874,
        "netMargin": 0.0949,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 2451.13,
        "operatingIncome": 401.33,
        "netIncome": 223.25,
        "eps": 0.2466,
        "assets": 5159.05,
        "liabilities": 2287.57,
        "equity": 2871.48,
        "freeCashFlow": 187.52,
        "dividendPerShare": 0.1699,
        "per": 14.01,
        "pbr": 1.09,
        "dividendYield": 0.0492,
        "roe": 0.311,
        "debtToEquity": 0.7967,
        "netMargin": 0.0911,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 2565.34,
        "operatingIncome": 461.84,
        "netIncome": 271.44,
        "eps": 0.2998,
        "assets": 5137.85,
        "liabilities": 2189.37,
        "equity": 2948.49,
        "freeCashFlow": 218.58,
        "dividendPerShare": 0.2185,
        "per": 12.3,
        "pbr": 1.13,
        "dividendYield": 0.0593,
        "roe": 0.3682,
        "debtToEquity": 0.7425,
        "netMargin": 0.1058,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 2503.6,
        "operatingIncome": 441.06,
        "netIncome": 252.64,
        "eps": 0.279,
        "assets": 5131.12,
        "liabilities": 2182.97,
        "equity": 2948.15,
        "freeCashFlow": 252.47,
        "dividendPerShare": 0.1683,
        "per": 15.27,
        "pbr": 1.31,
        "dividendYield": 0.0395,
        "roe": 0.3428,
        "debtToEquity": 0.7405,
        "netMargin": 0.1009,
        "revenueYoY": 0.059
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 2581.47,
        "operatingIncome": 408.4,
        "netIncome": 282.49,
        "eps": 0.312,
        "assets": 5204.88,
        "liabilities": 2224.55,
        "equity": 2980.34,
        "freeCashFlow": 220.9,
        "dividendPerShare": 0.2001,
        "per": 14.5,
        "pbr": 1.37,
        "dividendYield": 0.0443,
        "roe": 0.3791,
        "debtToEquity": 0.7464,
        "netMargin": 0.1094,
        "revenueYoY": 0.0581
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 2650.03,
        "operatingIncome": 399.27,
        "netIncome": 242.52,
        "eps": 0.2678,
        "assets": 5289.91,
        "liabilities": 2265.56,
        "equity": 3024.35,
        "freeCashFlow": 174.1,
        "dividendPerShare": 0.1658,
        "per": 14.13,
        "pbr": 1.13,
        "dividendYield": 0.0438,
        "roe": 0.3208,
        "debtToEquity": 0.7491,
        "netMargin": 0.0915,
        "revenueYoY": 0.0811
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 2859.56,
        "operatingIncome": 522.96,
        "netIncome": 276.52,
        "eps": 0.3054,
        "assets": 5273.48,
        "liabilities": 2275.01,
        "equity": 2998.47,
        "freeCashFlow": 302.96,
        "dividendPerShare": 0.1994,
        "per": 15.27,
        "pbr": 1.41,
        "dividendYield": 0.0428,
        "roe": 0.3689,
        "debtToEquity": 0.7587,
        "netMargin": 0.0967,
        "revenueYoY": 0.1147
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 2872.21,
        "operatingIncome": 469.89,
        "netIncome": 274.57,
        "eps": 0.3032,
        "assets": 5356.79,
        "liabilities": 2284.76,
        "equity": 3072.03,
        "freeCashFlow": 239.95,
        "dividendPerShare": 0.2151,
        "per": 15.85,
        "pbr": 1.42,
        "dividendYield": 0.0447,
        "roe": 0.3575,
        "debtToEquity": 0.7437,
        "netMargin": 0.0956,
        "revenueYoY": 0.1472
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 3116.58,
        "operatingIncome": 536.08,
        "netIncome": 388.96,
        "eps": 0.4296,
        "assets": 5365.69,
        "liabilities": 2221.97,
        "equity": 3143.72,
        "freeCashFlow": 408.99,
        "dividendPerShare": 0.1689,
        "per": 13.62,
        "pbr": 1.69,
        "dividendYield": 0.0289,
        "roe": 0.4949,
        "debtToEquity": 0.7068,
        "netMargin": 0.1248,
        "revenueYoY": 0.2073
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 3236.86,
        "operatingIncome": 568.63,
        "netIncome": 269.18,
        "eps": 0.2973,
        "assets": 5412.82,
        "liabilities": 2250.62,
        "equity": 3162.2,
        "freeCashFlow": 277.25,
        "dividendPerShare": 0.2197,
        "per": 14.75,
        "pbr": 1.26,
        "dividendYield": 0.0501,
        "roe": 0.3405,
        "debtToEquity": 0.7117,
        "netMargin": 0.0832,
        "revenueYoY": 0.2214
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 3605.75,
        "operatingIncome": 572.11,
        "netIncome": 318.49,
        "eps": 0.3517,
        "assets": 5492.79,
        "liabilities": 2335.18,
        "equity": 3157.61,
        "freeCashFlow": 332,
        "dividendPerShare": 0.2205,
        "per": 16.56,
        "pbr": 1.67,
        "dividendYield": 0.0379,
        "roe": 0.4035,
        "debtToEquity": 0.7395,
        "netMargin": 0.0883,
        "revenueYoY": 0.2609
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 3520.05,
        "operatingIncome": 582.73,
        "netIncome": 356.29,
        "eps": 0.3935,
        "assets": 5640.72,
        "liabilities": 2433.94,
        "equity": 3206.79,
        "freeCashFlow": 279.35,
        "dividendPerShare": 0.2225,
        "per": 13.86,
        "pbr": 1.54,
        "dividendYield": 0.0408,
        "roe": 0.4444,
        "debtToEquity": 0.759,
        "netMargin": 0.1012,
        "revenueYoY": 0.2256
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 3758.3,
        "operatingIncome": 637.19,
        "netIncome": 421.98,
        "eps": 0.466,
        "assets": 5750.81,
        "liabilities": 2457.45,
        "equity": 3293.36,
        "freeCashFlow": 307.41,
        "dividendPerShare": 0.2017,
        "per": 13.86,
        "pbr": 1.78,
        "dividendYield": 0.0312,
        "roe": 0.5125,
        "debtToEquity": 0.7462,
        "netMargin": 0.1123,
        "revenueYoY": 0.2059
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 3892.27,
        "operatingIncome": 594.63,
        "netIncome": 318.93,
        "eps": 0.3522,
        "assets": 5788.83,
        "liabilities": 2382.81,
        "equity": 3406.03,
        "freeCashFlow": 295.09,
        "dividendPerShare": 0.1819,
        "per": 14.55,
        "pbr": 1.36,
        "dividendYield": 0.0355,
        "roe": 0.3746,
        "debtToEquity": 0.6996,
        "netMargin": 0.0819,
        "revenueYoY": 0.2025
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 4133.71,
        "operatingIncome": 777.39,
        "netIncome": 430.14,
        "eps": 0.4751,
        "assets": 5813.18,
        "liabilities": 2514.45,
        "equity": 3298.73,
        "freeCashFlow": 314.06,
        "dividendPerShare": 0.1829,
        "per": 14.44,
        "pbr": 1.88,
        "dividendYield": 0.0267,
        "roe": 0.5216,
        "debtToEquity": 0.7622,
        "netMargin": 0.1041,
        "revenueYoY": 0.1464
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 4057.67,
        "operatingIncome": 643.84,
        "netIncome": 420.49,
        "eps": 0.4644,
        "assets": 5910.28,
        "liabilities": 2549.36,
        "equity": 3360.92,
        "freeCashFlow": 433.03,
        "dividendPerShare": 0.1725,
        "per": 15.07,
        "pbr": 1.89,
        "dividendYield": 0.0247,
        "roe": 0.5005,
        "debtToEquity": 0.7585,
        "netMargin": 0.1036,
        "revenueYoY": 0.1527
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 4142.54,
        "operatingIncome": 715.62,
        "netIncome": 389.3,
        "eps": 0.4299,
        "assets": 5957.89,
        "liabilities": 2524.42,
        "equity": 3433.47,
        "freeCashFlow": 307.82,
        "dividendPerShare": 0.2264,
        "per": 16.48,
        "pbr": 1.87,
        "dividendYield": 0.0319,
        "roe": 0.4535,
        "debtToEquity": 0.7352,
        "netMargin": 0.094,
        "revenueYoY": 0.1022
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 4060.48,
        "operatingIncome": 704.01,
        "netIncome": 369.76,
        "eps": 0.4084,
        "assets": 5918.6,
        "liabilities": 2449.11,
        "equity": 3469.5,
        "freeCashFlow": 377.32,
        "dividendPerShare": 0.2148,
        "per": 11.31,
        "pbr": 1.21,
        "dividendYield": 0.0465,
        "roe": 0.4263,
        "debtToEquity": 0.7059,
        "netMargin": 0.0911,
        "revenueYoY": 0.0432
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 4369.76,
        "operatingIncome": 694.82,
        "netIncome": 475.29,
        "eps": 0.5249,
        "assets": 6042.12,
        "liabilities": 2523.15,
        "equity": 3518.97,
        "freeCashFlow": 288.9,
        "dividendPerShare": 0.174,
        "per": 13.63,
        "pbr": 1.84,
        "dividendYield": 0.0243,
        "roe": 0.5403,
        "debtToEquity": 0.717,
        "netMargin": 0.1088,
        "revenueYoY": 0.0571
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 4329.99,
        "operatingIncome": 697.61,
        "netIncome": 404.5,
        "eps": 0.4467,
        "assets": 6047.11,
        "liabilities": 2518.67,
        "equity": 3528.44,
        "freeCashFlow": 326.93,
        "dividendPerShare": 0.2118,
        "per": 16.08,
        "pbr": 1.84,
        "dividendYield": 0.0295,
        "roe": 0.4586,
        "debtToEquity": 0.7138,
        "netMargin": 0.0934,
        "revenueYoY": 0.0671
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 4424.71,
        "operatingIncome": 608.82,
        "netIncome": 322.04,
        "eps": 0.3557,
        "assets": 6046.84,
        "liabilities": 2521.06,
        "equity": 3525.77,
        "freeCashFlow": 345.74,
        "dividendPerShare": 0.1991,
        "per": 17.6,
        "pbr": 1.61,
        "dividendYield": 0.0318,
        "roe": 0.3654,
        "debtToEquity": 0.715,
        "netMargin": 0.0728,
        "revenueYoY": 0.0681
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 4403.61,
        "operatingIncome": 672.94,
        "netIncome": 507.07,
        "eps": 0.56,
        "assets": 6008.37,
        "liabilities": 2532.41,
        "equity": 3475.96,
        "freeCashFlow": 519.3,
        "dividendPerShare": 0.1778,
        "per": 13.96,
        "pbr": 2.04,
        "dividendYield": 0.0227,
        "roe": 0.5835,
        "debtToEquity": 0.7286,
        "netMargin": 0.1151,
        "revenueYoY": 0.0845
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 4675.65,
        "operatingIncome": 809.77,
        "netIncome": 507.18,
        "eps": 0.5601,
        "assets": 6174.67,
        "liabilities": 2628.1,
        "equity": 3546.57,
        "freeCashFlow": 517.25,
        "dividendPerShare": 0.1852,
        "per": 13.79,
        "pbr": 1.97,
        "dividendYield": 0.024,
        "roe": 0.572,
        "debtToEquity": 0.741,
        "netMargin": 0.1085,
        "revenueYoY": 0.07
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 4559.46,
        "operatingIncome": 784.84,
        "netIncome": 424.44,
        "eps": 0.4688,
        "assets": 6254.01,
        "liabilities": 2617.15,
        "equity": 3636.86,
        "freeCashFlow": 426.1,
        "dividendPerShare": 0.1795,
        "per": 15.32,
        "pbr": 1.79,
        "dividendYield": 0.025,
        "roe": 0.4668,
        "debtToEquity": 0.7196,
        "netMargin": 0.0931,
        "revenueYoY": 0.053
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 4806.59,
        "operatingIncome": 700.59,
        "netIncome": 345.92,
        "eps": 0.382,
        "assets": 6347.08,
        "liabilities": 2672.89,
        "equity": 3674.2,
        "freeCashFlow": 293.12,
        "dividendPerShare": 0.2288,
        "per": 15.78,
        "pbr": 1.49,
        "dividendYield": 0.038,
        "roe": 0.3766,
        "debtToEquity": 0.7275,
        "netMargin": 0.072,
        "revenueYoY": 0.0863
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 4801.36,
        "operatingIncome": 721.23,
        "netIncome": 436.29,
        "eps": 0.4818,
        "assets": 6343.82,
        "liabilities": 2599.98,
        "equity": 3743.84,
        "freeCashFlow": 383.09,
        "dividendPerShare": 0.2091,
        "per": 13.45,
        "pbr": 1.57,
        "dividendYield": 0.0323,
        "roe": 0.4661,
        "debtToEquity": 0.6945,
        "netMargin": 0.0909,
        "revenueYoY": 0.0903
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 5010.33,
        "operatingIncome": 692.02,
        "netIncome": 439.89,
        "eps": 0.4858,
        "assets": 6449.37,
        "liabilities": 2614.62,
        "equity": 3834.75,
        "freeCashFlow": 433.73,
        "dividendPerShare": 0.2161,
        "per": 13.63,
        "pbr": 1.56,
        "dividendYield": 0.0326,
        "roe": 0.4588,
        "debtToEquity": 0.6818,
        "netMargin": 0.0878,
        "revenueYoY": 0.0716
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 4751.19,
        "operatingIncome": 919.6,
        "netIncome": 411.06,
        "eps": 0.454,
        "assets": 6474.28,
        "liabilities": 2644.66,
        "equity": 3829.62,
        "freeCashFlow": 268.87,
        "dividendPerShare": 0.1749,
        "per": 14.58,
        "pbr": 1.56,
        "dividendYield": 0.0264,
        "roe": 0.4293,
        "debtToEquity": 0.6906,
        "netMargin": 0.0865,
        "revenueYoY": 0.0421
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 4922.55,
        "operatingIncome": 703.4,
        "netIncome": 440.68,
        "eps": 0.4867,
        "assets": 6458.67,
        "liabilities": 2802.98,
        "equity": 3655.68,
        "freeCashFlow": 265.96,
        "dividendPerShare": 0.1655,
        "per": 14.78,
        "pbr": 1.78,
        "dividendYield": 0.023,
        "roe": 0.4822,
        "debtToEquity": 0.7667,
        "netMargin": 0.0895,
        "revenueYoY": 0.0241
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 4808.22,
        "operatingIncome": 794.32,
        "netIncome": 404.24,
        "eps": 0.4464,
        "assets": 6555.64,
        "liabilities": 2915.52,
        "equity": 3640.13,
        "freeCashFlow": 364.96,
        "dividendPerShare": 0.1984,
        "per": 14.96,
        "pbr": 1.66,
        "dividendYield": 0.0297,
        "roe": 0.4442,
        "debtToEquity": 0.8009,
        "netMargin": 0.0841,
        "revenueYoY": 14e-4
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 5045.1,
        "operatingIncome": 712.4,
        "netIncome": 414.42,
        "eps": 0.4577,
        "assets": 6559.73,
        "liabilities": 2895.04,
        "equity": 3664.69,
        "freeCashFlow": 265.82,
        "dividendPerShare": 0.2053,
        "per": 14.97,
        "pbr": 1.69,
        "dividendYield": 0.03,
        "roe": 0.4523,
        "debtToEquity": 0.79,
        "netMargin": 0.0821,
        "revenueYoY": 69e-4
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 4690.48,
        "operatingIncome": 732.73,
        "netIncome": 415.28,
        "eps": 0.4586,
        "assets": 6572.47,
        "liabilities": 2995.47,
        "equity": 3577,
        "freeCashFlow": 441.79,
        "dividendPerShare": 0.1652,
        "per": 15.64,
        "pbr": 1.82,
        "dividendYield": 0.023,
        "roe": 0.4644,
        "debtToEquity": 0.8374,
        "netMargin": 0.0885,
        "revenueYoY": -0.0128
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 4517.98,
        "operatingIncome": 705.32,
        "netIncome": 473.74,
        "eps": 0.5232,
        "assets": 6622.17,
        "liabilities": 3015.13,
        "equity": 3607.03,
        "freeCashFlow": 421.54,
        "dividendPerShare": 0.2191,
        "per": 12.8,
        "pbr": 1.68,
        "dividendYield": 0.0327,
        "roe": 0.5253,
        "debtToEquity": 0.8359,
        "netMargin": 0.1049,
        "revenueYoY": -0.0822
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 4381.58,
        "operatingIncome": 624.61,
        "netIncome": 325.6,
        "eps": 0.3596,
        "assets": 6633.31,
        "liabilities": 3076.87,
        "equity": 3556.43,
        "freeCashFlow": 228.62,
        "dividendPerShare": 0.2273,
        "per": 14.2,
        "pbr": 1.3,
        "dividendYield": 0.0445,
        "roe": 0.3662,
        "debtToEquity": 0.8652,
        "netMargin": 0.0743,
        "revenueYoY": -0.0887
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 4516.67,
        "operatingIncome": 778.45,
        "netIncome": 354.87,
        "eps": 0.3919,
        "assets": 6700.79,
        "liabilities": 3171.84,
        "equity": 3528.95,
        "freeCashFlow": 350.66,
        "dividendPerShare": 0.1839,
        "per": 14.5,
        "pbr": 1.46,
        "dividendYield": 0.0324,
        "roe": 0.4022,
        "debtToEquity": 0.8988,
        "netMargin": 0.0786,
        "revenueYoY": -0.1047
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 4157.04,
        "operatingIncome": 706.41,
        "netIncome": 392.78,
        "eps": 0.4338,
        "assets": 6793.6,
        "liabilities": 3100.04,
        "equity": 3693.56,
        "freeCashFlow": 415.87,
        "dividendPerShare": 0.1847,
        "per": 14.06,
        "pbr": 1.5,
        "dividendYield": 0.0303,
        "roe": 0.4254,
        "debtToEquity": 0.8393,
        "netMargin": 0.0945,
        "revenueYoY": -0.1137
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 4316.68,
        "operatingIncome": 577.04,
        "netIncome": 369,
        "eps": 0.4075,
        "assets": 6877.27,
        "liabilities": 3052.35,
        "equity": 3824.92,
        "freeCashFlow": 402.2,
        "dividendPerShare": 0.1679,
        "per": 13.08,
        "pbr": 1.26,
        "dividendYield": 0.0315,
        "roe": 0.3859,
        "debtToEquity": 0.798,
        "netMargin": 0.0855,
        "revenueYoY": -0.0446
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 4205.96,
        "operatingIncome": 700.25,
        "netIncome": 253.73,
        "eps": 0.2802,
        "assets": 7017.92,
        "liabilities": 3146.79,
        "equity": 3871.13,
        "freeCashFlow": 248.7,
        "dividendPerShare": 0.1674,
        "per": 16.18,
        "pbr": 1.06,
        "dividendYield": 0.0369,
        "roe": 0.2622,
        "debtToEquity": 0.8129,
        "netMargin": 0.0603,
        "revenueYoY": -0.0401
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 4405.14,
        "operatingIncome": 630.02,
        "netIncome": 376.71,
        "eps": 0.416,
        "assets": 7015.86,
        "liabilities": 3122.21,
        "equity": 3893.65,
        "freeCashFlow": 327.06,
        "dividendPerShare": 0.1634,
        "per": 15.45,
        "pbr": 1.49,
        "dividendYield": 0.0254,
        "roe": 0.387,
        "debtToEquity": 0.8019,
        "netMargin": 0.0855,
        "revenueYoY": -0.0247
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 9820.49,
        "operatingIncome": 1562.17,
        "netIncome": 993.28,
        "freeCashFlow": 800.71,
        "dividendPerShare": 0.7727,
        "assets": 5137.85,
        "liabilities": 2189.37,
        "equity": 2948.49,
        "per": 12.3,
        "pbr": 1.13,
        "dividendYield": 0.0593,
        "roe": 0.3369,
        "debtToEquity": 0.7425,
        "netMargin": 0.1011
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 10594.67,
        "operatingIncome": 1771.69,
        "netIncome": 1054.17,
        "freeCashFlow": 950.42,
        "dividendPerShare": 0.7337,
        "assets": 5273.48,
        "liabilities": 2275.01,
        "equity": 2998.47,
        "per": 15.27,
        "pbr": 1.41,
        "dividendYield": 0.0428,
        "roe": 0.3516,
        "debtToEquity": 0.7587,
        "netMargin": 0.0995
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 12831.41,
        "operatingIncome": 2146.71,
        "netIncome": 1251.2,
        "freeCashFlow": 1258.19,
        "dividendPerShare": 0.8242,
        "assets": 5492.79,
        "liabilities": 2335.18,
        "equity": 3157.61,
        "per": 16.56,
        "pbr": 1.67,
        "dividendYield": 0.0379,
        "roe": 0.3962,
        "debtToEquity": 0.7395,
        "netMargin": 0.0975
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 15304.33,
        "operatingIncome": 2591.93,
        "netIncome": 1527.34,
        "freeCashFlow": 1195.9,
        "dividendPerShare": 0.7889,
        "assets": 5813.18,
        "liabilities": 2514.45,
        "equity": 3298.73,
        "per": 14.44,
        "pbr": 1.88,
        "dividendYield": 0.0267,
        "roe": 0.463,
        "debtToEquity": 0.7622,
        "netMargin": 0.0998
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 16630.45,
        "operatingIncome": 2758.29,
        "netIncome": 1654.85,
        "freeCashFlow": 1407.07,
        "dividendPerShare": 0.7877,
        "assets": 6042.12,
        "liabilities": 2523.15,
        "equity": 3518.97,
        "per": 13.63,
        "pbr": 1.84,
        "dividendYield": 0.0243,
        "roe": 0.4703,
        "debtToEquity": 0.717,
        "netMargin": 0.0995
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 17833.96,
        "operatingIncome": 2789.13,
        "netIncome": 1740.78,
        "freeCashFlow": 1709.22,
        "dividendPerShare": 0.7738,
        "assets": 6174.67,
        "liabilities": 2628.1,
        "equity": 3546.57,
        "per": 13.79,
        "pbr": 1.97,
        "dividendYield": 0.024,
        "roe": 0.4908,
        "debtToEquity": 0.741,
        "netMargin": 0.0976
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 19177.74,
        "operatingIncome": 2898.68,
        "netIncome": 1646.53,
        "freeCashFlow": 1536.04,
        "dividendPerShare": 0.8335,
        "assets": 6449.37,
        "liabilities": 2614.62,
        "equity": 3834.75,
        "per": 13.63,
        "pbr": 1.56,
        "dividendYield": 0.0326,
        "roe": 0.4294,
        "debtToEquity": 0.6818,
        "netMargin": 0.0859
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 19527.06,
        "operatingIncome": 3129.72,
        "netIncome": 1670.4,
        "freeCashFlow": 1165.61,
        "dividendPerShare": 0.7441,
        "assets": 6559.73,
        "liabilities": 2895.04,
        "equity": 3664.69,
        "per": 14.97,
        "pbr": 1.69,
        "dividendYield": 0.03,
        "roe": 0.4558,
        "debtToEquity": 0.79,
        "netMargin": 0.0855
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 18106.71,
        "operatingIncome": 2841.11,
        "netIncome": 1569.49,
        "freeCashFlow": 1442.6,
        "dividendPerShare": 0.7955,
        "assets": 6700.79,
        "liabilities": 3171.84,
        "equity": 3528.95,
        "per": 14.5,
        "pbr": 1.46,
        "dividendYield": 0.0324,
        "roe": 0.4447,
        "debtToEquity": 0.8988,
        "netMargin": 0.0867
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 17084.82,
        "operatingIncome": 2613.72,
        "netIncome": 1392.22,
        "freeCashFlow": 1393.84,
        "dividendPerShare": 0.6833,
        "assets": 7015.86,
        "liabilities": 3122.21,
        "equity": 3893.65,
        "per": 15.45,
        "pbr": 1.49,
        "dividendYield": 0.0254,
        "roe": 0.3576,
        "debtToEquity": 0.8019,
        "netMargin": 0.0815
      }
    ]
  },
  "RET": {
    "symbol": "RET",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 2041.64,
        "operatingIncome": 303.62,
        "netIncome": 191.09,
        "eps": 0.3629,
        "assets": 4821.88,
        "liabilities": 1967.03,
        "equity": 2854.85,
        "freeCashFlow": 144.54,
        "dividendPerShare": 0.1354,
        "per": 20.74,
        "pbr": 1.39,
        "dividendYield": 0.018,
        "roe": 0.2677,
        "debtToEquity": 0.689,
        "netMargin": 0.0936,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 2096.44,
        "operatingIncome": 305.4,
        "netIncome": 186.9,
        "eps": 0.3549,
        "assets": 4871.67,
        "liabilities": 2087.17,
        "equity": 2784.51,
        "freeCashFlow": 189.72,
        "dividendPerShare": 0.1307,
        "per": 22.57,
        "pbr": 1.52,
        "dividendYield": 0.0163,
        "roe": 0.2685,
        "debtToEquity": 0.7496,
        "netMargin": 0.0891,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 2113.97,
        "operatingIncome": 299.13,
        "netIncome": 170.57,
        "eps": 0.3239,
        "assets": 4860.08,
        "liabilities": 2032.99,
        "equity": 2827.09,
        "freeCashFlow": 131.24,
        "dividendPerShare": 0.1257,
        "per": 20.3,
        "pbr": 1.22,
        "dividendYield": 0.0191,
        "roe": 0.2413,
        "debtToEquity": 0.7191,
        "netMargin": 0.0807,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 2256.8,
        "operatingIncome": 316.59,
        "netIncome": 211.47,
        "eps": 0.4016,
        "assets": 4898.07,
        "liabilities": 1994.87,
        "equity": 2903.2,
        "freeCashFlow": 150.76,
        "dividendPerShare": 0.1434,
        "per": 21.02,
        "pbr": 1.53,
        "dividendYield": 0.017,
        "roe": 0.2914,
        "debtToEquity": 0.6871,
        "netMargin": 0.0937,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 2252.46,
        "operatingIncome": 320.69,
        "netIncome": 223.48,
        "eps": 0.4244,
        "assets": 4980.03,
        "liabilities": 1996.64,
        "equity": 2983.39,
        "freeCashFlow": 146.57,
        "dividendPerShare": 0.1336,
        "per": 20.72,
        "pbr": 1.55,
        "dividendYield": 0.0152,
        "roe": 0.2996,
        "debtToEquity": 0.6693,
        "netMargin": 0.0992,
        "revenueYoY": 0.1033
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 2308.23,
        "operatingIncome": 331.02,
        "netIncome": 226.65,
        "eps": 0.4304,
        "assets": 5003.43,
        "liabilities": 2018.14,
        "equity": 2985.29,
        "freeCashFlow": 232.29,
        "dividendPerShare": 0.1336,
        "per": 19.48,
        "pbr": 1.48,
        "dividendYield": 0.0159,
        "roe": 0.3037,
        "debtToEquity": 0.676,
        "netMargin": 0.0982,
        "revenueYoY": 0.101
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 2390.01,
        "operatingIncome": 331.36,
        "netIncome": 176.98,
        "eps": 0.3361,
        "assets": 5038.06,
        "liabilities": 1997.67,
        "equity": 3040.39,
        "freeCashFlow": 108.16,
        "dividendPerShare": 0.1171,
        "per": 24.85,
        "pbr": 1.45,
        "dividendYield": 0.014,
        "roe": 0.2328,
        "debtToEquity": 0.657,
        "netMargin": 0.0741,
        "revenueYoY": 0.1306
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 2617.7,
        "operatingIncome": 389.17,
        "netIncome": 206.72,
        "eps": 0.3926,
        "assets": 5100.41,
        "liabilities": 2144.78,
        "equity": 2955.64,
        "freeCashFlow": 131.18,
        "dividendPerShare": 0.1122,
        "per": 20.93,
        "pbr": 1.46,
        "dividendYield": 0.0137,
        "roe": 0.2798,
        "debtToEquity": 0.7257,
        "netMargin": 0.079,
        "revenueYoY": 0.1599
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 2645.67,
        "operatingIncome": 366.42,
        "netIncome": 260.89,
        "eps": 0.4954,
        "assets": 5105.79,
        "liabilities": 2160.32,
        "equity": 2945.48,
        "freeCashFlow": 235.5,
        "dividendPerShare": 0.1028,
        "per": 19.65,
        "pbr": 1.74,
        "dividendYield": 0.0106,
        "roe": 0.3543,
        "debtToEquity": 0.7334,
        "netMargin": 0.0986,
        "revenueYoY": 0.1746
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 2807.45,
        "operatingIncome": 419.48,
        "netIncome": 252.36,
        "eps": 0.4792,
        "assets": 5171.2,
        "liabilities": 2236.65,
        "equity": 2934.55,
        "freeCashFlow": 172.88,
        "dividendPerShare": 0.1347,
        "per": 24.28,
        "pbr": 2.09,
        "dividendYield": 0.0116,
        "roe": 0.344,
        "debtToEquity": 0.7622,
        "netMargin": 0.0899,
        "revenueYoY": 0.2163
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 2938.11,
        "operatingIncome": 419.79,
        "netIncome": 270.66,
        "eps": 0.514,
        "assets": 5162.07,
        "liabilities": 2188.61,
        "equity": 2973.46,
        "freeCashFlow": 198.72,
        "dividendPerShare": 0.1331,
        "per": 21.21,
        "pbr": 1.93,
        "dividendYield": 0.0122,
        "roe": 0.3641,
        "debtToEquity": 0.736,
        "netMargin": 0.0921,
        "revenueYoY": 0.2293
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 3248.24,
        "operatingIncome": 468.78,
        "netIncome": 298.31,
        "eps": 0.5665,
        "assets": 5252.19,
        "liabilities": 2160.75,
        "equity": 3091.44,
        "freeCashFlow": 280.74,
        "dividendPerShare": 0.1145,
        "per": 19.11,
        "pbr": 1.84,
        "dividendYield": 0.0106,
        "roe": 0.386,
        "debtToEquity": 0.6989,
        "netMargin": 0.0918,
        "revenueYoY": 0.2409
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 3203.59,
        "operatingIncome": 474.87,
        "netIncome": 225.93,
        "eps": 0.4291,
        "assets": 5356.19,
        "liabilities": 2143.76,
        "equity": 3212.43,
        "freeCashFlow": 213.21,
        "dividendPerShare": 0.1026,
        "per": 21.24,
        "pbr": 1.49,
        "dividendYield": 0.0113,
        "roe": 0.2813,
        "debtToEquity": 0.6673,
        "netMargin": 0.0705,
        "revenueYoY": 0.2109
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 3389.51,
        "operatingIncome": 576.71,
        "netIncome": 274.04,
        "eps": 0.5204,
        "assets": 5354.63,
        "liabilities": 2032.73,
        "equity": 3321.9,
        "freeCashFlow": 269.67,
        "dividendPerShare": 0.1381,
        "per": 21.06,
        "pbr": 1.74,
        "dividendYield": 0.0126,
        "roe": 0.33,
        "debtToEquity": 0.6119,
        "netMargin": 0.0809,
        "revenueYoY": 0.2073
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 3562.13,
        "operatingIncome": 472.79,
        "netIncome": 356.31,
        "eps": 0.6766,
        "assets": 5329,
        "liabilities": 2000.81,
        "equity": 3328.19,
        "freeCashFlow": 300.95,
        "dividendPerShare": 0.1073,
        "per": 20,
        "pbr": 2.14,
        "dividendYield": 79e-4,
        "roe": 0.4282,
        "debtToEquity": 0.6012,
        "netMargin": 0.1,
        "revenueYoY": 0.2124
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 3730.09,
        "operatingIncome": 530.68,
        "netIncome": 353.72,
        "eps": 0.6717,
        "assets": 5400.53,
        "liabilities": 1967.02,
        "equity": 3433.5,
        "freeCashFlow": 311.52,
        "dividendPerShare": 0.1251,
        "per": 19.99,
        "pbr": 2.06,
        "dividendYield": 93e-4,
        "roe": 0.4121,
        "debtToEquity": 0.5729,
        "netMargin": 0.0948,
        "revenueYoY": 0.1483
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 3836.56,
        "operatingIncome": 605.42,
        "netIncome": 291.2,
        "eps": 0.553,
        "assets": 5436.13,
        "liabilities": 1959.72,
        "equity": 3476.41,
        "freeCashFlow": 200.96,
        "dividendPerShare": 0.1349,
        "per": 21.89,
        "pbr": 1.83,
        "dividendYield": 0.0111,
        "roe": 0.3351,
        "debtToEquity": 0.5637,
        "netMargin": 0.0759,
        "revenueYoY": 0.1976
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 3920.98,
        "operatingIncome": 621.09,
        "netIncome": 393.85,
        "eps": 0.7479,
        "assets": 5502.11,
        "liabilities": 1998.93,
        "equity": 3503.18,
        "freeCashFlow": 330.13,
        "dividendPerShare": 0.1226,
        "per": 21.24,
        "pbr": 2.39,
        "dividendYield": 77e-4,
        "roe": 0.4497,
        "debtToEquity": 0.5706,
        "netMargin": 0.1004,
        "revenueYoY": 0.1568
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 4028.03,
        "operatingIncome": 617.87,
        "netIncome": 367.73,
        "eps": 0.6983,
        "assets": 5598.55,
        "liabilities": 1973.19,
        "equity": 3625.36,
        "freeCashFlow": 245.33,
        "dividendPerShare": 0.1037,
        "per": 19.55,
        "pbr": 1.98,
        "dividendYield": 76e-4,
        "roe": 0.4057,
        "debtToEquity": 0.5443,
        "netMargin": 0.0913,
        "revenueYoY": 0.1308
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 4275.66,
        "operatingIncome": 657.31,
        "netIncome": 319.72,
        "eps": 0.6072,
        "assets": 5672.39,
        "liabilities": 2009.2,
        "equity": 3663.19,
        "freeCashFlow": 312.3,
        "dividendPerShare": 0.1187,
        "per": 22.33,
        "pbr": 1.95,
        "dividendYield": 88e-4,
        "roe": 0.3491,
        "debtToEquity": 0.5485,
        "netMargin": 0.0748,
        "revenueYoY": 0.1463
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 4344.79,
        "operatingIncome": 673.29,
        "netIncome": 363.62,
        "eps": 0.6905,
        "assets": 5797.22,
        "liabilities": 2046.75,
        "equity": 3750.46,
        "freeCashFlow": 266.77,
        "dividendPerShare": 0.1451,
        "per": 17.83,
        "pbr": 1.73,
        "dividendYield": 0.0118,
        "roe": 0.3878,
        "debtToEquity": 0.5457,
        "netMargin": 0.0837,
        "revenueYoY": 0.1325
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 4529.1,
        "operatingIncome": 678.67,
        "netIncome": 435.21,
        "eps": 0.8265,
        "assets": 5893.33,
        "liabilities": 1973.71,
        "equity": 3919.62,
        "freeCashFlow": 432.53,
        "dividendPerShare": 0.1148,
        "per": 19.15,
        "pbr": 2.13,
        "dividendYield": 73e-4,
        "roe": 0.4441,
        "debtToEquity": 0.5035,
        "netMargin": 0.0961,
        "revenueYoY": 0.1551
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 4665.95,
        "operatingIncome": 685.78,
        "netIncome": 403.04,
        "eps": 0.7654,
        "assets": 5898.76,
        "liabilities": 1992.65,
        "equity": 3906.11,
        "freeCashFlow": 249.86,
        "dividendPerShare": 0.1056,
        "per": 18.18,
        "pbr": 1.88,
        "dividendYield": 76e-4,
        "roe": 0.4127,
        "debtToEquity": 0.5101,
        "netMargin": 0.0864,
        "revenueYoY": 0.1584
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 5042.03,
        "operatingIncome": 634.63,
        "netIncome": 368.01,
        "eps": 0.6989,
        "assets": 5956.91,
        "liabilities": 2034.55,
        "equity": 3922.36,
        "freeCashFlow": 222.57,
        "dividendPerShare": 0.1188,
        "per": 22.43,
        "pbr": 2.1,
        "dividendYield": 76e-4,
        "roe": 0.3753,
        "debtToEquity": 0.5187,
        "netMargin": 0.073,
        "revenueYoY": 0.1792
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 5010.85,
        "operatingIncome": 798.84,
        "netIncome": 415.35,
        "eps": 0.7888,
        "assets": 5955.66,
        "liabilities": 1949.26,
        "equity": 4006.4,
        "freeCashFlow": 341.57,
        "dividendPerShare": 0.1287,
        "per": 18.88,
        "pbr": 1.96,
        "dividendYield": 86e-4,
        "roe": 0.4147,
        "debtToEquity": 0.4865,
        "netMargin": 0.0829,
        "revenueYoY": 0.1533
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 5208.07,
        "operatingIncome": 638.34,
        "netIncome": 494.17,
        "eps": 0.9385,
        "assets": 6030.36,
        "liabilities": 2038.77,
        "equity": 3991.6,
        "freeCashFlow": 513.05,
        "dividendPerShare": 0.1249,
        "per": 18.49,
        "pbr": 2.29,
        "dividendYield": 72e-4,
        "roe": 0.4952,
        "debtToEquity": 0.5108,
        "netMargin": 0.0949,
        "revenueYoY": 0.1499
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 5335.13,
        "operatingIncome": 777.09,
        "netIncome": 435.78,
        "eps": 0.8276,
        "assets": 6052.92,
        "liabilities": 2058.69,
        "equity": 3994.23,
        "freeCashFlow": 346.25,
        "dividendPerShare": 0.11,
        "per": 22.97,
        "pbr": 2.51,
        "dividendYield": 58e-4,
        "roe": 0.4364,
        "debtToEquity": 0.5154,
        "netMargin": 0.0817,
        "revenueYoY": 0.1434
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 5612.83,
        "operatingIncome": 720.75,
        "netIncome": 528.46,
        "eps": 1.0036,
        "assets": 6079.86,
        "liabilities": 1996.57,
        "equity": 4083.29,
        "freeCashFlow": 380.41,
        "dividendPerShare": 0.1469,
        "per": 18.06,
        "pbr": 2.34,
        "dividendYield": 81e-4,
        "roe": 0.5177,
        "debtToEquity": 0.489,
        "netMargin": 0.0942,
        "revenueYoY": 0.1132
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 5295.52,
        "operatingIncome": 590.5,
        "netIncome": 377.9,
        "eps": 0.7177,
        "assets": 6165.02,
        "liabilities": 2077.47,
        "equity": 4087.54,
        "freeCashFlow": 253.32,
        "dividendPerShare": 0.1136,
        "per": 19.94,
        "pbr": 1.84,
        "dividendYield": 79e-4,
        "roe": 0.3698,
        "debtToEquity": 0.5082,
        "netMargin": 0.0714,
        "revenueYoY": 0.0568
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 5427.25,
        "operatingIncome": 676,
        "netIncome": 468.65,
        "eps": 0.89,
        "assets": 6269.49,
        "liabilities": 2021.58,
        "equity": 4247.91,
        "freeCashFlow": 315.11,
        "dividendPerShare": 0.1131,
        "per": 20.06,
        "pbr": 2.21,
        "dividendYield": 63e-4,
        "roe": 0.4413,
        "debtToEquity": 0.4759,
        "netMargin": 0.0864,
        "revenueYoY": 0.0421
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 5368.45,
        "operatingIncome": 752.4,
        "netIncome": 521.59,
        "eps": 0.9905,
        "assets": 6368.28,
        "liabilities": 2021.75,
        "equity": 4346.54,
        "freeCashFlow": 486.97,
        "dividendPerShare": 0.1071,
        "per": 20.42,
        "pbr": 2.45,
        "dividendYield": 53e-4,
        "roe": 0.48,
        "debtToEquity": 0.4651,
        "netMargin": 0.0972,
        "revenueYoY": 62e-4
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 5466.28,
        "operatingIncome": 833.82,
        "netIncome": 418.13,
        "eps": 0.7941,
        "assets": 6350.17,
        "liabilities": 2078.05,
        "equity": 4272.12,
        "freeCashFlow": 309.07,
        "dividendPerShare": 0.1296,
        "per": 17.2,
        "pbr": 1.68,
        "dividendYield": 95e-4,
        "roe": 0.3915,
        "debtToEquity": 0.4864,
        "netMargin": 0.0765,
        "revenueYoY": -0.0261
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 5353.7,
        "operatingIncome": 761.94,
        "netIncome": 334.71,
        "eps": 0.6356,
        "assets": 6388.05,
        "liabilities": 2022.14,
        "equity": 4365.91,
        "freeCashFlow": 258.15,
        "dividendPerShare": 0.1323,
        "per": 19.52,
        "pbr": 1.5,
        "dividendYield": 0.0107,
        "roe": 0.3067,
        "debtToEquity": 0.4632,
        "netMargin": 0.0625,
        "revenueYoY": 0.011
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 5409.02,
        "operatingIncome": 742.73,
        "netIncome": 411.66,
        "eps": 0.7818,
        "assets": 6301.02,
        "liabilities": 1870.48,
        "equity": 4430.54,
        "freeCashFlow": 390.43,
        "dividendPerShare": 0.1187,
        "per": 19.27,
        "pbr": 1.79,
        "dividendYield": 79e-4,
        "roe": 0.3717,
        "debtToEquity": 0.4222,
        "netMargin": 0.0761,
        "revenueYoY": -34e-4
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 5352.65,
        "operatingIncome": 802.9,
        "netIncome": 550.56,
        "eps": 1.0456,
        "assets": 6339.24,
        "liabilities": 1886.32,
        "equity": 4452.93,
        "freeCashFlow": 576.31,
        "dividendPerShare": 0.1223,
        "per": 19.6,
        "pbr": 2.42,
        "dividendYield": 6e-3,
        "roe": 0.4946,
        "debtToEquity": 0.4236,
        "netMargin": 0.1029,
        "revenueYoY": -29e-4
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 5536.15,
        "operatingIncome": 805.19,
        "netIncome": 539.13,
        "eps": 1.0238,
        "assets": 6454.54,
        "liabilities": 1865.4,
        "equity": 4589.14,
        "freeCashFlow": 395.85,
        "dividendPerShare": 0.1276,
        "per": 18.72,
        "pbr": 2.2,
        "dividendYield": 67e-4,
        "roe": 0.4699,
        "debtToEquity": 0.4065,
        "netMargin": 0.0974,
        "revenueYoY": 0.0128
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 5348.56,
        "operatingIncome": 563.9,
        "netIncome": 401.19,
        "eps": 0.7619,
        "assets": 6586.99,
        "liabilities": 2046.51,
        "equity": 4540.48,
        "freeCashFlow": 277.29,
        "dividendPerShare": 0.1337,
        "per": 20.88,
        "pbr": 1.84,
        "dividendYield": 84e-4,
        "roe": 0.3534,
        "debtToEquity": 0.4507,
        "netMargin": 0.075,
        "revenueYoY": -1e-3
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 5436.59,
        "operatingIncome": 542.32,
        "netIncome": 397.78,
        "eps": 0.7554,
        "assets": 6611.1,
        "liabilities": 2085.58,
        "equity": 4525.52,
        "freeCashFlow": 339.23,
        "dividendPerShare": 0.1339,
        "per": 16.99,
        "pbr": 1.49,
        "dividendYield": 0.0104,
        "roe": 0.3516,
        "debtToEquity": 0.4608,
        "netMargin": 0.0732,
        "revenueYoY": 51e-4
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 5184.87,
        "operatingIncome": 409.79,
        "netIncome": 353.8,
        "eps": 0.6719,
        "assets": 6640.77,
        "liabilities": 1995.16,
        "equity": 4645.61,
        "freeCashFlow": 292.1,
        "dividendPerShare": 0.1307,
        "per": 21.67,
        "pbr": 1.65,
        "dividendYield": 9e-3,
        "roe": 0.3046,
        "debtToEquity": 0.4295,
        "netMargin": 0.0682,
        "revenueYoY": -0.0313
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 5469.69,
        "operatingIncome": 712.85,
        "netIncome": 404.85,
        "eps": 0.7688,
        "assets": 6745.64,
        "liabilities": 1955.59,
        "equity": 4790.04,
        "freeCashFlow": 256.76,
        "dividendPerShare": 0.1347,
        "per": 21.83,
        "pbr": 1.85,
        "dividendYield": 8e-3,
        "roe": 0.3381,
        "debtToEquity": 0.4083,
        "netMargin": 0.074,
        "revenueYoY": -0.012
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 8508.85,
        "operatingIncome": 1224.74,
        "netIncome": 760.03,
        "freeCashFlow": 616.26,
        "dividendPerShare": 0.5352,
        "assets": 4898.07,
        "liabilities": 1994.87,
        "equity": 2903.2,
        "per": 21.02,
        "pbr": 1.53,
        "dividendYield": 0.017,
        "roe": 0.2618,
        "debtToEquity": 0.6871,
        "netMargin": 0.0893
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 9568.39,
        "operatingIncome": 1372.23,
        "netIncome": 833.84,
        "freeCashFlow": 618.2,
        "dividendPerShare": 0.4964,
        "assets": 5100.41,
        "liabilities": 2144.78,
        "equity": 2955.64,
        "per": 20.93,
        "pbr": 1.46,
        "dividendYield": 0.0137,
        "roe": 0.2821,
        "debtToEquity": 0.7257,
        "netMargin": 0.0871
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 11639.47,
        "operatingIncome": 1674.48,
        "netIncome": 1082.23,
        "freeCashFlow": 887.85,
        "dividendPerShare": 0.4852,
        "assets": 5252.19,
        "liabilities": 2160.75,
        "equity": 3091.44,
        "per": 19.11,
        "pbr": 1.84,
        "dividendYield": 0.0106,
        "roe": 0.3501,
        "debtToEquity": 0.6989,
        "netMargin": 0.093
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 13885.32,
        "operatingIncome": 2055.05,
        "netIncome": 1210,
        "freeCashFlow": 1095.36,
        "dividendPerShare": 0.4731,
        "assets": 5400.53,
        "liabilities": 1967.02,
        "equity": 3433.5,
        "per": 19.99,
        "pbr": 2.06,
        "dividendYield": 93e-4,
        "roe": 0.3524,
        "debtToEquity": 0.5729,
        "netMargin": 0.0871
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 16061.23,
        "operatingIncome": 2501.69,
        "netIncome": 1372.5,
        "freeCashFlow": 1088.72,
        "dividendPerShare": 0.4799,
        "assets": 5672.39,
        "liabilities": 2009.2,
        "equity": 3663.19,
        "per": 22.33,
        "pbr": 1.95,
        "dividendYield": 88e-4,
        "roe": 0.3747,
        "debtToEquity": 0.5485,
        "netMargin": 0.0855
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 18581.87,
        "operatingIncome": 2672.36,
        "netIncome": 1569.88,
        "freeCashFlow": 1171.73,
        "dividendPerShare": 0.4843,
        "assets": 5956.91,
        "liabilities": 2034.55,
        "equity": 3922.36,
        "per": 22.43,
        "pbr": 2.1,
        "dividendYield": 76e-4,
        "roe": 0.4002,
        "debtToEquity": 0.5187,
        "netMargin": 0.0845
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 21166.88,
        "operatingIncome": 2935.03,
        "netIncome": 1873.75,
        "freeCashFlow": 1581.28,
        "dividendPerShare": 0.5105,
        "assets": 6079.86,
        "liabilities": 1996.57,
        "equity": 4083.29,
        "per": 18.06,
        "pbr": 2.34,
        "dividendYield": 81e-4,
        "roe": 0.4589,
        "debtToEquity": 0.489,
        "netMargin": 0.0885
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 21557.51,
        "operatingIncome": 2852.72,
        "netIncome": 1786.27,
        "freeCashFlow": 1364.47,
        "dividendPerShare": 0.4634,
        "assets": 6350.17,
        "liabilities": 2078.05,
        "equity": 4272.12,
        "per": 17.2,
        "pbr": 1.68,
        "dividendYield": 95e-4,
        "roe": 0.4181,
        "debtToEquity": 0.4864,
        "netMargin": 0.0829
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 21651.53,
        "operatingIncome": 3112.77,
        "netIncome": 1836.05,
        "freeCashFlow": 1620.74,
        "dividendPerShare": 0.5009,
        "assets": 6454.54,
        "liabilities": 1865.4,
        "equity": 4589.14,
        "per": 18.72,
        "pbr": 2.2,
        "dividendYield": 67e-4,
        "roe": 0.4001,
        "debtToEquity": 0.4065,
        "netMargin": 0.0848
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 21439.7,
        "operatingIncome": 2228.86,
        "netIncome": 1557.62,
        "freeCashFlow": 1165.38,
        "dividendPerShare": 0.533,
        "assets": 6745.64,
        "liabilities": 1955.59,
        "equity": 4790.04,
        "per": 21.83,
        "pbr": 1.85,
        "dividendYield": 8e-3,
        "roe": 0.3252,
        "debtToEquity": 0.4083,
        "netMargin": 0.0727
      }
    ]
  },
  "PAY": {
    "symbol": "PAY",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 1654.9,
        "operatingIncome": 267.31,
        "netIncome": 169.85,
        "eps": 0.1864,
        "assets": 3724.18,
        "liabilities": 1480.76,
        "equity": 2243.43,
        "freeCashFlow": 112.95,
        "dividendPerShare": 0.0818,
        "per": 24.4,
        "pbr": 1.85,
        "dividendYield": 0.018,
        "roe": 0.3028,
        "debtToEquity": 0.66,
        "netMargin": 0.1026,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 1674.17,
        "operatingIncome": 306.95,
        "netIncome": 177.27,
        "eps": 0.1946,
        "assets": 3745.13,
        "liabilities": 1521.52,
        "equity": 2223.61,
        "freeCashFlow": 179.52,
        "dividendPerShare": 0.0843,
        "per": 24.51,
        "pbr": 1.95,
        "dividendYield": 0.0177,
        "roe": 0.3189,
        "debtToEquity": 0.6843,
        "netMargin": 0.1059,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 1683.55,
        "operatingIncome": 236.95,
        "netIncome": 172.08,
        "eps": 0.1889,
        "assets": 3773.42,
        "liabilities": 1580.31,
        "equity": 2193.11,
        "freeCashFlow": 130.67,
        "dividendPerShare": 0.0934,
        "per": 23.36,
        "pbr": 1.83,
        "dividendYield": 0.0212,
        "roe": 0.3139,
        "debtToEquity": 0.7206,
        "netMargin": 0.1022,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 1753.3,
        "operatingIncome": 296.03,
        "netIncome": 145.55,
        "eps": 0.1598,
        "assets": 3822.65,
        "liabilities": 1580.87,
        "equity": 2241.78,
        "freeCashFlow": 143.69,
        "dividendPerShare": 0.0957,
        "per": 19.28,
        "pbr": 1.25,
        "dividendYield": 0.031,
        "roe": 0.2597,
        "debtToEquity": 0.7052,
        "netMargin": 0.083,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 1736.33,
        "operatingIncome": 283.5,
        "netIncome": 166.31,
        "eps": 0.1826,
        "assets": 3948.57,
        "liabilities": 1656,
        "equity": 2292.57,
        "freeCashFlow": 137.81,
        "dividendPerShare": 0.0874,
        "per": 22.51,
        "pbr": 1.63,
        "dividendYield": 0.0213,
        "roe": 0.2902,
        "debtToEquity": 0.7223,
        "netMargin": 0.0958,
        "revenueYoY": 0.0492
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 1806.3,
        "operatingIncome": 360.43,
        "netIncome": 192.17,
        "eps": 0.2109,
        "assets": 4008.46,
        "liabilities": 1657.33,
        "equity": 2351.12,
        "freeCashFlow": 126.35,
        "dividendPerShare": 0.0845,
        "per": 25.55,
        "pbr": 2.09,
        "dividendYield": 0.0157,
        "roe": 0.3269,
        "debtToEquity": 0.7049,
        "netMargin": 0.1064,
        "revenueYoY": 0.0789
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 1866.22,
        "operatingIncome": 303.94,
        "netIncome": 206.46,
        "eps": 0.2266,
        "assets": 4027.66,
        "liabilities": 1668.47,
        "equity": 2359.18,
        "freeCashFlow": 174.33,
        "dividendPerShare": 0.086,
        "per": 23.48,
        "pbr": 2.06,
        "dividendYield": 0.0162,
        "roe": 0.3501,
        "debtToEquity": 0.7072,
        "netMargin": 0.1106,
        "revenueYoY": 0.1085
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 2092.07,
        "operatingIncome": 290.06,
        "netIncome": 233.77,
        "eps": 0.2566,
        "assets": 4080.02,
        "liabilities": 1654.7,
        "equity": 2425.32,
        "freeCashFlow": 199.58,
        "dividendPerShare": 0.0779,
        "per": 26.6,
        "pbr": 2.56,
        "dividendYield": 0.0114,
        "roe": 0.3855,
        "debtToEquity": 0.6823,
        "netMargin": 0.1117,
        "revenueYoY": 0.1932
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 2098.85,
        "operatingIncome": 384.75,
        "netIncome": 219.69,
        "eps": 0.2412,
        "assets": 4084.51,
        "liabilities": 1644.59,
        "equity": 2439.92,
        "freeCashFlow": 154.7,
        "dividendPerShare": 0.1014,
        "per": 20.02,
        "pbr": 1.8,
        "dividendYield": 0.021,
        "roe": 0.3602,
        "debtToEquity": 0.674,
        "netMargin": 0.1047,
        "revenueYoY": 0.2088
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 2203.45,
        "operatingIncome": 301.01,
        "netIncome": 264.54,
        "eps": 0.2904,
        "assets": 4111.19,
        "liabilities": 1639.7,
        "equity": 2471.49,
        "freeCashFlow": 207.62,
        "dividendPerShare": 0.0902,
        "per": 26.77,
        "pbr": 2.87,
        "dividendYield": 0.0116,
        "roe": 0.4281,
        "debtToEquity": 0.6634,
        "netMargin": 0.1201,
        "revenueYoY": 0.2199
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 2262.35,
        "operatingIncome": 415.81,
        "netIncome": 262.49,
        "eps": 0.2881,
        "assets": 4199.59,
        "liabilities": 1683.29,
        "equity": 2516.3,
        "freeCashFlow": 223.41,
        "dividendPerShare": 0.0779,
        "per": 18.9,
        "pbr": 1.97,
        "dividendYield": 0.0143,
        "roe": 0.4173,
        "debtToEquity": 0.669,
        "netMargin": 0.116,
        "revenueYoY": 0.2123
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 2485.18,
        "operatingIncome": 423.08,
        "netIncome": 250.21,
        "eps": 0.2747,
        "assets": 4264.49,
        "liabilities": 1676.38,
        "equity": 2588.11,
        "freeCashFlow": 193.22,
        "dividendPerShare": 0.08,
        "per": 22.48,
        "pbr": 2.17,
        "dividendYield": 0.013,
        "roe": 0.3867,
        "debtToEquity": 0.6477,
        "netMargin": 0.1007,
        "revenueYoY": 0.1879
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 2446.96,
        "operatingIncome": 391.58,
        "netIncome": 257.72,
        "eps": 0.2829,
        "assets": 4250.95,
        "liabilities": 1710.89,
        "equity": 2540.06,
        "freeCashFlow": 215.69,
        "dividendPerShare": 0.0941,
        "per": 25.68,
        "pbr": 2.61,
        "dividendYield": 0.013,
        "roe": 0.4059,
        "debtToEquity": 0.6736,
        "netMargin": 0.1053,
        "revenueYoY": 0.1659
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 2602.63,
        "operatingIncome": 427.33,
        "netIncome": 285.44,
        "eps": 0.3133,
        "assets": 4294.36,
        "liabilities": 1759.25,
        "equity": 2535.11,
        "freeCashFlow": 272.61,
        "dividendPerShare": 0.0961,
        "per": 22.8,
        "pbr": 2.57,
        "dividendYield": 0.0135,
        "roe": 0.4504,
        "debtToEquity": 0.694,
        "netMargin": 0.1097,
        "revenueYoY": 0.1812
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 2720.84,
        "operatingIncome": 445.62,
        "netIncome": 340.46,
        "eps": 0.3737,
        "assets": 4322.2,
        "liabilities": 1723.51,
        "equity": 2598.69,
        "freeCashFlow": 234.65,
        "dividendPerShare": 0.0817,
        "per": 22.01,
        "pbr": 2.88,
        "dividendYield": 99e-4,
        "roe": 0.524,
        "debtToEquity": 0.6632,
        "netMargin": 0.1251,
        "revenueYoY": 0.2027
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 2942,
        "operatingIncome": 479.33,
        "netIncome": 273.66,
        "eps": 0.3004,
        "assets": 4394.33,
        "liabilities": 1667.44,
        "equity": 2726.89,
        "freeCashFlow": 165.26,
        "dividendPerShare": 0.0748,
        "per": 23.7,
        "pbr": 2.38,
        "dividendYield": 0.0105,
        "roe": 0.4014,
        "debtToEquity": 0.6115,
        "netMargin": 0.093,
        "revenueYoY": 0.1838
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 2894.83,
        "operatingIncome": 524.98,
        "netIncome": 309.57,
        "eps": 0.3398,
        "assets": 4453.43,
        "liabilities": 1718.84,
        "equity": 2734.59,
        "freeCashFlow": 331.13,
        "dividendPerShare": 0.0837,
        "per": 21.42,
        "pbr": 2.42,
        "dividendYield": 0.0115,
        "roe": 0.4528,
        "debtToEquity": 0.6286,
        "netMargin": 0.1069,
        "revenueYoY": 0.183
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 3058.78,
        "operatingIncome": 555.16,
        "netIncome": 286.51,
        "eps": 0.3145,
        "assets": 4512.18,
        "liabilities": 1710.05,
        "equity": 2802.13,
        "freeCashFlow": 241.02,
        "dividendPerShare": 0.0804,
        "per": 24.9,
        "pbr": 2.55,
        "dividendYield": 0.0103,
        "roe": 0.409,
        "debtToEquity": 0.6103,
        "netMargin": 0.0937,
        "revenueYoY": 0.1753
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 3144.52,
        "operatingIncome": 547.59,
        "netIncome": 364.31,
        "eps": 0.3999,
        "assets": 4624.91,
        "liabilities": 1781.59,
        "equity": 2843.32,
        "freeCashFlow": 334.76,
        "dividendPerShare": 0.0872,
        "per": 27.35,
        "pbr": 3.5,
        "dividendYield": 8e-3,
        "roe": 0.5125,
        "debtToEquity": 0.6266,
        "netMargin": 0.1159,
        "revenueYoY": 0.1557
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 3424.23,
        "operatingIncome": 547.37,
        "netIncome": 366.11,
        "eps": 0.4019,
        "assets": 4669.28,
        "liabilities": 1814.22,
        "equity": 2855.06,
        "freeCashFlow": 345.41,
        "dividendPerShare": 0.0993,
        "per": 24.62,
        "pbr": 3.16,
        "dividendYield": 0.01,
        "roe": 0.5129,
        "debtToEquity": 0.6354,
        "netMargin": 0.1069,
        "revenueYoY": 0.1639
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 3514.26,
        "operatingIncome": 588.07,
        "netIncome": 410.83,
        "eps": 0.451,
        "assets": 4842.85,
        "liabilities": 1857.79,
        "equity": 2985.05,
        "freeCashFlow": 429.57,
        "dividendPerShare": 0.0773,
        "per": 23.25,
        "pbr": 3.2,
        "dividendYield": 74e-4,
        "roe": 0.5505,
        "debtToEquity": 0.6224,
        "netMargin": 0.1169,
        "revenueYoY": 0.214
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 3668.07,
        "operatingIncome": 676.91,
        "netIncome": 364.06,
        "eps": 0.3996,
        "assets": 4870.33,
        "liabilities": 1851.58,
        "equity": 3018.75,
        "freeCashFlow": 369.66,
        "dividendPerShare": 0.0755,
        "per": 25.27,
        "pbr": 3.05,
        "dividendYield": 75e-4,
        "roe": 0.4824,
        "debtToEquity": 0.6134,
        "netMargin": 0.0992,
        "revenueYoY": 0.1992
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 3732.95,
        "operatingIncome": 525.78,
        "netIncome": 382.05,
        "eps": 0.4194,
        "assets": 4908.19,
        "liabilities": 1944.92,
        "equity": 2963.28,
        "freeCashFlow": 355.28,
        "dividendPerShare": 0.1036,
        "per": 18.11,
        "pbr": 2.33,
        "dividendYield": 0.0136,
        "roe": 0.5157,
        "debtToEquity": 0.6563,
        "netMargin": 0.1023,
        "revenueYoY": 0.1871
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 3935.74,
        "operatingIncome": 658.56,
        "netIncome": 420.02,
        "eps": 0.4611,
        "assets": 4962.84,
        "liabilities": 1923.42,
        "equity": 3039.42,
        "freeCashFlow": 451.25,
        "dividendPerShare": 0.094,
        "per": 25.85,
        "pbr": 3.57,
        "dividendYield": 79e-4,
        "roe": 0.5528,
        "debtToEquity": 0.6328,
        "netMargin": 0.1067,
        "revenueYoY": 0.1494
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 3871.63,
        "operatingIncome": 562.32,
        "netIncome": 366.27,
        "eps": 0.4021,
        "assets": 5009.74,
        "liabilities": 2016.41,
        "equity": 2993.33,
        "freeCashFlow": 268.23,
        "dividendPerShare": 0.0747,
        "per": 22.97,
        "pbr": 2.81,
        "dividendYield": 81e-4,
        "roe": 0.4894,
        "debtToEquity": 0.6736,
        "netMargin": 0.0946,
        "revenueYoY": 0.1017
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 3984.59,
        "operatingIncome": 609.45,
        "netIncome": 344.08,
        "eps": 0.3777,
        "assets": 5022.52,
        "liabilities": 2056.78,
        "equity": 2965.74,
        "freeCashFlow": 209.07,
        "dividendPerShare": 0.0778,
        "per": 25.52,
        "pbr": 2.96,
        "dividendYield": 81e-4,
        "roe": 0.4641,
        "debtToEquity": 0.6935,
        "netMargin": 0.0864,
        "revenueYoY": 0.0863
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 4061.66,
        "operatingIncome": 611.26,
        "netIncome": 407.13,
        "eps": 0.4469,
        "assets": 5179.22,
        "liabilities": 2151.16,
        "equity": 3028.06,
        "freeCashFlow": 389.15,
        "dividendPerShare": 0.0989,
        "per": 25.33,
        "pbr": 3.41,
        "dividendYield": 87e-4,
        "roe": 0.5378,
        "debtToEquity": 0.7104,
        "netMargin": 0.1002,
        "revenueYoY": 0.0881
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 4253.45,
        "operatingIncome": 704.39,
        "netIncome": 464.93,
        "eps": 0.5104,
        "assets": 5236.04,
        "liabilities": 2134.43,
        "equity": 3101.61,
        "freeCashFlow": 372.84,
        "dividendPerShare": 0.0868,
        "per": 25.34,
        "pbr": 3.8,
        "dividendYield": 67e-4,
        "roe": 0.5996,
        "debtToEquity": 0.6882,
        "netMargin": 0.1093,
        "revenueYoY": 0.0807
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 4111.31,
        "operatingIncome": 547.02,
        "netIncome": 374.37,
        "eps": 0.411,
        "assets": 5204.3,
        "liabilities": 2137.93,
        "equity": 3066.37,
        "freeCashFlow": 388.68,
        "dividendPerShare": 0.0742,
        "per": 27.57,
        "pbr": 3.37,
        "dividendYield": 65e-4,
        "roe": 0.4884,
        "debtToEquity": 0.6972,
        "netMargin": 0.0911,
        "revenueYoY": 0.0619
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 4140.73,
        "operatingIncome": 695.1,
        "netIncome": 425.05,
        "eps": 0.4666,
        "assets": 5223.45,
        "liabilities": 2171.23,
        "equity": 3052.22,
        "freeCashFlow": 463.66,
        "dividendPerShare": 0.0798,
        "per": 25.63,
        "pbr": 3.57,
        "dividendYield": 67e-4,
        "roe": 0.557,
        "debtToEquity": 0.7114,
        "netMargin": 0.1027,
        "revenueYoY": 0.0392
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 4067.14,
        "operatingIncome": 594.25,
        "netIncome": 378.85,
        "eps": 0.4159,
        "assets": 5210.75,
        "liabilities": 2261.79,
        "equity": 2948.96,
        "freeCashFlow": 404.7,
        "dividendPerShare": 0.0871,
        "per": 27.59,
        "pbr": 3.54,
        "dividendYield": 76e-4,
        "roe": 0.5139,
        "debtToEquity": 0.767,
        "netMargin": 0.0931,
        "revenueYoY": 14e-4
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 4259.04,
        "operatingIncome": 672.84,
        "netIncome": 366.17,
        "eps": 0.402,
        "assets": 5344.92,
        "liabilities": 2313.69,
        "equity": 3031.23,
        "freeCashFlow": 315.48,
        "dividendPerShare": 0.1057,
        "per": 25.17,
        "pbr": 3.04,
        "dividendYield": 0.0104,
        "roe": 0.4832,
        "debtToEquity": 0.7633,
        "netMargin": 0.086,
        "revenueYoY": 13e-4
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 4146.41,
        "operatingIncome": 557.25,
        "netIncome": 382.81,
        "eps": 0.4202,
        "assets": 5436.14,
        "liabilities": 2342.48,
        "equity": 3093.66,
        "freeCashFlow": 315.54,
        "dividendPerShare": 0.092,
        "per": 25.1,
        "pbr": 3.11,
        "dividendYield": 87e-4,
        "roe": 0.495,
        "debtToEquity": 0.7572,
        "netMargin": 0.0923,
        "revenueYoY": 85e-4
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 4171.48,
        "operatingIncome": 659.09,
        "netIncome": 489.92,
        "eps": 0.5378,
        "assets": 5432.72,
        "liabilities": 2415.82,
        "equity": 3016.9,
        "freeCashFlow": 476.87,
        "dividendPerShare": 0.0794,
        "per": 22.39,
        "pbr": 3.64,
        "dividendYield": 66e-4,
        "roe": 0.6496,
        "debtToEquity": 0.8008,
        "netMargin": 0.1174,
        "revenueYoY": 74e-4
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 4042.49,
        "operatingIncome": 565.44,
        "netIncome": 387.49,
        "eps": 0.4254,
        "assets": 5491.63,
        "liabilities": 2488.94,
        "equity": 3002.69,
        "freeCashFlow": 272.23,
        "dividendPerShare": 0.1034,
        "per": 20.62,
        "pbr": 2.66,
        "dividendYield": 0.0118,
        "roe": 0.5162,
        "debtToEquity": 0.8289,
        "netMargin": 0.0959,
        "revenueYoY": -61e-4
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 4192.52,
        "operatingIncome": 640.28,
        "netIncome": 392.76,
        "eps": 0.4312,
        "assets": 5574.21,
        "liabilities": 2487.68,
        "equity": 3086.53,
        "freeCashFlow": 325.17,
        "dividendPerShare": 0.1012,
        "per": 18.36,
        "pbr": 2.34,
        "dividendYield": 0.0128,
        "roe": 0.509,
        "debtToEquity": 0.806,
        "netMargin": 0.0937,
        "revenueYoY": -0.0156
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 3912.75,
        "operatingIncome": 628.05,
        "netIncome": 358.87,
        "eps": 0.3939,
        "assets": 5627.1,
        "liabilities": 2575.69,
        "equity": 3051.41,
        "freeCashFlow": 255.8,
        "dividendPerShare": 0.081,
        "per": 24.86,
        "pbr": 2.92,
        "dividendYield": 83e-4,
        "roe": 0.4704,
        "debtToEquity": 0.8441,
        "netMargin": 0.0917,
        "revenueYoY": -0.0564
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 3842.56,
        "operatingIncome": 633.39,
        "netIncome": 369.78,
        "eps": 0.4059,
        "assets": 5642.48,
        "liabilities": 2604.47,
        "equity": 3038.01,
        "freeCashFlow": 387.87,
        "dividendPerShare": 0.09,
        "per": 24.38,
        "pbr": 2.97,
        "dividendYield": 91e-4,
        "roe": 0.4869,
        "debtToEquity": 0.8573,
        "netMargin": 0.0962,
        "revenueYoY": -0.0788
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 3892.48,
        "operatingIncome": 591.57,
        "netIncome": 310.26,
        "eps": 0.3406,
        "assets": 5746.9,
        "liabilities": 2682.52,
        "equity": 3064.38,
        "freeCashFlow": 277.69,
        "dividendPerShare": 0.0749,
        "per": 19.07,
        "pbr": 1.93,
        "dividendYield": 0.0115,
        "roe": 0.405,
        "debtToEquity": 0.8754,
        "netMargin": 0.0797,
        "revenueYoY": -0.0371
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 4064.57,
        "operatingIncome": 682.9,
        "netIncome": 401.08,
        "eps": 0.4403,
        "assets": 5729.68,
        "liabilities": 2699.03,
        "equity": 3030.64,
        "freeCashFlow": 257.23,
        "dividendPerShare": 0.0975,
        "per": 24.55,
        "pbr": 3.25,
        "dividendYield": 9e-3,
        "roe": 0.5294,
        "debtToEquity": 0.8906,
        "netMargin": 0.0987,
        "revenueYoY": -0.0305
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 6765.92,
        "operatingIncome": 1107.24,
        "netIncome": 664.75,
        "freeCashFlow": 566.83,
        "dividendPerShare": 0.3552,
        "assets": 3822.65,
        "liabilities": 1580.87,
        "equity": 2241.78,
        "per": 19.28,
        "pbr": 1.25,
        "dividendYield": 0.031,
        "roe": 0.2965,
        "debtToEquity": 0.7052,
        "netMargin": 0.0982
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 7500.92,
        "operatingIncome": 1237.92,
        "netIncome": 798.71,
        "freeCashFlow": 638.06,
        "dividendPerShare": 0.3358,
        "assets": 4080.02,
        "liabilities": 1654.7,
        "equity": 2425.32,
        "per": 26.6,
        "pbr": 2.56,
        "dividendYield": 0.0114,
        "roe": 0.3293,
        "debtToEquity": 0.6823,
        "netMargin": 0.1065
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 9049.83,
        "operatingIncome": 1524.66,
        "netIncome": 996.94,
        "freeCashFlow": 778.95,
        "dividendPerShare": 0.3494,
        "assets": 4264.49,
        "liabilities": 1676.38,
        "equity": 2588.11,
        "per": 22.48,
        "pbr": 2.17,
        "dividendYield": 0.013,
        "roe": 0.3852,
        "debtToEquity": 0.6477,
        "netMargin": 0.1102
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 10712.43,
        "operatingIncome": 1743.86,
        "netIncome": 1157.29,
        "freeCashFlow": 888.21,
        "dividendPerShare": 0.3468,
        "assets": 4394.33,
        "liabilities": 1667.44,
        "equity": 2726.89,
        "per": 23.7,
        "pbr": 2.38,
        "dividendYield": 0.0105,
        "roe": 0.4244,
        "debtToEquity": 0.6115,
        "netMargin": 0.108
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 12522.36,
        "operatingIncome": 2175.09,
        "netIncome": 1326.51,
        "freeCashFlow": 1252.33,
        "dividendPerShare": 0.3505,
        "assets": 4669.28,
        "liabilities": 1814.22,
        "equity": 2855.06,
        "per": 24.62,
        "pbr": 3.16,
        "dividendYield": 0.01,
        "roe": 0.4646,
        "debtToEquity": 0.6354,
        "netMargin": 0.1059
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 14851.03,
        "operatingIncome": 2449.33,
        "netIncome": 1576.96,
        "freeCashFlow": 1605.77,
        "dividendPerShare": 0.3505,
        "assets": 4962.84,
        "liabilities": 1923.42,
        "equity": 3039.42,
        "per": 25.85,
        "pbr": 3.57,
        "dividendYield": 79e-4,
        "roe": 0.5188,
        "debtToEquity": 0.6328,
        "netMargin": 0.1062
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 16171.32,
        "operatingIncome": 2487.42,
        "netIncome": 1582.4,
        "freeCashFlow": 1239.29,
        "dividendPerShare": 0.3382,
        "assets": 5236.04,
        "liabilities": 2134.43,
        "equity": 3101.61,
        "per": 25.34,
        "pbr": 3.8,
        "dividendYield": 67e-4,
        "roe": 0.5102,
        "debtToEquity": 0.6882,
        "netMargin": 0.0979
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 16578.22,
        "operatingIncome": 2509.21,
        "netIncome": 1544.45,
        "freeCashFlow": 1572.53,
        "dividendPerShare": 0.3468,
        "assets": 5344.92,
        "liabilities": 2313.69,
        "equity": 3031.23,
        "per": 25.17,
        "pbr": 3.04,
        "dividendYield": 0.0104,
        "roe": 0.5095,
        "debtToEquity": 0.7633,
        "netMargin": 0.0932
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 16552.9,
        "operatingIncome": 2422.06,
        "netIncome": 1652.98,
        "freeCashFlow": 1389.81,
        "dividendPerShare": 0.3761,
        "assets": 5574.21,
        "liabilities": 2487.68,
        "equity": 3086.53,
        "per": 18.36,
        "pbr": 2.34,
        "dividendYield": 0.0128,
        "roe": 0.5355,
        "debtToEquity": 0.806,
        "netMargin": 0.0999
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 15712.37,
        "operatingIncome": 2535.91,
        "netIncome": 1440,
        "freeCashFlow": 1178.59,
        "dividendPerShare": 0.3434,
        "assets": 5729.68,
        "liabilities": 2699.03,
        "equity": 3030.64,
        "per": 24.55,
        "pbr": 3.25,
        "dividendYield": 9e-3,
        "roe": 0.4751,
        "debtToEquity": 0.8906,
        "netMargin": 0.0916
      }
    ]
  },
  "MEM": {
    "symbol": "MEM",
    "quarterly": [
      {
        "period": "2016-Q1",
        "year": 2016,
        "quarter": 1,
        "startDate": "2016-01-01",
        "endDate": "2016-03-31",
        "revenue": 518.9,
        "operatingIncome": 57.68,
        "netIncome": 13.11,
        "eps": 0.0198,
        "assets": 1105.51,
        "liabilities": 413.44,
        "equity": 692.08,
        "freeCashFlow": 8.28,
        "dividendPerShare": 0,
        "per": 50.42,
        "pbr": 0.95,
        "dividendYield": 0,
        "roe": 0.0758,
        "debtToEquity": 0.5974,
        "netMargin": 0.0253,
        "revenueYoY": null
      },
      {
        "period": "2016-Q2",
        "year": 2016,
        "quarter": 2,
        "startDate": "2016-04-01",
        "endDate": "2016-06-30",
        "revenue": 552.73,
        "operatingIncome": 67.15,
        "netIncome": 30.74,
        "eps": 0.0465,
        "assets": 1138.97,
        "liabilities": 430.56,
        "equity": 708.41,
        "freeCashFlow": 23.66,
        "dividendPerShare": 0,
        "per": 47.33,
        "pbr": 2.05,
        "dividendYield": 0,
        "roe": 0.1736,
        "debtToEquity": 0.6078,
        "netMargin": 0.0556,
        "revenueYoY": null
      },
      {
        "period": "2016-Q3",
        "year": 2016,
        "quarter": 3,
        "startDate": "2016-07-01",
        "endDate": "2016-09-30",
        "revenue": 563.46,
        "operatingIncome": 68.23,
        "netIncome": 29.05,
        "eps": 0.044,
        "assets": 1158.04,
        "liabilities": 444.71,
        "equity": 713.33,
        "freeCashFlow": 18.18,
        "dividendPerShare": 0,
        "per": 45.59,
        "pbr": 1.86,
        "dividendYield": 0,
        "roe": 0.1629,
        "debtToEquity": 0.6234,
        "netMargin": 0.0516,
        "revenueYoY": null
      },
      {
        "period": "2016-Q4",
        "year": 2016,
        "quarter": 4,
        "startDate": "2016-10-01",
        "endDate": "2016-12-31",
        "revenue": 624.72,
        "operatingIncome": 79.81,
        "netIncome": 31.33,
        "eps": 0.0474,
        "assets": 1161.36,
        "liabilities": 454.71,
        "equity": 706.64,
        "freeCashFlow": 22.76,
        "dividendPerShare": 0,
        "per": 44.63,
        "pbr": 1.98,
        "dividendYield": 0,
        "roe": 0.1773,
        "debtToEquity": 0.6435,
        "netMargin": 0.0501,
        "revenueYoY": null
      },
      {
        "period": "2017-Q1",
        "year": 2017,
        "quarter": 1,
        "startDate": "2017-01-01",
        "endDate": "2017-03-31",
        "revenue": 639.05,
        "operatingIncome": 65.77,
        "netIncome": 25.9,
        "eps": 0.0392,
        "assets": 1167.02,
        "liabilities": 480.59,
        "equity": 686.43,
        "freeCashFlow": 16.4,
        "dividendPerShare": 0,
        "per": 44.49,
        "pbr": 1.68,
        "dividendYield": 0,
        "roe": 0.1509,
        "debtToEquity": 0.7001,
        "netMargin": 0.0405,
        "revenueYoY": 0.2315
      },
      {
        "period": "2017-Q2",
        "year": 2017,
        "quarter": 2,
        "startDate": "2017-04-01",
        "endDate": "2017-06-30",
        "revenue": 678.38,
        "operatingIncome": 80.26,
        "netIncome": 33.45,
        "eps": 0.0506,
        "assets": 1185.23,
        "liabilities": 494.77,
        "equity": 690.46,
        "freeCashFlow": 23.89,
        "dividendPerShare": 0,
        "per": 38.4,
        "pbr": 1.86,
        "dividendYield": 0,
        "roe": 0.1938,
        "debtToEquity": 0.7166,
        "netMargin": 0.0493,
        "revenueYoY": 0.2273
      },
      {
        "period": "2017-Q3",
        "year": 2017,
        "quarter": 3,
        "startDate": "2017-07-01",
        "endDate": "2017-09-30",
        "revenue": 727.35,
        "operatingIncome": 84.2,
        "netIncome": 54.93,
        "eps": 0.0831,
        "assets": 1225.69,
        "liabilities": 513.54,
        "equity": 712.15,
        "freeCashFlow": 40.46,
        "dividendPerShare": 0,
        "per": 41.01,
        "pbr": 3.16,
        "dividendYield": 0,
        "roe": 0.3085,
        "debtToEquity": 0.7211,
        "netMargin": 0.0755,
        "revenueYoY": 0.2909
      },
      {
        "period": "2017-Q4",
        "year": 2017,
        "quarter": 4,
        "startDate": "2017-10-01",
        "endDate": "2017-12-31",
        "revenue": 798.77,
        "operatingIncome": 70.91,
        "netIncome": 39.93,
        "eps": 0.0604,
        "assets": 1250.49,
        "liabilities": 518.02,
        "equity": 732.46,
        "freeCashFlow": 37.17,
        "dividendPerShare": 0,
        "per": 45,
        "pbr": 2.45,
        "dividendYield": 0,
        "roe": 0.2181,
        "debtToEquity": 0.7072,
        "netMargin": 0.05,
        "revenueYoY": 0.2786
      },
      {
        "period": "2018-Q1",
        "year": 2018,
        "quarter": 1,
        "startDate": "2018-01-01",
        "endDate": "2018-03-31",
        "revenue": 834.49,
        "operatingIncome": 95.51,
        "netIncome": 34.36,
        "eps": 0.052,
        "assets": 1269.71,
        "liabilities": 522.2,
        "equity": 747.51,
        "freeCashFlow": 31.52,
        "dividendPerShare": 0,
        "per": 36.32,
        "pbr": 1.67,
        "dividendYield": 0,
        "roe": 0.1839,
        "debtToEquity": 0.6986,
        "netMargin": 0.0412,
        "revenueYoY": 0.3058
      },
      {
        "period": "2018-Q2",
        "year": 2018,
        "quarter": 2,
        "startDate": "2018-04-01",
        "endDate": "2018-06-30",
        "revenue": 893.23,
        "operatingIncome": 121.54,
        "netIncome": 25.01,
        "eps": 0.0378,
        "assets": 1299.25,
        "liabilities": 544.36,
        "equity": 754.9,
        "freeCashFlow": 22.38,
        "dividendPerShare": 0,
        "per": 41.4,
        "pbr": 1.37,
        "dividendYield": 0,
        "roe": 0.1325,
        "debtToEquity": 0.7211,
        "netMargin": 0.028,
        "revenueYoY": 0.3167
      },
      {
        "period": "2018-Q3",
        "year": 2018,
        "quarter": 3,
        "startDate": "2018-07-01",
        "endDate": "2018-09-30",
        "revenue": 910.33,
        "operatingIncome": 107.76,
        "netIncome": 46.38,
        "eps": 0.0702,
        "assets": 1330.43,
        "liabilities": 560.63,
        "equity": 769.8,
        "freeCashFlow": 33.96,
        "dividendPerShare": 0,
        "per": 35.82,
        "pbr": 2.16,
        "dividendYield": 0,
        "roe": 0.241,
        "debtToEquity": 0.7283,
        "netMargin": 0.0509,
        "revenueYoY": 0.2516
      },
      {
        "period": "2018-Q4",
        "year": 2018,
        "quarter": 4,
        "startDate": "2018-10-01",
        "endDate": "2018-12-31",
        "revenue": 1004.76,
        "operatingIncome": 89.13,
        "netIncome": 43.29,
        "eps": 0.0655,
        "assets": 1359.6,
        "liabilities": 575.99,
        "equity": 783.6,
        "freeCashFlow": 29.41,
        "dividendPerShare": 0,
        "per": 40.58,
        "pbr": 2.24,
        "dividendYield": 0,
        "roe": 0.221,
        "debtToEquity": 0.7351,
        "netMargin": 0.0431,
        "revenueYoY": 0.2579
      },
      {
        "period": "2019-Q1",
        "year": 2019,
        "quarter": 1,
        "startDate": "2019-01-01",
        "endDate": "2019-03-31",
        "revenue": 1047.97,
        "operatingIncome": 129.26,
        "netIncome": 47.13,
        "eps": 0.0713,
        "assets": 1406.1,
        "liabilities": 593.77,
        "equity": 812.33,
        "freeCashFlow": 42.41,
        "dividendPerShare": 0,
        "per": 37.55,
        "pbr": 2.18,
        "dividendYield": 0,
        "roe": 0.2321,
        "debtToEquity": 0.7309,
        "netMargin": 0.045,
        "revenueYoY": 0.2558
      },
      {
        "period": "2019-Q2",
        "year": 2019,
        "quarter": 2,
        "startDate": "2019-04-01",
        "endDate": "2019-06-30",
        "revenue": 1130.43,
        "operatingIncome": 156.58,
        "netIncome": 53.65,
        "eps": 0.0812,
        "assets": 1453.89,
        "liabilities": 643.86,
        "equity": 810.03,
        "freeCashFlow": 49.87,
        "dividendPerShare": 0,
        "per": 41.34,
        "pbr": 2.74,
        "dividendYield": 0,
        "roe": 0.2649,
        "debtToEquity": 0.7949,
        "netMargin": 0.0475,
        "revenueYoY": 0.2656
      },
      {
        "period": "2019-Q3",
        "year": 2019,
        "quarter": 3,
        "startDate": "2019-07-01",
        "endDate": "2019-09-30",
        "revenue": 1208.85,
        "operatingIncome": 150.53,
        "netIncome": 65.51,
        "eps": 0.0991,
        "assets": 1456.64,
        "liabilities": 628.13,
        "equity": 828.5,
        "freeCashFlow": 41.98,
        "dividendPerShare": 0,
        "per": 40.24,
        "pbr": 3.18,
        "dividendYield": 0,
        "roe": 0.3163,
        "debtToEquity": 0.7582,
        "netMargin": 0.0542,
        "revenueYoY": 0.3279
      },
      {
        "period": "2019-Q4",
        "year": 2019,
        "quarter": 4,
        "startDate": "2019-10-01",
        "endDate": "2019-12-31",
        "revenue": 1340.72,
        "operatingIncome": 188.96,
        "netIncome": 83.13,
        "eps": 0.1258,
        "assets": 1484.35,
        "liabilities": 641.53,
        "equity": 842.81,
        "freeCashFlow": 52.81,
        "dividendPerShare": 0,
        "per": 45.26,
        "pbr": 4.46,
        "dividendYield": 0,
        "roe": 0.3945,
        "debtToEquity": 0.7612,
        "netMargin": 0.062,
        "revenueYoY": 0.3344
      },
      {
        "period": "2020-Q1",
        "year": 2020,
        "quarter": 1,
        "startDate": "2020-01-01",
        "endDate": "2020-03-31",
        "revenue": 1354.48,
        "operatingIncome": 164.54,
        "netIncome": 72.08,
        "eps": 0.1091,
        "assets": 1499.16,
        "liabilities": 655.14,
        "equity": 844.02,
        "freeCashFlow": 59.16,
        "dividendPerShare": 0,
        "per": 45.98,
        "pbr": 3.93,
        "dividendYield": 0,
        "roe": 0.3416,
        "debtToEquity": 0.7762,
        "netMargin": 0.0532,
        "revenueYoY": 0.2925
      },
      {
        "period": "2020-Q2",
        "year": 2020,
        "quarter": 2,
        "startDate": "2020-04-01",
        "endDate": "2020-06-30",
        "revenue": 1466.03,
        "operatingIncome": 178.92,
        "netIncome": 72.12,
        "eps": 0.1091,
        "assets": 1540.97,
        "liabilities": 663.45,
        "equity": 877.52,
        "freeCashFlow": 75.89,
        "dividendPerShare": 0,
        "per": 37.18,
        "pbr": 3.06,
        "dividendYield": 0,
        "roe": 0.3287,
        "debtToEquity": 0.7561,
        "netMargin": 0.0492,
        "revenueYoY": 0.2969
      },
      {
        "period": "2020-Q3",
        "year": 2020,
        "quarter": 3,
        "startDate": "2020-07-01",
        "endDate": "2020-09-30",
        "revenue": 1562.49,
        "operatingIncome": 204.63,
        "netIncome": 106.76,
        "eps": 0.1615,
        "assets": 1579.6,
        "liabilities": 685.22,
        "equity": 894.39,
        "freeCashFlow": 65.68,
        "dividendPerShare": 0,
        "per": 45.75,
        "pbr": 5.46,
        "dividendYield": 0,
        "roe": 0.4774,
        "debtToEquity": 0.7661,
        "netMargin": 0.0683,
        "revenueYoY": 0.2925
      },
      {
        "period": "2020-Q4",
        "year": 2020,
        "quarter": 4,
        "startDate": "2020-10-01",
        "endDate": "2020-12-31",
        "revenue": 1748.44,
        "operatingIncome": 179.58,
        "netIncome": 51.15,
        "eps": 0.0774,
        "assets": 1605.8,
        "liabilities": 691.82,
        "equity": 913.98,
        "freeCashFlow": 51.31,
        "dividendPerShare": 0,
        "per": 41.04,
        "pbr": 2.3,
        "dividendYield": 0,
        "roe": 0.2239,
        "debtToEquity": 0.7569,
        "netMargin": 0.0293,
        "revenueYoY": 0.3041
      },
      {
        "period": "2021-Q1",
        "year": 2021,
        "quarter": 1,
        "startDate": "2021-01-01",
        "endDate": "2021-03-31",
        "revenue": 1762.76,
        "operatingIncome": 177.1,
        "netIncome": 61.51,
        "eps": 0.0931,
        "assets": 1643.93,
        "liabilities": 713.5,
        "equity": 930.43,
        "freeCashFlow": 52.96,
        "dividendPerShare": 0,
        "per": 40.73,
        "pbr": 2.69,
        "dividendYield": 0,
        "roe": 0.2644,
        "debtToEquity": 0.7669,
        "netMargin": 0.0349,
        "revenueYoY": 0.3014
      },
      {
        "period": "2021-Q2",
        "year": 2021,
        "quarter": 2,
        "startDate": "2021-04-01",
        "endDate": "2021-06-30",
        "revenue": 1857.66,
        "operatingIncome": 194.5,
        "netIncome": 118.7,
        "eps": 0.1796,
        "assets": 1691.98,
        "liabilities": 713.42,
        "equity": 978.56,
        "freeCashFlow": 130.01,
        "dividendPerShare": 0,
        "per": 41.45,
        "pbr": 5.03,
        "dividendYield": 0,
        "roe": 0.4852,
        "debtToEquity": 0.729,
        "netMargin": 0.0639,
        "revenueYoY": 0.2671
      },
      {
        "period": "2021-Q3",
        "year": 2021,
        "quarter": 3,
        "startDate": "2021-07-01",
        "endDate": "2021-09-30",
        "revenue": 1936.97,
        "operatingIncome": 251.85,
        "netIncome": 103.14,
        "eps": 0.1561,
        "assets": 1735.16,
        "liabilities": 724.75,
        "equity": 1010.41,
        "freeCashFlow": 102.39,
        "dividendPerShare": 0,
        "per": 43.34,
        "pbr": 4.42,
        "dividendYield": 0,
        "roe": 0.4083,
        "debtToEquity": 0.7173,
        "netMargin": 0.0533,
        "revenueYoY": 0.2397
      },
      {
        "period": "2021-Q4",
        "year": 2021,
        "quarter": 4,
        "startDate": "2021-10-01",
        "endDate": "2021-12-31",
        "revenue": 2129.85,
        "operatingIncome": 262.27,
        "netIncome": 78.2,
        "eps": 0.1183,
        "assets": 1791.58,
        "liabilities": 743.17,
        "equity": 1048.41,
        "freeCashFlow": 81.81,
        "dividendPerShare": 0,
        "per": 41.79,
        "pbr": 3.12,
        "dividendYield": 0,
        "roe": 0.2984,
        "debtToEquity": 0.7089,
        "netMargin": 0.0367,
        "revenueYoY": 0.2181
      },
      {
        "period": "2022-Q1",
        "year": 2022,
        "quarter": 1,
        "startDate": "2022-01-01",
        "endDate": "2022-03-31",
        "revenue": 2121.93,
        "operatingIncome": 222.42,
        "netIncome": 64.67,
        "eps": 0.0979,
        "assets": 1838.99,
        "liabilities": 757.83,
        "equity": 1081.16,
        "freeCashFlow": 59.44,
        "dividendPerShare": 0,
        "per": 41.68,
        "pbr": 2.49,
        "dividendYield": 0,
        "roe": 0.2393,
        "debtToEquity": 0.7009,
        "netMargin": 0.0305,
        "revenueYoY": 0.2038
      },
      {
        "period": "2022-Q2",
        "year": 2022,
        "quarter": 2,
        "startDate": "2022-04-01",
        "endDate": "2022-06-30",
        "revenue": 2237.88,
        "operatingIncome": 263.23,
        "netIncome": 95.08,
        "eps": 0.1439,
        "assets": 1851.62,
        "liabilities": 770.27,
        "equity": 1081.35,
        "freeCashFlow": 104.43,
        "dividendPerShare": 0,
        "per": 33.78,
        "pbr": 2.97,
        "dividendYield": 0,
        "roe": 0.3517,
        "debtToEquity": 0.7123,
        "netMargin": 0.0425,
        "revenueYoY": 0.2047
      },
      {
        "period": "2022-Q3",
        "year": 2022,
        "quarter": 3,
        "startDate": "2022-07-01",
        "endDate": "2022-09-30",
        "revenue": 2247.77,
        "operatingIncome": 226,
        "netIncome": 107.3,
        "eps": 0.1624,
        "assets": 1874.76,
        "liabilities": 759.16,
        "equity": 1115.59,
        "freeCashFlow": 90.05,
        "dividendPerShare": 0,
        "per": 42.86,
        "pbr": 4.12,
        "dividendYield": 0,
        "roe": 0.3847,
        "debtToEquity": 0.6805,
        "netMargin": 0.0477,
        "revenueYoY": 0.1605
      },
      {
        "period": "2022-Q4",
        "year": 2022,
        "quarter": 4,
        "startDate": "2022-10-01",
        "endDate": "2022-12-31",
        "revenue": 2347.09,
        "operatingIncome": 264.56,
        "netIncome": 108.24,
        "eps": 0.1638,
        "assets": 1940.98,
        "liabilities": 805.98,
        "equity": 1135.01,
        "freeCashFlow": 85.96,
        "dividendPerShare": 0,
        "per": 39,
        "pbr": 3.72,
        "dividendYield": 0,
        "roe": 0.3815,
        "debtToEquity": 0.7101,
        "netMargin": 0.0461,
        "revenueYoY": 0.102
      },
      {
        "period": "2023-Q1",
        "year": 2023,
        "quarter": 1,
        "startDate": "2023-01-01",
        "endDate": "2023-03-31",
        "revenue": 2338.64,
        "operatingIncome": 252.24,
        "netIncome": 76.21,
        "eps": 0.1153,
        "assets": 1973.42,
        "liabilities": 835.64,
        "equity": 1137.78,
        "freeCashFlow": 70.52,
        "dividendPerShare": 0,
        "per": 45.41,
        "pbr": 3.04,
        "dividendYield": 0,
        "roe": 0.2679,
        "debtToEquity": 0.7344,
        "netMargin": 0.0326,
        "revenueYoY": 0.1021
      },
      {
        "period": "2023-Q2",
        "year": 2023,
        "quarter": 2,
        "startDate": "2023-04-01",
        "endDate": "2023-06-30",
        "revenue": 2448.68,
        "operatingIncome": 220.37,
        "netIncome": 102.23,
        "eps": 0.1547,
        "assets": 1965.6,
        "liabilities": 844.93,
        "equity": 1120.67,
        "freeCashFlow": 106,
        "dividendPerShare": 0,
        "per": 39.67,
        "pbr": 3.62,
        "dividendYield": 0,
        "roe": 0.3649,
        "debtToEquity": 0.7539,
        "netMargin": 0.0417,
        "revenueYoY": 0.0942
      },
      {
        "period": "2023-Q3",
        "year": 2023,
        "quarter": 3,
        "startDate": "2023-07-01",
        "endDate": "2023-09-30",
        "revenue": 2585.01,
        "operatingIncome": 255.11,
        "netIncome": 81.43,
        "eps": 0.1232,
        "assets": 1966.96,
        "liabilities": 840.2,
        "equity": 1126.76,
        "freeCashFlow": 79.37,
        "dividendPerShare": 0,
        "per": 50.73,
        "pbr": 3.67,
        "dividendYield": 0,
        "roe": 0.2891,
        "debtToEquity": 0.7457,
        "netMargin": 0.0315,
        "revenueYoY": 0.15
      },
      {
        "period": "2023-Q4",
        "year": 2023,
        "quarter": 4,
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "revenue": 2704.88,
        "operatingIncome": 235.82,
        "netIncome": 122.73,
        "eps": 0.1857,
        "assets": 2010.88,
        "liabilities": 866.48,
        "equity": 1144.4,
        "freeCashFlow": 89.62,
        "dividendPerShare": 0,
        "per": 37.52,
        "pbr": 4.02,
        "dividendYield": 0,
        "roe": 0.429,
        "debtToEquity": 0.7572,
        "netMargin": 0.0454,
        "revenueYoY": 0.1524
      },
      {
        "period": "2024-Q1",
        "year": 2024,
        "quarter": 1,
        "startDate": "2024-01-01",
        "endDate": "2024-03-31",
        "revenue": 2641.02,
        "operatingIncome": 217.02,
        "netIncome": 158.56,
        "eps": 0.2399,
        "assets": 2039.87,
        "liabilities": 863.21,
        "equity": 1176.65,
        "freeCashFlow": 114.06,
        "dividendPerShare": 0,
        "per": 33.47,
        "pbr": 4.51,
        "dividendYield": 0,
        "roe": 0.539,
        "debtToEquity": 0.7336,
        "netMargin": 0.06,
        "revenueYoY": 0.1293
      },
      {
        "period": "2024-Q2",
        "year": 2024,
        "quarter": 2,
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "revenue": 2676.18,
        "operatingIncome": 278.5,
        "netIncome": 104.53,
        "eps": 0.1582,
        "assets": 2068.8,
        "liabilities": 898.13,
        "equity": 1170.67,
        "freeCashFlow": 96.94,
        "dividendPerShare": 0,
        "per": 40.21,
        "pbr": 3.59,
        "dividendYield": 0,
        "roe": 0.3572,
        "debtToEquity": 0.7672,
        "netMargin": 0.0391,
        "revenueYoY": 0.0929
      },
      {
        "period": "2024-Q3",
        "year": 2024,
        "quarter": 3,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "revenue": 2710.94,
        "operatingIncome": 238.68,
        "netIncome": 95.71,
        "eps": 0.1448,
        "assets": 2109.71,
        "liabilities": 915.37,
        "equity": 1194.34,
        "freeCashFlow": 96.78,
        "dividendPerShare": 0,
        "per": 41.23,
        "pbr": 3.3,
        "dividendYield": 0,
        "roe": 0.3206,
        "debtToEquity": 0.7664,
        "netMargin": 0.0353,
        "revenueYoY": 0.0487
      },
      {
        "period": "2024-Q4",
        "year": 2024,
        "quarter": 4,
        "startDate": "2024-10-01",
        "endDate": "2024-12-31",
        "revenue": 2869.45,
        "operatingIncome": 248.05,
        "netIncome": 97.2,
        "eps": 0.1471,
        "assets": 2140.32,
        "liabilities": 912.4,
        "equity": 1227.92,
        "freeCashFlow": 93,
        "dividendPerShare": 0,
        "per": 50.36,
        "pbr": 3.99,
        "dividendYield": 0,
        "roe": 0.3166,
        "debtToEquity": 0.7431,
        "netMargin": 0.0339,
        "revenueYoY": 0.0608
      },
      {
        "period": "2025-Q1",
        "year": 2025,
        "quarter": 1,
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "revenue": 2800.42,
        "operatingIncome": 298.27,
        "netIncome": 72.54,
        "eps": 0.1098,
        "assets": 2165.11,
        "liabilities": 935.34,
        "equity": 1229.77,
        "freeCashFlow": 73.11,
        "dividendPerShare": 0,
        "per": 37.36,
        "pbr": 2.2,
        "dividendYield": 0,
        "roe": 0.236,
        "debtToEquity": 0.7606,
        "netMargin": 0.0259,
        "revenueYoY": 0.0604
      },
      {
        "period": "2025-Q2",
        "year": 2025,
        "quarter": 2,
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "revenue": 2947.05,
        "operatingIncome": 329.69,
        "netIncome": 123.81,
        "eps": 0.1873,
        "assets": 2201.08,
        "liabilities": 928.01,
        "equity": 1273.07,
        "freeCashFlow": 117.73,
        "dividendPerShare": 0,
        "per": 36.54,
        "pbr": 3.55,
        "dividendYield": 0,
        "roe": 0.389,
        "debtToEquity": 0.729,
        "netMargin": 0.042,
        "revenueYoY": 0.1012
      },
      {
        "period": "2025-Q3",
        "year": 2025,
        "quarter": 3,
        "startDate": "2025-07-01",
        "endDate": "2025-09-30",
        "revenue": 2931.37,
        "operatingIncome": 307.3,
        "netIncome": 101.73,
        "eps": 0.1539,
        "assets": 2238.5,
        "liabilities": 937.22,
        "equity": 1301.27,
        "freeCashFlow": 91.54,
        "dividendPerShare": 0,
        "per": 36.7,
        "pbr": 2.87,
        "dividendYield": 0,
        "roe": 0.3127,
        "debtToEquity": 0.7202,
        "netMargin": 0.0347,
        "revenueYoY": 0.0813
      },
      {
        "period": "2025-Q4",
        "year": 2025,
        "quarter": 4,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31",
        "revenue": 3167.95,
        "operatingIncome": 395.89,
        "netIncome": 157.71,
        "eps": 0.2387,
        "assets": 2294.43,
        "liabilities": 950.49,
        "equity": 1343.94,
        "freeCashFlow": 136.72,
        "dividendPerShare": 0,
        "per": 43.49,
        "pbr": 5.1,
        "dividendYield": 0,
        "roe": 0.4694,
        "debtToEquity": 0.7072,
        "netMargin": 0.0498,
        "revenueYoY": 0.104
      }
    ],
    "yearly": [
      {
        "period": "2016",
        "year": 2016,
        "endDate": "2016-12-31",
        "revenue": 2259.81,
        "operatingIncome": 272.86,
        "netIncome": 104.22,
        "freeCashFlow": 72.88,
        "dividendPerShare": 0,
        "assets": 1161.36,
        "liabilities": 454.71,
        "equity": 706.64,
        "per": 44.63,
        "pbr": 1.98,
        "dividendYield": 0,
        "roe": 0.1475,
        "debtToEquity": 0.6435,
        "netMargin": 0.0461
      },
      {
        "period": "2017",
        "year": 2017,
        "endDate": "2017-12-31",
        "revenue": 2843.55,
        "operatingIncome": 301.14,
        "netIncome": 154.2,
        "freeCashFlow": 117.92,
        "dividendPerShare": 0,
        "assets": 1250.49,
        "liabilities": 518.02,
        "equity": 732.46,
        "per": 45,
        "pbr": 2.45,
        "dividendYield": 0,
        "roe": 0.2105,
        "debtToEquity": 0.7072,
        "netMargin": 0.0542
      },
      {
        "period": "2018",
        "year": 2018,
        "endDate": "2018-12-31",
        "revenue": 3642.81,
        "operatingIncome": 413.94,
        "netIncome": 149.03,
        "freeCashFlow": 117.27,
        "dividendPerShare": 0,
        "assets": 1359.6,
        "liabilities": 575.99,
        "equity": 783.6,
        "per": 40.58,
        "pbr": 2.24,
        "dividendYield": 0,
        "roe": 0.1902,
        "debtToEquity": 0.7351,
        "netMargin": 0.0409
      },
      {
        "period": "2019",
        "year": 2019,
        "endDate": "2019-12-31",
        "revenue": 4727.96,
        "operatingIncome": 625.34,
        "netIncome": 249.42,
        "freeCashFlow": 187.06,
        "dividendPerShare": 0,
        "assets": 1484.35,
        "liabilities": 641.53,
        "equity": 842.81,
        "per": 45.26,
        "pbr": 4.46,
        "dividendYield": 0,
        "roe": 0.2959,
        "debtToEquity": 0.7612,
        "netMargin": 0.0528
      },
      {
        "period": "2020",
        "year": 2020,
        "endDate": "2020-12-31",
        "revenue": 6131.44,
        "operatingIncome": 727.68,
        "netIncome": 302.11,
        "freeCashFlow": 252.05,
        "dividendPerShare": 0,
        "assets": 1605.8,
        "liabilities": 691.82,
        "equity": 913.98,
        "per": 41.04,
        "pbr": 2.3,
        "dividendYield": 0,
        "roe": 0.3305,
        "debtToEquity": 0.7569,
        "netMargin": 0.0493
      },
      {
        "period": "2021",
        "year": 2021,
        "endDate": "2021-12-31",
        "revenue": 7687.23,
        "operatingIncome": 885.71,
        "netIncome": 361.56,
        "freeCashFlow": 367.17,
        "dividendPerShare": 0,
        "assets": 1791.58,
        "liabilities": 743.17,
        "equity": 1048.41,
        "per": 41.79,
        "pbr": 3.12,
        "dividendYield": 0,
        "roe": 0.3449,
        "debtToEquity": 0.7089,
        "netMargin": 0.047
      },
      {
        "period": "2022",
        "year": 2022,
        "endDate": "2022-12-31",
        "revenue": 8954.68,
        "operatingIncome": 976.22,
        "netIncome": 375.29,
        "freeCashFlow": 339.87,
        "dividendPerShare": 0,
        "assets": 1940.98,
        "liabilities": 805.98,
        "equity": 1135.01,
        "per": 39,
        "pbr": 3.72,
        "dividendYield": 0,
        "roe": 0.3306,
        "debtToEquity": 0.7101,
        "netMargin": 0.0419
      },
      {
        "period": "2023",
        "year": 2023,
        "endDate": "2023-12-31",
        "revenue": 10077.22,
        "operatingIncome": 963.55,
        "netIncome": 382.6,
        "freeCashFlow": 345.51,
        "dividendPerShare": 0,
        "assets": 2010.88,
        "liabilities": 866.48,
        "equity": 1144.4,
        "per": 37.52,
        "pbr": 4.02,
        "dividendYield": 0,
        "roe": 0.3343,
        "debtToEquity": 0.7572,
        "netMargin": 0.038
      },
      {
        "period": "2024",
        "year": 2024,
        "endDate": "2024-12-31",
        "revenue": 10897.58,
        "operatingIncome": 982.25,
        "netIncome": 456,
        "freeCashFlow": 400.78,
        "dividendPerShare": 0,
        "assets": 2140.32,
        "liabilities": 912.4,
        "equity": 1227.92,
        "per": 50.36,
        "pbr": 3.99,
        "dividendYield": 0,
        "roe": 0.3714,
        "debtToEquity": 0.7431,
        "netMargin": 0.0418
      },
      {
        "period": "2025",
        "year": 2025,
        "endDate": "2025-12-31",
        "revenue": 11846.79,
        "operatingIncome": 1331.15,
        "netIncome": 455.79,
        "freeCashFlow": 419.1,
        "dividendPerShare": 0,
        "assets": 2294.43,
        "liabilities": 950.49,
        "equity": 1343.94,
        "per": 43.49,
        "pbr": 5.1,
        "dividendYield": 0,
        "roe": 0.3391,
        "debtToEquity": 0.7072,
        "netMargin": 0.0385
      }
    ]
  }
};

// src/simulator/sessionModel.js
var SESSION_MINUTES = 390;
var SESSION_TYPES = [
  "balance",
  "trendUp",
  "trendDown",
  "gapFade",
  "reversal",
  "squeeze",
  "distribution"
];
var SESSION_TYPE_TO_CODE = Object.fromEntries(
  SESSION_TYPES.map((type, index) => [type, index])
);
function fract2(value) {
  return value - Math.floor(value);
}
function hashNoiseSigned(x, seed = 0) {
  const n = Math.sin((x + seed) * 127.1 + seed * 311.7) * 43758.5453123;
  return fract2(n) * 2 - 1;
}
function smoothstep01(t) {
  return t * t * (3 - 2 * t);
}
function valueNoise1D2(x, seed = 0) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = smoothstep01(x - x0);
  const v0 = hashNoiseSigned(x0, seed);
  const v1 = hashNoiseSigned(x1, seed);
  return v0 + (v1 - v0) * t;
}
function fractalNoise1D(x, seed = 0, octaves = 4, persistence = 0.56) {
  let amplitude = 1;
  let frequency = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += valueNoise1D2(x * frequency + seed * 0.11 + i * 13.7, seed + i * 17.3) * amplitude;
    norm += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }
  return norm > 0 ? sum / norm : 0;
}
function bellCurve(value, center, radius) {
  const sigma = Math.max(0.03, radius * 0.72);
  const z = (value - center) / sigma;
  return Math.exp(-0.5 * z * z);
}
function sampleSmoothCurve(points, x) {
  if (!points.length) return 0;
  if (points.length === 1) return points[0].y;
  let idx = 0;
  while (idx < points.length - 2 && points[idx + 1].x < x) {
    idx += 1;
  }
  const p0 = points[Math.max(0, idx - 1)];
  const p1 = points[idx];
  const p2 = points[Math.min(points.length - 1, idx + 1)];
  const p3 = points[Math.min(points.length - 1, idx + 2)];
  const span = Math.max(1e-6, p2.x - p1.x);
  const t = clamp((x - p1.x) / span, 0, 1);
  const m1 = (p2.y - p0.y) / Math.max(1e-6, p2.x - p0.x) * span;
  const m2 = (p3.y - p1.y) / Math.max(1e-6, p3.x - p1.x) * span;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * p1.y + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2.y + (t3 - t2) * m2;
}
function hashString(value) {
  let hash = 2166136261;
  const text = String(value || "");
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function unitNoise(seed, salt = 0) {
  const n = Math.sin(seed * 173e-8 + salt * 19.91 + 13.17) * 43758.5453123;
  return fract2(n);
}
function signedNoise(seed, salt = 0) {
  return unitNoise(seed, salt) * 2 - 1;
}
function rangedNoise(seed, salt, min, max) {
  return lerp(min, max, unitNoise(seed, salt));
}
function deterministicPick(weightMap, seed) {
  const entries = Object.entries(weightMap).filter(([, weight]) => weight > 0);
  if (!entries.length) return "balance";
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let ticket = unitNoise(seed, 71) * total;
  for (const [key, weight] of entries) {
    ticket -= weight;
    if (ticket <= 0) return key;
  }
  return entries[entries.length - 1][0];
}
function clampLogReturn(value, scale) {
  return clamp(value, -scale, scale);
}
function intradayVolumeCurve(progress, lunchDip) {
  const edge = Math.pow(Math.abs(progress - 0.5) * 2, 1.48);
  const lunch = 1 - bellCurve(progress, 0.5, 0.18);
  return 0.72 + edge * 1.04 - lunch * lunchDip * 0.18;
}
function intradayVolatilityCurve(progress, sessionType, lunchDip) {
  const edge = Math.pow(Math.abs(progress - 0.5) * 2, 1.18);
  const lunch = 1 - bellCurve(progress, 0.5, 0.16);
  const typeBoost = sessionType === "squeeze" || sessionType === "reversal" ? 0.28 : sessionType === "trendUp" || sessionType === "trendDown" ? 0.12 : 0;
  return 0.82 + edge * (0.58 + typeBoost) - lunch * lunchDip * 0.14;
}
function buildControlSet(type, closeOffset, seed, baseDailyVol) {
  const quiet = Math.max(baseDailyVol * 0.18, 12e-4);
  const active = Math.max(baseDailyVol * 0.54, 34e-4);
  switch (type) {
    case "trendUp":
      return {
        posA: rangedNoise(seed, 11, 0.09, 0.18),
        curveA: rangedNoise(seed, 12, -quiet, quiet * 0.55),
        posB: rangedNoise(seed, 13, 0.42, 0.58),
        curveB: closeOffset * rangedNoise(seed, 14, 0.52, 0.72),
        posC: rangedNoise(seed, 15, 0.76, 0.9),
        curveC: closeOffset * rangedNoise(seed, 16, 0.86, 1.08),
        shockCenter: rangedNoise(seed, 17, 0.58, 0.8),
        shockMagnitude: Math.max(0, closeOffset) * rangedNoise(seed, 18, 0.12, 0.22)
      };
    case "trendDown":
      return {
        posA: rangedNoise(seed, 21, 0.09, 0.18),
        curveA: rangedNoise(seed, 22, -quiet * 0.55, quiet),
        posB: rangedNoise(seed, 23, 0.38, 0.54),
        curveB: closeOffset * rangedNoise(seed, 24, 0.5, 0.72),
        posC: rangedNoise(seed, 25, 0.76, 0.9),
        curveC: closeOffset * rangedNoise(seed, 26, 0.86, 1.08),
        shockCenter: rangedNoise(seed, 27, 0.58, 0.8),
        shockMagnitude: -Math.abs(closeOffset) * rangedNoise(seed, 28, 0.12, 0.22)
      };
    case "gapFade":
      return {
        posA: rangedNoise(seed, 31, 0.06, 0.12),
        curveA: closeOffset * rangedNoise(seed, 32, -0.5, -0.18),
        posB: rangedNoise(seed, 33, 0.28, 0.42),
        curveB: closeOffset * rangedNoise(seed, 34, 0.18, 0.42),
        posC: rangedNoise(seed, 35, 0.74, 0.9),
        curveC: closeOffset * rangedNoise(seed, 36, 0.72, 1.02),
        shockCenter: rangedNoise(seed, 37, 0.12, 0.26),
        shockMagnitude: -closeOffset * rangedNoise(seed, 38, 0.18, 0.34)
      };
    case "reversal":
      return {
        posA: rangedNoise(seed, 41, 0.12, 0.2),
        curveA: -closeOffset * rangedNoise(seed, 42, 0.5, 0.92),
        posB: rangedNoise(seed, 43, 0.34, 0.48),
        curveB: closeOffset * rangedNoise(seed, 44, 0.12, 0.34),
        posC: rangedNoise(seed, 45, 0.68, 0.84),
        curveC: closeOffset * rangedNoise(seed, 46, 0.72, 1.05),
        shockCenter: rangedNoise(seed, 47, 0.24, 0.46),
        shockMagnitude: closeOffset * rangedNoise(seed, 48, 0.24, 0.48)
      };
    case "squeeze":
      return {
        posA: rangedNoise(seed, 51, 0.16, 0.28),
        curveA: rangedNoise(seed, 52, -quiet * 0.45, quiet * 0.35),
        posB: rangedNoise(seed, 53, 0.46, 0.6),
        curveB: closeOffset * rangedNoise(seed, 54, 0.2, 0.44),
        posC: rangedNoise(seed, 55, 0.7, 0.84),
        curveC: closeOffset * rangedNoise(seed, 56, 1.02, 1.34),
        shockCenter: rangedNoise(seed, 57, 0.56, 0.72),
        shockMagnitude: Math.max(active, Math.abs(closeOffset) * rangedNoise(seed, 58, 0.44, 0.78))
      };
    case "distribution":
      return {
        posA: rangedNoise(seed, 61, 0.08, 0.16),
        curveA: rangedNoise(seed, 62, quiet * 0.22, active * 0.64),
        posB: rangedNoise(seed, 63, 0.34, 0.48),
        curveB: closeOffset * rangedNoise(seed, 64, -0.18, 0.12),
        posC: rangedNoise(seed, 65, 0.7, 0.84),
        curveC: closeOffset * rangedNoise(seed, 66, 0.72, 1.04),
        shockCenter: rangedNoise(seed, 67, 0.46, 0.66),
        shockMagnitude: -Math.max(quiet, Math.abs(closeOffset) * rangedNoise(seed, 68, 0.2, 0.42))
      };
    case "balance":
    default:
      return {
        posA: rangedNoise(seed, 71, 0.14, 0.24),
        curveA: rangedNoise(seed, 72, -quiet, quiet),
        posB: rangedNoise(seed, 73, 0.42, 0.58),
        curveB: rangedNoise(seed, 74, -quiet * 1.2, quiet * 1.2),
        posC: rangedNoise(seed, 75, 0.72, 0.88),
        curveC: closeOffset * rangedNoise(seed, 76, 0.48, 0.9),
        shockCenter: rangedNoise(seed, 77, 0.26, 0.74),
        shockMagnitude: closeOffset * rangedNoise(seed, 78, -0.16, 0.16)
      };
  }
}
function buildSessionBlueprint(context = {}) {
  const {
    symbol = "SYM",
    sector = "GEN",
    calendarDate = "1970-01-01",
    prevClose = 100,
    priceFloor = Math.max(0.5, prevClose * 0.04),
    priceCeiling = Math.max(prevClose * 8, prevClose + 10),
    baseDailyVol = 0.02,
    totalPressure = 0,
    anchorGap = 0,
    meanGap = 0,
    stress = 0,
    shortInterest = 0,
    leaderRank = -1,
    correctionActive = false,
    swingState = 0
  } = context;
  const seed = hashString(
    [
      symbol,
      sector,
      calendarDate,
      Math.round(prevClose * 100),
      Math.round(totalPressure * 1e6),
      Math.round(anchorGap * 1e5),
      Math.round(meanGap * 1e5),
      Math.round(stress * 1e3),
      Math.round(swingState * 1e5),
      leaderRank,
      correctionActive ? 1 : 0
    ].join("|")
  );
  const pressureScore = clamp(totalPressure / Math.max(baseDailyVol, 5e-4), -3.2, 3.2);
  const extension = clamp(swingState / Math.max(baseDailyVol, 5e-4), -2.4, 2.4);
  const overnightCore = totalPressure * 0.085 + anchorGap * 0.06 + meanGap * 0.035 + swingState * 0.018;
  const overnightBudget = clamp(
    baseDailyVol * (0.16 + Math.max(0, stress) * 0.018 + (correctionActive ? 0.03 : 0)),
    12e-4,
    0.012
  );
  const overnightShockProb = clamp(
    0.012 + Math.max(0, stress) * 0.018 + Math.max(0, shortInterest - 0.14) * 0.42 + (correctionActive ? 0.028 : 0),
    0.012,
    0.16
  );
  const overnightShock = unitNoise(seed, 90) < overnightShockProb ? signedNoise(seed, 91) * overnightBudget * rangedNoise(seed, 92, 0.22, 0.82) : 0;
  const gapMove = clamp(
    overnightCore + signedNoise(seed, 1) * overnightBudget * 0.32 + overnightShock,
    -overnightBudget,
    overnightBudget
  );
  const open = clamp(prevClose * Math.exp(gapMove), priceFloor, priceCeiling);
  const weights = {
    balance: 1.35 + Math.max(0, 0.8 - Math.abs(pressureScore)),
    trendUp: Math.max(0.1, pressureScore) * 1.2 + (leaderRank === 0 ? 1.1 : leaderRank === 1 ? 0.62 : 0) + Math.max(0, gapMove / Math.max(baseDailyVol, 5e-4)) * 0.25,
    trendDown: Math.max(0.1, -pressureScore) * 1.18 + Math.max(0, stress) * 0.3 + Math.max(0, -gapMove / Math.max(baseDailyVol, 5e-4)) * 0.25,
    gapFade: Math.abs(gapMove) / Math.max(baseDailyVol, 5e-4) * 0.82 + Math.max(0, -Math.sign(gapMove || 1) * Math.sign(pressureScore || 1)) * 0.85,
    reversal: Math.abs(pressureScore - extension) * 0.5 + Math.max(0, stress) * 0.38 + (correctionActive ? 0.42 : 0),
    squeeze: Math.max(0, shortInterest - 0.14) * 6.4 + Math.max(0, pressureScore) * 0.42 + (sector === "MEME" ? 0.75 : 0),
    distribution: Math.max(0, extension) * 0.58 + Math.max(0, -pressureScore) * 0.26 + (correctionActive ? 0.52 : 0)
  };
  const type = deterministicPick(weights, seed);
  const baseSigma = clamp(
    baseDailyVol / Math.sqrt(SESSION_MINUTES) * rangedNoise(seed, 2, 10.5, 16.5),
    8e-5,
    39e-4
  );
  const leaderLift = leaderRank === 0 ? 0.22 : leaderRank === 1 ? 0.12 : -0.04;
  const closeOffset = clampLogReturn(
    totalPressure * 0.84 + meanGap * 0.34 + anchorGap * 0.18 + swingState * 0.14 + leaderLift * baseDailyVol * 0.55 + signedNoise(seed, 3) * baseDailyVol * 0.48,
    baseDailyVol * 2.15
  );
  const controls = buildControlSet(type, closeOffset, seed, baseDailyVol);
  const volumeBase = Math.max(
    2500,
    Math.round(
      (8200 + open * 90 + baseDailyVol * 15e5) * rangedNoise(seed, 4, 0.82, 1.24) * (1 + Math.max(0, shortInterest - 0.12) * 0.55)
    )
  );
  return {
    type,
    seed,
    open,
    baseSigma,
    volumeBase,
    closeOffset,
    posA: controls.posA,
    curveA: controls.curveA,
    posB: controls.posB,
    curveB: controls.curveB,
    posC: controls.posC,
    curveC: controls.curveC,
    shockCenter: controls.shockCenter,
    shockMagnitude: controls.shockMagnitude,
    lunchDip: rangedNoise(seed, 5, 0.36, 0.86),
    closeAuction: rangedNoise(seed, 6, -baseSigma * 1.1, baseSigma * 1.8),
    imbalanceBias: rangedNoise(seed, 7, -baseSigma * 2.2, baseSigma * 2.2),
    wickBias: rangedNoise(seed, 8, -0.18, 0.18),
    priceFloor,
    priceCeiling
  };
}
function barsPerSyntheticSession(timeframe) {
  const normalized = Math.max(1, Math.floor(Number(timeframe) || 1));
  if (normalized >= SESSION_MINUTES) return 1;
  return Math.max(1, Math.floor(SESSION_MINUTES / normalized));
}
function decodeSessionBlueprint(blueprint, timeframe = 1) {
  if (!blueprint) return [];
  const segments = barsPerSyntheticSession(timeframe);
  const minuteStep = Math.max(1, Math.floor(SESSION_MINUTES / segments));
  const controls = [
    { x: 0, y: 0 },
    { x: blueprint.posA, y: blueprint.curveA },
    { x: blueprint.posB, y: blueprint.curveB },
    { x: blueprint.posC, y: blueprint.curveC },
    { x: 1, y: blueprint.closeOffset }
  ];
  const bars = [];
  let price = blueprint.open;
  let imbalance = blueprint.imbalanceBias || 0;
  let pv = 0;
  let vol = 0;
  const rangeSeed = blueprint.seed;
  for (let i = 0; i < segments; i += 1) {
    const progress = segments > 1 ? i / (segments - 1) : 1;
    const nextProgress = segments > 1 ? Math.min(1, (i + 1) / (segments - 1)) : 1;
    const target = sampleSmoothCurve(controls, nextProgress);
    const currentOffset = Math.log(Math.max(1e-6, price) / Math.max(1e-6, blueprint.open));
    const targetPull = clamp(target - currentOffset, -blueprint.baseSigma * 5.4, blueprint.baseSigma * 5.4);
    const shockWindow = bellCurve(progress, blueprint.shockCenter, 0.08);
    const wave = fractalNoise1D(progress * 9.5 + rangeSeed * 1e-5, rangeSeed + 101, 3, 0.58) * blueprint.baseSigma * 1.15;
    const fineNoise = hashNoiseSigned(i * 1.37 + rangeSeed * 1e-3, rangeSeed + 197) * blueprint.baseSigma * 0.72;
    const volCurve = intradayVolatilityCurve(progress, blueprint.type, blueprint.lunchDip);
    const localSigma = blueprint.baseSigma * volCurve;
    const closeAuction = bellCurve(progress, 0.95, 0.06) * (blueprint.closeAuction || 0);
    const shock = shockWindow * (blueprint.shockMagnitude || 0);
    imbalance = imbalance * 0.74 + targetPull * 0.64 + wave * 0.46 + fineNoise * 0.32 + shock * 0.74;
    const move = clamp(
      targetPull * 0.78 + imbalance * 0.42 + wave * 0.34 + fineNoise * 0.44 + closeAuction + shock * 0.28,
      -localSigma * 7.5,
      localSigma * 7.5
    );
    const open = price;
    const close = clamp(
      open * Math.exp(move),
      blueprint.priceFloor,
      blueprint.priceCeiling
    );
    const bodyRange = Math.abs(Math.log(Math.max(1e-6, close) / Math.max(1e-6, open)));
    const turnBias = bellCurve(progress, blueprint.posA, 0.08) * Math.sign(blueprint.curveA || 1) * 0.05 + bellCurve(progress, blueprint.posB, 0.08) * Math.sign(blueprint.curveB || 1) * 0.08 + bellCurve(progress, blueprint.posC, 0.08) * Math.sign(blueprint.curveC || 1) * 0.06;
    const upperShare = clamp(
      0.5 + (blueprint.wickBias || 0) + turnBias - Math.sign(move || 0) * 0.04 + hashNoiseSigned(i * 0.93, rangeSeed + 281) * 0.08,
      0.16,
      0.84
    );
    const totalRange = Math.max(
      bodyRange * 1.18,
      localSigma * (0.72 + Math.abs(hashNoiseSigned(i * 0.71, rangeSeed + 331)) * 0.82)
    );
    const residual = Math.max(localSigma * 0.2, totalRange - bodyRange);
    const upperPct = residual * upperShare;
    const lowerPct = residual * (1 - upperShare);
    const high = Math.min(
      blueprint.priceCeiling,
      Math.max(open, close) * Math.exp(upperPct)
    );
    const low = Math.max(
      blueprint.priceFloor,
      Math.min(open, close) * Math.exp(-lowerPct)
    );
    const volumeCurve = intradayVolumeCurve(progress, blueprint.lunchDip);
    const volume = Math.max(
      1,
      Math.floor(
        blueprint.volumeBase * timeframe * volumeCurve * (1 + Math.abs(move) * 130 + shockWindow * 0.72 + Math.abs(targetPull) * 62)
      )
    );
    const typical = (high + low + close) / 3;
    pv += typical * volume;
    vol += volume;
    bars.push({
      minute: Math.min(SESSION_MINUTES - 1, i * minuteStep),
      open,
      high,
      low,
      close,
      volume,
      vwap: vol > 0 ? pv / vol : close
    });
    price = close;
  }
  return bars;
}
function summarizeSessionBars(bars) {
  if (!Array.isArray(bars) || !bars.length) return null;
  let high = bars[0].high;
  let low = bars[0].low;
  let volume = 0;
  let pv = 0;
  for (const bar of bars) {
    high = Math.max(high, bar.high);
    low = Math.min(low, bar.low);
    volume += bar.volume;
    pv += bar.close * bar.volume;
  }
  const open = bars[0].open;
  const close = bars[bars.length - 1].close;
  return {
    open,
    high,
    low,
    close,
    volume,
    vwap: volume > 0 ? pv / volume : close,
    logReturn: Math.log(Math.max(1e-6, close) / Math.max(1e-6, open))
  };
}
function packSessionBlueprint(blueprint) {
  if (!blueprint) return null;
  return [
    SESSION_TYPE_TO_CODE[blueprint.type] ?? 0,
    blueprint.seed >>> 0,
    Number(blueprint.baseSigma.toFixed(8)),
    Math.round(blueprint.volumeBase),
    Number(blueprint.closeOffset.toFixed(8)),
    Number(blueprint.posA.toFixed(6)),
    Number(blueprint.curveA.toFixed(8)),
    Number(blueprint.posB.toFixed(6)),
    Number(blueprint.curveB.toFixed(8)),
    Number(blueprint.posC.toFixed(6)),
    Number(blueprint.curveC.toFixed(8)),
    Number(blueprint.shockCenter.toFixed(6)),
    Number(blueprint.shockMagnitude.toFixed(8)),
    Number(blueprint.lunchDip.toFixed(6)),
    Number(blueprint.closeAuction.toFixed(8)),
    Number(blueprint.imbalanceBias.toFixed(8)),
    Number(blueprint.wickBias.toFixed(6))
  ];
}
function unpackSessionBlueprint(packed, overrides = {}) {
  if (!Array.isArray(packed) || packed.length < 17) return packed || null;
  return {
    type: SESSION_TYPES[packed[0]] || "balance",
    seed: packed[1] >>> 0,
    baseSigma: Number(packed[2] || 2e-4),
    volumeBase: Math.max(1, Math.floor(Number(packed[3] || 1))),
    closeOffset: Number(packed[4] || 0),
    posA: Number(packed[5] || 0.16),
    curveA: Number(packed[6] || 0),
    posB: Number(packed[7] || 0.48),
    curveB: Number(packed[8] || 0),
    posC: Number(packed[9] || 0.82),
    curveC: Number(packed[10] || 0),
    shockCenter: Number(packed[11] || 0.5),
    shockMagnitude: Number(packed[12] || 0),
    lunchDip: Number(packed[13] || 0.5),
    closeAuction: Number(packed[14] || 0),
    imbalanceBias: Number(packed[15] || 0),
    wickBias: Number(packed[16] || 0),
    ...overrides
  };
}
function decodeSessionFromCandle(candle, timeframe = 1) {
  if (!candle?.session) return null;
  const priceFloor = Math.max(
    0.5,
    Math.min(
      Number(candle.low || candle.open || candle.close || 1),
      Number(candle.open || candle.close || 1)
    ) * 0.22
  );
  const priceCeiling = Math.max(
    Number(candle.high || candle.open || candle.close || 1) * 3.6,
    Number(candle.high || candle.open || candle.close || 1) + 10
  );
  const blueprint = unpackSessionBlueprint(candle.session, {
    open: Number(candle.open || candle.close || 1),
    priceFloor,
    priceCeiling
  });
  if (!blueprint) return null;
  const decoded = decodeSessionBlueprint(blueprint, timeframe);
  const segments = decoded.length;
  return decoded.map((bar, index) => ({
    ...bar,
    t: Number(candle.t || 0) + (index + 1) / (segments + 1),
    day: candle.day,
    date: candle.date,
    minute: Math.min(SESSION_MINUTES - 1, bar.minute),
    synthetic: true,
    event: null
  }));
}

// src/simulator/engine.js
var DEFAULT_START_DATE = MARKET_FLOW_CONFIG.startDate || "2026-01-05";
var MAX_CANDLE_STORE = 12e3;
var BOOTSTRAP_CACHE_KEY = "trade-simulator-bootstrap-v4";
var BOOTSTRAP_CACHE_VERSION = 6;
function parseIsoDate(isoDate) {
  return /* @__PURE__ */ new Date(`${isoDate}T00:00:00`);
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
function fract3(value) {
  return value - Math.floor(value);
}
function hashNoise1D2(x, seed = 0) {
  const n = Math.sin((x + seed) * 127.1 + seed * 311.7) * 43758.5453123;
  return fract3(n) * 2 - 1;
}
function smoothstep2(t) {
  return t * t * (3 - 2 * t);
}
function valueNoise1D3(x, seed = 0) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = smoothstep2(x - x0);
  const v0 = hashNoise1D2(x0, seed);
  const v1 = hashNoise1D2(x1, seed);
  return v0 + (v1 - v0) * t;
}
function perlin1D2(x, seed = 0, octaves = 4, persistence = 0.55) {
  let amplitude = 1;
  let frequency = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += valueNoise1D3(x * frequency, seed + i * 17) * amplitude;
    norm += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }
  return norm > 0 ? sum / norm : 0;
}
function sectorSeed(sector) {
  return String(sector || "").split("").reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
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
var TradingEngine = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.toastTimers = /* @__PURE__ */ new Map();
    this.toastSeq = 0;
    this.version = 0;
    this.bootPromise = null;
    this.bootstrapHistoricalStore = null;
    this.state = this.createInitialState();
  }
  createInitialState() {
    return {
      boot: {
        active: true,
        progress: 0,
        message: "Preparing market simulation"
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
      marketHolidays: [...MARKET_FLOW_CONFIG.holidays || []],
      baseMinutesPerSecond: 2.4,
      accumulator: 0,
      lastFrame: 0,
      timeframe: 1,
      chartZoom: 1,
      chartScale: "linear",
      chartAutoScale: true,
      chartOffset: 0,
      chartFollowLatest: true,
      chartAnchor: null,
      chartIndicators: {
        ma20: { enabled: true, period: 20, color: "ma20" },
        ma50: { enabled: true, period: 50, color: "ma50" },
        vwap: { enabled: true, mode: "rolling", color: "vwap" },
        macd: { enabled: true, fast: 12, slow: 26, signal: 9 }
      },
      news: [],
      reactionWindows: [],
      cash: 1e5,
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
      toasts: []
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
      ...this.state.boot || {},
      ...patch
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
      historicalCandles: null,
      canonicalIntradayCandles: null,
      canonicalIntradayHistoricalCount: 0,
      canonicalIntradayLiveCount: 0,
      runtimeMinuteCandles: null,
      runtimeMinuteSourceCount: 0,
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
      financials: FINANCIAL_STATEMENTS[bp.symbol] || { symbol: bp.symbol, quarterly: [], yearly: [] }
    };
  }
  getAssetPriceFloor(asset2) {
    const basePrice = Math.max(1, Number(asset2?.basePrice || asset2?.price || 10));
    return Math.max(0.5, basePrice * 0.04);
  }
  getAssetPriceCeiling(asset2) {
    const basePrice = Math.max(1, Number(asset2?.basePrice || asset2?.price || 10));
    const sectorMultiple = asset2?.sector === "MEME" ? 18e4 : asset2?.sector === "AI" || asset2?.sector === "SEMI" ? 95e3 : 6e4;
    const betaBoost = 1 + Math.max(0, Number(asset2?.beta || 1) - 1) * 0.8;
    return basePrice * sectorMultiple * betaBoost;
  }
  pickScenario() {
    return deepClone(randChoice(SCENARIOS));
  }
  seedHistory(asset2, minutes = 240, seedDate = null) {
    const historyDate = seedDate || this.state.calendarDate || DEFAULT_START_DATE;
    let price = asset2.price * rand(0.96, 1.04);
    let pv = 0;
    let volTotal = 0;
    for (let i = 0; i < minutes; i += 1) {
      const open = price;
      const ret = randn() * asset2.vol * 0.55 + (this.state.scenario.sectorBias[asset2.sector] || 0) * 0.32;
      const close = Math.max(1, open * Math.exp(ret));
      const wig = Math.max(open, close) * asset2.vol * rand(0.12, 0.48);
      const high = Math.max(open, close) + wig;
      const low = Math.max(0.5, Math.min(open, close) - wig);
      const volume = Math.floor(
        (7e4 + Math.abs(ret) * 23e5 + Math.random() * 22e3) * (1 + (asset2.sector === "MEME" ? 0.4 : 0))
      );
      pv += close * volume;
      volTotal += volume;
      price = close;
      asset2.candles.push({
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
        event: null
      });
    }
    asset2.price = price;
    asset2.prevClose = price;
    asset2.open = price;
    asset2.high = price;
    asset2.low = price;
    asset2.close = price;
    asset2.anchor = price;
    asset2.dayPV = 0;
    asset2.dayVol = 0;
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
    while (cursor <= endDate && guard < 5e3) {
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
        useFactory ? valueOrFactory(sector) : valueOrFactory
      ])
    );
  }
  createInitialWeightScores() {
    const heuristic = SECTOR_LEADERSHIP_CONFIG.heuristicWeights || {};
    const scores = {};
    for (const sector of Object.keys(SECTORS)) {
      const base = Math.max(1e-4, Number(heuristic[sector] || 1));
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
      sectors.map((sector, index) => [sector, exps[index] / sum * multiplier])
    );
  }
  evolveSectorWeightScores(prevScores = {}, baselineScores = {}) {
    const sigma = Math.max(1e-3, Number(SECTOR_LEADERSHIP_CONFIG.weightSigma || 0.2));
    const meanReversion = clamp(
      Number(SECTOR_LEADERSHIP_CONFIG.weightMeanReversion || 0.2),
      0,
      1
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
        baselineScores
      );
      leadership.weights = this.softmaxSectorWeights(leadership.weightScores);
      leadership.lastWeightYear = leadership.nextWeightYear;
      leadership.nextWeightYear += intervalYears;
      changed = true;
    }
    if (changed && emitNews) {
      const topWeights = Object.entries(leadership.weights).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([sector, weight]) => `${SECTORS[sector]?.name || sector} ${weight.toFixed(2)}`).join(" / ");
      this.addNews(
        {
          scope: "Macro",
          severity: "blue",
          headline: `Sector Weight Rebalance (${targetYear})`,
          body: `Updated yearly sector weight profile (softmax, mean=1). Top weights: ${topWeights}.`
        },
        false,
        false
      );
    }
    return changed;
  }
  pickWeightedSectorLeaders(randomFn = Math.random, sourceWeights = null) {
    const weights = sourceWeights || this.state.sectorLeadership?.weights || SECTOR_LEADERSHIP_CONFIG.heuristicWeights || {};
    const count = Math.max(1, Math.floor(SECTOR_LEADERSHIP_CONFIG.topCount || 2));
    const available = Object.keys(SECTORS);
    const leaders = [];
    while (leaders.length < count && available.length) {
      const total = available.reduce(
        (sum, sector) => sum + Math.max(1e-4, Number(weights[sector] || 1)),
        0
      );
      let ticket = randomFn() * total;
      let chosenIndex = 0;
      for (let i = 0; i < available.length; i += 1) {
        const sector = available[i];
        ticket -= Math.max(1e-4, Number(weights[sector] || 1));
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
    while (cursor.index + 1 < list.length && list[cursor.index + 1].endDate <= isoDate) {
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
    const fcfRatio = quarter.revenue && Number(quarter.revenue) !== 0 ? Number(quarter.freeCashFlow || 0) / Number(quarter.revenue) : 0;
    const tilt = revenueYoY * 18e-4 + (netMargin - 0.09) * 32e-4 + (roe - 0.16) * 12e-4 + (fcfRatio - 0.08) * 21e-4 - (debtToEquity - 1) * 65e-5;
    return clamp(tilt, -38e-4, 38e-4);
  }
  buildAssetMicroState(asset2, flowState, isoDate, leadership, previousState = asset2?.micro || null, quarter = null) {
    if (!asset2 || !flowState || !isoDate) return null;
    const resolvedQuarter = quarter || this.getQuarterFinancialAtDate(asset2.financials, isoDate);
    return evolveAssetMicroState({
      asset: asset2,
      quarter: resolvedQuarter,
      flowState,
      leadership,
      calendarDate: isoDate,
      previousState
    });
  }
  applyMicroSurface(asset2) {
    if (!asset2) return;
    const surface = asset2.micro?.surface;
    const baseBorrow = Number(asset2.baseBorrow ?? asset2.borrow ?? 0.02);
    asset2.borrow = clamp(
      baseBorrow * Number(surface?.borrowMult || 1),
      5e-3,
      0.45
    );
  }
  syncMicroEconomy(flowState, isoDate, { force = false, emitNews = true } = {}) {
    if (!flowState || !isoDate) return false;
    const targetMonthKey = monthKey(isoDate);
    const revisions = [];
    let changed = false;
    for (const symbol of this.state.assetList) {
      const asset2 = this.state.assets[symbol];
      if (!asset2) continue;
      if (!force && asset2.micro?.monthKey === targetMonthKey) continue;
      const previousState = asset2.micro;
      const nextState = this.buildAssetMicroState(
        asset2,
        flowState,
        isoDate,
        this.state.sectorLeadership,
        previousState
      );
      if (!nextState) continue;
      asset2.micro = nextState;
      this.applyMicroSurface(asset2);
      changed = true;
      const prevEarnings = Number(previousState?.signals?.earnings || 0);
      const nextEarnings = Number(nextState.signals?.earnings || 0);
      const delta = nextEarnings - prevEarnings;
      revisions.push({
        symbol,
        asset: asset2,
        delta,
        nextState,
        previousRegime: previousState?.regime || null
      });
    }
    if (!changed || !emitNews) return changed;
    const meaningful = revisions.filter(
      (item) => Math.abs(item.delta) >= 0.58 || item.previousRegime !== item.nextState.regime
    ).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 2);
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
          body: `${item.asset.name} shifts into ${item.nextState.regime.toLowerCase()} as macro pressure flows into demand, margin, and funding conditions.`
        },
        false,
        false
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
      psrCount: 0
    }));
    const global = {
      per: 0,
      perCount: 0,
      pbr: 0,
      pbrCount: 0,
      psr: 0,
      psrCount: 0
    };
    for (const symbol of this.state.assetList) {
      const asset2 = this.state.assets[symbol];
      if (!asset2) continue;
      const quarter = this.getQuarterFinancialAtDate(asset2.financials, isoDate);
      if (!quarter) continue;
      const bucket = sectorAgg[asset2.sector];
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
        psr: agg.psrCount ? agg.psr / agg.psrCount : globalPsr
      };
    });
  }
  updateValuationExpectations(leadership, flowState, isoDate, { force = false, emitNews = false } = {}) {
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
        maxPersistence
      );
      leadership.leaderPersistence[sector] = nextPersistence;
      const persistenceUnits = nextPersistence / 12;
      const weight = Number(leadership.weights?.[sector] || 1);
      const correctionUntil = Number(leadership.correctionUntilMonth?.[sector] ?? -1);
      const correctionActive = monthOrdinal <= correctionUntil;
      const cyclePrev = Number(leadership.valuationCycleState[sector] || 0);
      const macroImpulse = Number(axes.realEconomy || 0) * 0.16 + Number(factors.D || 0) * 0.08 + Number(factors.E || 0) * 0.18 - Number(axes.policy || 0) * 0.15 - Math.max(0, Number(axes.inflation || 0)) * 0.12 - Number(axes.externalShock || 0) * 0.11 - Math.max(0, Number(factors.F || 0)) * 0.1;
      const leadershipImpulse = leaderRank === 0 ? 0.28 : leaderRank === 1 ? 0.18 : -0.11 - Math.min(0.18, previousPersistence * 0.012);
      const valuationWave = perlin1D2(
        monthOrdinal / 11 + sectorSeed(sector) * 11e-4,
        sectorSeed(sector) + monthOrdinal * 7,
        3,
        0.6
      );
      const expansionImpulse = Math.max(0, macroImpulse) * (isLeader ? 0.42 : 0.14) + persistenceUnits * 0.06 + valuationWave * 0.08;
      const overheating = Math.max(0, cyclePrev - 0.58);
      const coolingImpulse = overheating * (0.18 + (correctionActive ? 0.26 : 0) + Math.max(0, -macroImpulse) * 0.34 + (isLeader ? 0.02 : 0.12)) + (correctionActive ? 0.22 : 0);
      const cycleNext = clamp(
        cyclePrev * 0.9 + expansionImpulse + leadershipImpulse * 0.24 + macroImpulse * 0.2 - coolingImpulse,
        -1.3,
        1.9
      );
      leadership.valuationCycleState[sector] = cycleNext;
      let rawMultiplier = 1 + (weight - 1) * weightPremiumScale * 0.22 + persistenceUnits * persistencePremiumScale * 0.72 + sentimentE * sentimentScale * 0.55 + cycleNext * 0.42 - (isLeader ? 0 : nonLeaderDiscountScale * 0.45);
      if (!isLeader) {
        const reversionWave = perlin1D2(
          monthOrdinal / reversionPeriod + sectorSeed(sector) * 9e-4,
          sectorSeed(sector) + monthOrdinal * 19,
          reversionOctaves,
          reversionPersistence
        );
        const reversionProb = clamp(
          reversionBaseProb + reversionWave * reversionWaveProbScale + Math.max(0, -sentimentE) * reversionStressBoost,
          0.02,
          0.9
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
        psr: base.psr * multiplier
      };
      const prev = leadership.valuationExpectations[sector] || base;
      leadership.valuationExpectations[sector] = {
        per: prev.per + (target.per - prev.per) * response,
        pbr: prev.pbr + (target.pbr - prev.pbr) * response,
        psr: prev.psr + (target.psr - prev.psr) * response
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
            2
          )}.`
        },
        false,
        false
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
    correctionActive = false
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
    const targetPer = Number.isFinite(expectedPer) && expectedPer > 0 ? expectedPer : fallbackPer;
    const targetPbr = Number.isFinite(expectedPbr) && expectedPbr > 0 ? expectedPbr : fallbackPbr;
    const targetPsr = Number.isFinite(expectedPsr) && expectedPsr > 0 ? expectedPsr : fallbackPsr;
    const actualPer = Number(quarter?.per || targetPer);
    const actualPbr = Number(quarter?.pbr || targetPbr);
    const actualPsr = Number(this.deriveQuarterPsr(quarter) || targetPsr);
    const gapClamp = Math.max(0.1, Number(cfg.gapClamp || 0.85));
    const gapPer = clamp((targetPer - actualPer) / Math.max(1, targetPer), -gapClamp, gapClamp);
    const gapPbr = clamp((targetPbr - actualPbr) / Math.max(0.2, targetPbr), -gapClamp, gapClamp);
    const gapPsr = clamp((targetPsr - actualPsr) / Math.max(0.2, targetPsr), -gapClamp, gapClamp);
    const w = cfg.valuationWeights || { per: 0.4, pbr: 0.35, psr: 0.25 };
    const valuationGap = gapPer * w.per + gapPbr * w.pbr + gapPsr * w.psr;
    const valuationTerm = valuationGap * Number(cfg.valuationScale || 32e-4);
    const cycleState = Number(leadership?.valuationCycleState?.[sector] || 0);
    const cycleTerm = clamp(cycleState * 12e-4, -24e-4, 28e-4);
    const factors = flowState.factors || {};
    const axes = flowState.axes || {};
    const macroScore = Number(axes.realEconomy || 0) * 0.46 - Number(axes.policy || 0) * 0.4 - Number(axes.externalShock || 0) * 0.34 - Math.max(0, Number(axes.inflation || 0)) * 0.24 + Number(factors.E || 0) * 0.58 - Math.max(0, Number(factors.F || 0)) * 0.18;
    const macroTerm = clamp(macroScore * Number(cfg.macroScale || 16e-4), -38e-4, 38e-4);
    const perlinCfg = cfg.perlin || {};
    const periodDays = Math.max(8, Number(perlinCfg.periodDays || 96));
    const octaves = Math.max(1, Number(perlinCfg.octaves || 4));
    const persistence = clamp(Number(perlinCfg.persistence || 0.56), 0.1, 0.95);
    const noise = perlin1D2(
      dayIndex / periodDays + sectorSeed(sector) * 9e-4,
      sectorSeed(sector) + Number(flowState.month || 0) * 13,
      octaves,
      persistence
    );
    const noiseTerm = noise * Number(perlinCfg.noiseScale || 125e-5);
    const leaderTrend = leaderRank >= 0 ? Number(cfg.trendLeader?.[Math.min(leaderRank, cfg.trendLeader.length - 1)] || 0) : 0;
    const correctionTerm = correctionActive && leaderRank < 0 ? -Math.abs(Number(cfg.correctionDrift || 32e-5)) * (1 + Math.max(0, cycleState) * 0.45) : 0;
    return clamp(
      valuationTerm + macroTerm + noiseTerm + cycleTerm + leaderTrend + correctionTerm,
      -68e-4,
      68e-4
    );
  }
  buildMacroSectorBias(flowState, baseBias, leaders = []) {
    const factors = flowState.factors;
    const axes = flowState.axes;
    const demandTilt = factors.D * 4e-5 + factors.E * 3e-5;
    const stressTilt = factors.F * 5e-5 + factors.M * 4e-5 + factors.X * 4e-5;
    const inflationTilt = axes.inflation * 3e-5;
    const leaderBoost = SECTOR_LEADERSHIP_CONFIG.rankBoost || [];
    const nonLeaderDrag = Math.max(0, Number(SECTOR_LEADERSHIP_CONFIG.nonLeaderDrag || 0));
    const leaderSet = new Set(leaders);
    const nextBias = {
      AI: (baseBias.AI || 0) + demandTilt * 1.08 - stressTilt * 0.95,
      SEMI: (baseBias.SEMI || 0) + demandTilt * 0.98 - stressTilt * 0.9,
      BIO: (baseBias.BIO || 0) + demandTilt * 0.4 - stressTilt * 0.55,
      ENR: (baseBias.ENR || 0) + inflationTilt + factors.X * 5e-5,
      CONS: (baseBias.CONS || 0) + demandTilt * 0.74 - stressTilt * 0.68,
      MEME: (baseBias.MEME || 0) + demandTilt * 1.32 - stressTilt * 1.2
    };
    for (const sector of Object.keys(nextBias)) {
      const rank = leaders.indexOf(sector);
      if (rank >= 0) {
        const boost = leaderBoost[Math.min(rank, leaderBoost.length - 1)] || 0;
        nextBias[sector] += boost;
      } else if (!leaderSet.has(sector)) {
        nextBias[sector] -= nonLeaderDrag;
      }
      const cap = sector === "MEME" ? 85e-5 : 65e-5;
      nextBias[sector] = clamp(nextBias[sector], -cap, cap);
    }
    return nextBias;
  }
  buildHistoricalTrendPressure({
    asset: asset2,
    flowState,
    leaderRank = -1,
    correctionActive = false,
    dayIndex = 0,
    swingState = 0
  }) {
    if (!asset2 || !flowState) return 0;
    const factors = flowState.factors || {};
    const axes = flowState.axes || {};
    const assetSeed = sectorSeed(`${asset2.symbol}:${asset2.sector}`);
    const longWave = perlin1D2(
      dayIndex / 188 + assetSeed * 8e-4,
      assetSeed + 31,
      4,
      0.62
    );
    const mediumWave = perlin1D2(
      dayIndex / 61 + assetSeed * 17e-4,
      assetSeed + Number(flowState.month || 0) * 9,
      3,
      0.58
    );
    const shortWave = perlin1D2(
      dayIndex / 23 + assetSeed * 29e-4,
      assetSeed + 97,
      2,
      0.64
    );
    const macroBias = Number(axes.realEconomy || 0) * 74e-5 + Number(factors.D || 0) * 28e-5 + Number(factors.E || 0) * 46e-5 - Number(axes.policy || 0) * 56e-5 - Math.max(0, Number(axes.inflation || 0)) * 42e-5 - Number(axes.externalShock || 0) * 58e-5 - Math.max(0, Number(factors.F || 0)) * 36e-5;
    const sectorRotation = leaderRank === 0 ? 36e-5 : leaderRank === 1 ? 18e-5 : -12e-5;
    const correctionBias = correctionActive && leaderRank < 0 ? -55e-5 : correctionActive ? -22e-5 : 0;
    const swingReversion = clamp(-swingState * 0.16, -12e-4, 12e-4);
    return clamp(
      macroBias + longWave * 135e-5 + mediumWave * 86e-5 + shortWave * 32e-5 + sectorRotation + correctionBias + swingReversion,
      -42e-4,
      42e-4
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
    this.bootstrapHistoricalStore = {
      dates: cache.dates,
      candlesBySymbol: cache.candles || {}
    };
    const assetSnapshots = cache.assets || {};
    for (const symbol of this.state.assetList) {
      const asset2 = this.state.assets[symbol];
      asset2.historicalCandles = null;
      asset2.candles = [];
      const snapshot = assetSnapshots[symbol];
      if (!snapshot) continue;
      asset2.price = Number(snapshot.price || asset2.price);
      asset2.prevClose = Number(snapshot.prevClose || asset2.price);
      asset2.open = asset2.price;
      asset2.high = asset2.price;
      asset2.low = asset2.price;
      asset2.close = asset2.price;
      asset2.anchor = Number(snapshot.anchor || asset2.anchor || asset2.price);
      asset2.historyMean = Number(snapshot.historyMean || asset2.historyMean || asset2.price);
      asset2.trend = Number(snapshot.trend || 0);
      asset2.swingState = Number(snapshot.swingState || 0);
      asset2.lastVolume = Math.max(0, Math.floor(Number(snapshot.lastVolume || 0)));
      asset2.micro = snapshot.micro || asset2.micro;
      asset2.borrow = Number(snapshot.borrow || asset2.borrow || asset2.baseBorrow || 0.02);
      asset2.squeezeMeter = Number(snapshot.squeezeMeter || 0);
      this.applyMicroSurface(asset2);
    }
    return {
      flow: cache.flow || null,
      leadership: cache.leadership || null
    };
  }
  getHistoricalCandleCount(asset2) {
    if (!asset2) return 0;
    if (Array.isArray(asset2.historicalCandles)) return asset2.historicalCandles.length;
    return this.bootstrapHistoricalStore?.candlesBySymbol?.[asset2.symbol]?.length || 0;
  }
  getHistoricalCandles(asset2) {
    if (!asset2) return [];
    if (Array.isArray(asset2.historicalCandles)) return asset2.historicalCandles;
    const dates = this.bootstrapHistoricalStore?.dates;
    const packedCandles = this.bootstrapHistoricalStore?.candlesBySymbol?.[asset2.symbol];
    if (!Array.isArray(dates) || !Array.isArray(packedCandles) || !packedCandles.length) {
      asset2.historicalCandles = [];
      return asset2.historicalCandles;
    }
    asset2.historicalCandles = packedCandles.map((row, index) => {
      const dayIndex = index - dates.length + 1;
      return {
        t: dayIndex * SESSION_MINUTES,
        day: dayIndex,
        date: dates[index],
        minute: 0,
        open: Number(row[0] || asset2.price),
        high: Number(row[1] || asset2.price),
        low: Number(row[2] || asset2.price),
        close: Number(row[3] || asset2.price),
        volume: Math.max(1, Math.floor(Number(row[4] || 1))),
        vwap: Number(row[5] || row[3] || asset2.price),
        event: null,
        session: row[6] || null
      };
    });
    return asset2.historicalCandles;
  }
  getCanonicalIntradayCandles(asset2) {
    if (!asset2) return [];
    const historicalCandles = this.getHistoricalCandles(asset2);
    let bars = Array.isArray(asset2.canonicalIntradayCandles) ? asset2.canonicalIntradayCandles : [];
    let historicalCount = Math.max(
      0,
      Math.min(
        Number(asset2.canonicalIntradayHistoricalCount || 0),
        historicalCandles.length
      )
    );
    let liveCount = Math.max(0, Number(asset2.canonicalIntradayLiveCount || 0));
    if (!Array.isArray(asset2.canonicalIntradayCandles)) {
      bars = [];
      historicalCount = 0;
      liveCount = 0;
    }
    if (liveCount > asset2.candles.length) {
      bars.splice(Math.max(0, bars.length - liveCount), liveCount);
      liveCount = 0;
    }
    for (let index = historicalCount; index < historicalCandles.length; index += 1) {
      const candle = historicalCandles[index];
      const decoded = decodeSessionFromCandle(candle, 1);
      if (Array.isArray(decoded) && decoded.length) bars.push(...decoded);
      else bars.push(candle);
    }
    historicalCount = historicalCandles.length;
    if (liveCount > 0) {
      bars.splice(Math.max(0, bars.length - liveCount), liveCount);
      liveCount = 0;
    }
    if (asset2.candles.length) {
      bars.push(...asset2.candles);
      liveCount = asset2.candles.length;
    }
    asset2.canonicalIntradayCandles = bars;
    asset2.canonicalIntradayHistoricalCount = historicalCount;
    asset2.canonicalIntradayLiveCount = liveCount;
    return asset2.canonicalIntradayCandles;
  }
  buildAssetSessionContext({
    asset: asset2,
    flowState,
    isoDate,
    dayIndex = 0,
    leadership = this.state.sectorLeadership,
    sectorBiasMap = this.state.scenario?.sectorBias || {},
    microState = asset2.micro
  }) {
    if (!asset2 || !flowState || !isoDate) return null;
    const quarter = this.getQuarterFinancialAtDate(asset2.financials, isoDate);
    const leaderRank = leadership?.leaders?.indexOf(asset2.sector) ?? -1;
    const correctionUntil = leadership?.correctionUntilMonth?.[asset2.sector] ?? -1;
    const correctionActive = Number(flowState.month || -1) <= Number(correctionUntil);
    const valuationMacroPressure = this.buildValuationMacroPressure({
      sector: asset2.sector,
      quarter,
      flowState,
      leadership,
      leaderRank,
      dayIndex,
      correctionActive
    });
    const trendPressure = this.buildHistoricalTrendPressure({
      asset: asset2,
      flowState,
      leaderRank,
      correctionActive,
      dayIndex,
      swingState: Number(asset2.swingState || 0)
    });
    const fundamentalTilt = this.buildFundamentalTilt(quarter);
    const marketDrift = Number(flowState.regime?.drift || 0) * Number(asset2.beta || 1) * 0.9;
    const sectorDrift = Number(sectorBiasMap?.[asset2.sector] || 0) * 0.94;
    const microDrift = Number(microState?.surface?.drift || 0) * 0.42;
    const baseDailyVol = clamp(
      (asset2.baseVol || asset2.vol) * Number(microState?.surface?.volMultiplier || 1) * Number(flowState.regime?.vol || 1) * 1.72 + 38e-4,
      6e-3,
      0.085
    );
    const priceFloor = this.getAssetPriceFloor(asset2);
    const priceCeiling = this.getAssetPriceCeiling(asset2);
    const prevClose = clamp(
      Number(asset2.price || asset2.prevClose || asset2.basePrice || 1),
      priceFloor,
      priceCeiling
    );
    const anchorGap = clamp(
      Math.log(
        Math.max(priceFloor, Number(asset2.anchor || prevClose)) / Math.max(priceFloor, prevClose)
      ),
      -0.24,
      0.24
    );
    const meanGap = clamp(
      Math.log(
        Math.max(priceFloor, Number(asset2.historyMean || prevClose)) / Math.max(priceFloor, prevClose)
      ),
      -0.24,
      0.24
    );
    const stress = clamp(
      Math.max(0, Number(flowState.axes?.externalShock || 0)) + Math.max(0, Number(flowState.axes?.policy || 0)) * 0.72 + Math.max(0, Number(flowState.factors?.F || 0)) * 0.84 + Math.max(0, Number(flowState.axes?.inflation || 0)) * 0.32,
      0,
      6
    );
    const totalPressure = marketDrift * 0.54 + sectorDrift * 0.82 + fundamentalTilt * 0.18 + valuationMacroPressure * 0.92 + microDrift * 0.18 + trendPressure * 1.02 + Number(asset2.trend || 0) * 0.16;
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
      preTrend: Number(asset2.trend || 0),
      preAnchor: Number(asset2.anchor || prevClose),
      preHistoryMean: Number(asset2.historyMean || prevClose),
      preSwingState: Number(asset2.swingState || 0),
      microState
    };
  }
  createSessionPlan(asset2, context) {
    if (!asset2 || !context) return null;
    const blueprint = buildSessionBlueprint({
      symbol: asset2.symbol,
      sector: asset2.sector,
      calendarDate: context.isoDate,
      prevClose: context.prevClose,
      priceFloor: context.priceFloor,
      priceCeiling: context.priceCeiling,
      baseDailyVol: context.baseDailyVol,
      totalPressure: context.totalPressure,
      anchorGap: context.anchorGap,
      meanGap: context.meanGap,
      stress: context.stress,
      shortInterest: Number(asset2.shortInterest || 0),
      leaderRank: context.leaderRank,
      correctionActive: context.correctionActive,
      swingState: context.preSwingState
    });
    const bars = decodeSessionBlueprint(blueprint, 1);
    const summary = summarizeSessionBars(bars);
    return summary ? { blueprint, bars, summary, context } : null;
  }
  applySessionStateTransition(asset2, context, summary) {
    if (!asset2 || !context || !summary) return;
    const priceFloor = context.priceFloor;
    const priceCeiling = context.priceCeiling;
    const sessionClose = clamp(
      Number(summary.close || context.prevClose),
      priceFloor,
      priceCeiling
    );
    const closeVsPrev = Math.log(
      Math.max(priceFloor, sessionClose) / Math.max(priceFloor, context.prevClose)
    );
    const intradayLogReturn = Number(summary.logReturn || 0);
    asset2.price = sessionClose;
    asset2.prevClose = sessionClose;
    asset2.open = Number(summary.open || sessionClose);
    asset2.high = Number(summary.high || sessionClose);
    asset2.low = Number(summary.low || sessionClose);
    asset2.close = sessionClose;
    asset2.lastVolume = Math.max(0, Math.floor(Number(summary.volume || 0)));
    asset2.dayPV = sessionClose * asset2.lastVolume;
    asset2.dayVol = asset2.lastVolume;
    asset2.changePct = (sessionClose / Math.max(priceFloor, context.prevClose) - 1) * 100;
    asset2.anchor = clamp(
      context.preAnchor * Math.exp(
        clamp(
          context.marketDrift * 0.24 + context.sectorDrift * 0.3 + context.valuationMacroPressure * 0.48 + context.microDrift * 0.14 + closeVsPrev * 0.18,
          -0.04,
          0.04
        )
      ),
      priceFloor,
      priceCeiling
    );
    asset2.historyMean = clamp(
      context.preHistoryMean * Math.exp(
        clamp(
          context.marketDrift * 0.15 + context.sectorDrift * 0.18 + context.fundamentalTilt * 0.08 + context.microDrift * 0.05 + closeVsPrev * 0.08,
          -0.03,
          0.03
        )
      ),
      priceFloor,
      priceCeiling
    );
    asset2.trend = clamp(
      context.preTrend * 0.72 + intradayLogReturn * 0.46 + context.trendPressure * 0.22,
      -0.022,
      0.022
    );
    asset2.swingState = clamp(
      context.preSwingState * 0.78 + intradayLogReturn * 0.58 - context.meanGap * 0.12 + context.totalPressure * 0.08,
      -0.06,
      0.06
    );
    asset2.sessionPlan = null;
  }
  prepareSessionPlansForDate(isoDate, dayIndex) {
    const sectorBiasMap = this.state.scenario?.sectorBias || {};
    for (const symbol of this.state.assetList) {
      const asset2 = this.state.assets[symbol];
      const context = this.buildAssetSessionContext({
        asset: asset2,
        flowState: this.state.macroFlow,
        isoDate,
        dayIndex,
        leadership: this.state.sectorLeadership,
        sectorBiasMap,
        microState: asset2.micro
      });
      const plan = this.createSessionPlan(asset2, context);
      if (!plan) continue;
      asset2.sessionPlan = plan;
      asset2.prevClose = context.prevClose;
      asset2.open = plan.summary.open;
      asset2.high = plan.summary.open;
      asset2.low = plan.summary.open;
      asset2.close = plan.summary.open;
      asset2.price = plan.summary.open;
      asset2.dayPV = 0;
      asset2.dayVol = 0;
      asset2.lastVolume = 0;
      asset2.changePct = (plan.summary.open / Math.max(context.priceFloor, context.prevClose) - 1) * 100;
      asset2.intradayNoise = 0;
      asset2.intradayDeviation = 0;
      asset2.intradayPulse = 0;
      asset2.intradayPulseLife = 0;
      asset2.intradayPhase = rand(0, Math.PI * 2);
    }
  }
  async seedHistoricalYears(years, endDate, holidaySet, onProgress = null) {
    const normalizedYears = Math.max(1, Number(years) || 1);
    const tradingDays = Math.max(140, Math.floor(normalizedYears * 252));
    const financialStartDate = MARKET_FLOW_CONFIG.financialStartDate;
    const dates = typeof financialStartDate === "string" && financialStartDate <= endDate ? this.collectOpenDatesInRange(financialStartDate, endDate, holidaySet) : this.collectHistoricalOpenDates(endDate, tradingDays, holidaySet);
    if (!dates.length) return null;
    let historyFlow = createMarketFlowState(MARKET_FLOW_CONFIG, dates[0]);
    const leadership = this.createSectorLeadershipState(yearOf(dates[0]));
    leadership.leaders = this.pickWeightedSectorLeaders(Math.random, leadership.weights);
    this.updateValuationExpectations(leadership, historyFlow, dates[0], {
      force: true,
      emitNews: false
    });
    let nextRotationMonth = historyFlow.month + Math.max(1, Number(SECTOR_LEADERSHIP_CONFIG.intervalMonths || 3));
    leadership.nextRebalanceMonth = nextRotationMonth;
    const baseBias = this.createSectorMap(0);
    const financialCursor = Object.fromEntries(
      this.state.assetList.map((symbol) => [symbol, { index: 0 }])
    );
    const microStates = {};
    const packedCandles = Object.fromEntries(
      this.state.assetList.map((symbol) => [symbol, []])
    );
    for (const symbol of this.state.assetList) {
      const asset2 = this.state.assets[symbol];
      const quarter = this.getQuarterFinancialSnapshot(
        asset2.financials,
        financialCursor[symbol],
        dates[0]
      );
      microStates[symbol] = this.buildAssetMicroState(
        asset2,
        historyFlow,
        dates[0],
        leadership,
        null,
        quarter
      );
    }
    for (let i = 0; i < dates.length; i += 1) {
      if (onProgress && (i === 0 || i === dates.length - 1 || i % 24 === 0)) {
        onProgress({
          progress: dates.length > 1 ? i / (dates.length - 1) : 1,
          message: `Synthesizing historical tape ${i + 1}/${dates.length}`
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
            leadership.weights
          );
          leadership.lastRebalanceMonth = historyFlow.month;
          if (!leadership.correctionUntilMonth) leadership.correctionUntilMonth = {};
          const correctionWindow = Math.max(
            1,
            Math.floor(Number(VALUATION_DRIVE_CONFIG.correctionDays || 18) / 21)
          );
          for (const sector of prevLeaders) {
            if (!leadership.leaders.includes(sector)) {
              leadership.correctionUntilMonth[sector] = historyFlow.month + correctionWindow;
            }
          }
          for (const sector of leadership.leaders) {
            delete leadership.correctionUntilMonth[sector];
          }
          nextRotationMonth = historyFlow.month + Math.max(1, Number(SECTOR_LEADERSHIP_CONFIG.intervalMonths || 3));
          leadership.nextRebalanceMonth = nextRotationMonth;
        }
        this.updateValuationExpectations(leadership, historyFlow, date, {
          force: true,
          emitNews: false
        });
        for (const symbol of this.state.assetList) {
          const asset2 = this.state.assets[symbol];
          const quarter = this.getQuarterFinancialSnapshot(
            asset2.financials,
            financialCursor[symbol],
            date
          );
          microStates[symbol] = this.buildAssetMicroState(
            asset2,
            historyFlow,
            date,
            leadership,
            microStates[symbol],
            quarter
          );
        }
      }
      const sectorBias = this.buildMacroSectorBias(historyFlow, baseBias, leadership.leaders);
      const dayIndex = i - dates.length + 1;
      for (const symbol of this.state.assetList) {
        const asset2 = this.state.assets[symbol];
        const microState = microStates[symbol] || this.buildAssetMicroState(
          asset2,
          historyFlow,
          date,
          leadership,
          null,
          this.getQuarterFinancialSnapshot(asset2.financials, financialCursor[symbol], date)
        );
        const context = this.buildAssetSessionContext({
          asset: asset2,
          flowState: historyFlow,
          isoDate: date,
          dayIndex,
          leadership,
          sectorBiasMap: sectorBias,
          microState
        });
        const plan = this.createSessionPlan(asset2, context);
        if (!plan) continue;
        packedCandles[symbol].push([
          roundPrice(plan.summary.open),
          roundPrice(plan.summary.high),
          roundPrice(plan.summary.low),
          roundPrice(plan.summary.close),
          Math.max(1, Math.floor(plan.summary.volume)),
          roundPrice(plan.summary.vwap),
          packSessionBlueprint(plan.blueprint)
        ]);
        asset2.micro = microState;
        this.applySessionStateTransition(asset2, context, plan.summary);
      }
    }
    for (const symbol of this.state.assetList) {
      this.applyMicroSurface(this.state.assets[symbol]);
    }
    const assetSnapshots = Object.fromEntries(
      this.state.assetList.map((symbol) => {
        const asset2 = this.state.assets[symbol];
        return [
          symbol,
          {
            price: roundPrice(asset2.price),
            prevClose: roundPrice(asset2.prevClose),
            anchor: roundPrice(asset2.anchor),
            historyMean: roundPrice(asset2.historyMean),
            trend: roundPrice(asset2.trend, 8),
            swingState: roundPrice(asset2.swingState, 8),
            borrow: roundPrice(asset2.borrow, 8),
            lastVolume: Math.max(0, Math.floor(asset2.lastVolume || 0)),
            squeezeMeter: roundPrice(asset2.squeezeMeter || 0, 4),
            micro: asset2.micro || null
          }
        ];
      })
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
        leadership
      }
    };
  }
  async resetState(emit = true) {
    const next = this.createInitialState();
    this.bootstrapHistoricalStore = null;
    this.state = next;
    this.setBootState(
      {
        active: true,
        progress: 0.02,
        message: "Preparing simulation shell"
      },
      emit
    );
    await this.yieldToBrowser();
    const holidaySet = new Set(next.marketHolidays || []);
    next.calendarDate = normalizeStartDate(
      MARKET_FLOW_CONFIG.startDate || next.calendarDate,
      holidaySet
    );
    next.scenario = this.pickScenario();
    next.scenario.baseSectorBias = { ...next.scenario.sectorBias };
    next.assets = {};
    next.assetList = ASSET_BLUEPRINTS.map((asset2) => asset2.symbol);
    next.sectorLeadership = this.createSectorLeadershipState(yearOf(next.calendarDate));
    next.eventSchedule = Math.floor(rand(16, 40));
    next.marketMinute = 0;
    next.day = 1;
    const historyDate = previousOpenDate(next.calendarDate, holidaySet);
    for (const bp of ASSET_BLUEPRINTS) {
      const asset2 = this.createAsset(bp);
      next.assets[bp.symbol] = asset2;
    }
    this.setBootState(
      {
        progress: 0.1,
        message: "Building market state and asset universe"
      },
      emit
    );
    await this.yieldToBrowser();
    this.setBootState(
      {
        progress: 0.14,
        message: "Loading cached historical tape"
      },
      emit
    );
    let historyResult = this.hydrateBootstrapCache(this.loadBootstrapCache());
    if (!historyResult) {
      this.setBootState(
        {
          progress: 0.16,
          message: "Synthesizing market history 2016-01 to 2026-01"
        },
        emit
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
              message
            },
            true
          );
        }
      );
      if (historyResult?.cache) {
        this.bootstrapHistoricalStore = {
          dates: historyResult.cache.dates,
          candlesBySymbol: historyResult.cache.candles || {}
        };
        this.saveBootstrapCache(historyResult.cache);
      }
    } else {
      this.setBootState(
        {
          progress: 0.74,
          message: "Restoring cached state"
        },
        emit
      );
      await this.yieldToBrowser();
    }
    for (const symbol of next.assetList) {
      const asset2 = next.assets[symbol];
      if (!asset2.candles.length && this.getHistoricalCandleCount(asset2) === 0) {
        this.seedHistory(asset2, 240, historyDate);
      }
    }
    if (historyResult?.leadership) {
      next.sectorLeadership = historyResult.leadership;
    }
    next.macroFlow = historyResult?.flow || createMarketFlowState(MARKET_FLOW_CONFIG, next.calendarDate);
    next.macroFlow = {
      ...next.macroFlow,
      calendarDate: next.calendarDate,
      monthKey: monthKey(next.calendarDate)
    };
    this.syncSectorWeightsForYear(next.sectorLeadership, yearOf(next.calendarDate), {
      emitNews: false
    });
    this.rebalanceSectorLeadership(next.macroFlow.month, { force: true, emitNews: false });
    this.applyMacroFlowToScenario(next.macroFlow);
    this.updateValuationExpectations(
      next.sectorLeadership,
      next.macroFlow,
      next.calendarDate,
      { force: true, emitNews: false }
    );
    this.syncMicroEconomy(next.macroFlow, next.calendarDate, {
      force: true,
      emitNews: false
    });
    this.setBootState(
      {
        progress: 0.86,
        message: "Synchronizing macro, micro, and valuation layers"
      },
      emit
    );
    await this.yieldToBrowser();
    for (const symbol of next.assetList) {
      const asset2 = next.assets[symbol];
      const priceFloor = this.getAssetPriceFloor(asset2);
      const priceCeiling = this.getAssetPriceCeiling(asset2);
      if (!Number.isFinite(asset2.price) || asset2.price <= 0 || asset2.price > priceCeiling) {
        asset2.price = clamp(Number(asset2.basePrice || 50), priceFloor, priceCeiling);
      }
      asset2.price = clamp(asset2.price, priceFloor, priceCeiling);
      asset2.prevClose = asset2.price;
      asset2.open = asset2.price;
      asset2.high = asset2.price;
      asset2.low = asset2.price;
      asset2.close = asset2.price;
      asset2.anchor = clamp(
        Number(asset2.anchor || asset2.price),
        priceFloor,
        priceCeiling
      );
      asset2.historyMean = clamp(
        Number(asset2.historyMean || asset2.price),
        priceFloor,
        priceCeiling
      );
      asset2.trend = clamp(Number(asset2.trend || 0), -0.022, 0.022);
      asset2.swingState = clamp(Number(asset2.swingState || 0), -0.06, 0.06);
      asset2.dayPV = 0;
      asset2.dayVol = 0;
      asset2.intradayNoise = 0;
      asset2.intradayDeviation = 0;
      asset2.intradayPulse = 0;
      asset2.intradayPulseLife = 0;
      asset2.intradayPhase = rand(0, Math.PI * 2);
    }
    this.setBootState(
      {
        progress: 0.94,
        message: "Preparing first live session"
      },
      emit
    );
    this.prepareSessionPlansForDate(next.calendarDate, next.day);
    await this.yieldToBrowser();
    this.addNews(
      {
        scope: "System",
        severity: "blue",
        headline: `Scenario Loaded: ${next.scenario.title}`,
        body: next.scenario.desc
      },
      false,
      false
    );
    if (next.sectorLeadership?.leaders?.length) {
      const leadNames = next.sectorLeadership.leaders.map((sector) => SECTORS[sector]?.name || sector).join(" / ");
      this.addNews(
        {
          scope: "Macro",
          severity: "blue",
          headline: "Sector Leadership Initialized",
          body: `Current lead sectors: ${leadNames}.`
        },
        false,
        false
      );
    }
    this.addNews(buildMarketFlowNews(next.macroFlow), false, false);
    this.addNews(
      {
        scope: "System",
        severity: "warn",
        headline: "Market Open",
        body: "Volatility is elevated. Leverage discipline matters from the first minute."
      },
      false,
      false
    );
    this.setBootState(
      {
        active: false,
        progress: 1,
        message: "Simulation ready"
      },
      emit
    );
    if (emit) this.requestRender(true);
  }
  maintenanceRate(leverage) {
    return clamp(0.42 / leverage, 0.08, 0.35);
  }
  getUsedMargin() {
    return Object.values(this.state.positions).reduce(
      (sum, pos) => sum + pos.margin,
      0
    );
  }
  getUnrealizedPnl(pos) {
    const asset2 = this.state.assets[pos.symbol];
    return (asset2.price - pos.avg) * pos.qty;
  }
  getEquity() {
    return this.state.cash + Object.values(this.state.positions).reduce(
      (sum, pos) => sum + pos.margin + this.getUnrealizedPnl(pos),
      0
    );
  }
  getGrossNotional() {
    return Object.values(this.state.positions).reduce(
      (sum, pos) => sum + Math.abs(pos.qty * this.state.assets[pos.symbol].price),
      0
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
    return Math.max(1, 4e-3 * Math.abs(qty) + 0.8);
  }
  slippage(asset2, side, qty = 0) {
    const spread = asset2.price * (asset2.spreadBps / 1e4) * 0.62;
    const sizeImpact = asset2.price * (Math.abs(qty) / Math.max(1500, asset2.liquidity * 45)) * 6e-3;
    const trendImpact = asset2.price * Math.abs(asset2.trend) * 0.22;
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
      nextWeightYear: normalizedStartYear == null ? null : normalizedStartYear + intervalYears
    };
  }
  rebalanceSectorLeadership(currentMonth, { force = false, emitNews = true } = {}) {
    if (!this.state.sectorLeadership) {
      this.state.sectorLeadership = this.createSectorLeadershipState(
        yearOf(this.state.calendarDate)
      );
    }
    const leadership = this.state.sectorLeadership;
    this.syncSectorWeightsForYear(leadership, yearOf(this.state.calendarDate), { emitNews });
    if (!force && currentMonth < leadership.nextRebalanceMonth) return false;
    const prevLeaders = leadership.leaders || [];
    const leaders = this.pickWeightedSectorLeaders(Math.random, leadership.weights);
    leadership.leaders = leaders;
    leadership.lastRebalanceMonth = currentMonth;
    leadership.nextRebalanceMonth = currentMonth + Math.max(1, Number(SECTOR_LEADERSHIP_CONFIG.intervalMonths || 3));
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
          body: `Top sectors for the next 3 months: ${leadNames}.`
        },
        false,
        false
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
      vol: flowState.regime.vol
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
      calendarDate: targetDate
    });
    this.syncSectorWeightsForYear(
      this.state.sectorLeadership,
      yearOf(targetDate),
      { emitNews: true }
    );
    this.rebalanceSectorLeadership(this.state.macroFlow.month, { force: false, emitNews: true });
    this.applyMacroFlowToScenario(this.state.macroFlow);
    this.updateValuationExpectations(
      this.state.sectorLeadership,
      this.state.macroFlow,
      targetDate,
      { force: true, emitNews: false }
    );
    this.syncMicroEconomy(this.state.macroFlow, targetDate, {
      force: true,
      emitNews: true
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
      0.44
    );
    if (Math.random() > shockProbability) return;
    const driftShock = clamp(
      5e-4 + externalPressure * 45e-5 + financialStress * 22e-5,
      5e-4,
      32e-4
    );
    const volShock = clamp(0.1 + externalPressure * 0.11 + financialStress * 0.08, 0.1, 0.58);
    this.applyEventEffect({
      kind: "global",
      drift: -driftShock,
      vol: volShock,
      duration: Math.floor(rand(20, 54))
    });
    const venue = isWeekend(closedDate) ? "Weekend" : "Holiday";
    this.addNews(
      {
        scope: "Macro",
        severity: "bad",
        headline: `${venue} External Shock`,
        body: `${closedDate} closed-session headline spikes risk premium before next open.`
      },
      false,
      false
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
      direction: evt.direction || 0
    };
    this.state.news.unshift(item);
    this.state.news = this.state.news.slice(0, 60);
    if (evt.symbol && evt.direction) {
      this.state.reactionWindows.push({
        symbol: evt.symbol,
        direction: evt.direction,
        expiresDay: this.state.day,
        expiresMinute: Math.min(SESSION_MINUTES - 1, this.state.marketMinute + 20),
        used: false
      });
    }
    if (autoSlow && this.state.autoSlow && this.state.speed > 1 && ["good", "bad", "warn"].includes(item.severity)) {
      this.state.autoSlowRestore = this.state.speed;
      this.state.speed = item.severity === "warn" ? 4 : 1;
      this.state.autoSlowUntil = {
        day: this.state.day,
        minute: Math.min(SESSION_MINUTES - 1, this.state.marketMinute + 12)
      };
      this.addToast("warn", "AUTO SLOW", item.headline, false);
    }
    if (emit) this.requestRender(true);
  }
  maybeEndAutoSlow() {
    const slowUntil = this.state.autoSlowUntil;
    if (!slowUntil || this.state.autoSlowRestore == null) return;
    if (this.state.day > slowUntil.day || this.state.day === slowUntil.day && this.state.marketMinute >= slowUntil.minute) {
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
        const asset2 = this.state.assets[symbol];
        if (asset2.sector === effect.sector) asset2.effects.push({ ...effect });
      }
    } else if (effect.kind === "symbol") {
      const asset2 = this.state.assets[effect.symbol];
      asset2.effects.push({ ...effect });
      asset2.anchor *= 1 + effect.drift * 10;
      if (effect.squeeze) asset2.squeezeMeter = clamp(asset2.squeezeMeter + 22, 0, 100);
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
      { value: "squeeze", weight: scenario.weights.squeeze }
    ]);
    const sectorKey = randChoice(Object.keys(SECTORS));
    const targetSym = randChoice(this.state.assetList);
    const asset2 = this.state.assets[targetSym];
    let evt = null;
    const macroBull = [
      ["Fed tone softens", "Risk appetite expands as policy pressure eases."],
      ["Yields fade", "High duration growth names catch a bid."],
      ["Large fund inflows", "Momentum broadens into leading sectors."]
    ];
    const macroBear = [
      ["Hot inflation print", "Valuation compression hits high beta baskets."],
      ["Rate shock headline", "Derisking accelerates across leverage-heavy books."],
      ["Geopolitical stress", "Volatility spikes and liquidity thins quickly."]
    ];
    const sectorBull = {
      AI: ["AI spending beat", "Cloud and AI infrastructure guides higher."],
      SEMI: ["Fab cycle upturn", "Semiconductor utilization trends improve."],
      BIO: ["FDA timeline clarity", "Biotech risk premium compresses."],
      ENR: ["Supply discipline", "Energy pricing expectations improve."],
      CONS: ["Retail demand surprise", "Consumer names see estimate upgrades."],
      MEME: ["Crowd accumulation", "Speculative names receive strong flow."]
    };
    const sectorBear = {
      AI: ["AI regulation concern", "Multiple compression pressures the group."],
      SEMI: ["Memory weakness", "ASP concerns drag semis lower."],
      BIO: ["Trial uncertainty", "Pipeline risk widens dispersion."],
      ENR: ["Commodity fade", "Energy cash-flow assumptions reset lower."],
      CONS: ["Demand softness", "Consumer margin risk returns."],
      MEME: ["Crowding unwind", "Speculative unwind hits crowded names."]
    };
    const companyBull = [
      (a) => [`${a.symbol} guidance raised`, `${a.name} raises near-term outlook.`],
      (a) => [`${a.symbol} strategic deal`, `${a.name} announces a favorable partnership.`],
      (a) => [`${a.symbol} contract win`, `Revenue visibility improves after new contract news.`]
    ];
    const companyBear = [
      (a) => [`${a.symbol} guidance cut risk`, `${a.name} faces estimate downside risk.`],
      (a) => [`${a.symbol} regulatory overhang`, `Uncertainty increases valuation discount.`],
      (a) => [`${a.symbol} launch delay`, `Product timeline concerns pressure sentiment.`]
    ];
    if (eventType === "macroBull") {
      const [headline, body] = randChoice(macroBull);
      evt = {
        scope: "Macro",
        severity: "good",
        headline,
        body,
        effect: { kind: "global", drift: 85e-5, vol: 0.22, duration: 34 }
      };
    } else if (eventType === "macroBear") {
      const [headline, body] = randChoice(macroBear);
      evt = {
        scope: "Macro",
        severity: "bad",
        headline,
        body,
        effect: { kind: "global", drift: -1e-3, vol: 0.34, duration: 36 }
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
          drift: 13e-4,
          vol: 0.16,
          duration: 28
        }
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
          drift: -14e-4,
          vol: 0.22,
          duration: 30
        }
      };
    } else if (eventType === "companyBull") {
      const [headline, body] = randChoice(companyBull)(asset2);
      evt = {
        scope: asset2.symbol,
        severity: "good",
        headline,
        body,
        symbol: asset2.symbol,
        direction: 1,
        effect: {
          kind: "symbol",
          symbol: asset2.symbol,
          drift: 22e-4,
          vol: 0.24,
          duration: 38
        }
      };
    } else if (eventType === "companyBear") {
      const [headline, body] = randChoice(companyBear)(asset2);
      evt = {
        scope: asset2.symbol,
        severity: "bad",
        headline,
        body,
        symbol: asset2.symbol,
        direction: -1,
        effect: {
          kind: "symbol",
          symbol: asset2.symbol,
          drift: -24e-4,
          vol: 0.27,
          duration: 40
        }
      };
    } else {
      const candidates = this.state.assetList.map((symbol) => this.state.assets[symbol]).sort((a, b) => b.shortInterest - a.shortInterest);
      const target = Math.random() < 0.7 ? candidates[0] : randChoice(candidates.slice(0, 4));
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
          drift: 34e-4 + target.shortInterest * 0.01,
          vol: 0.34,
          duration: 22,
          squeeze: true
        }
      };
    }
    this.applyEventEffect(evt.effect);
    this.addNews(evt, true, false);
    if (evt.effect.kind === "symbol") {
      this.state.assets[evt.effect.symbol].eventMarkers.push({
        day: this.state.day,
        minute: this.state.marketMinute,
        text: evt.headline,
        severity: evt.severity
      });
    }
    this.state.eventSchedule = Math.floor(rand(16, 42));
  }
  updateEffects(asset2) {
    let drift = 0;
    let volBoost = 0;
    asset2.effects = asset2.effects.filter((effect) => {
      effect.duration -= 1;
      if (effect.duration > 0) {
        drift += effect.drift;
        volBoost += effect.vol;
        return true;
      }
      return false;
    });
    asset2.squeezeMeter = clamp(asset2.squeezeMeter * 0.97, 0, 100);
    return { drift, volBoost };
  }
  stepAsset(asset2) {
    if (!asset2?.sessionPlan?.bars?.length) {
      this.prepareSessionPlansForDate(this.state.calendarDate, this.state.day);
    }
    const fx = this.updateEffects(asset2);
    const baseBar = asset2.sessionPlan?.bars?.[Math.min(this.state.marketMinute, asset2.sessionPlan.bars.length - 1)];
    if (!baseBar) return asset2.candles[asset2.candles.length - 1] || null;
    const session = asset2.sessionPlan;
    const microSurface = asset2.micro?.surface || null;
    const microSignals = asset2.micro?.signals || null;
    const squeezeBoost = asset2.squeezeMeter > 0 && asset2.shortInterest > 0.2 ? asset2.squeezeMeter * 18e-7 : 0;
    const baseMove = Math.log(
      Math.max(1e-6, baseBar.close) / Math.max(1e-6, baseBar.open)
    );
    const upperPct = Math.max(
      0,
      Math.log(
        Math.max(baseBar.high, baseBar.open, baseBar.close) / Math.max(baseBar.open, baseBar.close)
      )
    );
    const lowerPct = Math.max(
      0,
      Math.log(
        Math.min(baseBar.open, baseBar.close) / Math.max(1e-6, baseBar.low)
      )
    );
    const minuteSigma = clamp(
      session.blueprint.baseSigma * (0.86 + Math.max(0, Number(microSurface?.volMultiplier || 1) - 1) * 0.24 + fx.volBoost * 0.18) + Math.abs(baseMove) * 0.32 + 3e-5,
      5e-5,
      42e-4
    );
    const open = asset2.price;
    const priceFloor = this.getAssetPriceFloor(asset2);
    const priceCeiling = this.getAssetPriceCeiling(asset2);
    const effectDistortion = clamp(
      fx.drift * 0.18 + squeezeBoost + randn() * minuteSigma * (0.16 + fx.volBoost * 0.04),
      -minuteSigma * 2.4,
      minuteSigma * 2.4
    );
    const close = clamp(
      open * Math.exp(clamp(baseMove + effectDistortion, -0.03, 0.03)),
      priceFloor,
      priceCeiling
    );
    const bodyPct = Math.abs(
      Math.log(Math.max(priceFloor, close) / Math.max(priceFloor, open))
    );
    const totalRangePct = Math.max(
      bodyPct * 1.16,
      upperPct + lowerPct + minuteSigma * (0.42 + Math.abs(randn()) * 0.24)
    );
    const upperShare = clamp(
      upperPct / Math.max(1e-6, upperPct + lowerPct) + fx.volBoost * 0.02,
      0.16,
      0.84
    );
    const high = Math.min(
      priceCeiling,
      Math.max(open, close) * Math.exp(totalRangePct * upperShare)
    );
    const low = Math.max(
      priceFloor,
      Math.min(open, close) * Math.exp(-totalRangePct * (1 - upperShare))
    );
    const volume = Math.floor(
      Math.max(400, baseBar.volume) * (1 + Math.max(0, Number(microSignals?.revenue || 0)) * 0.06 + fx.volBoost * 0.24 + asset2.squeezeMeter / 90 + Math.abs(effectDistortion) * 55 + (asset2.sector === "MEME" ? 0.28 : 0))
    );
    asset2.price = close;
    asset2.close = close;
    asset2.high = Math.max(asset2.high, high);
    asset2.low = Math.min(asset2.low, low);
    asset2.lastVolume = volume;
    asset2.dayPV += close * volume;
    asset2.dayVol += volume;
    asset2.changePct = (close / asset2.prevClose - 1) * 100;
    asset2.trend = clamp(
      asset2.trend * 0.94 + Math.log(Math.max(priceFloor, close) / Math.max(priceFloor, open)) * 0.66,
      -0.02,
      0.02
    );
    asset2.intradayDeviation = clamp(
      asset2.intradayDeviation * 0.84 + Math.log(Math.max(priceFloor, close) / Math.max(priceFloor, open)),
      -0.012,
      0.012
    );
    asset2.spreadBps = clamp(
      (asset2.baseSpreadBps || 2) + session.blueprint.baseSigma * 1800 + Number(microSurface?.spreadBpsAdj || 0) + fx.volBoost * 2.6 + asset2.squeezeMeter / 18 + (asset2.baseVol || asset2.vol) * 100,
      1,
      25
    );
    asset2.liquidity = clamp(
      (asset2.baseLiquidity || 60) + Number(microSurface?.liquidityAdj || 0) - (asset2.spreadBps - (asset2.baseSpreadBps || 2)) * 2.2,
      12,
      95
    );
    asset2.candles.push({
      t: this.state.day * 1e4 + this.state.marketMinute,
      day: this.state.day,
      date: this.state.calendarDate,
      minute: this.state.marketMinute,
      open,
      high,
      low,
      close,
      volume,
      vwap: asset2.dayPV / Math.max(1, asset2.dayVol),
      event: null
    });
    if (asset2.candles.length > MAX_CANDLE_STORE) asset2.candles.shift();
    return asset2.candles[asset2.candles.length - 1];
  }
  applyHoldingCosts() {
    for (const pos of Object.values(this.state.positions)) {
      if (pos.qty < 0) {
        const asset2 = this.state.assets[pos.symbol];
        const borrowCost = Math.abs(pos.qty * asset2.price) * (asset2.borrow / 252 / SESSION_MINUTES);
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
      if (reactionWindow.symbol !== symbol || reactionWindow.direction !== direction) {
        continue;
      }
      if (this.state.day > reactionWindow.expiresDay || this.state.day === reactionWindow.expiresDay && this.state.marketMinute > reactionWindow.expiresMinute) {
        continue;
      }
      reactionWindow.used = true;
      this.addToast(
        "blue",
        "Fast Reaction",
        `${symbol} trade aligned with active news momentum.`,
        false
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
          false
        );
        this.recordOrderHistory({
          timestamp: this.currentTimeLabel(),
          symbol,
          side: qtyDelta > 0 ? "LONG" : "SHORT",
          qty: Math.abs(qtyDelta),
          leverage,
          type: source.toUpperCase(),
          status: "REJECTED",
          note: "INSUFFICIENT CASH"
        });
        return false;
      }
      cashDelta -= addMargin;
      const newQty = prevQty + qtyDelta;
      const newAvg = prevQty === 0 ? fillPrice : (prevAvg * Math.abs(prevQty) + fillPrice * Math.abs(qtyDelta)) / Math.abs(newQty);
      const margin = prevMargin + addMargin;
      newPosition = {
        symbol,
        qty: newQty,
        avg: newAvg,
        margin,
        leverage: Math.abs(newQty * newAvg) / Math.max(1, margin),
        createdAt: prev && prev.createdAt ? prev.createdAt : this.currentTimeLabel()
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
          leverage: Math.abs(remainingQty * prevAvg) / Math.max(1, margin)
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
            note: "CLOSE ONLY: CASH LIMIT"
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
          createdAt: this.currentTimeLabel()
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
        closedAt: this.currentTimeLabel()
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
      note: realized ? `REALIZED ${fmtMoney(realized)}` : ""
    });
    this.onTradeReaction(symbol, qtyDelta > 0 ? 1 : -1);
    this.addToast(
      realized >= 0 ? "good" : "bad",
      `${symbol} ${qtyDelta > 0 ? "BUY/LONG" : "SELL/SHORT"} ${Math.abs(qtyDelta)}`,
      `${fmtMoney(fillPrice)}${realized ? ` | Realized ${fmtMoney(realized)}` : ""}`,
      false
    );
    return true;
  }
  processOpenOrdersForAsset(asset2, candle) {
    const remaining = [];
    for (const order of this.state.openOrders) {
      if (order.symbol !== asset2.symbol) {
        remaining.push(order);
        continue;
      }
      const shouldFill = order.side === "long" ? candle.low <= order.limitPrice : candle.high >= order.limitPrice;
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
        "limit"
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
    const asset2 = this.state.assets[symbol];
    const fill = asset2.price + this.slippage(asset2, qtyDelta > 0 ? "buy" : "sell", qty);
    this.executeFill(symbol, qtyDelta, pos.leverage, fill, "market");
    this.requestRender(true);
  }
  forceReduceWorstPosition() {
    const entries = Object.values(this.state.positions).map((pos) => {
      const asset2 = this.state.assets[pos.symbol];
      return {
        symbol: pos.symbol,
        notional: Math.abs(pos.qty * asset2.price),
        pnl: this.getUnrealizedPnl(pos)
      };
    });
    if (!entries.length) return;
    entries.sort((a, b) => b.notional - a.notional || a.pnl - b.pnl);
    this.closePosition(entries[0].symbol, 0.5);
    this.addToast(
      "bad",
      "Forced De-risk",
      `${entries[0].symbol} position reduced by 50% due to margin stress.`,
      false
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
      const asset2 = this.state.assets[symbol];
      const context = asset2.sessionPlan?.context;
      if (!context) continue;
      const summary = {
        open: asset2.open,
        high: asset2.high,
        low: asset2.low,
        close: asset2.close,
        volume: asset2.dayVol,
        vwap: asset2.dayVol > 0 ? asset2.dayPV / Math.max(1, asset2.dayVol) : asset2.close,
        logReturn: Math.log(
          Math.max(context.priceFloor, asset2.close) / Math.max(context.priceFloor, asset2.open || context.prevClose)
        )
      };
      this.applySessionStateTransition(asset2, context, summary);
      this.archiveCompletedSession(asset2, summary);
    }
  }
  archiveCompletedSession(asset2, summary) {
    if (!asset2 || !summary || !asset2.sessionPlan?.blueprint) return;
    const historicalCandles = this.getHistoricalCandles(asset2);
    historicalCandles.push({
      t: this.state.day * SESSION_MINUTES,
      day: this.state.day,
      date: this.state.calendarDate,
      minute: 0,
      open: summary.open,
      high: summary.high,
      low: summary.low,
      close: summary.close,
      volume: summary.volume,
      vwap: summary.vwap,
      event: null,
      session: packSessionBlueprint(asset2.sessionPlan.blueprint)
    });
    asset2.candles = asset2.candles.filter(
      (candle) => Number(candle?.day) !== Number(this.state.day)
    );
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
        body: "Session reset complete. Open orders and positions remain active."
      },
      false,
      false
    );
    this.state.eventSchedule = Math.floor(rand(12, 28));
  }
  stepMinute() {
    const selectedAsset = this.state.assets[this.state.selected];
    const prevAggregatedCount = selectedAsset ? this.aggregateCandles(selectedAsset, this.state.timeframe).length : 0;
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
      const nextData = this.aggregateCandles(selectedAsset, this.state.timeframe);
      const anchorIndex = this.findChartAnchorIndex(nextData);
      if (anchorIndex >= 0) {
        const endExclusive = anchorIndex + 1;
        const maxOffset = this.getMaxChartOffset();
        this.state.chartOffset = clamp(
          nextData.length - endExclusive,
          0,
          maxOffset
        );
        this.state.chartAnchor = this.buildChartAnchor(
          nextData[Math.max(0, endExclusive - 1)],
          this.state.timeframe
        );
      } else {
        const nextAggregatedCount = nextData.length;
        const deltaBars = Math.max(0, nextAggregatedCount - prevAggregatedCount);
        if (deltaBars > 0) {
          const maxOffset = this.getMaxChartOffset();
          this.state.chartOffset = clamp(
            (this.state.chartOffset || 0) + deltaBars,
            0,
            maxOffset
          );
        }
      }
    } else if (this.state.chartFollowLatest && this.state.chartOffset !== 0) {
      this.state.chartOffset = 0;
    }
    this.state.needsRender = true;
  }
  frame(ts) {
    if (!this.state.lastFrame) this.state.lastFrame = ts;
    const dt = Math.min(0.25, (ts - this.state.lastFrame) / 1e3);
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
  aggregateCandles(asset2, frame) {
    const normalizedFrame = Math.max(1, Math.floor(Number(frame) || 1));
    const effectiveFrame = normalizedFrame === 1440 ? SESSION_MINUTES : normalizedFrame;
    const source = effectiveFrame < SESSION_MINUTES ? this.getCanonicalIntradayCandles(asset2) : this.getHistoricalCandles(asset2).concat(asset2.candles);
    if (effectiveFrame === 1) return source;
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
    return result;
  }
  buildChartAnchor(candle, timeframe = this.state.timeframe) {
    if (!candle) return null;
    return {
      symbol: this.state.selected,
      timeframe: Math.max(1, Math.floor(Number(timeframe) || 1)),
      date: candle.date || "",
      day: Number(candle.day || 0),
      minute: Number(candle.minute || 0),
      t: Number(candle.t || 0)
    };
  }
  findChartAnchorIndex(data2, anchor = this.state.chartAnchor) {
    if (!Array.isArray(data2) || !data2.length || !anchor) return -1;
    for (let index = data2.length - 1; index >= 0; index -= 1) {
      const candle = data2[index];
      if (Number(candle?.day || 0) === Number(anchor.day || 0) && Number(candle?.minute || 0) === Number(anchor.minute || 0) && String(candle?.date || "") === String(anchor.date || "")) {
        return index;
      }
    }
    return -1;
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
  buildOrderBookPreview(asset2) {
    const levels = [];
    const step = Math.max(0.01, asset2.price * asset2.spreadBps / 1e4);
    for (let i = 0; i < 5; i += 1) {
      levels.push({
        bid: asset2.price - step * (i + 1),
        ask: asset2.price + step * (i + 1),
        bidSize: Math.round(200 + asset2.liquidity * 9 + Math.random() * 420),
        askSize: Math.round(200 + asset2.liquidity * 9 + Math.random() * 420)
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
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
      ])
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
    this.clearCanonicalIntradayCachesExcept(symbol);
    this.state.selected = symbol;
    this.state.chartOffset = 0;
    this.state.chartFollowLatest = true;
    this.state.chartAnchor = null;
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
    this.state.chartAnchor = null;
    this.requestRender(true);
  }
  setChartZoom(zoom) {
    const parsed = Number(zoom);
    if (!Number.isFinite(parsed)) return;
    this.state.chartZoom = clamp(parsed, 0.45, 4);
    this.requestRender(true);
  }
  adjustChartZoom(deltaY) {
    const factor = Math.exp(-deltaY * 16e-4);
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
    const asset2 = this.state.assets[this.state.selected];
    if (!asset2) return 0;
    const data2 = this.aggregateCandles(asset2, this.state.timeframe);
    return Math.max(0, data2.length - 24);
  }
  shiftChartOffset(deltaBars) {
    const parsed = Number(deltaBars);
    if (!Number.isFinite(parsed) || parsed === 0) return;
    const maxOffset = this.getMaxChartOffset();
    const prevOffset = this.state.chartOffset || 0;
    const nextOffset = clamp(
      Math.round(prevOffset + parsed),
      0,
      maxOffset
    );
    const nextFollowLatest = nextOffset === 0;
    if (nextOffset === prevOffset && this.state.chartFollowLatest === nextFollowLatest) {
      return;
    }
    this.state.chartOffset = nextOffset;
    this.state.chartFollowLatest = nextFollowLatest;
    if (nextFollowLatest) {
      this.state.chartAnchor = null;
    } else {
      const asset2 = this.state.assets[this.state.selected];
      const data2 = asset2 ? this.aggregateCandles(asset2, this.state.timeframe) : [];
      const endExclusive = clamp(data2.length - nextOffset, 1, data2.length);
      this.state.chartAnchor = this.buildChartAnchor(
        data2[Math.max(0, endExclusive - 1)],
        this.state.timeframe
      );
    }
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
    this.state.chartAnchor = null;
    this.requestRender(true);
  }
  clearCanonicalIntradayCachesExcept(symbolToKeep = null) {
    for (const symbol of this.state.assetList || []) {
      if (symbol === symbolToKeep) continue;
      const asset2 = this.state.assets?.[symbol];
      if (!asset2) continue;
      asset2.canonicalIntradayCandles = null;
      asset2.canonicalIntradayHistoricalCount = 0;
      asset2.canonicalIntradayLiveCount = 0;
    }
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
      limitPrice: this.state.assets[this.state.selected].price
    };
    this.requestRender(true);
  }
  submitOrder() {
    const symbol = this.state.selected;
    const qty = Math.max(1, Math.floor(Number(this.state.orderForm.qty || 1)));
    const leverage = clamp(Number(this.state.orderForm.leverage || 1), 1, 5);
    const side = this.state.orderForm.side;
    const orderType = this.state.orderForm.type;
    const asset2 = this.state.assets[symbol];
    const qtyDelta = side === "long" ? qty : -qty;
    const ts = this.currentTimeLabel();
    if (orderType === "market") {
      const fill = asset2.price + this.slippage(asset2, qtyDelta > 0 ? "buy" : "sell", qty);
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
      submittedAt: ts
    };
    const marketable = side === "long" ? limitPrice >= asset2.price : limitPrice <= asset2.price;
    if (marketable) {
      const fill = side === "long" ? Math.min(limitPrice, asset2.price + Math.max(0, this.slippage(asset2, "buy", qty))) : Math.max(limitPrice, asset2.price + Math.min(0, this.slippage(asset2, "sell", qty)));
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
        note: `AT ${fmtMoney(limitPrice)}`
      });
      this.addToast(
        "blue",
        "Limit Order Submitted",
        `${symbol} ${side === "long" ? "LONG" : "SHORT"} ${qty} @ ${fmtMoney(limitPrice)}`,
        false
      );
    }
    this.requestRender(true);
  }
  cancelOrder(id) {
    const index = this.state.openOrders.findIndex((order2) => order2.id === id);
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
      note: `AT ${fmtMoney(order.limitPrice)}`
    });
    this.addToast(
      "warn",
      "Order Cancelled",
      `${order.symbol} ${order.side.toUpperCase()} ${order.qty}`,
      false
    );
    this.requestRender(true);
  }
};

// scripts/debug-sequence.mjs
function keyOf(candle) {
  if (!candle) return null;
  return `${candle.date}#${candle.minute}`;
}
function report(engine2, asset2, label) {
  const data2 = engine2.aggregateCandles(asset2, engine2.state.timeframe);
  const firstPostStart = data2.find((candle) => candle.date >= "2026-01-05");
  const anchorIndex = engine2.findChartAnchorIndex(data2);
  const endExclusive = Math.max(1, Math.min(data2.length, data2.length - Math.floor(engine2.state.chartOffset || 0)));
  const rightEdge = data2[endExclusive - 1] || null;
  console.log(
    JSON.stringify({
      label,
      len: data2.length,
      firstPostStart: keyOf(firstPostStart),
      rightEdge: keyOf(rightEdge),
      anchor: engine2.state.chartAnchor,
      anchorIndex,
      offset: engine2.state.chartOffset,
      follow: engine2.state.chartFollowLatest
    })
  );
}
var engine = new TradingEngine();
await engine.initialize(false);
engine.state.timeframe = 1;
var asset = engine.state.assets[engine.state.selected];
for (let i = 0; i < 15 * 390; i += 1) {
  engine.stepMinute();
}
engine.jumpChartBySessions(10);
report(engine, asset, "after-jump");
for (let i = 0; i < 900; i += 1) {
  engine.stepMinute();
  if (i === 0 || i === 1 || i === 388 || i === 389 || i === 899) {
    report(engine, asset, `step-${i + 1}`);
  }
}
var data = engine.aggregateCandles(asset, 1).filter((candle) => candle.date >= "2026-01-05");
var perDate = /* @__PURE__ */ new Map();
for (const candle of data) {
  perDate.set(candle.date, (perDate.get(candle.date) || 0) + 1);
}
var unusualDays = Array.from(perDate.entries()).filter(([, count]) => count !== 390);
console.log("UNUSUAL_DAYS", JSON.stringify(unusualDays.slice(0, 20)));
