import { SECTORS } from "../../simulator/constants";
import { clamp, fmtPct } from "../../simulator/utils";

export function MarketTapePanel({ engine, state }) {
  const sectorAverages = engine.getSectorAverages();
  const symbolMaxAbs = Math.max(
    1.5,
    ...state.assetList.map((symbol) => Math.abs(state.assets[symbol].changePct)),
  );
  const sectorMaxAbs = Math.max(
    1.5,
    ...Object.values(sectorAverages).map((value) => Math.abs(value)),
  );

  return (
    <article className="panel ticker-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Order Flow Snapshot</div>
          <div className="panel-sub">Sector pulse and symbol momentum</div>
        </div>
      </div>
      <div className="panel-body">
        <div className="market-tape scroll">
          {Object.keys(SECTORS).map((key) => {
            const value = sectorAverages[key];
            const width = clamp(Math.abs(value) / sectorMaxAbs, 0.08, 1) * 100;
            return (
              <div className="tape-item sector" key={key}>
                <div className="tape-head">
                  <span>{SECTORS[key].name}</span>
                  <span className={`${value >= 0 ? "good" : "bad"} mono`}>{fmtPct(value)}</span>
                </div>
                <div className="tape-track">
                  <div
                    className="tape-fill"
                    style={{
                      width: `${width}%`,
                      background:
                        value >= 0
                          ? "linear-gradient(90deg, rgba(41,201,132,.28), rgba(41,201,132,.96))"
                          : "linear-gradient(90deg, rgba(255,106,132,.28), rgba(255,106,132,.96))",
                    }}
                  />
                </div>
                <div className="tape-sub">Bias {(state.scenario.sectorBias[key] * 10000).toFixed(1)} bp</div>
              </div>
            );
          })}

          {state.assetList.map((symbol) => {
            const asset = state.assets[symbol];
            const width = clamp(Math.abs(asset.changePct) / symbolMaxAbs, 0.08, 1) * 100;
            return (
              <button
                type="button"
                className={`tape-item symbol ${symbol === state.selected ? "active" : ""}`}
                key={symbol}
                onClick={() => engine.setSelectedSymbol(symbol)}
              >
                <div className="tape-head">
                  <span>{symbol}</span>
                  <span className={`${asset.changePct >= 0 ? "good" : "bad"} mono`}>{fmtPct(asset.changePct)}</span>
                </div>
                <div className="tape-track">
                  <div
                    className="tape-fill"
                    style={{
                      width: `${width}%`,
                      background:
                        asset.changePct >= 0
                          ? "linear-gradient(90deg, rgba(41,201,132,.28), rgba(41,201,132,.96))"
                          : "linear-gradient(90deg, rgba(255,106,132,.28), rgba(255,106,132,.96))",
                    }}
                  />
                </div>
                <div className="tape-sub">{SECTORS[asset.sector].name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
