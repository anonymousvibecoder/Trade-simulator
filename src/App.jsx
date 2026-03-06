import { LoadingScreen } from "./components/common/LoadingScreen";
import { CommunityTab } from "./components/community/CommunityTab";
import { ToastStack } from "./components/common/ToastStack";
import { InvestTab } from "./components/invest/InvestTab";
import { BottomTickerBar } from "./components/layout/BottomTickerBar";
import { TopBar } from "./components/layout/TopBar";
import { NewsTab } from "./components/news/NewsTab";
import { useTradingEngine } from "./hooks/useTradingEngine";

export function App() {
  const { engine, state, version } = useTradingEngine();

  if (state.boot?.active) {
    return <LoadingScreen boot={state.boot} />;
  }

  return (
    <div className="app">
      <TopBar engine={engine} state={state} />

      <main className="content">
        {state.selectedTab === "invest" && <InvestTab engine={engine} state={state} version={version} />}
        {state.selectedTab === "news" && <NewsTab engine={engine} state={state} />}
        {state.selectedTab === "community" && <CommunityTab />}
      </main>

      <BottomTickerBar state={state} />

      <ToastStack toasts={state.toasts} onDismiss={(id) => engine.dismissToast(id)} />
    </div>
  );
}
