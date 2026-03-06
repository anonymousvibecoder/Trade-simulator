import { COLORS } from "./constants";
import { clamp, lerp } from "./utils";
import { decodeSessionFromCandle } from "./sessionModel";

const MIN_VISIBLE = 24;
const MAX_VISIBLE = 420;
const MAX_DECODED_VISIBLE = 6000;
const SESSION_MINUTES = 390;
const SYNTHETIC_SESSION_CACHE = new Map();
const SYNTHETIC_SESSION_CACHE_LIMIT = 2048;

export function drawTradingChart({
  canvas,
  engine,
  hover,
}) {
  if (!canvas) return;
  const state = engine.state;
  const asset = state.assets[state.selected];
  if (!asset) return;

  const data = engine.aggregateCandles(asset, state.timeframe);
  if (!data.length) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(300, Math.floor(rect.width));
  const height = Math.max(180, Math.floor(rect.height));
  if (
    canvas.width !== Math.floor(width * dpr) ||
    canvas.height !== Math.floor(height * dpr)
  ) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const indicators = normalizeIndicators(state.chartIndicators);
  const showMa20 = indicators.ma20.enabled;
  const showMa50 = indicators.ma50.enabled;
  const showVwap = indicators.vwap.enabled;
  const showMacd = indicators.macd.enabled;
  const padL = 12;
  const padR = 72;
  const padT = 10;
  const padB = 22;
  const chartGap = 8;
  const macdGap = showMacd ? 6 : 0;
  const plotW = Math.max(160, width - padL - padR);

  const availableH = height - padT - padB;
  const lowerTarget = Math.floor(availableH * (showMacd ? 0.34 : 0.23));
  const lowerMin = showMacd ? 84 : 56;
  const lowerMax = Math.max(lowerMin, availableH - 88 - chartGap);
  const lowerBlockH = clamp(lowerTarget, lowerMin, lowerMax);
  const chartH = Math.max(88, availableH - lowerBlockH - chartGap);
  const chartY = padT;
  const volY = chartY + chartH + chartGap;

  let volumeH = lowerBlockH;
  let macdH = 0;
  let macdY = volY;
  if (showMacd) {
    const splitBase = lowerBlockH - macdGap;
    volumeH = Math.floor(splitBase * 0.56);
    macdH = splitBase - volumeH;
    if (macdH < 28) {
      macdH = 28;
      volumeH = splitBase - macdH;
    }
    if (volumeH < 36) {
      volumeH = 36;
      macdH = splitBase - volumeH;
    }
    macdY = volY + volumeH + macdGap;
  }
  const lowerBottomY = showMacd ? macdY + macdH : volY + volumeH;

  const zoom = clamp(state.chartZoom ?? 1, 0.45, 4);
  const baseVisible = Math.max(30, Math.floor(plotW / 9.2));
  const scaledVisible = Math.floor(baseVisible / zoom);
  const visibleCount = clamp(scaledVisible, MIN_VISIBLE, Math.min(data.length, MAX_VISIBLE));
  const indicatorWarmup = Math.max(240, visibleCount * 3);
  const endExclusive = clamp(
    data.length - Math.floor(state.chartOffset || 0),
    1,
    data.length,
  );
  const startIndex = Math.max(0, endExclusive - visibleCount - indicatorWarmup);
  const rawWindowData = data.slice(startIndex, endExclusive);
  const windowData = decodeFractalResolutionWindow(
    rawWindowData,
    state.timeframe,
    visibleCount,
    indicatorWarmup,
  );
  const decodeRatio = rawWindowData.length
    ? Math.max(1, windowData.length / rawWindowData.length)
    : 1;
  const decodedVisibleCount = clamp(
    Math.floor(visibleCount * decodeRatio),
    MIN_VISIBLE,
    Math.min(windowData.length, MAX_DECODED_VISIBLE),
  );
  const visibleStartIndex = Math.max(0, windowData.length - decodedVisibleCount);
  const visible = windowData.slice(visibleStartIndex);
  if (!visible.length) return;

  const step = plotW / visible.length;
  const candleW = clamp(step * 0.64, 2, 12);
  const indexToX = (index) => padL + index * step + step / 2;
  const windowIndex = (visibleIndex) => visibleStartIndex + visibleIndex;

  const rangeSource = state.chartAutoScale !== false ? visible : windowData;
  const scaleMode = state.chartScale === "log" ? "log" : "linear";
  const scale = buildPriceScale(rangeSource, scaleMode);
  const priceToY = (price) => {
    const ratio = clamp(
      (scale.toScaled(price) - scale.minScaled) / scale.spanScaled,
      0,
      1,
    );
    return chartY + (1 - ratio) * chartH;
  };
  const yToPrice = (y) => {
    const ratio = clamp(1 - (y - chartY) / chartH, 0, 1);
    return scale.fromScaled(scale.minScaled + ratio * scale.spanScaled);
  };

  const ma20Period = Math.min(Math.max(2, indicators.ma20.period), windowData.length);
  const ma50Period = Math.min(Math.max(2, indicators.ma50.period), windowData.length);
  const ma20 = engine.movingAverage(windowData, ma20Period);
  const ma50 = engine.movingAverage(windowData, ma50Period);
  const rollingVwap = buildContinuousVwap(windowData);
  const volMa = engine.movingAverage(
    windowData,
    Math.min(20, windowData.length),
    (item) => item.volume,
  );
  const macdSeries = calcMacd(windowData.map((item) => item.close), indicators.macd);

  const volumeSource = state.chartAutoScale !== false ? visible : windowData;
  const volumeMax = Math.max(...volumeSource.map((item) => item.volume), 1);

  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "rgba(13, 20, 34, 1)");
  bgGrad.addColorStop(1, "rgba(7, 12, 20, 1)");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(9, 15, 25, 0.94)";
  ctx.fillRect(width - padR, 0, padR, height);
  ctx.fillStyle = "rgba(10, 16, 27, 0.72)";
  ctx.fillRect(padL, volY, plotW, volumeH);
  if (showMacd) {
    ctx.fillStyle = "rgba(10, 16, 27, 0.68)";
    ctx.fillRect(padL, macdY, plotW, macdH);
  }

  ctx.strokeStyle = "rgba(121, 144, 189, 0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i += 1) {
    const y = chartY + (chartH / 6) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(width - padR, y);
    ctx.stroke();
    const price = scale.fromScaled(lerp(scale.maxScaled, scale.minScaled, i / 6));
    ctx.fillStyle = "#8da2c8";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText(formatAxisPrice(price), width - padR + 8, y + 4);
  }

  const xGridSegments = Math.max(5, Math.min(9, Math.floor(plotW / 170)));
  const xTickSlots = [];
  for (let i = 0; i <= xGridSegments; i += 1) {
    const ratio = i / xGridSegments;
    const x = padL + plotW * ratio;
    ctx.beginPath();
    ctx.moveTo(x, chartY);
    ctx.lineTo(x, lowerBottomY);
    ctx.stroke();
    xTickSlots.push(Math.round((visible.length - 1) * ratio));
  }

  ctx.beginPath();
  ctx.moveTo(padL, volY);
  ctx.lineTo(width - padR, volY);
  ctx.strokeStyle = "rgba(121, 144, 189, 0.2)";
  ctx.stroke();
  if (showMacd) {
    ctx.beginPath();
    ctx.moveTo(padL, macdY);
    ctx.lineTo(width - padR, macdY);
    ctx.stroke();
  }

  const usedTicks = new Set();
  xTickSlots.forEach((idx) => {
    if (usedTicks.has(idx)) return;
    usedTicks.add(idx);
    const candle = visible[idx];
    if (!candle) return;
    const prev = idx > 0 ? visible[idx - 1] : null;
    const label = formatCandleTime(candle, prev, state.timeframe);
    const x = indexToX(idx);
    ctx.fillStyle = COLORS.muted;
    ctx.font = "11px Inter, sans-serif";
    const labelW = ctx.measureText(label).width;
    ctx.fillText(label, x - labelW / 2, height - 7);
  });

  function plotPriceLine(color, lineWidth, accessor) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    let started = false;
    visible.forEach((_, i) => {
      const value = accessor(i);
      if (!Number.isFinite(value)) return;
      const x = indexToX(i);
      const y = priceToY(value);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(padL, chartY, plotW, chartH);
  ctx.clip();

  if (showVwap) {
    plotPriceLine(COLORS.vwap, 1.15, (i) => rollingVwap[windowIndex(i)]);
  }
  if (showMa20) {
    plotPriceLine(COLORS.ma20, 1.35, (i) => ma20[windowIndex(i)]);
  }
  if (showMa50) {
    plotPriceLine(COLORS.ma50, 1.35, (i) => ma50[windowIndex(i)]);
  }

  visible.forEach((d, i) => {
    const x = indexToX(i);
    const openY = priceToY(d.open);
    const closeY = priceToY(d.close);
    const highY = priceToY(d.high);
    const lowY = priceToY(d.low);
    const up = d.close >= d.open;

    ctx.strokeStyle = up ? COLORS.up : COLORS.down;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    const bodyTop = Math.min(openY, closeY);
    const bodyH = Math.max(1.6, Math.abs(closeY - openY));
    ctx.fillStyle = up ? COLORS.up : COLORS.down;
    ctx.strokeStyle = COLORS.candleBorder;
    ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
    ctx.strokeRect(x - candleW / 2, bodyTop, candleW, bodyH);
  });

  const lastClose = visible[visible.length - 1].close;
  const currentY = priceToY(lastClose);
  ctx.setLineDash([6, 5]);
  ctx.strokeStyle = asset.changePct >= 0 ? "rgba(41, 201, 132, .72)" : "rgba(255, 106, 132, .72)";
  ctx.beginPath();
  ctx.moveTo(padL, currentY);
  ctx.lineTo(width - padR, currentY);
  ctx.stroke();
  ctx.setLineDash([]);

  const position = engine.getCurrentPosition(asset.symbol);
  if (position) {
    const y = priceToY(position.avg);
    ctx.strokeStyle = position.qty > 0 ? "rgba(97, 169, 255, 0.72)" : "rgba(244, 197, 98, 0.78)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(width - padR, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(7, 12, 20, 0.96)";
    ctx.fillRect(padL + 8, y - 12, 136, 22);
    ctx.fillStyle = position.qty > 0 ? COLORS.ma20 : COLORS.ma50;
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillText(
      `${position.qty > 0 ? "LONG" : "SHORT"} AVG ${position.avg.toFixed(2)}`,
      padL + 14,
      y + 3,
    );
  }

  const selectedOrders = state.openOrders.filter((order) => order.symbol === asset.symbol);
  selectedOrders.forEach((order) => {
    const y = priceToY(order.limitPrice);
    ctx.setLineDash([2, 6]);
    ctx.strokeStyle =
      order.side === "long"
        ? "rgba(97, 169, 255, 0.6)"
        : "rgba(255, 106, 132, 0.6)";
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(width - padR, y);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  visible.forEach((d, i) => {
    const marker = asset.eventMarkers.find(
      (m) => m.day === d.day && Math.abs(m.minute - d.minute) < Math.max(1, state.timeframe),
    );
    if (!marker) return;
    const x = indexToX(i);
    ctx.fillStyle =
      marker.severity === "bad"
        ? COLORS.down
        : marker.severity === "warn"
          ? COLORS.ma50
          : COLORS.ma20;
    ctx.beginPath();
    ctx.arc(x, chartY + 10, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(padL, volY, plotW, volumeH);
  ctx.clip();
  visible.forEach((d, i) => {
    const x = indexToX(i);
    const volBarH = (d.volume / volumeMax) * volumeH;
    ctx.fillStyle = d.close >= d.open ? "rgba(41, 201, 132, 0.48)" : "rgba(255, 106, 132, 0.48)";
    ctx.fillRect(x - candleW / 2, volY + volumeH - volBarH, candleW, volBarH);
  });
  ctx.beginPath();
  let startedVolMa = false;
  visible.forEach((_, i) => {
    const value = volMa[windowIndex(i)];
    if (!Number.isFinite(value)) return;
    const x = indexToX(i);
    const y = volY + volumeH - (value / volumeMax) * volumeH;
    if (!startedVolMa) {
      ctx.moveTo(x, y);
      startedVolMa = true;
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.strokeStyle = "rgba(88, 210, 239, 0.9)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  if (showMacd) {
    const macdRange = buildMacdRange(
      macdSeries,
      visibleStartIndex,
      visible.length,
      state.chartAutoScale !== false,
    );
    const macdToY = (value) => {
      const ratio = (value - macdRange.min) / macdRange.span;
      return macdY + (1 - ratio) * macdH;
    };

    ctx.save();
    ctx.beginPath();
    ctx.rect(padL, macdY, plotW, macdH);
    ctx.clip();

    const zeroY = macdToY(0);
    ctx.strokeStyle = "rgba(132, 149, 177, 0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, zeroY);
    ctx.lineTo(width - padR, zeroY);
    ctx.stroke();

    visible.forEach((_, i) => {
      const idx = windowIndex(i);
      const hist = macdSeries.histogram[idx];
      if (!Number.isFinite(hist)) return;
      const x = indexToX(i);
      const y = macdToY(hist);
      ctx.fillStyle = hist >= 0 ? "rgba(41, 201, 132, 0.45)" : "rgba(255, 106, 132, 0.45)";
      ctx.fillRect(x - candleW / 2, Math.min(zeroY, y), candleW, Math.max(1, Math.abs(zeroY - y)));
    });

    drawSeriesLine(ctx, visible, indexToX, windowIndex, macdSeries.macd, macdToY, "rgba(97, 169, 255, 0.95)");
    drawSeriesLine(ctx, visible, indexToX, windowIndex, macdSeries.signal, macdToY, "rgba(244, 197, 98, 0.95)");

    ctx.restore();

    ctx.fillStyle = COLORS.muted;
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText("MACD", width - padR + 8, macdY + 14);
  }

  const latestVisible = visible[visible.length - 1];
  drawAxisTag(
    ctx,
    width - padR + 3,
    currentY,
    padR - 6,
    20,
    formatAxisPrice(lastClose),
    asset.changePct >= 0 ? COLORS.up : COLORS.down,
    height,
  );
  ctx.fillStyle = COLORS.muted;
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText(`Vol ${formatVolumeShort(latestVisible.volume)}`, width - padR + 8, volY + 14);

  if (
    hover &&
    hover.x != null &&
    hover.y != null &&
    hover.x > padL &&
    hover.x < width - padR &&
    hover.y > chartY &&
    hover.y < lowerBottomY
  ) {
    const idx = clamp(Math.floor((hover.x - padL) / step), 0, visible.length - 1);
    const d = visible[idx];
    const x = indexToX(idx);
    const mIdx = windowIndex(idx);
    const macdValue = macdSeries.macd[mIdx];
    const signalValue = macdSeries.signal[mIdx];
    const histValue = macdSeries.histogram[mIdx];

    ctx.strokeStyle = "rgba(214, 226, 255, 0.22)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, chartY);
    ctx.lineTo(x, lowerBottomY);
    ctx.stroke();
    if (hover.y >= chartY && hover.y <= chartY + chartH) {
      ctx.beginPath();
      ctx.moveTo(padL, hover.y);
      ctx.lineTo(width - padR, hover.y);
      ctx.stroke();
      drawAxisTag(
        ctx,
        width - padR + 3,
        hover.y,
        padR - 6,
        20,
        formatAxisPrice(yToPrice(hover.y)),
        "rgba(44, 56, 79, 0.95)",
        height,
      );
    }
    ctx.setLineDash([]);

    const parts = [
      `O ${d.open.toFixed(2)}`,
      `H ${d.high.toFixed(2)}`,
      `L ${d.low.toFixed(2)}`,
      `C ${d.close.toFixed(2)}`,
      `V ${formatVolumeShort(d.volume)}`,
    ];
    if (showMacd && Number.isFinite(macdValue) && Number.isFinite(signalValue) && Number.isFinite(histValue)) {
      parts.push(`MACD ${macdValue.toFixed(3)}`);
      parts.push(`SIG ${signalValue.toFixed(3)}`);
      parts.push(`HIST ${histValue.toFixed(3)}`);
    }
    const info = parts.join("  ");
    ctx.font = "bold 11px Inter, sans-serif";
    const boxW = Math.min(520, ctx.measureText(info).width + 18);
    ctx.fillStyle = "rgba(6, 12, 23, 0.9)";
    ctx.fillRect(padL + 8, chartY + 8, boxW, 24);
    ctx.fillStyle = COLORS.text;
    ctx.fillText(info, padL + 14, chartY + 24);

    const prev = idx > 0 ? visible[idx - 1] : null;
    const timeText = formatCandleTime(d, prev, state.timeframe);
    ctx.font = "11px Inter, sans-serif";
    const timeW = Math.max(54, ctx.measureText(timeText).width + 14);
    const boxX = clamp(x - timeW / 2, padL, width - padR - timeW);
    ctx.fillStyle = "rgba(18, 26, 39, 0.95)";
    ctx.fillRect(boxX, height - padB + 2, timeW, 16);
    ctx.fillStyle = COLORS.text;
    ctx.fillText(timeText, boxX + 7, height - padB + 14);
  }
}

function decodeFractalResolutionWindow(
  candles,
  timeframe,
  visibleCount = 0,
  indicatorWarmup = 0,
) {
  if (!Array.isArray(candles) || !candles.length) return candles;
  const barsPerSession = barsPerSyntheticSession(timeframe);
  if (barsPerSession <= 1) return candles;
  const decodeMultiplier =
    timeframe <= 1
      ? 2.8
      : timeframe <= 5
        ? 2.2
        : timeframe <= 15
          ? 1.7
          : 1.25;
  const targetDecodedBars = clamp(
    Math.floor((visibleCount + indicatorWarmup) * decodeMultiplier),
    barsPerSession * 3,
    MAX_DECODED_VISIBLE,
  );
  const decodeIndexes = new Set();
  let allocatedBars = 0;
  for (let i = candles.length - 1; i >= 0; i -= 1) {
    if (!shouldDecodeHistoricalSession(candles[i], timeframe)) continue;
    if (allocatedBars >= targetDecodedBars && allocatedBars >= visibleCount) break;
    decodeIndexes.add(i);
    allocatedBars += barsPerSession;
  }
  if (!decodeIndexes.size) return candles;
  const decoded = [];
  candles.forEach((candle, index) => {
    if (!decodeIndexes.has(index)) {
      decoded.push(candle);
      return;
    }
    decoded.push(...getCachedHistoricalSession(candle, timeframe));
  });
  return decoded;
}

function barsPerSyntheticSession(timeframe) {
  const normalized = Math.max(1, Math.floor(Number(timeframe) || 1));
  if (normalized >= SESSION_MINUTES) return 1;
  return Math.max(1, Math.floor(SESSION_MINUTES / normalized));
}

function shouldDecodeHistoricalSession(candle, timeframe) {
  if (!candle || barsPerSyntheticSession(timeframe) <= 1) return false;
  if (!Number.isFinite(candle.open) || !Number.isFinite(candle.close)) return false;
  if (!Number.isFinite(candle.high) || !Number.isFinite(candle.low)) return false;
  const isCompressedHistorical = Number(candle.day || 0) <= 0 && Number(candle.minute || 0) === 0;
  const hasRange = Math.abs(candle.high - candle.low) > 0.000001;
  return isCompressedHistorical && hasRange;
}

function getCachedHistoricalSession(candle, timeframe) {
  const key = buildHistoricalSessionCacheKey(candle, timeframe);
  if (SYNTHETIC_SESSION_CACHE.has(key)) {
    const cached = SYNTHETIC_SESSION_CACHE.get(key);
    SYNTHETIC_SESSION_CACHE.delete(key);
    SYNTHETIC_SESSION_CACHE.set(key, cached);
    return cached;
  }
  const decoded =
    decodeSessionFromCandle(candle, timeframe) ||
    decodeHistoricalSession(candle, timeframe, buildHistoricalSessionSeed(candle, timeframe));
  SYNTHETIC_SESSION_CACHE.set(key, decoded);
  if (SYNTHETIC_SESSION_CACHE.size > SYNTHETIC_SESSION_CACHE_LIMIT) {
    const oldestKey = SYNTHETIC_SESSION_CACHE.keys().next().value;
    SYNTHETIC_SESSION_CACHE.delete(oldestKey);
  }
  return decoded;
}

function buildHistoricalSessionCacheKey(candle, timeframe) {
  return [
    timeframe,
    candle.date || "",
    Number(candle.day || 0),
    Number(candle.t || 0),
    Number(candle.open || 0).toFixed(4),
    Number(candle.high || 0).toFixed(4),
    Number(candle.low || 0).toFixed(4),
    Number(candle.close || 0).toFixed(4),
    Math.round(Number(candle.volume || 0)),
    Array.isArray(candle.session) ? candle.session.join(":") : "",
  ].join("|");
}

function buildHistoricalSessionSeed(candle, timeframe) {
  const dateKey = String(candle.date || "");
  let dateHash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    dateHash = dateHash * 31 + dateKey.charCodeAt(i);
  }
  return (
    timeframe * 11.7 +
    Math.abs(Number(candle.day || 0)) * 0.173 +
    Math.abs(Number(candle.t || 0)) * 0.0091 +
    dateHash * 0.000013 +
    Number(candle.open || 0) * 0.0013 +
    Number(candle.high || 0) * 0.0009 +
    Number(candle.low || 0) * 0.0007 +
    Number(candle.close || 0) * 0.0011
  );
}

function decodeHistoricalSession(candle, timeframe, seedBase) {
  const segments = barsPerSyntheticSession(timeframe);
  const range = Math.max(0.000001, candle.high - candle.low);
  const minuteStep = Math.max(1, Math.floor(SESSION_MINUTES / segments));
  const bodyBias = clamp((candle.close - candle.open) / range, -1, 1);
  const openLoc = clamp((candle.open - candle.low) / range, 0, 1);
  const closeLoc = clamp((candle.close - candle.low) / range, 0, 1);
  const upperShadowRatio = clamp(
    (candle.high - Math.max(candle.open, candle.close)) / range,
    0,
    1,
  );
  const lowerShadowRatio = clamp(
    (Math.min(candle.open, candle.close) - candle.low) / range,
    0,
    1,
  );
  const bullish = candle.close >= candle.open;
  const lowFirstProb = clamp(
    bullish
      ? 0.54 + lowerShadowRatio * 0.18 - upperShadowRatio * 0.08
      : 0.34 + lowerShadowRatio * 0.12 - upperShadowRatio * 0.04,
    0.14,
    0.86,
  );
  const lowFirst = seededUnit(seedBase + 5.3) < lowFirstProb;
  const guideRadius = clamp(Math.round(segments * 0.11), 5, 20);
  const edgePadding = clamp(Math.round(segments * 0.08), 2, 18);
  let lowCenter = clamp(
    Math.round(
      (segments - 1) *
        seededRange(lowFirst ? 0.14 : 0.38, lowFirst ? 0.34 : 0.7, seedBase + 6.7),
    ),
    edgePadding,
    segments - 1 - edgePadding,
  );
  let highCenter = clamp(
    Math.round(
      (segments - 1) *
        seededRange(lowFirst ? 0.54 : 0.18, lowFirst ? 0.86 : 0.5, seedBase + 11.3),
    ),
    edgePadding,
    segments - 1 - edgePadding,
  );
  const minTurnGap = Math.max(guideRadius + 2, Math.floor(segments * 0.14));
  if (Math.abs(highCenter - lowCenter) < minTurnGap) {
    if (lowFirst) {
      highCenter = clamp(lowCenter + minTurnGap, edgePadding + 1, segments - 1 - edgePadding);
    } else {
      lowCenter = clamp(highCenter + minTurnGap, edgePadding, segments - 2 - edgePadding);
    }
  }
  const lowGuideLevel =
    candle.low + range * seededRange(0.008, 0.022, seedBase + 17.2);
  const highGuideLevel =
    candle.high - range * seededRange(0.008, 0.022, seedBase + 19.5);
  const controls = lowFirst
    ? [
        { x: 0, y: candle.open },
        { x: lowCenter, y: lowGuideLevel, tag: "low" },
        { x: highCenter, y: highGuideLevel, tag: "high" },
        { x: segments, y: candle.close },
      ]
    : [
        { x: 0, y: candle.open },
        { x: highCenter, y: highGuideLevel, tag: "high" },
        { x: lowCenter, y: lowGuideLevel, tag: "low" },
        { x: segments, y: candle.close },
      ];

  const samples = [{ x: controls[0].x, y: controls[0].y }];
  let carryBias = bodyBias * range * 0.00045;
  for (let c = 0; c < controls.length - 1; c += 1) {
    const start = controls[c];
    const end = controls[c + 1];
    const span = Math.max(1, end.x - start.x);
    const sampleCount = clamp(Math.round(span / 14), 2, 10);
    const xs = [];
    for (let s = 0; s < sampleCount; s += 1) {
      xs.push(
        start.x +
          seededRange(0.12, 0.88, seedBase + c * 37.1 + s * 11.3) * span,
      );
    }
    xs.sort((a, b) => a - b);
    let localBias = carryBias;
    let lastY = start.y;
    for (let s = 0; s < xs.length; s += 1) {
      const x = xs[s];
      const t = clamp((x - start.x) / span, 0, 1);
      const lineY = lerp(start.y, end.y, t);
      const taper = Math.sin(t * Math.PI);
      const intervalSigma =
        range *
        (0.0011 +
          Math.min(0.0024, span / Math.max(1, segments) * 0.0046));
      const inheritedDir = Math.sign(localBias || end.y - start.y || 1) || 1;
      const randomDir =
        seededUnit(seedBase + c * 53.7 + s * 17.9 + 29.1) <
        clamp(0.5 + inheritedDir * 0.18, 0.18, 0.82)
          ? 1
          : -1;
      const innovation =
        fractalNoise1D(seedBase + c * 19.3 + s * 0.81, seedBase + 71.1, 3, 0.58) *
        intervalSigma;
      const kick =
        randomDir *
        seededRange(0.18, 0.82, seedBase + c * 13.7 + s * 7.1 + 101.3) *
        intervalSigma;
      localBias = localBias * 0.38 + kick * 0.72 + innovation * 0.42;
      const y = clamp(
        lineY + localBias * taper,
        candle.low + range * 0.003,
        candle.high - range * 0.003,
      );
      samples.push({ x, y });
      lastY = y;
    }
    samples.push({ x: end.x, y: end.y });
    carryBias =
      (lastY - start.y) * 0.18 +
      Math.sign(end.y - lastY || localBias || 1) * range * 0.00012;
  }
  samples.sort((a, b) => a.x - b.x);

  const path = new Array(segments + 1).fill(candle.open);
  path[0] = candle.open;
  path[segments] = candle.close;
  for (let i = 1; i < segments; i += 1) {
    const base = sampleSmoothCurve(samples, i);
    const microNoise =
      fractalNoise1D(seedBase + i * 0.63, seedBase + 131.7, 2, 0.56) *
      range *
      0.00032;
    path[i] = clamp(
      base + microNoise,
      candle.low + range * 0.003,
      candle.high - range * 0.003,
    );
  }

  const bars = [];
  const energies = [];
  for (let i = 0; i < segments; i += 1) {
    const open = path[i];
    const close = path[i + 1];
    const progress = segments > 1 ? i / (segments - 1) : 1;
    const bodyHigh = Math.max(open, close);
    const bodyLow = Math.min(open, close);
    const moveStrength = Math.abs(close - open) / Math.max(range, 0.000001);
    bars.push({
      ...candle,
      t: Number(candle.t || 0) + (i + 1) / (segments + 1),
      minute: Math.min(SESSION_MINUTES - 1, i * minuteStep),
      open,
      high: bodyHigh,
      low: bodyLow,
      close,
      volume: 1,
      vwap: close,
      synthetic: true,
    });
    const lowWeight = bellCurve(i, lowCenter, guideRadius);
    const highWeight = bellCurve(i, highCenter, guideRadius);
    energies.push(
      0.78 +
        intradayVolumeCurve(progress) * 1.16 +
        moveStrength * 1.7 +
        Math.max(lowWeight, highWeight) * 0.28,
    );
  }

  const volumes = splitVolumeByEnergy(
    Math.max(1, Math.floor(candle.volume || 0)),
    energies,
  );
  const rankedVolumes = volumes
    .map((value, index) => ({ value: Math.max(1, value), index }))
    .sort((a, b) => a.value - b.value);
  const volumeRank = new Array(volumes.length).fill(0.5);
  rankedVolumes.forEach((item, rank) => {
    volumeRank[item.index] =
      rankedVolumes.length > 1 ? rank / (rankedVolumes.length - 1) : 0.5;
  });
  const avgVolume =
    volumes.reduce((acc, value) => acc + Math.max(1, value), 0) /
    Math.max(1, volumes.length);
  let pv = 0;
  let vol = 0;
  for (let i = 0; i < bars.length; i += 1) {
    const volume = Math.max(1, volumes[i]);
    bars[i].volume = volume;
    const progress = bars.length > 1 ? i / (bars.length - 1) : 1;
    const bodyHigh = Math.max(bars[i].open, bars[i].close);
    const bodyLow = Math.min(bars[i].open, bars[i].close);
    const bodyRange = Math.max(0.000001, bodyHigh - bodyLow);
    const volumeRatio = volume / Math.max(1, avgVolume);
    const rankLift = volumeRank[i];
    const volumeLift =
      1 + clamp(volumeRatio - 1, -0.4, 2.6) * 0.08 + rankLift * 0.42;
    const wickBase =
      range *
      (0.0032 +
        intradayVolatilityCurve(progress) * 0.0024 +
        Math.min(0.0062, (bodyRange / range) * 0.22) +
        rankLift * 0.0085);
    const wickNoise =
      seededRange(0.72, 2.2, seedBase + i * 1.91 + 141.7) * volumeLift;
    const wickMode = seededUnit(seedBase + i * 2.47 + 177.3);
    let upperWick = 0;
    let lowerWick = 0;
    if (wickMode < 0.31) {
      upperWick = wickBase * wickNoise;
    } else if (wickMode < 0.62) {
      lowerWick = wickBase * wickNoise;
    } else {
      upperWick = wickBase * wickNoise * seededRange(0.5, 1.05, seedBase + i * 0.77 + 203.1);
      lowerWick = wickBase * wickNoise * seededRange(0.5, 1.05, seedBase + i * 0.83 + 221.9);
    }
    bars[i].high = Math.min(candle.high, Math.max(bars[i].high, bodyHigh + upperWick));
    bars[i].low = Math.max(candle.low, Math.min(bars[i].low, bodyLow - lowerWick));
    const typical = (bars[i].high + bars[i].low + bars[i].close) / 3;
    pv += typical * volume;
    vol += volume;
    bars[i].vwap = vol > 0 ? pv / vol : bars[i].close;
  }

  const fallbackThreshold = range * 0.018;
  const pickFallbackBar = (center, mode) => {
    const start = clamp(center - guideRadius, 0, bars.length - 1);
    const end = clamp(center + guideRadius, 0, bars.length - 1);
    let bestIndex = start;
    let bestValue =
      mode === "low" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    for (let idx = start; idx <= end; idx += 1) {
      const value = mode === "low" ? bars[idx].low : bars[idx].high;
      const better = mode === "low" ? value < bestValue : value > bestValue;
      if (better) {
        bestValue = value;
        bestIndex = idx;
      }
    }
    return bestIndex;
  };
  if (!bars.some((bar) => bar.low <= candle.low + fallbackThreshold)) {
    bars[pickFallbackBar(lowCenter, "low")].low = candle.low;
  }
  if (!bars.some((bar) => bar.high >= candle.high - fallbackThreshold)) {
    bars[pickFallbackBar(highCenter, "high")].high = candle.high;
  }
  return bars;
}

function intradayVolumeCurve(progress) {
  const edge = Math.pow(Math.abs(progress - 0.5) * 2, 1.55);
  return edge;
}

function intradayVolatilityCurve(progress) {
  const edge = Math.pow(Math.abs(progress - 0.5) * 2, 1.25);
  const lunchDip = 1 - Math.exp(-Math.pow((progress - 0.5) / 0.16, 2));
  return 0.7 + edge * 0.65 + lunchDip * 0.15;
}

function bellCurve(index, center, radius) {
  const sigma = Math.max(1, radius * 0.72);
  const z = (index - center) / sigma;
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
  const m1 =
    ((p2.y - p0.y) / Math.max(0.000001, p2.x - p0.x)) * span;
  const m2 =
    ((p3.y - p1.y) / Math.max(0.000001, p3.x - p1.x)) * span;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * p1.y +
    (t3 - 2 * t2 + t) * m1 +
    (-2 * t3 + 3 * t2) * p2.y +
    (t3 - t2) * m2
  );
}

function seededRange(min, max, seed) {
  return lerp(min, max, seededUnit(seed));
}

function splitVolumeByEnergy(totalVolume, energies) {
  const safeTotal = Math.max(1, Math.floor(totalVolume));
  const sum = Math.max(
    0.000001,
    energies.reduce((acc, value) => acc + Math.max(0.000001, value), 0),
  );
  const out = new Array(energies.length).fill(1);
  let allocated = 0;
  for (let i = 0; i < energies.length; i += 1) {
    const remainingSlots = energies.length - i - 1;
    const proportional = Math.floor((safeTotal * energies[i]) / sum);
    const maxAllowed = safeTotal - allocated - remainingSlots;
    const volume = clamp(proportional, 1, Math.max(1, maxAllowed));
    out[i] = volume;
    allocated += volume;
  }
  const diff = safeTotal - allocated;
  out[out.length - 1] += diff;
  return out;
}

function fractalNoise1D(x, seed = 0, octaves = 4, persistence = 0.55) {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += valueNoise1D(x * freq + seed * 0.13 + i * 11.7, seed + i * 17.3) * amp;
    norm += amp;
    amp *= persistence;
    freq *= 2;
  }
  return norm > 0 ? sum / norm : 0;
}

function valueNoise1D(x, seed = 0) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = smoothstep01(x - x0);
  const v0 = hashNoiseSigned(x0, seed);
  const v1 = hashNoiseSigned(x1, seed);
  return v0 + (v1 - v0) * t;
}

function smoothstep01(t) {
  return t * t * (3 - 2 * t);
}

function hashNoiseSigned(x, seed = 0) {
  const n = Math.sin((x + seed) * 127.1 + seed * 311.7) * 43758.5453123;
  const fractPart = n - Math.floor(n);
  return fractPart * 2 - 1;
}

function seededUnit(seed) {
  const n = Math.sin(seed * 97.31 + 13.17) * 43758.5453123;
  return n - Math.floor(n);
}

function drawSeriesLine(ctx, visible, indexToX, windowIndex, series, yMap, color) {
  ctx.beginPath();
  let started = false;
  visible.forEach((_, i) => {
    const value = series[windowIndex(i)];
    if (!Number.isFinite(value)) return;
    const x = indexToX(i);
    const y = yMap(value);
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

function buildPriceScale(candles, mode) {
  const lows = candles.map((item) => item.low).filter((value) => Number.isFinite(value));
  const highs = candles.map((item) => item.high).filter((value) => Number.isFinite(value));
  const rawMin = Math.min(...lows);
  const rawMax = Math.max(...highs);

  if (mode === "log") {
    const minPrice = Math.max(0.01, rawMin);
    const maxPrice = Math.max(minPrice * 1.015, rawMax);
    let minScaled = Math.log(minPrice);
    let maxScaled = Math.log(maxPrice);
    const pad = (maxScaled - minScaled) * 0.12;
    minScaled -= pad;
    maxScaled += pad;
    const spanScaled = Math.max(0.000001, maxScaled - minScaled);
    return {
      minScaled,
      maxScaled,
      spanScaled,
      toScaled: (value) => Math.log(Math.max(value, 0.01)),
      fromScaled: (value) => Math.exp(value),
    };
  }

  const minPrice = Math.max(0.01, rawMin);
  const maxPrice = Math.max(minPrice + 0.01, rawMax);
  const pad = (maxPrice - minPrice) * 0.1;
  const minScaled = Math.max(0.01, minPrice - pad);
  const maxScaled = maxPrice + pad;
  const spanScaled = Math.max(0.000001, maxScaled - minScaled);
  return {
    minScaled,
    maxScaled,
    spanScaled,
    toScaled: (value) => value,
    fromScaled: (value) => value,
  };
}

function buildMacdRange(macdSeries, visibleStartIndex, visibleLength, autoScale) {
  const source = [];
  const start = autoScale ? visibleStartIndex : 0;
  const end = autoScale
    ? Math.min(macdSeries.macd.length, visibleStartIndex + visibleLength)
    : macdSeries.macd.length;
  for (let i = start; i < end; i += 1) {
    const m = macdSeries.macd[i];
    const s = macdSeries.signal[i];
    const h = macdSeries.histogram[i];
    if (Number.isFinite(m)) source.push(Math.abs(m));
    if (Number.isFinite(s)) source.push(Math.abs(s));
    if (Number.isFinite(h)) source.push(Math.abs(h));
  }
  const maxAbs = Math.max(...source, 0.0001);
  const edge = maxAbs * 1.25;
  return {
    min: -edge,
    max: edge,
    span: edge * 2,
  };
}

function buildContinuousVwap(series) {
  const out = [];
  let pv = 0;
  let vol = 0;
  for (const candle of series) {
    const volume = Math.max(0, Number(candle.volume) || 0);
    const typical = (candle.high + candle.low + candle.close) / 3;
    pv += typical * volume;
    vol += volume;
    out.push(vol > 0 ? pv / vol : candle.close);
  }
  return out;
}

function normalizeIndicators(config = {}) {
  const defaults = {
    ma20: { enabled: true, period: 20 },
    ma50: { enabled: true, period: 50 },
    vwap: { enabled: true },
    macd: { enabled: true, fast: 12, slow: 26, signal: 9 },
  };
  return {
    ma20: {
      ...defaults.ma20,
      ...(config.ma20 || {}),
      enabled: config.ma20 ? config.ma20.enabled !== false : defaults.ma20.enabled,
    },
    ma50: {
      ...defaults.ma50,
      ...(config.ma50 || {}),
      enabled: config.ma50 ? config.ma50.enabled !== false : defaults.ma50.enabled,
    },
    vwap: {
      ...defaults.vwap,
      ...(config.vwap || {}),
      enabled: config.vwap ? config.vwap.enabled !== false : defaults.vwap.enabled,
    },
    macd: {
      ...defaults.macd,
      ...(config.macd || {}),
      enabled: config.macd ? config.macd.enabled !== false : defaults.macd.enabled,
    },
  };
}

function calcMacd(values, settings) {
  const fastPeriod = clamp(Math.floor(Number(settings?.fast) || 12), 2, 120);
  const slowPeriod = clamp(Math.floor(Number(settings?.slow) || 26), fastPeriod + 1, 240);
  const signalPeriod = clamp(Math.floor(Number(settings?.signal) || 9), 2, 120);

  const emaFast = emaSeries(values, fastPeriod);
  const emaSlow = emaSeries(values, slowPeriod);
  const macd = values.map((_, idx) => {
    if (!Number.isFinite(emaFast[idx]) || !Number.isFinite(emaSlow[idx])) return null;
    return emaFast[idx] - emaSlow[idx];
  });
  const signal = emaSeries(macd, signalPeriod);
  const histogram = values.map((_, idx) => {
    if (!Number.isFinite(macd[idx]) || !Number.isFinite(signal[idx])) return null;
    return macd[idx] - signal[idx];
  });
  return { macd, signal, histogram };
}

function emaSeries(values, period) {
  const result = [];
  const k = 2 / (period + 1);
  let ema = null;
  values.forEach((value) => {
    if (!Number.isFinite(value)) {
      result.push(null);
      return;
    }
    if (ema == null) {
      ema = value;
    } else {
      ema = value * k + ema * (1 - k);
    }
    result.push(ema);
  });
  return result;
}

function drawAxisTag(ctx, x, y, w, h, label, color, canvasHeight) {
  const boxY = clamp(y - h / 2, 0, canvasHeight - h);
  ctx.fillStyle = color;
  ctx.fillRect(x, boxY, w, h);
  ctx.fillStyle = "#09101b";
  ctx.font = "bold 11px Inter, sans-serif";
  ctx.fillText(label, x + 8, boxY + h / 2 + 4);
}

function formatAxisPrice(price) {
  if (!Number.isFinite(price)) return "-";
  if (Math.abs(price) >= 1000) return price.toFixed(2);
  if (Math.abs(price) >= 100) return price.toFixed(2);
  if (Math.abs(price) >= 10) return price.toFixed(3);
  return price.toFixed(4);
}

function formatVolumeShort(volume) {
  if (!Number.isFinite(volume) || volume <= 0) return "0";
  if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(2)}B`;
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)}K`;
  return `${Math.round(volume)}`;
}

function formatCandleTime(candle, previous, timeframe) {
  if (!candle) return "";
  const currentDate = parseCandleDateParts(candle);
  const prevDate = parseCandleDateParts(previous);
  const monthDayLabel = currentDate
    ? `${String(currentDate.month).padStart(2, "0")}/${String(currentDate.day).padStart(2, "0")}`
    : `Day ${candle.day}`;

  if (!previous || previous.day !== candle.day) {
    if (currentDate && (!prevDate || prevDate.year !== currentDate.year)) {
      return `${currentDate.year}/${String(currentDate.month).padStart(2, "0")}`;
    }
    return monthDayLabel;
  }

  if (timeframe >= 390) {
    if (currentDate && prevDate && prevDate.year !== currentDate.year) {
      return `${currentDate.year}/${String(currentDate.month).padStart(2, "0")}`;
    }
    return monthDayLabel;
  }

  const totalMinutes = 570 + candle.minute;
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function parseCandleDateParts(candle) {
  if (!candle || typeof candle.date !== "string") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candle.date)) return null;
  const [year, month, day] = candle.date.split("-").map((part) => Number(part));
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  return { year, month, day };
}
