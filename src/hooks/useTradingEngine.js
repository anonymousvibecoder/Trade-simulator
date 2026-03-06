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
    return () => {
      cancelAnimationFrame(rafId);
      engine.destroy();
    };
  }, [engine]);

  return { engine, state: engine.state, version };
}
