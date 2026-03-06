import { TradingEngine } from "../src/simulator/engine.js";

function keyOf(candle) {
  if (!candle) return null;
  return `${candle.date}#${candle.minute}`;
}

function report(engine, asset, label) {
  const data = engine.aggregateCandles(asset, engine.state.timeframe);
  const firstPostStart = data.find((candle) => candle.date >= "2026-01-05");
  const anchorIndex = engine.findChartAnchorIndex(data);
  const endExclusive = Math.max(1, Math.min(data.length, data.length - Math.floor(engine.state.chartOffset || 0)));
  const rightEdge = data[endExclusive - 1] || null;
  console.log(
    JSON.stringify({
      label,
      len: data.length,
      firstPostStart: keyOf(firstPostStart),
      rightEdge: keyOf(rightEdge),
      anchor: engine.state.chartAnchor,
      anchorIndex,
      offset: engine.state.chartOffset,
      follow: engine.state.chartFollowLatest,
    }),
  );
}

const engine = new TradingEngine();
await engine.initialize(false);
engine.state.timeframe = 1;
const asset = engine.state.assets[engine.state.selected];

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

const data = engine.aggregateCandles(asset, 1).filter((candle) => candle.date >= "2026-01-05");
const perDate = new Map();
for (const candle of data) {
  perDate.set(candle.date, (perDate.get(candle.date) || 0) + 1);
}
const unusualDays = Array.from(perDate.entries()).filter(([, count]) => count !== 390);
console.log("UNUSUAL_DAYS", JSON.stringify(unusualDays.slice(0, 20)));
