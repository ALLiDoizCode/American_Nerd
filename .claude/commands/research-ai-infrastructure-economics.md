# AI Infrastructure Economics & Story Pricing Research Task

**Command:** `/research-ai-infrastructure-economics`
**Priority:** 🔴 CRITICAL - Marketplace Economic Model Foundation
**Duration:** 6-9 hours

---

## Objective

Determine the **minimum viable story price** that enables node operator profitability across different AI infrastructure scenarios (Claude Pro $20/mo, Claude API pay-per-use, local models like Qwen 2.5 Coder 32B, hybrid approaches), considering that:

1. **Stories are ~3 tasks each** (small work units, relatively limited scope)
2. **Onchain bidding will drive prices DOWN** (market competition creates downward pressure)
3. **Operators start from scratch** (no existing hardware investment)
4. **Need to find the profitability floor**, not ideal pricing (below this price = marketplace breaks)

This research will inform the critical economic decisions in the PRD: story pricing ranges, staking multiples validation, and infrastructure recommendations for node operators at different volume tiers.

## Context

**SlopMachine Marketplace Design:**
- Story-based work units (~3 tasks per story, scoped by complexity)
- Onchain bidding marketplace (transparent, competitive)
- Progressive staking system (5x stake for new nodes → 1.2x for elite nodes)
- Nodes stake capital when accepting work (slashed 50% if quality fails)
- Payment split: 95% to node operator, 5% to platform
- Multiple AI infrastructure options available to node operators

**Current PRD Placeholders (need validation):**
- Story prices: $5-25 range
- Staking multiples: 5x (tier 0) → 1.2x (tier 4)
- AI model costs: $0.20-0.37 per story (estimated)
- Max story sizes by tier: $5 (tier 0) → $50 (tier 4)

**Key Uncertainty:**
Can node operators actually profit with these numbers across different infrastructure choices? What happens when onchain bidding drives story prices down to $2-3 or even $1-2? Which infrastructure options remain viable at different price points?

## Research Questions

### PRIMARY QUESTIONS (Must Answer)

#### A. Anthropic Subscription Tiers Analysis (January 2025)

1. **Subscription Tier Pricing:**
   - What are current Anthropic pricing tiers? (Free, Pro, Team, Enterprise, API)
   - What usage limits exist for each tier? (messages/day, tokens/month, rate limits)
   - Can Free tier support node operations? (likely no, but confirm)
   - Claude Pro ($20/mo): What are rate limits? (messages/day affects max stories/month)
   - How many stories/month can Pro tier realistically handle?
   - What's the effective cost-per-story for Pro tier? ($20 / max stories)

2. **API Pricing (Pay-Per-Use):**
   - Claude Sonnet 4 (current): Cost per 1M input tokens? Cost per 1M output tokens?
   - Claude Opus 4 (if released): Same pricing questions
   - Claude Haiku: Cheaper option for simple tasks?
   - How to estimate tokens per story? (~3 tasks = ? input + ? output tokens)
   - What's cost-per-story at current API rates?

3. **Break-Even Calculations:**
   - **Pro tier**: If rate limit = X stories/month, break-even price = $20 / (X × 0.95)
   - **API tier**: Cost per story = token usage × (input rate + output rate) / 0.95
   - At what story volume does API become cheaper than Pro subscription?

#### B. Competitive Cloud AI Model Economics

1. **OpenAI Pricing:**
   - GPT-4o: $/1M input tokens? $/1M output tokens?
   - GPT-4o-mini: Cheaper alternative for simple coding tasks?
   - GPT-4 Turbo: Still relevant or deprecated?
   - Cost-per-story estimates for each model

2. **Google Gemini:**
   - Gemini 1.5 Pro: $/1M tokens? Quality vs. Claude/GPT-4o?
   - Gemini 1.5 Flash: Cheaper tier for code generation?
   - Free tier limits? (probably not viable for business)

3. **DeepSeek API:**
   - DeepSeek Coder V2: $/1M tokens? (reportedly very cheap)
   - Quality assessment: Can it pass automated validation tests?
   - Rate limits and availability?

4. **Groq (Llama 3.3 70B):**
   - $/1M tokens? Speed advantages?
   - Quality for code generation vs. Claude/GPT-4o?
   - Free tier limits?

5. **Model Quality vs. Cost:**
   - Create ranking: Best quality → Cheapest
   - Which models can handle architectural work? (high reasoning required)
   - Which models suitable for coding only? (code generation, tests)
   - Failure rate impact: Cheaper model with 30% failure rate vs. expensive model with 5% failure rate

#### C. Local Model Deployment (Starting from Scratch)

1. **Qwen 2.5 Coder 32B:**
   - Hardware requirements? (GPU VRAM, RAM, CPU)
   - Minimum viable hardware? (used RTX 3090 24GB ~$800-1000)
   - Recommended hardware? (RTX 4090 24GB ~$1,600-2,000)
   - Inference speed? (tokens/second, estimated time per story)
   - Quality assessment? (vs. Claude Sonnet 4, GPT-4o)
   - Can it run on Mac Studio M2 Ultra 192GB? (~$4,000-6,000)

