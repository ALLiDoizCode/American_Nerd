/**
 * AI SDK Integration Example
 *
 * Demonstrates how to use Vercel AI SDK with MCP for American Nerd Marketplace.
 * This example shows the recommended architecture for integrating multi-model
 * AI capabilities with BMAD task execution.
 *
 * See docs/multi-model-sdk-mcp-research.md for full research details.
 */

import { generateText, streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { ollama } from '@ai-sdk/ollama';
import { experimental_createMCPClient } from 'ai';
import { Client } from '@modelcontextprotocol/sdk/client';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio';
import { z } from 'zod';

// ============================================================================
// Type Definitions
// ============================================================================

interface AITask {
  id: string;
  type: 'expert-matching' | 'code-generation' | 'code-review' | 'qa-analysis' | 'pm-planning';
  prompt: string;
  context?: string[];
  complexity: 'low' | 'medium' | 'high';
  privacy: 'public' | 'sensitive';
  requiredMCPServers?: string[];
  maxTokens?: number;
}

interface AITaskResult {
  text: string;
  toolCalls: ToolCall[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  latency: number;
}

interface MCPServerConfig {
  name: string;
  transport: 'stdio' | 'sse';
  command?: string;
  args?: string[];
  url?: string;
}

// ============================================================================
// Model Selection Service
// ============================================================================

class ModelSelector {
  select(task: AITask) {
    // Priority 1: Privacy (sensitive data must use local models)
    if (task.privacy === 'sensitive') {
      return ollama('llama3');
    }

    // Priority 2: Complexity
    if (task.complexity === 'high') {
      // High complexity → best reasoning model (Claude)
      return anthropic('claude-3-5-sonnet-20241022');
    }

    // Priority 3: Task-specific routing
    const taskRouting = {
      'expert-matching': openai('gpt-4o-mini'), // Fast, cost-optimized
      'code-generation': anthropic('claude-3-5-sonnet-20241022'), // Best code quality
      'code-review': anthropic('claude-3-5-sonnet-20241022'), // Best reasoning
      'qa-analysis': openai('gpt-4o-mini'), // Fast, sufficient quality
      'pm-planning': anthropic('claude-3-5-sonnet-20241022') // Best planning
    };

    return taskRouting[task.type] || anthropic('claude-3-5-sonnet-20241022');
  }

  getFallback(currentModel: string) {
    const fallbackChain: Record<string, string> = {
      'claude-3-5-sonnet-20241022': 'gpt-4',
      'gpt-4': 'gpt-4o-mini',
      'gpt-4o-mini': 'ollama/llama3'
    };

    return fallbackChain[currentModel] || 'gpt-4o-mini';
  }
}

// ============================================================================
// MCP Client Service
// ============================================================================

class MCPClientService {
  private clients: Map<string, Client> = new Map();

  async connect(configs: MCPServerConfig[]) {
    for (const config of configs) {
      try {
        const transport = new StdioClientTransport({
          command: config.command!,
          args: config.args
        });

        const client = new Client(
          { name: 'slop-machine-ai', version: '1.0.0' },
          { capabilities: {} }
        );

        await client.connect(transport);
        this.clients.set(config.name, client);

        console.log(`✅ Connected to MCP server: ${config.name}`);
      } catch (error) {
        console.error(`❌ Failed to connect to MCP server ${config.name}:`, error);
      }
    }
  }

  async loadTools(serverNames?: string[]) {
    const tools: Record<string, any> = {};

    const serversToLoad = serverNames
      ? serverNames.filter(name => this.clients.has(name))
      : Array.from(this.clients.keys());

    for (const serverName of serversToLoad) {
      const client = this.clients.get(serverName);
      if (!client) continue;

      try {
        const serverTools = await client.listTools();

        for (const tool of serverTools.tools) {
          const toolKey = `${serverName}__${tool.name}`;
          tools[toolKey] = {
            description: tool.description,
            parameters: this.convertJsonSchemaToZod(tool.inputSchema),
            execute: async (params: any) => {
              const result = await client.callTool({
                name: tool.name,
                arguments: params
              });
              return JSON.stringify(result.content);
            }
          };
        }

        console.log(`✅ Loaded ${serverTools.tools.length} tools from ${serverName}`);
      } catch (error) {
        console.error(`❌ Failed to load tools from ${serverName}:`, error);
      }
    }

    return tools;
  }

  private convertJsonSchemaToZod(schema: any): z.ZodType {
    // Simplified conversion - use json-schema-to-zod in production
    if (schema.type === 'object') {
      const shape: Record<string, z.ZodType> = {};
      for (const [key, value] of Object.entries(schema.properties || {})) {
        shape[key] = this.convertJsonSchemaToZod(value);
      }
      return z.object(shape);
    } else if (schema.type === 'string') {
      return z.string();
    } else if (schema.type === 'number') {
      return z.number();
    } else if (schema.type === 'boolean') {
      return z.boolean();
    }
    return z.any();
  }

  async close() {
    for (const [name, client] of this.clients.entries()) {
      try {
        await client.close();
        console.log(`✅ Closed MCP server: ${name}`);
      } catch (error) {
        console.error(`❌ Failed to close MCP server ${name}:`, error);
      }
    }
  }
}

// ============================================================================
// AI Client Service
// ============================================================================

class AIClientService {
  private mcpClient: MCPClientService;
  private modelSelector: ModelSelector;

  constructor(private mcpServers: MCPServerConfig[]) {
    this.mcpClient = new MCPClientService();
    this.modelSelector = new ModelSelector();
  }

  async initialize() {
    await this.mcpClient.connect(this.mcpServers);
  }

  async executeTask(task: AITask): Promise<AITaskResult> {
    const startTime = Date.now();

    try {
      // 1. Select model
      const model = this.modelSelector.select(task);

      // 2. Load MCP tools
      const tools = await this.mcpClient.loadTools(task.requiredMCPServers);

      // 3. Build messages
      const messages = this.buildMessages(task);

      // 4. Execute
      const result = await generateText({
        model,
        tools,
        messages,
        maxTokens: task.maxTokens || 4096
      });

      return {
        text: result.text,
        toolCalls: result.toolCalls || [],
        usage: result.usage,
        model: result.model,
        latency: Date.now() - startTime
      };
    } catch (error) {
      console.error('AI task execution failed:', error);
      throw error;
    }
  }

  async executeTaskStream(task: AITask) {
    const model = this.modelSelector.select(task);
    const tools = await this.mcpClient.loadTools(task.requiredMCPServers);
    const messages = this.buildMessages(task);

    return streamText({
      model,
      tools,
      messages,
      maxTokens: task.maxTokens || 4096
    });
  }

  private buildMessages(task: AITask) {
    const messages = [];

    if (task.context && task.context.length > 0) {
      messages.push({
        role: 'system',
        content: `Context:\n${task.context.join('\n\n')}`
      });
    }

    messages.push({
      role: 'user',
      content: task.prompt
    });

    return messages;
  }

  async close() {
    await this.mcpClient.close();
  }
}

// ============================================================================
// BMAD Task Executor Integration
// ============================================================================

interface BMADTask {
  id: string;
  type: string;
  input: {
    prompt: string;
    context?: string[];
  };
  metadata: {
    complexity?: 'low' | 'medium' | 'high';
    privacy?: 'public' | 'sensitive';
    mcpServers?: string[];
  };
  startTime: number;
}

interface BMADTaskResult {
  status: 'completed' | 'failed';
  output?: any;
  error?: string;
  metadata: any;
}

class AITaskExecutor {
  private aiClient: AIClientService;
  private initialized = false;

  constructor(private mcpServers: MCPServerConfig[]) {
    this.aiClient = new AIClientService(mcpServers);
  }

  async initialize() {
    await this.aiClient.initialize();
    this.initialized = true;
  }

  async execute(task: BMADTask): Promise<BMADTaskResult> {
    if (!this.initialized) {
      await this.initialize();
    }

    const aiTask: AITask = {
      id: task.id,
      type: task.type as any,
      prompt: task.input.prompt,
      context: task.input.context,
      complexity: task.metadata.complexity || 'medium',
      privacy: task.metadata.privacy || 'public',
      requiredMCPServers: task.metadata.mcpServers || ['github', 'filesystem']
    };

    try {
      // Execute with streaming
      const stream = await this.aiClient.executeTaskStream(aiTask);

      // Emit progress events (integrate with BMAD WebSocket)
      let fullText = '';
      for await (const chunk of stream.textStream) {
        fullText += chunk;
        this.emitProgress(task.id, chunk);
      }

      const toolCalls = await stream.toolCalls;
      const usage = await stream.usage;

      return {
        status: 'completed',
        output: {
          text: fullText,
          toolCalls,
          usage
        },
        metadata: {
          model: stream.model,
          latency: Date.now() - task.startTime
        }
      };
    } catch (error) {
      return {
        status: 'failed',
        error: error.message,
        metadata: {
          taskId: task.id,
          stack: error.stack
        }
      };
    }
  }

  private emitProgress(taskId: string, content: string) {
    // Integrate with BMAD event system
    // bmad.events.emit('task:progress', { taskId, type: 'stream', content });
    console.log(`[Task ${taskId}] ${content}`);
  }

  async shutdown() {
    await this.aiClient.close();
  }
}

// ============================================================================
// Example Usage
// ============================================================================

async function main() {
  // Configure MCP servers
  const mcpServers: MCPServerConfig[] = [
    {
      name: 'github',
      transport: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github']
    },
    {
      name: 'filesystem',
      transport: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/workspace']
    }
  ];

  // Initialize executor
  const executor = new AITaskExecutor(mcpServers);
  await executor.initialize();

  // Example: Expert matching task
  const expertMatchingTask: BMADTask = {
    id: 'task-001',
    type: 'expert-matching',
    input: {
      prompt: 'Find the best expert for a React + TypeScript project requiring 40 hours',
      context: [
        'Project: E-commerce dashboard',
        'Skills: React, TypeScript, Tailwind CSS',
        'Budget: $4000',
        'Deadline: 2 weeks'
      ]
    },
    metadata: {
      complexity: 'medium',
      privacy: 'public',
      mcpServers: ['github'] // Access expert GitHub profiles
    },
    startTime: Date.now()
  };

  console.log('Executing expert matching task...\n');
  const result = await executor.execute(expertMatchingTask);

  console.log('\n=== Result ===');
  console.log('Status:', result.status);
  console.log('Model:', result.metadata.model);
  console.log('Latency:', result.metadata.latency, 'ms');
  console.log('Output:', result.output.text);
  console.log('Tool Calls:', result.output.toolCalls?.length || 0);

  await executor.shutdown();
}

// Run example
if (require.main === module) {
  main().catch(console.error);
}
