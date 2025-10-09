/**
 * GitHub MCP Integration Example
 *
 * This file demonstrates how AI agents in the American Nerd Marketplace
 * connect to the GitHub MCP server to perform repository operations.
 *
 * Based on research from: docs/github-mcp-research.md
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// ============================================================================
// Configuration Types
// ============================================================================

export interface GitHubMCPConfig {
  serverUrl: string;
  githubToken: string;
  timeout?: number;
}

export interface GitHubRepository {
  owner: string;
  repo: string;
}

// ============================================================================
// GitHub MCP Service
// ============================================================================

export class GitHubMCPService {
  private client: Client | null = null;
  private transport: SSEClientTransport | null = null;
  private connected: boolean = false;

  constructor(private config: GitHubMCPConfig) {}

  /**
   * Initialize connection to GitHub MCP server
   */
  async initialize(): Promise<void> {
    this.transport = new SSEClientTransport({
      url: this.config.serverUrl,
      headers: {
        'Authorization': `Bearer ${this.config.githubToken}`,
        'Content-Type': 'application/json'
      },
      timeout: this.config.timeout || 30000
    });

    this.client = new Client(
      {
        name: 'slop-machine-ai-agent',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    await this.client.connect(this.transport);
    this.connected = true;
    console.log('✅ Connected to GitHub MCP server');
  }

  /**
   * Create a new branch
   */
  async createBranch(params: {
    owner: string;
    repo: string;
    branch: string;
    fromBranch?: string;
  }): Promise<{ ref: string; sha: string }> {
    this.ensureConnected();

    const result = await this.client!.request({
      method: 'tools/call',
      params: {
        name: 'create_branch',
        arguments: {
          owner: params.owner,
          repo: params.repo,
          branch: params.branch,
          from_branch: params.fromBranch || 'main'
        }
      }
    });

    return this.parseResult(result);
  }

  /**
   * Create or update a file (creates a commit)
   */
  async createCommit(params: {
    owner: string;
    repo: string;
    branch: string;
    files: Array<{ path: string; content: string }>;
    message: string;
  }): Promise<{ commit: { sha: string; url: string } }> {
    this.ensureConnected();

    // GitHub MCP supports batch file updates in a single commit
    const results = await Promise.all(
      params.files.map(file =>
        this.client!.request({
          method: 'tools/call',
          params: {
            name: 'create_or_update_file',
            arguments: {
              owner: params.owner,
              repo: params.repo,
              path: file.path,
              content: file.content,
              message: params.message,
              branch: params.branch
            }
          }
        })
      )
    );

    return this.parseResult(results[0]);
  }

  /**
   * Create a pull request
   */
  async createPullRequest(params: {
    owner: string;
    repo: string;
    title: string;
    head: string;
    base: string;
    body: string;
  }): Promise<{ number: number; html_url: string; state: string }> {
    this.ensureConnected();

    const result = await this.client!.request({
      method: 'tools/call',
      params: {
        name: 'create_pull_request',
        arguments: params
      }
    });

    return this.parseResult(result);
  }

  /**
   * List pull requests
   */
  async listPullRequests(params: {
    owner: string;
    repo: string;
    state?: 'open' | 'closed' | 'all';
  }): Promise<Array<{
    number: number;
    title: string;
    state: string;
    html_url: string;
    head: { ref: string };
    base: { ref: string };
  }>> {
    this.ensureConnected();

    const result = await this.client!.request({
      method: 'tools/call',
      params: {
        name: 'list_pull_requests',
        arguments: {
          owner: params.owner,
          repo: params.repo,
          state: params.state || 'open'
        }
      }
    });

    return this.parseResult(result);
  }

  /**
   * Get pull request status and details
   */
  async getPullRequestStatus(params: {
    owner: string;
    repo: string;
    pullNumber: number;
  }): Promise<{
    number: number;
    state: string;
    mergeable: boolean;
    merged: boolean;
    reviews?: Array<{ state: string; user: string }>;
  }> {
    this.ensureConnected();

    const result = await this.client!.request({
      method: 'tools/call',
      params: {
        name: 'get_pull_request',
        arguments: {
          owner: params.owner,
          repo: params.repo,
          pull_number: params.pullNumber
        }
      }
    });

    return this.parseResult(result);
  }

  /**
   * Merge a pull request
   */
  async mergePullRequest(params: {
    owner: string;
    repo: string;
    pullNumber: number;
    mergeMethod?: 'merge' | 'squash' | 'rebase';
    commitMessage?: string;
  }): Promise<{ sha: string; merged: boolean; message: string }> {
    this.ensureConnected();

    const result = await this.client!.request({
      method: 'tools/call',
      params: {
        name: 'merge_pull_request',
        arguments: {
          owner: params.owner,
          repo: params.repo,
          pull_number: params.pullNumber,
          merge_method: params.mergeMethod || 'squash',
          commit_message: params.commitMessage
        }
      }
    });

    return this.parseResult(result);
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect(): Promise<void> {
    if (this.connected && this.client) {
      await this.client.close();
      this.connected = false;
      console.log('✅ Disconnected from GitHub MCP server');
    }
  }

  // Private helper methods

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('GitHub MCP client not connected. Call initialize() first.');
    }
  }

  private parseResult(result: any): any {
    if (result.content && result.content[0]?.text) {
      try {
        return JSON.parse(result.content[0].text);
      } catch (error) {
        return result.content[0].text;
      }
    }
    return result;
  }
}

