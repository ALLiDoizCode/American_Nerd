/**
 * Discord Integration Example for American Nerd Marketplace
 *
 * This example demonstrates integration with Discord MCP server
 * (barryyip0625/mcp-discord) for project notifications and community engagement.
 *
 * Use Case: AI agents post milestone updates, story completions, and QA reviews
 * to project-specific Discord channels.
 */

import { MCPClient } from '@anthropic-ai/sdk';

// =============================================================================
// Discord Service Implementation
// =============================================================================

export interface StoryDetails {
  title: string;
  description: string;
  developer: string;
  qaScore: number;
}

export interface MilestoneDetails {
  milestone: 'architecture' | 'planning' | 'development' | 'qa' | 'delivery';
  projectName: string;
  completedAt: Date;
}

export class DiscordService {
  private mcpClient: MCPClient;

  constructor() {
    this.mcpClient = new MCPClient({
      serverUrl: process.env.DISCORD_MCP_URL || 'http://localhost:3000',
      auth: {
        botToken: process.env.DISCORD_BOT_TOKEN
      }
    });
  }

  /**
   * Post simple project update to Discord channel
   *
   * @param channelId - Discord channel ID (right-click channel → Copy ID)
   * @param message - Text message to post
   */
  async postProjectUpdate(
    channelId: string,
    message: string
  ): Promise<void> {
    await this.mcpClient.callTool('discord_send_message', {
      channelId,
      content: message
    });
  }

