import { fmtMoney } from "../../simulator/utils";

const TABS = [
  { id: "openPositions", label: "Positions" },
  { id: "openOrders", label: "Open Orders" },
  { id: "positionHistory", label: "Trade History" },
  { id: "orderHistory", label: "Order History" },
];

export function BookPanel({ engine, state }) {
  const tab = state.selectedBookTab;

  return (
    <article className="panel book-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Book</div>
          <div className="panel-sub">Positions, open orders, and execution logs</div>
        </div>
      </div>
      <div className="panel-body">
        <div className="book-tabs">
          {TABS.map((item) => (
            <button
              key={item.id}
              className={`book-tab ${tab === item.id ? "active" : ""}`}
              onClick={() => engine.setBookTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="table-wrap scroll">{renderTable(tab, engine, state)}</div>
      </div>
    </article>
  );
}

function renderTable(tab, engine, state) {
  if (tab === "openPositions") {
    const rows = Object.values(state.positions);
    return (
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Avg</th>
            <th>Mark</th>
            <th>Lev</th>
            <th>Margin</th>
            <th>U-P/L</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((pos) => {
              const asset = state.assets[pos.symbol];
              const upnl = engine.getUnrealizedPnl(pos);
              return (
                <tr key={pos.symbol}>
                  <td>{pos.symbol}</td>
                  <td>
                    <span className={`badge ${pos.qty > 0 ? "blue" : "warn"}`}>{pos.qty > 0 ? "LONG" : "SHORT"}</span>
                  </td>
                  <td className="mono">{Math.abs(pos.qty)}</td>
                  <td className="mono">{pos.avg.toFixed(2)}</td>
                  <td className="mono">{asset.price.toFixed(2)}</td>
                  <td className="mono">{pos.leverage.toFixed(2)}x</td>
                  <td className="mono">{fmtMoney(pos.margin, 0)}</td>
                  <td className={`mono ${upnl >= 0 ? "good" : "bad"}`}>{fmtMoney(upnl)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="mini-btn" onClick={() => engine.closePosition(pos.symbol, 0.5)}>
                        50%
                      </button>
                      <button className="mini-btn red" onClick={() => engine.closePosition(pos.symbol, 1)}>
                        Close
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className="muted">
                No open positions.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  if (tab === "openOrders") {
    return (
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Type</th>
            <th>Limit</th>
            <th>Lev</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.openOrders.length ? (
            state.openOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.submittedAt}</td>
                <td>{order.symbol}</td>
                <td>
                  <span className={`badge ${order.side === "long" ? "blue" : "warn"}`}>{order.side.toUpperCase()}</span>
                </td>
                <td className="mono">{order.qty}</td>
                <td>{order.type.toUpperCase()}</td>
                <td className="mono">{order.limitPrice.toFixed(2)}</td>
                <td className="mono">{order.leverage}x</td>
                <td>
                  <button className="mini-btn red" onClick={() => engine.cancelOrder(order.id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="muted">
                No open orders.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  if (tab === "positionHistory") {
    return (
      <table>
        <thead>
          <tr>
            <th>Closed At</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Lev</th>
            <th>Realized</th>
          </tr>
        </thead>
        <tbody>
          {state.positionHistory.length ? (
            state.positionHistory.map((item, idx) => (
              <tr key={`${item.symbol}-${item.closedAt}-${idx}`}>
                <td>{item.closedAt}</td>
                <td>{item.symbol}</td>
                <td>
                  <span className={`badge ${item.side === "LONG" ? "blue" : "warn"}`}>{item.side}</span>
                </td>
                <td className="mono">{item.qty}</td>
                <td className="mono">{item.entryAvg.toFixed(2)}</td>
                <td className="mono">{item.exitPrice.toFixed(2)}</td>
                <td className="mono">{item.leverage.toFixed(2)}x</td>
                <td className={`mono ${item.realized >= 0 ? "good" : "bad"}`}>{fmtMoney(item.realized)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="muted">
                No closed trades yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Symbol</th>
          <th>Side</th>
          <th>Qty</th>
          <th>Type</th>
          <th>Lev</th>
          <th>Status</th>
          <th>Fill</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {state.orderHistory.length ? (
          state.orderHistory.map((item, idx) => (
            <tr key={`${item.timestamp}-${item.symbol}-${idx}`}>
              <td>{item.timestamp}</td>
              <td>{item.symbol}</td>
              <td>
                <span className={`badge ${item.side === "LONG" ? "blue" : "warn"}`}>{item.side}</span>
              </td>
              <td className="mono">{item.qty}</td>
              <td>{item.type}</td>
              <td className="mono">{item.leverage}x</td>
              <td>{item.status}</td>
              <td className="mono">{item.fillPrice ? item.fillPrice.toFixed(2) : "--"}</td>
              <td className="muted">{item.note}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9} className="muted">
              No order history yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
