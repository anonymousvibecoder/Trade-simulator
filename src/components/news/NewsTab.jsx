import { SECTORS } from "../../simulator/constants";
import { fmtMoney, fmtPct } from "../../simulator/utils";

export function NewsTab({ engine, state }) {
  const avgs = engine.getSectorAverages();
  const nextCatalyst = Math.max(0, state.eventSchedule);
  const health = engine.getMarginHealth();

  const groups = {
    Macro: [],
    System: [],
    AI: [],
    SEMI: [],
    BIO: [],
    ENR: [],
    CONS: [],
    MEME: [],
  };

  state.news.forEach((item) => {
    const sector = engine.newsSector(item);
    if (!groups[sector]) groups[sector] = [];
    groups[sector].push(item);
  });

  const orderedKeys = ["Macro", "System", "AI", "SEMI", "BIO", "ENR", "CONS", "MEME"];

  return (
    <section className="tab-panel active">
      <div className="news-layout">
        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Scenario & Risk</div>
              <div className="panel-sub">Live scenario, margin and sector pulse</div>
            </div>
          </div>
          <div className="placeholder-stack scroll">
            <div className="card">
              <div className="panel-title" style={{ marginBottom: 8 }}>
                {state.scenario.title}
              </div>
              <div className="sub">{state.scenario.desc}</div>
              <div style={{ height: 12 }} />
              <div className="pill-row">
                <span className="badge blue">{state.scenario.tag}</span>
                <span className="badge neutral">Next catalyst {nextCatalyst}m</span>
                <span className={`badge ${health > 1.2 ? "good" : "bad"}`}>
                  Health {health === 999 ? "999" : health.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="card">
              <div className="panel-title" style={{ marginBottom: 10 }}>
                Sector Strength
              </div>
              {Object.keys(SECTORS).map((key) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(112,137,190,.08)",
                  }}
                >
                  <span>{SECTORS[key].name}</span>
                  <span className={`mono ${avgs[key] >= 0 ? "good" : "bad"}`}>{fmtPct(avgs[key])}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="panel-title" style={{ marginBottom: 10 }}>
                Leverage Risk
              </div>
              <div className="preview-grid">
                <PreviewItem title="Gross Notional" value={fmtMoney(engine.getGrossNotional(), 0)} />
                <PreviewItem title="Maintenance" value={fmtMoney(engine.getMaintenanceRequirement(), 0)} />
                <PreviewItem title="Open Orders" value={String(state.openOrders.length)} />
                <PreviewItem title="Positions" value={String(Object.keys(state.positions).length)} />
              </div>
            </div>
          </div>
        </article>

        <div className="news-right">
          <article className="panel" style={{ minHeight: 0 }}>
            <div className="panel-header">
              <div>
                <div className="panel-title">Live News Grid</div>
                <div className="panel-sub">Grouped by macro/system/sector</div>
              </div>
            </div>
            <div className="news-groups scroll">
              {orderedKeys.map((key) => {
                const label = key === "Macro" || key === "System" ? key : SECTORS[key].name;
                const items = (groups[key] || []).slice(0, 8);
                return (
                  <article className="panel news-group" key={key}>
                    <div className="panel-header">
                      <div>
                        <div className="panel-title">{label}</div>
                        <div className="panel-sub">{items.length} items</div>
                      </div>
                    </div>
                    <div className="news-stack">
                      {items.length ? (
                        items.map((item) => (
                          <div className="news-item" key={item.id}>
                            <div className="news-item-head">
                              <span className={`badge ${item.severity}`}>{item.scope}</span>
                              <span className="muted">{item.time}</span>
                            </div>
                            <div style={{ fontWeight: 900, marginBottom: 6 }}>{item.headline}</div>
                            <div className="muted">{item.body}</div>
                          </div>
                        ))
                      ) : (
                        <div className="muted" style={{ padding: 14 }}>
                          No updates yet.
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function PreviewItem({ title, value }) {
  return (
    <div className="preview-item">
      <div className="k">{title}</div>
      <div className="v mono">{value}</div>
    </div>
  );
}
