import { fmtPct } from "../../simulator/utils";

export function BottomTickerBar({ state }) {
  const items = state.assetList.slice(0, 8).map((symbol) => state.assets[symbol]);

  return (
    <footer className="bottom-ticker">
      <div className="bottom-left">
        <span className="status-dot" />
        <span>Stable connection</span>
      </div>
      <div className="bottom-scroll">
        {items.map((asset) => (
          <div className="bottom-item" key={asset.symbol}>
            <span className="bottom-symbol">{asset.symbol}</span>
            <span className={`mono ${asset.changePct >= 0 ? "good" : "bad"}`}>{fmtPct(asset.changePct)}</span>
            <span className="muted mono">{asset.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="bottom-links">
        <span>Announcements</span>
        <span>Risk Rules</span>
        <span>API Docs</span>
      </div>
    </footer>
  );
}
