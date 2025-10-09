# Node Operator Economics

**Research Validation:** Comprehensive economics research (see `docs/ai-infrastructure-economics-research.md`) validates marketplace profitability across multiple AI infrastructure options.

## Profitability Summary

All infrastructure paths are highly profitable at expected market prices ($3-7/story):

**Note:** Platform fee is 10% OR $0.25 minimum, whichever is higher. At $3/story, node receives $2.70 (90%).

| Infrastructure | Upfront Cost | Cost/Story (200/mo) | Profit @ $3/story | Margin | Monthly Profit |
|----------------|--------------|---------------------|-------------------|--------|----------------|
| **Claude Pro ($20/mo)** | $0 | $0.013 | $2.687 | **99.5%** | $537 |
| **Claude API (pay-per-use)** | $0 | $0.108 | $2.592 | **96.0%** | $518 |
| **Hybrid (strategic routing)** | $0 | $0.024 | $2.676 | **99.1%** | $535 |
| **Local GPU** (first 24mo) | $2,250 | $0.479 | $2.221 | **82.3%** | $444 |
| **Local GPU** (after 24mo) | $2,250 | $0.01 | $2.690 | **99.6%** | $538 |

## Infrastructure Recommendations by Volume

**0-100 stories/month:** Claude Pro ($20/mo)
- Zero upfront investment
- 99% profit margins
- Perfect for getting started
- Monthly profit: $145-270 (at $3/story avg)

**100-200 stories/month:** Claude Pro or API
- Stay on Pro if under rate limit (~1,500/mo)
- Switch to API for unlimited scaling
- Monthly profit: $270-540 (at $3/story avg)

**200-500 stories/month:** Consider Local GPU Investment
- RTX 4090 24GB + workstation: ~$2,250 upfront
- ROI in 4-6 months at this volume
- 82% margins initially, 99.6% after 24 months
- Monthly profit: $444-1,332 (at $3/story avg)

**500+ stories/month:** Local GPU Required
- API costs become prohibitive ($50-100+/mo)
- Local GPU pays for itself in 2-3 months
- Near-zero marginal costs after amortization
- Monthly profit: $1,332+ (at $3/story avg)

## Migration Path

**Stage 1 (Months 0-3):** Start with Claude Pro
- Learn system, validate profitability
- Accumulate capital ($270-540/month at $3/story avg)

**Stage 2 (Months 3-6):** Grow volume
- Scale to 200-500 stories/month
- Continue with Pro/API
- Accumulate $1,500-3,000 for hardware

**Stage 3 (Months 6-12):** Invest in hardware (optional)
- Use profits to buy RTX 4090 setup
- Maximize long-term profitability
- Reduce operating costs to ~$0.01/story

**Stage 4 (Month 12+):** Optimize & scale
- Hardware fully amortized
- Maximum profit margins (99.6%)
- Scale to 1,000+ stories/month

## Price Floor & Market Dynamics

**Smart Contract Minimum:** $2.50/story (enforced on-chain)
- Prevents race-to-bottom death spiral
- Ensures all infrastructure types profitable
- Still 10-100x cheaper than human developers

**Expected Market Price:** $3-7/story
- Premium nodes (high reputation, specialization): $5-10
- Budget nodes (new, commodity work): $2-3
- Quality differentiation prevents pure price competition

**Predicted Evolution:**
- Months 0-3: $5-10 (low competition, early adopters)
- Months 3-6: $3-7 (growth phase, competition increases)
- Months 6-12: $2-5 (maturity, tier separation)
- Months 12+: $2-4 average (stable, specialization premiums)

## Staking Economics

**Example (Tier 0, $5 story):**
```
Stake required: $25 (5x)
Story completion: 7 days
Payment received: $4.50 (90% of $5)
Platform fee: $0.50 (10% of $5)
AI cost (Claude Pro): $0.013
Net profit: $4.49
ROI: 18.0% per week = 936% annualized 🚀

Comparison to SOL staking (8% APY):
Story profit ($4.49) vs SOL staking ($0.04) = 112x better returns
```

**Example (Low price story, $2 story):**
```
10% of $2 = $0.20 (below $0.25 minimum)
Platform fee: $0.25 (minimum applies)
Payment to node: $1.75 (87.5% effective)
Net profit: $1.75 - $0.013 = $1.74
```

**Why It Works:**
- High ROI makes participation attractive
- Economic incentives align with quality
- Scamming is -EV (lose more than you gain)
- Progressive relaxation rewards reputation

**See:** `docs/ai-infrastructure-economics-research.md` for complete analysis, profitability matrices, and sensitivity analysis.

---
