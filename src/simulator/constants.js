export const COLORS = {
  text: "#e3ecff",
  muted: "#89a1cc",
  grid: "rgba(121, 144, 189, 0.12)",
  up: "#29c984",
  down: "#ff6a84",
  ma20: "#61a9ff",
  ma50: "#f4c562",
  vwap: "#58d2ef",
  candleBorder: "rgba(6, 10, 18, 0.22)",
};

export const SECTORS = {
  AI: { name: "AI", tone: "blue" },
  SEMI: { name: "Semis", tone: "violet" },
  BIO: { name: "Biotech", tone: "good" },
  ENR: { name: "Energy", tone: "warn" },
  CONS: { name: "Consumer", tone: "neutral" },
  MEME: { name: "Meme", tone: "bad" },
};

export const ASSET_BLUEPRINTS = [
  { symbol: "ALP", name: "Alpha Neural", sector: "AI", price: 142, vol: 0.0062, shortInterest: 0.12, borrow: 0.028, beta: 1.32 },
  { symbol: "SYN", name: "Synapse Cloud", sector: "AI", price: 96, vol: 0.0058, shortInterest: 0.09, borrow: 0.022, beta: 1.18 },
  { symbol: "QNT", name: "QuantForge", sector: "SEMI", price: 88, vol: 0.005, shortInterest: 0.08, borrow: 0.018, beta: 1.14 },
  { symbol: "FAB", name: "FabWorks", sector: "SEMI", price: 62, vol: 0.0056, shortInterest: 0.11, borrow: 0.02, beta: 1.08 },
  { symbol: "BIO", name: "HelixBio", sector: "BIO", price: 54, vol: 0.0108, shortInterest: 0.16, borrow: 0.072, beta: 1.42 },
  { symbol: "CRN", name: "CuraNova", sector: "BIO", price: 31, vol: 0.0134, shortInterest: 0.21, borrow: 0.085, beta: 1.48 },
  { symbol: "ENR", name: "NovaEnergy", sector: "ENR", price: 71, vol: 0.0046, shortInterest: 0.07, borrow: 0.014, beta: 0.95 },
  { symbol: "OIL", name: "TerraDrill", sector: "ENR", price: 44, vol: 0.0052, shortInterest: 0.09, borrow: 0.017, beta: 0.92 },
  { symbol: "RET", name: "UrbanCart", sector: "CONS", price: 39, vol: 0.0056, shortInterest: 0.1, borrow: 0.021, beta: 0.97 },
  { symbol: "PAY", name: "PayFlow", sector: "CONS", price: 51, vol: 0.0053, shortInterest: 0.09, borrow: 0.019, beta: 1.02 },
  { symbol: "MEM", name: "MemeWorks", sector: "MEME", price: 24, vol: 0.0158, shortInterest: 0.33, borrow: 0.18, beta: 1.86 },
];

