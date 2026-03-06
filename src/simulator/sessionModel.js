import { clamp, lerp } from "./utils";

export const SESSION_MINUTES = 390;

const SESSION_TYPES = [
  "balance",
  "trendUp",
  "trendDown",
  "gapFade",
  "reversal",
  "squeeze",
  "distribution",
];

const SESSION_TYPE_TO_CODE = Object.fromEntries(
  SESSION_TYPES.map((type, index) => [type, index]),
);

function fract(value) {
  return value - Math.floor(value);
}

function hashNoiseSigned(x, seed = 0) {
  const n = Math.sin((x + seed) * 127.1 + seed * 311.7) * 43758.5453123;
  return fract(n) * 2 - 1;
}

function smoothstep01(t) {
  return t * t * (3 - 2 * t);
}

function valueNoise1D(x, seed = 0) {
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
    sum += valueNoise1D(x * frequency + seed * 0.11 + i * 13.7, seed + i * 17.3) * amplitude;
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
  const span = Math.max(0.000001, p2.x - p1.x);
  const t = clamp((x - p1.x) / span, 0, 1);
  const m1 = ((p2.y - p0.y) / Math.max(0.000001, p2.x - p0.x)) * span;
  const m2 = ((p3.y - p1.y) / Math.max(0.000001, p3.x - p1.x)) * span;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * p1.y +
    (t3 - 2 * t2 + t) * m1 +
    (-2 * t3 + 3 * t2) * p2.y +
    (t3 - t2) * m2
  );
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
  const n = Math.sin(seed * 0.00000173 + salt * 19.91 + 13.17) * 43758.5453123;
  return fract(n);
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
  const typeBoost =
    sessionType === "squeeze" || sessionType === "reversal"
      ? 0.28
      : sessionType === "trendUp" || sessionType === "trendDown"
        ? 0.12
        : 0;
  return 0.82 + edge * (0.58 + typeBoost) - lunch * lunchDip * 0.14;
}

function buildControlSet(type, closeOffset, seed, baseDailyVol) {
  const quiet = Math.max(baseDailyVol * 0.18, 0.0012);
  const active = Math.max(baseDailyVol * 0.54, 0.0034);
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
        shockMagnitude: Math.max(0, closeOffset) * rangedNoise(seed, 18, 0.12, 0.22),
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
        shockMagnitude: -Math.abs(closeOffset) * rangedNoise(seed, 28, 0.12, 0.22),
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
        shockMagnitude: -closeOffset * rangedNoise(seed, 38, 0.18, 0.34),
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
        shockMagnitude: closeOffset * rangedNoise(seed, 48, 0.24, 0.48),
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
        shockMagnitude: Math.max(active, Math.abs(closeOffset) * rangedNoise(seed, 58, 0.44, 0.78)),
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
        shockMagnitude: -Math.max(quiet, Math.abs(closeOffset) * rangedNoise(seed, 68, 0.2, 0.42)),
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
        shockMagnitude: closeOffset * rangedNoise(seed, 78, -0.16, 0.16),
      };
  }
}

