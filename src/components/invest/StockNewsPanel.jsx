import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { SECTORS } from "../../simulator/constants";

const NEWS_SUBTABS = [
  { id: "news" },
  { id: "filings" },
];

const NOISE_HEADLINE_TOKENS = [
  "Open",
  "Scenario Loaded",
  "Sector Leadership Initialized",
];

export function StockNewsPanel({ engine, state, asset }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    setActiveTab("news");
  }, [asset?.symbol]);

  const newsFeed = useMemo(
    () => buildStockNewsFeed(engine, state, asset, t),
    [engine, state.news, state.day, state.marketMinute, asset?.symbol, asset?.sector, asset?.name, t],
  );

  return (
    <div className="stock-news-shell">
      <aside className="stock-news-sidebar">
        <div className="stock-news-sidebar-card">
          <div
            className="stock-news-sidebar-nav"
            role="tablist"
            aria-label={t("stockNews.aria.sections")}
          >
            {NEWS_SUBTABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`stock-news-nav-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {t(`stockNews.tabs.${tab.id}`)}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="stock-news-content">
        {activeTab === "news" ? (
          <div className="stock-news-board">
            <header className="stock-news-header">
              <div className="stock-news-header-copy">
                <div className="stock-news-eyebrow">
                  {asset.symbol} · {SECTORS[asset.sector]?.name || asset.sector}
                </div>
                <h2>{t("stockNews.header.title", { name: asset.name })}</h2>
                <div className="stock-news-subcopy">{t("stockNews.header.subcopy")}</div>
              </div>
              <div className="stock-news-sort-pill">{t("stockNews.header.latest")}</div>
            </header>

            <div className="stock-news-stage">
              <div className="stock-news-list">
                {newsFeed.items.length ? (
                  newsFeed.items.map((item) => (
                    <article className="stock-news-item-card" key={item.id}>
                      <div className="stock-news-item-head">
                        <span className={`badge ${item.severity}`}>{item.badge}</span>
                        <span className="stock-news-item-meta">
                          {item.ageLabel} · {item.sourceLabel}
                        </span>
                      </div>
                      <div className="stock-news-item-title">{item.headline}</div>
                      <div className="stock-news-item-body">{item.body}</div>
                    </article>
                  ))
                ) : (
                  <div className="stock-news-empty">{t("stockNews.empty")}</div>
                )}
              </div>

              <aside className="stock-news-rail">
                {newsFeed.featured.length ? (
                  newsFeed.featured.map((item) => (
                    <article
                      className={`stock-news-feature-card ${item.visualTone}`}
                      key={`featured-${item.id}`}
                    >
                      <div className="stock-news-feature-badge-row">
                        <span className={`badge ${item.severity}`}>{item.badge}</span>
                        <span>{item.ageLabel}</span>
                      </div>
                      <div className="stock-news-feature-title">{item.featureTitle}</div>
                      <div className="stock-news-feature-caption">{item.sourceLabel}</div>
                    </article>
                  ))
                ) : (
                  <article className="stock-news-feature-card muted-card">
                    <div className="stock-news-feature-badge-row">
                      <span className="badge neutral">{t("stockNews.featured.waiting")}</span>
                    </div>
                    <div className="stock-news-feature-title">{t("stockNews.featured.noneTitle")}</div>
                    <div className="stock-news-feature-caption">
                      {t("stockNews.featured.noneCaption")}
                    </div>
                  </article>
                )}
              </aside>
            </div>
          </div>
        ) : (
          <div className="stock-news-todo-shell">
            <article className="stock-news-todo-card">
              <div className="stock-news-todo-title">{t("stockNews.todo.title")}</div>
              <div className="stock-news-todo-copy">{t("stockNews.todo.copy")}</div>
              <div className="stock-news-todo-list">
                {["0", "1", "2"].map((index) => (
                  <div className="stock-news-todo-item" key={index}>
                    {t(`stockNews.todo.items.${index}`)}
                  </div>
                ))}
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}

function buildStockNewsFeed(engine, state, asset, t) {
  const items = [...(state?.news || [])]
    .filter((item) => isRelevantNewsItem(engine, item, asset))
    .sort(compareNewsItems)
    .slice(0, 18)
    .map((item) => {
      const relation = classifyRelation(engine, item, asset, t);
      return {
        ...item,
        badge: relation.badge,
        sourceLabel: relation.sourceLabel,
        ageLabel: formatNewsAge(state, item, t),
        visualTone: relation.visualTone,
        featureTitle: buildFeatureTitle(item),
      };
    });

  return {
    items,
    featured: items.slice(0, 4),
  };
}

function isRelevantNewsItem(engine, item, asset) {
  if (!item || !asset) return false;
  if (isNoiseItem(item)) return false;

  const directMatch = item.symbol === asset.symbol || item.scope === asset.symbol;
  if (directMatch) return true;

  if (item.scope === "Macro") return true;

  if (item.scope === "System") return false;

  const sector = engine.newsSector(item);
  return sector === asset.sector;
}

function isNoiseItem(item) {
  if (!item) return true;
  if (item.scope !== "System") return false;
  return NOISE_HEADLINE_TOKENS.some((token) => String(item.headline || "").includes(token));
}

function compareNewsItems(a, b) {
  const dayDiff = Number(b?.day || 0) - Number(a?.day || 0);
  if (dayDiff !== 0) return dayDiff;
  return Number(b?.minute || 0) - Number(a?.minute || 0);
}

function classifyRelation(engine, item, asset, t) {
  if (item.symbol === asset.symbol || item.scope === asset.symbol) {
    return {
      badge: t("stockNews.relation.direct"),
      sourceLabel: t("stockNews.source.symbolDesk", { name: asset.name }),
      visualTone: "symbol",
    };
  }

  if (item.scope === "Macro") {
    return {
      badge: t("stockNews.relation.macro"),
      sourceLabel: t("stockNews.source.macroDesk"),
      visualTone: "macro",
    };
  }

  const sector = engine.newsSector(item);
  if (sector === asset.sector) {
    return {
      badge: t("stockNews.relation.sector"),
      sourceLabel: t("stockNews.source.sectorWatch", {
        sector: SECTORS[sector]?.name || sector,
      }),
      visualTone: sector.toLowerCase(),
    };
  }

  return {
    badge: t("stockNews.relation.market"),
    sourceLabel: t("stockNews.source.marketDesk"),
    visualTone: "neutral",
  };
}

function formatNewsAge(state, item, t) {
  const dayDelta = Math.max(0, Number(state?.day || 0) - Number(item?.day || 0));
  const minuteDelta = Math.max(0, Number(state?.marketMinute || 0) - Number(item?.minute || 0));
  const totalMinutes = dayDelta * 390 + minuteDelta;

  if (totalMinutes < 60) return t("stockNews.age.minutesAgo", { value: Math.max(1, totalMinutes) });
  if (totalMinutes < 390) return t("stockNews.age.hoursAgo", { value: Math.floor(totalMinutes / 60) });
  return t("stockNews.age.daysAgo", { value: Math.floor(totalMinutes / 390) });
}

function buildFeatureTitle(item) {
  const headline = String(item?.headline || "");
  if (headline.length <= 54) return headline;
  return `${headline.slice(0, 54)}...`;
}
