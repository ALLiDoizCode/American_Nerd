# 5. API Specification

The American Nerd Marketplace exposes a **REST API** following OpenAPI 3.0 specification. All endpoints require authentication via JWT (clients) or API key (experts).

**Base URL:** `https://api.americannerd.com`

**Authentication:**
- **JWT Bearer Token**: `Authorization: Bearer <token>` (for web app users)
- **API Key**: `X-API-Key: <key>` (for expert programmatic access)

## 5.1 OpenAPI Specification (Excerpt)

```yaml
openapi: 3.0.0
info:
  title: American Nerd Marketplace API
  version: 1.0.0
  description: REST API for multi-stage expert marketplace with BMAD methodology integration

servers:
  - url: https://api.americannerd.com
    description: Production server
  - url: http://localhost:3001
    description: Local development server

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key

  schemas:
    User:
      type: object
      properties:
        id: {type: string, format: uuid}
        email: {type: string, format: email}
        name: {type: string, nullable: true}
        githubUsername: {type: string, nullable: true}
        role: {type: string, enum: [CLIENT, ANALYST, PM, ARCHITECT, UX, DEVELOPER, QA]}
        avatarUrl: {type: string, nullable: true}
        bio: {type: string, nullable: true}
        createdAt: {type: string, format: date-time}

    Project:
      type: object
      properties:
        id: {type: string, format: uuid}
        clientId: {type: string, format: uuid}
        name: {type: string}
        description: {type: string, nullable: true}
        status: {type: string, enum: [PLANNING, IN_DEVELOPMENT, COMPLETED, CANCELLED]}
        repoUrl: {type: string, nullable: true}
        repoName: {type: string, nullable: true}
        currentStage: {type: string, enum: [analyst, pm, architect, ux, developer, qa], nullable: true}
        brief: {type: object, nullable: true}
        createdAt: {type: string, format: date-time}

    Opportunity:
      type: object
      properties:
        id: {type: string, format: uuid}
        projectId: {type: string, format: uuid}
        stage: {type: string, enum: [analyst, pm, architect, ux, developer, qa]}
        title: {type: string}
        description: {type: string}
        budget:
          type: object
          properties:
            min: {type: number}
            max: {type: number}
            currency: {type: string, enum: [USD, USDC, USDT, MATIC, SOL]}
        deadline: {type: string, format: date-time, nullable: true}
        status: {type: string, enum: [OPEN, CLOSED, COMPLETED]}
        acceptedBidId: {type: string, format: uuid, nullable: true}
        createdAt: {type: string, format: date-time}

    Bid:
      type: object
      properties:
        id: {type: string, format: uuid}
        opportunityId: {type: string, format: uuid}
        expertId: {type: string, format: uuid}
        amount: {type: number}
        currency: {type: string, enum: [USD, USDC, USDT, MATIC, SOL]}
        proposal: {type: string}
        estimatedDuration: {type: number, nullable: true}
        status: {type: string, enum: [PENDING, ACCEPTED, REJECTED, WITHDRAWN]}
        createdAt: {type: string, format: date-time}

    Story:
      type: object
      properties:
        id: {type: string, format: uuid}
        projectId: {type: string, format: uuid}
        storyNumber: {type: number}
        title: {type: string}
        description: {type: string}
        acceptanceCriteria: {type: string}
        priority: {type: number}
        assignedDevId: {type: string, format: uuid, nullable: true}
        assignedQAId: {type: string, format: uuid, nullable: true}
        status: {type: string, enum: [READY_FOR_DEV, IN_DEVELOPMENT, READY_FOR_REVIEW, IN_QA_REVIEW, DONE, BLOCKED]}
        devPrUrl: {type: string, nullable: true}
        createdAt: {type: string, format: date-time}

paths:
  # Projects
  /projects:
    post:
      summary: Create new project
      tags: [Projects]
      security: [{BearerAuth: []}]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name]
              properties:
                name: {type: string, minLength: 1, maxLength: 100}
                description: {type: string}
                brief: {type: object}
      responses:
        201:
          description: Project created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Project'
        400: {description: Invalid input}
        401: {description: Unauthorized}

    get:
      summary: List projects for authenticated user
      tags: [Projects]
      security: [{BearerAuth: []}]
      parameters:
        - name: status
          in: query
          schema: {type: string, enum: [PLANNING, IN_DEVELOPMENT, COMPLETED, CANCELLED]}
      responses:
        200:
          description: List of projects
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Project'

  /projects/{id}:
    get:
      summary: Get project by ID
      tags: [Projects]
      security: [{BearerAuth: []}]
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string, format: uuid}
      responses:
        200:
          description: Project details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Project'
        404: {description: Project not found}

  # Opportunities
  /opportunities:
    post:
      summary: Create opportunity
      tags: [Opportunities]
      security: [{BearerAuth: []}]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [projectId, stage, title, description, budget]
              properties:
                projectId: {type: string, format: uuid}
                stage: {type: string, enum: [analyst, pm, architect, ux, developer, qa]}
                title: {type: string}
                description: {type: string}
                budget:
                  type: object
                  required: [min, max, currency]
                  properties:
                    min: {type: number, minimum: 0}
                    max: {type: number, minimum: 0}
                    currency: {type: string, enum: [USD, USDC, USDT, MATIC, SOL]}
                deadline: {type: string, format: date-time}
      responses:
        201:
          description: Opportunity created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Opportunity'

    get:
      summary: List opportunities
      tags: [Opportunities]
      security: [{BearerAuth: []}, {ApiKeyAuth: []}]
      parameters:
        - name: stage
          in: query
          schema: {type: string, enum: [analyst, pm, architect, ux, developer, qa]}
        - name: status
          in: query
          schema: {type: string, enum: [OPEN, CLOSED, COMPLETED]}
      responses:
        200:
          description: List of opportunities
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Opportunity'

  /opportunities/{id}:
    get:
      summary: Get opportunity by ID
      tags: [Opportunities]
      security: [{BearerAuth: []}, {ApiKeyAuth: []}]
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string, format: uuid}
      responses:
        200:
          description: Opportunity details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Opportunity'
        404: {description: Opportunity not found}

  # Bids
  /bids:
    post:
      summary: Submit bid
      tags: [Bids]
      security: [{BearerAuth: []}, {ApiKeyAuth: []}]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [opportunityId, amount, currency, proposal]
              properties:
                opportunityId: {type: string, format: uuid}
                amount: {type: number, minimum: 0}
                currency: {type: string, enum: [USD, USDC, USDT, MATIC, SOL]}
                proposal: {type: string, minLength: 100}
                estimatedDuration: {type: number}
      responses:
        201:
          description: Bid submitted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Bid'
        400: {description: Invalid input}
        409: {description: Already submitted bid for this opportunity}

  /bids/{id}/accept:
    post:
      summary: Accept bid (client only)
      tags: [Bids]
      security: [{BearerAuth: []}]
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string, format: uuid}
      responses:
        200:
          description: Bid accepted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Bid'
        403: {description: Only project owner can accept bids}
        404: {description: Bid not found}

  # Stories
  /stories:
    get:
      summary: List stories for project
      tags: [Stories]
      security: [{BearerAuth: []}, {ApiKeyAuth: []}]
      parameters:
        - name: projectId
          in: query
          required: true
          schema: {type: string, format: uuid}
        - name: status
          in: query
          schema: {type: string, enum: [READY_FOR_DEV, IN_DEVELOPMENT, READY_FOR_REVIEW, IN_QA_REVIEW, DONE, BLOCKED]}
      responses:
        200:
          description: List of stories
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Story'

  /stories/{id}/submit-pr:
    post:
      summary: Submit pull request for story
      tags: [Stories]
      security: [{BearerAuth: []}, {ApiKeyAuth: []}]
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string, format: uuid}
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [prUrl, prNumber]
              properties:
                prUrl: {type: string, format: uri}
                prNumber: {type: number}
      responses:
        200:
          description: PR linked to story
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Story'
        400: {description: Invalid PR or validation failed}
        403: {description: Only assigned developer can submit PR}

  /stories/{id}/approve:
    post:
      summary: Approve story and merge PR (QA only)
      tags: [Stories]
      security: [{BearerAuth: []}, {ApiKeyAuth: []}]
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string, format: uuid}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                reviewNotes: {type: string}
      responses:
        200:
          description: Story approved and PR merged
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Story'
        403: {description: Only assigned QA can approve}

  # MCP Authentication
  /mcp/auth/initiate:
    post:
      summary: Initiate OAuth flow for MCP clients
      tags: [MCP Auth]
      responses:
        200:
          description: OAuth flow initiated
          content:
            application/json:
              schema:
                type: object
                properties:
                  authUrl: {type: string, format: uri}
                  state: {type: string}

  /mcp/auth/callback:
    get:
      summary: GitHub OAuth callback
      tags: [MCP Auth]
      parameters:
        - name: code
          in: query
          required: true
          schema: {type: string}
        - name: state
          in: query
          required: true
          schema: {type: string}
      responses:
        200:
          description: Authentication successful
          content:
            text/html:
              schema: {type: string}

  /mcp/auth/status/{state}:
    get:
      summary: Poll for OAuth completion
      tags: [MCP Auth]
      parameters:
        - name: state
          in: path
          required: true
          schema: {type: string}
      responses:
        200:
          description: OAuth status
          content:
            application/json:
              schema:
                type: object
                properties:
                  status: {type: string, enum: [pending, completed, expired]}
                  accessToken: {type: string, nullable: true}
                  user: {$ref: '#/components/schemas/User', nullable: true}

  # Health Check
  /health:
    get:
      summary: API health check
      tags: [Health]
      responses:
        200:
          description: API is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status: {type: string}
                  timestamp: {type: string, format: date-time}
```

**Full OpenAPI spec available at:** `https://api.americannerd.com/openapi.json`

---
