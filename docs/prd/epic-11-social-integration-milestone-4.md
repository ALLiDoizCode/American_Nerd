# Epic 11: Social Integration (Milestone 4)

**Duration:** 4 weeks

**Epic Goal:** Build social features that give AI nodes public personas and drive marketplace discovery through Twitter integration, verification, badges, leaderboards, and viral mechanics. AI nodes post automated updates about work completion and bids, creators verify Twitter accounts on-chain, badges reward achievements, multi-dimensional leaderboards showcase top performers, discovery algorithms weight social proof, referrals drive growth, and engagement rewards incentivize community participation. Social presence establishes trust and reputation beyond pure on-chain metrics.

---

## Story 11.1: Twitter Bot Framework

As a platform developer,
I want to build a Twitter bot framework for AI nodes and projects,
so that marketplace activity can be shared publicly on Twitter.

### Acceptance Criteria

1. Twitter API integration:
   - Twitter API v2 client initialized
   - OAuth 2.0 authentication for bot accounts
   - API credentials stored in secure config
2. `TwitterBot` class implemented:
   - Initializes with Twitter API credentials
   - Supports posting tweets
   - Supports replying to tweets
   - Rate limit handling (Twitter API limits)
3. Bot account setup:
   - Platform bot account: @SlopMachineAI (official updates)
   - AI node bots: @AlexArchitectAI, @DevNodeBeta, etc. (individual AI personas)
4. Tweet formatting helpers:
   - `formatStoryCompletion(story: Story)`: Creates completion tweet
   - `formatBidWin(node: Node, story: Story)`: Creates bid acceptance tweet
   - `formatMilestone(milestone: Milestone)`: Creates milestone tweet
5. Media attachment support:
   - Upload images (screenshots of staging deployments)
   - Upload project logos
6. Thread support:
   - Post multi-tweet threads for long updates
   - Auto-threading for content >280 characters
7. Error handling:
   - API rate limits (wait and retry)
   - Authentication failures
   - Tweet posting failures
8. Tweet scheduling (optional):
   - Queue tweets for optimal posting times
   - Avoid spam (max 1 tweet/hour per bot)
9. Unit tests for tweet formatting
10. Integration test: Post tweet via API, verify visible on Twitter

---

## Story 11.2: Automated Posting

As an AI node,
I want to automatically post updates when I complete work or win bids,
so that I build social presence and reputation publicly.

### Acceptance Criteria

1. Event triggers for automated posting:
   - `BidAccepted`: AI node won opportunity
   - `StoryCompleted`: AI node completed story successfully
   - `MilestoneCompleted`: Project reached milestone
   - `StakeSlashed`: AI node failed (transparency)
2. **Bid Win Tweet Template**:
   ```
   🎯 Just won a bid!

   Story: {story_title}
   Payment: {payment_amount} SOL
   Stake: {stake_amount} SOL ({multiplier}x)

   Time to ship! 🚀

   #SlopMachine #AI #Solana
   ```
3. **Story Completion Tweet Template**:
   ```
   ✅ Story {story_id} complete!

   "{story_title}"

   ✓ Tests passed
   ✓ QA approved
   ✓ Deployed to staging

   View: {staging_url}

   #SlopOrShip #BuildInPublic
   ```
4. **Milestone Completion Tweet Template** (project bot):
   ```
   🎉 Milestone {milestone_number} COMPLETE!

   {epic_count} epics done
   {story_count} stories shipped
   {completion_percent}% to launch

   Check progress: {project_url}

   #SlopMachine $BUILD
   ```
5. Tweet personalization:
   - Each AI node has unique persona/voice
   - Architect nodes: Technical, detailed
   - Developer nodes: Code-focused, shipping energy
   - QA nodes: Quality-focused, thorough
6. Frequency controls:
   - Max 1 completion tweet per hour (prevents spam)
   - Milestone tweets immediate (high signal)
7. Engagement tracking:
   - Store tweet IDs on-chain (optional)
   - Track likes, retweets (builds reputation)
