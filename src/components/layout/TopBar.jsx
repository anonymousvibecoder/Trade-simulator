import { useMemo, useState } from "react";
import { fmtMoney, timeLabel } from "../../simulator/utils";

function tabButtonClass(state, tab) {
  return `tab-btn ${state.selectedTab === tab ? "active" : ""}`;
}

function speedButtonClass(state, speed) {
  return `speed-btn ${state.speed === speed && !state.paused ? "active" : ""}`;
}

export function TopBar({ engine, state }) {
  const [marketQuery, setMarketQuery] = useState("");
  const equity = engine.getEquity();
  const usedMargin = engine.getUsedMargin();
  const health = engine.getMarginHealth();
  const selectedAsset = state.assets[state.selected];

  const filteredAssets = useMemo(() => {
    const q = marketQuery.trim().toLowerCase();
    const list = state.assetList.map((symbol) => state.assets[symbol]);
    const sorted = [...list].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
    if (!q) return sorted;
    return sorted.filter((asset) => {
      return asset.symbol.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q);
    });
  }, [marketQuery, state.assetList, state.assets]);

  return (
    <header className="topbar">
      <div className="top-left">
        <div className="brand brand-inline">
          <div className="brand-mark" aria-hidden="true" />
          <div className="brand-copy">
            <div className="title">Market Pulse Desk</div>
            <div className="sub brand-sub">Leveraged Trading Simulator</div>
          </div>
        </div>

        {selectedAsset ? (
          <div className="pair-popover">
            <div className="pair-box">
              <div className="pair-symbol">
                {selectedAsset.symbol} - {selectedAsset.name}
              </div>
              <div className={`pair-price mono ${selectedAsset.changePct >= 0 ? "good" : "bad"}`}>
                {selectedAsset.price.toFixed(2)}
              </div>
            </div>
            <div className="market-popover">
              <div className="market-pop-search">
                <input
                  className="market-search-input"
                  type="text"
                  placeholder="Search symbol"
                  value={marketQuery}
                  onChange={(e) => setMarketQuery(e.target.value)}
                />
              </div>
              <div className="market-pop-tabs">
                <button className="market-mini-tab">Favorites</button>
                <button className="market-mini-tab active">Stocks</button>
                <button className="market-mini-tab">Sectors</button>
                <button className="market-mini-tab">All</button>
              </div>
              <div className="market-table-head">
                <span>Symbol</span>
                <span className="mono">Last Price</span>
                <span className="mono">24h Chg</span>
                <span className="mono">Volume</span>
              </div>
              <div className="market-pop-list scroll">
                {filteredAssets.map((asset) => (
                  <button
                    type="button"
                    key={asset.symbol}
                    className={`market-row ${asset.symbol === state.selected ? "active" : ""}`}
                    onClick={() => engine.setSelectedSymbol(asset.symbol)}
                  >
                    <div className="market-col-symbol">
                      <span className="market-star">{asset.symbol === state.selected ? "*" : "."}</span>
                      <div>
                        <div className="market-symbol-main">{asset.symbol}</div>
                        <div className="market-symbol-sub muted">{asset.name}</div>
                      </div>
                    </div>
                    <div className="mono">{asset.price.toFixed(2)}</div>
                    <div className={`mono ${asset.changePct >= 0 ? "good" : "bad"}`}>{asset.changePct.toFixed(2)}%</div>
                    <div className="mono muted">{fmtCompactVol(asset.dayVol || asset.lastVolume || 0)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <nav className="main-tabs" aria-label="Main Tabs">
          <button className={tabButtonClass(state, "invest")} onClick={() => engine.setTab("invest")} title="Invest">
            INV
          </button>
          <button className={tabButtonClass(state, "news")} onClick={() => engine.setTab("news")} title="News">
            NWS
          </button>
          <button className={tabButtonClass(state, "community")} onClick={() => engine.setTab("community")} title="Community">
            COM
          </button>
          <button className="ghost-btn nav-accent" onClick={() => engine.resetState(true)} title="New Scenario">
            NEW
          </button>
        </nav>
      </div>

      <div className="topbox top-metrics-box">
        <div className="top-metrics">
          <Metric label="Time" value={timeLabel(state.day, state.marketMinute, state.calendarDate)} mono />
          <Metric label="Regime" value={state.scenario.regime.name} />
          <Metric label="Equity" value={fmtMoney(equity)} mono tone={equity >= 100000 ? "good" : "bad"} />
          <Metric label="Cash" value={fmtMoney(state.cash)} mono tone={state.cash >= 0 ? "good" : "bad"} />
          <Metric label="Used Margin" value={fmtMoney(usedMargin, 0)} mono tone={usedMargin > equity * 0.75 ? "warn" : "blue"} />
        </div>
      </div>

      <div className="topbox speed-box">
        <div className="speed-meta">
          <div className="metric-label">Playback</div>
          <div className="sub">
            {state.paused ? "Paused" : `${state.speed}x`} - {state.autoSlow ? "Auto Slow ON" : "Auto Slow OFF"}
          </div>
        </div>
        <div className="speed-wrap">
          {[1, 4, 16, 48].map((speed) => (
            <button
              key={speed}
              className={speedButtonClass(state, speed)}
              onClick={() => engine.setSpeed(speed)}
            >
              {speed}x
            </button>
          ))}
          <button className="ghost-btn" id="pauseBtn" onClick={() => engine.togglePause()}>
            Pause
          </button>
          <button className="ghost-btn gold" id="jumpBtn" onClick={() => engine.jumpToNextCatalyst()}>
            Jump
          </button>
          <span className={`badge ${health > 2 ? "good" : health > 1.2 ? "warn" : "bad"}`}>
            Health {health === 999 ? "999" : health.toFixed(2)}
          </span>
        </div>
      </div>
    </header>
  );
}

function fmtCompactVol(value) {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(Math.round(value));
}

function Metric({ label, value, mono = false, tone = "" }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${mono ? "mono" : ""} ${tone}`.trim()}>{value}</div>
    </div>
  );
}
