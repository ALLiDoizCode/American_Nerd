# Platform Analytics & Monitoring Research Task

**Command:** `/research-platform-analytics-monitoring`
**Priority:** 🔴 CRITICAL - Epic 11 Foundation (Milestone 5)
**Duration:** 5 business days (immediate development readiness)

---

## Objective

Design and recommend a production-ready analytics and monitoring solution for **Slop Machine** (Solana-based AI marketplace) that enables:

1. **Real-time platform health tracking** - Active projects, active nodes, story completion metrics
2. **Node performance analytics** - Success rates, earnings distribution, tier progression tracking
3. **Revenue monitoring** - Platform fees collected, node earnings, ROI calculations
4. **Public transparency dashboards** - Token holder visibility into project progress and platform health
5. **Infrastructure monitoring** - Akash deployments, Arweave uploads, GitHub Actions health

The solution must be **implementable in Milestone 5** (10-week timeline), **prioritize existing analytics platforms** over custom builds, and include comprehensive cost analysis, vendor comparisons, proof-of-concept code examples, and detailed implementation roadmaps.

## Background Context

**Project:** Slop Machine - Fully autonomous AI-to-AI marketplace on Solana blockchain
**Status:** PRD v3.4, Architecture v2.5 - Production ready, Epic 11 gap identified
**Technology Stack:**
- Solana (Anchor framework) - All state management on-chain
- TypeScript/Node.js - AI agent runtime
- Arweave (via Turbo SDK) - Permanent document storage + frontend hosting
- Akash Network - Decentralized compute for backends and AI nodes
- Custom Native SOL Escrow - 90/10 payment splits (nodes/platform)

**Key Platform Characteristics:**
- **Fully on-chain state**: All projects, stories, bids, escrow, and reputation data stored in Solana smart contracts
- **Autonomous AI nodes**: No human validators; AI agents bid, complete work, and validate via automated checks
- **Infinite tier progression**: Mathematical formulas for reputation (tier = floor(sqrt(projects) × successRate))
- **Economic model**: 90/10 payment split, progressive staking (5x → 1x), story pricing ($2.50-$114K+ based on tier)
- **Decentralized infrastructure**: Arweave frontends, Akash backends, no centralized servers
- **Token speculation**: Token holders watch real-time progress and bet on project success
- **3-tier deployments**: Development (story) → Staging (epic) → Production (project completion)

**Issue 11: Missing Epic - Analytics & Monitoring**

No analytics infrastructure exists to answer critical questions:
- **Platform health**: How many active projects? How many active nodes? Average story completion time?
- **Node performance**: Success rates by tier? Earnings distribution? Are Tier 0-1 nodes getting opportunities?
- **Revenue metrics**: Platform fees collected? Node earnings distribution? ROI calculations?
- **Transparency**: Public dashboards for token holders to track project progress and platform health?
- **Infrastructure health**: Akash deployment status? Arweave upload success rates? GitHub Actions metrics?

**Recommendation: Add Epic 11 - Platform Analytics (Milestone 5)**

Stories:
- **11.1** - On-chain metrics aggregation (project count, story count, total volume)
- **11.2** - Node performance analytics (success rate, avg completion time per tier)
- **11.3** - Revenue dashboard (platform fees collected, node earnings distribution)
- **11.4** - Public metrics API (for transparency and third-party integrations)
- **11.5** - Grafana/Prometheus monitoring (infrastructure health)

## Research Questions

### Primary Questions (Must Answer)

#### 1. Platform Selection & Architecture

- **Which existing Solana analytics platforms best fit Slop Machine's requirements?**
  - Evaluate: Dune Analytics, Flipside Crypto, Helius, Jito, Nansen, Messari, DappRadar
  - What are cost structures, data freshness SLAs, and API capabilities?
  - Which platforms support custom Anchor program indexing?
  - Should we use a single platform or hybrid approach (e.g., Dune for dashboards + Helius for real-time APIs)?

- **How do we efficiently index custom Anchor program data?**
  - Project, Story, Epic, Escrow, NodeRegistry accounts
  - What indexing strategies work best for infinite tier calculations (sqrt, exponential decay)?
  - How do existing platforms handle large-scale transaction parsing (projected 10K+ stories/month)?
  - What are RPC cost implications for historical data backfills and real-time updates?

#### 2. Metrics Aggregation & Calculation

- **How do we calculate complex derived metrics?**
  - Average story completion time (from StoryCreated event → StoryCompleted event)
  - Success rate by tier (completed stories / attempted stories, grouped by tier)
  - Earnings distribution (Gini coefficient, percentile distribution, tier-based aggregation)
  - Tier progression tracking (tier recalculations over time for each node)

- **What's the optimal approach for real-time vs. batch aggregation?**
  - Real-time: Platform health, active nodes, recent deployments
  - Near-real-time (5-15 min): Story completion rates, bidding activity
  - Batch (hourly/daily): Revenue aggregations, historical trends, earnings distribution

- **How do we handle mathematical tier calculations in analytics queries?**
  - tier = floor(sqrt(projectsCompleted) × successRate)
  - stakeMultiplier = max(1.0, 5.0 × exp(-0.15 × tier))
  - maxStorySize = floor(5 × pow(1.4, tier))
  - Can SQL/queries replicate these formulas, or do we need custom indexing?

- **What data retention policies are needed?**
  - Historical trend analysis (12+ months of story/project data)
  - Tier progression history (node reputation over time)
  - Revenue tracking (monthly aggregates for platform/node earnings)

#### 3. Dashboard & Visualization

- **Can existing platforms provide embeddable public dashboards for token holders?**
  - Public sharing and embedding capabilities
  - Customizable branding and styling
  - Real-time or near-real-time updates

- **What custom visualization tools are needed for unique metrics?**
  - Tier distribution histogram (how many nodes at each tier 0-30+)
  - Bidding wars visualization (multiple bids per story, price competition)
  - Deployment pipeline status (development → staging → production URLs)
  - Token holder transparency (project progress, all 3 deployment URLs visible)

- **How do we balance public transparency with privacy?**
  - Public: Platform health, aggregate node metrics, total revenue, tier distribution
  - Private: Individual node earnings details (unless node operator opts in)
  - Admin-only: Detailed performance metrics, operational dashboards

- **What's the user experience for different personas?**
  - Token holders: Project progress, platform health, investment tracking
  - Node operators: Personal performance, earnings, tier progression, profitability
  - Platform administrators: Operational metrics, infrastructure health, revenue tracking

#### 4. Infrastructure Monitoring

- **How do we monitor off-chain infrastructure?**
  - Akash deployments (3 environments: dev/staging/prod, 50+ AI nodes)
  - Arweave uploads (frontend deployments, document storage, success rates)
  - GitHub Actions (workflow success rates, build times, deployment pipelines)

- **What role should Grafana/Prometheus/Datadog play alongside blockchain analytics?**
  - Traditional monitoring for off-chain services
  - Integration with smart contract events (unified alerting)
  - Custom metrics from AI agents (story processing time, model inference costs)

- **How do we integrate smart contract events with traditional monitoring alerts?**
  - StoryFailed events → Slack/Discord notifications
  - StakeSlashed events → Critical alerts
  - RevenueThreshold events → Financial alerts
  - InfrastructureDown events → Operational alerts

- **What are the monitoring costs for 50+ AI nodes and 100+ active projects?**
  - Grafana Cloud vs. self-hosted Prometheus
  - Datadog vs. New Relic vs. Honeycomb
  - Log aggregation costs (ElasticSearch, Loki, CloudWatch)

#### 5. Public API Requirements

- **What public API endpoints are needed for transparency and third-party integrations?**
  - GET /metrics/platform - Platform health summary (active projects, nodes, total volume)
  - GET /metrics/nodes - Node performance by tier (success rates, earnings distribution)
  - GET /metrics/revenue - Platform fees and node earnings aggregates
  - GET /metrics/stories - Story metrics (completion times, failure rates, tier distribution)
  - GET /metrics/infrastructure - Deployment health (Akash, Arweave, GitHub)

- **How do we rate-limit and secure APIs while maintaining openness?**
  - Public tier: Rate-limited, no auth required, aggregate data only
  - Developer tier: API key required, higher limits, more granular data
  - Admin tier: OAuth/JWT, unlimited, full access to operational metrics

- **What data should be public vs. admin-only vs. node-operator-only?**
  - Public: Platform aggregates, tier distributions, total revenue
  - Node-operator-only: Personal earnings, success rates, tier progression, profitability
  - Admin-only: Infrastructure costs, RPC usage, detailed error logs

- **How do we version and document the analytics API?**
  - OpenAPI/Swagger specification (auto-generated docs)
  - Versioning strategy (v1, v2, deprecation policy)
  - Changelog and migration guides

#### 6. On-Chain Data Indexing Strategy

- **Which indexing approach is best for our requirements?**
  - Existing platform indexing (Dune, Flipside, Helius) - Turnkey but less customizable
  - Solana Geyser plugins - Custom indexing, full control, higher complexity
  - Yellowstone DBR - Real-time data replication, developer-friendly
  - Clockwork - Automated on-chain queries and indexing
  - Self-hosted TimescaleDB + custom indexer - Maximum control, highest dev effort

- **How do we handle custom Anchor account structures?**
  - NodeRegistry: tier, projectsCompleted, successRate, stakeMultiplier calculations
  - Project: epic_count, completed_epics, development_url, staging_url, production_url
  - Epic: story_count, completed_stories, staging_url, status
  - Story: epic_id, deployment_count, validation status, timestamps
  - Escrow: 90/10 splits, platform fee minimum ($0.25), stake tracking

- **What are RPC provider costs for analytics workloads?**
  - Historical data backfill (all transactions since genesis)
  - Real-time account monitoring (WebSocket subscriptions)
  - Query volume (API requests for dashboard updates)
  - Provider comparison: Helius, QuickNode, Triton, Alchemy, public RPC

### Secondary Questions (Nice to Have)

#### 7. Competitive Analysis

- **How do other Solana DeFi platforms handle analytics?**
  - Jupiter (DEX aggregator): Public dashboards, revenue tracking
  - Marinade (liquid staking): TVL tracking, APY calculations
  - Magic Eden (NFT marketplace): Sales volume, floor price tracking
  - Tensor (NFT AMM): Trading volume, liquidity metrics

- **What analytics best practices exist in the blockchain space?**
  - On-chain vs. off-chain metrics separation
  - Real-time vs. historical data strategies
  - Public transparency standards (DAO dashboards, protocol revenues)

- **Are there emerging analytics tools specifically for Anchor programs?**
  - Anchor-aware indexing (automatic IDL parsing)
  - Account relationship mapping (PDAs, associated accounts)
  - Event emission best practices for analytics

#### 8. Future Scalability

