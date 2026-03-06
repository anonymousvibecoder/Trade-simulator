export const enPack = {
  chartPanel: {
    tabs: {
      chart: "Chart",
      profile: "Stock Info",
      news: "News · Disclosure",
      trading: "Trading Status",
    },
    subtitle: {
      chart: "Trading chart - Wheel to zoom",
      profile: "Macro transmission and company operating state",
      news: "TODO placeholder for news and disclosure feed",
      trading: "Execution surface shaped by company micro state",
    },
    placeholder: {
      notWired:
        "News and disclosure feed is still a TODO surface.",
      todo: {
        profile: [
          "TODO: stock identity, valuation, and N-year simulation summary",
          "TODO: macro sensitivity fields linked to D/Q/M/F/X/E factors",
          "TODO: PER/PBR/dividend/ROE synthetic timeline panel",
        ],
        news: [
          "TODO: symbol-specific disclosure timeline",
          "TODO: separate market news vs. company filing stream",
          "TODO: filter and severity controls",
        ],
        trading: [
          "TODO: execution tape and intraday flow dashboard",
          "TODO: position and risk snapshot cards",
          "TODO: pending orders and fill analytics",
        ],
      },
    },
    aria: {
      workspaceTabs: "Chart workspace tabs",
    },
    badges: {
      spread: "Spread {{value}} bps",
      borrow: "Borrow {{value}}%",
      long: "LONG",
      short: "SHORT",
      history: "History +{{bars}}",
      zoom: "Zoom {{value}}x",
    },
    controls: {
      indicators: "Indicators",
      log: "Log",
      autoScale: "Auto Scale",
      prev1D: "Prev 1D",
      next1D: "Next 1D",
      latest: "Latest",
      resetZoom: "Reset Zoom",
    },
    ohlcv: {
      open: "O",
      high: "H",
      low: "L",
      close: "C",
      volume: "Vol",
    },
    actions: {
      settings: "Settings",
      remove: "Remove",
      close: "Close",
    },
    indicatorMenu: {
      ma20: "MA Fast",
      ma50: "MA Slow",
      vwap: "VWAP",
      macd: "MACD",
    },
    indicatorEditor: {
      maFastSettings: "MA Fast Settings",
      maSlowSettings: "MA Slow Settings",
      macdSettings: "MACD Settings",
      vwap: "VWAP",
      period: "Period",
      fast: "Fast",
      slow: "Slow",
      signal: "Signal",
      vwapNote: "Continuous VWAP is applied across session boundaries.",
    },
  },
};
