# 8. Core Workflows

## 8.1 Client Creates Project via MCP

```mermaid
sequenceDiagram
    participant ChatGPT
    participant MCP as MCP Server
    participant Services as Service Layer
    participant DB as PostgreSQL
    participant GitHub as GitHub API

    ChatGPT->>MCP: User: "Create a marketplace app"
    MCP->>MCP: Load analyst.txt prompt
    MCP->>ChatGPT: Return analyst persona
    ChatGPT->>MCP: create_project({ name, brief })
    MCP->>Services: ProjectService.create()
    Services->>DB: INSERT INTO projects
    Services->>GitHub: Create repo in american-nerd-projects
    GitHub-->>Services: Repo created
    Services->>GitHub: Scaffold BMAD structure
    Services->>GitHub: Add client as collaborator
    Services->>DB: UPDATE project SET repoUrl
    Services-->>MCP: Project created
    MCP-->>ChatGPT: Success + repoUrl
    ChatGPT->>ChatGPT: Continue analyst flow
```

## 8.2 Expert Bids on Opportunity

```mermaid
sequenceDiagram
    participant Expert as Expert (Web)
    participant API as REST API
    participant Services as Service Layer
    participant DB as PostgreSQL
    participant Metrics as Datadog Metrics

    Expert->>API: GET /opportunities?stage=developer
    API->>Services: OpportunityService.list('developer')
    Services->>DB: SELECT * FROM opportunities
    DB-->>Services: List of opportunities
    Services-->>API: Opportunities
    API-->>Expert: 200 OK + opportunities

    Expert->>API: POST /bids
    Note over Expert,API: { opportunityId, amount, currency, proposal }
    API->>API: Validate with Zod
    API->>Services: BidService.create()
    Services->>Services: Check for duplicate bid
    Services->>DB: INSERT INTO bids
    DB-->>Services: Bid created
    Services->>Metrics: Increment bid.placed
    Services-->>API: Bid
    API-->>Expert: 201 Created + bid
```

## 8.3 Dev Submits PR for Story

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant API as REST API
    participant PRValidation as PRValidationService
    participant GitHub as GitHub API
    participant Services as StoryService
    participant DB as PostgreSQL

    Dev->>Dev: Fork client repo
    Dev->>Dev: Implement story
    Dev->>Dev: Update .bmad-core/stories/story-1.md<br/>status: ready_for_review
    Dev->>GitHub: Create PR to client repo
    GitHub-->>Dev: PR created

    Dev->>API: POST /stories/{id}/submit-pr
    Note over Dev,API: { prUrl, prNumber }

    API->>Services: StoryService.linkPR()
    Services->>DB: Get story + assigned dev
    DB-->>Services: Story + dev.githubUsername

    Services->>PRValidation: validateAndLinkPR()
    PRValidation->>GitHub: GET /repos/{owner}/{repo}/pulls/{number}
    GitHub-->>PRValidation: PR details

    PRValidation->>PRValidation: Verify PR author == dev.githubUsername
    PRValidation->>PRValidation: Verify PR from fork (not branch)
    PRValidation->>PRValidation: Verify story file included

    alt Validation passed
        PRValidation-->>Services: Valid
        Services->>DB: UPDATE story SET devPrUrl, status=READY_FOR_REVIEW
        Services-->>API: Story updated
        API-->>Dev: 200 OK
    else Validation failed
        PRValidation-->>Services: Invalid
        Services-->>API: ValidationError
        API-->>Dev: 400 Bad Request
    end
```

## 8.4 QA Approves Story and Platform Auto-Merges

```mermaid
sequenceDiagram
    participant QA as QA Reviewer
    participant API as REST API
    participant Services as StoryService
    participant DB as PostgreSQL
    participant GitHub as GitHub API
    participant Escrow as EscrowService

    QA->>API: POST /stories/{id}/approve
    Note over QA,API: { reviewNotes }

    API->>Services: StoryService.approve()
    Services->>DB: Get story + PR details
    DB-->>Services: Story

    Services->>Services: Validate QA is assignedQA
    Services->>Services: Validate status == IN_QA_REVIEW

    Services->>GitHub: Update story file in PR<br/>status: done
    GitHub-->>Services: File updated

    Services->>GitHub: POST /repos/{owner}/{repo}/pulls/{number}/merge
    GitHub-->>Services: PR merged

    Services->>DB: UPDATE story SET status=DONE
    Services->>Escrow: EscrowService.release()
    Escrow->>DB: Get escrow for story
    Escrow->>Escrow: Call smart contract release()

    Escrow-->>Services: Payment released
    Services-->>API: Story approved
    API-->>QA: 200 OK
```

## 8.5 Escrow Release (Crypto)

```mermaid
sequenceDiagram
    participant Platform as Platform Backend
    participant Escrow as EscrowService
    participant DB as PostgreSQL
    participant Contract as Polygon Escrow Contract
    participant Alchemy as Alchemy RPC
    participant Wallet as Expert Wallet

    Platform->>Escrow: EscrowService.release(escrowId)
    Escrow->>DB: Get escrow details
    DB-->>Escrow: { contractAddress, amount, expertAddress }

    Escrow->>Escrow: Generate signed transaction<br/>release() call
    Escrow->>Alchemy: eth_sendRawTransaction
    Alchemy->>Contract: Execute release()

    Contract->>Contract: Verify status == FUNDED
    Contract->>Contract: Calculate platformAmount (5%)
    Contract->>Contract: Calculate expertAmount (95%)
    Contract->>Contract: Update status = RELEASED

    Contract->>Wallet: Transfer expertAmount USDC
    Contract->>Platform: Transfer platformAmount USDC

    Contract-->>Alchemy: Emit Released event
    Alchemy-->>Escrow: Transaction receipt

    Escrow->>DB: UPDATE escrow SET status=RELEASED, releasedAt
    Escrow-->>Platform: Success
