# 4. Data Models

## 4.1 User

**Purpose:** Represents all users (clients and experts) with role-based access control.

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `email`: string - User email (unique)
- `name`: string | null - Display name
- `githubUsername`: string | null - GitHub account (for experts submitting PRs)
- `role`: Role enum - CLIENT, ANALYST, PM, ARCHITECT, UX, DEVELOPER, QA
- `avatarUrl`: string | null - Profile picture URL
- `bio`: string | null - Expert bio
- `createdAt`: DateTime - Account creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
import { Role } from '@prisma/client'

interface User {
  id: string
  email: string
  name: string | null
  githubUsername: string | null
  role: Role
  avatarUrl: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date

  // Relations
  projects?: Project[]
  bids?: Bid[]
  assignedStories?: Story[]
  apiKeys?: ApiKey[]
}

enum Role {
  CLIENT = 'CLIENT',
  ANALYST = 'ANALYST',
  PM = 'PM',
  ARCHITECT = 'ARCHITECT',
  UX = 'UX',
  DEVELOPER = 'DEVELOPER',
  QA = 'QA'
}
```

**Relationships:**
- **One-to-Many with Project**: A client can own multiple projects
- **One-to-Many with Bid**: An expert can place multiple bids
- **One-to-Many with Story**: A developer/QA can be assigned multiple stories
- **One-to-Many with ApiKey**: An expert can have multiple API keys

## 4.2 Project

**Purpose:** Represents a client's software project moving through BMAD stages.

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `clientId`: string - Foreign key to User (client)
- `name`: string - Project name
- `description`: string | null - Project description
- `status`: ProjectStatus enum - PLANNING, IN_DEVELOPMENT, COMPLETED, CANCELLED
- `repoUrl`: string | null - GitHub repository URL (created by platform)
- `repoName`: string | null - GitHub repository name
- `currentStage`: Stage enum | null - analyst, pm, architect, ux, developer, qa
- `brief`: JSON | null - Initial project brief (JSONB)
- `createdAt`: DateTime - Project creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
import { ProjectStatus, Stage } from '@prisma/client'

interface Project {
  id: string
  clientId: string
  name: string
  description: string | null
  status: ProjectStatus
  repoUrl: string | null
  repoName: string | null
  currentStage: Stage | null
  brief: Record<string, any> | null
  createdAt: Date
  updatedAt: Date

  // Relations
  client?: User
  opportunities?: Opportunity[]
  stories?: Story[]
  documents?: Document[]
  escrows?: Escrow[]
}

enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

enum Stage {
  ANALYST = 'analyst',
  PM = 'pm',
  ARCHITECT = 'architect',
  UX = 'ux',
  DEVELOPER = 'developer',
  QA = 'qa'
}
```

**Relationships:**
- **Many-to-One with User**: Each project belongs to one client
- **One-to-Many with Opportunity**: A project can have multiple opportunities (one per stage)
- **One-to-Many with Story**: A project can have multiple stories
- **One-to-Many with Document**: A project can have multiple documents
- **One-to-Many with Escrow**: A project can have multiple escrow contracts

## 4.3 Opportunity

**Purpose:** Represents a marketplace posting for a specific BMAD stage (e.g., "Need Analyst for marketplace app").

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `projectId`: string - Foreign key to Project
- `stage`: Stage enum - analyst, pm, architect, ux, developer, qa
- `title`: string - Opportunity title
- `description`: string - Detailed requirements
- `budget`: JSON - { min: number, max: number, currency: string }
- `deadline`: DateTime | null - Expected completion date
- `status`: OpportunityStatus enum - OPEN, CLOSED, COMPLETED
- `acceptedBidId`: string | null - Winning bid ID
- `createdAt`: DateTime - Opportunity creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
import { OpportunityStatus, Stage } from '@prisma/client'

interface Opportunity {
  id: string
  projectId: string
  stage: Stage
  title: string
  description: string
  budget: {
    min: number
    max: number
    currency: string
  }
  deadline: Date | null
  status: OpportunityStatus
  acceptedBidId: string | null
  createdAt: Date
  updatedAt: Date

  // Relations
  project?: Project
  bids?: Bid[]
  acceptedBid?: Bid
}

enum OpportunityStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  COMPLETED = 'COMPLETED'
}
```

**Relationships:**
- **Many-to-One with Project**: Each opportunity belongs to one project
- **One-to-Many with Bid**: An opportunity can receive multiple bids
- **One-to-One with Bid**: An opportunity has one accepted bid (winner)

## 4.4 Bid

**Purpose:** Represents an expert's proposal to work on an opportunity.

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `opportunityId`: string - Foreign key to Opportunity
- `expertId`: string - Foreign key to User (expert)
- `amount`: number - Bid amount in cents/smallest unit
- `currency`: string - USD, USDC, USDT, MATIC, SOL
- `proposal`: string - Expert's pitch and approach
- `estimatedDuration`: number | null - Estimated hours
- `status`: BidStatus enum - PENDING, ACCEPTED, REJECTED, WITHDRAWN
- `createdAt`: DateTime - Bid creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
import { BidStatus } from '@prisma/client'

interface Bid {
  id: string
  opportunityId: string
  expertId: string
  amount: number
  currency: string
  proposal: string
  estimatedDuration: number | null
  status: BidStatus
  createdAt: Date
  updatedAt: Date

  // Relations
  opportunity?: Opportunity
  expert?: User
}

enum BidStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}
```