export function buildSessionBlueprint(context = {}) {
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
    swingState = 0,
  } = context;

  const seed = hashString(
    [
      symbol,
      sector,
      calendarDate,
      Math.round(prevClose * 100),
      Math.round(totalPressure * 1_000_000),
      Math.round(anchorGap * 100_000),
      Math.round(meanGap * 100_000),
      Math.round(stress * 1_000),
      Math.round(swingState * 100_000),
      leaderRank,
      correctionActive ? 1 : 0,
    ].join("|"),
  );

  const pressureScore = clamp(totalPressure / Math.max(baseDailyVol, 0.0005), -3.2, 3.2);
  const extension = clamp(swingState / Math.max(baseDailyVol, 0.0005), -2.4, 2.4);
  const overnightCore =
    totalPressure * 0.085 +
    anchorGap * 0.06 +
    meanGap * 0.035 +
    swingState * 0.018;
  const overnightBudget = clamp(
    baseDailyVol * (0.16 + Math.max(0, stress) * 0.018 + (correctionActive ? 0.03 : 0)),
    0.0012,
    0.012,
  );
  const overnightShockProb = clamp(
    0.012 +
      Math.max(0, stress) * 0.018 +
      Math.max(0, shortInterest - 0.14) * 0.42 +
      (correctionActive ? 0.028 : 0),
    0.012,
    0.16,
  );
  const overnightShock =
    unitNoise(seed, 90) < overnightShockProb
      ? signedNoise(seed, 91) * overnightBudget * rangedNoise(seed, 92, 0.22, 0.82)
      : 0;
  const gapMove = clamp(
    overnightCore +
      signedNoise(seed, 1) * overnightBudget * 0.32 +
      overnightShock,
    -overnightBudget,
    overnightBudget,
  );
  const open = clamp(prevClose * Math.exp(gapMove), priceFloor, priceCeiling);

  const weights = {
    balance: 1.35 + Math.max(0, 0.8 - Math.abs(pressureScore)),
    trendUp:
      Math.max(0.1, pressureScore) * 1.2 +
      (leaderRank === 0 ? 1.1 : leaderRank === 1 ? 0.62 : 0) +
      Math.max(0, gapMove / Math.max(baseDailyVol, 0.0005)) * 0.25,
    trendDown:
      Math.max(0.1, -pressureScore) * 1.18 +
      Math.max(0, stress) * 0.3 +
      Math.max(0, -gapMove / Math.max(baseDailyVol, 0.0005)) * 0.25,
    gapFade:
      Math.abs(gapMove) / Math.max(baseDailyVol, 0.0005) * 0.82 +
      Math.max(0, -Math.sign(gapMove || 1) * Math.sign(pressureScore || 1)) * 0.85,
    reversal:
      Math.abs(pressureScore - extension) * 0.5 +
      Math.max(0, stress) * 0.38 +
      (correctionActive ? 0.42 : 0),
    squeeze:
      Math.max(0, shortInterest - 0.14) * 6.4 +
      Math.max(0, pressureScore) * 0.42 +
      (sector === "MEME" ? 0.75 : 0),
    distribution:
      Math.max(0, extension) * 0.58 +
      Math.max(0, -pressureScore) * 0.26 +
      (correctionActive ? 0.52 : 0),
  };
  const type = deterministicPick(weights, seed);

  const baseSigma = clamp(
    (baseDailyVol / Math.sqrt(SESSION_MINUTES)) * rangedNoise(seed, 2, 10.5, 16.5),
    0.00008,
    0.0039,
  );
  const leaderLift = leaderRank === 0 ? 0.22 : leaderRank === 1 ? 0.12 : -0.04;
  const closeOffset = clampLogReturn(
    totalPressure * 0.84 +
      meanGap * 0.34 +
      anchorGap * 0.18 +
      swingState * 0.14 +
      leaderLift * baseDailyVol * 0.55 +
      signedNoise(seed, 3) * baseDailyVol * 0.48,
    baseDailyVol * 2.15,
  );
  const controls = buildControlSet(type, closeOffset, seed, baseDailyVol);
  const volumeBase = Math.max(
    2500,
    Math.round(
      (8200 + open * 90 + baseDailyVol * 1_500_000) *
        rangedNoise(seed, 4, 0.82, 1.24) *
        (1 + Math.max(0, shortInterest - 0.12) * 0.55),
    ),
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
    priceCeiling,
  };
}

export function barsPerSyntheticSession(timeframe) {
  const normalized = Math.max(1, Math.floor(Number(timeframe) || 1));
  if (normalized >= SESSION_MINUTES) return 1;
  return Math.max(1, Math.floor(SESSION_MINUTES / normalized));
}