2. **Llama 3.3 70B:**
   - Hardware requirements? (likely too large for single consumer GPU)
   - Quantized versions? (4-bit, 8-bit for lower VRAM)
   - Quality vs. Qwen 32B?
   - Inference speed considerations

3. **DeepSeek Coder V2:**
   - Local deployment requirements?
   - Hardware needs vs. Qwen/Llama?
   - Quality for code generation?

4. **Hardware Cost Breakdown:**
   - **Budget**: Used RTX 3090 24GB (~$800-1000) + used workstation ($300-500) = ~$1,100-1,500 total
   - **Mid-tier**: RTX 4090 24GB (~$1,600-2,000) + new/used system ($500-800) = ~$2,100-2,800 total
   - **High-end**: Mac Studio M2 Ultra 192GB unified memory (~$4,000-6,000, no separate GPU needed)
   - **Enterprise** (out of scope): H100 PCIe 80GB (~$25,000+, irrelevant for solo operators)

5. **Operational Costs:**
   - Electricity rates: US average ~$0.13/kWh (regional variations)
   - GPU power consumption: RTX 4090 ~350W at full load
   - Estimated inference time per story: 5-10 minutes?
   - Electricity cost per story: ~$0.03-0.05
   - System idle power consumption (24/7 operation)

6. **Total Cost of Ownership (TCO):**
   - Upfront hardware investment
   - Amortization period: 24 months (2 years) or 36 months (3 years)?
   - Amortized cost per month = Hardware cost / months
   - Cost per story = (Amortized cost / stories per month) + electricity cost
   - Break-even timeline: How many stories to recoup hardware investment?

#### D. Story Economics (Token Usage Estimation)

1. **Token Usage per Story (~3 tasks):**
   - Input tokens:
     - Context: Architecture.md sections (~3,000-5,000 tokens)
     - Story description (~500-1,000 tokens)
     - BMAD templates and instructions (~1,000-2,000 tokens)
     - Total input: ~5,000-10,000 tokens
   - Output tokens:
     - Generated code (~1,000-3,000 tokens)
     - Tests (~500-1,000 tokens)
     - Documentation (~200-500 tokens)
     - Total output: ~2,000-5,000 tokens
   - **Total per story: ~7,000-15,000 tokens**
   - Validate this estimate with real examples if possible

2. **Retry/Failure Multiplier:**
   - Assume some stories fail validation (tests fail, build errors)
   - Average retries per story: 1.5x? 2x?
   - Impact on effective cost per story
   - Does this vary by model? (cheaper models = more retries?)

3. **Cost Calculations:**
   - For each model: token usage × (input rate + output rate) = cost per story
   - Apply retry multiplier for realistic costs
   - Create comparison table of all models

#### E. Break-Even Analysis & Profitability Scenarios

**Scenario A: Claude Pro User ($20/mo fixed cost)**
- If Claude Pro rate limit = 100 messages/day = ~3,000 messages/month
- If 1 story = ~3 messages (context + generation + revision), max ~1,000 stories/month
- Effective cost = $20 / 1,000 stories = $0.02 per story
- Node receives 95% of story price
- Break-even: Story price > $0.02 / 0.95 = **$0.021 minimum**
- Profit scenarios:
  - At $1 story price: $0.95 payment - $0.02 cost = **$0.93 profit (97% margin)**
  - At $2 story price: $1.90 payment - $0.02 cost = **$1.88 profit (99% margin)**
  - At $5 story price: $4.75 payment - $0.02 cost = **$4.73 profit (99.5% margin)**
- Volume limits: Max ~1,000 stories/month (rate limited)
- Monthly profit potential: $930 - $4,730 depending on price

**Scenario B: Claude API User (pay-per-use)**
- Example: 10K input + 3K output tokens at Sonnet 4 rates
- Hypothetical rates: $3/1M input, $15/1M output
- Cost per story = (10K × $3/1M) + (3K × $15/1M) = $0.03 + $0.045 = **$0.075 per story**
- With 1.5x retry multiplier = **$0.1125 per story**
- Break-even: Story price > $0.1125 / 0.95 = **$0.118 minimum**
- Profit scenarios:
  - At $1 story price: $0.95 - $0.1125 = **$0.8375 profit (88% margin)**
  - At $2 story price: $1.90 - $0.1125 = **$1.7875 profit (94% margin)**
  - At $5 story price: $4.75 - $0.1125 = **$4.6375 profit (97.6% margin)**
- No volume limits (pay for what you use)
- Scales with volume: 100 stories = $11.25 cost, 1000 stories = $112.50 cost

**Scenario C: Local Qwen 32B Operator (RTX 4090, $2,300 upfront)**
- Upfront: RTX 4090 ($1,800) + used workstation ($500) = **$2,300 total**
- Amortization: $2,300 / 24 months = **$95.83/month**
- Electricity per story: ~$0.05 (8 min inference × 350W × $0.13/kWh)
- At 50 stories/month:
  - Amortized hardware: $95.83 / 50 = **$1.92 per story**
  - Electricity: **$0.05 per story**
  - Total: **$1.97 per story**
