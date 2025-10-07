// Example 1: Direct Telegram Bot API (No Dependencies)
// Simplest approach - just HTTP requests

export class TelegramServiceDirect {
  private botToken: string;
  private baseUrl: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  async sendMessage(
    chatId: string,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown'
  ): Promise<void> {
    const url = `${this.baseUrl}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Telegram API error: ${error.description}`);
    }
  }

  async announceStoryCompletion(
    chatId: string,
    storyId: number,
    title: string,
    developerName: string,
    qaScore: number
  ): Promise<void> {
    const message =
      `✅ *Story #${storyId} Completed*\n\n` +
      `${title}\n\n` +
      `👨‍💻 Developer: ${developerName}\n` +
      `🎯 QA Score: ${qaScore}/100\n\n` +
      `🤖 Delivered via AI Agent`;

    await this.sendMessage(chatId, message);
  }

  async announceMilestoneProgress(
    chatId: string,
    milestoneId: number,
    milestoneName: string,
    completedStories: number,
    totalStories: number,
    percentComplete: number
  ): Promise<void> {
    const message =
      `📊 *Milestone Update: ${milestoneName}*\n\n` +
      `Progress: ${completedStories}/${totalStories} stories\n` +
      `${percentComplete}% complete\n\n` +
      `🚀 Keep shipping!`;

    await this.sendMessage(chatId, message);
  }
}

// Example 2: Using node-telegram-bot-api
// npm install node-telegram-bot-api
// npm install --save-dev @types/node-telegram-bot-api

import TelegramBot from 'node-telegram-bot-api';

export class TelegramServiceWithLibrary {
  private bot: TelegramBot;

  constructor(botToken: string) {
    // polling: false means we're just sending messages (no webhook/polling)
    this.bot = new TelegramBot(botToken, { polling: false });
  }

  async sendMessage(
    chatId: string,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown'
  ): Promise<void> {
    await this.bot.sendMessage(chatId, text, {
      parse_mode: parseMode
    });
  }

  async sendMessageWithPhoto(
    chatId: string,
    photoUrl: string,
    caption: string
  ): Promise<void> {
    await this.bot.sendPhoto(chatId, photoUrl, {
      caption,
      parse_mode: 'Markdown'
    });
  }

  async announceStoryCompletion(
    chatId: string,
    storyId: number,
    title: string,
    developerName: string,
    qaScore: number
  ): Promise<void> {
    const message =
      `✅ *Story #${storyId} Completed*\n\n` +
      `${title}\n\n` +
      `👨‍💻 Developer: ${developerName}\n` +
      `🎯 QA Score: ${qaScore}/100\n\n` +
      `🤖 Delivered via AI Agent`;

    await this.sendMessage(chatId, message);
  }

  async announceMilestoneCompletion(
    chatId: string,
    milestoneId: number,
    milestoneName: string,
    totalStories: number,
    averageQaScore: number
  ): Promise<void> {
    const message =
      `🎉 *Milestone Completed: ${milestoneName}*\n\n` +
      `Stories Delivered: ${totalStories}\n` +
      `Average QA Score: ${averageQaScore}/100\n\n` +
      `🏆 Great work team!`;

    await this.sendMessage(chatId, message);
  }
}

// Example 3: Using Telegraf Framework
// npm install telegraf

import { Telegraf } from 'telegraf';

export class TelegramServiceWithTelegraf {
  private bot: Telegraf;

  constructor(botToken: string) {
    this.bot = new Telegraf(botToken);
  }

  async sendMessage(
    chatId: string,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown'
  ): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, text, {
      parse_mode: parseMode
    });
  }

  async announceStoryCompletion(
    chatId: string,
    storyId: number,
    title: string,
    developerName: string,
    qaScore: number
  ): Promise<void> {
    const message =
      `✅ *Story #${storyId} Completed*\n\n` +
      `${title}\n\n` +
      `👨‍💻 Developer: ${developerName}\n` +
      `🎯 QA Score: ${qaScore}/100\n\n` +
      `🤖 Delivered via AI Agent`;

    await this.sendMessage(chatId, message);
  }

  // Telegraf is better if you need to handle incoming messages
  // For one-way notifications, it's overkill
  async launch(): Promise<void> {
    // Only needed if handling incoming messages
    // this.bot.launch();
  }
}

// Example 4: Using MCP Server (IQAIcom/mcp-telegram)
// Requires running the MCP server separately

import { MCPClient } from '@anthropic-ai/sdk';

export class TelegramServiceWithMCP {
  private mcpClient: MCPClient;

  constructor(mcpServerUrl: string) {
    this.mcpClient = new MCPClient({
      serverUrl: mcpServerUrl
    });
  }

  async sendMessage(
    chatId: string,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown'
  ): Promise<void> {
    await this.mcpClient.callTool('SEND_MESSAGE', {
      chatId,
      text,
      parseMode
    });
  }

  async announceStoryCompletion(
    chatId: string,
    storyId: number,
    title: string,
    developerName: string,
    qaScore: number
  ): Promise<void> {
    const message =
      `✅ *Story #${storyId} Completed*\n\n` +
      `${title}\n\n` +
      `👨‍💻 Developer: ${developerName}\n` +
      `🎯 QA Score: ${qaScore}/100\n\n` +
      `🤖 Delivered via AI Agent`;

    await this.sendMessage(chatId, message);
  }
}

// Usage Examples

// Example 1: Direct API (Recommended - Simplest)
const directService = new TelegramServiceDirect(process.env.TELEGRAM_BOT_TOKEN!);
await directService.announceStoryCompletion(
  '@american_nerd_project',
  42,
  'User Authentication System',
  'AI Agent Alice',
  95
);

// Example 2: node-telegram-bot-api (Good balance)
const libraryService = new TelegramServiceWithLibrary(process.env.TELEGRAM_BOT_TOKEN!);
await libraryService.announceStoryCompletion(
  '@american_nerd_project',
  42,
  'User Authentication System',
  'AI Agent Alice',
  95
);

// Example 3: Telegraf (Overkill for one-way messaging)
const telegrafService = new TelegramServiceWithTelegraf(process.env.TELEGRAM_BOT_TOKEN!);
await telegrafService.announceStoryCompletion(
  '@american_nerd_project',
  42,
  'User Authentication System',
  'AI Agent Alice',
  95
);

// Example 4: MCP Server (Only if already using MCP architecture)
const mcpService = new TelegramServiceWithMCP('http://localhost:3000');
await mcpService.announceStoryCompletion(
  '@american_nerd_project',
  42,
  'User Authentication System',
  'AI Agent Alice',
  95
);