**Relationships:**
- **Many-to-One with Opportunity**: Each bid is for one opportunity
- **Many-to-One with User**: Each bid is submitted by one expert

## 4.5 Story

**Purpose:** Represents a development task (used in Developer and QA stages).

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `projectId`: string - Foreign key to Project
- `storyNumber`: number - Sequential story number within project
- `title`: string - Story title
- `description`: string - User story description
- `acceptanceCriteria`: string - Definition of done
- `priority`: number - Priority ranking (lower = higher priority)
- `assignedDevId`: string | null - Foreign key to User (developer)
- `assignedQAId`: string | null - Foreign key to User (QA reviewer)
- `status`: StoryStatus enum - DRAFT, APPROVED, IN_PROGRESS, READY_FOR_REVIEW, DONE, BLOCKED
- `devPrUrl`: string | null - Developer's pull request URL
- `devPrNumber`: number | null - PR number
- `devPrAuthor`: string | null - GitHub username of PR author (validation)
- `storyFile`: string | null - Path to story file (e.g., `docs/stories/1.3.user-auth.md`)
- `epicNumber`: number - Epic number from story file (e.g., 1 from `1.3`)
- `validatedAt`: DateTime | null - When PM ran `/BMad:tasks:validate-next-story`
- `validatedBy`: string | null - User ID of PM/Architect who validated
- `validationScore`: number | null - Validation readiness score (1-10)
- `qaGatePath`: string | null - Path to QA gate file (e.g., `docs/qa/gates/1.3-user-auth.yml`)
- `qaGateStatus`: string | null - QA gate status: PASS, FAIL, CONCERNS, WAIVED
- `qaReviewedAt`: DateTime | null - When QA reviewed story
- `qaReviewCount`: number - Number of QA review cycles (tracks rework iterations)
- `createdAt`: DateTime - Story creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
import { StoryStatus } from '@prisma/client'

interface Story {
  id: string
  projectId: string
  storyNumber: number
  title: string
  description: string
  acceptanceCriteria: string
  priority: number
  assignedDevId: string | null
  assignedQAId: string | null
  status: StoryStatus
  devPrUrl: string | null
  devPrNumber: number | null
  devPrAuthor: string | null
  storyFile: string | null
  createdAt: Date
  updatedAt: Date

  // Relations
  project?: Project
  assignedDev?: User
  assignedQA?: User
  deliverables?: Deliverable[]
  auditLogs?: StoryAuditLog[]
}

enum StoryStatus {
  DRAFT = 'DRAFT',                    // PM created, awaiting validation
  APPROVED = 'APPROVED',              // Validation passed, ready for dev marketplace
  IN_PROGRESS = 'IN_PROGRESS',        // Developer implementing
  READY_FOR_REVIEW = 'READY_FOR_REVIEW', // Dev completed, awaiting QA review
  DONE = 'DONE',                      // QA approved, merged, paid
  BLOCKED = 'BLOCKED'                 // External blocker
}
```

**Relationships:**
- **Many-to-One with Project**: Each story belongs to one project
- **Many-to-One with User (Dev)**: Each story can be assigned to one developer
- **Many-to-One with User (QA)**: Each story can be assigned to one QA reviewer
- **One-to-Many with Deliverable**: A story can have multiple deliverables (for planning stages)
- **One-to-Many with StoryAuditLog**: A story has audit trail of status changes

## 4.6 Deliverable

**Purpose:** Represents submitted work for planning stages (Analyst, PM, Architect, UX).

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `opportunityId`: string | null - Foreign key to Opportunity (for planning stages)
- `storyId`: string | null - Foreign key to Story (for dev stages)
- `expertId`: string - Foreign key to User (expert)
- `stage`: Stage enum - analyst, pm, architect, ux, developer, qa
- `prUrl`: string - Pull request URL
- `prNumber`: number - PR number in GitHub
- `prAuthor`: string - GitHub username (validated against expert)
- `status`: DeliverableStatus enum - SUBMITTED, APPROVED, CHANGES_REQUESTED, REJECTED
- `reviewNotes`: string | null - Client/QA feedback
- `submittedAt`: DateTime - Submission timestamp
- `reviewedAt`: DateTime | null - Review timestamp
- `approvedAt`: DateTime | null - Approval timestamp

**TypeScript Interface:**

```typescript
import { DeliverableStatus, Stage } from '@prisma/client'

interface Deliverable {
  id: string
  opportunityId: string | null
  storyId: string | null
  expertId: string
  stage: Stage
  prUrl: string
  prNumber: number
  prAuthor: string
  status: DeliverableStatus
  reviewNotes: string | null
  submittedAt: Date
  reviewedAt: Date | null
  approvedAt: Date | null

