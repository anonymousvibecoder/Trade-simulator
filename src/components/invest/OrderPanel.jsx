import { useEffect, useRef, useState } from "react";
import { SECTORS } from "../../simulator/constants";
import { fmtMoney } from "../../simulator/utils";

const SIZE_PRESETS = [25, 50, 75, 100];

export function OrderPanel({ engine, state }) {
  const [isLevPopupOpen, setIsLevPopupOpen] = useState(false);
  const levAnchorRef = useRef(null);

  const asset = state.assets[state.selected];
  const position = engine.getCurrentPosition(asset.symbol);
  const side = state.orderForm.side;
  const orderType = state.orderForm.type;
  const marginMode = state.orderForm.marginMode || "cross";
  const leverage = Math.max(1, Number(state.orderForm.leverage || 1));
  const limitPriceInput = Number(state.orderForm.limitPrice);
  const effectivePrice =
    orderType === "limit" && Number.isFinite(limitPriceInput) && limitPriceInput > 0
      ? limitPriceInput
      : asset.price;

  const maxNotional = Math.max(0, state.cash * leverage);
  const maxQty = Math.max(1, Math.floor(maxNotional / Math.max(0.01, effectivePrice)));
  const qty = Math.max(1, Math.min(maxQty, Number(state.orderForm.qty || 1)));
  const sizePct = Math.max(1, Math.min(100, Math.round((qty / Math.max(1, maxQty)) * 100)));
  const notional = qty * effectivePrice;
  const estimatedFee = engine.commission(qty);
  const estimatedCost = notional / leverage + estimatedFee;
  const estimatedSlippage =
    orderType === "market"
      ? Math.abs(engine.slippage(asset, side === "long" ? "buy" : "sell", qty))
      : 0;

  const maintenanceRequirement = engine.getMaintenanceRequirement();
  const previewHealth =
    maintenanceRequirement > 0
      ? (engine.getEquity() - estimatedCost) /
        Math.max(1, maintenanceRequirement + notional * engine.maintenanceRate(leverage))
      : 999;
  const maintenanceRatePct = engine.maintenanceRate(leverage) * 100;

  const submitWithSide = (nextSide) => {
    engine.setOrderSide(nextSide);
    engine.submitOrder();
  };

  useEffect(() => {
    if (!isLevPopupOpen) return undefined;
    const onOutsideClick = (event) => {
      if (levAnchorRef.current && !levAnchorRef.current.contains(event.target)) {
        setIsLevPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [isLevPopupOpen]);

  return (
    <article className="panel order-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Order</div>
          <div className="panel-sub">{asset.symbol} - {SECTORS[asset.sector].name}</div>
        </div>
        <span className={`badge ${previewHealth > 2 ? "good" : previewHealth > 1.2 ? "warn" : "bad"}`}>
          Health {engine.getMarginHealth() === 999 ? "999" : engine.getMarginHealth().toFixed(2)}
        </span>
      </div>

      <div className="panel-body scroll">
        <div className="card order-card">
          <div className="order-head-row">
            <button
              className={`mini-btn ${marginMode === "cross" ? "active" : ""}`}
              onClick={() => engine.setOrderMarginMode("cross")}
            >
              Cross
            </button>
            <button
              className={`mini-btn ${marginMode === "isolated" ? "active" : ""}`}
              onClick={() => engine.setOrderMarginMode("isolated")}
            >
              Isolated
            </button>
            <div className="order-lev-anchor" ref={levAnchorRef}>
              <button
                className="mini-btn order-lev-trigger"
                onClick={() => setIsLevPopupOpen((open) => !open)}
              >
                {leverage}x
              </button>
              {isLevPopupOpen ? (
                <div className="order-lev-popover">
                  <div className="order-lev-title">Leverage</div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={leverage}
                    onChange={(event) => engine.setOrderLeverage(Number(event.target.value))}
                  />
                  <div className="order-lev-input-row">
                    <input
                      className="order-lev-input mono"
                      type="number"
                      min="1"
                      max="50"
                      step="1"
                      value={leverage}
                      onChange={(event) => engine.setOrderLeverage(Number(event.target.value))}
                    />
                    <span className="muted mono">x</span>
                  </div>
                  <div className="order-lev-meta">
                    <span>Max Notional</span>
                    <span className="mono">{fmtMoney(state.cash * leverage, 0)}</span>
                    <span>Maint. Margin</span>
                    <span className="mono">{maintenanceRatePct.toFixed(2)}%</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="order-kind-tabs">
            <button
              className={`book-tab ${orderType === "limit" ? "active" : ""}`}
              onClick={() => engine.setOrderType("limit")}
            >
              Limit
            </button>
            <button
              className={`book-tab ${orderType === "market" ? "active" : ""}`}
              onClick={() => engine.setOrderType("market")}
            >
              Market
            </button>
          </div>

          {orderType === "limit" ? (
            <div className="field order-field">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={state.orderForm.limitPrice ?? ""}
                onChange={(event) => engine.setLimitPrice(event.target.value)}
              />
            </div>
          ) : (
            <div className="order-market-line">
              <span className="muted">Mark</span>
              <span className="mono">{asset.price.toFixed(2)}</span>
            </div>
          )}

          <div className="field order-field">
            <label>Position Size</label>
            <input
              type="number"
              min="1"
              max={maxQty}
              step="1"
              value={qty}
              onChange={(event) => {
                const raw = Math.floor(Number(event.target.value) || 1);
                const nextQty = Math.max(1, Math.min(maxQty, raw));
                engine.setOrderQty(nextQty);
              }}
            />
          </div>

          <div className="order-slider-wrap">
            <input
              type="range"
              min="1"
              max="100"
              value={sizePct}
              onChange={(event) => {
                const pct = Number(event.target.value);
                const targetQty = Math.max(1, Math.floor((maxQty * pct) / 100));
                engine.setOrderQty(targetQty);
              }}
            />
            <div className="order-slider-presets">
              {SIZE_PRESETS.map((pct) => (
                <button
                  key={pct}
                  className="mini-btn"
                  onClick={() => {
                    const targetQty = Math.max(1, Math.floor((maxQty * pct) / 100));
                    engine.setOrderQty(targetQty);
                  }}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="order-est-grid">
            <div className="preview-item">
              <div className="k">Est. Cost</div>
              <div className="v mono">{fmtMoney(estimatedCost, 0)}</div>
            </div>
            <div className="preview-item">
              <div className="k">Max Notional</div>
              <div className="v mono">{fmtMoney(maxNotional, 0)}</div>
            </div>
            <div className="preview-item">
              <div className="k">Max Qty</div>
              <div className="v mono">{maxQty.toLocaleString("en-US")}</div>
            </div>
            <div className="preview-item">
              <div className="k">Est. Slip/Fee</div>
              <div className="v mono">{fmtMoney(estimatedSlippage + estimatedFee)}</div>
            </div>
          </div>

          <div className="order-submit-row">
            <button className="order-submit-btn long" onClick={() => submitWithSide("long")}>
              Open Long
            </button>
            <button className="order-submit-btn short" onClick={() => submitWithSide("short")}>
              Open Short
            </button>
          </div>

          {position ? (
            <div className="order-position-line">
              <span className="mono">
                {position.qty > 0 ? "LONG" : "SHORT"} {Math.abs(position.qty)} @ {position.avg.toFixed(2)}
              </span>
              <div className="quick-row">
                <button className="mini-btn" onClick={() => engine.closePosition(asset.symbol, 0.5)}>
                  Close 50%
                </button>
                <button className="mini-btn red" onClick={() => engine.closePosition(asset.symbol, 1)}>
                  Close All
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
