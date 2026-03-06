import { SECTORS } from "../../simulator/constants";
import { fmtPct } from "../../simulator/utils";

export function WatchlistPanel({ engine, state }) {
  const grouped = {};
  state.assetList.forEach((symbol) => {
    const asset = state.assets[symbol];
    if (!grouped[asset.sector]) grouped[asset.sector] = [];
    grouped[asset.sector].push(asset);
  });

  return (
    <aside className={`watchlist-panel ${state.watchlistPinned ? "expanded" : ""}`}>
      <div className="watch-header">
        <div className="text">
          <div className="panel-title">Markets</div>
          <div className="panel-sub">Stock universe</div>
        </div>
        <button
          className={`mini-btn ${state.watchlistPinned ? "active" : ""}`}
          onClick={() => engine.toggleWatchlistPinned()}
          title="Pin"
        >
          PIN
        </button>
      </div>
      <div className="watch-scroll scroll">
        {Object.keys(grouped).map((sector) => (
          <div className="watch-group" key={sector}>
            <div className="watch-group-title">{SECTORS[sector].name}</div>
            {grouped[sector].map((asset) => (
              <button
                type="button"
                className={`watch-item ${asset.symbol === state.selected ? "active" : ""}`}
                key={asset.symbol}
                onClick={() => engine.setSelectedSymbol(asset.symbol)}
              >
                <div className="watch-pill" />
                <div className="info">
                  <div className="watch-symbol">{asset.symbol}</div>
                  <div className="watch-name">{asset.name}</div>
                </div>
                <div className={`pricebox watch-price ${asset.changePct >= 0 ? "good" : "bad"}`}>
                  <div className="mono">{asset.price.toFixed(2)}</div>
                  <div className="watch-name">{fmtPct(asset.changePct)}</div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