- **How do chosen solutions scale to 500+ nodes, 1K+ projects, 100K+ stories?**
  - Database performance (query optimization, indexing strategies)
  - API response times (caching, CDN, query pagination)
  - Dashboard rendering (data aggregation, chart performance)

- **What's the migration path if we outgrow existing platforms?**
  - Data export capabilities (CSV, JSON, API)
  - Self-hosted alternatives (TimescaleDB, ClickHouse, Grafana)
  - Vendor lock-in risks and mitigation strategies

- **Can we add predictive analytics later?**
  - Story completion ETA (based on historical node performance)
  - Node churn prediction (identify at-risk nodes)
  - Revenue forecasting (project growth trends)
  - Tier progression predictions (time to next tier)

#### 9. Developer Experience

- **How easy is it to add new metrics as the platform evolves?**
  - SQL-based queries (Dune, Flipside) - Easy for analysts
  - Custom indexing code - Requires developer changes
  - Event emission strategy - Add events to smart contracts for new metrics

- **What testing and staging environments are available?**
  - Analytics platform test accounts (free tiers, sandbox environments)
  - Devnet/Testnet indexing support (test analytics before mainnet)
  - Dashboard version control (Git-based, rollback capabilities)

- **How do we version control analytics queries and dashboards?**
  - Dune: Forks, version history, community sharing
  - Self-hosted: Git repos, infrastructure-as-code (Terraform, Ansible)
  - Grafana: JSON exports, provisioning via code

## Research Methodology

### Information Sources (Priority Order)

#### 1. Existing Solana Analytics Platforms (PRIMARY)

