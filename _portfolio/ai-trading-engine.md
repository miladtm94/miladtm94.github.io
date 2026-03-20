---
title: "AI Trading Engine"
excerpt: "Algorithmic trading framework with multi-layer signal generation pipeline: regime classification, technical indicators (EMA, RSI, MACD, Bollinger Bands), confluence scoring, risk management, and optional LLM validation via the OpenAI API. Telegram-formatted alerts for live deployment."
collection: portfolio
category: software
date: 2024-06-01
codeurl: "https://github.com/miladtm94/AI-Trading-Engine"
---

**Language:** Python 3.11+ &nbsp;&middot;&nbsp; **Status:** Prototype

## Overview

A modular algorithmic trading framework that generates trading signals through a multi-layer decision pipeline combining quantitative models, risk controls, and optional AI validation. Designed for capital preservation and execution feasibility rather than maximizing raw signal frequency.

**Key features:**
- **Regime Classification** — Identifies trending, range-bound, or volatile market conditions before signal generation
- **Signal Generation** — Trade setups using technical indicators: EMA, VWAP, RSI, MACD, ATR, Bollinger Bands
- **Confluence Scoring** — Weighted aggregation of evidence across multiple independent factors
- **Risk Management** — Portfolio-level protections and execution constraints enforced at each stage
- **LLM Validation** — Optional final consistency check via OpenAI API to flag logically inconsistent signals
- **Telegram Alerting** — Formatted output for automated notification pipelines

**Technologies:** Python · OpenAI SDK · Telegram Bot API · Technical Analysis · Quantitative Finance
