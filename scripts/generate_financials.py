import json
import math
import random
from datetime import date

START_YEAR = 2016
END_YEAR = 2025

SYMBOLS = [
    {"symbol": "ALP", "sector": "AI", "base_revenue": 1800, "base_growth": 0.16, "op_margin": 0.24, "net_margin": 0.16, "pe": 38, "de_ratio": 0.42, "dividend": 0.16},
    {"symbol": "SYN", "sector": "AI", "base_revenue": 1450, "base_growth": 0.14, "op_margin": 0.22, "net_margin": 0.14, "pe": 34, "de_ratio": 0.46, "dividend": 0.14},
    {"symbol": "QNT", "sector": "SEMI", "base_revenue": 2100, "base_growth": 0.12, "op_margin": 0.2, "net_margin": 0.13, "pe": 28, "de_ratio": 0.5, "dividend": 0.22},
    {"symbol": "FAB", "sector": "SEMI", "base_revenue": 1720, "base_growth": 0.1, "op_margin": 0.18, "net_margin": 0.11, "pe": 23, "de_ratio": 0.56, "dividend": 0.28},
    {"symbol": "BIO", "sector": "BIO", "base_revenue": 980, "base_growth": 0.13, "op_margin": 0.15, "net_margin": 0.08, "pe": 32, "de_ratio": 0.62, "dividend": 0.06},
    {"symbol": "CRN", "sector": "BIO", "base_revenue": 760, "base_growth": 0.11, "op_margin": 0.13, "net_margin": 0.06, "pe": 30, "de_ratio": 0.68, "dividend": 0.04},
    {"symbol": "ENR", "sector": "ENR", "base_revenue": 2600, "base_growth": 0.07, "op_margin": 0.17, "net_margin": 0.1, "pe": 16, "de_ratio": 0.72, "dividend": 0.72},
    {"symbol": "OIL", "sector": "ENR", "base_revenue": 2200, "base_growth": 0.06, "op_margin": 0.16, "net_margin": 0.095, "pe": 14, "de_ratio": 0.78, "dividend": 0.78},
    {"symbol": "RET", "sector": "CONS", "base_revenue": 1900, "base_growth": 0.08, "op_margin": 0.14, "net_margin": 0.085, "pe": 20, "de_ratio": 0.7, "dividend": 0.5},
    {"symbol": "PAY", "sector": "CONS", "base_revenue": 1700, "base_growth": 0.09, "op_margin": 0.16, "net_margin": 0.1, "pe": 24, "de_ratio": 0.62, "dividend": 0.36},
    {"symbol": "MEM", "sector": "MEME", "base_revenue": 520, "base_growth": 0.19, "op_margin": 0.11, "net_margin": 0.045, "pe": 42, "de_ratio": 0.55, "dividend": 0.0},
]

Q_END = {
    1: (3, 31),
    2: (6, 30),
    3: (9, 30),
    4: (12, 31),
}

SEASONAL = {1: 0.96, 2: 1.01, 3: 0.99, 4: 1.04}


def soft_round(v, digits=2):
    return round(float(v), digits)


def quarter_start(year, q):
    month = {1: 1, 2: 4, 3: 7, 4: 10}[q]
    return date(year, month, 1).isoformat()


def quarter_end(year, q):
    m, d = Q_END[q]
    return date(year, m, d).isoformat()


