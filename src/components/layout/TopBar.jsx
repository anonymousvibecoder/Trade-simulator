import { useMemo, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { fmtMoney, timeLabel } from "../../simulator/utils";

const TOPBAR_COPY = {
  en: {
    tabs: {
      invest: "Invest",
      news: "News",
      community: "Community",
      settings: "Settings",
    },
    market: {
      search: "Search symbol",
      favorites: "Favorites",
      stocks: "Stocks",
      sectors: "Sectors",
      all: "All",
      headers: ["Symbol", "Last Price", "24h Chg", "Volume"],
    },
    metrics: {
      time: "Time",
      regime: "Regime",
      equity: "Equity",
      cash: "Cash",
      usedMargin: "Used Margin",
    },
    playback: {
      label: "Playback",
      paused: "Paused",
      autoSlowOn: "Auto Slow ON",
      autoSlowOff: "Auto Slow OFF",
      pause: "Pause",
      jump: "Jump",
      jumping: "Jumping...",
      health: "Health",
    },
    settings: {
      title: "Settings",
      subtitle: "Language, auto slow, save, load, and reset.",
      language: "Language",
      languageHint: "Apply the interface language immediately.",
      autoSlow: "Auto Slow",
      autoSlowHint: "Slow playback automatically when major news hits.",
      saveSlot: "Save Slot",
      noSave:
        "No manual save yet. Reopening the game starts again on 2026-01-05 with 2016-2025 history retained.",
      savedAt: "Saved",
      resumeFrom: "Resume From",
      saveStatusHint:
        "Without a manual save, the next launch returns to the 2026-01-05 opening session.",
      save: "Save",
      load: "Load",
      reset: "Reset",
      on: "On",
      off: "Off",
      languages: {
        ko: "Korean",
        en: "English",
      },
      confirmLoad: "Load the saved game and discard current unsaved progress?",
      confirmReset:
        "Reset the game to the 2026-01-05 starting session and remove the manual save?",
    },
  },
  ko: {
    tabs: {
      invest: "투자",
      news: "뉴스",
      community: "커뮤니티",
      settings: "설정",
    },
    market: {
      search: "종목 검색",
      favorites: "즐겨찾기",
      stocks: "주식",
      sectors: "섹터",
      all: "전체",
      headers: ["종목", "현재가", "24h 변동", "거래량"],
    },
    metrics: {
      time: "시간",
      regime: "장세",
      equity: "자산",
      cash: "현금",
      usedMargin: "사용 증거금",
    },
    playback: {
      label: "재생 속도",
      paused: "일시정지",
      autoSlowOn: "자동 감속 ON",
      autoSlowOff: "자동 감속 OFF",
      pause: "정지",
      jump: "점프",
      jumping: "이벤트 탐색 중...",
      health: "건전성",
    },
    settings: {
      title: "설정",
      subtitle: "언어, 자동 감속, 저장, 불러오기, 초기화를 관리합니다.",
      language: "언어",
      languageHint: "인터페이스 언어를 즉시 변경합니다.",
      autoSlow: "자동 감속",
      autoSlowHint: "중요 뉴스가 나오면 재생 속도를 자동으로 낮춥니다.",
      saveSlot: "세이브 슬롯",
      noSave:
        "수동 저장이 없습니다. 다시 실행하면 2016-2025 차트는 유지한 채 2026-01-05부터 다시 시작합니다.",
      savedAt: "저장 시각",
      resumeFrom: "이어할 시점",
      saveStatusHint:
        "수동 저장이 없으면 다음 실행 시 항상 2026-01-05 장 시작으로 돌아갑니다.",
      save: "저장",
      load: "불러오기",
      reset: "초기화",
      on: "켜기",
      off: "끄기",
      languages: {
        ko: "한국어",
        en: "English",
      },
      confirmLoad: "현재 미저장 진행 상황을 버리고 저장된 게임을 불러올까요?",
      confirmReset: "수동 저장을 지우고 게임을 2026-01-05 시작 시점으로 초기화할까요?",
    },
  },
};

function tabButtonClass(state, tab) {
  return `tab-btn ${state.selectedTab === tab ? "active" : ""}`;
}

function speedButtonClass(state, speed) {
  return `speed-btn ${state.speed === speed && !state.paused ? "active" : ""}`;
}

function getCopy(language) {
  return TOPBAR_COPY[language] || TOPBAR_COPY.en;
}

function formatSaveMeta(meta, language) {
  if (!meta?.savedAt) return null;
  const locale = language === "ko" ? "ko-KR" : "en-US";
  const savedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(meta.savedAt));
  const resumeFrom = timeLabel(meta.day, meta.marketMinute, meta.calendarDate);
  return { savedAt, resumeFrom };
}

