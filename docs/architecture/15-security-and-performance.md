# 15. Security and Performance

## 15.1 Security Requirements

**Frontend Security:**

- **CSP Headers:**
  ```typescript
  // apps/web/next.config.js
  const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https://api.americannerd.com https://*.supabase.co;
  `

  module.exports = {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
            }
          ]
        }
      ]
    }
  }
  ```

- **XSS Prevention:** React auto-escapes, use `dangerouslySetInnerHTML` sparingly
- **CSRF Protection:** SameSite cookies, CSRF tokens for state-changing operations

**Backend Security:**

- **Rate Limiting:**
  ```typescript
  // apps/api/src/middleware/rate-limit.ts
  import rateLimit from 'express-rate-limit'
  import RedisStore from 'rate-limit-redis'
  import { redis } from '../utils/redis'

  export const apiLimiter = rateLimit({
    store: new RedisStore({ client: redis, prefix: 'rl:' }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 min
    message: 'Too many requests, please try again later'
  })
  ```

- **JWT Tokens:** 15-minute expiry, refresh token rotation
- **Input Validation:** Zod schemas for all API inputs
- **SQL Injection Prevention:** Prisma parameterized queries
- **Secrets Management:** Environment variables, never committed

**Smart Contract Security:**

- **ReentrancyGuard:** Prevents reentrancy attacks on escrow release
- **OpenZeppelin Contracts:** Battle-tested, audited libraries
- **Access Control:** Only client can release, only platform can refund
- **Check-Effects-Interactions:** State updated before external calls

## 15.2 Performance Requirements

**Frontend Performance:**

- **Core Web Vitals Targets:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

- **Bundle Size Optimization:**
  ```typescript
  // apps/web/next.config.js
  module.exports = {
    experimental: {
      optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
    }
  }
  ```

- **Dynamic Imports:**
  ```typescript
  const BidForm = dynamic(() => import('@/components/opportunities/BidForm'), {
    loading: () => <Skeleton />,
    ssr: false
  })
  ```

**Backend Performance:**

- **Response Time Target:** P95 < 500ms for API calls
- **Database Optimization:**
  - Indexes on frequently queried fields
  - Connection pooling (max 20 connections)
  - N+1 query prevention with Prisma `include`

- **Redis Caching:**
  ```typescript
  // packages/services/src/cache-service.ts
  export class CacheService {
    static async get<T>(key: string): Promise<T | null> {
      const cached = await redis.get(key)
      return cached ? JSON.parse(cached) : null
    }

    static async set(key: string, value: any, ttl: number = 60) {
      await redis.setex(key, ttl, JSON.stringify(value))
    }

    static async delete(key: string) {
      await redis.del(key)
    }
  }
  ```

- **Cursor-Based Pagination:**
  ```typescript
  const opportunities = await prisma.opportunity.findMany({
    take: 20,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' }
  })
  ```

---
