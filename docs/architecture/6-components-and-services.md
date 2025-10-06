# 6. Components and Services

## 6.1 Frontend Components (Next.js)

### OpportunityCard

**Responsibility:** Display opportunity summary in marketplace listings

**Key Interfaces:**
- Props: `{ opportunity: Opportunity, onBidClick?: (id: string) => void, showActions?: boolean }`
- Emits: `onBidClick` event when user clicks "Place Bid"

**Dependencies:** `Card`, `Badge`, `Button` from shadcn-ui

**Technology:** React Server Component with client-side interactivity for bid button

### StoryReviewPage

**Responsibility:** QA review interface for story approval

**Key Interfaces:**
- URL: `/stories/[id]/review`
- Actions: Approve, Request Changes, View PR

**Dependencies:** `useStoryMutation`, `apiClient`, `toast` from sonner

**Technology:** Next.js App Router page with client components

### BidForm

**Responsibility:** Form for experts to submit bids

**Key Interfaces:**
- Props: `{ opportunityId: string, onSuccess?: () => void }`
- Form fields: amount, currency, proposal, estimatedDuration
- Validation: Zod schema with react-hook-form

**Dependencies:** `useForm`, `zodResolver`, `apiClient`

**Technology:** Client component with controlled form state

### ProjectDashboard

**Responsibility:** Client overview of project status and opportunities

**Key Interfaces:**
- URL: `/projects/[id]`
- Data: Project details, opportunities, stories, escrow status

**Dependencies:** `useProject`, `useOpportunities`, `useStories`

**Technology:** Server component with streaming data

## 6.2 Backend Services (Express.js)

### OpportunityService

**Responsibility:** Business logic for opportunity creation, listing, and bid management

**Key Interfaces:**
```typescript
class OpportunityService {
  static async create(params: CreateOpportunityParams): Promise<Opportunity>
  static async list(stage?: string): Promise<Opportunity[]>
  static async acceptBid(params: AcceptBidParams): Promise<Bid>
  static validateExpertEligibility(expert: User, opportunity: Opportunity): boolean
}
```

**Dependencies:** Prisma, CacheService, Metrics

**Technology:** TypeScript class with static methods

### StoryService

**Responsibility:** Story lifecycle management including status transitions and PR validation

**Key Interfaces:**
```typescript
class StoryService {
  static async create(params: CreateStoryParams): Promise<Story>
  static async updateStatus(params: UpdateStatusParams): Promise<Story>
  static validateTransition(currentStatus: StoryStatus, newStatus: StoryStatus, userRole: Role): boolean
  static async linkPR(storyId: string, prUrl: string, prNumber: number, userId: string): Promise<Story>
}
```

**Dependencies:** Prisma, PRValidationService, StoryAuditLog

**Technology:** TypeScript class with role-based state machine

### PRValidationService

**Responsibility:** Validate PRs before linking to stories (verify fork origin, author, file restrictions)

**Key Interfaces:**
```typescript
class PRValidationService {
  static async validateAndLinkPR(params: ValidateAndLinkPRParams): Promise<ValidationResult>
  static async validatePRAuthor(pr: PullRequest, story: Story): Promise<boolean>
  static async validateFileRestrictions(pr: PullRequest, stage: Stage): Promise<boolean>
}
```

**Dependencies:** Octokit (GitHub API), Prisma

**Technology:** TypeScript class with GitHub API integration

### GitHubScaffoldingService

**Responsibility:** Create GitHub repos for clients with BMAD pre-installed

**Key Interfaces:**
```typescript
class GitHubScaffoldingService {
  static async createProjectRepo(params: CreateProjectRepoParams): Promise<CreateRepoResult>
  static async scaffoldBMADStructure(repo: string, brief: any): Promise<void>
  static async createStoryIssues(repo: string, stories: Story[]): Promise<void>
}
```

**Dependencies:** Octokit, Prisma

**Technology:** TypeScript class with GitHub App authentication

### EscrowService

**Responsibility:** Unified escrow management for multi-chain crypto payments (Polygon + Solana)

**Key Interfaces:**
```typescript
class EscrowService {
  static async create(params: CreateEscrowParams): Promise<Escrow>
  static async deployContract(escrowId: string, blockchain: 'polygon' | 'solana'): Promise<string>
  static async fund(escrowId: string, walletAddress: string): Promise<Escrow>
  static async release(escrowId: string): Promise<Escrow>
  static async refund(escrowId: string): Promise<Escrow>
  static async monitorTransaction(txHash: string, blockchain: 'polygon' | 'solana'): Promise<TransactionStatus>
}
```

**Dependencies:** ethers.js (Polygon), @solana/web3.js, @coral-xyz/anchor (Solana), Alchemy SDK, Helius SDK, Prisma

**Technology:** TypeScript class with multi-chain smart contract abstraction

## 6.3 MCP Server (FastMCP)