  // Relations
  opportunity?: Opportunity
  story?: Story
  expert?: User
}

enum DeliverableStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
  REJECTED = 'REJECTED'
}
```

**Relationships:**
- **Many-to-One with Opportunity**: Each deliverable is for one opportunity (planning stages)
- **Many-to-One with Story**: Each deliverable is for one story (dev stages)
- **Many-to-One with User**: Each deliverable is submitted by one expert

## 4.7 Escrow

**Purpose:** Tracks non-custodial smart contract escrow for crypto payments (Polygon + Solana).

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `projectId`: string - Foreign key to Project
- `opportunityId`: string | null - Foreign key to Opportunity (optional, for stage-specific escrow)
- `clientId`: string - Foreign key to User (client)
- `expertId`: string - Foreign key to User (expert)
- `amount`: string - Escrow amount in smallest unit (wei for EVM, lamports for Solana)
- `currency`: string - USDC, USDT, ETH (Polygon); USDC-SPL, SOL (Solana)
- `blockchain`: string - 'polygon' | 'solana'
- `platformFee`: number - Platform fee in basis points (500 = 5%)
- `status`: EscrowStatus enum - PENDING, FUNDED, RELEASED, REFUNDED
- `contractAddress`: string - Smart contract address on respective blockchain
- `transactionHash`: string | null - Funding transaction hash
- `releaseTransactionHash`: string | null - Release transaction hash
- `fundedAt`: DateTime | null - Funding timestamp (on-chain confirmation)
- `releasedAt`: DateTime | null - Release timestamp (on-chain confirmation)
- `createdAt`: DateTime - Escrow creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
import { EscrowStatus } from '@prisma/client'

interface Escrow {
  id: string
  projectId: string
  opportunityId: string | null
  clientId: string
  expertId: string
  amount: string // Use string for big numbers (wei/lamports)
  currency: string
  blockchain: 'polygon' | 'solana'
  platformFee: number
  status: EscrowStatus
  contractAddress: string
  transactionHash: string | null
  releaseTransactionHash: string | null
  fundedAt: Date | null
  releasedAt: Date | null
  createdAt: Date
  updatedAt: Date

  // Relations
  project?: Project
  opportunity?: Opportunity
  client?: User
  expert?: User
}

enum EscrowStatus {
  PENDING = 'PENDING',
  FUNDED = 'FUNDED',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED'
}
```

**Relationships:**
- **Many-to-One with Project**: Each escrow is for one project
- **Many-to-One with Opportunity**: Each escrow may be for one opportunity
- **Many-to-One with User (Client)**: Each escrow has one client (payer)
- **Many-to-One with User (Expert)**: Each escrow has one expert (payee)

## 4.8 Document

**Purpose:** Stores references to files uploaded to Supabase Storage (briefs, PRDs, architecture docs, etc.).

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `projectId`: string - Foreign key to Project
- `uploadedById`: string - Foreign key to User (uploader)
- `filename`: string - Original filename
- `storagePath`: string - Path in Supabase Storage
- `mimeType`: string - File MIME type
- `size`: number - File size in bytes
- `documentType`: string - brief, prd, architecture, wireframes, etc.
- `createdAt`: DateTime - Upload timestamp

**TypeScript Interface:**

```typescript
interface Document {
  id: string
  projectId: string
  uploadedById: string
  filename: string
  storagePath: string
  mimeType: string
  size: number
  documentType: string
  createdAt: Date

  // Relations
  project?: Project
  uploadedBy?: User
}
```

**Relationships:**
- **Many-to-One with Project**: Each document belongs to one project
- **Many-to-One with User**: Each document is uploaded by one user

## 4.9 Rating

**Purpose:** Post-project ratings for experts (reputation system).

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `projectId`: string - Foreign key to Project
- `expertId`: string - Foreign key to User (expert being rated)
- `clientId`: string - Foreign key to User (client rating)
- `stage`: Stage enum - analyst, pm, architect, ux, developer, qa
- `rating`: number - 1-5 stars
- `feedback`: string | null - Written feedback
- `createdAt`: DateTime - Rating timestamp

**TypeScript Interface:**

```typescript
import { Stage } from '@prisma/client'

interface Rating {
  id: string
  projectId: string
  expertId: string
  clientId: string
  stage: Stage
  rating: number // 1-5
  feedback: string | null
  createdAt: Date

  // Relations
  project?: Project
  expert?: User
  client?: User
}
```

**Relationships:**
- **Many-to-One with Project**: Each rating is for one project
- **Many-to-One with User (Expert)**: Each rating is for one expert
- **Many-to-One with User (Client)**: Each rating is by one client

## 4.10 Supporting Models

**ApiKey** - Expert API keys for programmatic access
**MCPSession** - OAuth session state for MCP clients
**GitHubInstallation** - GitHub App installation tracking
**StoryAuditLog** - Audit trail for story status changes

---
