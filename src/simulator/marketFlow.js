import { clamp, rand } from "./utils";

const FACTOR_KEYS = ["D", "Q", "M", "F", "X", "E"];

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

export function calcResidualBounds(value, sigma, config) {
  const mean = Number(config?.mean ?? 0);
  const bound = Math.max(0.5, Number(config?.bound ?? 3));
  const reversionBand = Math.max(0.25, Number(config?.reversionBand ?? 2));
  const deviation = value - mean;
  const pressure = clamp(deviation / reversionBand, -2.5, 2.5);
  const widthScale = clamp(
    1 - Math.min(0.68, Math.abs(deviation) / (bound * 1.3)),
    0.18,
    1,
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

export function deriveMarketAxes(factors) {
  const realEconomy = clamp(
    0.38 * factors.D +
      0.3 * factors.Q +
      0.26 * factors.E -
      0.24 * factors.F -
      0.12 * factors.M -
      0.08 * factors.X,
    -3.5,
    3.5,
  );

  const inflation = clamp(
    0.46 * factors.D -
      0.31 * factors.Q +
      0.24 * factors.X +
      0.16 * factors.E +
      0.06 * factors.F,
    -3.5,
    3.5,
  );

  const policy = clamp(
    0.58 * factors.M +
      0.19 * factors.F +
      0.23 * inflation -
      0.18 * realEconomy,
    -3.5,
    3.5,
  );

  const externalShock = clamp(
    0.7 * factors.X + 0.22 * factors.F + 0.12 * factors.M - 0.2 * factors.E,
    -3.5,
    3.5,
  );

  return { realEconomy, inflation, policy, externalShock };
}

export function deriveMacroRegime(axes, factors) {
  const riskScore =
    axes.realEconomy * 0.68 +
    factors.E * 0.56 -
    axes.policy * 0.64 -
    axes.externalShock * 0.58 -
    factors.F * 0.34;

  const stressScore = Math.max(
    0,
    factors.F * 0.76 +
      factors.X * 0.8 +
      axes.policy * 0.52 +
      Math.abs(axes.inflation) * 0.2,
  );

  let name = "Macro Vol";
  if (riskScore > 1.3) name = "Risk-On";
  else if (riskScore > 0.35) name = "Balanced Expansion";
  else if (riskScore > -0.65) name = "Macro Vol";
  else if (riskScore > -1.6) name = "Risk-Off";
  else name = "Stress Regime";

  const drift = clamp(
    0.000043 * riskScore -
      0.000028 * axes.policy -
      0.000022 * axes.externalShock +
      0.000014 * factors.E,
    -0.00024,
    0.00024,
  );

  const vol = clamp(
    0.68 + stressScore * 0.23 + Math.abs(axes.inflation) * 0.045,
    0.62,
    1.52,
  );

  return {
    name,
    tag: name,
    drift,
    vol,
    riskScore,
    stressScore,
  };
}

export function createMarketFlowState(config, calendarDate = null) {
  const mean = Number(config?.mean ?? 0);
  const bound = Math.max(0.5, Number(config?.bound ?? 3));
  const factors = mapFactors((key) =>
    clamp(
      Number(config?.initial?.[key] ?? mean),
      mean - bound,
      mean + bound,
    ),
  );
  const axes = deriveMarketAxes(factors);
  const regime = deriveMacroRegime(axes, factors);
  const state = {
    month: 0,
    monthKey: monthKeyFromDate(calendarDate),
    calendarDate,
    factors,
    residuals: emptyFactorMap(),
    residualBounds: mapFactors((key) =>
      calcResidualBounds(factors[key], resolveSigma(config, key), config),
    ),
    axes,
    regime,
    history: [],
  };
  state.history.push({
    month: state.month,
    monthKey: state.monthKey,
    calendarDate: state.calendarDate,
    factors: { ...state.factors },
    axes: { ...state.axes },
    regime: { ...state.regime },
    residuals: { ...state.residuals },
  });
  return state;
}

export function advanceMarketFlowMonth(prevState, config, options = {}) {
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
  const monthKey = monthKeyFromDate(options.calendarDate ?? prevState.calendarDate);

  const next = {
    month,
    monthKey,
    calendarDate: options.calendarDate ?? prevState.calendarDate,
    factors: nextFactors,
    residuals,
    residualBounds,
    axes,
    regime,
    history: [...(prevState.history || [])],
  };

  next.history.push({
    month,
    monthKey,
    calendarDate: next.calendarDate,
    factors: { ...nextFactors },
    axes: { ...axes },
    regime: { ...regime },
    residuals: { ...residuals },
  });
  if (next.history.length > 160) next.history.shift();
  return next;
}

function fmtSigned(value) {
  if (!Number.isFinite(value)) return "0.00";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

export function buildMarketFlowNews(flowState) {
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
      factors.M,
    )}, F ${fmtSigned(factors.F)}, X ${fmtSigned(factors.X)}, E ${fmtSigned(
      factors.E,
    )} | Real ${fmtSigned(axes.realEconomy)}, Infl ${fmtSigned(
      axes.inflation,
    )}, Policy ${fmtSigned(axes.policy)}, External ${fmtSigned(
      axes.externalShock,
    )}`,
  };
}