- Break-even: Story price > $1.97 / 0.95 = **$2.07 minimum**
- Profit scenarios (first 24 months):
  - At $2 story price: $1.90 - $1.97 = **-$0.07 LOSS** ❌
  - At $3 story price: $2.85 - $1.97 = **$0.88 profit (31% margin)**
  - At $5 story price: $4.75 - $1.97 = **$2.78 profit (58% margin)**
- After 24 months (hardware paid off):
  - Cost drops to electricity only: **$0.05 per story**
  - At $2 story price: $1.90 - $0.05 = **$1.85 profit (97% margin)**
- Volume flexibility: Can do 1000+ stories/month (only limited by hardware)
- Monthly profit (at $5/story, 200 stories/mo): $556 (first 24 mo), $370 after amortization

**Scenario D: Hybrid User (Strategic Model Selection)**
- Architectural stories (high reasoning): Claude Sonnet 4 ($0.1125 per story)
- Developer stories (code generation): GPT-4o-mini ($0.02 per story?)
- Mix: 20% architecture, 80% development
- Blended cost: (0.2 × $0.1125) + (0.8 × $0.02) = $0.0225 + $0.016 = **$0.0385 per story**
- Break-even: Story price > $0.0385 / 0.95 = **$0.0405 minimum**
- Profit scenarios:
  - At $1 story price: $0.95 - $0.0385 = **$0.9115 profit (96% margin)**
  - At $2 story price: $1.90 - $0.0385 = **$1.8615 profit (98% margin)**
- Requires more complex infrastructure (multiple API keys, routing logic)

**Profitability Matrix:**
Create table showing profit margin at different price points × infrastructure choices

#### F. Market Reality Check & Price Floor Analysis

1. **Competitive Bidding Dynamics:**
   - If onchain marketplace enables transparent bidding, what drives price?
   - Race to bottom? (lowest bidder wins, prices collapse)
   - Quality differentiation? (reputation, past work, staking amount)
   - What's realistic story price range after 6 months of market operation?

2. **Price Floor Scenarios:**
   - **$1 story price**: Which infrastructure options are profitable?
   - **$2 story price**: Which infrastructure options are profitable?
   - **$3 story price**: Which infrastructure options are profitable?
   - **$5 story price**: Which infrastructure options are profitable?
   - Below what price does marketplace become unviable? (nobody profits)

3. **Volume Thresholds:**
   - At what monthly story volume does local deployment break even?
   - When should operator switch from Claude Pro → API → Local?
   - Create decision matrix: Volume × Price → Best infrastructure

4. **Market Sustainability:**
   - If prices drop to $1-2, can enough nodes operate profitably?
   - What's the minimum node count for marketplace liquidity?
   - Risk of marketplace death spiral (prices too low → nodes leave → less competition → prices rise?)

#### G. Staking Economics Validation

1. **Capital Lock-up Analysis:**
   - If story price = $5, stake = 5x = $25 (tier 0 node)
   - Story completion time: Average 7 days?
   - Capital locked for 7 days: $25 (opportunity cost)
   - Payment received: $4.75 (95% of $5)
   - Net profit: $4.75 - $0.30 (AI cost) = **$4.45**
   - ROI: $4.45 profit on $25 locked = **17.8% return in 7 days** = ~936% annualized 🚀

2. **Opportunity Cost:**
   - Could stake $25 in SOL staking: ~8% APY = ~$0.17/month = ~$0.04/week
   - Story profit ($4.45) >> staking yield ($0.04), so worth it

3. **Lower Price Scenarios:**
   - Story price = $2, stake = 5x = $10 (tier 0)
   - Payment: $1.90, cost: $0.10, profit: **$1.80**
   - ROI: $1.80 / $10 = 18% in 7 days = ~937% annualized (still amazing)
   - Story price = $1, stake = 5x = $5
   - Payment: $0.95, cost: $0.02 (Pro tier), profit: **$0.93**
   - ROI: $0.93 / $5 = 18.6% in 7 days = ~970% annualized

4. **Staking Multiple Validation:**
   - Are current multiples (5x → 1.2x) economically rational?
   - Do they provide sufficient deterrent against bad actors?
   - $25 stake to scam $5 = irrational (lose $12.50 if slashed)
   - What if scammer uses stolen wallet/capital? (edge case)

