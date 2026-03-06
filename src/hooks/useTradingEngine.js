import { useEffect, useMemo, useSyncExternalStore } from "react";
import { TradingEngine } from "../simulator/engine";

export function useTradingEngine() {
  const engine = useMemo(() => new TradingEngine(), []);
  const version = useSyncExternalStore(engine.subscribe, engine.getSnapshot);

  useEffect(() => {
    engine.initialize();

    let rafId = 0;
    const loop = (ts) => {
      engine.frame(ts);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    if (typeof window !== "undefined") {
      window.__tradeSimEngine = engine;
      window.__tradeSimDebug = {
        dumpChartSequence: (options) => engine.debugDumpChartSequence(options),
      };
      console.info(
        "[trade-sim] debug helper ready: window.__tradeSimDebug.dumpChartSequence()",
      );
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        if (window.__tradeSimEngine === engine) delete window.__tradeSimEngine;
        if (window.__tradeSimDebug?.dumpChartSequence) delete window.__tradeSimDebug;
      }
      engine.destroy();
    };
  }, [engine]);

  return { engine, state: engine.state, version };
}
