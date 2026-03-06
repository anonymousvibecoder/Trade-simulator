import fs from "node:fs";

const START_YEAR = 2016;
const END_YEAR = 2025;

const SYMBOLS = [
  { symbol: "ALP", sector: "AI", baseRevenue: 1800, baseGrowth: 0.16, opMargin: 0.24, netMargin: 0.16, pe: 38, deRatio: 0.42, dividend: 0.16 },
  { symbol: "SYN", sector: "AI", baseRevenue: 1450, baseGrowth: 0.14, opMargin: 0.22, netMargin: 0.14, pe: 34, deRatio: 0.46, dividend: 0.14 },
  { symbol: "QNT", sector: "SEMI", baseRevenue: 2100, baseGrowth: 0.12, opMargin: 0.2, netMargin: 0.13, pe: 28, deRatio: 0.5, dividend: 0.22 },
  { symbol: "FAB", sector: "SEMI", baseRevenue: 1720, baseGrowth: 0.1, opMargin: 0.18, netMargin: 0.11, pe: 23, deRatio: 0.56, dividend: 0.28 },
  { symbol: "BIO", sector: "BIO", baseRevenue: 980, baseGrowth: 0.13, opMargin: 0.15, netMargin: 0.08, pe: 32, deRatio: 0.62, dividend: 0.06 },
  { symbol: "CRN", sector: "BIO", baseRevenue: 760, baseGrowth: 0.11, opMargin: 0.13, netMargin: 0.06, pe: 30, deRatio: 0.68, dividend: 0.04 },
  { symbol: "ENR", sector: "ENR", baseRevenue: 2600, baseGrowth: 0.07, opMargin: 0.17, netMargin: 0.1, pe: 16, deRatio: 0.72, dividend: 0.72 },
  { symbol: "OIL", sector: "ENR", baseRevenue: 2200, baseGrowth: 0.06, opMargin: 0.16, netMargin: 0.095, pe: 14, deRatio: 0.78, dividend: 0.78 },
  { symbol: "RET", sector: "CONS", baseRevenue: 1900, baseGrowth: 0.08, opMargin: 0.14, netMargin: 0.085, pe: 20, deRatio: 0.7, dividend: 0.5 },
  { symbol: "PAY", sector: "CONS", baseRevenue: 1700, baseGrowth: 0.09, opMargin: 0.16, netMargin: 0.1, pe: 24, deRatio: 0.62, dividend: 0.36 },
  { symbol: "MEM", sector: "MEME", baseRevenue: 520, baseGrowth: 0.19, opMargin: 0.11, netMargin: 0.045, pe: 42, deRatio: 0.55, dividend: 0.0 },
];

const Q_END = {
  1: [3, 31],
  2: [6, 30],
  3: [9, 30],
  4: [12, 31],
};

const SEASONAL = { 1: 0.96, 2: 1.01, 3: 0.99, 4: 1.04 };

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randUniform(rng, min, max) {
  return min + rng() * (max - min);
}

function randNormal(rng, mean = 0, stdev = 1) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + z * stdev;
}

function roundNum(v, digits = 2) {
  return Number(v.toFixed(digits));
}

