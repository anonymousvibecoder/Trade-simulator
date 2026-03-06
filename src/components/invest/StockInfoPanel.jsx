import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { SECTORS } from "../../simulator/constants";
import { getStockProfileBase } from "../../simulator/stockProfiles";
import { fmtMoney } from "../../simulator/utils";

const STOCK_INFO_SECTIONS = [
  { id: "overview" },
  { id: "financials" },
  { id: "earnings" },
  { id: "dividends" },
];

const INCOME_ROWS = [
  { id: "revenue", key: "revenue", formatter: formatFinancialCurrency },
  { id: "operatingIncome", key: "operatingIncome", formatter: formatFinancialCurrency },
  { id: "netIncome", key: "netIncome", formatter: formatFinancialCurrency },
  { id: "eps", key: "eps", formatter: formatPerShare },
];

const BALANCE_ROWS = [
  { id: "assets", key: "assets", formatter: formatFinancialCurrency },
  { id: "liabilities", key: "liabilities", formatter: formatFinancialCurrency },
  { id: "equity", key: "equity", formatter: formatFinancialCurrency },
  { id: "freeCashFlow", key: "freeCashFlow", formatter: formatFinancialCurrency },
];

export function StockInfoPanel({ asset, calendarDate }) {
  const { t, get, language } = useI18n();
  const contentRef = useRef(null);
  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState(STOCK_INFO_SECTIONS[0].id);

  const baseProfile = useMemo(
    () => getStockProfileBase(asset),
    [asset?.symbol, asset?.name, asset?.sector],
  );
  const profile = useMemo(
    () => localizeProfile(baseProfile, asset, get),
    [baseProfile, asset?.symbol, asset?.sector, get],
  );
  const model = useMemo(
    () => buildStockInfoModel(asset, calendarDate, profile, t, language),
    [asset, calendarDate, profile, t, language],
  );

  useEffect(() => {
    setActiveSection(STOCK_INFO_SECTIONS[0].id);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [asset?.symbol]);

  const handleSectionJump = (id) => {
    const container = contentRef.current;
    const node = sectionRefs.current[id];
    if (!container || !node) return;
    setActiveSection(id);
    container.scrollTo({
      top: Math.max(0, node.offsetTop - 8),
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = contentRef.current;
    if (!container) return;

    let nextSection = STOCK_INFO_SECTIONS[0].id;
    let nextDistance = Number.POSITIVE_INFINITY;
    for (const section of STOCK_INFO_SECTIONS) {
      const node = sectionRefs.current[section.id];
      if (!node) continue;
      const distance = Math.abs(node.offsetTop - container.scrollTop - 24);
      if (distance < nextDistance) {
        nextDistance = distance;
        nextSection = section.id;
      }
    }
    setActiveSection((prev) => (prev === nextSection ? prev : nextSection));
  };

  return (
    <div className="stock-info-shell">
      <aside className="stock-info-sidebar">
        <div className="stock-info-sidebar-card">
          <div className="stock-info-sidebar-title">{t("stockInfo.navTitle")}</div>
          <div className="stock-info-sidebar-nav" role="tablist" aria-label={t("stockInfo.navTitle")}>
            {STOCK_INFO_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={activeSection === section.id}
                className={`stock-info-nav-button ${activeSection === section.id ? "active" : ""}`}
                onClick={() => handleSectionJump(section.id)}
              >
                {t(`stockInfo.sections.${section.id}`)}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="stock-info-content" ref={contentRef} onScroll={handleScroll}>
        <section
          className="stock-info-section"
          ref={(node) => {
            sectionRefs.current.overview = node;
          }}
        >
          <header className="stock-info-hero">
            <div className="stock-info-headline">
              <div className="stock-info-eyebrow">
                {profile.country} · {asset.symbol} · {baseProfile.exchange}
              </div>
              <div className="stock-info-title-row">
                <div>
                  <h2>{asset.name}</h2>
                  <div className="stock-info-legal-name">{baseProfile.legalName}</div>
                </div>
                <span className={`badge ${SECTORS[asset.sector]?.tone || "neutral"}`}>
                  {SECTORS[asset.sector]?.name || asset.sector}
                </span>
              </div>
              <div className="stock-info-source">
                {t("stockInfo.hero.source", { value: profile.source })}
              </div>
            </div>
            <a
              className="stock-info-link"
              href={baseProfile.website}
              target="_blank"
              rel="noreferrer"
            >
              {t("stockInfo.hero.website")}
            </a>
          </header>

          <article className="stock-info-summary-card">
            <p>{profile.overview}</p>
          </article>

          <div className="stock-info-fact-grid">
            {model.identityRows.map((item) => (
              <div className="stock-info-fact-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                {item.subvalue ? <small>{item.subvalue}</small> : null}
              </div>
            ))}
          </div>

          <article className="stock-info-card">
            <div className="stock-info-card-head">
              <div>
                <div className="stock-info-card-title">{t("stockInfo.overview.title")}</div>
                <div className="stock-info-card-meta">{t("stockInfo.overview.meta")}</div>
              </div>
            </div>
            <div className="stock-info-highlight-list">
              {profile.highlights.map((line) => (
                <div className="stock-info-highlight-pill" key={line}>
                  {line}
                </div>
              ))}
            </div>
          </article>

          <article className="stock-info-card">
            <div className="stock-info-card-head">
              <div>
                <div className="stock-info-card-title">{t("stockInfo.overview.mixTitle")}</div>
                <div className="stock-info-card-meta">
                  {t("stockInfo.overview.mixMeta", { date: baseProfile.revenueMixDate })}
                </div>
              </div>
            </div>
            <div className="stock-info-mix-layout">
              <div className="stock-info-donut-shell">
                <div
                  className="stock-info-donut"
                  style={{ background: buildMixGradient(profile.revenueMix) }}
                >
                  <div className="stock-info-donut-core">
                    <span>{t("stockInfo.overview.mixCenter")}</span>
                    <strong>{asset.symbol}</strong>
                  </div>
                </div>
              </div>
              <div className="stock-info-mix-legend">
                {profile.revenueMix.map((slice) => (
                  <div className="stock-info-mix-row" key={slice.id}>
                    <span className="stock-info-mix-label">
                      <span
                        className="stock-info-mix-dot"
                        style={{ backgroundColor: slice.color }}
                      />
                      {slice.label}
                    </span>
                    <strong>{formatPercentNumber(slice.value / 100)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section
          className="stock-info-section"
          ref={(node) => {
            sectionRefs.current.financials = node;
          }}
        >
          <div className="stock-info-section-head">
            <div>
              <div className="stock-info-section-title">{t("stockInfo.financials.title")}</div>
              <div className="stock-info-card-meta">{formatAsOf(calendarDate, t)}</div>
            </div>
          </div>

          <div className="stock-info-metric-panels">
            {model.metricPanels.map((panel) => (
              <article className="stock-info-metric-panel" key={panel.title}>
                <div className="stock-info-metric-panel-head">
                  <strong>{panel.title}</strong>
                  {panel.meta ? <span>{panel.meta}</span> : null}
                </div>
                <div className="stock-info-metric-rows">
                  {panel.rows.map((row) => (
                    <div className="stock-info-metric-row" key={row.label}>
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="stock-info-kpi-grid">
            {model.qualityCards.map((card) => (
              <article
                className={`stock-info-kpi-card ${card.tone || "neutral"}`}
                key={card.label}
              >
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.caption}</small>
              </article>
            ))}
          </div>
        </section>

        <section
          className="stock-info-section"
          ref={(node) => {
            sectionRefs.current.earnings = node;
          }}
        >
          <div className="stock-info-section-head">
            <div>
              <div className="stock-info-section-title">{t("stockInfo.earnings.title")}</div>
              <div className="stock-info-card-meta">{t("stockInfo.earnings.meta")}</div>
            </div>
          </div>

          <div className="stock-info-kpi-grid">
            {model.earningsCards.map((card) => (
              <article
                className={`stock-info-kpi-card ${card.tone || "neutral"}`}
                key={card.label}
              >
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.caption}</small>
              </article>
            ))}
          </div>

          <StatementTable
            title={t("stockInfo.earnings.incomeStatement")}
            quarters={model.recentQuarters}
            rows={INCOME_ROWS}
            t={t}
            language={language}
          />
          <StatementTable
            title={t("stockInfo.earnings.balanceStatement")}
            quarters={model.recentQuarters}
            rows={BALANCE_ROWS}
            t={t}
            language={language}
          />
        </section>

        <section
          className="stock-info-section"
          ref={(node) => {
            sectionRefs.current.dividends = node;
          }}
        >
          <div className="stock-info-section-head">
            <div>
              <div className="stock-info-section-title">{t("stockInfo.dividends.title")}</div>
              <div className="stock-info-card-meta">{t("stockInfo.dividends.meta")}</div>
            </div>
          </div>

          <article className="stock-info-dividend-hero">
            <div className="stock-info-dividend-main">
              <span>{t("stockInfo.dividends.last12Months")}</span>
              <strong>{formatPerShare(model.annualDividend)}</strong>
              <small>{profile.dividendNote}</small>
            </div>
            <div className="stock-info-dividend-stats">
              <div className="stock-info-dividend-stat">
                <span>{t("stockInfo.metrics.frequency")}</span>
                <strong>{model.dividendFrequencyLabel}</strong>
              </div>
              <div className="stock-info-dividend-stat">
                <span>{t("stockInfo.metrics.yield")}</span>
                <strong>{formatPercentNumber(model.dividendYield)}</strong>
              </div>
              <div className="stock-info-dividend-stat">
                <span>{t("stockInfo.dividends.payoutRatio")}</span>
                <strong>{formatPercentNumber(model.payoutRatio)}</strong>
              </div>
            </div>
          </article>

          <DataTable
            title={t("stockInfo.dividends.annualTrend")}
            columns={[
              { key: "year", label: t("stockInfo.statements.year") },
              { key: "payments", label: t("stockInfo.statements.payments") },
              { key: "dps", label: t("stockInfo.statements.payment") },
              { key: "yield", label: t("stockInfo.statements.yieldOnPrice") },
            ]}
            rows={model.annualDividendRows}
          />

          <DataTable
            title={t("stockInfo.dividends.recentHistory")}
            columns={[
              { key: "period", label: t("stockInfo.statements.period") },
              { key: "payment", label: t("stockInfo.statements.payment") },
              { key: "yield", label: t("stockInfo.statements.indicatedYield") },
            ]}
            rows={model.recentDividendRows}
          />
        </section>
      </div>
    </div>
  );
}

function StatementTable({ title, quarters, rows, t, language }) {
  return (
    <article className="stock-info-table-card">
      <div className="stock-info-card-head">
        <div className="stock-info-card-title">{title}</div>
      </div>
      <div className="stock-info-table-wrap">
        <table className="stock-info-table">
          <thead>
            <tr>
              <th>{t("stockInfo.statements.item")}</th>
              {quarters.map((quarter) => (
                <th key={quarter.period}>{compactPeriodLabel(quarter.period, language)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{t(`stockInfo.statements.${row.id}`)}</td>
                {quarters.map((quarter) => (
                  <td key={`${quarter.period}-${row.key}`}>{row.formatter(quarter[row.key], language, t)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function DataTable({ title, columns, rows }) {
  return (
    <article className="stock-info-table-card">
      <div className="stock-info-card-head">
        <div className="stock-info-card-title">{title}</div>
      </div>
      <div className="stock-info-table-wrap">
        <table className="stock-info-table compact">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${title}-${rowIndex}`}>
                {columns.map((column) => (
                  <td key={column.key}>{row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function localizeProfile(baseProfile, asset, get) {
  const symbolPath = `stockProfiles.symbols.${asset?.symbol}`;
  const fallbackPath = `stockProfiles.fallback.${asset?.sector}`;
  const country = get(
    `stockProfiles.common.countries.${baseProfile.countryCode}`,
    baseProfile.countryCode,
  );
  const source = get("stockProfiles.common.syntheticSource", "Synthetic in-game company profile");
  const overview = get(`${symbolPath}.overview`, get(`${fallbackPath}.overview`, ""));
  const highlights = get(`${symbolPath}.highlights`, get(`${fallbackPath}.highlights`, []));
  const dividendNote = get(
    `${symbolPath}.dividendNote`,
    get(`${fallbackPath}.dividendNote`, ""),
  );
  const revenueMix = baseProfile.revenueMix.map((slice) => ({
    ...slice,
    label: get(
      `${symbolPath}.revenueMix.${slice.id}`,
      get(`${fallbackPath}.revenueMix.${slice.id}`, slice.id),
    ),
  }));

  return {
    ...baseProfile,
    country,
    source,
    overview,
    highlights,
    dividendNote,
    revenueMix,
  };
}

function buildStockInfoModel(asset, calendarDate, profile, t, language) {
  const quarters = Array.isArray(asset?.financials?.quarterly)
    ? asset.financials.quarterly
    : [];
  const quarterIndex = findQuarterIndex(quarters, calendarDate);
  const currentQuarter = quarters[quarterIndex] || null;
  const recentQuarters = quarters.slice(Math.max(0, quarterIndex - 5), quarterIndex + 1);
  const trailingQuarters = quarters.slice(Math.max(0, quarterIndex - 3), quarterIndex + 1);
  const previousTrailingQuarters = quarters.slice(
    Math.max(0, quarterIndex - 7),
    Math.max(0, quarterIndex - 3),
  );
  const trailingRevenue = sumQuarterField(trailingQuarters, "revenue");
  const trailingOperatingIncome = sumQuarterField(trailingQuarters, "operatingIncome");
  const trailingNetIncome = sumQuarterField(trailingQuarters, "netIncome");
  const trailingFcf = sumQuarterField(trailingQuarters, "freeCashFlow");
  const trailingEps = sumQuarterField(trailingQuarters, "eps");
  const annualDividend = sumQuarterField(trailingQuarters, "dividendPerShare");
  const sharesOutstanding = deriveSharesOutstanding(currentQuarter);
  const marketCap = Number.isFinite(sharesOutstanding)
    ? sharesOutstanding * Number(asset?.price || 0)
    : null;
  const bps =
    Number.isFinite(sharesOutstanding) && sharesOutstanding > 0 && currentQuarter
      ? currentQuarter.equity / sharesOutstanding
      : null;
  const psr =
    Number.isFinite(marketCap) && trailingRevenue > 0
      ? marketCap / trailingRevenue
      : deriveQuarterPsr(currentQuarter);
  const per =
    trailingEps > 0 ? Number(asset?.price || 0) / trailingEps : numberOrNull(currentQuarter?.per);
  const pbr =
    Number.isFinite(bps) && bps > 0
      ? Number(asset?.price || 0) / bps
      : numberOrNull(currentQuarter?.pbr);
  const dividendYield =
    annualDividend > 0 && Number(asset?.price || 0) > 0
      ? annualDividend / Number(asset.price)
      : inferAnnualDividendYield(currentQuarter);
  const payoutRatio = trailingEps > 0 ? annualDividend / trailingEps : null;
  const priorRevenue = sumQuarterField(previousTrailingQuarters, "revenue");
  const revenueGrowth =
    previousTrailingQuarters.length >= 4 && priorRevenue > 0
      ? (trailingRevenue - priorRevenue) / priorRevenue
      : numberOrNull(currentQuarter?.revenueYoY);
  const netMargin = trailingRevenue > 0 ? trailingNetIncome / trailingRevenue : null;
  const operatingMargin =
    trailingRevenue > 0 ? trailingOperatingIncome / trailingRevenue : null;
  const fcfMargin = trailingRevenue > 0 ? trailingFcf / trailingRevenue : null;
  const debtToEquity = numberOrNull(currentQuarter?.debtToEquity);
  const roe = numberOrNull(currentQuarter?.roe);
  const dividendFrequency = trailingQuarters.filter(
    (quarter) => numberOrZero(quarter.dividendPerShare) > 0,
  ).length;
  const dividendMonths = trailingQuarters
    .filter((quarter) => numberOrZero(quarter.dividendPerShare) > 0)
    .map((quarter) => quarterToMonthLabel(quarter.quarter, t));
  const frequencyDetail =
    dividendFrequency > 0
      ? t("stockInfo.dividends.detailedFrequency", {
          count: dividendFrequency,
          months: dividendMonths.join(", "),
        })
      : t("stockInfo.dividends.none");

  return {
    identityRows: [
      {
        label: t("stockInfo.facts.marketCap"),
        value: formatFinancialCurrency(marketCap, language),
        subvalue: formatAsOf(calendarDate, t),
      },
      {
        label: t("stockInfo.facts.sharesOutstanding"),
        value: formatShareCount(sharesOutstanding, language, t),
        subvalue: currentQuarter
          ? t("stockInfo.facts.estimatedFromQuarter", { period: currentQuarter.period })
          : null,
      },
      {
        label: t("stockInfo.facts.companyName"),
        value: profile.legalName,
        subvalue: `${profile.country} · ${profile.exchange}`,
      },
      {
        label: t("stockInfo.facts.ceo"),
        value: profile.ceo,
        subvalue: t("stockInfo.facts.foundedYear", { year: profile.foundedYear }),
      },
      {
        label: t("stockInfo.facts.listedDate"),
        value: profile.listedDate,
        subvalue: t("stockInfo.facts.listedAs", { symbol: asset.symbol }),
      },
      {
        label: t("stockInfo.facts.currentPrice"),
        value: fmtMoney(Number(asset?.price || 0)),
        subvalue: `${asset.name}`,
      },
    ],
    metricPanels: [
      {
        title: t("stockInfo.financials.valuation"),
        rows: [
          { label: t("stockInfo.metrics.per"), value: formatMultiple(per, t) },
          { label: t("stockInfo.metrics.psr"), value: formatMultiple(psr, t) },
          { label: t("stockInfo.metrics.pbr"), value: formatMultiple(pbr, t) },
        ],
      },
      {
        title: t("stockInfo.financials.profitability"),
        rows: [
          { label: t("stockInfo.metrics.eps"), value: formatPerShare(trailingEps) },
          { label: t("stockInfo.metrics.bps"), value: formatPerShare(bps) },
          { label: t("stockInfo.metrics.roe"), value: formatPercentNumber(roe) },
        ],
      },
      {
        title: t("stockInfo.financials.dividends"),
        meta: t("stockInfo.financials.last12Months"),
        rows: [
          { label: t("stockInfo.metrics.frequency"), value: frequencyDetail },
          { label: t("stockInfo.metrics.dividendPerShare"), value: formatPerShare(annualDividend) },
          { label: t("stockInfo.metrics.yield"), value: formatPercentNumber(dividendYield) },
        ],
      },
    ],
    qualityCards: [
      {
        label: t("stockInfo.metrics.revenueGrowth"),
        value: formatPercentNumber(revenueGrowth),
        caption: t("stockInfo.metrics.revenueGrowthCaption"),
        tone: toneForRatio(revenueGrowth),
      },
      {
        label: t("stockInfo.metrics.operatingMargin"),
        value: formatPercentNumber(operatingMargin),
        caption: t("stockInfo.metrics.trailingFourQuarters"),
        tone: toneForRatio(operatingMargin),
      },
      {
        label: t("stockInfo.metrics.netMargin"),
        value: formatPercentNumber(netMargin),
        caption: t("stockInfo.metrics.trailingFourQuarters"),
        tone: toneForRatio(netMargin),
      },
      {
        label: t("stockInfo.metrics.fcfMargin"),
        value: formatPercentNumber(fcfMargin),
        caption: t("stockInfo.metrics.cashGeneration"),
        tone: toneForRatio(fcfMargin),
      },
      {
        label: t("stockInfo.metrics.debtToEquity"),
        value: formatPercentNumber(debtToEquity),
        caption: "Debt / Equity",
        tone: toneForDebt(debtToEquity),
      },
      {
        label: t("stockInfo.metrics.sectorBeta"),
        value: `${Number(asset?.beta || 1).toFixed(2)}x`,
        caption: t("stockInfo.metrics.baseAssetSetting"),
        tone: asset?.beta > 1.2 ? "bad" : asset?.beta < 1 ? "good" : "neutral",
      },
    ],
    earningsCards: [
      {
        label: t("stockInfo.metrics.ttmRevenue"),
        value: formatFinancialCurrency(trailingRevenue, language),
        caption: t("stockInfo.metrics.trailingFourQuarters"),
        tone: toneForRatio(revenueGrowth),
      },
      {
        label: t("stockInfo.metrics.ttmOperatingIncome"),
        value: formatFinancialCurrency(trailingOperatingIncome, language),
        caption: t("stockInfo.metrics.profitabilityLeverage"),
        tone: toneForRatio(operatingMargin),
      },
      {
        label: t("stockInfo.metrics.ttmNetIncome"),
        value: formatFinancialCurrency(trailingNetIncome, language),
        caption: t("stockInfo.metrics.trailingFourQuarters"),
        tone: toneForRatio(netMargin),
      },
      {
        label: t("stockInfo.metrics.ttmFreeCashFlow"),
        value: formatFinancialCurrency(trailingFcf, language),
        caption: t("stockInfo.metrics.cashBasis"),
        tone: toneForRatio(fcfMargin),
      },
      {
        label: t("stockInfo.metrics.recentQuarterEps"),
        value: formatPerShare(currentQuarter?.eps),
        caption: currentQuarter ? currentQuarter.period : t("stockInfo.earnings.meta"),
        tone: toneForRatio(numberOrNull(currentQuarter?.eps)),
      },
      {
        label: t("stockInfo.metrics.recentQuarterRoe"),
        value: formatPercentNumber(roe),
        caption: currentQuarter ? currentQuarter.period : t("stockInfo.earnings.meta"),
        tone: toneForRatio(roe),
      },
    ],
    recentQuarters,
    annualDividend,
    dividendYield,
    payoutRatio,
    dividendFrequencyLabel:
      dividendFrequency > 0
        ? t("stockInfo.dividends.perYear", { count: dividendFrequency })
        : t("stockInfo.dividends.none"),
    annualDividendRows: buildAnnualDividendRows(quarters, asset?.price, quarterIndex, t),
    recentDividendRows: buildRecentDividendRows(quarters, quarterIndex),
  };
}

function findQuarterIndex(quarters, calendarDate) {
  if (!quarters.length) return 0;
  let selectedIndex = quarters.length - 1;
  for (let index = 0; index < quarters.length; index += 1) {
    if (quarters[index].endDate <= calendarDate) {
      selectedIndex = index;
      continue;
    }
    break;
  }
  return selectedIndex;
}

function buildAnnualDividendRows(quarters, currentPrice, quarterIndex, t) {
  const selected = quarters.slice(0, quarterIndex + 1);
  const byYear = new Map();

  for (const quarter of selected) {
    const year = quarter.year;
    const existing = byYear.get(year) || { year, payments: 0, dps: 0 };
    const dividend = numberOrZero(quarter.dividendPerShare);
    if (dividend > 0) existing.payments += 1;
    existing.dps += dividend;
    byYear.set(year, existing);
  }

  return Array.from(byYear.values())
    .slice(-5)
    .reverse()
    .map((item) => ({
      year: String(item.year),
      payments: t("stockInfo.dividends.perYear", { count: item.payments }).replace(" / year", "").replace(" / 년", ""),
      dps: formatPerShare(item.dps),
      yield:
        item.dps > 0 && Number(currentPrice || 0) > 0
          ? formatPercentNumber(item.dps / Number(currentPrice))
          : "-",
    }));
}

function buildRecentDividendRows(quarters, quarterIndex) {
  return quarters
    .slice(0, quarterIndex + 1)
    .filter((quarter) => numberOrZero(quarter.dividendPerShare) > 0)
    .slice(-8)
    .reverse()
    .map((quarter) => ({
      period: quarter.period,
      payment: formatPerShare(quarter.dividendPerShare),
      yield: formatPercentNumber(numberOrNull(quarter.dividendYield)),
    }));
}

function buildMixGradient(revenueMix) {
  const items = Array.isArray(revenueMix) ? revenueMix : [];
  if (!items.length) return "conic-gradient(#3d5c9b 0deg 360deg)";

  const total = items.reduce((sum, item) => sum + numberOrZero(item.value), 0) || 1;
  let cursor = 0;
  const segments = items.map((item) => {
    const start = cursor;
    cursor += (numberOrZero(item.value) / total) * 360;
    return `${item.color} ${start.toFixed(2)}deg ${cursor.toFixed(2)}deg`;
  });
  return `conic-gradient(${segments.join(", ")})`;
}

function sumQuarterField(quarters, key) {
  return quarters.reduce((sum, quarter) => sum + numberOrZero(quarter?.[key]), 0);
}

function deriveSharesOutstanding(quarter) {
  const netIncome = numberOrNull(quarter?.netIncome);
  const eps = numberOrNull(quarter?.eps);
  if (!Number.isFinite(netIncome) || !Number.isFinite(eps) || eps === 0) return null;
  return Math.abs(netIncome / eps);
}

function deriveQuarterPsr(quarter) {
  const direct = numberOrNull(quarter?.psr);
  if (Number.isFinite(direct) && direct > 0) return direct;

  const per = numberOrNull(quarter?.per);
  const netMargin = numberOrNull(quarter?.netMargin);
  if (Number.isFinite(per) && Number.isFinite(netMargin) && netMargin > 0) {
    return per * netMargin;
  }
  return null;
}

function inferAnnualDividendYield(quarter) {
  const dividendYield = numberOrNull(quarter?.dividendYield);
  if (!Number.isFinite(dividendYield)) return null;
  return dividendYield * 4;
}

function compactPeriodLabel(period, language) {
  const [year, quarter] = String(period || "").split("-");
  if (!year || !quarter) return period;
  if (language === "ko") return `${year.slice(2)}/${quarter}`;
  return `${quarter} ${year.slice(2)}`;
}

function quarterToMonthLabel(quarter, t) {
  if (quarter === 1) return t("stockInfo.months.q1");
  if (quarter === 2) return t("stockInfo.months.q2");
  if (quarter === 3) return t("stockInfo.months.q3");
  if (quarter === 4) return t("stockInfo.months.q4");
  return "-";
}

function localeFor(language) {
  return language === "ko" ? "ko-KR" : "en-US";
}

function formatFinancialCurrency(value, language) {
  if (!Number.isFinite(value)) return "-";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const locale = localeFor(language);
  if (abs >= 1000) {
    return `${sign}$${(abs / 1000).toLocaleString(locale, {
      minimumFractionDigits: abs >= 10000 ? 1 : 2,
      maximumFractionDigits: abs >= 10000 ? 1 : 2,
    })}B`;
  }
  return `${sign}$${abs.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}M`;
}

function formatPerShare(value) {
  if (!Number.isFinite(value)) return "-";
  return fmtMoney(value);
}

function formatShareCount(value, language, t) {
  if (!Number.isFinite(value)) return "-";
  const locale = localeFor(language);
  const formatted = value.toLocaleString(locale, {
    minimumFractionDigits: value >= 100 ? 1 : 2,
    maximumFractionDigits: value >= 100 ? 1 : 2,
  });
  return t("stockInfo.units.sharesMillion", { value: formatted });
}

function formatMultiple(value, t) {
  if (!Number.isFinite(value)) return "-";
  return t("stockInfo.units.multiple", { value: value.toFixed(1) });
}

function formatPercentNumber(value) {
  if (!Number.isFinite(value)) return "-";
  return `${(value * 100).toFixed(1)}%`;
}

function formatAsOf(value, t) {
  if (!value) return "-";
  return t("stockInfo.units.asOfDate", { date: value });
}

function toneForRatio(value) {
  if (!Number.isFinite(value)) return "neutral";
  if (value > 0.12) return "good";
  if (value < 0) return "bad";
  return "neutral";
}

function toneForDebt(value) {
  if (!Number.isFinite(value)) return "neutral";
  if (value < 0.55) return "good";
  if (value > 1.1) return "bad";
  return "neutral";
}

function numberOrZero(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function numberOrNull(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}
