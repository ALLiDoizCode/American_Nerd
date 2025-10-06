# 10. Frontend Architecture

## 10.1 Framework and Core Libraries

**Next.js 14 with App Router**
- **Server Components by default**: Faster initial page loads, reduced client JS
- **Client Components for interactivity**: Forms, toasts, client state
- **Streaming**: Incremental page rendering with React Suspense
- **Route handlers**: API routes for frontend-specific data transformations

**React 18**
- **Concurrent rendering**: Automatic batching, transitions
- **Server Components**: Fetch data on server, ship HTML
- **Suspense**: Progressive loading with fallback UI

**TypeScript 5.3**
- **Strict mode enabled**: Catch errors at compile time
- **Shared types**: Import types from `@american-nerd/database` (Prisma)

## 10.2 Component Organization

```
apps/web/src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Dashboard layout group
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # Project detail
│   │   │   │   └── review/
│   │   │   │       └── page.tsx  # Story review
│   │   │   └── new/
│   │   │       └── page.tsx      # Create project
│   │   ├── opportunities/
│   │   │   ├── page.tsx          # Opportunity list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Opportunity detail
│   │   │   └── new/
│   │   │       └── page.tsx      # Post opportunity
│   │   ├── stories/
│   │   │   ├── page.tsx          # Story list
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Story detail
│   │   │       └── review/
│   │   │           └── page.tsx  # QA review
│   │   └── dashboard/
│   │       └── page.tsx          # User dashboard
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ui/                       # shadcn-ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── opportunities/
│   │   ├── OpportunityCard.tsx
│   │   ├── OpportunityList.tsx
│   │   └── BidForm.tsx
│   ├── stories/
│   │   ├── StoryCard.tsx
│   │   ├── StoryList.tsx
│   │   └── StoryReviewForm.tsx
│   └── shared/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ErrorBoundary.tsx
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useOpportunities.ts
│   ├── useStories.ts
│   └── useMutation.ts
├── lib/                          # Utilities and config
│   ├── api-client.ts             # ky HTTP client
│   ├── metrics.ts                # Client-side metrics
│   └── utils.ts                  # Helper functions
├── stores/                       # Zustand stores
│   └── auth-store.ts
└── styles/
    └── globals.css               # Global styles + Tailwind

```

## 10.3 State Management

**React Context for Global State:**
- `AuthContext`: User session, login/logout

**Zustand for Complex State:**
- Used sparingly, only when Context causes too many re-renders
- Example: Future consideration for dark mode if Front-End Spec resolves positively

**Server State with SWR Pattern:**
- Custom hooks (`useOpportunities`, `useStories`) fetch and cache API data
- No global state needed - each component fetches own data

## 10.4 Routing and Navigation

**File-Based Routing (App Router):**

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Landing page with hero, features |
| `/login` | `app/(auth)/login/page.tsx` | GitHub OAuth login |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | User dashboard (role-specific) |
| `/projects` | `app/(dashboard)/projects/page.tsx` | Project list (clients) |
| `/projects/[id]` | `app/(dashboard)/projects/[id]/page.tsx` | Project detail |
| `/opportunities` | `app/(dashboard)/opportunities/page.tsx` | Opportunity marketplace |
| `/opportunities/[id]` | `app/(dashboard)/opportunities/[id]/page.tsx` | Opportunity detail |
| `/stories` | `app/(dashboard)/stories/page.tsx` | Story list (devs/QA) |
| `/stories/[id]/review` | `app/(dashboard)/stories/[id]/review/page.tsx` | QA review interface |

**Protected Routes:**

```typescript
// apps/web/src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/opportunities/:path*', '/stories/:path*']
}
```

## 10.5 Services Layer (API Client)

```typescript
// apps/web/src/lib/api-client.ts

import ky, { HTTPError } from 'ky'
import { toast } from 'sonner'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public field?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const apiClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            error: 'An unexpected error occurred'
          }))

          throw new ApiError(
            errorData.error,
            response.status,
            errorData.field
          )
        }
      }
    ]
  }
})

// Example service hook
export function useOpportunities(stage?: string) {
  const [data, setData] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const opportunities = await apiClient
          .get('opportunities', { searchParams: stage ? { stage } : undefined })
          .json<Opportunity[]>()

        setData(opportunities)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch'))
        toast.error('Failed to load opportunities')
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [stage])

  return { data, loading, error }
}
```

---