export const SCENARIOS = [
  {
    title: "AI Rotation Rally",
    tag: "Risk-On",
    desc: "AI and semiconductors lead the tape with frequent squeezes and fast mean reversion.",
    regime: { name: "Risk-On", drift: 0.00015, vol: 0.66 },
    sectorBias: { AI: 0.00022, SEMI: 0.00014, BIO: 0.00001, ENR: -0.00004, CONS: 0.00002, MEME: 0.00008 },
    weights: { macroBull: 1.4, macroBear: 0.7, sectorBull: 1.6, sectorBear: 1, companyBull: 1.4, companyBear: 0.9, squeeze: 1.1 },
  },
  {
    title: "Macro Vol Regime",
    tag: "Macro Vol",
    desc: "Rates and inflation headlines drive rotations. Defensive groups outperform high beta names.",
    regime: { name: "Macro Vol", drift: -0.00005, vol: 1.08 },
    sectorBias: { AI: -0.00012, SEMI: -0.00009, BIO: -0.00003, ENR: 0.00018, CONS: -0.00005, MEME: -0.00009 },
    weights: { macroBull: 0.7, macroBear: 1.7, sectorBull: 0.95, sectorBear: 1.3, companyBull: 1, companyBear: 1.15, squeeze: 0.8 },
  },
  {
    title: "Idiosyncratic Vol",
    tag: "Idio Vol",
    desc: "Single name catalysts dominate. Market drift is small but dispersion stays elevated.",
    regime: { name: "Idio Vol", drift: 0.00003, vol: 0.96 },
    sectorBias: { AI: 0.00002, SEMI: 0.00002, BIO: 0.00001, ENR: 0, CONS: 0, MEME: 0.00003 },
    weights: { macroBull: 0.8, macroBear: 0.8, sectorBull: 1, sectorBear: 1, companyBull: 1.5, companyBear: 1.5, squeeze: 1 },
  },
  {
    title: "Gamma Frenzy",
    tag: "Gamma Frenzy",
    desc: "High short-interest names trend hard on crowd positioning and rapid momentum feedback.",
    regime: { name: "Gamma Frenzy", drift: 0.00007, vol: 1.18 },
    sectorBias: { AI: 0.00006, SEMI: 0.00002, BIO: 0.00005, ENR: -0.00002, CONS: 0.00001, MEME: 0.00027 },
    weights: { macroBull: 0.8, macroBear: 0.8, sectorBull: 1.2, sectorBear: 1, companyBull: 1.3, companyBear: 1, squeeze: 2.2 },
  },
  {
    title: "Risk-Off Drift",
    tag: "Risk-Off",
    desc: "Broad risk reduction with occasional panic bursts. Margin discipline is critical.",
    regime: { name: "Risk-Off", drift: -0.00013, vol: 0.93 },
    sectorBias: { AI: -0.00014, SEMI: -0.00011, BIO: -0.00008, ENR: 0.00004, CONS: -0.00004, MEME: -0.00018 },
    weights: { macroBull: 0.9, macroBear: 1.4, sectorBull: 0.9, sectorBear: 1.3, companyBull: 0.9, companyBear: 1.2, squeeze: 1.3 },
  },
];

export const DEFAULT_ORDER_FORM = {
  side: "long",
  type: "market",
  marginMode: "cross",
  qty: 25,
  leverage: 2,
  limitPrice: null,
};

export const MARKET_FLOW_CONFIG = {
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
    E: 0.33,
  },
  coupling: {
    D: { E: 0.06, F: -0.05, M: -0.04, X: -0.03, Q: 0.02 },
    Q: { X: -0.05, M: -0.03, E: 0.02, D: 0.03 },
    M: { F: 0.07, X: 0.03, D: 0.02, E: -0.04, Q: -0.02 },
    F: { X: 0.08, M: 0.06, E: -0.05, D: -0.03, Q: -0.02 },
    X: { F: 0.08, M: 0.03, E: -0.03, Q: -0.04 },
    E: { D: 0.07, F: -0.06, M: -0.05, X: -0.03, Q: 0.02 },
  },
  initial: {
    D: 0.2,
    Q: 0.1,
    M: 0,
    F: 0,
    X: 0.05,
    E: 0.15,
  },
};

export const SECTOR_LEADERSHIP_CONFIG = {
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
    MEME: 0.74,
  },
  rankBoost: [0.00018, 0.00011],
  nonLeaderDrag: 0.000015,
};

export const VALUATION_DRIVE_CONFIG = {
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
    waveScale: 0.05,
  },
  minMultiplier: 0.48,
  maxMultiplier: 2.35,
  valuationWeights: { per: 0.44, pbr: 0.33, psr: 0.23 },
  gapClamp: 0.85,
  // daily-scale pressure; combine with macro + noise
  valuationScale: 0.0038,
  macroScale: 0.0019,
  trendLeader: [0.00105, 0.00062],
  correctionDrift: 0.00052,
  correctionDays: 63,
  perlin: {
    periodDays: 96,
    octaves: 4,
    persistence: 0.56,
    noiseScale: 0.00135,
  },
};