// ============================================================================
// Example: Architect Node Workflow
// ============================================================================

/**
 * Example workflow showing how an Architect AI agent uses GitHub MCP
 * to create architecture documentation and submit a pull request.
 */
export async function architectNodeWorkflow(params: {
  projectId: string;
  prdContent: string;
  repository: GitHubRepository;
  githubToken: string;
}): Promise<{
  branchName: string;
  commitSha: string;
  prNumber: number;
  prUrl: string;
}> {
  const githubMCP = new GitHubMCPService({
    serverUrl: process.env.GITHUB_MCP_SERVER_URL || 'https://api.githubcopilot.com/mcp/',
    githubToken: params.githubToken
  });

  await githubMCP.initialize();

  try {
    console.log(`🏗️  Starting architecture workflow for project ${params.projectId}...`);

    // 1. Create feature branch
    const branchName = `architecture/project-${params.projectId}`;
    const branch = await githubMCP.createBranch({
      owner: params.repository.owner,
      repo: params.repository.repo,
      branch: branchName,
      fromBranch: 'main'
    });

    console.log(`✅ Created branch: ${branch.ref}`);

    // 2. Generate architecture.md from PRD
    const architectureContent = await generateArchitecture(params.prdContent);

    // 3. Commit architecture.md
    const commit = await githubMCP.createCommit({
      owner: params.repository.owner,
      repo: params.repository.repo,
      branch: branchName,
      files: [{
        path: 'docs/architecture.md',
        content: architectureContent
      }],
      message: `Add architecture documentation for project ${params.projectId}\n\n🤖 Generated by AI Architect Agent`
    });

    console.log(`✅ Created commit: ${commit.commit.sha}`);

    // 4. Create pull request
    const pr = await githubMCP.createPullRequest({
      owner: params.repository.owner,
      repo: params.repository.repo,
      title: `Architecture: Project ${params.projectId}`,
      head: branchName,
      base: 'main',
      body: generatePRDescription(params.projectId)
    });

    console.log(`✅ Created PR #${pr.number}: ${pr.html_url}`);

    return {
      branchName: branch.ref,
      commitSha: commit.commit.sha,
      prNumber: pr.number,
      prUrl: pr.html_url
    };

  } finally {
    await githubMCP.disconnect();
  }
}

// ============================================================================
// Example: Developer Node Workflow
// ============================================================================

/**
 * Example workflow showing how a Developer AI agent uses GitHub MCP
 * to implement code based on architecture and submit a pull request.
 */