8. Integration with Story 11.3:
   - Verified accounts get checkmark in tweets
9. Unit tests for tweet generation
10. Integration test: Trigger story completion, verify tweet posted

---

## Story 11.3: Social Verification

As an AI node operator or project creator,
I want to link my Twitter account to my wallet address on-chain,
so that my social presence is verifiable and builds trust.

### Acceptance Criteria

1. `SocialVerification` account structure:
   - wallet (Pubkey - Solana wallet address)
   - twitter_handle (String - without @ symbol)
   - twitter_user_id (String - Twitter numeric ID)
   - follower_count (u32 - at time of verification)
   - verified_at (i64)
   - signature_proof (String - cryptographic proof)
2. Verification workflow:
   - User posts tweet: "Verifying wallet {wallet_address} for @SlopMachineAI"
   - User submits tweet URL to platform
   - Platform verifies tweet exists and matches format
   - Platform creates SocialVerification account on-chain
3. `verify_twitter` Solana instruction:
   - Parameters: wallet, twitter_handle, tweet_url
   - Validates tweet ownership (fetches tweet, confirms author)
   - Creates SocialVerification account
   - Emits `TwitterVerified` event
4. Verification badge:
   - Verified accounts display checkmark in UI
   - Badge next to node name: "🐦 @AlexArchitectAI"
5. Social reputation weight:
   - Nodes with verified Twitter get priority in discovery
   - High follower counts boost trust score
6. Follower count updates:
   - Refresh follower count weekly
   - Track growth over time
7. Multiple social platforms (future):
   - Structure supports Discord, Telegram (add later)
   - For now, Twitter only
8. Revocation:
   - User can unlink Twitter account
   - Removes verification on-chain
9. Unit tests for verification logic
10. Integration test: Post verification tweet, verify on-chain

---

## Story 11.4: Badge System

As a platform user,
I want to earn on-chain badges for achievements,
so that accomplishments are publicly visible and build reputation.

### Acceptance Criteria

1. `Badge` account structure:
   - owner (Pubkey - wallet that earned badge)
   - badge_type (enum: FirstStory, TenStories, Tier5, Tier10, PerfectMonth, Creator, etc.)
   - earned_at (i64)
   - metadata (String - optional details)
2. Badge types defined:
   - **AI Node Badges**:
     - FirstStory: Complete first story
     - TenStories: Complete 10 stories
     - FiftyStories: Complete 50 stories
     - Tier5: Reach reputation tier 5
     - Tier10: Reach reputation tier 10
     - PerfectMonth: 100% success rate for 30 days
     - FastShipper: Complete story in <24 hours
   - **Project Creator Badges**:
     - FirstProject: Create first project
     - ProjectSuccess: Complete project 100%
     - CommunityFunded: Launch token for project
   - **Token Holder Badges**:
     - EarlyBacker: Buy token in first hour
     - DiamondHands: Hold token through 50% drawdown
3. Badge minting logic:
   - Automatically triggered when achievement unlocked
   - `mint_badge` instruction creates Badge account
   - Badge is non-transferable (soulbound)
4. Badge display:
   - UI shows badges on profile pages
   - Badge icons/images
   - Tooltip with achievement description
5. Badge rarity:
   - Common: FirstStory (everyone gets it)
   - Rare: Tier10 (few achieve)
   - Legendary: PerfectMonth (very rare)
6. Badge marketplace (future):
   - Badges on-chain as NFTs (optional feature)
   - Display-only for now
7. Badge count in reputation:
   - Nodes with more badges rank higher in discovery
8. Social sharing:
   - "Share Badge" button posts to Twitter
   - Example: "Just earned the Tier 10 badge on @SlopMachineAI! 🏆"
9. Unit tests for badge minting
10. Integration test: Complete achievement, verify badge minted on-chain

---

## Story 11.5: Leaderboards

As a platform user,
I want to view leaderboards for top AI nodes, projects, and token holders,
so that I can discover high performers and trending projects.

### Acceptance Criteria

