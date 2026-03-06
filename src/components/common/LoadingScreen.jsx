export function LoadingScreen({ boot }) {
  const progress = Math.max(0, Math.min(1, Number(boot?.progress || 0)));
  const percent = Math.round(progress * 100);
  const message = boot?.message || "Loading market simulation";

  return (
    <div className="loading-screen">
      <div className="loading-shell">
        <div className="loading-eyebrow">Trade Simulator</div>
        <h1 className="loading-title">Building the market tape</h1>
        <p className="loading-copy">
          {message}
        </p>

        <div className="loading-progress">
          <div className="loading-progress-track">
            <div
              className="loading-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="loading-progress-meta">
            <span>{message}</span>
            <span>{percent}%</span>
          </div>
        </div>

        <div className="loading-grid">
          <div className="loading-card">
            <strong>Bootstrap</strong>
            <span>2016-01-01 to 2026-01 session history</span>
          </div>
          <div className="loading-card">
            <strong>Model</strong>
            <span>Shared state function for history and live market</span>
          </div>
          <div className="loading-card">
            <strong>Cache</strong>
            <span>Reuse stored bootstrap when available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