- **Dune Analytics** (https://dune.com/)
  - Solana support status and data freshness
  - SQL-based querying (accessible to non-developers)
  - Public dashboard embedding and sharing
  - Custom Anchor program indexing capabilities
  - Pricing: Free tier vs. paid plans (query volume, API access)

- **Flipside Crypto** (https://flipsidecrypto.xyz/)
  - Solana support and data coverage
  - Python/SQL APIs for programmatic access
  - Enterprise features (custom schemas, private dashboards)
  - Community bounties and query marketplace

- **Helius** (https://helius.dev/)
  - Solana-native enhanced RPC provider
  - Custom indexing via webhooks and Geyser plugins
  - Real-time account monitoring and transaction parsing
  - Analytics API capabilities

- **Jito Labs** (https://jito.network/)
  - MEV-focused, real-time Solana data
  - Block engine and validator metrics
  - Custom analytics for high-frequency trading

- **Nansen** (https://nansen.ai/)
  - Wallet analytics and on-chain intelligence
  - Solana support status (may be limited)
  - Entity labeling and portfolio tracking

- **Messari** (https://messari.io/)
  - Protocol metrics and research
  - API access for standardized metrics
  - DeFi protocol comparisons

- **DappRadar** (https://dapradar.com/)
  - General DApp analytics (user counts, transaction volume)
  - Multi-chain support including Solana

#### 2. Solana-Native Infrastructure Tools

- **Solana RPC Providers**
  - Helius (enhanced RPC, custom indexing)
  - QuickNode (managed RPC, analytics add-ons)
  - Triton (high-performance RPC)
  - Alchemy (multi-chain, Solana support)

- **Solana Indexing Frameworks**
  - Geyser plugins (custom account monitoring)
  - Yellowstone DBR (database replication)
  - Clockwork (on-chain automation and queries)

- **Anchor Program Introspection**
  - IDL parsing for automatic account structure extraction
  - Event emission patterns for analytics-friendly smart contracts

#### 3. Traditional Monitoring Platforms

- **Grafana Cloud** (https://grafana.com/products/cloud/)
  - Metrics, logs, traces (full observability stack)
  - Prometheus integration for time-series data
  - Dashboard templates and community plugins

- **Prometheus** (https://prometheus.io/)
  - Self-hosted time-series database
  - Pull-based metrics collection
  - AlertManager integration

- **Datadog** (https://www.datadoghq.com/)
  - Full-stack observability (APM, logs, metrics)
  - Solana integration availability
  - Cost: Usage-based pricing (hosts, logs, metrics)

- **Honeycomb** (https://www.honeycomb.io/)
  - Observability for complex distributed systems
  - High-cardinality data analysis
  - Cost: Event-based pricing

- **New Relic** (https://newrelic.com/)
  - Application performance monitoring (APM)
  - Infrastructure monitoring and alerting

#### 4. Open-Source Alternatives

- **Metabase** (https://www.metabase.com/)
  - Self-hosted BI tool, SQL-based dashboarding
  - Free open-source version, enterprise support available

- **Apache Superset** (https://superset.apache.org/)
  - Self-hosted dashboards, Python-based
  - Rich visualization library, SQL query interface

- **Redash** (https://redash.io/)
  - SQL-based dashboards and alerts
  - Self-hosted or cloud options

- **TimescaleDB** (https://www.timescale.com/)
  - Time-series PostgreSQL extension
  - Self-hosted or cloud managed
  - Excellent for blockchain analytics (time-series by nature)

### Analysis Frameworks

#### 1. Platform Evaluation Matrix

Compare each analytics platform on:

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Data Freshness** | 25% | Real-time (<1 min), near-real-time (<15 min), batch (hourly/daily) |
| **Custom Program Support** | 20% | Native Anchor indexing, manual decoding, API flexibility |
| **Cost Structure** | 20% | Free tier, usage-based, subscription, enterprise pricing |
| **Query Capabilities** | 15% | SQL, Python, GraphQL, REST API |
| **Visualization** | 10% | Public dashboards, embeds, custom charts, alerts |
| **Setup Time** | 10% | Days to production, documentation quality, community support |

**Scoring System:**
- ★★★★★ (5/5): Excellent, exceeds requirements
- ★★★★☆ (4/5): Good, meets requirements
- ★★★☆☆ (3/5): Adequate, some gaps
- ★★☆☆☆ (2/5): Poor, significant gaps
- ★☆☆☆☆ (1/5): Unacceptable, does not meet requirements

#### 2. Total Cost of Ownership (TCO) Analysis

Calculate 12-month costs for each solution:

**Cost Components:**
1. **Platform subscription/usage fees**
   - Free tier limitations (query volume, data retention, user seats)
   - Paid tier pricing (per query, per GB ingested, flat subscription)
   - Enterprise features (custom schemas, white-labeling, SLA)

2. **RPC/indexing costs** (data ingestion)
   - Historical data backfill (one-time cost)
   - Real-time account monitoring (ongoing WebSocket subscriptions)
   - Query volume (API requests for dashboard updates)

3. **API request costs** (public API usage)
   - Internal usage (dashboards, admin tools)
   - External usage (public API, third-party integrations)
   - Rate limiting and overage charges

4. **Infrastructure costs** (self-hosted components)
   - Database hosting (TimescaleDB, PostgreSQL)
   - Application servers (API gateway, caching layer)
   - CDN and static hosting (dashboards, embeds)

5. **Development time** (setup, integration, maintenance)
   - Initial setup: X dev-days @ $Y/day
   - Ongoing maintenance: Z hours/month @ $W/hour
   - New metrics development: A hours/metric

6. **Monitoring tools** (Grafana, Datadog, etc.)
   - Grafana Cloud vs. self-hosted Prometheus
   - Log aggregation (Loki, ElasticSearch, CloudWatch)
   - Alert management (PagerDuty, Opsgenie)

**Scenarios:**
- **Month 6**: 50 nodes, 100 projects, 2K stories, 10K API requests/day
- **Month 12**: 200 nodes, 500 projects, 10K stories, 50K API requests/day
- **Month 24**: 500 nodes, 1K projects, 50K stories, 200K API requests/day

#### 3. Build vs. Buy Decision Framework

Evaluate three approaches:

**Option A: Existing Platform (e.g., Dune Analytics)**
- ✅ **Pros**: Fast time-to-market, proven technology, community support
- ❌ **Cons**: Vendor lock-in, limited customization, ongoing costs
- **Time to production**: 1-2 weeks
- **12-month TCO**: $X
- **Best for**: Fast launch, limited dev resources, standard analytics needs

**Option B: Self-Hosted (TimescaleDB + Grafana)**
- ✅ **Pros**: Full control, no vendor lock-in, one-time setup cost
- ❌ **Cons**: High initial dev effort, ongoing maintenance burden
- **Time to production**: 6-8 weeks
- **12-month TCO**: $Y
- **Best for**: Long-term cost savings, custom requirements, in-house expertise

**Option C: Hybrid (Dune + Helius + Grafana)**
- ✅ **Pros**: Best of both worlds, flexible architecture
- ❌ **Cons**: Integration complexity, multiple vendor relationships
- **Time to production**: 3-4 weeks
- **12-month TCO**: $Z
- **Best for**: Balanced approach, short-term speed + long-term flexibility

**Decision Criteria:**
1. Time-to-market urgency (Milestone 5 = 10 weeks total)
2. Budget constraints (operational costs, dev time)
3. Customization needs (unique metrics, infinite tier calculations)
4. Vendor lock-in tolerance
5. In-house expertise (SQL, blockchain data, DevOps)

#### 4. Integration Architecture

Design data flow from Solana to dashboards:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLANA BLOCKCHAIN (State Source)             │
│  Smart Contracts: Project, Story, Epic, Escrow, NodeRegistry   │
└────────────────────┬────────────────────────────────────────────┘
                     │ Events & Account Updates
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                      INDEXING LAYER                             │
│  Option A: Dune/Flipside (managed indexing)                     │
│  Option B: Helius Geyser (custom webhooks)                      │
│  Option C: Self-hosted indexer (Yellowstone + TimescaleDB)      │
└────────────────────┬────────────────────────────────────────────┘
                     │ Parsed & Structured Data
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYTICS DATABASE                           │
│  Option A: Dune SQL tables (managed)                            │
│  Option B: TimescaleDB (self-hosted)                            │
│  Option C: Flipside datasets (managed)                          │
└────────────────────┬────────────────────────────────────────────┘
                     │ Aggregated Metrics
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│               DASHBOARDS & PUBLIC API                           │
│  Dashboards: Dune embeds, Grafana, custom React app            │
│  Public API: REST endpoints (rate-limited, cached)              │
└────────────────────┬────────────────────────────────────────────┘
                     │ Visual Data & API Responses
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                         END USERS                               │
│  Token Holders | Node Operators | Platform Admins              │
└─────────────────────────────────────────────────────────────────┘

                     ┌──────────────────────────┐
                     │  OFF-CHAIN MONITORING    │
                     │  Grafana + Prometheus    │
                     │  Akash, Arweave, GitHub  │
                     └──────────────────────────┘
```

### Data Quality Requirements

**Accuracy:**
- No missed transactions (100% blockchain data coverage)
- Correct account parsing (Anchor IDL-based deserialization)
- Validated calculations (tier formulas match smart contract logic)

**Recency:**
- Platform health metrics: Real-time preferred, 5-15 min acceptable
- Node performance: Daily aggregation acceptable
- Revenue metrics: Hourly updates sufficient
- Infrastructure monitoring: Real-time alerts required (<1 min)

**Completeness:**
- Historical data retention: 12+ months minimum
- All smart contract events indexed (StoryCreated, BidAccepted, StakeSlashed, etc.)
- Off-chain infrastructure metrics (Akash, Arweave, GitHub)

**Credibility:**
- Official platform documentation and current pricing (January 2025)
- Case studies from similar Solana projects (DeFi, NFT marketplaces)
- Community reputation and reviews (Twitter, Discord, GitHub)
- Production uptime SLAs (99%+, incident history)

## Expected Deliverables

### 1. Executive Summary (2-3 pages)

#### Recommended Solution
- **Primary analytics platform**: [Dune / Flipside / Helius / Self-hosted / Hybrid]
- **Rationale**: [3-5 key reasons for selection]
- **Architecture diagram**: Data flow from Solana → Dashboards
- **12-month TCO**: $X (breakdown: platform $Y, RPC $Z, dev time $W)
- **Implementation timeline**: 10 weeks (Milestone 5 breakdown)

#### Key Findings
**Top 3 Platform Options:**

| Rank | Platform | Pros | Cons | 12-Month TCO |
|------|----------|------|------|--------------|
| 1 | [Platform A] | [Strengths] | [Weaknesses] | $X |
| 2 | [Platform B] | [Strengths] | [Weaknesses] | $Y |
| 3 | [Platform C] | [Strengths] | [Weaknesses] | $Z |

**Critical Risks:**
1. [Risk 1]: [Impact] - Mitigation: [Strategy]
2. [Risk 2]: [Impact] - Mitigation: [Strategy]
3. [Risk 3]: [Impact] - Mitigation: [Strategy]

**Performance Expectations:**
- Data freshness: [Real-time / 5-15 min / Hourly]
- Query response time: [<1s / <5s / <30s]
- Dashboard load time: [<2s / <5s / <10s]
- Scalability: [500 nodes, 1K projects supported: Yes/No]

#### Go/No-Go Recommendation

✅ **GO** - Recommended solution meets all requirements within budget and timeline

**Success Criteria:**
1. Epic 11.1 (On-chain metrics): Delivered Week 2 ✅
2. Epic 11.2 (Node analytics): Delivered Week 4 ✅
3. Epic 11.3 (Revenue dashboard): Delivered Week 6 ✅
4. Epic 11.4 (Public API): Delivered Week 6 ✅
5. Epic 11.5 (Infrastructure monitoring): Delivered Week 8 ✅

**Resource Requirements:**
- Development team: 1-2 developers (full-time, 10 weeks)
- Budget: $X setup + $Y/month operational
- Infrastructure: [Platform subscriptions, RPC providers, monitoring tools]

### 2. Detailed Analysis (15-25 pages)

#### Section 1: Platform Vendor Comparison

For each evaluated platform (minimum 5):

**A. Platform Overview**
- Name, company, market position, founding year
- Target audience (DeFi protocols, NFT marketplaces, general Web3)
- Solana support status (native, multi-chain, beta)
- Total projects using platform (credibility indicator)

**B. Technical Capabilities**

**Data Sources:**
- RPC providers used (Helius, QuickNode, native infrastructure)
- Indexing methods (Geyser plugins, custom parsers, community-contributed)
- Historical data depth (genesis block or recent months)

**Custom Anchor Program Support:**
- How to index custom smart contracts (IDL upload, manual decoding, API)
- Account structure parsing (nested structs, enums, PDAs)
- Event indexing (automatic event tables or manual extraction)
- Tier calculation support (can SQL handle sqrt, exp, floor functions?)

**Query Languages & APIs:**
- SQL (PostgreSQL dialect, DuckDB, custom)
- Python (notebooks, API scripts, scheduled queries)
- GraphQL (real-time subscriptions, schema generation)
- REST API (rate limits, authentication, pagination)

**Data Freshness:**
- Real-time (<1 min): Live event streaming, WebSocket updates
- Near-real-time (5-15 min): Batch indexing, periodic refreshes
- Batch (hourly/daily): Scheduled aggregations, data warehouse sync

**Visualization & Dashboards:**
- Built-in charts (line, bar, pie, area, scatter, heatmap)
- Custom visualizations (JavaScript/React plugins)
- Public dashboard sharing (embeddable iframes, custom domains)
- Access control (public, link-only, password-protected, private)
- Branding (white-labeling, custom CSS, logo upload)

**C. Cost Structure**

**Free Tier:**
- Query execution limits (queries/month, execution time/query)
- Data retention (7 days, 30 days, 1 year)
- User seats (single user, team of 3, unlimited)
- Export capabilities (CSV, JSON, API access)

**Paid Tiers:**
- Pricing model (per query, per GB ingested, flat subscription)
- Tier comparison (Starter, Pro, Business, Enterprise)
- Overage charges (extra queries, storage, API requests)
- Annual discounts (10%, 20%, custom)

**Hidden Costs:**
- RPC costs (if not included in platform)
- Support fees (community forums vs. dedicated support)
- Custom features (white-labeling, SLA, dedicated infrastructure)
- Data export charges (bulk exports, API rate limit increases)

**Example Pricing (Hypothetical):**
- Dune: $0 (free tier, 25 query runs/day) → $399/mo (Plus: unlimited queries, API access)
- Flipside: $0 (community) → $2,000/mo (enterprise: custom schemas, SLA)
- Helius: $0 (free tier, 100 req/s) → $500/mo (Pro: 1,000 req/s, webhooks)

**D. Integration Requirements**

**Setup Time:**
- Account creation: Minutes
- Custom program indexing: Hours to days (IDL upload, event mapping)
- First working dashboard: Days to weeks
- Production-ready: Weeks

**Required Skills:**
- SQL proficiency (basic SELECT vs. complex JOINs/CTEs)
- Blockchain knowledge (transactions, accounts, events, PDAs)
- Data visualization (chart selection, dashboard design)
- API integration (REST, authentication, rate limiting)

**Documentation Quality:**
- Tutorials and quickstarts (step-by-step guides, video tutorials)
- API reference (comprehensive, searchable, code examples)
- Community content (blog posts, YouTube tutorials, Discord channels)
- Case studies (similar projects, code repositories)

**SDK/API Availability:**
- TypeScript/JavaScript SDK (npm packages, type definitions)
- Python SDK (pip packages, Jupyter notebook examples)
- CLI tools (terminal-based queries, CI/CD integration)
- Webhooks (event-driven data delivery, custom endpoints)

**Community Support:**
- Official Discord/Telegram (response times, active moderators)
- Stack Overflow tag (number of questions, answer rate)
- GitHub examples (sample code, community contributions)
- Office hours (live support, AMAs, workshops)

**E. Scalability & Performance**

**Data Retention:**
- Maximum historical data (1 year, 3 years, unlimited)
- Archival options (cold storage, on-demand retrieval)

**Query Performance:**
- Simple queries (<1s, <5s, <30s)
- Complex aggregations (<10s, <1m, <5m)
- Full table scans (supported, discouraged, impossible)
- Query optimization tools (EXPLAIN, index suggestions)

**Concurrent Users:**
- Dashboard viewers (10, 100, 1000 simultaneous)
- Query executors (single user, team, organization-wide)

**API Rate Limits:**
- Free tier (10 req/min, 100 req/day)
- Paid tier (1,000 req/min, unlimited)
- Burst limits (5x normal rate for 60s)

**Real-Time Capabilities:**
- WebSocket subscriptions (live dashboard updates)
- Polling frequency (refresh dashboards every 10s, 1m, 5m)
- Event latency (seconds, minutes from on-chain)

**F. Vendor Risk Assessment**

**Company Stability:**
- Funding rounds (Series A, B, C, bootstrap)
- Revenue model (sustainable, VC-dependent, unclear)
- Team size (10, 50, 200 employees)
- Market position (leader, challenger, niche)

**Platform Uptime:**
- Published SLA (99%, 99.9%, 99.99%)
- Incident history (status page, postmortems)
- Redundancy (multi-region, failover, backups)

**Data Portability:**
- Export formats (CSV, JSON, Parquet, SQL dumps)
- API data access (bulk export endpoints)
- Self-hosting options (export to own database)

**Vendor Lock-In:**
- Proprietary query language (custom SQL dialect, non-standard)
- Platform-specific features (can't replicate elsewhere)
- Migration complexity (days, weeks, months to switch)

**Exit Strategy:**
- Data export capabilities (full historical data)
- Alternative platforms (similar features, compatible workflows)
- Self-hosting fallback (TimescaleDB + Grafana)

---

**Platforms to Evaluate (Minimum 5):**

1. **Dune Analytics** (https://dune.com/)
2. **Flipside Crypto** (https://flipsidecrypto.xyz/)
3. **Helius** (https://helius.dev/)
4. **Jito Labs** (https://jito.network/)
5. **Nansen** (https://nansen.ai/)
6. **Self-Hosted** (Geyser + TimescaleDB + Grafana)

---

#### Section 2: Metrics Specification

Define **specific queries and calculations** for each Epic 11 story:

**Story 11.1: On-Chain Metrics Aggregation**

**Metrics:**
1. **Total Projects**
   - Active (status: InProgress, not abandoned)
   - Completed (status: Completed, all epics done)
   - Failed (status: Failed or Abandoned)
   - Growth: New projects per week (time-series)

2. **Total Stories**
   - By status: Created, Assigned, InProgress, InReview, Completed, Failed
   - By tier: Story counts grouped by max tier eligible (tier 0-5, 5-10, 10-20, 20-30, 30+)
   - Growth: Stories created per week (time-series)

3. **Total Volume (SOL & USD)**
   - Total SOL locked in escrow (current)
   - Total SOL paid out to nodes (historical)
   - Total platform fees collected (historical, 10% of payments)
   - USD equivalent using Pyth oracle historical prices

4. **Platform Activity**
   - Active bids (open opportunities with bids)
   - Story completion rate (completed / total created)
   - Average story duration (time from Created to Completed)

**SQL Pseudocode Examples:**

```sql
-- Total projects by status
SELECT
  status,
  COUNT(*) as project_count
FROM projects
GROUP BY status;

-- Total stories by tier eligibility
SELECT
  CASE
    WHEN max_story_size_usd <= 5 THEN 'Tier 0-1'
    WHEN max_story_size_usd <= 13 THEN 'Tier 2-3'
    WHEN max_story_size_usd <= 27 THEN 'Tier 4-5'
    WHEN max_story_size_usd <= 144 THEN 'Tier 6-10'
    ELSE 'Tier 11+'
  END as tier_range,
  COUNT(*) as story_count
FROM stories
JOIN node_registry ON stories.assigned_node = node_registry.pubkey
GROUP BY tier_range;

-- Platform revenue (10% fee) with USD conversion
SELECT
  DATE_TRUNC('month', completed_at) as month,
  SUM(payment_amount_sol * 0.10) as platform_fee_sol,
  SUM(payment_amount_sol * 0.10 * pyth_price_usd) as platform_fee_usd
FROM stories
WHERE status = 'Completed'
GROUP BY month
ORDER BY month DESC;
```

**Story 11.2: Node Performance Analytics**

**Metrics:**
1. **Active Nodes by Tier**
   - Tier distribution histogram (how many nodes at tier 0, 1, 2, ..., 30+)
   - Tier progression over time (nodes moving up tiers)

2. **Success Rate by Tier**
   - Formula: completed_stories / attempted_stories (where attempted = assigned stories)
   - Grouped by tier (tier 0: X%, tier 1: Y%, etc.)
   - Identifies if lower tiers struggle more (expected) or if system is broken

3. **Average Story Completion Time**
   - By tier: Do higher tier nodes complete faster? (skill or easier stories?)
   - By story size (USD value): Larger stories take longer?
   - Time distribution: Median, 75th percentile, 95th percentile

4. **Bid Acceptance Rate**
   - Bids submitted vs. bids accepted (per node, per tier)
   - Competitive pressure indicator (high rejection = fierce competition)

5. **Stake Slashing Events**
   - Frequency: How often do nodes get slashed? (per tier)
   - Amount slashed: Total SOL burned + redistributed
   - Identifies bad actors or systemic quality issues

**Example Queries (Tier Calculation Integration):**

```sql
-- Node tier distribution (using infinite tier formula)
SELECT
  FLOOR(SQRT(projects_completed) * success_rate) as tier,
  COUNT(*) as node_count
FROM node_registry
WHERE projects_completed > 0
GROUP BY tier
ORDER BY tier;

-- Average completion time by tier
SELECT
  FLOOR(SQRT(nr.projects_completed) * nr.success_rate) as tier,
  AVG(EXTRACT(EPOCH FROM (s.completed_at - s.created_at)) / 86400) as avg_days
FROM stories s
JOIN node_registry nr ON s.assigned_node = nr.pubkey
WHERE s.status = 'Completed'
GROUP BY tier
ORDER BY tier;

-- Success rate by tier (completed vs attempted)
SELECT
  FLOOR(SQRT(nr.projects_completed) * nr.success_rate) as tier,
  COUNT(CASE WHEN s.status = 'Completed' THEN 1 END) as completed,
  COUNT(*) as attempted,
  ROUND(COUNT(CASE WHEN s.status = 'Completed' THEN 1 END)::NUMERIC / COUNT(*) * 100, 2) as success_rate_pct
FROM stories s
JOIN node_registry nr ON s.assigned_node = nr.pubkey
WHERE s.status IN ('Completed', 'Failed')
GROUP BY tier
ORDER BY tier;
```

**Story 11.3: Revenue Dashboard**

**Metrics:**
1. **Platform Fees Collected**
   - Daily, weekly, monthly aggregates
   - Growth trend (time-series chart)
   - Cumulative total (lifetime platform revenue)

2. **Node Earnings Distribution**
   - Total earnings (all nodes, all time)
   - By tier: Do higher tier nodes earn more? (expected: yes, larger stories)
   - Gini coefficient: Measure earnings inequality (0 = perfect equality, 1 = one node earns all)
   - Percentile distribution: Top 10% nodes earn X%, bottom 50% earn Y%

3. **Average Earnings per Node**
   - By tier: Tier 0 avg = $X/month, Tier 10 avg = $Y/month
   - Active vs. inactive nodes (exclude nodes with 0 earnings in last 30 days)

4. **ROI Calculations**
   - Story-level ROI: (Payment - AI cost) / Stake locked × (365 / duration days) = annualized ROI
   - Node-level ROI: Total earnings / Total capital locked (average over time)

5. **Payment Flow Tracking**
   - Escrow → Node (90%) + Platform (10% OR $0.25 min)
   - Example: $2 story → Node $1.75 (87.5%), Platform $0.25 (12.5%, minimum applies)
   - Example: $10 story → Node $9.00 (90%), Platform $1.00 (10%)

**Example Queries (Cost Attribution, 90/10 Split Logic):**

```sql
-- Platform fees with minimum $0.25 enforcement
SELECT
  story_id,
  payment_amount_sol,
  payment_amount_usd,
  GREATEST(payment_amount_sol * 0.10, 0.25 / pyth_price_usd) as platform_fee_sol,
  GREATEST(payment_amount_usd * 0.10, 0.25) as platform_fee_usd,
  payment_amount_sol - GREATEST(payment_amount_sol * 0.10, 0.25 / pyth_price_usd) as node_payment_sol
FROM escrow_payments
WHERE status = 'Released';

-- Node earnings distribution by tier
SELECT
  FLOOR(SQRT(nr.projects_completed) * nr.success_rate) as tier,
  COUNT(DISTINCT nr.pubkey) as node_count,
  SUM(s.node_payment_sol) as total_earnings_sol,
  AVG(s.node_payment_sol) as avg_earnings_per_story_sol,
  SUM(s.node_payment_sol) / COUNT(DISTINCT nr.pubkey) as avg_earnings_per_node_sol
FROM stories s
JOIN node_registry nr ON s.assigned_node = nr.pubkey
WHERE s.status = 'Completed'
GROUP BY tier
ORDER BY tier;

-- Gini coefficient for earnings inequality
WITH earnings AS (
  SELECT
    assigned_node,
    SUM(node_payment_sol) as total_earnings
  FROM stories
  WHERE status = 'Completed'
  GROUP BY assigned_node
),
ranked AS (
  SELECT
    total_earnings,
    ROW_NUMBER() OVER (ORDER BY total_earnings) as rank,
    COUNT(*) OVER () as total_nodes
  FROM earnings
)
SELECT
  1 - (2 * SUM(total_earnings * rank) / (SUM(total_earnings) * total_nodes)) as gini_coefficient
FROM ranked;
```

**Story 11.4: Public Metrics API**

**API Endpoint Specifications (REST format):**

```
GET /api/v1/metrics/platform
Response:
{
  "active_projects": 142,
  "active_nodes": 67,
  "total_stories_completed": 3420,
  "total_volume_sol": 15234.56,
  "total_volume_usd": 3045678.90,
  "platform_fees_collected_sol": 1523.45,
  "platform_fees_collected_usd": 304567.89,
  "avg_story_completion_time_days": 5.3,
  "last_updated": "2025-01-15T10:30:00Z"
}

GET /api/v1/metrics/nodes?tier={tier}
Response:
{
  "tier": 5,
  "node_count": 12,
  "avg_success_rate": 0.94,
  "avg_completion_time_days": 4.2,
  "total_earnings_sol": 2345.67,
  "avg_earnings_per_node_sol": 195.47
}

GET /api/v1/metrics/revenue?period={daily|weekly|monthly}&start={date}&end={date}
Response:
{
  "period": "monthly",
  "data": [
    {
      "period_start": "2025-01-01",
      "platform_fees_sol": 456.78,
      "platform_fees_usd": 91356.00,
      "node_earnings_sol": 4111.02,
      "node_earnings_usd": 822204.00,
      "total_volume_sol": 4567.80,
      "total_volume_usd": 913560.00
    }
  ]
}
```

**Rate Limiting Strategy:**
- Public tier: 100 requests/hour, no authentication
- Developer tier: 1,000 requests/hour, API key required
- Admin tier: Unlimited, OAuth/JWT authentication

**Authentication Models:**
- Public: No auth (rate limit by IP)
- Developer: API key (header: `X-API-Key: your_key_here`)
- Admin: JWT token (header: `Authorization: Bearer {token}`)

**Response Format:**
- JSON (default)
- CSV (add `?format=csv` query param)
- Pagination (add `?page=2&limit=100`)

**OpenAPI/Swagger Specification:**
```yaml
openapi: 3.0.0
info:
  title: Slop Machine Analytics API
  version: 1.0.0
paths:
  /api/v1/metrics/platform:
    get:
      summary: Platform health metrics
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  active_projects:
                    type: integer
                  active_nodes:
                    type: integer
                  # ... additional fields
```

**Story 11.5: Infrastructure Health Monitoring**

**Metrics:**
1. **Akash Deployment Status**
   - 3 backend environments (dev/staging/prod): Online/Offline
   - 50+ AI worker nodes: Uptime percentage, heartbeat tracking
   - Resource utilization: CPU, RAM, storage usage
   - Provider health: Which Akash providers are used, their uptime

2. **Arweave Upload Success Rate**
   - Total uploads (frontends, documents, deployments)
   - Success rate: Uploads confirmed on-chain / Total attempts
   - Average upload time (seconds to transaction confirmation)
   - Cost tracking: Total AR spent on uploads

3. **GitHub Actions Workflow Metrics**
   - Build success rate (passed / total runs)
   - Test pass rate (test failures, flaky tests)
   - Deployment success rate (deployments to Arweave/Akash)
   - Average workflow duration (build time, test time, deploy time)

4. **RPC Provider Health**
   - Latency: Average response time per RPC endpoint
   - Error rates: 4xx, 5xx responses
   - Rate limit hits: How often do we hit limits?
   - Failover events: Primary RPC down → fallback triggered

5. **Node Agent Uptime**
   - Heartbeat tracking: Last seen timestamp for each AI agent
   - Offline nodes: Agents not responding for >5 minutes
   - Story processing time: Time from bid acceptance to completion
   - Error logs: Failed story attempts, exception tracking

**Grafana/Prometheus Integration Examples:**

```yaml
# Prometheus scrape config for AI nodes
scrape_configs:
  - job_name: 'ai_nodes'
    static_configs:
      - targets: ['node1.akash.network:9090', 'node2.akash.network:9090']
    metrics_path: '/metrics'
    scrape_interval: 30s

# Example metrics exposed by AI nodes
# HELP ai_node_stories_completed_total Total stories completed by this node
# TYPE ai_node_stories_completed_total counter
ai_node_stories_completed_total{tier="5"} 47

# HELP ai_node_story_duration_seconds Time taken to complete a story
# TYPE ai_node_story_duration_seconds histogram
ai_node_story_duration_seconds_bucket{le="300"} 10
ai_node_story_duration_seconds_bucket{le="600"} 35
ai_node_story_duration_seconds_bucket{le="+Inf"} 47
```

```json
// Grafana dashboard panel config (JSON)
{
  "title": "Akash Node Uptime",
  "type": "graph",
  "targets": [
    {
      "expr": "up{job='ai_nodes'}",
      "legendFormat": "{{instance}}"
    }
  ],
  "yaxes": [
    {
      "format": "short",
      "label": "Status (1=up, 0=down)"
    }
  ]
}
```

**Alert Rules:**

```yaml
# Prometheus alert rules
groups:
  - name: slop_machine_alerts
    rules:
      - alert: AINodeDown
        expr: up{job="ai_nodes"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "AI node {{ $labels.instance }} is down"

      - alert: HighStoryFailureRate
        expr: rate(ai_node_stories_failed_total[1h]) / rate(ai_node_stories_total[1h]) > 0.2
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Node {{ $labels.instance }} has >20% story failure rate"

      - alert: ArweaveUploadFailure
        expr: rate(arweave_upload_failures_total[5m]) > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Arweave uploads are failing"
```

---

#### Section 3: Architecture Design

**A. Data Flow Architecture**

```
┌──────────────────────────────────────────────────────────────────┐
│                   SOLANA BLOCKCHAIN (State)                      │
│  Smart Contracts: Project, Story, Epic, Escrow, NodeRegistry    │
│  Events: StoryCreated, BidAccepted, StoryCompleted, etc.        │
└──────────────┬───────────────────────────────────────────────────┘
               │ WebSocket subscriptions / RPC queries
               ↓
┌──────────────────────────────────────────────────────────────────┐
│                     INDEXING LAYER                               │
│  Option A: Dune managed indexing (automatic Solana parsing)     │
│  Option B: Helius Geyser webhooks (custom event delivery)       │
│  Option C: Self-hosted indexer (Yellowstone + TimescaleDB)      │
│                                                                  │
│  Responsibilities:                                               │
│  - Parse Anchor account data (IDL-based deserialization)        │
│  - Extract events from transaction logs                         │
│  - Calculate derived metrics (tier, success rate)               │
│  - Store in analytics-optimized database                        │
└──────────────┬───────────────────────────────────────────────────┘
               │ Structured data (tables, time-series)
               ↓
┌──────────────────────────────────────────────────────────────────┐
│                   ANALYTICS DATABASE                             │
│  Option A: Dune SQL tables (managed, SQL queries)               │
│  Option B: TimescaleDB (self-hosted, PostgreSQL + time-series)  │
│  Option C: Flipside datasets (managed, Python/SQL APIs)         │
│                                                                  │
│  Tables:                                                         │
│  - projects (id, status, epic_count, urls)                      │
│  - stories (id, epic_id, tier, status, timestamps)              │
│  - node_registry (pubkey, tier, success_rate, earnings)         │
│  - escrow_payments (story_id, amount, platform_fee, node_pay)   │
└──────────────┬───────────────────────────────────────────────────┘
               │ Aggregated metrics (SQL queries, caching)
               ↓
┌──────────────────────────────────────────────────────────────────┐
│              DASHBOARDS & PUBLIC API LAYER                       │
│  Dashboards:                                                     │
│  - Token holder view (Dune embed, Grafana, custom React)        │
│  - Node operator view (personal metrics, earnings)              │
│  - Admin view (operational metrics, infrastructure)             │
│                                                                  │
│  Public API:                                                     │
│  - REST endpoints (rate-limited, cached, authenticated)         │
│  - WebSocket (real-time updates for premium users)              │
└──────────────┬───────────────────────────────────────────────────┘
               │ Visual dashboards + API responses
               ↓
┌──────────────────────────────────────────────────────────────────┐
│                        END USERS                                 │
│  Token Holders  |  Node Operators  |  Platform Admins           │
└──────────────────────────────────────────────────────────────────┘

         ┌─────────────────────────────────────────┐
         │   OFF-CHAIN INFRASTRUCTURE MONITORING   │
         │   (Parallel to blockchain analytics)    │
         ├─────────────────────────────────────────┤
         │  Grafana + Prometheus                   │
         │  - Akash node health (CPU, RAM, uptime) │
         │  - Arweave uploads (success, cost)      │
         │  - GitHub Actions (build, test, deploy) │
         │  - RPC provider latency/errors          │
         └─────────────────────────────────────────┘
```

**B. Component Breakdown**

**1. Indexing Layer**

**Option A: Dune Analytics Managed Indexing**
- ✅ Automatic Solana blockchain parsing (no custom code)
- ✅ SQL-based querying (accessible to non-developers)
- ✅ Community queries (reuse existing Solana analytics)
- ❌ Limited customization (can't tweak indexing logic)
- ❌ Vendor lock-in (proprietary query language extensions)

**Option B: Helius Geyser Webhooks**
- ✅ Custom indexing logic (filter accounts, events)
- ✅ Real-time delivery (<1s latency)
- ✅ Webhook endpoints (POST JSON to your API)
- ❌ Requires custom backend (receive webhooks, parse, store)
- ❌ Higher dev effort (write indexing code)

**Option C: Self-Hosted Indexer (Yellowstone + TimescaleDB)**
- ✅ Maximum control (custom logic, optimizations)
- ✅ No vendor lock-in (own infrastructure)
- ✅ Cost-effective at scale (one-time setup)
- ❌ Highest dev effort (6-8 weeks initial setup)
- ❌ Ongoing maintenance (updates, backups, scaling)

**2. Analytics Database**

**Dune SQL Tables (Managed):**
- Pre-indexed Solana data (solana.transactions, solana.blocks)
- Custom tables via decoded logs (upload IDL, query events)
- Query editor with autocomplete and schema browser

**TimescaleDB (Self-Hosted):**
- PostgreSQL + time-series extension (optimized for blockchain data)
- Continuous aggregates (pre-computed metrics, fast queries)
- Retention policies (auto-delete old data, save storage)
- Compression (reduce storage costs by 10-20x)

**3. Dashboard Layer**

**Token Holder Dashboard (Public):**
- Metrics: Active projects, platform volume, recent deployments
- Charts: Project growth (time-series), tier distribution (histogram)
- Transparency: All 3 deployment URLs (development, staging, production)
- Embed: Iframe on slopmachine.fun homepage

**Node Operator Dashboard (Private):**
- Metrics: Personal earnings, success rate, tier progression
- Charts: Earnings over time, story completion rate, ROI calculator
- Actions: Withdraw earnings, update settings, view transaction history

**Admin Dashboard (Internal):**
- Metrics: Infrastructure health, RPC costs, error rates
- Charts: Akash node uptime, Arweave upload costs, GitHub Action success
- Alerts: Critical failures, stake slashing events, revenue anomalies

**4. API Gateway**

**Architecture:**
```
User Request → Cloudflare (DDoS protection, caching)
            ↓
       Rate Limiter (Redis-based, per IP / per API key)
            ↓
     API Server (Express/Fastify, TypeScript)
            ↓
     Query Cache (Redis, 1-5 min TTL)
            ↓
  Analytics DB (Dune API / TimescaleDB / Flipside)
            ↓
       Response (JSON, cached for next request)
```

**Caching Strategy:**
- Short-lived (1 min): Platform health, recent stories
- Medium-lived (5 min): Node performance, tier distribution
- Long-lived (1 hour): Historical revenue, completed projects
- Invalidation: On new StoryCompleted events (clear relevant caches)

**C. Smart Contract Integration**

**Analytics-Friendly Event Emission:**

```rust
// Anchor smart contract - emit events for analytics
#[event]
pub struct StoryCreated {
    pub story_id: Pubkey,
    pub project_id: Pubkey,
    pub epic_id: Pubkey,
    pub max_price_sol: u64,
    pub tier_requirement: u8,
    pub timestamp: i64,
}

#[event]
pub struct BidAccepted {
    pub story_id: Pubkey,
    pub node_pubkey: Pubkey,
    pub bid_amount_sol: u64,
    pub stake_amount_sol: u64,
    pub node_tier: u8,
    pub timestamp: i64,
}

#[event]
pub struct StoryCompleted {
    pub story_id: Pubkey,
    pub node_pubkey: Pubkey,
    pub payment_sol: u64,
    pub platform_fee_sol: u64,
    pub completion_time_seconds: i64,
    pub validation_passed: bool,
    pub timestamp: i64,
}
```

**Account Structure Optimizations:**

```rust
// NodeRegistry account - designed for efficient queries
#[account]
pub struct NodeRegistry {
    pub pubkey: Pubkey,
    pub tier: u8,                    // Pre-calculated tier (avoid sqrt in queries)
    pub projects_completed: u32,     // Raw count for recalculation
    pub projects_attempted: u32,     // For success rate
    pub success_rate: u16,           // Basis points (9500 = 95%)
    pub total_earnings_lamports: u64,
    pub total_stake_slashed_lamports: u64,
    pub created_at: i64,
    pub last_active_at: i64,
}
```

**IDL Usage:**
- Upload Anchor IDL to analytics platform (Dune, Flipside)
- Automatic account parsing (no manual decoding)
- Event tables auto-generated (StoryCreated, BidAccepted, etc.)

**D. Security and Privacy**

**Public vs. Private Metrics Boundaries:**

| Metric | Public | Node Operator | Admin |
|--------|--------|---------------|-------|
| Total platform volume | ✅ | ✅ | ✅ |
| Active projects/nodes | ✅ | ✅ | ✅ |
| Tier distribution | ✅ | ✅ | ✅ |
| Individual node earnings | ❌ | ✅ (own only) | ✅ (all) |
| Story failure reasons | ❌ | ✅ (own) | ✅ (all) |
| Infrastructure costs | ❌ | ❌ | ✅ |
| RPC provider details | ❌ | ❌ | ✅ |

**API Authentication:**

**Public Tier (No Auth):**
- Rate limit: 100 requests/hour per IP
- Data: Aggregate metrics only (no individual node details)
- Caching: Aggressive (5 min TTL, reduce load)

**Developer Tier (API Key):**
```typescript
// Request with API key
fetch('https://api.slopmachine.com/v1/metrics/nodes', {
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
})
```
- Rate limit: 1,000 requests/hour
- Data: Granular metrics, historical data, CSV exports
- Pricing: Free for <10K requests/month, $0.01 per 1K after

**Admin Tier (JWT):**
```typescript
// OAuth2 login → JWT token
const token = await loginWithWallet(phantomWallet);
fetch('https://api.slopmachine.com/v1/admin/metrics', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```
- Rate limit: Unlimited
- Data: Full access (infrastructure, costs, logs)
- Authentication: Wallet-based (sign message with admin wallet)

**Rate Limiting Implementation:**

```typescript
// Redis-based rate limiter (sliding window)
import { RateLimiterRedis } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'api_ratelimit',
  points: 100, // Number of requests
  duration: 3600, // Per hour
});

app.use(async (req, res, next) => {
  try {
    const key = req.headers['x-api-key'] || req.ip;
    await rateLimiter.consume(key);
    next();
  } catch (err) {
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
});
```

**Data Anonymization:**

```sql
-- Public API: Aggregate earnings without exposing individual nodes
SELECT
  tier,
  COUNT(*) as node_count,
  AVG(total_earnings_sol) as avg_earnings,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_earnings_sol) as median_earnings
FROM node_registry
GROUP BY tier;

-- NOT this (exposes individual nodes):
-- SELECT pubkey, total_earnings_sol FROM node_registry;
```

---

#### Section 4: Implementation Roadmap

**10-Week Timeline (Milestone 5)**

**Phase 1: Foundation (Week 1-2)**

**Week 1:**
- Day 1-2: Platform selection finalized (based on this research)
- Day 3-4: Account setup, RPC provider configuration
- Day 5: IDL upload, basic account indexing test
- **Deliverable**: Platform configured, first test query successful

**Week 2:**
- Day 1-2: Story 11.1 implementation - On-chain metrics aggregation
  - SQL queries: Total projects, total stories, total volume
  - Dashboard: Basic platform health metrics
- Day 3-4: Data validation (compare on-chain vs. indexed data)
- Day 5: Public dashboard v1 (embeddable iframe)
- **Deliverable**: Story 11.1 complete ✅ - Public platform dashboard live

**Phase 2: Node Analytics (Week 3-4)**

**Week 3:**
- Day 1-2: Story 11.2 implementation - Node performance analytics
  - Tier distribution calculation (infinite tier formulas in SQL)
  - Success rate by tier aggregation
- Day 3-4: Average story completion time queries
  - Time-series analysis (completion times over weeks/months)
  - Tier-based comparison (do higher tiers complete faster?)
- Day 5: Bid acceptance rate and stake slashing metrics
- **Deliverable**: Node performance queries tested, draft dashboard

**Week 4:**
- Day 1-2: Node operator dashboard (private, wallet-gated)
  - Personal metrics: Earnings, success rate, tier progression
  - Charts: Earnings over time, story history
- Day 3-4: Tier progression visualization
  - Animated tier climb (node starts tier 0, progresses to tier 10)
  - Historical tier changes (time-series of tier recalculations)
- Day 5: Testing and refinement
- **Deliverable**: Story 11.2 complete ✅ - Node analytics dashboards live

**Phase 3: Revenue & Transparency (Week 5-6)**

**Week 5:**
- Day 1-2: Story 11.3 implementation - Revenue dashboard
  - Platform fees collected (daily/weekly/monthly aggregates)
  - Node earnings distribution (total, by tier, Gini coefficient)
- Day 3-4: Payment flow tracking
  - Escrow → 90% node + 10% platform (OR $0.25 min)
  - Example calculations for $2, $3, $10 stories
- Day 5: ROI calculations
  - Story-level ROI: Annualized return on stake
  - Node-level profitability: Earnings vs. infrastructure costs
- **Deliverable**: Story 11.3 complete ✅ - Revenue dashboards live

**Week 6:**
- Day 1-2: Story 11.4 implementation - Public API development
  - API endpoints: /platform, /nodes, /revenue, /stories
  - Rate limiting (Redis-based, per IP / per API key)
- Day 3-4: API documentation (OpenAPI/Swagger)
  - Interactive docs (try API in browser)
  - Code examples (TypeScript, Python, curl)
- Day 5: API testing and security hardening
  - Rate limit testing (burst, sustained load)
  - DDoS protection (Cloudflare integration)
- **Deliverable**: Story 11.4 complete ✅ - Public API v1 live

**Phase 4: Infrastructure Monitoring (Week 7-8)**

**Week 7:**
- Day 1-2: Story 11.5 implementation - Grafana/Prometheus setup
  - Prometheus server (self-hosted on Akash or Railway)
  - Metrics exporters (AI nodes, Akash deployments)
- Day 3-4: Akash deployment monitoring
  - 3 backend environments (dev/staging/prod) health
  - 50+ AI worker node uptime tracking
- Day 5: Arweave upload metrics
  - Success rate, upload time, cost tracking
- **Deliverable**: Infrastructure monitoring baseline

**Week 8:**
- Day 1-2: GitHub Actions metrics
  - Workflow success rates (build, test, deploy)
  - Average workflow duration, flaky tests
- Day 3-4: RPC provider health monitoring
  - Latency, error rates, rate limit hits
  - Failover testing (primary RPC down → fallback)
- Day 5: Alert configuration
  - Critical alerts: Node down, high failure rate, Arweave upload failures
  - Slack/Discord webhook integration
- **Deliverable**: Story 11.5 complete ✅ - Full monitoring stack operational

**Phase 5: Optimization & Launch (Week 9-10)**

**Week 9:**
- Day 1-2: Performance tuning
  - Query optimization (add indexes, rewrite slow queries)
  - Caching layer implementation (Redis for API responses)
- Day 3-4: Dashboard UX improvements
  - Mobile responsiveness (dashboards work on phones)
  - Loading states, error handling, retry logic
- Day 5: User testing
  - Token holder feedback (is transparency sufficient?)
  - Node operator feedback (are metrics useful?)
- **Deliverable**: Optimized analytics system, user feedback incorporated

**Week 10:**
- Day 1-2: Documentation
  - User guides (how to read dashboards)
  - Admin runbooks (how to troubleshoot, add metrics)
  - API documentation (examples, rate limits, pricing)
- Day 3-4: Final testing
  - Load testing (simulate 1,000 concurrent dashboard viewers)
  - Failover testing (RPC down, database down, recovery)
- Day 5: Production launch 🚀
  - Announcement: Blog post, Twitter thread, Discord
  - Monitoring: Watch for errors, performance issues
- **Deliverable**: Epic 11 complete ✅ - Production-ready analytics system

**Team Requirements:**
- 1-2 Full-stack developers (TypeScript, SQL, blockchain)
- Skills: Solana/Anchor, SQL (complex queries), Grafana/Prometheus, API design
- Time commitment: Full-time (40 hours/week), 10 weeks

**Budget:**
- Development: 2 devs × 10 weeks × $3,000/week = $60,000
- Platform costs: $500-2,000/month (depends on vendor choice)
- Infrastructure: $200-500/month (RPC, hosting, monitoring tools)

---

#### Section 5: Cost Analysis

**12-Month Total Cost of Ownership (TCO)**

**Scenario 1: Dune Analytics + Grafana Cloud**

| Cost Component | Setup | Month 6 | Month 12 | 12-Month Total |
|----------------|-------|---------|----------|----------------|
| Dune Analytics Plus | $0 | $399/mo | $399/mo | $4,788 |
| Helius RPC (Pro) | $0 | $250/mo | $500/mo | $4,500 |
| Grafana Cloud (Pro) | $0 | $50/mo | $100/mo | $900 |
| Cloudflare (API caching) | $0 | $20/mo | $20/mo | $240 |
| Development time | $30K | $2K/mo | $2K/mo | $54K |
| **TOTAL** | **$30K** | **$721/mo** | **$1,019/mo** | **$64,428** |

**Pros:**
- ✅ Fast time-to-market (2 weeks to basic dashboards)
- ✅ Managed services (minimal DevOps burden)
- ✅ Community support (Dune Discord, SQL templates)

**Cons:**
- ❌ Vendor lock-in (Dune proprietary SQL extensions)
- ❌ Ongoing costs (subscription forever)
- ❌ Limited customization (can't tweak indexing logic)

---

**Scenario 2: Flipside Crypto + Self-Hosted Prometheus**

| Cost Component | Setup | Month 6 | Month 12 | 12-Month Total |
|----------------|-------|---------|----------|----------------|
| Flipside Enterprise | $0 | $1,500/mo | $2,000/mo | $21,000 |
| Helius RPC (Pro) | $0 | $250/mo | $500/mo | $4,500 |
| Railway (Prometheus) | $0 | $50/mo | $100/mo | $900 |
| Cloudflare | $0 | $20/mo | $20/mo | $240 |
| Development time | $40K | $3K/mo | $3K/mo | $76K |
| **TOTAL** | **$40K** | **$1,820/mo** | **$2,620/mo** | **$102,640** |

**Pros:**
- ✅ Enterprise features (custom schemas, SLA)
- ✅ Python/SQL APIs (programmatic access)
- ✅ Community bounties (query marketplace)

**Cons:**
- ❌ High cost ($2K/mo at scale)
- ❌ Vendor lock-in (Flipside-specific tools)
- ❌ Overkill for Milestone 5 (enterprise features not needed)

---

**Scenario 3: Self-Hosted (Helius Geyser + TimescaleDB + Grafana)**

| Cost Component | Setup | Month 6 | Month 12 | 12-Month Total |
|----------------|-------|---------|----------|----------------|
| Helius RPC (Pro) | $0 | $250/mo | $500/mo | $4,500 |
| Railway (TimescaleDB) | $0 | $100/mo | $200/mo | $1,800 |
| Railway (API server) | $0 | $50/mo | $100/mo | $900 |
| Grafana Cloud (Free) | $0 | $0 | $0 | $0 |
| Cloudflare | $0 | $20/mo | $20/mo | $240 |
| Development time | $80K | $5K/mo | $5K/mo | $140K |
| **TOTAL** | **$80K** | **$420/mo** | **$820/mo** | **$147,440** |

**Pros:**
- ✅ No vendor lock-in (own infrastructure)
- ✅ Maximum customization (custom indexing, optimizations)
- ✅ Long-term cost savings (after initial setup)

**Cons:**
- ❌ High upfront dev cost ($80K, 8 weeks)
- ❌ Ongoing maintenance burden (updates, backups, scaling)
- ❌ Slow time-to-market (8 weeks vs. 2 weeks)

---

**Scenario 4: Hybrid (Dune + Helius Webhooks + Grafana)**

| Cost Component | Setup | Month 6 | Month 12 | 12-Month Total |
|----------------|-------|---------|----------|----------------|
| Dune Analytics Plus | $0 | $399/mo | $399/mo | $4,788 |
| Helius Pro (webhooks) | $0 | $250/mo | $500/mo | $4,500 |
| Railway (webhook API) | $0 | $50/mo | $100/mo | $900 |
| Grafana Cloud (Free) | $0 | $0 | $0 | $0 |
| Cloudflare | $0 | $20/mo | $20/mo | $240 |
| Development time | $40K | $3K/mo | $3K/mo | $76K |
| **TOTAL** | **$40K** | **$719/mo** | **$1,019/mo** | **$86,428** |

**Pros:**
- ✅ Balanced approach (fast + flexible)
- ✅ Dune for standard metrics, webhooks for custom
- ✅ Lower TCO than Flipside, faster than self-hosted

**Cons:**
- ❌ Integration complexity (two systems to maintain)
- ❌ Partial vendor lock-in (Dune for dashboards)

---

**Recommendation: Scenario 1 (Dune + Grafana) for Milestone 5**

**Rationale:**
1. **Time-to-market**: 2 weeks vs. 8 weeks (critical for Milestone 5)
2. **Cost**: $64K/year (vs. $102K Flipside, $147K self-hosted)
3. **Risk**: Low (proven platform, managed services)
4. **Future**: Can migrate to self-hosted in Year 2 if needed (data export via API)

---

### 3. Supporting Materials

**A. Proof-of-Concept Code Examples**

**1. Helius Geyser Plugin Configuration (YAML)**

```yaml
# helius-geyser-config.yaml
# Configure custom Anchor program indexing

programs:
  - address: "YourSlopMachineProgramID111111111111111111"
    name: "slop_machine"
    accounts:
      - name: "NodeRegistry"
        webhook: "https://api.yourdomain.com/webhooks/node-registry"
      - name: "Story"
        webhook: "https://api.yourdomain.com/webhooks/story"
      - name: "Escrow"
        webhook: "https://api.yourdomain.com/webhooks/escrow"
    events:
      - name: "StoryCreated"
        webhook: "https://api.yourdomain.com/webhooks/events/story-created"
      - name: "BidAccepted"
        webhook: "https://api.yourdomain.com/webhooks/events/bid-accepted"
      - name: "StoryCompleted"
        webhook: "https://api.yourdomain.com/webhooks/events/story-completed"
```

**2. Dune Analytics SQL Queries (5 Examples)**

```sql
-- Query 1: Platform health summary
SELECT
  COUNT(DISTINCT project_id) FILTER (WHERE status = 'InProgress') as active_projects,
  COUNT(DISTINCT node_pubkey) FILTER (WHERE last_active_at > NOW() - INTERVAL '7 days') as active_nodes,
  COUNT(*) FILTER (WHERE status = 'Completed') as total_stories_completed,
  SUM(payment_amount_sol) as total_volume_sol,
  SUM(payment_amount_sol * sol_usd_price) as total_volume_usd
FROM slop_machine.stories
WHERE created_at > '2025-01-01';

-- Query 2: Node tier distribution
SELECT
  FLOOR(SQRT(projects_completed) * (success_rate / 10000.0)) as tier,
  COUNT(*) as node_count
FROM slop_machine.node_registry
WHERE projects_completed > 0
GROUP BY tier
ORDER BY tier;

-- Query 3: Average story completion time by tier
WITH story_times AS (
  SELECT
    s.story_id,
    FLOOR(SQRT(nr.projects_completed) * (nr.success_rate / 10000.0)) as tier,
    EXTRACT(EPOCH FROM (s.completed_at - s.created_at)) / 86400 as duration_days
  FROM slop_machine.stories s
  JOIN slop_machine.node_registry nr ON s.assigned_node = nr.pubkey
  WHERE s.status = 'Completed'
)
SELECT
  tier,
  COUNT(*) as story_count,
  AVG(duration_days) as avg_duration_days,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_days) as median_duration_days
FROM story_times
GROUP BY tier
ORDER BY tier;

-- Query 4: Platform revenue (10% fee) with minimum $0.25 enforcement
SELECT
  DATE_TRUNC('month', completed_at) as month,
  COUNT(*) as stories_completed,
  SUM(payment_amount_sol) as total_payment_sol,
  SUM(GREATEST(payment_amount_sol * 0.10, 0.25 / sol_usd_price)) as platform_fee_sol,
  SUM(GREATEST(payment_amount_sol * 0.10, 0.25 / sol_usd_price) * sol_usd_price) as platform_fee_usd
FROM slop_machine.stories
WHERE status = 'Completed'
GROUP BY month
ORDER BY month DESC;

-- Query 5: Node earnings distribution (Gini coefficient)
WITH earnings AS (
  SELECT
    assigned_node,
    SUM(payment_amount_sol - platform_fee_sol) as total_earnings_sol
  FROM slop_machine.stories
  WHERE status = 'Completed'
  GROUP BY assigned_node
),
ranked AS (
  SELECT
    total_earnings_sol,
    ROW_NUMBER() OVER (ORDER BY total_earnings_sol) as rank,
    COUNT(*) OVER () as total_nodes,
    SUM(total_earnings_sol) OVER () as total_earnings
  FROM earnings
)
SELECT
  1 - (2 * SUM(total_earnings_sol * rank) / (total_earnings * total_nodes)) as gini_coefficient,
  total_nodes,
  total_earnings
FROM ranked
GROUP BY total_nodes, total_earnings;
```

**3. Public API Endpoints (TypeScript + Express)**

```typescript
// src/api/routes/metrics.ts
import express from 'express';
import { rateLimiter } from '../middleware/rateLimiter';
import { cache } from '../middleware/cache';
import { DuneClient } from '@duneanalytics/client-sdk';

const router = express.Router();
const dune = new DuneClient(process.env.DUNE_API_KEY!);

// GET /api/v1/metrics/platform
router.get('/platform',
  rateLimiter({ points: 100, duration: 3600 }), // 100 req/hour
  cache({ ttl: 60 }), // Cache for 1 minute
  async (req, res) => {
    try {
      const result = await dune.refresh({
        queryId: 1234567, // Dune query ID for platform metrics
      });

      res.json({
        active_projects: result.rows[0].active_projects,
        active_nodes: result.rows[0].active_nodes,
        total_stories_completed: result.rows[0].total_stories_completed,
        total_volume_sol: parseFloat(result.rows[0].total_volume_sol),
        total_volume_usd: parseFloat(result.rows[0].total_volume_usd),
        last_updated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch platform metrics' });
    }
  }
);

// GET /api/v1/metrics/nodes?tier=5
router.get('/nodes',
  rateLimiter({ points: 100, duration: 3600 }),
  cache({ ttl: 300 }), // Cache for 5 minutes
  async (req, res) => {
    const tier = parseInt(req.query.tier as string);

    const result = await dune.refresh({
      queryId: 7654321,
      parameters: { tier },
    });

    res.json({
      tier,
      node_count: result.rows[0].node_count,
      avg_success_rate: parseFloat(result.rows[0].avg_success_rate),
      avg_completion_time_days: parseFloat(result.rows[0].avg_completion_time_days),
      total_earnings_sol: parseFloat(result.rows[0].total_earnings_sol),
    });
  }
);

export default router;
```

**4. Grafana Dashboard JSON (Infrastructure Monitoring)**

```json
{
  "dashboard": {
    "title": "Slop Machine Infrastructure Health",
    "panels": [
      {
        "id": 1,
        "title": "AI Node Uptime",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job='ai_nodes'}",
            "legendFormat": "{{ instance }}"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "mappings": [
              { "value": 1, "text": "UP", "color": "green" },
              { "value": 0, "text": "DOWN", "color": "red" }
            ]
          }
        }
      },
      {
        "id": 2,
        "title": "Arweave Upload Success Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(arweave_uploads_success_total[5m]) / rate(arweave_uploads_total[5m])",
            "legendFormat": "Success Rate"
          }
        ],
        "yaxes": [
          {
            "format": "percentunit",
            "label": "Success Rate"
          }
        ]
      },
      {
        "id": 3,
        "title": "GitHub Actions Success Rate",
        "type": "gauge",
        "targets": [
          {
            "expr": "github_actions_success_total / github_actions_total",
            "legendFormat": "Success Rate"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "mode": "absolute",
              "steps": [
                { "value": 0, "color": "red" },
                { "value": 0.8, "color": "yellow" },
                { "value": 0.95, "color": "green" }
              ]
            }
          }
        }
      }
    ],
    "refresh": "30s",
    "time": {
      "from": "now-1h",
      "to": "now"
    }
  }
}
```

**5. Anchor Program Event Emission (Rust)**

```rust
// programs/slop-machine/src/lib.rs
use anchor_lang::prelude::*;

#[program]
pub mod slop_machine {
    use super::*;

    pub fn create_story(
        ctx: Context<CreateStory>,
        max_price_sol: u64,
        tier_requirement: u8,
    ) -> Result<()> {
        let story = &mut ctx.accounts.story;
        story.project_id = ctx.accounts.project.key();
        story.epic_id = ctx.accounts.epic.key();
        story.max_price_sol = max_price_sol;
        story.status = StoryStatus::Created;
        story.created_at = Clock::get()?.unix_timestamp;

        // Emit event for analytics indexing
        emit!(StoryCreated {
            story_id: story.key(),
            project_id: story.project_id,
            epic_id: story.epic_id,
            max_price_sol,
            tier_requirement,
            timestamp: story.created_at,
        });

        Ok(())
    }

    pub fn complete_story(
        ctx: Context<CompleteStory>,
        validation_passed: bool,
    ) -> Result<()> {
        let story = &mut ctx.accounts.story;
        let node_registry = &ctx.accounts.node_registry;

        story.status = StoryStatus::Completed;
        story.completed_at = Some(Clock::get()?.unix_timestamp);

        let completion_time = story.completed_at.unwrap() - story.created_at;
        let payment_sol = story.max_price_sol;
        let platform_fee_sol = payment_sol.checked_div(10).unwrap().max(
            // $0.25 minimum in lamports (requires USD/SOL price from Pyth)
            (250_000_000_u64).checked_div(ctx.accounts.pyth_price.price as u64).unwrap()
        );

        emit!(StoryCompleted {
            story_id: story.key(),
            node_pubkey: node_registry.key(),
            payment_sol,
            platform_fee_sol,
            completion_time_seconds: completion_time,
            validation_passed,
            timestamp: story.completed_at.unwrap(),
        });

        Ok(())
    }
}

// Event definitions for analytics
#[event]
pub struct StoryCreated {
    pub story_id: Pubkey,
    pub project_id: Pubkey,
    pub epic_id: Pubkey,
    pub max_price_sol: u64,
    pub tier_requirement: u8,
    pub timestamp: i64,
}

#[event]
pub struct StoryCompleted {
    pub story_id: Pubkey,
    pub node_pubkey: Pubkey,
    pub payment_sol: u64,
    pub platform_fee_sol: u64,
    pub completion_time_seconds: i64,
    pub validation_passed: bool,
    pub timestamp: i64,
}
```

---

**B. Vendor Comparison Matrix (Spreadsheet)**

| Feature | Weight | Dune | Flipside | Helius | Self-Hosted | Score Calc |
|---------|--------|------|----------|--------|-------------|------------|
| **Data Freshness** | 25% | 15 min ★★★★☆ | 10 min ★★★★☆ | <1 min ★★★★★ | <1 min ★★★★★ | (Stars × 20) × Weight |
| **Custom Programs** | 20% | Manual IDL ★★★☆☆ | API upload ★★★★☆ | Webhooks ★★★★★ | Full control ★★★★★ | |
| **Cost (12mo)** | 20% | $65K ★★★★☆ | $103K ★★☆☆☆ | $86K ★★★☆☆ | $147K ★★☆☆☆ | (Inverse cost) |
| **Setup Time** | 15% | 2 weeks ★★★★★ | 3 weeks ★★★★☆ | 4 weeks ★★★☆☆ | 8 weeks ★★☆☆☆ | (Inverse time) |
| **Visualization** | 10% | Excellent ★★★★★ | Good ★★★★☆ | Limited ★★☆☆☆ | Grafana ★★★★☆ | |
| **API Quality** | 10% | REST ★★★☆☆ | Python/SQL ★★★★☆ | WebSocket ★★★★★ | Custom ★★★★★ | |
| **TOTAL SCORE** | 100% | **85/100** | **78/100** | **82/100** | **72/100** | |

**Winner: Dune Analytics** (fastest setup, good balance of features, acceptable cost)

---

**C. Reference Architecture Diagrams**

(Would include visual diagrams here - described textually for this deliverable)

**Diagram 1: High-Level Architecture**
- Solana Blockchain → Indexing Layer → Analytics DB → Dashboards/API → Users
- Parallel path: Off-chain Infrastructure → Prometheus → Grafana → Alerts

**Diagram 2: Indexing Pipeline**
- Solana RPC (Helius) → Geyser Plugin → Webhook → API Server → TimescaleDB
- Alternative: Solana RPC → Dune Managed Indexing → Dune SQL Tables

**Diagram 3: Dashboard User Flows**
- Token holder: Homepage → Public dashboard (platform health, recent projects)
- Node operator: Login (wallet) → Private dashboard (earnings, tier, profitability)
- Admin: OAuth → Admin panel (infrastructure, costs, errors)

**Diagram 4: API Architecture**
- User → Cloudflare (DDoS, caching) → Rate Limiter → API Server → Query Cache (Redis) → Analytics DB → Response

**Diagram 5: Monitoring & Alerting Workflow**
- AI Nodes (Prometheus /metrics) → Prometheus Server → Grafana (dashboards + alerts) → Slack/Discord webhooks

---

**D. Risk Register**

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| **Vendor API downtime** | Medium | High | Multi-vendor strategy (Dune + Helius fallback), caching layer | DevOps |
| **Cost overruns** | Medium | Medium | Usage alerts (95% of budget), spending caps, monthly reviews | Finance |
| **Data accuracy issues** | Low | High | Validation queries (compare on-chain vs. indexed), automated tests | Engineering |
| **Slow query performance** | Medium | Medium | Indexing optimization, query caching, pagination, materialized views | Backend |
| **Privacy violations** | Low | Critical | Access controls (wallet-gated dashboards), anonymized public APIs, audit logs | Security |
| **Vendor lock-in** | High | Medium | Data export scripts (weekly backups), migration plan to self-hosted (Year 2) | Architecture |
| **Infinite tier formula bugs** | Low | High | Unit tests for tier calculations, compare smart contract vs. analytics results | QA |
| **RPC rate limit hits** | Medium | Medium | Multiple RPC providers (Helius + QuickNode + Triton), circuit breaker pattern | DevOps |

---

## Success Criteria

This research is successful if it delivers:

1. ✅ **Implementation readiness** - Clear recommendation with vendor selected, ready to start Week 1 of Milestone 5
2. ✅ **Detailed implementation plan** - 10-week roadmap with weekly deliverables, resource requirements
3. ✅ **All code examples tested** - SQL queries runnable, API endpoints functional, Grafana dashboards importable
4. ✅ **Cost projections within budget** - 12-month TCO ≤ $100K (operational + dev time)
5. ✅ **Completeness** - All 6 primary research questions answered with evidence
6. ✅ **Minimum 5 analytics platforms evaluated** - Comparison matrix with scoring
7. ✅ **Proof-of-concept code** - Working examples for all 5 Epic 11 stories
8. ✅ **Risk mitigation** - Top 5 risks identified with mitigation strategies

## Timeline and Priority

**Priority:** 🔴 **CRITICAL** - Epic 11 is foundational for platform transparency and token holder confidence

**Urgency:** **Immediate** - Milestone 5 development starts in 2 weeks, research must complete before then

**Delivery Timeline: 5 Business Days**

- **Day 1-2 (CRITICAL)**: Platform vendor comparison + TCO analysis + Executive summary with recommendation
- **Day 2-3 (HIGH)**: Metrics specification (SQL queries for all Epic 11 stories) + Architecture design
- **Day 3-4 (MEDIUM)**: Proof-of-concept code examples (Dune SQL, API endpoints, Grafana dashboards)
- **Day 4-5 (NICE-TO-HAVE)**: Implementation roadmap (10-week plan) + Supporting materials (diagrams, spreadsheets)

**Delivery Format:**
- **Main research report**: `docs/platform-analytics-monitoring-research.md` (15-25 pages, comprehensive)
- **Executive decision brief**: `docs/platform-analytics-monitoring-decision-brief.md` (2-3 pages, standalone summary)
- **Code examples**: `docs/examples/analytics/` (SQL queries, API code, Grafana JSON, Anchor events)
- **Cost spreadsheet**: `docs/data/analytics-cost-comparison.xlsx` (12-month TCO for 4+ scenarios)

## Deliverables Output Location

**Documentation:**
- `docs/platform-analytics-monitoring-research.md` - Main research report (15-25 pages)
- `docs/platform-analytics-monitoring-decision-brief.md` - Executive summary (2-3 pages)
- `docs/README-Platform-Analytics.md` - Research overview and index

**Code Examples:**
- `docs/examples/analytics/dune-queries.sql` - 10+ Dune Analytics SQL queries
- `docs/examples/analytics/api-endpoints.ts` - Public API implementation (TypeScript)
- `docs/examples/analytics/grafana-dashboard.json` - Infrastructure monitoring dashboard
- `docs/examples/analytics/anchor-events.rs` - Smart contract event emission
- `docs/examples/analytics/helius-geyser-config.yaml` - Custom indexing configuration

**Data & Spreadsheets:**
- `docs/data/analytics-vendor-comparison.csv` - Platform evaluation matrix
- `docs/data/analytics-tco-12-month.xlsx` - Cost analysis (4 scenarios)

**Architecture:**
- `docs/architecture.md` - Update with Epic 11 analytics architecture section (if recommendation is GO)

## Next Steps After Research

**If Recommendation is GO (Expected):**

1. ✅ **Decision Meeting** (Day 6)
   - Review research findings with stakeholders (token holders, node operators, platform team)
   - Select analytics platform (likely Dune + Grafana based on TCO analysis)
   - Approve 10-week timeline and $60-80K budget
   - Assign Epic 11 to development team (1-2 developers)

2. ✅ **Epic 11 Story Refinement** (Day 7-8)
   - Update story acceptance criteria based on research (specific SQL queries, API endpoints)
   - Add technical specifications from architecture design (indexing strategy, caching, rate limiting)
   - Estimate story points (11.1: 13 pts, 11.2: 21 pts, 11.3: 13 pts, 11.4: 8 pts, 11.5: 13 pts)
   - Assign to 2-week sprints (Sprint 1: 11.1, Sprint 2: 11.2, Sprint 3: 11.3+11.4, Sprint 4: 11.5, Sprint 5: Optimization)

3. ✅ **Vendor Onboarding** (Week 1 of Milestone 5)
   - Set up Dune Analytics account (Plus tier, $399/mo)
   - Set up Helius RPC provider (Pro tier, $250/mo)
   - Configure smart contract indexing (upload Anchor IDL to Dune)
   - Establish monitoring baselines (Grafana Cloud free tier)
   - Deploy proof-of-concept dashboard (first platform metrics query)

4. ✅ **Continuous Improvement** (Ongoing after Week 10)
   - Monitor analytics system performance (query response times, dashboard load times)
   - Gather user feedback (token holders: "Is transparency sufficient?", node operators: "Are metrics useful?")
   - Iterate on dashboards and metrics (add requested charts, fix confusing visualizations)
   - Plan Phase 2 features (predictive analytics: story completion ETA, node churn prediction, revenue forecasting)

**If Recommendation is PARTIAL (Hybrid Approach):**

1. ⚠️ **Phased Implementation**
   - Phase 1: Dune for standard metrics (platform health, tier distribution) - 2 weeks
   - Phase 2: Helius webhooks for custom metrics (infinite tier calculations, real-time updates) - 4 weeks
   - Phase 3: Grafana for infrastructure monitoring (Akash, Arweave, GitHub) - 2 weeks
   - Phase 4: Self-hosted migration plan (if Dune limits are hit) - Future (Year 2)

2. ⚠️ **Integration Complexity**
   - Document data flow between Dune (dashboards) and Helius (real-time data)
   - Create unified API (aggregate data from multiple sources, consistent response format)
   - Test failover scenarios (Dune down → serve cached data, Helius down → fallback to Dune)

**If Recommendation is NO-GO (Unlikely):**

1. ❌ **Document Rejection Reasons**
   - Specific blockers: Cost too high (>$150K/year), technical limitations (can't index infinite tiers), vendor lock-in unacceptable
   - Alternative recommendations: Delay Epic 11 until Year 2, use basic RPC queries (no analytics platform), community-built dashboards

2. ❌ **Re-evaluation Criteria**
   - Market changes: Dune adds Anchor native support, Helius lowers pricing, new Solana analytics platform launches
   - Internal changes: Raised funding (budget increases), hired analytics team (can build self-hosted), user demand grows

3. ❌ **Minimal Viable Analytics**
   - Manual queries: Weekly RPC snapshots of NodeRegistry, Project, Story accounts
   - Basic dashboards: Google Sheets with copy-pasted data (not ideal, but functional)
   - Revisit Epic 11 in 6 months

## Notes

- **Epic 11 is foundational** for token holder transparency and community trust
- **Public dashboards** align with blockchain ethos (open, transparent, verifiable)
- **Existing platforms preferred** over custom builds (faster time-to-market, proven technology)
- **Dune Analytics likely winner** based on fast setup (2 weeks), SQL accessibility, public embedding, reasonable cost ($65K/year)
- **Infinite tier calculations** require mathematical functions in SQL (sqrt, exp, floor) - verify platform support
- **Real-time data** is nice-to-have, not must-have (5-15 min latency acceptable for most metrics)
- **Infrastructure monitoring** (Grafana/Prometheus) complements blockchain analytics (Dune) - both needed
- **Cost control** is critical (RPC costs can explode with historical backfills, monitor usage closely)
- **Privacy vs. transparency** balance: Aggregate public metrics, individual node data gated by wallet
- **API rate limiting** prevents abuse and controls costs (Redis-based sliding window)
- **Vendor lock-in** risk is manageable (data export APIs, migration plan to self-hosted Year 2 if needed)
