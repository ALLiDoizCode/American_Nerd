# Akash Network Feasibility Research Report

**Research Date:** October 7, 2025
**Project:** SlopMachine - AI Marketplace Infrastructure
**Priority:** 🔴 CRITICAL - Infrastructure Foundation Decision
**Research Duration:** 7 hours

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Detailed Findings](#detailed-findings)
   - [Deployment Capabilities](#deployment-capabilities)
   - [Technology Stack Support](#technology-stack-support)
   - [Infrastructure Requirements](#infrastructure-requirements)
   - [Custom Domain & SSL](#custom-domain--ssl)
   - [Cost Analysis](#cost-analysis)
   - [Developer Experience](#developer-experience)
   - [Reliability & Performance](#reliability--performance)
   - [Integration with Existing Stack](#integration-with-existing-stack)
3. [SlopMachine-Specific Use Cases](#slopmachine-specific-use-cases)
4. [Comparison Matrix](#comparison-matrix)
5. [Risk Assessment](#risk-assessment)
6. [Recommendation](#recommendation)
7. [Migration Path](#migration-path)
8. [Code Examples](#code-examples)

---

## Executive Summary

**Recommendation:** **⚠️ HYBRID APPROACH with PoC First**

**TL;DR:** Akash Network is technically capable of hosting SlopMachine's infrastructure and offers significant cost savings (70-85% vs. traditional cloud), but lacks critical features for the "slop or ship" user experience. A hybrid approach is recommended, with traditional cloud for frontend/preview deployments and potential Akash usage for backend workloads after validation.

### Key Findings

1. **Cost Savings are Real**: Akash offers 70-85% cost reduction vs. AWS/GCP/Azure, and is significantly cheaper than Vercel/Railway for compute-heavy workloads ($0.34-$2/month for typical deployments vs. $5-20+ on traditional platforms)

2. **🚨 CRITICAL BLOCKER: No Native Preview URLs**: Akash does not provide automatic preview/staging URLs for pull requests like Vercel/Netlify. This is a fundamental requirement for SlopMachine's "watch AI build in real-time" feature.

3. **SSL Requires Workaround**: No native Let's Encrypt integration. Requires Cloudflare as a reverse proxy for SSL/TLS, adding complexity.

4. **Docker-First Platform**: Strong Docker support, can run any containerized workload (Next.js SSR, Node.js APIs, Python, Rust, databases with persistent storage).

5. **GitHub Actions Integration Exists**: Official GitHub Action available (`ovrclk/akash-ghaction-templated-sdl@v1`) for CI/CD automation.

6. **Production Readiness Concerns**: Limited SLA documentation, no uptime guarantees found, decentralized nature means provider reliability varies. Not ideal for mission-critical user-facing frontends.

7. **Developer Experience Trade-off**: More complex than `vercel deploy` or `railway up`. Requires SDL file configuration, Akash CLI/Console, and minimum 5-10 AKT tokens (~$5-$10) as escrow.

### Critical Blockers

1. **No Preview URLs** - Dealbreaker for frontend deployments requiring staging environments per PR
2. **SSL Complexity** - Requires third-party reverse proxy (Cloudflare) for HTTPS
3. **No SLA/Uptime Guarantees** - Unclear reliability for production user-facing services
4. **Steeper Learning Curve** - Barrier for AI agents and developers unfamiliar with decentralized cloud

### Estimated Cost Impact

**Scenario: Month 5 of SlopMachine (50 AI nodes + 100 user projects)**

| Infrastructure | Akash (Est.) | Traditional Cloud (Est.) | Savings |
|----------------|--------------|--------------------------|---------|
| **50 AI Worker Nodes** (512MB RAM, 1 vCPU, 24/7) | $17-$100/mo | $250-$500/mo (Railway) | **67-80%** |
| **100 User Projects** (mix of static, SSR, APIs) | $50-$200/mo | $500-$2000/mo (Vercel + Railway) | **70-90%** |
| **Databases** (PostgreSQL, Redis) | $20-$100/mo | $100-$300/mo (Railway) | **67-80%** |
| **Total** | **$87-$400/mo** | **$850-$2800/mo** | **~70-85%** |

**Net Savings: $450-$2400/month or $5,400-$28,800/year**

However, these savings assume:
- Willingness to manage SDL configs and deployment complexity
- Acceptance of no preview URLs for frontend deployments
- Tolerance for variable provider reliability
- Engineering time investment for Akash integration

### Implementation Complexity

**Overall: HIGH**

- **Setup Complexity:** Medium-High (Akash CLI, wallet setup, SDL files, Cloudflare proxy)
- **Deployment Automation:** Medium (GitHub Actions integration exists but requires custom workflows)
- **Developer Experience:** Medium-Low (steeper learning curve than Vercel/Railway)
- **AI Agent Automation:** Medium (API/SDK exists, but more complex than traditional PaaS)

### Timeline to Migrate

**If adopting hybrid approach:**

- **Week 1-2:** PoC (deploy 1 AI node + 1 API + 1 database to Akash, test reliability)
- **Week 3-4:** Evaluate PoC results, finalize hybrid architecture decision
- **Week 5-8:** Implement Akash deployment automation for backend/node workloads
- **Week 9+:** Gradual migration of non-frontend workloads to Akash

**Total: 2-3 months** for production-ready hybrid infrastructure

---

## Detailed Findings

### Deployment Capabilities

#### Can Akash Replace Vercel/Netlify/Railway?

**Partially. Akash excels at Docker-based workloads but lacks PaaS conveniences.**

| Capability | Akash | Vercel/Netlify | Railway |
|------------|-------|----------------|---------|
| **Docker Support** | ✅ Full (required) | ⚠️ Limited/None | ✅ Full |
| **Preview URLs** | ❌ No native support | ✅ Automatic per PR | ✅ Automatic per PR |
| **Auto-deploy on push** | ⚠️ Via GitHub Actions | ✅ Built-in | ✅ Built-in |
| **Custom Domains** | ✅ Yes (manual CNAME) | ✅ Yes (automatic) | ✅ Yes (automatic) |
| **Auto SSL (Let's Encrypt)** | ❌ Requires Cloudflare | ✅ Automatic | ✅ Automatic |
| **Deployment Method** | SDL file + CLI/Console | Git push / CLI | Git push / CLI |

#### Deployment Workflow

**Akash Deployment Process:**

1. **Containerize application** (create Dockerfile)
2. **Build and push to Docker Hub** or other public registry
3. **Create SDL file** (`deploy.yaml`) specifying:
   - Docker image
   - Resource requirements (CPU, RAM, storage)
   - Port exposure
   - Pricing bid
4. **Deploy via Akash CLI or Console**
   - Submit deployment
   - Review provider bids
   - Accept bid and create lease
   - Send manifest to provider
5. **Configure custom domain** (CNAME to provider URL)
6. **Set up SSL via Cloudflare** (reverse proxy)

**Comparison to Vercel/Railway:**

```bash
# Vercel
vercel deploy  # Done. Preview URL + SSL automatic.

# Railway
railway up     # Done. Preview URL + SSL automatic.

# Akash
docker build -t user/app .
docker push user/app
# Create deploy.yaml with SDL config
akash tx deployment create deploy.yaml --from wallet
akash query market lease list --owner <address>
akash tx market lease create --dseq <dseq> --from wallet
akash provider send-manifest deploy.yaml --dseq <dseq>
# Configure Cloudflare CNAME and SSL
```

**Verdict:** Akash requires significantly more steps and manual configuration.

#### GitHub Actions Integration

**✅ Akash has an official GitHub Action:** `ovrclk/akash-ghaction-templated-sdl@v1`

**Example Workflow:**

```yaml
name: Deploy to Akash

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and Push Docker Image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/myapp:${{ github.sha }} .
          docker push ${{ secrets.DOCKER_USERNAME }}/myapp:${{ github.sha }}

      - name: Update Akash SDL
        uses: ovrclk/akash-ghaction-templated-sdl@v1
        env:
          IMAGE_TAG: ${{ github.sha }}

      - name: Deploy to Akash
        run: |
          # Deploy using Akash CLI (requires wallet and AKT tokens)
          akash tx deployment create deploy.yaml --from ${{ secrets.AKASH_WALLET }}
```

**Limitations:**
- Requires Akash wallet with AKT tokens
- No automatic preview URL generation for PRs
- More complex setup than Vercel/Railway built-in Git integration

---

### Technology Stack Support

#### Next.js (SSR)

**✅ Supported** - Official Akash documentation includes Next.js deployment guide

**Deployment Method:**
- Dockerized Next.js app with `npm start` (SSR) or `npm run export` (static)
- Recommended resources: 0.1 CPU, 512Mi RAM, 1Gi storage

**SDL Example:**

```yaml
version: "2.0"

services:
  nextjs:
    image: username/nextjs-app:latest
    expose:
      - port: 3000
        as: 80
        to:
          - global: true

profiles:
  compute:
    nextjs:
      resources:
        cpu:
          units: 0.1  # 100m
        memory:
          size: 512Mi
        storage:
          size: 1Gi

  placement:
    datacenter:
      pricing:
        nextjs:
          denom: uakt
          amount: 1000

deployment:
  nextjs:
    datacenter:
      profile: nextjs
      count: 1
```

**Known Limitations:**
- Only x86_64 processors officially supported (no ARM)
- Complex Next.js features (ISR, Middleware) may require additional configuration
- No edge network like Vercel (single provider location per deployment)

#### Node.js APIs (Express, Fastify, NestJS)

**✅ Fully Supported** - Any Node.js API can run in Docker container

**Examples Found:**
- NestJS deployment guide in official docs
- Express.js examples in awesome-akash repo

**Resource Requirements:**
- Typical API: 0.1-0.5 CPU, 256-512MB RAM
- Cost: $0.34-$2/month

#### Python APIs (FastAPI, Django)

**✅ Fully Supported** - Docker-based deployment

**No specific limitations found** - Standard Python Docker containers work

#### Rust APIs (Axum, Actix)

**✅ Fully Supported** - Compiled Rust binaries in Docker containers

**Advantages on Akash:**
- Lightweight binaries = lower resource costs
- Long-running API services work well

#### Databases (PostgreSQL, Redis)

**✅ Supported with Persistent Storage**

**Akash Mainnet 3.0** (launched 2022) added persistent storage feature specifically for databases and stateful workloads.

**Storage Classes:**
- `beta1` - HDD
- `beta2` - SSD
- `beta3` - NVMe

**PostgreSQL SDL Example:**

```yaml
services:
  postgres:
    image: postgres:15
    env:
      - POSTGRES_PASSWORD=secretpassword
    expose:
      - port: 5432
        to:
          - service: api

profiles:
  compute:
    postgres:
      resources:
        cpu:
          units: 0.5
        memory:
          size: 1Gi
        storage:
          - size: 10Gi
            attributes:
              persistent: true
              class: beta2  # SSD
```

**Persistent Storage Notes:**
- Data persists for lifetime of lease
- Provider creates volume on disk
- Similar to Docker volumes
- Can be remounted if lease renewed with same provider

**Found Examples in awesome-akash:**
- PostgreSQL
- MongoDB
- Redis
- CouchDB
- InfluxDB
- SurrealDB

#### Static Sites

**✅ Fully Supported** - Nginx or Caddy serving static files

**Simpler than SSR deployment** - Just serve pre-built files

#### WebSocket Support

**✅ Supported** - Found evidence of WebSocket apps running on Akash

**Example Found:** Akash-chat (LLM-based AI chat service) uses WebSocket for voice transcription

**No known limitations** for WebSocket connections

#### Rust CLI Binaries

**✅ Supported** - Can host compiled binaries for distribution

**Method:** Docker container serving binary over HTTP or exposed port

---

### Infrastructure Requirements

#### Can Akash Host AI Worker Nodes?

**✅ YES** - Akash is well-suited for 24/7 long-running Node.js processes

**SlopMachine AI Node Requirements:**
- Runtime: Node.js
- Memory: 512MB-1GB RAM
- CPU: 1 vCPU
- Storage: 1-5GB (persistent for node state)
- Network: Outbound to Claude API, inbound for job queue
- Uptime: 24/7

**Akash Can Provide:**
- ✅ Docker container with Node.js runtime
- ✅ Persistent storage (beta2/beta3 SSD/NVMe)
- ✅ 24/7 uptime (as long as lease is active and funded)
- ✅ Outbound network access (unlimited)
- ✅ Inbound access (expose ports to global internet)

**Estimated Cost per AI Node:**
- Resources: 0.5 vCPU, 512MB RAM, 5GB storage
- **Cost: $0.34-$2/month per node**
- **50 nodes: $17-$100/month**

**Compare to Railway:**
- 50 nodes x 512MB RAM x 24/7
- Estimated: $250-$500/month

**Savings: 67-80%**

#### Persistent Storage

**✅ Available** - Akash Mainnet 3.0+ supports persistent volumes

**Key Features:**
- Data persists through deployment lifecycle
- Multiple storage classes (HDD, SSD, NVMe)
- Standard Docker volume semantics
- Can be used for databases, file uploads, node state

**Limitations:**
- Storage tied to specific provider (not portable between providers)
- If lease ends and not renewed with same provider, data is lost
- Backup/restore is user's responsibility

#### Compute-Intensive Workloads

**✅ Supported** - Akash supports AI/ML workloads, including GPU compute

**GPU Pricing (from Akash):**
- H100: $1.49/hour
- A100 80GB: $0.79/hour
- A6000: $0.49/hour

**For SlopMachine Use Cases:**
- Code generation (via Claude API) - No GPU needed, CPU sufficient
- Test execution - CPU workloads supported
- Build processes - CPU workloads supported

**Resource Limits:**
- Up to 20 vCPUs
- Up to 128 GB RAM
- Up to 256 GB ephemeral storage
- Up to 256 GB persistent storage

**For typical workloads:** No practical limits

#### Infrastructure/DevOps AI Agent Automation

**✅ POSSIBLE** - Akash has programmatic deployment via CLI and API

**SlopMachine's DevOps AI agent needs:**
1. Programmatic deployment (not manual clicks)
2. Environment variable management
3. Secret management
4. Deployment status monitoring
5. Log access

**Akash Provides:**
- ✅ CLI tool (can be called from Node.js with `child_process`)
- ✅ Environment variables (in SDL file)
- ⚠️ Secret management (secrets in SDL file, not ideal for sensitive data)
- ✅ Deployment status (via CLI queries)
- ✅ Log access (via provider APIs)

**Complexity:** Medium-High compared to Railway/Vercel APIs

**Example: AI Agent Deploying to Akash**

```typescript
import { execSync } from 'child_process';

class AkashDeployer {
  async deploy(app: App) {
    // 1. Generate SDL file
    const sdl = this.generateSDL(app);

    // 2. Create deployment
    const deployCmd = `akash tx deployment create ${sdl} --from ${wallet}`;
    execSync(deployCmd);

    // 3. Query bids
    const bidsCmd = `akash query market bid list --owner ${address}`;
    const bids = JSON.parse(execSync(bidsCmd).toString());

    // 4. Accept best bid
    const lease = bids[0];
    const leaseCmd = `akash tx market lease create --dseq ${lease.dseq} --from ${wallet}`;
    execSync(leaseCmd);

    // 5. Send manifest
    const manifestCmd = `akash provider send-manifest ${sdl} --dseq ${lease.dseq}`;
    execSync(manifestCmd);

    return { url: lease.provider_url };
  }
}
```

**Verdict:** Akash deployment is automatable, but requires more code and error handling than traditional PaaS APIs.

---

### Custom Domain & SSL

#### Custom Domains

**✅ Supported** - Manual CNAME configuration

**Process:**
1. Deploy to Akash (get provider URL like `provider.akash.network`)
2. Add CNAME record: `myproject.slopmachine.fun` → `provider.akash.network`
3. Update SDL file to accept custom domain:

```yaml
services:
  web:
    expose:
      - port: 3000
        as: 80
        accept:
          - myproject.slopmachine.fun
        to:
          - global: true
```

**Wildcard Subdomains:**
- ⚠️ Not found in documentation
- Likely requires individual CNAME for each project
- Could be complex for 100+ projects

**API Automation:**
- ✅ SDL file can be generated programmatically
- ✅ DNS records can be automated (via Cloudflare API, Route53, etc.)

#### SSL/TLS Certificates

**❌ No Native Let's Encrypt** - Major limitation

**Current Solution: Cloudflare Proxy**

Akash deployments provide HTTP URLs, not HTTPS. To enable SSL:

1. **Use Cloudflare as reverse proxy:**
   - Add domain to Cloudflare
   - Set SSL mode to "Full"
   - Cloudflare terminates SSL, proxies to Akash HTTP
   - Cloudflare provides free SSL certificate

2. **Alternative: Run Caddy/Nginx with Let's Encrypt in container**
   - More complex
   - Requires exposing port 443
   - Requires DNS challenge for Let's Encrypt

**Implications for SlopMachine:**
- All custom domains must route through Cloudflare (or similar)
- Adds dependency on third-party service
- Additional configuration step for every deployment
- Cloudflare free tier may have limits for 100+ domains

**Automation Complexity:**
- Cloudflare API can automate DNS and SSL setup
- DevOps AI agent would need to integrate Cloudflare API + Akash CLI
- More moving parts = more potential failure points

**Verdict:** SSL on Akash requires workaround, increasing complexity vs. Vercel/Railway automatic SSL.

---

### Cost Analysis

#### Akash Pricing Model

**Reverse Auction System:**
- User specifies max price in SDL file (`amount: 1000` = 1000 uAKT/block)
- Providers bid to host deployment
- User accepts lowest bid
- Pricing is variable, depends on provider availability

**Pricing Units:**
- **1 AKT = 1,000,000 uAKT**
- Pricing is per block (~6 seconds on Cosmos chain)
- ~432,000 blocks per month

**Example Calculation:**

Small deployment (512MB RAM, 0.5 CPU):
- Bid: 1000 uAKT/block
- Monthly: 432,000 blocks × 1000 uAKT = 432,000,000 uAKT = **0.432 AKT**
- At $1.05 USD/AKT: **$0.45/month**

**Real-World Costs Found:**
- Personal site: **$2/month**
- 512MB RAM, 1 vCPU deployment: **$0.34/month**

#### Detailed Cost Breakdown

**SlopMachine Scale: Month 5 Target**

##### AI Worker Nodes (50 nodes)

**Spec per node:**
- 1 vCPU
- 512MB RAM
- 5GB persistent storage (SSD)
- 24/7 uptime

**Akash Cost:**
- Low estimate: $0.34/node × 50 = **$17/month**
- High estimate: $2/node × 50 = **$100/month**

**Railway Cost:**
- $20/vCPU/month (Railway pricing)
- 50 nodes × 1 vCPU × $20 × ~10% utilization = **$100/month** (if mostly idle)
- 50 nodes × 1 vCPU × $20 × 50% utilization = **$500/month** (if moderately active)

**Akash Savings: $83-$483/month (67-95%)**

##### User Projects (100 projects)

**Mix:**
- 60 static sites (Nginx, 256MB RAM, 0.1 CPU)
- 30 Next.js SSR apps (512MB RAM, 0.5 CPU)
- 10 APIs with PostgreSQL (1GB RAM, 1 CPU each + 500MB DB)

**Akash Cost Estimates:**

Static sites:
- 60 × $0.34/month = **$20/month**

Next.js SSR:
- 30 × $1/month = **$30/month**

APIs + PostgreSQL:
- APIs: 10 × $2/month = $20/month
- Databases: 10 × $1.50/month = $15/month
- Subtotal: **$35/month**

**Total Akash: $85/month**

**Vercel + Railway Cost Estimates:**

Static sites on Vercel:
- Likely fit in Hobby free tier if low traffic
- Assume: **$0-$100/month**

Next.js SSR on Vercel:
- Pro plan: $20/month + overages
- 30 sites with moderate traffic: **$300-$600/month**

APIs + PostgreSQL on Railway:
- Hobby plan: $5/month/service
- 10 APIs + 10 DBs = 20 services × $5 = **$100/month** (if low usage)
- With higher utilization: **$200-$500/month**

**Total Traditional: $400-$1200/month**

**Akash Savings: $315-$1115/month (79-93%)**

##### Total Cost Comparison

| Infrastructure Component | Akash (Est.) | Traditional (Est.) | Savings |
|-------------------------|--------------|-------------------|---------|
| 50 AI Worker Nodes | $17-$100/mo | $100-$500/mo | $83-$400/mo |
| 100 User Projects | $85/mo | $400-$1200/mo | $315-$1115/mo |
| **TOTAL** | **$102-$185/mo** | **$500-$1700/mo** | **$398-$1515/mo** |
| **Annual** | **$1,224-$2,220** | **$6,000-$20,400** | **$4,776-$18,180** |

**Effective Savings: 70-88%**

#### Hidden Costs & Considerations

**Akash Hidden Costs:**
- **Initial Escrow:** 5-10 AKT tokens required upfront (~$5-$10 USD)
- **AKT Price Volatility:** If AKT price increases, compute costs increase (paid in AKT)
- **Lease Renewal Fees:** Small blockchain transaction fees when renewing leases
- **Cloudflare (for SSL):** Free tier likely sufficient, but enterprise tier may be needed at scale

**Engineering Time Costs:**
- Learning curve: 1-2 weeks
- Deployment automation: 2-4 weeks
- Ongoing maintenance: Higher than traditional PaaS

**Trade-off:** Cost savings are real, but require engineering investment and operational complexity.

#### Vercel Pricing (2025)

**Hobby Plan:** Free
- 100 GB bandwidth
- Automatic deployments
- Serverless functions
- SSL + preview URLs
- **Limits:** Cannot exceed caps, no overages

**Pro Plan:** $20/user/month
- $20 included credit
- 1 TB bandwidth included
- Additional bandwidth: **$0.15/GB**
- Additional serverless functions: **$2/million edge requests**
- **Overages can get expensive for high-traffic sites**

**Example Overage Scenario:**
- SlopMachine has 50 projects with 10GB bandwidth each
- Total: 500GB/month
- Pro plan: $20 + (500GB - 100GB) × $0.15 = $20 + $60 = **$80/month for 50 sites**

**Cost scales with usage.**

#### Railway Pricing (2025)

**Hobby Plan:** $5/month
- Includes $5 resource credit
- Limits: 8 vCPU, 8GB RAM, 5GB storage per service
- Pay overage if exceed $5

**Pro Plan:** $20/month
- Includes $20 resource credit
- No hard limits

**Resource Costs:**
- **$20/vCPU/month**
- Based on actual utilization (idle time costs less)

**Example:**
- 10 services × 1 vCPU × 20% avg utilization = 2 vCPU utilized
- Cost: 2 × $20 = **$40/month** + $5 or $20 subscription = **$45-$60/month**

**Railway is usage-based, can be cost-effective for idle workloads.**

#### Cost Verdict

**Akash is dramatically cheaper (70-88% savings) for compute-heavy workloads.**

However:
- Requires AKT token management
- Price volatility risk
- More operational complexity
- Hidden costs in engineering time

**Best Use Case for Akash Cost Savings:**
- Backend services (APIs, worker nodes, databases)
- Steady-state 24/7 workloads
- Teams with DevOps expertise

**Poor Use Case:**
- Low-traffic sites (Vercel Hobby free tier is hard to beat)
- Burst traffic (traditional PaaS auto-scales better)
- Teams prioritizing developer experience over cost

---

### Developer Experience

#### Deployment Complexity

**Akash: Moderate-High Complexity**

**Initial Setup:**
1. Install Akash CLI
2. Create Akash wallet
3. Fund wallet with 5-10 AKT tokens (~$5-$10)
4. Generate certificate (for deployment authentication)
5. Store certificate on Akash blockchain

**Deployment Steps:**
1. Write Dockerfile
2. Build and push to Docker Hub
3. Write SDL file (`deploy.yaml`)
4. Deploy via CLI or Console
5. Review provider bids
6. Accept bid and create lease
7. Send manifest to provider
8. Configure DNS CNAME
9. Set up Cloudflare for SSL

**Compare to:**

**Vercel:**
1. Connect GitHub repo
2. Click "Deploy"
3. Done. Preview URL + SSL automatic.

**Railway:**
1. Connect GitHub repo or run `railway up`
2. Done. Preview URL + SSL automatic.

**Akash is 5-10x more complex for initial deployment.**

#### Learning Curve

**Concepts to Learn:**
- Docker & containerization
- SDL file syntax
- Akash CLI commands
- Provider marketplace & bidding
- Lease management
- AKT token/wallet management
- Cloudflare setup for SSL

**Estimated Time to Proficiency:**
- Beginner: 1-2 weeks
- Experienced DevOps: 2-3 days

**Compare to:**
- Vercel/Railway: 30 minutes - 1 hour

#### API/SDK for Programmatic Deployment

**✅ Akash CLI can be scripted**

Akash doesn't have a high-level SDK (like Vercel's Node.js SDK), but:
- CLI commands can be called via shell
- JSON output can be parsed
- Automatable from Node.js/Python

**Example: Node.js Wrapper**

```typescript
import { execSync } from 'child_process';

class AkashAPI {
  constructor(private wallet: string, private keyring: string) {}

  deploy(sdlPath: string): Deployment {
    const cmd = `akash tx deployment create ${sdlPath} --from ${this.wallet} --keyring-backend ${this.keyring} --output json`;
    const result = execSync(cmd).toString();
    return JSON.parse(result);
  }

  queryLeases(owner: string): Lease[] {
    const cmd = `akash query market lease list --owner ${owner} --output json`;
    const result = execSync(cmd).toString();
    return JSON.parse(result).leases;
  }

  sendManifest(sdlPath: string, dseq: string): void {
    const cmd = `akash provider send-manifest ${sdlPath} --dseq ${dseq} --from ${this.wallet}`;
    execSync(cmd);
  }
}
```

**Limitations:**
- CLI calls are slower than HTTP API calls
- Error handling is more complex (parsing stderr)
- Requires Akash CLI installed in CI/CD environment

**Verdict:** Akash can be automated, but requires more custom code than Vercel/Railway SDKs.

#### Logs & Monitoring

**Akash Logs:**
- Available via provider APIs
- Command: `akash provider lease-logs --dseq <dseq> --provider <provider>`
- Real-time streaming supported

**Monitoring:**
- No built-in monitoring dashboard (like Vercel Analytics or Railway Metrics)
- User must set up own monitoring (Grafana, Prometheus, Datadog, etc.)
- Grafana deployment example exists in awesome-akash

**Verdict:** Akash logs are accessible but require more manual setup than traditional PaaS integrated dashboards.

#### Debugging Experience

**Akash Debugging:**

**Common Issues:**
1. **Deployment fails to get bids**
   - Cause: Price too low, resource requirements too high, or no providers available
   - Debug: Increase bid price, reduce resources, or try different datacenter

2. **Lease created but app not accessible**
   - Cause: Port not exposed correctly in SDL, firewall issues, or provider issues
   - Debug: Check SDL `expose` config, test provider URL directly

3. **SSL not working**
   - Cause: Cloudflare not configured, DNS not propagated
   - Debug: Check Cloudflare proxy status, wait for DNS propagation

**Compare to Vercel/Railway:**
- Build logs in web UI
- Deployment preview with one-click rollback
- Automatic error detection and suggestions

**Verdict:** Akash debugging is more manual and requires deeper networking knowledge.

#### Existing GitHub Actions

**✅ Official Akash GitHub Action:** `ovrclk/akash-ghaction-templated-sdl@v1`

**Functionality:**
- Dynamically updates SDL files with environment variables
- Useful for injecting commit SHA, image tags, etc.

**Example:**

```yaml
- name: Update SDL
  uses: ovrclk/akash-ghaction-templated-sdl@v1
  env:
    IMAGE_TAG: ${{ github.sha }}
    API_KEY: ${{ secrets.API_KEY }}
```

**Limitations:**
- Only updates SDL file, doesn't perform deployment
- Still need to run Akash CLI commands for actual deployment

**Verdict:** GitHub Actions integration exists but is minimal. Requires custom workflow for full CI/CD.

#### Developer Experience Verdict

**Akash is NOT beginner-friendly.**

**Pros:**
- Full control over deployment configuration
- Powerful for advanced use cases
- Good for teams with strong DevOps skills

**Cons:**
- Steep learning curve
- Manual configuration required (SDL, DNS, SSL)
- No integrated dashboard or UX polish
- More steps to deploy than traditional PaaS

**Best Fit:**
- Backend/infrastructure workloads where cost savings justify complexity
- Teams willing to invest in Akash expertise

**Poor Fit:**
- Rapid prototyping
- Teams prioritizing velocity over cost
- Non-technical users deploying projects

---

### Reliability & Performance

#### Uptime & SLA

**⚠️ NO FORMAL SLA FOUND**

Research did not find:
- Published uptime statistics
- SLA guarantees (99.9%, 99.99%, etc.)
- Uptime monitoring dashboard

**What Akash Claims:**
- Decentralized nature eliminates single points of failure
- Resilience grows with number of providers
- Better fault tolerance than centralized clouds

**Reality:**
- Uptime depends on individual provider reliability
- If provider goes down, deployment goes down
- No automatic failover between providers (would require manual lease migration)

**Compare to Traditional Cloud:**
- AWS EC2: 99.99% SLA
- Vercel: 99.99% uptime target
- Railway: No formal SLA (but built on GCP/AWS)

**Implications for SlopMachine:**
- **User-facing frontends:** High uptime critical (users watching "slop or ship" live)
  - **Risk:** Akash provider outage = site down = bad UX
- **Backend APIs/worker nodes:** More tolerance for brief downtime
  - **Risk:** Acceptable for internal workloads

**Verdict:** Akash reliability is **unproven** for mission-critical user-facing applications. Better suited for backend workloads with failover.

#### Performance & Latency

**Akash Performance Factors:**

1. **No Global CDN**
   - Deployment runs on single provider in one location
   - Users far from provider location will have higher latency
   - Compare to Vercel Edge Network (global CDN with 100+ locations)

2. **Provider Hardware Variability**
   - Providers have different hardware specs
   - Performance depends on which provider wins bid
   - No guaranteed CPU/RAM/disk performance tiers

3. **Network Performance**
   - Depends on provider's datacenter network
   - No bandwidth guarantees

**Real-World Performance Data:**
- **NOT FOUND** in research
- No published benchmarks comparing Akash vs. AWS/GCP/Azure
- No latency measurements

**Estimated Performance:**

For typical workloads:
- **Compute:** Likely comparable to AWS/GCP (same x86 CPUs)
- **Network latency:** Higher for users far from provider location (no CDN)
- **Disk I/O:** Depends on storage class (beta1/beta2/beta3)

**Best Use Cases (Performance):**
- APIs serving regional traffic (not global)
- Worker nodes with background processing (latency-insensitive)
- Databases with persistent storage (SSD/NVMe)

**Poor Use Cases (Performance):**
- Global web apps requiring low latency worldwide
- Real-time applications (gaming, video streaming)
- High-bandwidth workloads

**Verdict:** Akash performance is likely **adequate but not optimal** for global user-facing apps. Suitable for backend services.

#### Failover & High Availability

**Akash HA Story:**

**Current State (2025):**
- No automatic multi-provider failover
- No load balancing across providers
- Single deployment = single provider

**To Achieve HA on Akash:**
- Deploy same app to multiple providers (multiple leases)
- Set up own load balancer (Cloudflare, Nginx)
- Monitor health and route traffic
- Manual failover if provider goes down

**Compare to Railway/Vercel:**
- Automatic multi-region deployment (on higher tiers)
- Built-in load balancing and failover
- Zero-downtime deploys

**Verdict:** Akash requires **manual HA setup**, not ideal for critical production apps.

#### Geographic Distribution

**Akash Providers:**
- Global network of providers
- User can specify datacenter preferences in SDL file

**SDL Example:**

```yaml
profiles:
  placement:
    westcoast:
      attributes:
        region: us-west
```

**Limitations:**
- Provider availability varies by region
- No guarantee of providers in specific regions
- Single deployment still runs on single provider (not multi-region)

**Verdict:** Akash has global providers, but no built-in multi-region deployment like AWS/Vercel.

#### Provider Outages

**What Happens if Provider Goes Down?**

1. Deployment becomes unavailable
2. Lease remains active (still paying)
3. User must:
   - Wait for provider to recover, OR
   - Migrate to new provider (manual process, potential downtime)

**No Automatic Failover.**

**Compare to Vercel/Railway:**
- Automatic failover to healthy nodes
- User doesn't need to do anything

**Risk Mitigation:**
- Choose reputable providers with high uptime history
- Monitor provider reliability over time
- Have backup deployment ready (multi-provider setup)

**Verdict:** Akash provider outages require manual intervention, increasing operational burden.

---

### Integration with Existing Stack

#### GitHub Actions Deployment

**✅ Possible** - Akash CLI can run in GitHub Actions

**Example Workflow:**

```yaml
name: Deploy to Akash

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Akash CLI
        run: |
          curl https://raw.githubusercontent.com/akash-network/node/main/install.sh | sh

      - name: Build Docker Image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/app:${{ github.sha }} .
          docker push ${{ secrets.DOCKER_USERNAME }}/app:${{ github.sha }}

      - name: Deploy to Akash
        env:
          AKASH_WALLET: ${{ secrets.AKASH_WALLET }}
          AKASH_KEYRING: ${{ secrets.AKASH_KEYRING }}
        run: |
          # Generate SDL with new image tag
          envsubst < deploy.template.yaml > deploy.yaml

          # Create deployment
          akash tx deployment create deploy.yaml --from $AKASH_WALLET --keyring-backend file

          # Wait for lease
          sleep 30

          # Query lease
          LEASE=$(akash query market lease list --owner $(akash keys show $AKASH_WALLET -a) --output json | jq -r '.leases[0]')

          # Send manifest
          akash provider send-manifest deploy.yaml --dseq $(echo $LEASE | jq -r '.lease.lease_id.dseq') --from $AKASH_WALLET
```

**Challenges:**
- Wallet management in CI/CD (secrets)
- Error handling (provider bids, lease creation)
- No automatic preview URLs (would require custom subdomain generation + DNS API)

**Verdict:** GitHub Actions integration is possible but requires significant custom scripting.

#### Solana Integration

**Akash + Solana:**
- Both decentralized infrastructure
- Philosophical alignment

**Technical Integration:**
- No direct integration needed (separate layers)
- SlopMachine smart contracts on Solana
- SlopMachine infrastructure on Akash (if adopted)

**Benefits:**
- Fully decentralized stack (no centralized cloud)
- Marketing narrative: "Built on decentralized infrastructure"

**Verdict:** Akash and Solana can coexist, no technical integration required.

#### Environment Variables & Secrets

**Akash Environment Variables:**

SDL file supports env vars:

```yaml
services:
  api:
    image: myapi:latest
    env:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - API_KEY=secret123
```

**⚠️ Security Issue: Secrets in Plain Text**

SDL files are submitted to blockchain and visible to providers. This means:
- Secrets are not encrypted
- Anyone with access to deployment transaction can see secrets

**Mitigation Strategies:**

1. **Use Secret Management Service:**
   - Store secrets in Vault, AWS Secrets Manager, or Doppler
   - App fetches secrets at runtime (not in SDL)

2. **Encrypt Secrets:**
   - Encrypt secrets before putting in SDL
   - App decrypts at runtime

3. **Avoid Sensitive Secrets:**
   - Use least-privilege API keys
   - Rotate secrets regularly

**Compare to Vercel/Railway:**
- Encrypted secrets stored in platform
- Never exposed in logs or configs

**Verdict:** Akash secrets management is **less secure** than traditional PaaS, requires extra precautions.

#### GitHub Actions Runners

**Can Akash Host GitHub Actions Self-Hosted Runners?**

**✅ YES** - Found in awesome-akash repo

**Use Case:**
- Run CI/CD on Akash instead of GitHub's hosted runners
- Cost savings for heavy CI workloads

**For SlopMachine:**
- Could host runners on Akash for deploying to Akash
- Meta: Use Akash to deploy to Akash

**Verdict:** Interesting possibility, but adds complexity. Likely not needed for initial MVP.

---

## SlopMachine-Specific Use Cases

### Use Case 1: Hosting AI Worker Nodes

**Requirements:**
- Runtime: Node.js
- Resources: 512MB-1GB RAM, 1 vCPU
- Uptime: 24/7
- Persistent state: Job queue, node configuration
- Network: Outbound (Claude API), inbound (job queue)

**Akash Feasibility:** ✅ **HIGHLY FEASIBLE**

**Why Akash Works Well:**
- Long-running Docker containers supported
- Persistent storage for node state
- Cost-effective ($0.34-$2/node/month vs. $5-$10/node on Railway)
- No need for preview URLs or SSL (internal service)

**Deployment Approach:**

```yaml
# deploy.yaml for AI Worker Node
version: "2.0"

services:
  worker:
    image: slopmachine/worker-node:latest
    env:
      - CLAUDE_API_KEY=<use secrets manager>
      - QUEUE_URL=https://api.slopmachine.fun/queue
      - NODE_ID=node-001
    expose:
      - port: 3000
        to:
          - global: true

profiles:
  compute:
    worker:
      resources:
        cpu:
          units: 1.0
        memory:
          size: 512Mi
        storage:
          - size: 5Gi
            attributes:
              persistent: true
              class: beta2

  placement:
    datacenter:
      pricing:
        worker:
          denom: uakt
          amount: 2000
```

**Estimated Cost:**
- 50 nodes × $1/month = **$50/month**

**Compare to Railway:**
- 50 nodes × $5-$10/month = **$250-$500/month**

**Savings: $200-$450/month**

**Recommendation:** **✅ USE AKASH for AI worker nodes** - Significant cost savings, no critical UX requirements.

---

### Use Case 2: Deploying User Projects

**Requirements:**
- Mix of static sites, Next.js SSR, APIs, databases
- Custom subdomains (`{project}.slopmachine.fun`)
- SSL certificates
- **Preview URLs for PRs** (critical for "slop or ship" transparency)
- Automated deployment from GitHub

**Akash Feasibility:** **⚠️ PARTIALLY FEASIBLE**

**What Works:**
- ✅ Docker-based deployments (any stack)
- ✅ Custom subdomains (via DNS CNAME)
- ✅ SSL (via Cloudflare)
- ✅ Automated deployment (via GitHub Actions)

**Critical Blocker:**
- ❌ **No Preview URLs for PRs**

**The Preview URL Problem:**

SlopMachine's core UX:
1. AI starts building project
2. Token holders get **staging URL** to watch live progress
3. Every PR commit = new preview URL
4. Users vote "slop" or "ship" based on preview

**Akash Does Not Provide:**
- Automatic preview URLs per PR
- Easy way to spin up ephemeral environments
- Subdomain management (would require custom DNS API integration)

**Possible Workaround:**
1. **GitHub Actions creates new Akash deployment per PR:**
   - Generate unique subdomain: `pr-123-myproject.slopmachine.fun`
   - Deploy to Akash with custom SDL
   - Add DNS CNAME via Cloudflare API
   - Wait for SSL propagation
2. **User accesses staging URL**

**Downsides of Workaround:**
- Slower than Vercel (manual steps)
- More complex (GitHub Action + Akash CLI + Cloudflare API)
- Each PR deployment costs AKT tokens (leases)
- Cleanup required when PR closed

**Compare to Vercel:**
- Automatic preview URL per PR
- No configuration needed
- Instant availability

**Recommendation:** **⚠️ AVOID AKASH for user project frontends**

Akash is not well-suited for deployments requiring frequent preview environments.

**Alternative Hybrid Approach:**

- **Frontends (Next.js, static sites):** Deploy to **Vercel/Netlify**
  - Get automatic preview URLs
  - Excellent UX for "slop or ship"
- **Backends (APIs, databases):** Deploy to **Akash**
  - Cost savings
  - No preview URL requirement

**Hybrid Architecture:**

```
GitHub PR opened
  ├─ Frontend: Vercel auto-deploys preview URL (pr-123.vercel.app)
  └─ Backend: Akash deploys API (if needed, or reuse staging backend)

User visits Vercel preview URL → Frontend calls Akash-hosted API
```

**Estimated Costs (Hybrid):**

Frontends (Vercel):
- 100 projects, low-moderate traffic
- Vercel Hobby (free) + Pro ($20/month) = **$20-$100/month**

Backends (Akash):
- 10 APIs + 10 databases
- **$35/month**

**Total Hybrid: $55-$135/month**

**Compare to All-Vercel/Railway: $400-$1200/month**

**Hybrid Savings: $265-$1065/month (70-90%)**

**Recommendation:** **✅ HYBRID APPROACH** - Vercel for frontends (preview URLs), Akash for backends (cost savings).

---

### Use Case 3: Infrastructure/DevOps AI Agent

**Requirement:** SlopMachine's DevOps AI agent must autonomously deploy projects

**Akash Feasibility:** **⚠️ POSSIBLE BUT COMPLEX**

**What's Required:**

1. **Generate Dockerfile** (AI agent already does this)
2. **Build and push Docker image** (AI agent can do this)
3. **Generate SDL file** (AI agent must learn Akash SDL syntax)
4. **Deploy via Akash CLI** (AI agent calls CLI commands)
5. **Manage wallet and AKT tokens** (AI agent needs wallet access)
6. **Handle provider bidding** (AI agent must parse bids, accept best)
7. **Configure DNS** (AI agent calls Cloudflare API)
8. **Set up SSL** (AI agent configures Cloudflare proxy)

**Complexity Level: HIGH**

**Compare to Vercel/Railway:**

Vercel:
```typescript
await vercel.deploy({
  name: 'my-project',
  project: projectId,
  gitSource: { repoUrl: 'https://github.com/...' }
});
// Done. Preview URL + SSL automatic.
```

Akash:
```typescript
// 1. Build Docker image
await docker.build();
await docker.push();

// 2. Generate SDL
const sdl = akash.generateSDL({ image, resources, ports });

// 3. Create deployment
const deployment = await akash.deploy(sdl);

// 4. Wait for bids
const bids = await akash.queryBids(deployment.id);

// 5. Accept bid
const lease = await akash.createLease(bids[0]);

// 6. Send manifest
await akash.sendManifest(lease, sdl);

// 7. Get provider URL
const url = lease.provider_url;

// 8. Configure DNS
await cloudflare.addCNAME('myproject.slopmachine.fun', url);

// 9. Wait for DNS propagation
await sleep(60000);

// 10. Enable SSL
await cloudflare.setSSL('myproject.slopmachine.fun', 'full');
```

**Akash deployment via AI agent is 10x more complex.**

**Feasibility:**
- ✅ Technically possible (all steps can be automated)
- ⚠️ High complexity (more code = more bugs)
- ⚠️ More failure points (wallet, bidding, DNS, SSL)

**Recommendation:** **Use Akash for backend deployments** where complexity is justified by cost savings, **not for user-facing frontends** where deployment speed and simplicity are critical.

---

## Comparison Matrix

| Feature | Akash Network | Vercel | Netlify | Railway | Winner |
|---------|--------------|--------|---------|---------|--------|
| **Deployment** |
| Docker Support | ✅ Full (required) | ⚠️ Limited | ❌ None | ✅ Full | Tie: Akash/Railway |
| Preview URLs | ❌ No | ✅ Automatic | ✅ Automatic | ✅ Automatic | Vercel/Netlify/Railway |
| Auto-deploy on push | ⚠️ Via GitHub Actions | ✅ Built-in | ✅ Built-in | ✅ Built-in | Vercel/Netlify/Railway |
| Custom Domains | ⚠️ Manual CNAME | ✅ Automatic | ✅ Automatic | ✅ Automatic | Vercel/Netlify/Railway |
| Auto SSL (Let's Encrypt) | ❌ Requires Cloudflare | ✅ Automatic | ✅ Automatic | ✅ Automatic | Vercel/Netlify/Railway |
| GitHub Actions Integration | ⚠️ Official action + CLI | ✅ Native | ✅ Native | ✅ Native | Vercel/Netlify/Railway |
| Deployment Speed | ⚠️ 5-10 min | ✅ 1-2 min | ✅ 1-2 min | ✅ 2-3 min | Vercel/Netlify |
| **Technology Support** |
| Next.js (SSR) | ✅ Yes | ✅ Optimized | ✅ Yes | ✅ Yes | Vercel (built by Next.js team) |
| Static Sites | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | Tie |
| Node.js APIs | ✅ Yes | ❌ Serverless only | ❌ Functions only | ✅ Yes | Tie: Akash/Railway |
| Python APIs | ✅ Yes | ❌ Serverless only | ❌ Functions only | ✅ Yes | Tie: Akash/Railway |
| Rust APIs | ✅ Yes | ❌ No | ❌ No | ✅ Yes | Tie: Akash/Railway |
| Database Hosting | ✅ Yes (DIY) | ❌ No | ❌ No | ✅ Yes (managed) | Railway (managed) |
| WebSocket Support | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | Tie: Akash/Vercel/Railway |
| **Infrastructure** |
| Global CDN | ❌ Single provider | ✅ 100+ edge locations | ✅ Global CDN | ⚠️ Regional | Vercel |
| Persistent Storage | ✅ Yes (provider-tied) | ❌ No | ❌ No | ✅ Yes (volumes) | Tie: Akash/Railway |
| 24/7 Processes | ✅ Yes | ❌ No | ❌ No | ✅ Yes | Tie: Akash/Railway |
| Logs & Monitoring | ⚠️ CLI/API | ✅ Web UI | ✅ Web UI | ✅ Web UI | Vercel/Netlify/Railway |
| Auto-scaling | ❌ Manual | ✅ Automatic | ✅ Automatic | ✅ Automatic | Vercel/Netlify/Railway |
| **Reliability** |
| Uptime SLA | ❌ None published | ✅ 99.99% | ✅ 99.9%+ | ⚠️ No SLA | Vercel |
| Multi-region | ⚠️ Manual | ✅ Automatic | ✅ Automatic | ⚠️ Manual | Vercel/Netlify |
| Failover | ❌ Manual | ✅ Automatic | ✅ Automatic | ✅ Automatic | Vercel/Netlify/Railway |
| **Cost (50 projects)** |
| Frontends | ~$50/mo | $20-$300/mo | $19-$300/mo | $100-$300/mo | **Akash** |
| APIs + Databases | ~$35/mo | N/A | N/A | $100-$500/mo | **Akash** |
| **Total Est.** | **$85/mo** | **$300-$600/mo** | **$300-$600/mo** | **$200-$800/mo** | **Akash (70-85% cheaper)** |
| **Developer Experience** |
| Setup Complexity | ⚠️ High (CLI, wallet, SDL) | ✅ Low (connect repo) | ✅ Low (connect repo) | ✅ Low (connect repo) | Vercel/Netlify/Railway |
| Learning Curve | ⚠️ 1-2 weeks | ✅ < 1 hour | ✅ < 1 hour | ✅ < 1 hour | Vercel/Netlify/Railway |
| API/SDK Quality | ⚠️ CLI only | ✅ Excellent SDK | ✅ Good SDK | ✅ Good API | Vercel |
| Documentation | ⚠️ Moderate | ✅ Excellent | ✅ Excellent | ✅ Good | Vercel |
| **Decentralization** |
| Decentralized | ✅ Yes | ❌ Centralized | ❌ Centralized | ❌ Centralized | **Akash** |

---

## Risk Assessment

### Technical Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Provider Outages** | High | Medium | Deploy critical services to multiple providers; monitor health |
| **No Preview URLs** | **CRITICAL** | Certain | **Use Vercel/Netlify for frontends**; only use Akash for backends |
| **SSL Complexity** | Medium | Certain | Automate Cloudflare setup via API; document process |
| **Akash CLI Bugs** | Medium | Low-Medium | Test thoroughly; have fallback to traditional cloud |
| **Provider Reliability Variance** | Medium | Medium | Choose providers with track record; monitor over time |
| **Deployment Complexity** | Medium | Certain | Build abstraction layer (DevOps agent); thorough documentation |

### Cost Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **AKT Price Volatility** | Medium | High | Monitor AKT price; budget for 2-3x price increase; diversify to stablecoins |
| **Hidden Costs (lease renewals, tx fees)** | Low | Medium | Track all costs; build cost monitoring dashboard |
| **Engineering Time Investment** | High | Certain | Weigh cost savings vs. eng time; only adopt if savings justify complexity |
| **Provider Pricing Changes** | Low | Low | Reverse auction model means competitive pricing; choose multiple providers |

### Operational Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Vendor Lock-in (Akash-specific SDL)** | Low | Certain | Use standard Docker images; can migrate to any Docker platform |
| **Lack of SLA** | High | Certain | **Don't use Akash for critical user-facing services**; use for backend only |
| **Secrets Management Insecurity** | High | Certain | **Never put sensitive secrets in SDL**; use secrets manager |
| **Provider Goes Offline Permanently** | Medium | Low | Monitor provider health; have backup providers; multi-provider setup |
| **Akash Network Shuts Down** | Low | Very Low | Akash has been live since 2020; growing ecosystem; low risk |

### Network Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Provider Availability** | Medium | Medium | Test provider availability in target regions; have fallback |
| **Performance Variability** | Medium | Medium | Benchmark providers; choose high-performance providers |
| **Network Congestion** | Low | Low | Akash network has low congestion (not Ethereum-scale fees) |
| **DNS Propagation Delays** | Low | High | Accept 1-5 min delay for custom domains; communicate to users |

### Overall Risk Level

**For Frontend Deployments (User-Facing):** **🔴 HIGH RISK**
- No preview URLs = poor UX for SlopMachine's core feature
- No SLA = unreliable for mission-critical services
- SSL complexity = potential downtime

**For Backend Deployments (APIs, Databases, Worker Nodes):** **🟡 MEDIUM RISK**
- Cost savings justify operational complexity
- Less critical UX requirements
- Can tolerate brief downtime

**Recommendation:**
- **❌ DO NOT use Akash for user-facing frontends**
- **✅ CONSIDER Akash for backend services** (after PoC validation)

---

## Recommendation

### Final Decision: **⚠️ HYBRID APPROACH**

**Do NOT migrate entirely to Akash. Use Akash selectively for cost-efficient backend workloads.**

### Recommended Architecture

```
SlopMachine Infrastructure (Hybrid)

User-Facing Layer (Vercel/Netlify):
├─ Marketing site (slopmachine.fun)
├─ Marketplace frontend (app.slopmachine.fun)
└─ User project deployments ({project}.slopmachine.fun)
    ├─ Automatic preview URLs per PR
    ├─ Automatic SSL
    └─ Global CDN for low latency

Backend Layer (Akash):
├─ AI worker nodes (50 nodes × $1/mo = $50/mo)
├─ API servers (Node.js, Python, Rust)
├─ Databases (PostgreSQL, Redis)
└─ Background job queues

CI/CD (GitHub Actions):
├─ Frontend: Deploy to Vercel on push
└─ Backend: Deploy to Akash via custom workflow
```

### Why Hybrid?

**Vercel/Netlify for Frontends:**
- ✅ Automatic preview URLs (critical for "slop or ship" UX)
- ✅ Automatic SSL
- ✅ Global CDN (low latency for users worldwide)
- ✅ Simple developer experience
- ✅ Proven reliability (99.99% uptime)

**Akash for Backends:**
- ✅ 70-85% cost savings vs. Railway
- ✅ No preview URL requirement
- ✅ Well-suited for 24/7 worker nodes
- ✅ Persistent storage for databases
- ✅ Decentralized infrastructure (philosophical alignment with Solana)

### Cost Comparison: Hybrid vs. All-Cloud

**Hybrid Approach (Recommended):**

| Component | Platform | Cost |
|-----------|----------|------|
| Marketing + App Frontend | Vercel Pro | $20/mo |
| User Project Frontends (100) | Vercel Pro + overages | $80-$200/mo |
| AI Worker Nodes (50) | **Akash** | **$50/mo** |
| APIs (10) | **Akash** | **$20/mo** |
| Databases (10) | **Akash** | **$15/mo** |
| **TOTAL** | | **$185-$305/mo** |

**All-Cloud Approach (Original Plan):**

| Component | Platform | Cost |
|-----------|----------|------|
| Marketing + App Frontend | Vercel Pro | $20/mo |
| User Project Frontends (100) | Vercel Pro + overages | $80-$200/mo |
| AI Worker Nodes (50) | Railway | $250-$500/mo |
| APIs (10) | Railway | $50-$100/mo |
| Databases (10) | Railway | $50-$100/mo |
| **TOTAL** | | **$450-$920/mo** |

**Hybrid Savings: $145-$615/mo (32-67%)**

**Annual Savings: $1,740-$7,380**

### Implementation Priority

**Phase 1: Traditional Cloud Only (Months 1-3)**
- Focus on MVP development
- Use Vercel + Railway for everything
- Validate product-market fit
- **Don't prematurely optimize for cost**

**Phase 2: Akash PoC (Month 4)**
- Deploy 1 AI worker node to Akash
- Deploy 1 API + PostgreSQL to Akash
- Test for 30 days:
  - Reliability (uptime)
  - Performance (latency)
  - Cost (actual vs. estimated)
  - Developer experience (deployment workflow)

**Success Criteria for PoC:**
- [ ] 99.5%+ uptime (acceptable for backend services)
- [ ] API latency < 200ms (acceptable for non-user-facing)
- [ ] Cost < $5/month (vs. $10-$20 on Railway)
- [ ] Deployment workflow is automatable via GitHub Actions
- [ ] No major operational issues (provider outages, data loss)

**Phase 3: Gradual Migration (Months 5-6)**
- If PoC successful:
  - Migrate all 50 AI worker nodes to Akash
  - Migrate backend APIs to Akash
  - Migrate databases to Akash (with robust backup strategy)
- Keep frontends on Vercel/Netlify (never migrate)

**Phase 4: Optimization (Months 7+)**
- Multi-provider redundancy for critical backend services
- Automated provider health monitoring
- Cost optimization (choose cheapest providers)

### Decision Tree

```
Should we use Akash for [workload]?

Is it user-facing frontend?
├─ YES → ❌ Use Vercel/Netlify
└─ NO → Continue

Does it require preview URLs per PR?
├─ YES → ❌ Use Vercel/Netlify
└─ NO → Continue

Is it mission-critical (needs 99.99% uptime)?
├─ YES → ❌ Use Railway/Vercel
└─ NO → Continue

Is it a long-running 24/7 workload (worker nodes, APIs)?
├─ YES → ✅ Consider Akash
└─ NO → ⚠️ Akash may not be cost-effective

Does the team have DevOps expertise?
├─ YES → ✅ Use Akash (after PoC)
└─ NO → ❌ Stick with Railway (lower complexity)
```

---

## Migration Path

### If Adopting Hybrid Approach (Recommended)

#### Month 4: PoC Preparation

**Week 1-2: Setup**

1. **Akash Account Setup**
   - Install Akash CLI
   - Create wallet
   - Fund with 20 AKT (~$20 USD) for testing

2. **Cloudflare Setup**
   - Add `slopmachine.fun` to Cloudflare (if not already)
   - Generate API token for DNS automation

3. **Docker Image Preparation**
   - Containerize 1 AI worker node
   - Containerize 1 API + PostgreSQL
   - Push to Docker Hub

**Week 3-4: PoC Deployment**

1. **Deploy AI Worker Node to Akash**
   - Write SDL file
   - Deploy via Akash CLI
   - Configure custom subdomain (`worker-test.slopmachine.fun`)
   - Monitor for 2 weeks

2. **Deploy API + Database to Akash**
   - Write SDL file with persistent storage for PostgreSQL
   - Deploy via Akash CLI
   - Configure custom subdomain (`api-test.slopmachine.fun`)
   - Set up SSL via Cloudflare
   - Run load tests
   - Monitor for 2 weeks

3. **Measure Success Criteria**
   - Uptime: Use UptimeRobot or similar
   - Performance: Latency monitoring
   - Cost: Track AKT spent
   - Reliability: Note any issues

#### Month 5: PoC Evaluation

**Week 1: Analyze Results**

Review PoC data:
- Did we achieve 99.5%+ uptime?
- Was performance acceptable?
- Were costs < $5/month?
- Did we encounter operational issues?

**Week 2: Go/No-Go Decision**

**If PoC Successful (✅):**
- Proceed to production migration
- Build deployment automation
- Document runbooks

**If PoC Failed (❌):**
- Document lessons learned
- Stick with Railway for all infrastructure
- Re-evaluate Akash in 6-12 months

#### Months 5-6: Production Migration (If PoC Passed)

**Week 1-2: Build Deployment Automation**

1. **Create Akash Deployment Module**

```typescript
// src/infra/akash/deployer.ts

export class AkashDeployer {
  async deployWorkerNode(config: WorkerConfig): Promise<Deployment> {
    // 1. Generate SDL
    const sdl = this.generateWorkerSDL(config);

    // 2. Create deployment
    const deployment = await this.akashCLI.createDeployment(sdl);

    // 3. Accept best bid
    const lease = await this.acceptBestBid(deployment.id);

    // 4. Send manifest
    await this.akashCLI.sendManifest(lease, sdl);

    // 5. Configure DNS
    await this.cloudflare.addCNAME(config.subdomain, lease.providerURL);

    return { url: `https://${config.subdomain}.slopmachine.fun` };
  }
}
```

2. **Create GitHub Actions Workflow**

```yaml
# .github/workflows/deploy-akash-worker.yml

name: Deploy Worker to Akash

on:
  push:
    branches: [main]
    paths:
      - 'apps/worker/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and Push Docker Image
        run: |
          docker build -t slopmachine/worker:${{ github.sha }} apps/worker
          docker push slopmachine/worker:${{ github.sha }}

      - name: Deploy to Akash
        env:
          AKASH_WALLET: ${{ secrets.AKASH_WALLET }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          node scripts/deploy-to-akash.js worker ${{ github.sha }}
```

**Week 3-4: Migrate AI Worker Nodes**

1. Deploy 5 nodes to Akash
2. Monitor for 1 week
3. If stable, deploy remaining 45 nodes
4. Decommission Railway worker nodes

**Week 5-6: Migrate APIs and Databases**

1. Deploy 1 API + DB to Akash
2. Test thoroughly
3. Migrate traffic (use load balancer to split traffic)
4. If stable, migrate remaining APIs
5. Decommission Railway APIs/DBs

**Week 7-8: Buffer and Monitoring**

1. Set up comprehensive monitoring (Grafana on Akash)
2. Create incident response playbook
3. Document all Akash deployments
4. Train team on Akash operations

#### Month 7+: Optimization

1. **Multi-Provider Redundancy**
   - Deploy critical services to 2-3 providers
   - Set up load balancing

2. **Cost Optimization**
   - Track provider pricing over time
   - Migrate to cheaper providers when available

3. **Automation Enhancements**
   - Auto-renew leases before expiration
   - Auto-failover if provider unhealthy

### If Rejecting Akash (If PoC Fails)

#### Specific Reasons for Rejection

Document why Akash didn't work:
- [ ] Uptime < 99.5% (provider unreliability)
- [ ] Performance unacceptable (high latency, slow)
- [ ] Cost higher than expected (AKT price increased)
- [ ] Operational complexity too high (deployments failing)
- [ ] Security concerns (secrets management, provider trust)

#### Alternative Recommendations

**Stick with Vercel + Railway:**
- Accept higher costs ($450-$920/month)
- Prioritize developer experience and reliability
- Re-evaluate Akash in 6-12 months

**Consider Other Alternatives:**
- **Fly.io:** Similar to Railway, competitive pricing
- **Render:** Another Railway competitor
- **Self-hosted on Hetzner/DigitalOcean:** Most cost-effective, but highest operational burden

#### Future Re-evaluation Criteria

Re-consider Akash when:
- [ ] Akash adds native preview URL support
- [ ] Akash adds native SSL/Let's Encrypt integration
- [ ] Akash publishes SLA and uptime guarantees
- [ ] SlopMachine reaches scale where cost savings > $1000/month
- [ ] Akash ecosystem matures (more production case studies)

---

## Code Examples

### 1. Akash SDL File: Next.js Deployment

```yaml
# deploy-nextjs.yaml
version: "2.0"

services:
  web:
    image: slopmachine/project-nextjs:latest
    env:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    expose:
      - port: 3000
        as: 80
        accept:
          - myproject.slopmachine.fun
        to:
          - global: true

profiles:
  compute:
    web:
      resources:
        cpu:
          units: 0.5  # 500m
        memory:
          size: 512Mi
        storage:
          size: 1Gi

  placement:
    datacenter:
      attributes:
        region: us-west
      pricing:
        web:
          denom: uakt
          amount: 2000  # Max bid: 2000 uAKT/block

deployment:
  web:
    datacenter:
      profile: web
      count: 1
```

### 2. Akash SDL File: Node.js API + PostgreSQL

```yaml
# deploy-api-db.yaml
version: "2.0"

services:
  api:
    image: slopmachine/api:latest
    env:
      - DATABASE_URL=postgresql://postgres:secretpass@postgres:5432/appdb
      - JWT_SECRET=<use-secrets-manager>
    expose:
      - port: 4000
        as: 80
        accept:
          - api.slopmachine.fun
        to:
          - global: true
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    env:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secretpass
      - POSTGRES_DB=appdb
    expose:
      - port: 5432
        to:
          - service: api

profiles:
  compute:
    api:
      resources:
        cpu:
          units: 0.5
        memory:
          size: 512Mi
        storage:
          size: 1Gi

    postgres:
      resources:
        cpu:
          units: 0.5
        memory:
          size: 1Gi
        storage:
          - size: 10Gi
            attributes:
              persistent: true
              class: beta2  # SSD

  placement:
    datacenter:
      pricing:
        api:
          denom: uakt
          amount: 2000
        postgres:
          denom: uakt
          amount: 3000

deployment:
  api:
    datacenter:
      profile: api
      count: 1
  postgres:
    datacenter:
      profile: postgres
      count: 1
```

### 3. GitHub Actions Workflow: Deploy to Akash

```yaml
# .github/workflows/deploy-to-akash.yml

name: Deploy to Akash

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
  AKASH_WALLET: ${{ secrets.AKASH_WALLET }}
  AKASH_KEYRING: ${{ secrets.AKASH_KEYRING }}
  CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ env.DOCKER_USERNAME }}/myapp:latest
            ${{ env.DOCKER_USERNAME }}/myapp:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Install Akash CLI
        run: |
          curl -sSfL https://raw.githubusercontent.com/akash-network/node/main/install.sh | sh
          echo "$HOME/.akash/bin" >> $GITHUB_PATH

      - name: Update SDL with new image tag
        uses: ovrclk/akash-ghaction-templated-sdl@v1
        env:
          IMAGE_TAG: ${{ github.sha }}
        with:
          TEMPLATE_PATH: deploy.template.yaml
          OUT_PATH: deploy.yaml

      - name: Deploy to Akash
        run: |
          # Create deployment
          akash tx deployment create deploy.yaml \
            --from $AKASH_WALLET \
            --keyring-backend file \
            --node https://rpc.akashnet.net:443 \
            --chain-id akashnet-2 \
            --gas auto \
            --gas-adjustment 1.5 \
            --fees 5000uakt \
            -y

          # Wait for lease
          echo "Waiting for lease..."
          sleep 30

          # Query deployment
          OWNER=$(akash keys show $AKASH_WALLET -a --keyring-backend file)
          DSEQ=$(akash query deployment list --owner $OWNER --node https://rpc.akashnet.net:443 --output json | jq -r '.deployments[0].deployment.deployment_id.dseq')

          echo "Deployment DSEQ: $DSEQ"

          # Query bids
          BIDS=$(akash query market bid list --owner $OWNER --dseq $DSEQ --node https://rpc.akashnet.net:443 --output json)

          # Accept first bid (lowest price due to reverse auction)
          PROVIDER=$(echo $BIDS | jq -r '.bids[0].bid.bid_id.provider')

          echo "Creating lease with provider: $PROVIDER"

          akash tx market lease create \
            --dseq $DSEQ \
            --provider $PROVIDER \
            --from $AKASH_WALLET \
            --keyring-backend file \
            --node https://rpc.akashnet.net:443 \
            --chain-id akashnet-2 \
            --fees 5000uakt \
            -y

          # Send manifest
          echo "Sending manifest..."
          akash provider send-manifest deploy.yaml \
            --dseq $DSEQ \
            --provider $PROVIDER \
            --from $AKASH_WALLET \
            --keyring-backend file

          # Get provider URL
          PROVIDER_URL=$(akash provider lease-status \
            --dseq $DSEQ \
            --provider $PROVIDER \
            --from $AKASH_WALLET \
            --keyring-backend file \
            | jq -r '.services.web.uris[0]')

          echo "Deployment URL: $PROVIDER_URL"
          echo "PROVIDER_URL=$PROVIDER_URL" >> $GITHUB_ENV

      - name: Configure Cloudflare DNS
        run: |
          # Add CNAME record via Cloudflare API
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/dns_records" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data '{
              "type": "CNAME",
              "name": "myproject",
              "content": "'$PROVIDER_URL'",
              "ttl": 3600,
              "proxied": true
            }'

      - name: Deployment Summary
        run: |
          echo "✅ Deployment successful!"
          echo "🌐 URL: https://myproject.slopmachine.fun"
          echo "🐳 Image: $DOCKER_USERNAME/myapp:${{ github.sha }}"
          echo "📦 Provider: $PROVIDER_URL"
```

### 4. API Call Example: Programmatic Deployment via Akash API

```typescript
// scripts/deploy-to-akash.ts

import { execSync } from 'child_process';
import fs from 'fs';

interface DeploymentConfig {
  name: string;
  image: string;
  subdomain: string;
  env: Record<string, string>;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
}

class AkashDeployer {
  constructor(
    private wallet: string,
    private keyring: string,
    private cloudflareToken: string,
    private cloudflareZoneId: string
  ) {}

  /**
   * Generate SDL file from config
   */
  generateSDL(config: DeploymentConfig): string {
    const envVars = Object.entries(config.env)
      .map(([key, val]) => `      - ${key}=${val}`)
      .join('\n');

    const sdl = `
version: "2.0"

services:
  ${config.name}:
    image: ${config.image}
    env:
${envVars}
    expose:
      - port: 3000
        as: 80
        accept:
          - ${config.subdomain}.slopmachine.fun
        to:
          - global: true

profiles:
  compute:
    ${config.name}:
      resources:
        cpu:
          units: ${config.resources.cpu}
        memory:
          size: ${config.resources.memory}
        storage:
          size: ${config.resources.storage}

  placement:
    datacenter:
      pricing:
        ${config.name}:
          denom: uakt
          amount: 2000

deployment:
  ${config.name}:
    datacenter:
      profile: ${config.name}
      count: 1
`;

    return sdl;
  }

  /**
   * Deploy to Akash
   */
  async deploy(config: DeploymentConfig): Promise<{ url: string }> {
    console.log(`🚀 Deploying ${config.name} to Akash...`);

    // 1. Generate SDL
    const sdl = this.generateSDL(config);
    const sdlPath = `/tmp/${config.name}-deploy.yaml`;
    fs.writeFileSync(sdlPath, sdl);
    console.log(`✅ Generated SDL at ${sdlPath}`);

    // 2. Create deployment
    console.log('📦 Creating deployment...');
    const createCmd = `akash tx deployment create ${sdlPath} --from ${this.wallet} --keyring-backend ${this.keyring} --node https://rpc.akashnet.net:443 --chain-id akashnet-2 --gas auto --gas-adjustment 1.5 --fees 5000uakt -y`;

    try {
      execSync(createCmd, { stdio: 'inherit' });
    } catch (error) {
      throw new Error(`Failed to create deployment: ${error}`);
    }

    // 3. Wait for lease
    console.log('⏳ Waiting for lease...');
    await this.sleep(30000);

    // 4. Query deployment
    const owner = execSync(
      `akash keys show ${this.wallet} -a --keyring-backend ${this.keyring}`,
      { encoding: 'utf-8' }
    ).trim();

    const deploymentList = execSync(
      `akash query deployment list --owner ${owner} --node https://rpc.akashnet.net:443 --output json`,
      { encoding: 'utf-8' }
    );
    const dseq = JSON.parse(deploymentList).deployments[0].deployment.deployment_id.dseq;
    console.log(`✅ Deployment DSEQ: ${dseq}`);

    // 5. Query bids
    const bidList = execSync(
      `akash query market bid list --owner ${owner} --dseq ${dseq} --node https://rpc.akashnet.net:443 --output json`,
      { encoding: 'utf-8' }
    );
    const bids = JSON.parse(bidList).bids;

    if (bids.length === 0) {
      throw new Error('No bids received! Try increasing bid price in SDL.');
    }

    const provider = bids[0].bid.bid_id.provider;
    console.log(`✅ Best bid from provider: ${provider}`);

    // 6. Create lease
    console.log('🤝 Creating lease...');
    const leaseCmd = `akash tx market lease create --dseq ${dseq} --provider ${provider} --from ${this.wallet} --keyring-backend ${this.keyring} --node https://rpc.akashnet.net:443 --chain-id akashnet-2 --fees 5000uakt -y`;
    execSync(leaseCmd, { stdio: 'inherit' });

    // 7. Send manifest
    console.log('📨 Sending manifest...');
    await this.sleep(10000);
    const manifestCmd = `akash provider send-manifest ${sdlPath} --dseq ${dseq} --provider ${provider} --from ${this.wallet} --keyring-backend ${this.keyring}`;
    execSync(manifestCmd, { stdio: 'inherit' });

    // 8. Get provider URL
    await this.sleep(15000);
    const statusCmd = `akash provider lease-status --dseq ${dseq} --provider ${provider} --from ${this.wallet} --keyring-backend ${this.keyring} --output json`;
    const status = JSON.parse(execSync(statusCmd, { encoding: 'utf-8' }));
    const providerURL = status.services[config.name]?.uris[0];

    if (!providerURL) {
      throw new Error('Failed to get provider URL');
    }

    console.log(`✅ Provider URL: ${providerURL}`);

    // 9. Configure Cloudflare DNS
    console.log('🌐 Configuring DNS...');
    await this.configureDNS(config.subdomain, providerURL);

    const finalURL = `https://${config.subdomain}.slopmachine.fun`;
    console.log(`✅ Deployment complete: ${finalURL}`);

    return { url: finalURL };
  }

  /**
   * Configure Cloudflare DNS CNAME
   */
  async configureDNS(subdomain: string, target: string): Promise<void> {
    const url = `https://api.cloudflare.com/client/v4/zones/${this.cloudflareZoneId}/dns_records`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.cloudflareToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'CNAME',
        name: subdomain,
        content: target,
        ttl: 3600,
        proxied: true,  // Enable Cloudflare proxy for SSL
      }),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${await response.text()}`);
    }

    console.log(`✅ DNS configured: ${subdomain}.slopmachine.fun → ${target}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Usage
async function main() {
  const deployer = new AkashDeployer(
    process.env.AKASH_WALLET!,
    process.env.AKASH_KEYRING!,
    process.env.CLOUDFLARE_API_TOKEN!,
    process.env.CLOUDFLARE_ZONE_ID!
  );

  const result = await deployer.deploy({
    name: 'worker-node-1',
    image: 'slopmachine/worker:latest',
    subdomain: 'worker-1',
    env: {
      NODE_ENV: 'production',
      CLAUDE_API_KEY: process.env.CLAUDE_API_KEY!,
      QUEUE_URL: 'https://api.slopmachine.fun/queue',
    },
    resources: {
      cpu: '0.5',
      memory: '512Mi',
      storage: '5Gi',
    },
  });

  console.log(`🎉 Worker node deployed: ${result.url}`);
}

main().catch(console.error);
```

---

## Appendix: Research Sources

### Primary Sources

1. **Akash Network Official Documentation**
   - https://akash.network/docs/
   - https://docs.akash.network/

2. **Akash GitHub Repositories**
   - https://github.com/akash-network/awesome-akash
   - https://github.com/akash-network/docs
   - https://github.com/OIGbash/nextjs-on-akash

3. **Akash Pricing Calculator**
   - https://akash.network/pricing/usage-calculator/
   - https://cloudmos.io/price-compare

4. **Vercel Documentation**
   - https://vercel.com/pricing
   - https://vercel.com/docs/pricing

5. **Railway Documentation**
   - https://railway.com/pricing
   - https://docs.railway.com/reference/pricing/plans

### Secondary Sources

6. **Cost Comparison Articles**
   - "Akash Network Review 2025" (Coin Bureau)
   - "Railway vs Vercel" comparison articles
   - Developer blog posts on Akash hosting costs

7. **Community Resources**
   - Medium articles on Akash deployments
   - Dev.to tutorials on Akash Network
   - GitHub discussions and issues

8. **Real-World Examples**
   - Personal site hosted on Akash for $2/month
   - 512MB deployment for $0.34/month
   - Akash-chat (WebSocket app on Akash)

### Data Quality Assessment

**Reliable:**
- Official Akash documentation (accurate, up-to-date)
- Vercel/Railway official pricing (authoritative)
- GitHub examples (code-level detail)

**Moderately Reliable:**
- Blog posts from 2022-2025 (some outdated info)
- Community examples (may not reflect best practices)

**Unreliable/Missing:**
- Akash uptime SLA (not found)
- Production case studies (limited public data)
- Exact pricing (calculator didn't show rates)

**Recommendation:** Validate all findings with PoC before production adoption.

---

## Conclusion

Akash Network offers compelling cost savings (70-85%) but lacks critical features for SlopMachine's user-facing deployments (preview URLs, automatic SSL, proven reliability).

**Recommended approach: Hybrid architecture**
- Vercel/Netlify for frontends (UX-critical)
- Akash for backend services (cost-sensitive)

**Next steps:**
1. Complete MVP on traditional cloud (Vercel + Railway)
2. Run Akash PoC in Month 4 (1 worker node + 1 API)
3. Evaluate PoC results and decide on production migration
4. If successful, gradually migrate backend workloads to Akash while keeping frontends on Vercel

**Expected outcome:** 32-67% infrastructure cost savings ($145-$615/month) while maintaining excellent user experience for "slop or ship" feature.

---

**Report Prepared By:** Claude (Anthropic)
**Research Date:** October 7, 2025
**Report Version:** 1.0