export function decodeSessionBlueprint(blueprint, timeframe = 1) {
  if (!blueprint) return [];
  const segments = barsPerSyntheticSession(timeframe);
  const minuteStep = Math.max(1, Math.floor(SESSION_MINUTES / segments));
  const controls = [
    { x: 0, y: 0 },
    { x: blueprint.posA, y: blueprint.curveA },
    { x: blueprint.posB, y: blueprint.curveB },
    { x: blueprint.posC, y: blueprint.curveC },
    { x: 1, y: blueprint.closeOffset },
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
    const currentOffset = Math.log(Math.max(0.000001, price) / Math.max(0.000001, blueprint.open));
    const targetPull = clamp(target - currentOffset, -blueprint.baseSigma * 5.4, blueprint.baseSigma * 5.4);
    const shockWindow = bellCurve(progress, blueprint.shockCenter, 0.08);
    const wave =
      fractalNoise1D(progress * 9.5 + rangeSeed * 0.00001, rangeSeed + 101, 3, 0.58) *
      blueprint.baseSigma *
      1.15;
    const fineNoise =
      hashNoiseSigned(i * 1.37 + rangeSeed * 0.001, rangeSeed + 197) *
      blueprint.baseSigma *
      0.72;
    const volCurve = intradayVolatilityCurve(progress, blueprint.type, blueprint.lunchDip);
    const localSigma = blueprint.baseSigma * volCurve;
    const closeAuction = bellCurve(progress, 0.95, 0.06) * (blueprint.closeAuction || 0);
    const shock = shockWindow * (blueprint.shockMagnitude || 0);
    imbalance =
      imbalance * 0.74 +
      targetPull * 0.64 +
      wave * 0.46 +
      fineNoise * 0.32 +
      shock * 0.74;
    const move = clamp(
      targetPull * 0.78 +
        imbalance * 0.42 +
        wave * 0.34 +
        fineNoise * 0.44 +
        closeAuction +
        shock * 0.28,
      -localSigma * 7.5,
      localSigma * 7.5,
    );
    const open = price;
    const close = clamp(
      open * Math.exp(move),
      blueprint.priceFloor,
      blueprint.priceCeiling,
    );
    const bodyRange = Math.abs(Math.log(Math.max(0.000001, close) / Math.max(0.000001, open)));
    const turnBias =
      bellCurve(progress, blueprint.posA, 0.08) * Math.sign(blueprint.curveA || 1) * 0.05 +
      bellCurve(progress, blueprint.posB, 0.08) * Math.sign(blueprint.curveB || 1) * 0.08 +
      bellCurve(progress, blueprint.posC, 0.08) * Math.sign(blueprint.curveC || 1) * 0.06;
    const upperShare = clamp(
      0.5 +
        (blueprint.wickBias || 0) +
        turnBias -
        Math.sign(move || 0) * 0.04 +
        hashNoiseSigned(i * 0.93, rangeSeed + 281) * 0.08,
      0.16,
      0.84,
    );
    const totalRange = Math.max(
      bodyRange * 1.18,
      localSigma * (0.72 + Math.abs(hashNoiseSigned(i * 0.71, rangeSeed + 331)) * 0.82),
    );
    const residual = Math.max(localSigma * 0.2, totalRange - bodyRange);
    const upperPct = residual * upperShare;
    const lowerPct = residual * (1 - upperShare);
    const high = Math.min(
      blueprint.priceCeiling,
      Math.max(open, close) * Math.exp(upperPct),
    );
    const low = Math.max(
      blueprint.priceFloor,
      Math.min(open, close) * Math.exp(-lowerPct),
    );
    const volumeCurve = intradayVolumeCurve(progress, blueprint.lunchDip);
    const volume = Math.max(
      1,
      Math.floor(
        blueprint.volumeBase *
          timeframe *
          volumeCurve *
          (1 +
            Math.abs(move) * 130 +
            shockWindow * 0.72 +
            Math.abs(targetPull) * 62),
      ),
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
      vwap: vol > 0 ? pv / vol : close,
    });
    price = close;
  }

  return bars;
}

export function summarizeSessionBars(bars) {
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
    logReturn: Math.log(Math.max(0.000001, close) / Math.max(0.000001, open)),
  };
}

export function packSessionBlueprint(blueprint) {
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
    Number(blueprint.wickBias.toFixed(6)),
  ];
}

export function unpackSessionBlueprint(packed, overrides = {}) {
  if (!Array.isArray(packed) || packed.length < 17) return packed || null;
  return {
    type: SESSION_TYPES[packed[0]] || "balance",
    seed: packed[1] >>> 0,
    baseSigma: Number(packed[2] || 0.0002),
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
    ...overrides,
  };
}

export function decodeSessionFromCandle(candle, timeframe = 1) {
  if (!candle?.session) return null;
  const priceFloor = Math.max(
    0.5,
    Math.min(
      Number(candle.low || candle.open || candle.close || 1),
      Number(candle.open || candle.close || 1),
    ) * 0.22,
  );
  const priceCeiling = Math.max(
    Number(candle.high || candle.open || candle.close || 1) * 3.6,
    Number(candle.high || candle.open || candle.close || 1) + 10,
  );
  const blueprint = unpackSessionBlueprint(candle.session, {
    open: Number(candle.open || candle.close || 1),
    priceFloor,
    priceCeiling,
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
    event: null,
  }));
}
