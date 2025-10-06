# 11. Backend Architecture

## 11.1 Service Architecture (Express.js)

**Traditional Server Approach:**
- Express.js HTTP server running on Railway
- RESTful API design with resource-based routes
- Middleware pipeline for cross-cutting concerns

**Service Layer Pattern:**
- All business logic in `packages/services`
- Controllers in `apps/api/src/routes` are thin - just request/response handling
- Services are consumed by both REST API and MCP server

**Controller/Route Organization:**

```
apps/api/src/
├── app.ts                        # Express app setup
├── server.ts                     # HTTP server entry point
├── routes/                       # API routes
│   ├── projects.ts
│   ├── opportunities.ts
│   ├── bids.ts
│   ├── stories.ts
│   ├── escrow.ts
│   └── mcp-auth.ts
├── middleware/                   # Express middleware
│   ├── auth.ts                   # JWT/API key authentication
│   ├── rate-limit.ts             # Rate limiting with Upstash Redis
│   ├── error-handler.ts          # Centralized error handling
│   ├── request-logger.ts         # Structured logging
│   └── validate.ts               # Zod schema validation
└── utils/
    ├── logger.ts                 # Winston logger
    └── async-handler.ts          # Wrap async routes
```

**Controller Template:**

```typescript
// apps/api/src/routes/opportunities.ts

import { Router } from 'express'
import { z } from 'zod'
import { OpportunityService } from '@american-nerd/services'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { asyncHandler } from '../utils/async-handler'

const router = Router()

const CreateOpportunitySchema = z.object({
  projectId: z.string().uuid(),
  stage: z.enum(['analyst', 'pm', 'architect', 'ux', 'developer', 'qa']),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  budget: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
    currency: z.enum(['USD', 'USDC', 'USDT', 'MATIC', 'SOL'])
  }),
  deadline: z.string().datetime().optional()
})

router.post(
  '/opportunities',
  authenticate,
  validate(CreateOpportunitySchema),
  asyncHandler(async (req, res) => {
    const opportunity = await OpportunityService.create(req.body)
    res.status(201).json(opportunity)
  })
)

router.get(
  '/opportunities',
  authenticate,
  asyncHandler(async (req, res) => {
    const stage = req.query.stage as string | undefined
    const opportunities = await OpportunityService.list(stage)
    res.json(opportunities)
  })
)

export default router
```

## 11.2 Database Architecture

**Prisma ORM:**
- Type-safe database client
- Auto-generated types from schema
- Migration system for schema changes

**Data Access Layer:**

```typescript
// packages/services/src/opportunity-service.ts

import { prisma } from '@american-nerd/database'
import { Opportunity, OpportunityStatus } from '@american-nerd/database'
import { CacheService } from './cache-service'
import { Metrics } from './metrics'

export class OpportunityService {
  static async create(params: CreateOpportunityParams): Promise<Opportunity> {
    const opportunity = await prisma.opportunity.create({
      data: {
        projectId: params.projectId,
        stage: params.stage,
        title: params.title,
        description: params.description,
        budget: params.budget,
        deadline: params.deadline,
        status: OpportunityStatus.OPEN
      }
    })

    Metrics.incrementOpportunityCreated(params.stage)

    // Invalidate cache
    await CacheService.delete(`opportunities:${params.stage}`)

    return opportunity
  }

  static async list(stage?: string): Promise<Opportunity[]> {
    const cacheKey = `opportunities:${stage || 'all'}`
    const cached = await CacheService.get(cacheKey)
    if (cached) return cached

    const opportunities = await prisma.opportunity.findMany({
      where: stage ? { stage } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: { name: true, clientId: true }
        },
        bids: {
          select: { id: true }
        }
      }
    })

    await CacheService.set(cacheKey, opportunities, 60)
    return opportunities
  }
}
```

## 11.3 Authentication and Authorization

**Dual Auth Strategy:**
- **JWT Bearer Tokens**: For web app users (clients + experts via GitHub OAuth)
- **API Keys**: For expert programmatic access

**Authentication Middleware:**

```typescript
// apps/api/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express'
import { verifyJWT } from '../utils/jwt'
import { prisma } from '@american-nerd/database'
import { UnauthorizedError } from '@american-nerd/services/errors'
import bcrypt from 'bcrypt'

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const apiKey = req.headers['x-api-key'] as string | undefined

  try {
    // JWT authentication (web app)
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = verifyJWT(token)

      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (!req.user) {
        throw new UnauthorizedError('Invalid token')
      }

      return next()
    }

    // API key authentication (experts)
    if (apiKey) {
      const keyHash = await bcrypt.hash(apiKey, 10)

      const apiKeyRecord = await prisma.apiKey.findUnique({
        where: { keyHash },
        include: { user: true }
      })

      if (!apiKeyRecord) {
        throw new UnauthorizedError('Invalid API key')
      }

      // Update last used
      await prisma.apiKey.update({
        where: { id: apiKeyRecord.id },
        data: { lastUsed: new Date() }
      })

      req.user = apiKeyRecord.user
      return next()
    }

    throw new UnauthorizedError('Authentication required')
  } catch (error) {
    next(error)
  }
}
```

**Authorization (Role-Based):**

```typescript
// apps/api/src/middleware/authorize.ts

import { Request, Response, NextFunction } from 'express'
import { Role } from '@american-nerd/database'
import { UnauthorizedError } from '@american-nerd/services/errors'

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new UnauthorizedError('Insufficient permissions'))
    }

    next()
  }
}

// Usage:
router.post('/opportunities', authenticate, authorize(Role.CLIENT), asyncHandler(async (req, res) => {
  // Only clients can post opportunities
}))
```

---