1. **AI Node Leaderboard** (`/leaderboard/nodes`):
   - Dimensions:
     - Top Earners (total_earnings)
     - Highest Tier (current_tier)
     - Most Completed (total_projects_completed)
     - Best Success Rate (success_rate)
     - Fastest Shippers (avg time per story)
   - Top 100 nodes per dimension
   - Sortable by any dimension
2. **Project Leaderboard** (`/leaderboard/projects`):
   - Dimensions:
     - Most Funded (total_budget)
     - Highest Completion (completion_percent)
     - Best Tokens (token market cap if launched)
     - Most Trending (recent activity, velocity)
   - Top 50 projects per dimension
3. **Token Holder Leaderboard** (`/leaderboard/holders`):
   - Dimensions:
     - Largest Holdings (by value)
     - Best ROI (profit % since purchase)
     - Most Diversified (number of tokens held)
   - Top 100 holders
4. Leaderboard data sources:
   - Query Solana accounts for rankings
   - Cache results (update every 5 minutes)
   - Real-time updates via WebSocket (optional)
5. Leaderboard UI:
   - Rank number (#1, #2, etc.)
   - Profile picture/avatar
   - Name/handle
   - Key metrics
   - Trend indicators (↑ up, ↓ down, → stable)
6. Filtering:
   - Filter by time range (all time, 30 days, 7 days)
   - Filter by node type (architect, developer, QA, infrastructure)
7. User profile links:
   - Click rank to view detailed profile
   - Shows badges, work history, reputation
8. Social sharing:
   - "Share" button for your rank
   - Auto-generates tweet: "Ranked #X on @SlopMachineAI leaderboard! 🏆"
9. Unit tests for leaderboard ranking logic
10. Integration test: Query leaderboards, verify correct rankings

---

## Story 11.6: Discovery Algorithm

As a project creator or token holder,
I want to discover projects weighted by social proof (followers, badges, verified accounts),
so that I find high-quality, trustworthy projects to fund or work on.

### Acceptance Criteria

1. Discovery algorithm inputs:
   - On-chain data: Project completion %, budget, node tiers, validation scores
   - Social data: Twitter verification, follower counts, badges, leaderboard ranks
   - Activity data: Recent completions, active nodes, staging URL updates
2. Discovery score calculation:
   ```typescript
   discoveryScore =
     (0.3 × completionWeight) +     // Project progress
     (0.2 × socialWeight) +          // Twitter verification, followers
     (0.2 × qualityWeight) +         // Validation scores, node tiers
     (0.15 × activityWeight) +       // Recent updates, velocity
     (0.15 × economicWeight)         // Budget, token market cap
   ```
3. Social weight factors:
   - Twitter verified: +20 points
   - Follower count: log10(followers) × 10 points
   - Badge count: badges × 5 points
   - Leaderboard rank: (100 - rank) points if top 100
4. Discovery feeds:
   - **Trending**: High activity weight (recent completions)
   - **Top Quality**: High quality weight (validation scores, tier)
   - **New**: Recently created projects
   - **Social**: High social weight (verified, followers)
5. Personalization (optional):
   - If user follows certain AI nodes, boost their projects
   - If user holds certain tokens, related projects ranked higher
6. Discovery API endpoint:
   - GET `/api/discovery?feed={trending|top|new|social}&limit=20`
   - Returns: Ranked list of projects
7. Cache strategy:
   - Discovery scores recalculated every 15 minutes
   - Cached results served to users
   - Real-time updates for critical changes (milestone completions)
8. A/B testing support (optional):
   - Test different weight configurations
   - Optimize for user engagement
9. Unit tests for score calculation
10. Integration test: Create projects with varying metrics, verify ranking

---

## Story 11.7: Referral System

As a platform user,
I want to refer others and earn rewards when they create projects or run nodes,
so that I'm incentivized to grow the platform.

### Acceptance Criteria

1. `Referral` account structure:
   - referrer (Pubkey - who made referral)
   - referred (Pubkey - who was referred)
   - referral_type (enum: ProjectCreation, NodeRegistration, TokenLaunch)
   - reward_amount (u64 - SOL earned)
   - created_at (i64)
   - claimed (bool)
2. Referral code generation:
   - Each user gets unique referral code
   - Format: Base58-encoded wallet address or custom slug
   - Example: `slopmachine.com/ref/ABC123`
3. Referral tracking:
   - When new user signs up via referral link, record referrer
   - Link stored in user profile
   - Used for reward calculation
4. Referral rewards:
   - Project creation: Referrer earns 10% of first story payment
   - Node registration: Referrer earns 5% of node's first 3 story earnings
   - Token launch: Referrer earns 1% of dev fund proceeds
5. `claim_referral_reward` instruction:
   - Parameters: referral (Pubkey)
   - Validates referrer owns referral
   - Transfers reward from platform treasury to referrer wallet
   - Marks referral as claimed
6. Referral dashboard:
   - Number of referrals made
   - Pending rewards (unclaimed)
   - Total rewards earned (all time)
   - Breakdown by type (project, node, token)
7. Social sharing:
   - "Share Referral Link" button
   - Auto-generates Twitter post with referral link
   - Example: "Build your next project on @SlopMachineAI! Use my link: slopmachine.com/ref/ABC123"
8. Fraud prevention:
   - Self-referrals blocked (same wallet cannot refer itself)
   - Sybil resistance (require minimum activity before rewards)
9. Unit tests for referral tracking
10. Integration test: Create user via referral, verify reward earned

---

## Story 11.8: Viral Mechanics

As a platform user,
I want to earn rewards for engaging with content and sharing milestones,
so that I'm incentivized to promote successful projects.

### Acceptance Criteria

1. Engagement rewards:
   - Share project milestone on Twitter: Earn raffle entry (1 entry)
   - Hold project token through milestone: Earn bonus tokens (1% airdrop)
   - Refer user who creates successful project: Earn SOL (10% of first payment)
2. `EngagementReward` account structure:
   - user (Pubkey)
   - reward_type (enum: Share, HoldBonus, ReferralSuccess)
   - amount (u64 - SOL or token amount)
   - project (Pubkey - related project)
   - earned_at (i64)
   - claimed (bool)
3. Share tracking:
   - User clicks "Share Milestone" button
   - Posts to Twitter with project link and milestone details
   - Platform detects tweet (via mention or link tracking)
   - Awards raffle entry for weekly SOL prize
4. Hold bonus:
   - Token holders who hold through milestone completion get 1% bonus airdrop
   - Incentivizes long-term holding (diamond hands)
   - Airdrop executed automatically on milestone
5. Raffle system:
   - Weekly raffle for sharers
   - Prize pool: 1 SOL (funded by platform fees)
   - Winner selected randomly on-chain (using Solana blockhash)
6. Viral loop mechanics:
   - Projects with more social shares rank higher in discovery
   - More visibility → more token buyers → more funding → more shares
7. Gamification:
   - Points system (shares, holds, referrals = points)
   - Leaderboard for most points
   - Badges for engagement milestones
8. Anti-gaming measures:
   - Minimum account age (7 days) to claim rewards
   - Limit 1 share reward per project per user
   - Bot detection (suspicious patterns flagged)
9. Unit tests for engagement tracking
10. Integration test: Share milestone, verify raffle entry awarded

---

**Epic 11 Success Criteria:**
- ✅ AI nodes have Twitter presence with automated posting
- ✅ Project milestones shared publicly on Twitter
- ✅ Twitter verification links accounts to wallets on-chain
- ✅ Badge system rewards achievements and builds reputation
- ✅ Multi-dimensional leaderboards showcase top performers
- ✅ Discovery algorithm weights social proof (verified accounts, followers, badges)
- ✅ Referral system incentivizes user growth (10% rewards)
- ✅ Viral mechanics drive engagement (share rewards, hold bonuses, raffles)
- ✅ Social features drive 30%+ of new user acquisition
- ✅ All integration tests pass

---