function iso(y, m, d) {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function quarterStart(year, q) {
  const month = { 1: 1, 2: 4, 3: 7, 4: 10 }[q];
  return iso(year, month, 1);
}

function quarterEnd(year, q) {
  const [m, d] = Q_END[q];
  return iso(year, m, d);
}

function generateSymbol(profile, seed) {
  const rng = mulberry32(seed);

  const shares = randUniform(rng, 420, 980) * 1_000_000;
  let revenue = profile.baseRevenue * randUniform(rng, 0.9, 1.12);
  let assets = revenue * randUniform(rng, 1.9, 2.35);
  let deRatio = profile.deRatio * randUniform(rng, 0.92, 1.08);

  const quarterly = [];
  const yearly = [];
  const revMap = new Map();

  let qIndex = 0;

  for (let year = START_YEAR; year <= END_YEAR; year += 1) {
    let yRevenue = 0;
    let yOp = 0;
    let yNet = 0;
    let yFcf = 0;
    let yDiv = 0;
    let latestQ = null;

    for (let q = 1; q <= 4; q += 1) {
      const cyc = Math.sin(qIndex / 7.5 + (profile.sector === "AI" || profile.sector === "SEMI" ? 0.6 : 0)) * 0.03;
      const quarterGrowth = (1 + profile.baseGrowth) ** 0.25 - 1;
      const shock = randNormal(rng, 0, 0.018);
      revenue *= Math.max(0.86, 1 + quarterGrowth + cyc + shock);
      revenue *= SEASONAL[q];

      let opMargin = profile.opMargin + randNormal(rng, 0, 0.013) + cyc * 0.28;
      let netMargin = profile.netMargin + randNormal(rng, 0, 0.011) + cyc * 0.18;
      opMargin = Math.min(0.42, Math.max(0.03, opMargin));
      netMargin = Math.min(opMargin - 0.01, Math.max(-0.03, netMargin));

      const operatingIncome = revenue * opMargin;
      const netIncome = revenue * netMargin;

      assets *= Math.max(0.92, 1 + quarterGrowth * 0.48 + randNormal(rng, 0, 0.01));
      deRatio = Math.min(2.2, Math.max(0.05, deRatio + randNormal(rng, 0, 0.025)));
      const equity = assets / (1 + deRatio);
      const liabilities = assets - equity;

      const fcf = netIncome * (0.78 + randUniform(rng, -0.18, 0.32));
      const dividendPerShare = profile.dividend === 0 ? 0 : Math.max(0, (profile.dividend * randUniform(rng, 0.82, 1.18)) / 4);
      const eps = (netIncome * 1_000_000) / shares;
      const bps = (equity * 1_000_000) / shares;
      const syntheticPrice = Math.max(1, eps * profile.pe * (1 + randNormal(rng, 0, 0.09)));

      const per = eps > 0 ? syntheticPrice / eps : null;
      const pbr = bps > 0 ? syntheticPrice / bps : null;
      const divYield = syntheticPrice > 0 ? dividendPerShare / syntheticPrice : 0;
      const roe = equity > 0 ? (netIncome * 4) / equity : 0;

      const prior = revMap.get(`${year - 1}-Q${q}`);
      const revenueYoY = prior ? revenue / prior - 1 : null;
      revMap.set(`${year}-Q${q}`, revenue);

      const entry = {
        period: `${year}-Q${q}`,
        year,
        quarter: q,
        startDate: quarterStart(year, q),
        endDate: quarterEnd(year, q),
        revenue: roundNum(revenue, 2),
        operatingIncome: roundNum(operatingIncome, 2),
        netIncome: roundNum(netIncome, 2),
        eps: roundNum(eps, 4),
        assets: roundNum(assets, 2),
        liabilities: roundNum(liabilities, 2),
        equity: roundNum(equity, 2),
        freeCashFlow: roundNum(fcf, 2),
        dividendPerShare: roundNum(dividendPerShare, 4),
        per: per == null ? null : roundNum(per, 2),
        pbr: pbr == null ? null : roundNum(pbr, 2),
        dividendYield: roundNum(divYield, 4),
        roe: roundNum(roe, 4),
        debtToEquity: roundNum(deRatio, 4),
        netMargin: roundNum(netMargin, 4),
        revenueYoY: revenueYoY == null ? null : roundNum(revenueYoY, 4),
      };

      quarterly.push(entry);
      latestQ = entry;

      yRevenue += revenue;
      yOp += operatingIncome;
      yNet += netIncome;
      yFcf += fcf;
      yDiv += dividendPerShare;
      qIndex += 1;
    }

    if (latestQ) {
      const annualRoe = latestQ.equity > 0 ? yNet / latestQ.equity : 0;
      const annualNetMargin = yRevenue > 0 ? yNet / yRevenue : 0;
      yearly.push({
        period: `${year}`,
        year,
        endDate: iso(year, 12, 31),
        revenue: roundNum(yRevenue, 2),
        operatingIncome: roundNum(yOp, 2),
        netIncome: roundNum(yNet, 2),
        freeCashFlow: roundNum(yFcf, 2),
        dividendPerShare: roundNum(yDiv, 4),
        assets: latestQ.assets,
        liabilities: latestQ.liabilities,
        equity: latestQ.equity,
        per: latestQ.per,
        pbr: latestQ.pbr,
        dividendYield: latestQ.dividendYield,
        roe: roundNum(annualRoe, 4),
        debtToEquity: latestQ.debtToEquity,
        netMargin: roundNum(annualNetMargin, 4),
      });
    }
  }

  return {
    symbol: profile.symbol,
    quarterly,
    yearly,
  };
}

function main() {
  const out = {};
  SYMBOLS.forEach((profile, idx) => {
    out[profile.symbol] = generateSymbol(profile, 2048 + idx * 37);
  });

  const content = `/* eslint-disable */\nexport const FINANCIAL_STATEMENTS = ${JSON.stringify(out, null, 2)};\n`;
  fs.writeFileSync("src/simulator/financials.generated.js", content, "utf8");
}

main();
