import { BookPanel } from "./BookPanel";
import { ChartPanel } from "./ChartPanel";
import { MarketTapePanel } from "./MarketTapePanel";
import { OrderPanel } from "./OrderPanel";

export function InvestTab({ engine, state, version }) {
  return (
    <section className="tab-panel active">
      <div className="invest-shell">
        <div className="terminal-center">
          <ChartPanel engine={engine} state={state} version={version} />
          <BookPanel engine={engine} state={state} />
        </div>

        <div className="terminal-right">
          <OrderPanel engine={engine} state={state} />
          <MarketTapePanel engine={engine} state={state} />
        </div>
      </div>
    </section>
  );
}
