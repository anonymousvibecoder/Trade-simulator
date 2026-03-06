import { clamp, randn } from "./utils";

const MICRO_STATE_LIMIT = 3.2;

const SECTOR_MICRO_PROFILE = {
  AI: {
    demand: 1.28,
    pricing: 1.18,
    financing: 1.14,
    supply: 0.72,
    external: 0.58,
    inventory: 0.62,
    capex: 1.22,
  },
  SEMI: {
    demand: 1.02,
    pricing: 0.94,
    financing: 1.02,
    supply: 1.34,
    external: 1.18,
    inventory: 1.28,
    capex: 1.16,
  },
  BIO: {
    demand: 0.44,
    pricing: 0.74,
    financing: 1.34,
    supply: 0.34,
    external: 0.32,
    inventory: 0.24,
    capex: 1.08,
  },
  ENR: {
    demand: 0.72,
    pricing: 1.08,
    financing: 0.84,
    supply: 0.62,
    external: 1.26,
    inventory: 0.88,
    capex: 0.92,
  },
  CONS: {
    demand: 1.18,
    pricing: 0.76,
    financing: 0.78,
    supply: 0.86,
    external: 0.48,
    inventory: 1.18,
    capex: 0.82,
  },
  MEME: {
    demand: 0.96,
    pricing: 0.58,
    financing: 1.42,
    supply: 0.22,
    external: 0.42,
    inventory: 0.38,
    capex: 0.52,
  },
};

const MICRO_CONFIG = {
  persistence: 0.76,
  residualSigma: 0.18,
  leaderBoost: [0.42, 0.24],
  nonLeaderFade: 0.08,
  priceSurface: {
    driftScale: 0.00016,
    secondaryScale: 0.00006,
    balanceScale: 0.00003,
    volSignalScale: 0.07,
    spreadScale: 1.45,
    liquidityScale: 6.2,
    borrowStressScale: 0.24,
  },
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
  return String(symbol || "")
    .split("")
    .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
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

function buildFundamentalBase(asset, quarter) {
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
    quality: clamp((roe - 0.14) * 4 + (Number(asset.beta || 1) - 1) * 0.25, -1.5, 1.8),
  };
}

function createInitialComponents(asset, quarter) {
  const profile = getSectorProfile(asset.sector);
  const base = buildFundamentalBase(asset, quarter);
  return {
    demand: clampMicro(base.growth * 0.92 + randn() * 0.09),
    pricingPower: clampMicro(base.margin * 0.84 + profile.pricing * 0.12 + randn() * 0.08),
    costPressure: clampMicro(0.18 - base.margin * 0.55 + randn() * 0.08),
    fundingStress: clampMicro(base.leverage * 0.74 - base.cashGen * 0.42 + randn() * 0.09),
    inventoryStress: clampMicro(profile.inventory * 0.1 + randn() * 0.11),
    capexAppetite: clampMicro(base.quality * 0.58 + base.growth * 0.36 + randn() * 0.08),
    laborPressure: clampMicro(base.growth * 0.22 + randn() * 0.06),
  };
}

function buildSignalBundle(components, base, leaderRank) {
  const leaderCarry = leaderRank >= 0 ? (leaderRank === 0 ? 0.22 : 0.12) : 0;
  const revenue = clampMicro(
    components.demand * 0.6 +
      components.pricingPower * 0.22 -
      components.inventoryStress * 0.18 -
      components.fundingStress * 0.08 +
      base.growth * 0.24 +
      leaderCarry,
  );
  const margin = clampMicro(
    components.pricingPower * 0.52 -
      components.costPressure * 0.44 -
      components.laborPressure * 0.16 -
      components.fundingStress * 0.12 +
      base.margin * 0.24,
  );
  const cashFlow = clampMicro(
    revenue * 0.42 +
      margin * 0.34 -
      components.capexAppetite * 0.22 -
      components.inventoryStress * 0.18 +
      base.cashGen * 0.18,
  );
  const balanceSheet = clampMicro(
    cashFlow * 0.22 -
      components.fundingStress * 0.76 -
      base.leverage * 0.22 +
      base.cashGen * 0.18,
  );
  const earnings = clampMicro(
    revenue * 0.46 +
      margin * 0.34 +
      cashFlow * 0.12 +
      balanceSheet * 0.08 +
      leaderCarry,
  );

  return { revenue, margin, cashFlow, balanceSheet, earnings };
}