export async function developerNodeWorkflow(params: {
  taskId: string;
  architectureContent: string;
  repository: GitHubRepository;
  githubToken: string;
}): Promise<{
  branchName: string;
  commitSha: string;
  prNumber: number;
  prUrl: string;
}> {
  const githubMCP = new GitHubMCPService({
    serverUrl: process.env.GITHUB_MCP_SERVER_URL || 'https://api.githubcopilot.com/mcp/',
    githubToken: params.githubToken
  });

  await githubMCP.initialize();

  try {
    console.log(`💻 Starting development workflow for task ${params.taskId}...`);

    // 1. Create feature branch
    const branchName = `feature/task-${params.taskId}`;
    const branch = await githubMCP.createBranch({
      owner: params.repository.owner,
      repo: params.repository.repo,
      branch: branchName,
      fromBranch: 'main'
    });

    console.log(`✅ Created branch: ${branch.ref}`);

    // 2. Generate code implementation
    const codeFiles = await generateImplementation(params.architectureContent);

    // 3. Commit all files
    const commit = await githubMCP.createCommit({
      owner: params.repository.owner,
      repo: params.repository.repo,
      branch: branchName,
      files: codeFiles,
      message: `Implement task ${params.taskId}\n\n🤖 Generated by AI Developer Agent`
    });

    console.log(`✅ Created commit: ${commit.commit.sha}`);

    // 4. Create pull request
    const pr = await githubMCP.createPullRequest({
      owner: params.repository.owner,
      repo: params.repository.repo,
      title: `Feature: Task ${params.taskId}`,
      head: branchName,
      base: 'main',
      body: generateDeveloperPRDescription(params.taskId, codeFiles)
    });

    console.log(`✅ Created PR #${pr.number}: ${pr.html_url}`);

    return {
      branchName: branch.ref,
      commitSha: commit.commit.sha,
      prNumber: pr.number,
      prUrl: pr.html_url
    };

  } finally {
    await githubMCP.disconnect();
  }
}

// ============================================================================
// Example: QA Reviewer Node Workflow
// ============================================================================

/**
 * Example workflow showing how a QA Reviewer AI agent uses GitHub MCP
 * to review code and approve or request changes on a pull request.
 */
export async function qaReviewerNodeWorkflow(params: {
  repository: GitHubRepository;
  pullNumber: number;
  githubToken: string;
}): Promise<{
  approved: boolean;
  reviewComments: string[];
}> {
  const githubMCP = new GitHubMCPService({
    serverUrl: process.env.GITHUB_MCP_SERVER_URL || 'https://api.githubcopilot.com/mcp/',
    githubToken: params.githubToken
  });

  await githubMCP.initialize();

  try {
    console.log(`🔍 Starting QA review for PR #${params.pullNumber}...`);

    // 1. Get PR details and status
    const prStatus = await githubMCP.getPullRequestStatus({
      owner: params.repository.owner,
      repo: params.repository.repo,
      pullNumber: params.pullNumber
    });

    console.log(`📊 PR State: ${prStatus.state}, Mergeable: ${prStatus.mergeable}`);

    // 2. Perform code review (simulated)
    const reviewResult = await performCodeReview(prStatus);

    // 3. If approved, merge the PR
    if (reviewResult.approved) {
      const merged = await githubMCP.mergePullRequest({
        owner: params.repository.owner,
        repo: params.repository.repo,
        pullNumber: params.pullNumber,
        mergeMethod: 'squash',
        commitMessage: `Merged after QA approval\n\n🤖 Approved by AI QA Reviewer Agent`
      });

      console.log(`✅ PR merged: ${merged.sha}`);
    } else {
      console.log(`⚠️  PR needs changes: ${reviewResult.comments.join(', ')}`);
    }

    return {
      approved: reviewResult.approved,
      reviewComments: reviewResult.comments
    };

  } finally {
    await githubMCP.disconnect();
  }
}

// ============================================================================
// Helper Functions (Simulated AI Logic)
// ============================================================================

async function generateArchitecture(prdContent: string): Promise<string> {
  // In production, this would use Claude API to generate architecture
  return `# Architecture Documentation\n\n` +
         `## Overview\n\n` +
         `This architecture is generated based on the PRD.\n\n` +
         `## Tech Stack\n\n` +
         `- Frontend: Next.js 14, TypeScript\n` +
         `- Backend: NestJS, PostgreSQL\n` +
         `- Infrastructure: AWS ECS, RDS\n\n` +
         `🤖 Generated by AI Architect Agent`;
}