def generate_symbol(profile, seed):
    rng = random.Random(seed)
    symbol = profile["symbol"]

    shares = rng.uniform(420, 980) * 1_000_000
    revenue = profile["base_revenue"] * rng.uniform(0.9, 1.12)
    assets = revenue * rng.uniform(1.9, 2.35)
    de_ratio = profile["de_ratio"] * rng.uniform(0.92, 1.08)

    quarterly = []
    yearly = []

    quarter_key_to_revenue = {}

    q_index = 0
    for year in range(START_YEAR, END_YEAR + 1):
        y_revenue = 0.0
        y_op = 0.0
        y_net = 0.0
        y_fcf = 0.0
        y_div = 0.0

        latest_q = None

        for q in range(1, 5):
            cyc = math.sin((q_index / 7.5) + (0.6 if profile["sector"] in ["AI", "SEMI"] else 0.0)) * 0.03
            quarter_growth = ((1 + profile["base_growth"]) ** (1 / 4) - 1)
            shock = rng.gauss(0, 0.018)
            revenue *= max(0.86, 1 + quarter_growth + cyc + shock)
            revenue *= SEASONAL[q]

            op_margin = profile["op_margin"] + rng.gauss(0, 0.013) + cyc * 0.28
            net_margin = profile["net_margin"] + rng.gauss(0, 0.011) + cyc * 0.18
            op_margin = min(0.42, max(0.03, op_margin))
            net_margin = min(op_margin - 0.01, max(-0.03, net_margin))

            operating_income = revenue * op_margin
            net_income = revenue * net_margin

            assets *= max(0.92, 1 + quarter_growth * 0.48 + rng.gauss(0, 0.01))
            de_ratio = min(2.2, max(0.05, de_ratio + rng.gauss(0, 0.025)))
            equity = assets / (1 + de_ratio)
            liabilities = assets - equity

            fcf = net_income * (0.78 + rng.uniform(-0.18, 0.32))
            dividend_per_share = 0.0 if profile["dividend"] == 0 else max(0.0, profile["dividend"] * rng.uniform(0.82, 1.18) / 4)
            eps = net_income * 1_000_000 / shares
            bps = equity * 1_000_000 / shares
            synthetic_price = max(1.0, eps * profile["pe"] * (1 + rng.gauss(0, 0.09)))

            per = synthetic_price / eps if eps > 0 else None
            pbr = synthetic_price / bps if bps > 0 else None
            div_yield = dividend_per_share / synthetic_price if synthetic_price > 0 else 0
            roe = (net_income * 4) / equity if equity > 0 else 0

            same_q_last_year = quarter_key_to_revenue.get((year - 1, q))
            revenue_yoy = ((revenue / same_q_last_year) - 1) if same_q_last_year else None
            quarter_key_to_revenue[(year, q)] = revenue

            entry = {
                "period": f"{year}-Q{q}",
                "year": year,
                "quarter": q,
                "startDate": quarter_start(year, q),
                "endDate": quarter_end(year, q),
                "revenue": soft_round(revenue, 2),
                "operatingIncome": soft_round(operating_income, 2),
                "netIncome": soft_round(net_income, 2),
                "eps": soft_round(eps, 4),
                "assets": soft_round(assets, 2),
                "liabilities": soft_round(liabilities, 2),
                "equity": soft_round(equity, 2),
                "freeCashFlow": soft_round(fcf, 2),
                "dividendPerShare": soft_round(dividend_per_share, 4),
                "per": soft_round(per, 2) if per is not None else None,
                "pbr": soft_round(pbr, 2) if pbr is not None else None,
                "dividendYield": soft_round(div_yield, 4),
                "roe": soft_round(roe, 4),
                "debtToEquity": soft_round(de_ratio, 4),
                "netMargin": soft_round(net_margin, 4),
                "revenueYoY": soft_round(revenue_yoy, 4) if revenue_yoy is not None else None,
            }
            quarterly.append(entry)

            y_revenue += revenue
            y_op += operating_income
            y_net += net_income
            y_fcf += fcf
            y_div += dividend_per_share
            latest_q = entry
            q_index += 1

        if latest_q:
            annual_roe = (y_net / latest_q["equity"]) if latest_q["equity"] > 0 else 0
            annual_net_margin = (y_net / y_revenue) if y_revenue > 0 else 0
            yearly.append(
                {
                    "period": f"{year}",
                    "year": year,
                    "endDate": date(year, 12, 31).isoformat(),
                    "revenue": soft_round(y_revenue, 2),
                    "operatingIncome": soft_round(y_op, 2),
                    "netIncome": soft_round(y_net, 2),
                    "freeCashFlow": soft_round(y_fcf, 2),
                    "dividendPerShare": soft_round(y_div, 4),
                    "assets": latest_q["assets"],
                    "liabilities": latest_q["liabilities"],
                    "equity": latest_q["equity"],
                    "per": latest_q["per"],
                    "pbr": latest_q["pbr"],
                    "dividendYield": latest_q["dividendYield"],
                    "roe": soft_round(annual_roe, 4),
                    "debtToEquity": latest_q["debtToEquity"],
                    "netMargin": soft_round(annual_net_margin, 4),
                }
            )

    return {
        "symbol": symbol,
        "quarterly": quarterly,
        "yearly": yearly,
    }


def to_js_module(data):
    blob = json.dumps(data, ensure_ascii=True, indent=2)
    return "/* eslint-disable */\n" + "export const FINANCIAL_STATEMENTS = " + blob + ";\n"


def main():
    out = {}
    for idx, profile in enumerate(SYMBOLS):
        out[profile["symbol"]] = generate_symbol(profile, seed=2048 + idx * 37)

    content = to_js_module(out)
    with open("src/simulator/financials.generated.js", "w", encoding="utf-8") as f:
        f.write(content)


if __name__ == "__main__":
    main()