export function TopBar({ engine, state }) {
  const { language, setLanguage } = useI18n();
  const copy = getCopy(language);
  const [marketQuery, setMarketQuery] = useState("");
  const [marketOpen, setMarketOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pairPopoverRef = useRef(null);
  const settingsPopoverRef = useRef(null);
  const equity = engine.getEquity();
  const usedMargin = engine.getUsedMargin();
  const health = engine.getMarginHealth();
  const selectedAsset = state.assets[state.selected];
  const saveMeta = useMemo(
    () => formatSaveMeta(state.savedGameMeta, language),
    [state.savedGameMeta, language],
  );

  const filteredAssets = useMemo(() => {
    const q = marketQuery.trim().toLowerCase();
    const list = state.assetList.map((symbol) => state.assets[symbol]);
    const sorted = [...list].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
    if (!q) return sorted;
    return sorted.filter((asset) => {
      return asset.symbol.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q);
    });
  }, [marketQuery, state.assetList, state.assets]);

  const closeMarketPopover = () => {
    setMarketOpen(false);
    const active = pairPopoverRef.current?.querySelector(":focus");
    if (active && typeof active.blur === "function") active.blur();
  };

  const closeSettingsPopover = () => {
    setSettingsOpen(false);
    const active = settingsPopoverRef.current?.querySelector(":focus");
    if (active && typeof active.blur === "function") active.blur();
  };

  const handleLoadGame = () => {
    if (!state.savedGameMeta) return;
    if (!window.confirm(copy.settings.confirmLoad)) return;
    closeSettingsPopover();
    void engine.loadSavedGame(true);
  };

  const handleResetGame = () => {
    if (!window.confirm(copy.settings.confirmReset)) return;
    closeSettingsPopover();
    void engine.resetGame(true);
  };

  return (
    <header className="topbar">
      <div className="top-left">
        <div className="brand brand-inline">
          <div className="brand-mark" aria-hidden="true" />
          <div className="brand-copy">
            <div className="title">Market Pulse Desk</div>
            <div className="sub brand-sub">Leveraged Trading Simulator</div>
          </div>
        </div>

        {selectedAsset ? (
          <div
            className={`pair-popover ${marketOpen ? "open" : ""}`}
            ref={pairPopoverRef}
            onMouseEnter={() => setMarketOpen(true)}
            onMouseLeave={closeMarketPopover}
            onFocus={() => setMarketOpen(true)}
            onBlur={(event) => {
              if (event.currentTarget.contains(event.relatedTarget)) return;
              setMarketOpen(false);
            }}
          >
            <div
              className="pair-box"
              role="button"
              tabIndex={0}
              onClick={() => setMarketOpen((prev) => !prev)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setMarketOpen((prev) => !prev);
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  closeMarketPopover();
                }
              }}
            >
              <div className="pair-symbol">
                {selectedAsset.symbol} - {selectedAsset.name}
              </div>
              <div className={`pair-price mono ${selectedAsset.changePct >= 0 ? "good" : "bad"}`}>
                {selectedAsset.price.toFixed(2)}
              </div>
            </div>
            <div className="market-popover">
              <div className="market-pop-search">
                <input
                  className="market-search-input"
                  type="text"
                  placeholder={copy.market.search}
                  value={marketQuery}
                  onChange={(e) => setMarketQuery(e.target.value)}
                />
              </div>
              <div className="market-pop-tabs">
                <button type="button" className="market-mini-tab">
                  {copy.market.favorites}
                </button>
                <button type="button" className="market-mini-tab active">
                  {copy.market.stocks}
                </button>
                <button type="button" className="market-mini-tab">
                  {copy.market.sectors}
                </button>
                <button type="button" className="market-mini-tab">
                  {copy.market.all}
                </button>
              </div>
              <div className="market-table-head">
                {copy.market.headers.map((label, index) => (
                  <span key={label} className={index > 0 ? "mono" : ""}>
                    {label}
                  </span>
                ))}
              </div>
              <div className="market-pop-list scroll">
                {filteredAssets.map((asset) => (
                  <button
                    type="button"
                    key={asset.symbol}
                    className={`market-row ${asset.symbol === state.selected ? "active" : ""}`}
                    onClick={() => {
                      engine.setSelectedSymbol(asset.symbol);
                      closeMarketPopover();
                    }}
                  >
                    <div className="market-col-symbol">
                      <span className="market-star">{asset.symbol === state.selected ? "*" : "."}</span>
                      <div>
                        <div className="market-symbol-main">{asset.symbol}</div>
                        <div className="market-symbol-sub muted">{asset.name}</div>
                      </div>
                    </div>
                    <div className="mono">{asset.price.toFixed(2)}</div>
                    <div className={`mono ${asset.changePct >= 0 ? "good" : "bad"}`}>{asset.changePct.toFixed(2)}%</div>
                    <div className="mono muted">{fmtCompactVol(asset.dayVol || asset.lastVolume || 0)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <nav className="main-tabs" aria-label="Main Tabs">
          <button className={tabButtonClass(state, "invest")} onClick={() => engine.setTab("invest")} title={copy.tabs.invest}>
            INV
          </button>
          <button className={tabButtonClass(state, "news")} onClick={() => engine.setTab("news")} title={copy.tabs.news}>
            NWS
          </button>
          <button className={tabButtonClass(state, "community")} onClick={() => engine.setTab("community")} title={copy.tabs.community}>
            COM
          </button>
          <div
            className={`settings-popover-wrap ${settingsOpen ? "open" : ""}`}
            ref={settingsPopoverRef}
            onBlur={(event) => {
              if (event.currentTarget.contains(event.relatedTarget)) return;
              setSettingsOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeSettingsPopover();
              }
            }}
          >
            <button
              type="button"
              className="ghost-btn nav-accent"
              onClick={() => setSettingsOpen((prev) => !prev)}
              title={copy.tabs.settings}
            >
              SET
            </button>
            <div className="settings-popover">
              <div className="settings-popover-header">
                <div>
                  <div className="settings-popover-title">{copy.settings.title}</div>
                  <div className="settings-popover-sub">{copy.settings.subtitle}</div>
                </div>
              </div>

              <div className="settings-section">
                <div className="settings-copy">
                  <div className="settings-label">{copy.settings.language}</div>
                  <div className="settings-hint">{copy.settings.languageHint}</div>
                </div>
                <div className="settings-control-row">
                  {["ko", "en"].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={`mini-btn settings-chip ${language === lang ? "active" : ""}`}
                      onClick={() => setLanguage(lang)}
                    >
                      {copy.settings.languages[lang]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-section">
                <div className="settings-copy">
                  <div className="settings-label">{copy.settings.autoSlow}</div>
                  <div className="settings-hint">{copy.settings.autoSlowHint}</div>
                </div>
                <div className="settings-control-row">
                  {[true, false].map((enabled) => (
                    <button
                      key={String(enabled)}
                      type="button"
                      className={`mini-btn settings-chip ${state.autoSlow === enabled ? "active" : ""}`}
                      onClick={() => engine.setAutoSlow(enabled)}
                    >
                      {enabled ? copy.settings.on : copy.settings.off}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-section">
                <div className="settings-copy">
                  <div className="settings-label">{copy.settings.saveSlot}</div>
                  <div className="settings-hint">{copy.settings.saveStatusHint}</div>
                </div>
                <div className="settings-status-card">
                  {saveMeta ? (
                    <>
                      <div>{copy.settings.savedAt}: {saveMeta.savedAt}</div>
                      <div>{copy.settings.resumeFrom}: {saveMeta.resumeFrom}</div>
                    </>
                  ) : (
                    <div>{copy.settings.noSave}</div>
                  )}
                </div>
                <div className="settings-action-row">
                  <button
                    type="button"
                    className="ghost-btn green settings-action-btn"
                    onClick={() => {
                      closeSettingsPopover();
                      engine.saveGame();
                    }}
                  >
                    {copy.settings.save}
                  </button>
                  <button
                    type="button"
                    className="ghost-btn settings-action-btn"
                    onClick={handleLoadGame}
                    disabled={!state.savedGameMeta}
                  >
                    {copy.settings.load}
                  </button>
                  <button
                    type="button"
                    className="ghost-btn red settings-action-btn"
                    onClick={handleResetGame}
                  >
                    {copy.settings.reset}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="topbox top-metrics-box">
        <div className="top-metrics">
          <Metric label={copy.metrics.time} value={timeLabel(state.day, state.marketMinute, state.calendarDate)} mono />
          <Metric label={copy.metrics.regime} value={state.scenario.regime.name} />
          <Metric label={copy.metrics.equity} value={fmtMoney(equity)} mono tone={equity >= 100000 ? "good" : "bad"} />
          <Metric label={copy.metrics.cash} value={fmtMoney(state.cash)} mono tone={state.cash >= 0 ? "good" : "bad"} />
          <Metric label={copy.metrics.usedMargin} value={fmtMoney(usedMargin, 0)} mono tone={usedMargin > equity * 0.75 ? "warn" : "blue"} />
        </div>
      </div>

      <div className="topbox speed-box">
        <div className="speed-meta">
          <div className="metric-label">{copy.playback.label}</div>
          <div className="sub">
            {state.paused ? copy.playback.paused : `${state.speed}x`} - {state.autoSlow ? copy.playback.autoSlowOn : copy.playback.autoSlowOff}
          </div>
        </div>
        <div className="speed-wrap">
          {[1, 4, 16, 48].map((speed) => (
            <button
              key={speed}
              className={speedButtonClass(state, speed)}
              onClick={() => engine.setSpeed(speed)}
            >
              {speed}x
            </button>
          ))}
          <button className="ghost-btn" id="pauseBtn" onClick={() => engine.togglePause()}>
            {copy.playback.pause}
          </button>
          <button
            className="ghost-btn gold"
            id="jumpBtn"
            onClick={() => engine.jumpToNextCatalyst()}
            disabled={state.fastForwarding}
          >
            {state.fastForwarding ? copy.playback.jumping : copy.playback.jump}
          </button>
          <span className={`badge ${health > 2 ? "good" : health > 1.2 ? "warn" : "bad"}`}>
            {copy.playback.health} {health === 999 ? "999" : health.toFixed(2)}
          </span>
        </div>
      </div>
    </header>
  );
}

function fmtCompactVol(value) {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(Math.round(value));
}

function Metric({ label, value, mono = false, tone = "" }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${mono ? "mono" : ""} ${tone}`.trim()}>{value}</div>
    </div>
  );
}
