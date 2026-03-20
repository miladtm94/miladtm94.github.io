---
title: "InvestIQ — Investment Portfolio Tracker"
excerpt: "Full-stack investment intelligence platform for Australian investors: unified portfolio tracking across equities, ETFs, crypto, and bonds; ATO-compliant tax reporting (CGT, FIFO/LIFO/HIFO); AI advisor powered by Claude with agentic tool-use; FastAPI backend + Next.js frontend."
collection: portfolio
category: software
date: 2025-01-01
codeurl: "https://github.com/miladtm94/Investment-Portfolio-Tracker"
---

**Stack:** Python · FastAPI · Next.js · PostgreSQL · Claude (Anthropic) &nbsp;&middot;&nbsp; **License:** MIT

## Overview

InvestIQ is an open-source investment intelligence platform built for Australian investors. It provides unified multi-account portfolio tracking, AI-powered insights, and ATO-compliant tax reporting across equities, ETFs, bonds, cryptocurrency, and stablecoins.

**Key features:**
- **Multi-account Aggregation** — Event-sourcing architecture for point-in-time portfolio reconstruction with AUD base currency
- **ATO Tax Compliance** — Full Australian tax rules: 50% CGT discount (≥12 months), FIFO/LIFO/HIFO cost basis, ATO Schedule 3 output
- **Analytics Engine** — Performance (CAGR, TWR, XIRR), risk (Sharpe, Sortino, VaR), and allocation benchmarking
- **Data Integrations** — Bank statement import (CBA, ANZ, Westpac, NAB); broker sync via Plaid, Kraken, Coinbase, Binance; RBA exchange rates
- **AI Advisor** — Claude-powered chatbot with tool-use loops for data-grounded portfolio insights
- **Deployment** — Docker Compose, Kubernetes-ready, Celery task queue with Beat scheduler

**Technologies:** Python · FastAPI · SQLAlchemy · PostgreSQL · Redis · Next.js · React · TypeScript · TailwindCSS · Claude API · Docker