```

## 8.6 Complete BMAD Story Lifecycle (PM → Dev → QA)

```mermaid
sequenceDiagram
    participant PM as PM Expert
    participant Dev as Developer
    participant QA as QA Reviewer
    participant GitHub as GitHub Repo
    participant Platform as Platform API
    participant DB as PostgreSQL

    Note over PM: Phase 1: Story Creation & Validation
    PM->>PM: Run /BMad:tasks:create-next-story
    PM->>GitHub: Commit docs/stories/1.3.user-auth.md<br/>Status: Draft
    GitHub->>Platform: Webhook: push event
    Platform->>DB: CREATE story (status=DRAFT)

    PM->>PM: Run /BMad:tasks:validate-next-story
    PM->>PM: Validation score: 9/10 (GO)
    PM->>GitHub: Update story file<br/>Status: Approved
    GitHub->>Platform: Webhook: push event
    Platform->>DB: UPDATE story (status=APPROVED)
    Platform->>Platform: Create Developer marketplace opportunity

    Note over Dev: Phase 2: Development
    Dev->>Platform: Browse marketplace, place bid
    Platform->>Dev: Bid accepted, grant GitHub access

    Dev->>Dev: Run /BMad:agents:dev (James)
    Dev->>GitHub: Update story<br/>Status: InProgress
    GitHub->>Platform: Webhook: push event
    Platform->>DB: UPDATE story (status=IN_PROGRESS)

    Dev->>Dev: Implement code, write tests
    Dev->>GitHub: Update story<br/>Status: Ready for Review
    Dev->>GitHub: Create PR #42
    GitHub->>Platform: Webhook: PR opened
    Platform->>DB: UPDATE story (status=READY_FOR_REVIEW, prNumber=42)
    Platform->>Platform: Create QA marketplace opportunity

    Note over QA: Phase 3: QA Review (Pass)
    QA->>Platform: Browse QA marketplace, place bid
    Platform->>QA: Bid accepted

    QA->>QA: Run /BMad:agents:qa (Quinn)
    QA->>QA: Run *review 1.3
    QA->>QA: All checks pass
    QA->>GitHub: Create docs/qa/gates/1.3-user-auth.yml<br/>gate: PASS
    QA->>GitHub: Update story QA Results section
    QA->>GitHub: Update story<br/>Status: Done
    GitHub->>Platform: Webhook: push event
    Platform->>DB: UPDATE story (status=DONE, qaGateStatus=PASS)

    Platform->>GitHub: Merge PR #42
    Platform->>Platform: Release escrow to developer
    Platform->>GitHub: Revoke developer access
    Platform->>DB: Close opportunities
```

## 8.7 BMAD Story Lifecycle with QA Rework (FAIL → Fix → PASS)

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant QA as QA Reviewer
    participant GitHub as GitHub Repo
    participant Platform as Platform API
    participant DB as PostgreSQL

    Note over Dev,QA: Story already in Ready for Review status

    Note over QA: QA Review Cycle 1: Issues Found
    QA->>QA: Run /BMad:agents:qa (Quinn)
    QA->>QA: Run *review 1.3
    QA->>QA: Found: Missing tests, security issue
    QA->>GitHub: Create docs/qa/gates/1.3-user-auth.yml<br/>gate: FAIL<br/>top_issues: [TEST-001, SEC-001]
    QA->>GitHub: Update story QA Results section
    QA->>GitHub: Update story<br/>Status: InProgress
    GitHub->>Platform: Webhook: push event
    Platform->>DB: UPDATE story (status=IN_PROGRESS, qaGateStatus=FAIL, qaReviewCount=1)
    Platform->>Dev: Notify: QA requested changes

    Note over Dev: Developer Fixes Issues
    Dev->>Dev: Run /BMad:tasks:apply-qa-fixes
    Dev->>Dev: Read gate file, prioritize fixes
    Dev->>Dev: Add missing tests, fix security issue
    Dev->>GitHub: Push fixes to PR #42
    Dev->>GitHub: Update story<br/>Status: Ready for Review
    GitHub->>Platform: Webhook: PR synchronized
    Platform->>DB: UPDATE story (status=READY_FOR_REVIEW)
    Platform->>QA: Notify: Ready for re-review

    Note over QA: QA Review Cycle 2: Approved
    QA->>QA: Run /BMad:agents:qa (Quinn)
    QA->>QA: Run *review 1.3
    QA->>QA: All issues resolved
    QA->>GitHub: Update docs/qa/gates/1.3-user-auth.yml<br/>gate: PASS
    QA->>GitHub: Update story<br/>Status: Done
    GitHub->>Platform: Webhook: push event
    Platform->>DB: UPDATE story (status=DONE, qaGateStatus=PASS, qaReviewCount=2)

    Platform->>GitHub: Merge PR #42
    Platform->>Platform: Release escrow to developer
    Platform->>GitHub: Revoke developer access
```

---