function buildSurface(signals, components) {
  const cfg = MICRO_CONFIG.priceSurface;
  return {
    drift:
      signals.earnings * cfg.driftScale +
      signals.revenue * cfg.secondaryScale +
      signals.balanceSheet * cfg.balanceScale,
    volMultiplier: clamp(
      1 +
        Math.max(0, components.costPressure) * cfg.volSignalScale +
        Math.max(0, components.fundingStress) * (cfg.volSignalScale + 0.04) +
        Math.abs(signals.revenue) * 0.045,
      0.82,
      1.95,
    ),
    spreadBpsAdj: clamp(
      Math.max(0, components.fundingStress) * cfg.spreadScale +
        Math.max(0, components.inventoryStress) * 0.85 -
        Math.max(0, signals.balanceSheet) * 0.8,
      -2,
      8,
    ),
    liquidityAdj: clamp(
      signals.balanceSheet * cfg.liquidityScale -
        components.fundingStress * 6 -
        components.inventoryStress * 2.6,
      -24,
      18,
    ),
    borrowMult: clamp(
      1 +
        Math.max(0, components.fundingStress) * cfg.borrowStressScale +
        Math.max(0, -signals.earnings) * 0.1,
      0.82,
      2.6,
    ),
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

export function evolveAssetMicroState({
  asset,
  quarter,
  flowState,
  leadership,
  calendarDate,
  previousState = null,
}) {
  const profile = getSectorProfile(asset.sector);
  const base = buildFundamentalBase(asset, quarter);
  const leaderRank = leadership?.leaders?.indexOf(asset.sector) ?? -1;
  const leaderBoost =
    leaderRank >= 0
      ? MICRO_CONFIG.leaderBoost[Math.min(leaderRank, MICRO_CONFIG.leaderBoost.length - 1)] || 0
      : -MICRO_CONFIG.nonLeaderFade;
  const month = Number(flowState?.month || 0);
  const seed = symbolSeed(asset.symbol);
  const factors = flowState?.factors || {};
  const axes = flowState?.axes || {};
  const prevComponents = previousState?.components || createInitialComponents(asset, quarter);
  const persistence = MICRO_CONFIG.persistence;
  const residualSigma = MICRO_CONFIG.residualSigma;

  const noise = (offset, scale = 0.18, octaves = 3) =>
    perlin1D(month / 6.5 + seed * 0.0013 + offset, seed + offset * 19, octaves, 0.56) * scale;

  const target = {
    demand: clampMicro(
      base.growth * 0.78 +
        Number(factors.D || 0) * (0.44 + profile.demand * 0.14) +
        Number(factors.E || 0) * (0.28 + profile.demand * 0.12) -
        Number(factors.M || 0) * 0.16 * profile.financing -
        Number(factors.F || 0) * 0.24 * profile.financing -
        Number(factors.X || 0) * 0.14 * profile.external +
        leaderBoost +
        noise(1, 0.22),
    ),
    pricingPower: clampMicro(
      base.margin * 0.72 +
        Number(factors.E || 0) * 0.22 * profile.pricing +
        Number(factors.D || 0) * 0.12 * profile.pricing -
        Math.max(0, Number(axes.inflation || 0)) * 0.1 +
        leaderBoost * 0.55 +
        noise(2, 0.16),
    ),
    costPressure: clampMicro(
      Math.max(0, Number(axes.inflation || 0)) * (0.28 + (1.2 - profile.pricing) * 0.08) +
        Math.max(0, Number(factors.X || 0)) * 0.2 * profile.external +
        Math.max(0, Number(factors.D || 0) - Number(factors.Q || 0)) * 0.18 * profile.inventory -
        Number(factors.Q || 0) * 0.12 * profile.supply -
        base.margin * 0.14 +
        noise(3, 0.18),
    ),
    fundingStress: clampMicro(
      base.leverage * 0.72 -
        base.cashGen * 0.24 +
        Number(factors.M || 0) * 0.36 * profile.financing +
        Number(factors.F || 0) * 0.5 * profile.financing -
        Number(factors.E || 0) * 0.16 +
        noise(4, 0.16),
    ),
    inventoryStress: clampMicro(
      (Number(factors.D || 0) - Number(factors.Q || 0)) * 0.24 * profile.inventory +
        Number(factors.X || 0) * 0.16 * profile.external -
        base.growth * 0.12 +
        noise(5, 0.18),
    ),
    capexAppetite: clampMicro(
      base.quality * 0.46 +
        base.growth * 0.24 +
        Number(factors.E || 0) * 0.18 * profile.capex +
        leaderBoost * 0.42 -
        Number(factors.M || 0) * 0.24 * profile.financing -
        Number(factors.F || 0) * 0.2 * profile.financing +
        noise(6, 0.16),
    ),
    laborPressure: clampMicro(
      Number(axes.realEconomy || 0) * 0.14 +
        Number(factors.D || 0) * 0.18 -
        Number(factors.Q || 0) * 0.1 +
        Number(factors.E || 0) * 0.08 +
        noise(7, 0.12),
    ),
  };

  const components = {};
  for (const [key, targetValue] of Object.entries(target)) {
    const prev = Number(prevComponents[key] || 0);
    components[key] = clampMicro(
      prev * persistence +
        targetValue * (1 - persistence) +
        randn() * residualSigma,
    );
  }

  const signals = buildSignalBundle(components, base, leaderRank);
  const surface = buildSurface(signals, components);
  return {
    updatedAt: calendarDate,
    monthKey:
      typeof calendarDate === "string" && calendarDate.length >= 7
        ? calendarDate.slice(0, 7)
        : null,
    base,
    components,
    signals,
    surface,
    regime: buildRegimeLabel(signals, components),
  };
}