  /**
   * Announce story completion with rich embed
   *
   * @param channelId - Discord channel ID
   * @param storyId - Story identifier
   * @param details - Story metadata (title, developer, QA score)
   */
  async announceStoryCompletion(
    channelId: string,
    storyId: number,
    details: StoryDetails
  ): Promise<void> {
    const embed = {
      title: `✅ Story #${storyId} Completed`,
      description: details.description,
      color: 0x00ff00, // Green
      fields: [
        { name: 'Title', value: details.title, inline: false },
        { name: 'Developer', value: details.developer, inline: true },
        { name: 'QA Score', value: `${details.qaScore}/100`, inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    await this.mcpClient.callTool('discord_send_message', {
      channelId,
      content: '', // Embed-only message
      embeds: [embed]
    });
  }

  /**
   * Post milestone announcement (Architecture, Planning, etc.)
   *
   * @param channelId - Discord channel ID
   * @param details - Milestone metadata
   */
  async announceMilestone(
    channelId: string,
    details: MilestoneDetails
  ): Promise<void> {
    const emojis = {
      architecture: '🏗️',
      planning: '📋',
      development: '💻',
      qa: '🔍',
      delivery: '🚀'
    };

    const colors = {
      architecture: 0x0099ff, // Blue
      planning: 0xff9900,     // Orange
      development: 0x9900ff,  // Purple
      qa: 0xffcc00,           // Yellow
      delivery: 0x00ff00      // Green
    };

    const embed = {
      title: `${emojis[details.milestone]} ${details.milestone.toUpperCase()} Milestone Completed`,
      description: `Project: **${details.projectName}**`,
      color: colors[details.milestone],
      fields: [
        {
          name: 'Completed',
          value: details.completedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          inline: false
        }
      ],
      timestamp: new Date().toISOString()
    };

    await this.mcpClient.callTool('discord_send_message', {
      channelId,
      embeds: [embed]
    });
  }

  /**
   * Create forum post for project discussion
   *
   * @param forumChannelId - Discord forum channel ID
   * @param projectId - Project identifier
   * @param title - Forum post title
   * @param content - Forum post content (markdown supported)
   */
  async createProjectForumPost(
    forumChannelId: string,
    projectId: number,
    title: string,
    content: string
  ): Promise<void> {
    await this.mcpClient.callTool('discord_create_forum_post', {
      channelId: forumChannelId,
      name: `[Project #${projectId}] ${title}`,
      message: content
    });
  }

  /**
   * Post QA review results with pass/fail status
   *
   * @param channelId - Discord channel ID
   * @param storyId - Story identifier
   * @param qaResults - QA review metadata
   */
  async postQAReview(
    channelId: string,
    storyId: number,
    qaResults: {
      reviewer: string;
      status: 'passed' | 'failed';
      score: number;
      feedback: string;
    }
  ): Promise<void> {
    const statusEmoji = qaResults.status === 'passed' ? '✅' : '❌';
    const color = qaResults.status === 'passed' ? 0x00ff00 : 0xff0000;

    const embed = {
      title: `${statusEmoji} QA Review ${qaResults.status.toUpperCase()} - Story #${storyId}`,
      description: qaResults.feedback,
      color,
      fields: [
        { name: 'QA Reviewer', value: qaResults.reviewer, inline: true },
        { name: 'Score', value: `${qaResults.score}/100`, inline: true },
        { name: 'Status', value: qaResults.status.toUpperCase(), inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    await this.mcpClient.callTool('discord_send_message', {
      channelId,
      embeds: [embed]
    });
  }

  /**
   * Add reaction to existing message (for approvals, acknowledgments)
   *
   * @param channelId - Discord channel ID
   * @param messageId - Message ID to react to
   * @param emoji - Emoji to add (e.g., '✅', '👍', '🎉')
   */
  async addReaction(
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<void> {
    await this.mcpClient.callTool('discord_add_reaction', {
      channelId,
      messageId,
      emoji
    });
  }

  /**
   * Create webhook for alternative integration path
   *
   * @param channelId - Discord channel ID
   * @param webhookName - Name for the webhook
   * @returns Webhook URL for HTTP POST integration
   */
  async createWebhook(
    channelId: string,
    webhookName: string
  ): Promise<{ url: string; id: string }> {
    const result = await this.mcpClient.callTool('discord_create_webhook', {
      channelId,
      name: webhookName
    });

    return {
      url: result.url,
      id: result.id
    };
  }
}

// =============================================================================
// AI Agent Workflow Integration
// =============================================================================

/**
 * Example: Story Workflow with Discord notifications
 */
export class StoryWorkflow {
  private discordService: DiscordService;

  constructor(discordService: DiscordService) {
    this.discordService = discordService;
  }

  /**
   * Complete story and notify Discord
   */
  async completeStory(
    storyId: number,
    story: {
      title: string;
      description: string;
      projectId: number;
      assignedAgent: string;
      qaScore: number;
    },
    project: {
      discordChannelId?: string;
    }
  ): Promise<void> {
    // ... existing story completion logic ...

    // Notify Discord if channel configured
    if (project.discordChannelId) {
      await this.discordService.announceStoryCompletion(
        project.discordChannelId,
        storyId,
        {
          title: story.title,
          description: story.description,
          developer: story.assignedAgent,
          qaScore: story.qaScore
        }
      );
    }
  }

  /**
   * Post QA review results to Discord
   */
  async postQAResults(
    storyId: number,
    qaResults: {
      reviewer: string;
      status: 'passed' | 'failed';
      score: number;
      feedback: string;
    },
    project: {
      discordChannelId?: string;
    }
  ): Promise<void> {
    if (project.discordChannelId) {
      await this.discordService.postQAReview(
        project.discordChannelId,
        storyId,
        qaResults
      );
    }
  }
}

/**
 * Example: Milestone Workflow with Discord notifications
 */
export class MilestoneWorkflow {
  private discordService: DiscordService;

  constructor(discordService: DiscordService) {
    this.discordService = discordService;
  }

  /**
   * Complete milestone and announce to Discord
   */
  async completeMilestone(
    milestone: 'architecture' | 'planning' | 'development' | 'qa' | 'delivery',
    project: {
      id: number;
      name: string;
      discordChannelId?: string;
    }
  ): Promise<void> {
    // ... existing milestone completion logic ...

    // Announce to Discord
    if (project.discordChannelId) {
      await this.discordService.announceMilestone(
        project.discordChannelId,
        {
          milestone,
          projectName: project.name,
          completedAt: new Date()
        }
      );
    }
  }
}

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * Example 1: Simple project update
 */
async function exampleSimpleUpdate() {
  const discord = new DiscordService();

  await discord.postProjectUpdate(
    '1234567890123456789', // Channel ID
    '🤖 Architecture phase completed for E-Commerce Platform!'
  );
}

/**
 * Example 2: Story completion with rich embed
 */
async function exampleStoryCompletion() {
  const discord = new DiscordService();

  await discord.announceStoryCompletion(
    '1234567890123456789',
    42,
    {
      title: 'Implement user authentication',
      description: 'JWT-based authentication with refresh tokens and role-based access control',
      developer: 'AI Agent Alice',
      qaScore: 95
    }
  );
}

/**
 * Example 3: Milestone announcement
 */
async function exampleMilestoneAnnouncement() {
  const discord = new DiscordService();

  await discord.announceMilestone(
    '1234567890123456789',
    {
      milestone: 'architecture',
      projectName: 'E-Commerce Platform',
      completedAt: new Date()
    }
  );
}

/**
 * Example 4: QA review results
 */
async function exampleQAReview() {
  const discord = new DiscordService();

  await discord.postQAReview(
    '1234567890123456789',
    42,
    {
      reviewer: 'AI Agent Bob (QA)',
      status: 'passed',
      score: 95,
      feedback: 'Code quality excellent. All tests passing. Minor suggestions for error handling.'
    }
  );
}

/**
 * Example 5: Forum post for discussion
 */
async function exampleForumPost() {
  const discord = new DiscordService();

  await discord.createProjectForumPost(
    '9876543210987654321', // Forum channel ID
    123,
    'Architecture Review Needed',
    `
## Proposed Architecture

We've completed the initial architecture for the microservices platform.

**Key Components:**
- API Gateway (Kong)
- Auth Service (Node.js + JWT)
- User Service (Python + PostgreSQL)
- Payment Service (Node.js + Stripe)

**Please review and provide feedback!**

CC: @Product-Manager @Tech-Lead
    `.trim()
  );
}

/**
 * Example 6: Webhook integration (alternative to bot)
 */
async function exampleWebhookSetup() {
  const discord = new DiscordService();

  // Create webhook for channel
  const webhook = await discord.createWebhook(
    '1234567890123456789',
    'American Nerd Marketplace Bot'
  );

  console.log('Webhook URL:', webhook.url);

  // Can now POST directly to webhook.url (no MCP server needed)
  // Useful for lightweight integrations
}

// =============================================================================
// Alternative: Discord.js Direct SDK (No MCP Wrapper)
// =============================================================================

/**
 * If MCP abstraction not needed, use Discord.js directly
 *
 * Trade-offs:
 * - Pros: 100% API access, no external MCP server, built-in rate limiting
 * - Cons: More boilerplate (~20 lines), no MCP tool abstraction
 */

import { Client, GatewayIntentBits, EmbedBuilder, TextChannel } from 'discord.js';

export class DiscordDirectService {
  private client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    this.client.once('ready', () => {
      console.log(`Discord bot logged in as ${this.client.user?.tag}`);
    });

    this.client.login(process.env.DISCORD_BOT_TOKEN);
  }

  async postProjectUpdate(channelId: string, message: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId) as TextChannel;
    await channel.send(message);
  }

  async announceStoryCompletion(
    channelId: string,
    storyId: number,
    details: StoryDetails
  ): Promise<void> {
    const channel = await this.client.channels.fetch(channelId) as TextChannel;

    const embed = new EmbedBuilder()
      .setTitle(`✅ Story #${storyId} Completed`)
      .setDescription(details.description)
      .setColor(0x00ff00)
      .addFields(
        { name: 'Title', value: details.title, inline: false },
        { name: 'Developer', value: details.developer, inline: true },
        { name: 'QA Score', value: `${details.qaScore}/100`, inline: true }
      )
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
}

/**
 * Usage: Discord.js direct
 */
async function exampleDirectSDK() {
  const discord = new DiscordDirectService();

  // Wait for client to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));

  await discord.postProjectUpdate(
    '1234567890123456789',
    '🤖 Architecture completed!'
  );

  await discord.announceStoryCompletion(
    '1234567890123456789',
    42,
    {
      title: 'Implement user authentication',
      description: 'JWT-based auth',
      developer: 'AI Agent Alice',
      qaScore: 95
    }
  );
}

// =============================================================================
// Environment Variables
// =============================================================================

/**
 * Required environment variables:
 *
 * DISCORD_BOT_TOKEN=<your_bot_token_from_discord_developer_portal>
 * DISCORD_MCP_URL=http://localhost:3000 (for MCP server approach)
 *
 * Optional (per-project configuration):
 * PROJECT_123_DISCORD_CHANNEL=1234567890123456789
 * PROJECT_123_DISCORD_FORUM=9876543210987654321
 */

// =============================================================================
// Installation Commands
// =============================================================================

/**
 * MCP Server Deployment (Docker):
 *
 * docker pull barryyip0625/mcp-discord:latest
 * docker run -d \
 *   --name discord-mcp \
 *   -e DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN \
 *   -p 3000:3000 \
 *   barryyip0625/mcp-discord
 *
 * Or npm:
 * npm install -g @barryyip0625/mcp-discord
 */

/**
 * Discord.js Direct (no MCP):
 *
 * npm install discord.js
 */
