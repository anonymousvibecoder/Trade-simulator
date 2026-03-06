import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { SECTORS } from "../../simulator/constants";
import { drawTradingChart } from "../../simulator/chart";
import { fmtMoney, fmtPct } from "../../simulator/utils";
import { StockNewsPanel } from "./StockNewsPanel";
import { StockInfoPanel } from "./StockInfoPanel";

const TIMEFRAME_OPTIONS = [
  { label: "1m", value: 1 },
  { label: "5m", value: 5 },
  { label: "15m", value: 15 },
  { label: "30m", value: 30 },
  { label: "1h", value: 60 },
  { label: "2h", value: 120 },
  { label: "4h", value: 240 },
  { label: "8h", value: 480 },
  { label: "12h", value: 720 },
  { label: "24h", value: 1440 },
  { label: "1W", value: 1950 },
  { label: "1D", value: 390 },
];

const INDICATOR_DEFS = [
  { id: "ma20" },
  { id: "ma50" },
  { id: "vwap" },
  { id: "macd" },
];

const WORKSPACE_TABS = [
  { id: "chart" },
  { id: "profile" },
  { id: "news" },
  { id: "trading" },
];

export function ChartPanel({ engine, state, version }) {
  const { t, get } = useI18n();
  const canvasRef = useRef(null);
  const dragRef = useRef({ active: false, lastX: 0, pixelCarry: 0 });
  const indicatorMenuRef = useRef(null);
  const overlayEditorRef = useRef(null);
  const [hover, setHover] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [indicatorMenuOpen, setIndicatorMenuOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState(null);
  const [activeWorkspace, setActiveWorkspace] = useState("chart");

  const workspaceTabs = useMemo(
    () =>
      WORKSPACE_TABS.map((tab) => ({
        ...tab,
        label: t(`chartPanel.tabs.${tab.id}`),
      })),
    [t],
  );
  const workspaceSubtitle = useMemo(
    () =>
      Object.fromEntries(
        WORKSPACE_TABS.map((tab) => [tab.id, t(`chartPanel.subtitle.${tab.id}`)]),
      ),
    [t],
  );
  const workspaceTodo = useMemo(
    () => ({
      profile: get("chartPanel.placeholder.todo.profile", []),
      news: get("chartPanel.placeholder.todo.news", []),
      trading: get("chartPanel.placeholder.todo.trading", []),
    }),
    [get],
  );

  const asset = state.assets[state.selected];
  const position = engine.getCurrentPosition(asset.symbol);
  const micro = asset.micro;
  const candles = useMemo(
    () => engine.aggregateCandles(asset, state.timeframe),
    [engine, asset, state.timeframe, version],
  );
  const lastCandle = candles[candles.length - 1] || null;
  const timeframeLabel = labelForTimeframe(state.timeframe);
  const isLogScale = state.chartScale === "log";
  const isAutoScale = state.chartAutoScale !== false;
  const indicators = normalizeIndicators(state.chartIndicators);
  const activeIndicators = INDICATOR_DEFS.filter((item) => indicators[item.id].enabled);

  const pills = [
    <span className="badge neutral" key="spread">
      {t("chartPanel.badges.spread", { value: asset.spreadBps.toFixed(1) })}
    </span>,
    <span className="badge neutral" key="borrow">
      {t("chartPanel.badges.borrow", { value: (asset.borrow * 100).toFixed(1) })}
    </span>,
  ];
  if (position) {
    pills.push(
      <span className={`badge ${position.qty > 0 ? "blue" : "warn"}`} key="position">
        {position.qty > 0 ? t("chartPanel.badges.long") : t("chartPanel.badges.short")} {Math.abs(position.qty)} @{" "}
        {position.avg.toFixed(2)}
      </span>,
    );
  }

  useEffect(() => {
    if (activeWorkspace !== "chart") return;
    drawTradingChart({ canvas: canvasRef.current, engine, hover });
  }, [activeWorkspace, engine, hover, version, state.selected, state.timeframe]);

  useEffect(() => {
    if (activeWorkspace !== "chart") return undefined;
    const handler = () => drawTradingChart({ canvas: canvasRef.current, engine, hover });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [activeWorkspace, engine, hover]);

  useEffect(() => {
    if (activeWorkspace !== "chart") return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const onWheelZoom = (event) => {
      event.preventDefault();
      event.stopPropagation();
      engine.adjustChartZoom(event.deltaY);
    };
    canvas.addEventListener("wheel", onWheelZoom, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheelZoom);
  }, [activeWorkspace, engine]);

  useEffect(() => {
    if (activeWorkspace !== "chart") return undefined;
    if (!isDragging) return undefined;
    const stopDrag = () => {
      dragRef.current.active = false;
      dragRef.current.pixelCarry = 0;
      setIsDragging(false);
    };
    const onWindowMove = (event) => {
      const drag = dragRef.current;
      if (!drag.active) return;
      drag.pixelCarry += event.clientX - drag.lastX;
      drag.lastX = event.clientX;
      const bars = Math.trunc(drag.pixelCarry / 8);
      if (bars !== 0) {
        engine.shiftChartOffset(bars);
        drag.pixelCarry -= bars * 8;
      }
    };
    window.addEventListener("mousemove", onWindowMove);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onWindowMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [activeWorkspace, engine, isDragging]);

  useEffect(() => {
    if (activeWorkspace !== "chart") return undefined;
    if (!indicatorMenuOpen && !editingIndicator) return undefined;
    const onOutsideClick = (event) => {
      const target = event.target;
      if (
        indicatorMenuRef.current &&
        indicatorMenuRef.current.contains(target)
      ) {
        return;
      }
      if (
        overlayEditorRef.current &&
        overlayEditorRef.current.contains(target)
      ) {
        return;
      }
      setIndicatorMenuOpen(false);
      setEditingIndicator(null);
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [activeWorkspace, indicatorMenuOpen, editingIndicator]);

  useEffect(() => {
    if (activeWorkspace === "chart") return;
    dragRef.current.active = false;
    dragRef.current.pixelCarry = 0;
    if (isDragging) setIsDragging(false);
    setHover({ x: null, y: null });
    setIndicatorMenuOpen(false);
    setEditingIndicator(null);
  }, [activeWorkspace, isDragging]);

  const handleIndicatorToggle = (id) => {
    const indicator = indicators[id];
    engine.setChartIndicatorEnabled(id, !indicator.enabled);
  };

  return (
    <article className="panel chart-panel">
      <div className="panel-header chart-panel-header">
        <div className="chart-workspace-tabs" role="tablist" aria-label={t("chartPanel.aria.workspaceTabs")}>
          {workspaceTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeWorkspace === tab.id}
              className={`chart-workspace-tab ${activeWorkspace === tab.id ? "active" : ""}`}
              onClick={() => setActiveWorkspace(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="panel-sub">{workspaceSubtitle[activeWorkspace]}</div>
      </div>

      <div className="panel-body">
        {activeWorkspace === "chart" ? (
          <div className="chart-workspace-chart">
            <div className="chart-meta-bar">
              <div className="chart-instrument">
                <div className="chart-symbol-stack">
                  <div className="chart-symbol-main">{asset.symbol}</div>
                  <div className="chart-symbol-sub">{asset.name}</div>
                </div>
                <span className={`badge ${SECTORS[asset.sector].tone}`}>{SECTORS[asset.sector].name}</span>
                <span className="badge neutral mono">{timeframeLabel}</span>
                <span className="chart-price-main mono">{fmtMoney(asset.price)}</span>
                <span className={`badge mono ${asset.changePct >= 0 ? "good" : "bad"}`}>{fmtPct(asset.changePct)}</span>
                {state.chartOffset > 0 ? (
                  <span className="badge neutral mono">
                    {t("chartPanel.badges.history", { bars: state.chartOffset })}
                  </span>
                ) : null}
              </div>
              {lastCandle ? (
                <div className="chart-ohlcv mono">
                  <span className="chart-kv">
                    <span className="chart-kv-label">{t("chartPanel.ohlcv.open")}</span>
                    <span>{lastCandle.open.toFixed(2)}</span>
                  </span>
                  <span className="chart-kv">
                    <span className="chart-kv-label">{t("chartPanel.ohlcv.high")}</span>
                    <span>{lastCandle.high.toFixed(2)}</span>
                  </span>
                  <span className="chart-kv">
                    <span className="chart-kv-label">{t("chartPanel.ohlcv.low")}</span>
                    <span>{lastCandle.low.toFixed(2)}</span>
                  </span>
                  <span className="chart-kv">
                    <span className="chart-kv-label">{t("chartPanel.ohlcv.close")}</span>
                    <span>{lastCandle.close.toFixed(2)}</span>
                  </span>
                  <span className="chart-kv">
                    <span className="chart-kv-label">{t("chartPanel.ohlcv.volume")}</span>
                    <span>{fmtCompactVol(lastCandle.volume)}</span>
                  </span>
                </div>
              ) : null}
            </div>

            <div className="chart-tools-bar">
              <div className="chart-indicator-row">
                {pills}
                <div className="indicator-manager" ref={indicatorMenuRef}>
                  <button
                    className={`mini-btn ${indicatorMenuOpen ? "active" : ""}`}
                    onClick={() => setIndicatorMenuOpen((open) => !open)}
                  >
                    {t("chartPanel.controls.indicators")}
                  </button>
                  {indicatorMenuOpen ? (
                    <div className="indicator-popover">
                      {INDICATOR_DEFS.map((item) => (
                        <label key={item.id} className="indicator-pop-item">
                          <span>{t(`chartPanel.indicatorMenu.${item.id}`)}</span>
                          <input
                            type="checkbox"
                            checked={indicators[item.id].enabled}
                            onChange={() => handleIndicatorToggle(item.id)}
                          />
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button
                  className={`mini-btn ${isLogScale ? "active" : ""}`}
                  onClick={() => engine.setChartScale(isLogScale ? "linear" : "log")}
                >
                  {t("chartPanel.controls.log")}
                </button>
                <button
                  className={`mini-btn ${isAutoScale ? "active" : ""}`}
                  onClick={() => engine.setChartAutoScale(!isAutoScale)}
                >
                  {t("chartPanel.controls.autoScale")}
                </button>
                <button className="mini-btn" onClick={() => engine.jumpChartBySessions(1)}>
                  {t("chartPanel.controls.prev1D")}
                </button>
                <button className="mini-btn" onClick={() => engine.jumpChartBySessions(-1)}>
                  {t("chartPanel.controls.next1D")}
                </button>
                <button className="mini-btn" onClick={() => engine.jumpChartToLatest()}>
                  {t("chartPanel.controls.latest")}
                </button>
              </div>
              <div className="chart-scale-row">
                <span className="badge neutral mono">
                  {t("chartPanel.badges.zoom", { value: (state.chartZoom ?? 1).toFixed(2) })}
                </span>
                <button className="mini-btn" onClick={() => engine.resetChartZoom()}>
                  {t("chartPanel.controls.resetZoom")}
                </button>
                {TIMEFRAME_OPTIONS.map((timeframe) => (
                  <button
                    key={timeframe.label}
                    className={`mini-btn ${state.timeframe === timeframe.value ? "active" : ""}`}
                    onClick={() => engine.setTimeframe(timeframe.value)}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="chart-canvas-wrap">
              <div className="chart-overlay-indicators">
                {activeIndicators.map((item) => (
                  <div className="chart-overlay-item" key={item.id}>
                    <span className="chart-overlay-label">{indicatorLabel(item.id, indicators[item.id], t)}</span>
                    <div className="chart-overlay-actions">
                      <button
                        type="button"
                        onClick={() => setEditingIndicator(item.id)}
                      >
                        {t("chartPanel.actions.settings")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          engine.removeChartIndicator(item.id);
                          if (editingIndicator === item.id) setEditingIndicator(null);
                        }}
                      >
                        {t("chartPanel.actions.remove")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingIndicator ? (
                <div className="chart-overlay-editor" ref={overlayEditorRef}>
                  {editingIndicator === "ma20" || editingIndicator === "ma50" ? (
                    <>
                      <div className="chart-overlay-editor-title">
                        {editingIndicator === "ma20"
                          ? t("chartPanel.indicatorEditor.maFastSettings")
                          : t("chartPanel.indicatorEditor.maSlowSettings")}
                      </div>
                      <label className="chart-overlay-editor-field">
                        <span>{t("chartPanel.indicatorEditor.period")}</span>
                        <input
                          type="number"
                          min="2"
                          max="400"
                          step="1"
                          value={indicators[editingIndicator].period}
                          onChange={(event) =>
                            engine.setChartIndicatorPeriod(editingIndicator, Number(event.target.value))
                          }
                        />
                      </label>
                    </>
                  ) : null}
                  {editingIndicator === "macd" ? (
                    <>
                      <div className="chart-overlay-editor-title">{t("chartPanel.indicatorEditor.macdSettings")}</div>
                      <label className="chart-overlay-editor-field">
                        <span>{t("chartPanel.indicatorEditor.fast")}</span>
                        <input
                          type="number"
                          min="2"
                          max="120"
                          step="1"
                          value={indicators.macd.fast}
                          onChange={(event) => engine.setMacdSettings({ fast: Number(event.target.value) })}
                        />
                      </label>
                      <label className="chart-overlay-editor-field">
                        <span>{t("chartPanel.indicatorEditor.slow")}</span>
                        <input
                          type="number"
                          min="3"
                          max="240"
                          step="1"
                          value={indicators.macd.slow}
                          onChange={(event) => engine.setMacdSettings({ slow: Number(event.target.value) })}
                        />
                      </label>
                      <label className="chart-overlay-editor-field">
                        <span>{t("chartPanel.indicatorEditor.signal")}</span>
                        <input
                          type="number"
                          min="2"
                          max="120"
                          step="1"
                          value={indicators.macd.signal}
                          onChange={(event) => engine.setMacdSettings({ signal: Number(event.target.value) })}
                        />
                      </label>
                    </>
                  ) : null}
                  {editingIndicator === "vwap" ? (
                    <>
                      <div className="chart-overlay-editor-title">{t("chartPanel.indicatorEditor.vwap")}</div>
                      <div className="chart-overlay-editor-note">{t("chartPanel.indicatorEditor.vwapNote")}</div>
                    </>
                  ) : null}
                  <div className="chart-overlay-editor-actions">
                    <button type="button" className="mini-btn" onClick={() => setEditingIndicator(null)}>
                      {t("chartPanel.actions.close")}
                    </button>
                  </div>
                </div>
              ) : null}

              <canvas
                ref={canvasRef}
                className={`chart-canvas ${isDragging ? "dragging" : ""}`}
                onMouseDown={(event) => {
                  if (event.button !== 0) return;
                  event.preventDefault();
                  dragRef.current.active = true;
                  dragRef.current.lastX = event.clientX;
                  dragRef.current.pixelCarry = 0;
                  setIsDragging(true);
                }}
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  setHover({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                }}
                onMouseLeave={() => {
                  setHover({ x: null, y: null });
                }}
              />
            </div>
          </div>
        ) : activeWorkspace === "profile" ? (
          <StockInfoPanel asset={asset} calendarDate={state.calendarDate} />
        ) : activeWorkspace === "news" ? (
          <StockNewsPanel engine={engine} state={state} asset={asset} />
        ) : activeWorkspace === "trading" ? (
          <div className="chart-workspace-insights">
            <div className="workspace-insight-panels single">
              <section className="workspace-insight-panel">
                <div className="workspace-insight-title">Execution Surface</div>
                <div className="workspace-metric-grid">
                  <MetricCard label="Micro Drift" value={fmtSignedPercent((micro?.surface?.drift || 0) * 100)} tone={toneForSignal(micro?.surface?.drift)} />
                  <MetricCard label="Vol Mult" value={`${Number(micro?.surface?.volMultiplier || 1).toFixed(2)}x`} tone={toneForSignal(-(Number(micro?.surface?.volMultiplier || 1) - 1))} />
                  <MetricCard label="Borrow" value={`${(asset.borrow * 100).toFixed(2)}%`} tone={toneForSignal(-(asset.borrow - (asset.baseBorrow || asset.borrow)))} />
                  <MetricCard label="Spread Adj" value={`${Number(micro?.surface?.spreadBpsAdj || 0).toFixed(2)} bps`} tone={toneForSignal(-(micro?.surface?.spreadBpsAdj || 0))} />
                  <MetricCard label="Liquidity Adj" value={fmtSignedNumber(micro?.surface?.liquidityAdj)} tone={toneForSignal(micro?.surface?.liquidityAdj)} />
                  <MetricCard label="Live Spread" value={`${asset.spreadBps.toFixed(2)} bps`} tone={toneForSignal(-asset.spreadBps)} />
                </div>
                <div className="workspace-execution-note">
                  Intraday execution now reflects monthly micro state through drift, volatility, spread, liquidity, and borrow.
                </div>
              </section>
              <section className="workspace-insight-panel">
                <div className="workspace-insight-title">Book Context</div>
                <div className="workspace-component-list">
                  <ComponentRow label="Position" value={position ? Math.abs(position.qty) : 0} suffix={position ? (position.qty > 0 ? " long" : " short") : ""} raw />
                  <ComponentRow label="Avg" value={position?.avg || asset.price} suffix="" raw />
                  <ComponentRow label="Mark" value={asset.price} suffix="" raw />
                  <ComponentRow label="Change" value={asset.changePct} suffix="%" raw />
                  <ComponentRow label="Last Vol" value={asset.lastVolume} suffix="" raw />
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="chart-workspace-placeholder">
            <div className="workspace-placeholder-card">
              <div className="workspace-placeholder-title">
                {workspaceTabs.find((tab) => tab.id === activeWorkspace)?.label}
              </div>
              <div className="workspace-placeholder-body">
                {t("chartPanel.placeholder.notWired")}
              </div>
              <ul className="workspace-placeholder-list">
                {workspaceTodo[activeWorkspace].map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function MetricCard({ label, value, tone, compact = false }) {
  return (
    <div className={`workspace-metric-card ${tone || "neutral"} ${compact ? "compact" : ""}`}>
      <span className="workspace-metric-label">{label}</span>
      <strong className="workspace-metric-value">{value}</strong>
    </div>
  );
}

function ComponentRow({ label, value, invert = false, suffix = "", raw = false }) {
  const numeric = Number(value || 0);
  const toneValue = invert ? -numeric : numeric;
  return (
    <div className="workspace-component-row">
      <span>{label}</span>
      <strong className={toneClass(toneForSignal(toneValue))}>
        {raw ? formatRawValue(numeric) : fmtSignedNumber(numeric)}
        {suffix}
      </strong>
    </div>
  );
}

function fmtSignedNumber(value) {
  const parsed = Number(value || 0);
  const sign = parsed > 0 ? "+" : "";
  return `${sign}${parsed.toFixed(2)}`;
}

function fmtSignedPercent(value) {
  const parsed = Number(value || 0);
  const sign = parsed > 0 ? "+" : "";
  return `${sign}${parsed.toFixed(2)}%`;
}

function formatRawValue(value) {
  if (!Number.isFinite(value)) return "0.00";
  if (Math.abs(value) >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return value.toFixed(2);
}

function toneForSignal(value) {
  const parsed = Number(value || 0);
  if (parsed > 0.15) return "good";
  if (parsed < -0.15) return "bad";
  return "neutral";
}

function toneClass(tone) {
  if (tone === "good") return "tone-good";
  if (tone === "bad") return "tone-bad";
  return "tone-neutral";
}

function fmtCompactVol(value) {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

function labelForTimeframe(minutes) {
  const option = TIMEFRAME_OPTIONS.find((item) => item.value === minutes);
  if (option) return option.label;
  return `${minutes}m`;
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

function indicatorLabel(id, config, t) {
  if (id === "ma20") return `MA ${config.period}`;
  if (id === "ma50") return `MA ${config.period}`;
  if (id === "vwap") return t("chartPanel.indicatorMenu.vwap");
  if (id === "macd") return `MACD ${config.fast}/${config.slow}/${config.signal}`;
  return id.toUpperCase();
}
