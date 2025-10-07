/**
 * Twitter Integration Example
 *
 * Demonstrates direct SDK integration with twitter-api-v2 for AI agent social presence
 *
 * Prerequisites:
 * - Twitter Developer account with Basic tier ($200/month)
 * - OAuth 1.0a credentials (API Key, Secret, Access Token, Access Token Secret)
 * - npm install twitter-api-v2 @twitter-api-v2/plugin-rate-limit
 */

import { TwitterApi, TweetV2PostTweetResult, UserV2 } from 'twitter-api-v2';
import { TwitterApiRateLimitPlugin } from '@twitter-api-v2/plugin-rate-limit';

// ============================================================================
// Configuration
// ============================================================================

interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

// Load from environment variables
const config: TwitterConfig = {
  apiKey: process.env.TWITTER_API_KEY!,
  apiSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
};

// ============================================================================
// Twitter Service
// ============================================================================

export class TwitterService {
  private client: TwitterApi;
  private readWriteClient: TwitterApi;
  private rateLimitPlugin: TwitterApiRateLimitPlugin;

  constructor(config: TwitterConfig) {
    // Initialize rate limit plugin for tracking
    this.rateLimitPlugin = new TwitterApiRateLimitPlugin();

    // Create Twitter client with OAuth 1.0a credentials
    this.client = new TwitterApi(
      {
        appKey: config.apiKey,
        appSecret: config.apiSecret,
        accessToken: config.accessToken,
        accessSecret: config.accessTokenSecret,
      },
      {
        plugins: [this.rateLimitPlugin],
      }
    );

    this.readWriteClient = this.client.readWrite;
  }

  /**
   * Post a tweet with optional media
   *
   * @param text - Tweet content (max 280 characters)
   * @param mediaPath - Optional path to media file (image, video, GIF)
   * @returns Tweet object with ID and metadata
   *
   * @example
   * await twitterService.postTweet('🤖 Milestone completed!');
   * await twitterService.postTweet('🏆 Achievement unlocked!', './badge.png');
   */
  async postTweet(text: string, mediaPath?: string): Promise<TweetV2PostTweetResult> {
    // Validate tweet length
    if (text.length > 280) {
      throw new Error(`Tweet exceeds 280 characters: ${text.length}`);
    }

    try {
      // Check rate limit before posting
      await this.checkRateLimit('tweets', '/2/tweets');

      // Upload media if provided (uses v1.1 API)
      if (mediaPath) {
        const mediaId = await this.client.v1.uploadMedia(mediaPath);
        return await this.readWriteClient.v2.tweet(text, {
          media: { media_ids: [mediaId] },
        });
      }

      // Post text-only tweet (uses v2 API)
      return await this.readWriteClient.v2.tweet(text);
    } catch (error: any) {
      if (error.code === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`Failed to post tweet: ${error.message}`);
    }
  }

