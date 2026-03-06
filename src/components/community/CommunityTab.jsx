export function CommunityTab() {
  return (
    <section className="tab-panel active">
      <div className="community-layout">
        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">X Feed (Planned)</div>
              <div className="panel-sub">Realtime mention velocity and influencer impact</div>
            </div>
          </div>
          <div className="placeholder-stack scroll">
            <div className="placeholder">
              <div className="panel-title" style={{ marginBottom: 8 }}>
                Stream Model
              </div>
              <div className="muted">
                Integrate symbol mention spikes and sentiment shifts as optional catalysts.
              </div>
            </div>
            <div className="placeholder">
              <div className="panel-title" style={{ marginBottom: 8 }}>
                Signal Ideas
              </div>
              <div className="pill-row">
                <span className="badge blue">Mention velocity</span>
                <span className="badge warn">Alert bursts</span>
                <span className="badge neutral">Influencer weight</span>
              </div>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Reddit Feed (Planned)</div>
              <div className="panel-sub">WSB style crowding and squeeze chatter</div>
            </div>
          </div>
          <div className="placeholder-stack scroll">
            <div className="placeholder">
              <div className="panel-title" style={{ marginBottom: 8 }}>
                Sentiment Layer
              </div>
              <div className="muted">
                Track crowd enthusiasm and collapse speed for highly shorted names.
              </div>
            </div>
            <div className="placeholder">
              <div className="panel-title" style={{ marginBottom: 8 }}>
                Signal Ideas
              </div>
              <div className="pill-row">
                <span className="badge bad">Crowding index</span>
                <span className="badge violet">Narrative heat</span>
                <span className="badge good">Retail flow</span>
              </div>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Roadmap</div>
              <div className="panel-sub">Next integration blocks</div>
            </div>
          </div>
          <div className="placeholder-stack scroll">
            <div className="todo-item">
              <div className="todo-check" />
              <div>
                <strong>X + Reddit composite sentiment</strong>
                <div className="muted">Normalize and merge cross-platform momentum into one index.</div>
              </div>
            </div>
            <div className="todo-item">
              <div className="todo-check" />
              <div>
                <strong>Sentiment-driven catalyst generator</strong>
                <div className="muted">Convert crowd events into directional drift and volatility bursts.</div>
              </div>
            </div>
            <div className="todo-item">
              <div className="todo-check" />
              <div>
                <strong>Noise filtering model</strong>
                <div className="muted">Separate persistent sentiment from temporary spikes.</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