**Responsibility:** Expose tools and prompts for AI assistants (ChatGPT/Claude) to interact with platform

**Key Interfaces:**
```typescript
const server = new FastMCP({
  name: "american-nerd-marketplace",
  transport: "sse", // Remote access via HTTPS

  prompts: [
    { name: "analyst", description: "Business Analyst persona", handler: loadAgent('analyst.txt') },
    { name: "orchestrator", description: "Orchestrator persona", handler: loadAgent('bmad-orchestrator.txt') }
  ],

  tools: [
    { name: "create_project", handler: ProjectService.create },
    { name: "post_opportunity", handler: OpportunityService.create },
    { name: "list_opportunities", handler: OpportunityService.list },
    { name: "fund_escrow", handler: handleFundEscrow },
    { name: "generate_wallet_qr", handler: generateWalletQRCode }
  ],

  resources: [
    { uri: "project://{id}/brief", handler: getProjectBrief }
  ]
})
```

**Dependencies:** FastMCP, packages/services

**Technology:** Remote SSE server (not stdio) for web AI assistant access

### MCP Wallet Connection Implementation (FR26)

**Wallet Handoff Mechanism for Crypto Payments:**

MCP clients (ChatGPT/Claude Desktop) cannot directly integrate Metamask/Phantom browser extensions. The platform handles wallet connections via two methods:

**1. Deep Link Handoff (Mobile-First)**
```typescript
// MCP Tool: fund_escrow
async function handleFundEscrow(opportunityId: string, currency: 'USDC' | 'USDT' | 'ETH' | 'SOL') {
  const escrow = await EscrowService.create({ opportunityId, currency })
  const blockchain = currency === 'SOL' ? 'solana' : 'polygon'

  // Generate deep link for wallet app
  const deepLink = blockchain === 'solana'
    ? `phantom://pay?recipient=${escrow.contractAddress}&amount=${escrow.amount}&token=${currency}`
    : `metamask://send?to=${escrow.contractAddress}&value=${escrow.amount}&token=${currency}`

  return {
    escrowId: escrow.id,
    deepLink,
    instructions: "Click the link to open your wallet app and approve the transaction",
    webFallback: `${process.env.WEB_URL}/escrow/${escrow.id}/fund`
  }
}
```

**2. QR Code Display (Desktop-First)**
```typescript
// MCP Tool: generate_wallet_qr
async function generateWalletQRCode(escrowId: string) {
  const escrow = await prisma.escrow.findUnique({ where: { id: escrowId } })
  const qrData = {
    address: escrow.contractAddress,
    amount: escrow.amount,
    currency: escrow.currency,
    memo: `Escrow ${escrowId}`
  }

  // Generate QR code as base64 PNG
  const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData))

  return {
    qrCodeBase64: qrCodeImage,
    instructions: "Scan this QR code with your mobile wallet (Phantom/Metamask)",
    manualAddress: escrow.contractAddress,
    manualAmount: escrow.amount,
    webFallback: `${process.env.WEB_URL}/escrow/${escrow.id}/fund`
  }
}
```

**3. Web Platform Fallback**

All MCP wallet interactions provide a `webFallback` URL that opens the full web interface with wallet connection UI. This ensures users can always complete crypto payments even if deep links or QR codes fail.

**Implementation Notes:**
- MCP responses include markdown-formatted clickable links for deep link handoff
- QR codes returned as base64-encoded images displayable in ChatGPT/Claude UI
- Transaction monitoring uses same `EscrowService.monitorTransaction()` API regardless of funding method
- MCP client polls escrow status via `get_escrow_status` tool until transaction confirmed

## 6.4 Smart Contracts

### Escrow.sol (Polygon)

**Responsibility:** Non-custodial escrow for USDC/USDT/MATIC payments

**Key Interfaces:**
```solidity
contract Escrow is ReentrancyGuard, Ownable {
    function deposit() external;
    function release() external;
    function refund() external;

    event Deposited(address indexed from, uint256 amount);
    event Released(address indexed expert, uint256 expertAmount, uint256 platformAmount);
    event Refunded(address indexed client, uint256 amount);
}
```

**Dependencies:** OpenZeppelin (ReentrancyGuard, Ownable), ERC20

**Technology:** Solidity 0.8.20, Hardhat for testing/deployment

### escrow.rs (Solana)

**Responsibility:** Non-custodial escrow for SOL/SPL token payments

**Key Interfaces:**
```rust
#[program]
pub mod escrow {
    pub fn initialize(ctx: Context<Initialize>, amount: u64, platform_fee: u16) -> Result<()>
    pub fn deposit(ctx: Context<Deposit>) -> Result<()>
    pub fn release(ctx: Context<Release>) -> Result<()>
    pub fn refund(ctx: Context<Refund>) -> Result<()>
}
```

**Dependencies:** Anchor framework, anchor-spl

**Technology:** Rust + Anchor 0.30.x, Solana Test Validator for testing

---