5. **Recommendations:**
   - Keep staking multiples as-is? Or adjust?
   - Add minimum absolute stake amounts? (e.g., $10 minimum regardless of story price)
   - Consider time-locked stakes? (can't withdraw immediately after story completion)

### SECONDARY QUESTIONS (Nice to Have)

8. **Rate Limits & Throughput:**
   - Claude Pro: Actual messages/day limit (verify current policy)
   - API rate limits: Requests/min, tokens/min for each provider
   - Local: GPU inference speed (tokens/second for Qwen 32B on 4090)
   - How do rate limits affect max monthly income?

9. **Quality Trade-offs:**
   - Can GPT-4o-mini pass SlopMachine automated validation? (tests, builds, linting)
   - Can Qwen 32B match Claude Sonnet 4 quality?
   - Failure rate impact: 10% vs 30% vs 50% failure rates
   - Cost of retries: More failures = higher effective cost
   - Is there a "good enough" cheaper model that passes 80%+ of the time?

10. **Future-Proofing:**
    - Qwen 3 rumors/roadmap? (better, faster, cheaper?)
    - OpenAI pricing trends (historically declining, will continue?)
    - Anthropic roadmap (Opus 4, cheaper tiers?)
    - Local model efficiency improvements (better quantization, faster inference)
    - Competition impact on pricing (race to bottom for API providers?)

11. **Infrastructure Trade-offs:**
    - When does subscription make sense vs API vs local?
    - Hybrid scenarios: Pro for low volume, switch to API at X stories/month, local at Y stories/month?
    - Can operators run multiple infrastructure modes simultaneously?

## Research Methodology

### Information Sources

**Primary Sources (Must Use - Current as of Dec 2024 - Jan 2025):**

**AI Model Pricing:**
1. https://www.anthropic.com/pricing - Claude pricing (all tiers)
2. https://openai.com/api/pricing/ - OpenAI pricing (GPT-4o, 4o-mini, etc.)
3. https://ai.google.dev/pricing - Gemini pricing (1.5 Pro, Flash)
4. https://platform.deepseek.com/api-docs/pricing/ - DeepSeek API pricing
5. https://groq.com/pricing/ - Groq pricing (Llama 3.3)

**Hardware & Infrastructure:**
6. eBay, Newegg - Used GPU pricing (RTX 3090, 4090)
7. https://www.apple.com/mac-studio/ - Mac Studio M2 Ultra pricing
8. https://www.eia.gov/electricity/ - US electricity rates (regional averages)
9. https://www.techpowerup.com/gpu-specs/ - GPU power consumption specs

**Model Documentation:**
10. Qwen 2.5 Coder model card (HuggingFace) - Hardware requirements, benchmarks
11. Llama 3.3 model card - Hardware requirements, performance
12. DeepSeek Coder V2 model card - Requirements, benchmarks

**Benchmarks & Comparisons:**
13. Artificial Analysis (https://artificialanalysis.ai/) - Model quality/cost comparisons
14. Vellum AI benchmarks - Model performance data
15. HuggingFace leaderboards - Coding task benchmarks

**Community Sources:**
16. Reddit r/LocalLLaMA - Real-world local deployment experiences
17. HuggingFace forums - Model deployment discussions
18. X/Twitter - Developer experiences with different models

### Analysis Frameworks

**1. Total Cost of Ownership (TCO) Calculator:**

```
For Subscriptions:
  Monthly TCO = Subscription cost
  Cost per story = Monthly TCO / Stories per month

For API:
  Cost per story = Token usage × (Input rate + Output rate) × Retry multiplier
  Monthly TCO = Cost per story × Stories per month

For Local:
  Upfront = Hardware cost
  Monthly TCO = (Hardware cost / Amortization months) + (Electricity per story × Stories per month)
  Cost per story = (Hardware cost / Amortization months / Stories per month) + Electricity per story
```

**2. Break-Even Formula:**

```
Minimum story price = Cost per story / 0.95
  (Node receives 95%, platform takes 5%)

Profit per story = (Story price × 0.95) - Cost per story

Profit margin = Profit per story / Story price
```

**3. Infrastructure Decision Matrix:**

Create matrix:
- X-axis: Stories per month (0-50, 50-100, 100-200, 200-500, 500+)
- Y-axis: Story price ($1, $2, $3, $5, $10)
- Cell value: Best infrastructure choice + profit margin %

Example:
| Stories/Month | $1 Price | $2 Price | $5 Price |
|---------------|----------|----------|----------|
| 0-50 | Claude Pro (97%) | Claude Pro (99%) | Claude Pro (99.5%) |
| 50-100 | Claude API (88%) | Claude API (94%) | Claude API (97%) |
| 100-200 | Local? (depends on amortization) | Local (31%→97% after payoff) | Local (58%→97%) |
| 200+ | Local (X%) | Local (Y%) | Local (Z%) |

**4. Sensitivity Analysis:**

Test impact of:
- 20% price decrease (market competition)
- 2x token usage (more complex stories)
- 50% validation failure rate (retries)
- Hardware cost ±30% (used vs new, regional pricing)
- Electricity cost ±50% (regional variations)

### Data Quality Requirements

- **Recency**: Pricing must be current (December 2024 - January 2025)
- **Completeness**: Include ALL costs (API, hardware, electricity, amortization, retry multiplier)
- **Transparency**: Show all calculations, formulas, assumptions
- **Conservatism**: Use pessimistic estimates (higher costs, lower throughput, more retries)
- **Validation**: Cross-reference multiple sources for pricing data

## Expected Deliverables

### 1. Executive Summary (1-2 pages)

**Key Findings:**
- **Minimum viable story price**: $X.XX (below this, marketplace economics break)
- **Recommended infrastructure by volume**:
  - 0-50 stories/mo: [Claude Pro / API / Local]
  - 50-100 stories/mo: [Option]
  - 100-200 stories/mo: [Option]
  - 200+ stories/mo: [Option]
- **Staking validation**: Current multiples [adequate / too high / too low]
- **Market price prediction**: Expect prices to settle at $X-Y range after 6 months
- **Critical risk**: [What price point breaks the model / infrastructure dependency / other]

**Recommendations:**
1. Set story price floor at **$X.XX** (enforce minimum bid in smart contracts?)
2. Adjust staking multiples to: [keep as-is / new values]
3. Recommend [infrastructure type] for early node operators
4. Add [mitigation strategies] for price competition risks

**Go/No-Go Decision:**
- ✅ Economics are viable at realistic market prices
- ⚠️ Economics are marginal, requires [specific conditions]
- ❌ Economics are not viable, rethink marketplace model

### 2. Detailed Analysis

#### Section 1: AI Model Cost Comparison (5-7 pages)

**Table 1: Cloud API Pricing Matrix**

| Provider | Model | Input $/1M | Output $/1M | Est. Tokens/Story | Cost/Story (base) | Cost/Story (w/ 1.5x retries) | Quality Rating |
|----------|-------|------------|-------------|-------------------|-------------------|------------------------------|----------------|
| Anthropic | Sonnet 4 | $X | $Y | 10K in, 3K out | $Z | $Z × 1.5 | ⭐⭐⭐⭐⭐ |
| Anthropic | Opus 4 | $X | $Y | 10K in, 3K out | $Z | $Z × 1.5 | ⭐⭐⭐⭐⭐ |
| Anthropic | Haiku | $X | $Y | 10K in, 3K out | $Z | $Z × 1.5 | ⭐⭐⭐⭐ |
| OpenAI | GPT-4o | $X | $Y | 10K in, 3K out | $Z | $Z × 1.5 | ⭐⭐⭐⭐ |
| OpenAI | GPT-4o-mini | $X | $Y | 10K in, 3K out | $Z | $Z × 1.5 | ⭐⭐⭐ |
| Google | Gemini 1.5 Pro | $X | $Y | 10K in, 3K out | $Z | $Z × 1.5 | ⭐⭐⭐⭐ |
| Google | Gemini Flash | $X | $Y | 10K in, 3K out | $Z | $Z × 1.5 | ⭐⭐⭐ |
| DeepSeek | Coder V2 | $X | $Y | 10K in, 3K out | $Z | $Z × 1.5 | ⭐⭐⭐ |
| Groq | Llama 3.3 70B | $X | $Y | 10K in, 3K out | $Z | $Z × 1.5 | ⭐⭐⭐ |

**Table 2: Subscription Tier Analysis**

| Provider | Tier | Monthly Cost | Rate Limit | Est. Max Stories/Mo | Effective $/Story | Quality | Best For |
|----------|------|--------------|------------|---------------------|-------------------|---------|----------|
| Anthropic | Free | $0 | X msg/day | ~Y | $0 | ⭐⭐⭐⭐⭐ | Testing only |
| Anthropic | Pro | $20 | X msg/day | ~Y | $Z | ⭐⭐⭐⭐⭐ | Low volume (<100/mo) |
| Anthropic | Team | $X | Y msg/day | ~Z | $W | ⭐⭐⭐⭐⭐ | Not solo operator |
| OpenAI | ChatGPT Plus | $20 | X msg/day | ~Y | $Z | ⭐⭐⭐⭐ | (Compare to Claude Pro) |

**Table 3: Local Deployment TCO (24-month amortization)**

| Hardware Option | Upfront Cost | Electricity/Story | Amortized/Story (50/mo) | Amortized/Story (200/mo) | Total $/Story | Break-Even Months | Quality | Best For |
|-----------------|--------------|-------------------|-------------------------|--------------------------|---------------|-------------------|---------|----------|
| Used RTX 3090 24GB + Workstation | $1,100-1,500 | $0.05 | $X | $Y | $Z | A months | ⭐⭐⭐⭐ | Budget, high volume |
| RTX 4090 24GB + System | $2,100-2,800 | $0.05 | $X | $Y | $Z | A months | ⭐⭐⭐⭐ | Performance, scale |
| Mac Studio M2 Ultra 192GB | $4,000-6,000 | $0.03 | $X | $Y | $Z | A months | ⭐⭐⭐⭐ | Mac users, efficiency |

**Analysis:**
- Token usage estimation methodology (how we arrived at 10K input + 3K output)
- Retry multiplier justification (1.5x based on assumed 33% failure rate)
- Quality ratings methodology (benchmarks, community consensus, testing)
- Cost-per-story ranking (cheapest → most expensive)

#### Section 2: Story Economics Deep Dive (3-4 pages)

**Token Usage Breakdown:**
- Input tokens:
  - Architecture.md context: X tokens
  - Story description: Y tokens
  - BMAD templates: Z tokens
  - Total: ~5,000-10,000 tokens
- Output tokens:
  - Code generation: X tokens
  - Test generation: Y tokens
  - Documentation: Z tokens
  - Total: ~2,000-5,000 tokens
- **Grand total: ~7,000-15,000 tokens per story**

**Retry/Failure Analysis:**
- Assume X% of stories fail first validation
- Average retries: Y per story
- Effective multiplier: 1.Zx
- Models with higher failure rates (cheaper models) have higher effective costs

**Cost Calculations:**
For each model, calculate:
```
Base cost = (Input tokens × Input rate) + (Output tokens × Output rate)
Effective cost = Base cost × Retry multiplier
```

#### Section 3: Break-Even Scenarios (5-6 pages)

**Scenario A: Claude Pro User ($20/mo)**

Assumptions:
- Claude Pro rate limit: X messages/day = Y/month
- Stories per message: ~0.33 (1 story = ~3 messages: context, generation, revision)
- Max stories/month: ~Z

Calculations:
```
Fixed cost: $20/month
Cost per story: $20 / Z stories = $X
Payment to node (95%): Story price × 0.95
Break-even: Story price × 0.95 = $X
  → Story price = $X / 0.95 = $Y minimum

Profit margin: (Story price - Cost per story) / Story price
```

Profit Scenarios:
| Story Price | Payment (95%) | Cost | Profit | Margin |
|-------------|---------------|------|--------|--------|
| $1 | $0.95 | $X | $Y | Z% |
| $2 | $1.90 | $X | $Y | Z% |
| $5 | $4.75 | $X | $Y | Z% |

**Volume Limits:**
- Max monthly income: Z stories × $5 = $X,XXX

**Best For:**
- Low volume operators (<100 stories/mo)
- Testing/getting started
- Predictable costs

**Scenario B: Claude API (Pay-Per-Use)**

[Similar detailed breakdown]

**Scenario C: Local Qwen 32B (RTX 4090)**

[Similar detailed breakdown with amortization schedule]

**Scenario D: Hybrid Approach**

[Similar detailed breakdown with task allocation strategy]

**Comparison Chart:**
- Graph: Story price (X) vs Profit margin (Y), lines for each infrastructure option
- Break-even points clearly marked
- Volume thresholds annotated

#### Section 4: Staking Economics (2-3 pages)

**Capital Lock-up Analysis:**

Example: $5 story, 5x stake (tier 0 node)
```
Story price: $5
Stake required: $25 (5x)
Lock duration: 7 days (assumed story completion time)
Payment received: $4.75 (95% of $5)
AI cost: $0.30 (assumed)
Net profit: $4.45
ROI: $4.45 / $25 = 17.8% in 7 days = ~936% annualized
```

**Opportunity Cost:**
```
Alternative: Stake $25 in SOL staking
  Annual yield: 8% APY
  Weekly yield: $25 × 8% / 52 = $0.038

Story profit ($4.45) >> Staking yield ($0.04)
  → Worth locking capital in stories
```

**Lower Price Scenarios:**
- Repeat analysis for $1, $2, $3 story prices
- Find floor where story profit ≈ staking yield (not worth it)

**Staking Multiple Validation:**
- Are 5x → 1.2x multiples rational?
- Economic deterrent against scams:
  - Stake $25 to scam $5 = lose $12.50 if slashed (50% slash) + $5 foregone payment
  - Total loss: $17.50 to gain $0 (scam fails) → irrational ✅
- Edge cases: Stolen capital, Sybil attacks
- Recommendations: Keep as-is or adjust?

**Recommendations:**
1. Current staking multiples: [Keep / Adjust to X]
2. Add minimum absolute stakes: [Yes: $X / No]
3. Add time-locks: [Yes: X days / No]
4. Tier progression: [Keep / Adjust requirements]

#### Section 5: Market Reality & Pricing Recommendations (4-5 pages)

**Competitive Bidding Dynamics:**
- Transparent onchain marketplace → price discovery
- Downward pressure from competition (race to bottom?)
- Quality differentiation factors:
  - Reputation score
  - Past work portfolio
  - Staking amount (higher stake = more confidence?)
  - Social proof (Twitter followers, badges)

**Predicted Price Range:**
- Pessimistic: $1-2 (fierce competition, commoditization)
- Realistic: $2-5 (quality differentiation works)
- Optimistic: $5-10 (premium for proven nodes)

**Price Floor Analysis:**

Create profitability matrix:

| Story Price | Claude Pro Margin | Claude API Margin | Local (first 24mo) Margin | Local (after 24mo) Margin |
|-------------|-------------------|-------------------|---------------------------|---------------------------|
| $1 | 97% ✅ | 88% ✅ | -3% ❌ | 97% ✅ |
| $2 | 99% ✅ | 94% ✅ | 31% ✅ | 97% ✅ |
| $3 | 99% ✅ | 96% ✅ | 58% ✅ | 98% ✅ |
| $5 | 99.5% ✅ | 97% ✅ | 58% ✅ | 99% ✅ |

**Key Insights:**
- **Absolute floor: $0.12** (Claude API break-even, nobody profits below this)
- **Practical floor: $2-3** (local operators need this to justify hardware investment)
- **Sustainable range: $3-7** (all infrastructure options profitable, attracts diverse operators)

**Volume Threshold Analysis:**

When to switch infrastructure:
```
Claude Pro → API: When monthly volume > X stories (subscription cost > API cost)
API → Local: When monthly volume > Y stories (API cost > amortized local cost)
```

Create decision tree:
```
Start
├─ If volume < 50/mo → Claude Pro ($20 fixed)
├─ If volume 50-150/mo → Claude API (scales with usage)
├─ If volume 150+/mo → Consider local (hardware investment worth it)
└─ If volume 500+/mo → Definitely local (massive savings)
```

**Market Sustainability:**
- Need X active nodes for marketplace liquidity
- If only Y% can profit at price Z, need Z total registered nodes
- Death spiral risk: Low prices → nodes leave → less liquidity → marketplace fails
- Mitigation: Price floors, quality incentives, reputation bonuses

**Pricing Recommendations:**

1. **Set smart contract minimum bid**: $2.00 (prevents race-to-bottom below viability)
2. **Recommended story size**: Keep at ~3 tasks (current)
3. **Tiered maximums**: Validate current $5-50 range across tiers
4. **Dynamic pricing**: Allow market to discover optimal price within $2-10 range
5. **Quality premium**: Higher reputation nodes can command higher prices

#### Section 6: Infrastructure Decision Matrix (2 pages)

**Decision Framework:**

```
Input: Monthly story volume, current story price
Output: Recommended infrastructure choice

if volume < 50:
  return "Claude Pro ($20/mo fixed)"
elif volume < 150:
  if price > $3:
    return "Claude API (scales, good margins)"
  else:
    return "Claude Pro (better margins at low prices)"
elif volume < 300:
  if willing_to_invest_hardware:
    return "Local GPU (break-even in X months)"
  else:
    return "Claude API"
else:  # volume >= 300
  return "Local GPU (mandatory for profitability)"
```

**Infrastructure Comparison Table:**

| Factor | Claude Pro | Claude API | Local GPU |
|--------|------------|------------|-----------|
| **Upfront Cost** | $0 | $0 | $2,000-3,000 |
| **Monthly Fixed** | $20 | $0 | $0 (electricity ~$10-20) |
| **Variable Cost** | $0 | ~$0.10/story | ~$0.05/story (electricity) |
| **Volume Limit** | ~1,000/mo (rate limit) | Unlimited (pay more) | Unlimited (hardware limit) |
| **Break-Even Volume** | 0 (immediate) | 0 (immediate) | ~X stories total |
| **Best Margin At** | Low volume, high price | Medium volume | High volume |
| **Setup Complexity** | Easy (just pay) | Easy (API key) | Hard (hardware, setup) |
| **Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ (model dependent) |

**Migration Path:**

Suggested progression for new node operators:
```
Stage 1 (Month 1-2): Start with Claude Pro
  - Learn the system, test stories
  - Volume: 20-50 stories/mo
  - Profit: $100-200/mo

Stage 2 (Month 3-6): Grow to Claude API
  - Proven workflow, increase volume
  - Volume: 100-200 stories/mo
  - Profit: $500-1,000/mo

Stage 3 (Month 7+): Invest in local GPU
  - Use profits to buy hardware
  - Volume: 300-500 stories/mo
  - Profit: $1,500-2,500/mo (after amortization)
```

### 3. Supporting Materials

**Data Tables:**
1. **Complete AI Model Pricing Comparison** (15+ models, all providers, January 2025 rates)
2. **Hardware Cost Breakdown** (GPUs, complete systems, used vs new, regional pricing)
3. **Electricity Cost Calculator** (regional US rates, GPU power consumption, cost per inference hour)
4. **TCO Spreadsheet** (5-year view, all infrastructure options, amortization schedules)
5. **Break-Even Calculator** (interactive formulas: input volume + price → recommended infrastructure)

**Comparison Matrices:**
1. **Infrastructure Options Matrix** (pros/cons, ideal use cases, volume thresholds)
2. **Model Quality vs Cost Matrix** (which models for which tasks, failure rate impact)
3. **Profitability Matrix** (story price × volume → infrastructure choice + profit margin)

**Interactive Tools (if possible):**
1. **Cost Calculator**: Input (story price, monthly volume) → Output (best infrastructure, profit margin)
2. **Break-Even Timeline**: Input (hardware cost, monthly volume) → Output (months to break even)
3. **Sensitivity Analysis**: Adjust variables (price ±20%, volume ±50%, etc.) → See profit impact

**Source Documentation:**
- Links to all pricing pages (with capture dates: "Accessed January X, 2025")
- Calculation methodologies (show formulas, explain assumptions)
- Assumptions log (every estimate documented with reasoning)
- Screenshots of key pricing pages (in case they change)

**Visual Aids:**
1. **Profitability Chart**: Line graph showing profit margin (Y) vs story price (X), separate lines for each infrastructure option
2. **Break-Even Timeline**: Bar chart showing months to break even for local deployment at different volumes
3. **Infrastructure Decision Tree**: Flowchart helping operators choose the right option
4. **Market Price Distribution**: Bell curve showing predicted story price distribution after 6 months of market operation

## Success Criteria

This research will be considered successful if it delivers:

1. ✅ **Minimum viable story price** with confidence interval (e.g., $2.50 ± $0.50)
2. ✅ **Infrastructure decision matrix** (clear guidance on when to use Claude Pro vs API vs Local)
3. ✅ **Profitability proof** for at least 2 infrastructure scenarios at realistic market prices ($2-5 range)
4. ✅ **Staking validation** (current multiples work OR revised recommendations with justification)
5. ✅ **Price floor identification** (below this price, marketplace economics break down)
6. ✅ **Volume thresholds** (when to switch infrastructure based on monthly story count)
7. ✅ **Risk assessment** (what price points/conditions break the model, mitigation strategies)
8. ✅ **Actionable recommendations** for PRD v3.2 (story price ranges, staking adjustments, infrastructure guidance)

## Timeline and Priority

**Priority:** 🔴 **CRITICAL** - This determines if the marketplace economic model is viable

**Urgency:** High - Needed before finalizing PRD economics section and committing to implementation

**Suggested Timeline:**
- **AI pricing research** (Claude, OpenAI, Google, DeepSeek, Groq): 2-3 hours
- **Local deployment research** (Qwen, Llama, hardware costs, electricity): 2-3 hours
- **Cost calculations & break-even analysis**: 2 hours
- **Staking economics & market dynamics**: 1-2 hours
- **Analysis, tables, recommendations**: 2-3 hours
- **Total:** 9-13 hours for comprehensive research report

**Milestones:**
- Hour 4: Have all pricing data collected
- Hour 7: Break-even calculations complete for all scenarios
- Hour 10: Draft recommendations ready
- Hour 13: Final report with all tables, charts, supporting materials

## Deliverables Output Location

- **Main research report**: `docs/ai-infrastructure-economics-research.md` (15-20 pages comprehensive analysis)
- **Executive decision brief**: `docs/ai-infrastructure-economics-decision-brief.md` (2-3 pages, exec summary + recommendations)
- **Cost calculator spreadsheet**: `docs/ai-infrastructure-cost-calculator.xlsx` (or Google Sheets)
- **PRD updates**: Update `docs/prd.md` with validated pricing ranges and staking multiples
- **Supporting data**:
  - `docs/data/ai-model-pricing-jan-2025.csv`
  - `docs/data/gpu-hardware-costs.csv`
  - `docs/data/break-even-calculations.csv`

## Next Steps After Research

**If Economics Are Viable:**
1. ✅ **Update PRD** (v3.2):
   - Replace placeholder story prices ($5-25) with validated range (e.g., $2-7)
   - Validate or adjust staking multiples (currently 5x → 1.2x)
   - Add infrastructure guidance for node operators (decision matrix)
   - Add price floor enforcement (smart contract minimum bid)
2. ✅ **Create Node Operator Guide**:
   - "How to choose your infrastructure" doc
   - TCO calculator for operators
   - Migration path (Pro → API → Local)
3. ✅ **Update Smart Contract Requirements**:
   - Add minimum bid enforcement ($X floor)
   - Validate staking multiples in contract logic
   - Add volume-based tier progression
4. ✅ **Create Marketing Materials**:
   - "Earn $X,XXX/mo as a node operator" (based on realistic scenarios)
   - Infrastructure setup guides (Claude Pro, API, Local GPU)
   - ROI calculators for potential operators

**If Economics Are Marginal:**
1. ⚠️ **Identify Critical Issues**:
   - What price point is too low?
   - Which infrastructure options are unviable?
   - What changes would make it work?
2. ⚠️ **Mitigation Strategies**:
   - Higher price floors?
   - Lower platform fee (reduce from 5%)?
   - Subsidize early node operators?
   - Quality bonuses (pay more for higher reputation)?
3. ⚠️ **Revised Model**:
   - Adjust economic parameters
   - Re-run calculations
   - Validate viability

**If Economics Are Not Viable:**
1. ❌ **Root Cause Analysis**:
   - Is it story pricing? (too low)
   - Is it AI costs? (too high)
   - Is it staking? (too much capital locked)
   - Is it platform fee? (5% too much)
2. ❌ **Alternative Models**:
   - Hourly billing instead of per-story?
   - Subscription for customers (unlimited stories)?
   - Different payment split (90/10 instead of 95/5)?
   - Remove staking, add reputation bonds?
3. ❌ **Pivot Decision**:
   - Rethink marketplace fundamentals
   - Consider hybrid human + AI model?
   - Focus on different market segment?

## Notes

- This research is **foundational** for the entire SlopMachine economic model
- Node operator profitability = marketplace sustainability
- If operators can't profit, there's no supply side → marketplace fails
- Conservative estimates preferred (better to be pleasantly surprised than disappointed)
- Market will push prices down → need to prove viability at LOWER prices, not ideal prices
- Local deployment is long-term play (high upfront, low marginal cost)
- API is flexible (scales with volume, no commitment)
- Subscriptions are training wheels (fixed cost, predictable, limited upside)
- Staking creates skin in the game (economic security without human validators)
- Price floor may be necessary (prevent death spiral)
- Quality differentiation is key (prevent pure commoditization)
