# 9. Database Schema

The complete Prisma schema defining all data models, relationships, indexes, and constraints:

```prisma
// packages/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CLIENT
  ANALYST
  PM
  ARCHITECT
  UX
  DEVELOPER
  QA
}

enum ProjectStatus {
  PLANNING
  IN_DEVELOPMENT
  COMPLETED
  CANCELLED
}

enum Stage {
  analyst
  pm
  architect
  ux
  developer
  qa
}

enum OpportunityStatus {
  OPEN
  CLOSED
  COMPLETED
}

enum BidStatus {
  PENDING
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum StoryStatus {
  DRAFT            // PM created, awaiting validation
  APPROVED         // Validation passed, ready for dev marketplace
  IN_PROGRESS      // Developer implementing
  READY_FOR_REVIEW // Dev completed, awaiting QA review
  DONE             // QA approved, merged, paid
  BLOCKED          // External blocker
}

enum DeliverableStatus {
  SUBMITTED
  APPROVED
  CHANGES_REQUESTED
  REJECTED
}

enum EscrowStatus {
  PENDING
  FUNDED
  RELEASED
  REFUNDED
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  name           String?
  githubUsername String?  @unique
  role           Role
  avatarUrl      String?
  bio            String?  @db.Text
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  projects       Project[]    @relation("ClientProjects")
  bids           Bid[]
  assignedDevStories Story[]  @relation("AssignedDev")
  assignedQAStories  Story[]  @relation("AssignedQA")
  deliverables   Deliverable[]
  apiKeys        ApiKey[]
  ratingsGiven   Rating[]     @relation("ClientRatings")
  ratingsReceived Rating[]    @relation("ExpertRatings")
  clientEscrows  Escrow[]     @relation("ClientEscrows")
  expertEscrows  Escrow[]     @relation("ExpertEscrows")
  uploadedDocs   Document[]

  @@index([email])
  @@index([githubUsername])
  @@index([role])
}

model Project {
  id           String        @id @default(uuid())
  clientId     String
  name         String
  description  String?       @db.Text
  status       ProjectStatus @default(PLANNING)
  repoUrl      String?
  repoName     String?
  currentStage Stage?
  brief        Json?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  // Relations
  client        User           @relation("ClientProjects", fields: [clientId], references: [id])
  opportunities Opportunity[]
  stories       Story[]
  documents     Document[]
  escrows       Escrow[]
  ratings       Rating[]

  @@index([clientId])
  @@index([status])
  @@index([currentStage])
}

model Opportunity {
  id            String            @id @default(uuid())
  projectId     String
  stage         Stage
  title         String
  description   String            @db.Text
  budget        Json              // { min: number, max: number, currency: string }
  deadline      DateTime?
  status        OpportunityStatus @default(OPEN)
  acceptedBidId String?           @unique
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  // Relations
  project      Project       @relation(fields: [projectId], references: [id])
  bids         Bid[]
  acceptedBid  Bid?          @relation("AcceptedBid", fields: [acceptedBidId], references: [id])
  deliverables Deliverable[]
  escrows      Escrow[]

  @@index([projectId])
  @@index([stage])
  @@index([status])
}

model Bid {
  id                String    @id @default(uuid())
  opportunityId     String
  expertId          String
  amount            Int       // In cents or smallest unit
  currency          String
  proposal          String    @db.Text
  estimatedDuration Int?      // In hours
  status            BidStatus @default(PENDING)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  opportunity          Opportunity  @relation(fields: [opportunityId], references: [id])
  expert               User         @relation(fields: [expertId], references: [id])
  acceptedOpportunity  Opportunity? @relation("AcceptedBid")

  @@index([opportunityId])
  @@index([expertId])
  @@index([status])
}

model Story {
  id                 String      @id @default(uuid())
  projectId          String
  epicNumber         Int         // Epic number from story file (e.g., 1 from "1.3")
  storyNumber        Int         // Story number within epic (e.g., 3 from "1.3")
  title              String
  description        String      @db.Text
  acceptanceCriteria String      @db.Text
  priority           Int         @default(0)
  assignedDevId      String?
  assignedQAId       String?
  status             StoryStatus @default(DRAFT)

  // GitHub Integration
  devPrUrl           String?
  devPrNumber        Int?
  devPrAuthor        String?
  storyFile          String?     // Path: "docs/stories/1.3.user-auth.md"

  // BMAD Validation (Pre-Development)
  validatedAt        DateTime?   // When PM ran /BMad:tasks:validate-next-story
  validatedBy        String?     // User ID of PM/Architect who validated
  validationScore    Int?        // Validation readiness score (1-10)

  // QA Review (Post-Development)
  qaGatePath         String?     // Path: "docs/qa/gates/1.3-user-auth.yml"
  qaGateStatus       String?     // QA gate status: PASS, FAIL, CONCERNS, WAIVED
  qaReviewedAt       DateTime?   // When QA last reviewed
  qaReviewCount      Int         @default(0) // Number of QA review cycles

  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  // Relations
  project      Project          @relation(fields: [projectId], references: [id])
  assignedDev  User?            @relation("AssignedDev", fields: [assignedDevId], references: [id])
  assignedQA   User?            @relation("AssignedQA", fields: [assignedQAId], references: [id])
  deliverables Deliverable[]
  auditLogs    StoryAuditLog[]

  @@unique([projectId, epicNumber, storyNumber])
  @@index([projectId])
  @@index([assignedDevId])
  @@index([assignedQAId])
  @@index([status])
  @@index([epicNumber])
}

model Deliverable {
  id            String             @id @default(uuid())
  opportunityId String?
  storyId       String?
  expertId      String
  stage         Stage
  prUrl         String
  prNumber      Int
  prAuthor      String
  status        DeliverableStatus  @default(SUBMITTED)
  reviewNotes   String?            @db.Text
  submittedAt   DateTime           @default(now())
  reviewedAt    DateTime?
  approvedAt    DateTime?

  // Relations
  opportunity Opportunity? @relation(fields: [opportunityId], references: [id])
  story       Story?       @relation(fields: [storyId], references: [id])
  expert      User         @relation(fields: [expertId], references: [id])

  @@index([opportunityId])
  @@index([storyId])
  @@index([expertId])
  @@index([status])
}

model Escrow {
  id                     String        @id @default(uuid())
  projectId              String
  opportunityId          String?
  clientId               String
  expertId               String
  amount                 String        // Big number as string (wei/lamports)
  currency               String        // USDC, USDT, ETH, SOL, USDC-SPL
  blockchain             String        // 'polygon' | 'solana'
  platformFee            Int           // In basis points (500 = 5%)
  status                 EscrowStatus  @default(PENDING)
  contractAddress        String        // Smart contract address (required)
  transactionHash        String?       // Funding transaction hash
  releaseTransactionHash String?       // Release transaction hash
  fundedAt               DateTime?
  releasedAt             DateTime?
  createdAt              DateTime      @default(now())
  updatedAt              DateTime      @updatedAt

  // Relations
  project     Project      @relation(fields: [projectId], references: [id])
  opportunity Opportunity? @relation(fields: [opportunityId], references: [id])
  client      User         @relation("ClientEscrows", fields: [clientId], references: [id])
  expert      User         @relation("ExpertEscrows", fields: [expertId], references: [id])

  @@index([projectId])
  @@index([opportunityId])
  @@index([status])
  @@index([contractAddress])
  @@index([blockchain])
}

model Document {
  id           String   @id @default(uuid())
  projectId    String
  uploadedById String
  filename     String
  storagePath  String
  mimeType     String
  size         Int
  documentType String
  createdAt    DateTime @default(now())

  // Relations
  project    Project @relation(fields: [projectId], references: [id])
  uploadedBy User    @relation(fields: [uploadedById], references: [id])

  @@index([projectId])
  @@index([documentType])
}

model Rating {
  id        String   @id @default(uuid())
  projectId String
  expertId  String
  clientId  String
  stage     Stage
  rating    Int      // 1-5
  feedback  String?  @db.Text
  createdAt DateTime @default(now())

  // Relations
  project Project @relation(fields: [projectId], references: [id])
  expert  User    @relation("ExpertRatings", fields: [expertId], references: [id])
  client  User    @relation("ClientRatings", fields: [clientId], references: [id])

  @@index([expertId])
  @@index([projectId])
}

model ApiKey {
  id        String   @id @default(uuid())
  userId    String
  name      String
  keyHash   String   @unique
  createdAt DateTime @default(now())
  lastUsed  DateTime?

  // Relations
  user User @relation(fields: [userId], references: [id])

  @@index([userId])
}

model MCPSession {
  id          String   @id @default(uuid())
  state       String   @unique
  userId      String?
  accessToken String?
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  @@index([state])
}

model GitHubInstallation {
  id             String   @id @default(uuid())
  installationId Int      @unique
  accountId      Int
  accountLogin   String
  createdAt      DateTime @default(now())

  @@index([installationId])
}

model StoryAuditLog {
  id         String      @id @default(uuid())
  storyId    String
  userId     String
  action     String
  fromStatus StoryStatus?
  toStatus   StoryStatus?
  metadata   Json?
  createdAt  DateTime    @default(now())

  // Relations
  story Story @relation(fields: [storyId], references: [id])

  @@index([storyId])
  @@index([createdAt])
}
```

**Key Design Decisions:**

1. **UUID Primary Keys**: Enable distributed ID generation, prevent enumeration attacks
2. **JSONB for Flexible Data**: `budget`, `brief` use JSON for schema flexibility
3. **Indexes**: Optimized for common queries (filtering by status, stage, user)
4. **Timestamps**: All models have `createdAt`, mutable models have `updatedAt`
5. **Nullable Foreign Keys**: Support optional relationships (e.g., `assignedDevId`)
6. **Enums**: Type-safe status values prevent invalid states
7. **Unique Constraints**: Prevent duplicate bids, GitHub usernames, API keys
8. **Audit Trail**: `StoryAuditLog` tracks all story status changes for accountability

---