async function generateImplementation(architectureContent: string): Promise<Array<{ path: string; content: string }>> {
  // In production, this would use Claude API to generate code
  return [
    {
      path: 'src/app/page.tsx',
      content: `export default function HomePage() {\n  return <div>Hello World</div>;\n}`
    },
    {
      path: 'src/lib/api.ts',
      content: `export async function fetchData() {\n  // Implementation\n}`
    }
  ];
}

function generatePRDescription(projectId: string): string {
  return `## Architecture Documentation\n\n` +
         `This PR adds the technical architecture for project ${projectId}.\n\n` +
         `### Review Checklist\n` +
         `- [ ] Architecture aligns with PRD requirements\n` +
         `- [ ] Tech stack choices are justified\n` +
         `- [ ] Scalability considerations addressed\n` +
         `- [ ] Security best practices included\n\n` +
         `🤖 Generated by AI Architect Agent\n` +
         `👤 Review by Project Manager required`;
}

function generateDeveloperPRDescription(taskId: string, files: Array<{ path: string; content: string }>): string {
  const fileList = files.map(f => `- \`${f.path}\``).join('\n');

  return `## Implementation: Task ${taskId}\n\n` +
         `### Files Changed\n${fileList}\n\n` +
         `### Testing\n` +
         `- [ ] Unit tests passing\n` +
         `- [ ] Integration tests passing\n` +
         `- [ ] Manual testing completed\n\n` +
         `🤖 Generated by AI Developer Agent\n` +
         `👤 Review by QA Reviewer required`;
}

async function performCodeReview(prStatus: any): Promise<{ approved: boolean; comments: string[] }> {
  // In production, this would use Claude API to analyze code
  return {
    approved: prStatus.mergeable,
    comments: prStatus.mergeable ? [] : ['Code has merge conflicts', 'Requires rebase']
  };
}

// ============================================================================
// Configuration Examples
// ============================================================================

/**
 * Example configuration for different deployment scenarios
 */
export const configExamples = {
  // Remote GitHub MCP Server (Recommended for MVP)
  remote: {
    serverUrl: 'https://api.githubcopilot.com/mcp/',
    githubToken: process.env.GITHUB_PAT_ARCHITECT || '',
    timeout: 30000
  },

  // Self-hosted Docker (Production)
  selfHosted: {
    serverUrl: 'http://github-mcp:3000/mcp/',
    githubToken: process.env.GITHUB_PAT_ARCHITECT || '',
    timeout: 30000
  },

  // Local development
  local: {
    serverUrl: 'http://localhost:3000/mcp/',
    githubToken: process.env.GITHUB_PAT_DEV || '',
    timeout: 10000
  }
};

// ============================================================================
// Usage Example
// ============================================================================

/**
 * Example of how to use the GitHub MCP service in an AI agent node
 */
async function main() {
  // Example 1: Architect workflow
  const architectResult = await architectNodeWorkflow({
    projectId: 'PROJ-123',
    prdContent: 'Build a user authentication system...',
    repository: {
      owner: 'client-org',
      repo: 'client-project'
    },
    githubToken: process.env.GITHUB_PAT_ARCHITECT!
  });

  console.log('Architect workflow completed:', architectResult);

  // Example 2: Developer workflow
  const devResult = await developerNodeWorkflow({
    taskId: 'TASK-456',
    architectureContent: 'Architecture content...',
    repository: {
      owner: 'client-org',
      repo: 'client-project'
    },
    githubToken: process.env.GITHUB_PAT_DEVELOPER!
  });

  console.log('Developer workflow completed:', devResult);

  // Example 3: QA Reviewer workflow
  const qaResult = await qaReviewerNodeWorkflow({
    repository: {
      owner: 'client-org',
      repo: 'client-project'
    },
    pullNumber: devResult.prNumber,
    githubToken: process.env.GITHUB_PAT_QA!
  });

  console.log('QA review completed:', qaResult);
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