  /**
   * Get user profile metrics (followers, following, tweet count)
   *
   * @param username - Twitter username (without @)
   * @returns User object with public metrics
   *
   * @example
   * const user = await twitterService.getUserMetrics('ai_agent_persona');
   * console.log(`Followers: ${user.public_metrics?.followers_count}`);
   */
  async getUserMetrics(username: string): Promise<UserV2> {
    try {
      const result = await this.client.v2.userByUsername(username, {
        'user.fields': ['public_metrics', 'created_at', 'description', 'verified'],
      });

      return result.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch user metrics: ${error.message}`);
    }
  }

  /**
   * Post a thread (multiple connected tweets)
   *
   * @param tweets - Array of tweet texts (each max 280 chars)
   * @returns Array of tweet IDs
   *
   * @example
   * await twitterService.postThread([
   *   '🧵 Thread: How we built the American Nerd Marketplace (1/3)',
   *   '✨ Step 1: AI agents execute BMAD workflows autonomously... (2/3)',
   *   '🚀 Step 2: Human experts validate and collect payments via escrow (3/3)'
   * ]);
   */
  async postThread(tweets: string[]): Promise<string[]> {
    const tweetIds: string[] = [];
    let replyToId: string | undefined;

    for (const text of tweets) {
      // Validate each tweet length
      if (text.length > 280) {
        throw new Error(`Tweet ${tweetIds.length + 1} exceeds 280 characters: ${text.length}`);
      }

      // Post tweet (reply to previous if part of thread)
      const tweetOptions = replyToId ? { reply: { in_reply_to_tweet_id: replyToId } } : {};
      const result = await this.readWriteClient.v2.tweet(text, tweetOptions);

      tweetIds.push(result.data.id);
      replyToId = result.data.id;

      // Rate limit: Wait 2 seconds between thread tweets
      await this.sleep(2000);
    }

    return tweetIds;
  }

  /**
   * Get follower count for reputation system
   *
   * @param username - Twitter username
   * @returns Number of followers
   *
   * @example
   * const followers = await twitterService.getFollowerCount('ai_agent_persona');
   * await reputationService.updateSocialProof(agentId, followers);
   */
  async getFollowerCount(username: string): Promise<number> {
    const user = await this.getUserMetrics(username);
    return user.public_metrics?.followers_count ?? 0;
  }

  /**
   * Like a tweet (for engagement)
   *
   * @param tweetId - ID of tweet to like
   * @returns Success status
   *
   * @example
   * await twitterService.likeTweet('1234567890123456789');
   */
  async likeTweet(tweetId: string): Promise<void> {
    try {
      const authenticatedUserId = await this.getAuthenticatedUserId();
      await this.readWriteClient.v2.like(authenticatedUserId, tweetId);
    } catch (error: any) {
      throw new Error(`Failed to like tweet: ${error.message}`);
    }
  }

  /**
   * Retweet a tweet (for engagement)
   *
   * @param tweetId - ID of tweet to retweet
   * @returns Success status
   *
   * @example
   * await twitterService.retweet('1234567890123456789');
   */
  async retweet(tweetId: string): Promise<void> {
    try {
      const authenticatedUserId = await this.getAuthenticatedUserId();
      await this.readWriteClient.v2.retweet(authenticatedUserId, tweetId);
    } catch (error: any) {
      throw new Error(`Failed to retweet: ${error.message}`);
    }
  }

  /**
   * Check rate limit status before making API call
   *
   * @param category - Rate limit category (e.g., 'tweets', 'users')
   * @param endpoint - API endpoint path
   * @throws Error if rate limit is critically low
   */
  private async checkRateLimit(category: string, endpoint: string): Promise<void> {
    try {
      const rateLimit = await this.rateLimitPlugin.v2.getRateLimit(category, endpoint);

      if (rateLimit.remaining < 5) {
        const resetDate = new Date(rateLimit.reset * 1000);
        throw new Error(
          `Rate limit critically low: ${rateLimit.remaining}/${rateLimit.limit}. Resets at ${resetDate.toISOString()}`
        );
      }

      // Warn if approaching limit
      if (rateLimit.remaining < 20) {
        console.warn(
          `⚠️  Rate limit warning: ${rateLimit.remaining}/${rateLimit.limit} remaining. Resets at ${new Date(rateLimit.reset * 1000).toISOString()}`
        );
      }
    } catch (error: any) {
      // Rate limit info not available, proceed with caution
      console.warn('Unable to check rate limit:', error.message);
    }
  }

  /**
   * Get authenticated user ID for likes/retweets
   */
  private async getAuthenticatedUserId(): Promise<string> {
    const me = await this.client.v2.me();
    return me.data.id;
  }

  /**
   * Utility: Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// AI Agent Social Posting Workflow
// ============================================================================

export interface MilestoneEvent {
  agentId: string;
  agentUsername: string;
  title: string;
  description: string;
  qualityScore: number;
  timeAhead: number; // minutes (positive = ahead, negative = late)
  timestamp: Date;
}

export class SocialPostingWorkflow {
  private twitterService: TwitterService;

  constructor(twitterService: TwitterService) {
    this.twitterService = twitterService;
  }

  /**
   * Post milestone update when AI agent completes a task
   *
   * @param event - Milestone event from agent execution
   *
   * @example
   * await workflow.handleMilestoneCompleted({
   *   agentId: 'agent-123',
   *   agentUsername: 'ai_agent_persona',
   *   title: 'User Authentication System',
   *   description: 'Completed OAuth 2.0 integration with JWT tokens',
   *   qualityScore: 9,
   *   timeAhead: 120, // 2 hours ahead of schedule
   *   timestamp: new Date()
   * });
   */
  async handleMilestoneCompleted(event: MilestoneEvent): Promise<void> {
    try {
      // Generate tweet text
      const tweetText = this.generateMilestoneTweet(event);

      // Post to Twitter
      const result = await this.twitterService.postTweet(tweetText);
      console.log(`✅ Posted milestone tweet: ${result.data.id}`);

      // Update agent reputation with follower count (async)
      this.updateAgentReputation(event.agentId, event.agentUsername).catch((error) => {
        console.error('Failed to update reputation:', error);
      });
    } catch (error: any) {
      console.error('Failed to post milestone update:', error.message);
      // Don't throw - social posting failures shouldn't break workflow
    }
  }

  /**
   * Generate tweet text for milestone completion
   */
  private generateMilestoneTweet(event: MilestoneEvent): string {
    const emoji = this.getEmoji(event.qualityScore);
    const timeEmoji = event.timeAhead > 0 ? '⚡' : '✅';

    return `${emoji} Milestone completed: ${event.title}

✅ ${event.description}
${timeEmoji} ${this.formatTimeDelta(event.timeAhead)}
🎯 Quality: ${event.qualityScore}/10

#AI #FreelanceAutomation #BMADWorkflow`;
  }

  /**
   * Update agent reputation with social proof metrics
   */
  private async updateAgentReputation(agentId: string, username: string): Promise<void> {
    const followerCount = await this.twitterService.getFollowerCount(username);
    console.log(`📊 Agent ${agentId} has ${followerCount} followers`);

    // TODO: Integrate with reputation service
    // await reputationService.updateSocialProof(agentId, {
    //   platform: 'twitter',
    //   followers: followerCount,
    //   lastUpdated: new Date()
    // });
  }

  /**
   * Get emoji based on quality score
   */
  private getEmoji(score: number): string {
    if (score >= 9) return '🏆';
    if (score >= 7) return '✨';
    return '🤖';
  }

  /**
   * Format time delta for tweet
   */
  private formatTimeDelta(minutes: number): string {
    if (minutes > 0) {
      const hours = Math.floor(minutes / 60);
      return hours > 0 ? `${hours}h ahead of schedule` : `${minutes}m ahead`;
    } else if (minutes < 0) {
      const hours = Math.floor(Math.abs(minutes) / 60);
      return hours > 0 ? `${hours}h delayed` : 'on time';
    }
    return 'on time';
  }
}

// ============================================================================
// Usage Example
// ============================================================================

async function main() {
  // Initialize Twitter service
  const twitterService = new TwitterService(config);

  // Initialize workflow
  const workflow = new SocialPostingWorkflow(twitterService);

  // Example 1: Simple tweet
  console.log('📤 Posting simple tweet...');
  const tweet = await twitterService.postTweet('🤖 American Nerd Marketplace is live! AI agents are now executing BMAD workflows autonomously.');
  console.log(`✅ Tweet posted: https://twitter.com/i/web/status/${tweet.data.id}`);

  // Example 2: Get user metrics
  console.log('\n📊 Fetching user metrics...');
  const user = await twitterService.getUserMetrics('ai_agent_persona');
  console.log(`Followers: ${user.public_metrics?.followers_count}`);
  console.log(`Following: ${user.public_metrics?.following_count}`);
  console.log(`Tweets: ${user.public_metrics?.tweet_count}`);

  // Example 3: Post milestone update
  console.log('\n🎯 Posting milestone update...');
  await workflow.handleMilestoneCompleted({
    agentId: 'agent-123',
    agentUsername: 'ai_agent_persona',
    title: 'User Authentication System',
    description: 'Completed OAuth 2.0 integration with JWT tokens',
    qualityScore: 9,
    timeAhead: 120,
    timestamp: new Date(),
  });

  // Example 4: Post thread
  console.log('\n🧵 Posting thread...');
  const threadIds = await twitterService.postThread([
    '🧵 How we built the American Nerd Marketplace (1/4)',
    '✨ Step 1: AI agents execute BMAD workflows autonomously, handling planning, development, and QA phases (2/4)',
    '🤝 Step 2: Human experts validate agent work and provide quality control when needed (3/4)',
    '🚀 Step 3: Escrow-protected payments ensure trust between clients and experts. Try it today! (4/4)',
  ]);
  console.log(`✅ Thread posted: ${threadIds.length} tweets`);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { TwitterService, SocialPostingWorkflow };
