/**
 * Work History Logger
 *
 * This module provides production-ready logging of AI node work sessions,
 * tasks, file changes, and tool usage for complete work history tracking.
 */

import { Pool, PoolClient } from 'pg';

/**
 * Database connection pool
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'slopmachine',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

/**
 * Work session data
 */
export interface WorkSession {
  session_id?: number;
  node_id: string;
  project_id: string;
  deployment_id?: string;
  session_type: 'development' | 'deployment' | 'debugging' | 'testing' | 'consultation';
  status: 'in-progress' | 'paused' | 'completed' | 'failed' | 'cancelled';
  started_at?: Date;
  completed_at?: Date;
  total_duration_seconds?: number;
  description?: string;
  initial_prompt?: string;
  final_deliverable?: string;
  environment?: string;
  git_branch?: string;
  git_commit_hash?: string;
}

/**
 * Work task data
 */
export interface WorkTask {
  task_id?: number;
  session_id: number;
  node_id: string;
  project_id: string;
  task_type: 'code_generation' | 'file_edit' | 'debugging' | 'testing' | 'deployment' | 'research';
  task_name: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  started_at?: Date;
  completed_at?: Date;
  duration_seconds?: number;
  files_modified?: string[];
  lines_added?: number;
  lines_deleted?: number;
  lines_modified?: number;
  tools_used?: string[];
  api_calls?: number;
  success?: boolean;
  error_message?: string;
  output_summary?: string;
}

/**
 * File change data
 */
export interface FileChange {
  change_id?: number;
  task_id?: number;
  session_id: number;
  node_id: string;
  project_id: string;
  file_path: string;
  change_type: 'created' | 'modified' | 'deleted' | 'renamed';
  lines_added?: number;
  lines_deleted?: number;
  lines_modified?: number;
  file_size_before?: number;
  file_size_after?: number;
  diff_content?: string;
  commit_hash?: string;
}

/**
 * Tool usage data
 */
export interface ToolUsage {
  usage_id?: number;
  task_id?: number;
  session_id: number;
  node_id: string;
  tool_name: string;
  tool_category?: string;
  invocation_count?: number;
  total_duration_ms?: number;
  success_count?: number;
  failure_count?: number;
  parameters?: any;
  result_summary?: string;
}

/**
 * Communication message data
 */
export interface CommunicationMessage {
  message_id?: number;
  session_id: number;
  node_id: string;
  project_id: string;
  sender: 'user' | 'ai_node' | 'system';
  message_type?: string;
  message_content: string;
  token_count?: number;
  model_used?: string;
  parent_message_id?: number;
}

/**
 * Error log data
 */
export interface ErrorLog {
  error_id?: number;
  session_id: number;
  task_id?: number;
  node_id: string;
  project_id: string;
  error_type: string;
  error_message: string;
  error_stack_trace?: string;
  file_path?: string;
  line_number?: number;
  function_name?: string;
  resolved?: boolean;
  resolution_task_id?: number;
  resolution_notes?: string;
}

/**
 * Start a new work session
 */
export async function startWorkSession(
  session: Omit<WorkSession, 'session_id' | 'started_at' | 'status'>
): Promise<number> {
  const result = await pool.query(
    `INSERT INTO work_sessions (
      node_id, project_id, deployment_id, session_type, status,
      description, initial_prompt, environment, git_branch, git_commit_hash
    )
    VALUES ($1, $2, $3, $4, 'in-progress', $5, $6, $7, $8, $9)
    RETURNING session_id`,
    [
      session.node_id,
      session.project_id,
      session.deployment_id,
      session.session_type,
      session.description,
      session.initial_prompt,
      session.environment || 'production',
      session.git_branch,
      session.git_commit_hash,
    ]
  );

  const sessionId = result.rows[0].session_id;
  console.log(`✅ Work session started: ${sessionId}`);
  return sessionId;
}

/**
 * Complete a work session
 */
export async function completeWorkSession(
  session_id: number,
  status: 'completed' | 'failed' | 'cancelled',
  final_deliverable?: string
): Promise<void> {
  await pool.query(
    `UPDATE work_sessions
     SET status = $1,
         completed_at = CURRENT_TIMESTAMP,
         total_duration_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))::INTEGER,
         final_deliverable = $2
     WHERE session_id = $3`,
    [status, final_deliverable, session_id]
  );

  console.log(`✅ Work session ${session_id} ${status}`);
}

/**
 * Start a new task within a session
 */
export async function startTask(
  task: Omit<WorkTask, 'task_id' | 'started_at' | 'status'>
): Promise<number> {
  const result = await pool.query(
    `INSERT INTO work_tasks (
      session_id, node_id, project_id, task_type, task_name,
      description, status, files_modified, tools_used
    )
    VALUES ($1, $2, $3, $4, $5, $6, 'in-progress', $7, $8)
    RETURNING task_id`,
    [
      task.session_id,
      task.node_id,
      task.project_id,
      task.task_type,
      task.task_name,
      task.description,
      task.files_modified ? JSON.stringify(task.files_modified) : null,
      task.tools_used ? JSON.stringify(task.tools_used) : null,
    ]
  );

  const taskId = result.rows[0].task_id;
  console.log(`📝 Task started: ${task.task_name} (ID: ${taskId})`);
  return taskId;
}

/**
 * Complete a task
 */
export async function completeTask(
  task_id: number,
  result: {
    status: 'completed' | 'failed' | 'skipped';
    lines_added?: number;
    lines_deleted?: number;
    lines_modified?: number;
    api_calls?: number;
    success?: boolean;
    error_message?: string;
    output_summary?: string;
  }
): Promise<void> {
  await pool.query(
    `UPDATE work_tasks
     SET status = $1,
         completed_at = CURRENT_TIMESTAMP,
         duration_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))::INTEGER,
         lines_added = $2,
         lines_deleted = $3,
         lines_modified = $4,
         api_calls = $5,
         success = $6,
         error_message = $7,
         output_summary = $8
     WHERE task_id = $9`,
    [
      result.status,
      result.lines_added || 0,
      result.lines_deleted || 0,
      result.lines_modified || 0,
      result.api_calls || 0,
      result.success !== undefined ? result.success : (result.status === 'completed'),
      result.error_message,
      result.output_summary,
      task_id,
    ]
  );

  console.log(`✅ Task ${task_id} ${result.status}`);
}

/**
 * Log a file change
 */
export async function logFileChange(change: FileChange): Promise<number> {
  const result = await pool.query(
    `INSERT INTO file_changes (
      task_id, session_id, node_id, project_id, file_path, change_type,
      lines_added, lines_deleted, lines_modified,
      file_size_before, file_size_after, diff_content, commit_hash
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING change_id`,
    [
      change.task_id,
      change.session_id,
      change.node_id,
      change.project_id,
      change.file_path,
      change.change_type,
      change.lines_added || 0,
      change.lines_deleted || 0,
      change.lines_modified || 0,
      change.file_size_before,
      change.file_size_after,
      change.diff_content,
      change.commit_hash,
    ]
  );

  return result.rows[0].change_id;
}

/**
 * Log tool usage
 */
export async function logToolUsage(usage: ToolUsage): Promise<number> {
  const result = await pool.query(
    `INSERT INTO tool_usage (
      task_id, session_id, node_id, tool_name, tool_category,
      invocation_count, total_duration_ms, success_count, failure_count,
      parameters, result_summary
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING usage_id`,
    [
      usage.task_id,
      usage.session_id,
      usage.node_id,
      usage.tool_name,
      usage.tool_category,
      usage.invocation_count || 1,
      usage.total_duration_ms || 0,
      usage.success_count || 0,
      usage.failure_count || 0,
      usage.parameters ? JSON.stringify(usage.parameters) : null,
      usage.result_summary,
    ]
  );

  return result.rows[0].usage_id;
}

/**
 * Log a communication message
 */
export async function logMessage(message: CommunicationMessage): Promise<number> {
  const result = await pool.query(
    `INSERT INTO communication_log (
      session_id, node_id, project_id, sender, message_type,
      message_content, token_count, model_used, parent_message_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING message_id`,
    [
      message.session_id,
      message.node_id,
      message.project_id,
      message.sender,
      message.message_type,
      message.message_content,
      message.token_count,
      message.model_used,
      message.parent_message_id,
    ]
  );

  return result.rows[0].message_id;
}

/**
 * Log an error
 */
export async function logError(error: ErrorLog): Promise<number> {
  const result = await pool.query(
    `INSERT INTO error_log (
      session_id, task_id, node_id, project_id, error_type,
      error_message, error_stack_trace, file_path, line_number, function_name
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING error_id`,
    [
      error.session_id,
      error.task_id,
      error.node_id,
      error.project_id,
      error.error_type,
      error.error_message,
      error.error_stack_trace,
      error.file_path,
      error.line_number,
      error.function_name,
    ]
  );

  console.error(`❌ Error logged: ${error.error_type} - ${error.error_message}`);
  return result.rows[0].error_id;
}

/**
 * Mark an error as resolved
 */
export async function resolveError(
  error_id: number,
  resolution_task_id: number,
  resolution_notes?: string
): Promise<void> {
  await pool.query(
    `UPDATE error_log
     SET resolved = true,
         resolved_at = CURRENT_TIMESTAMP,
         resolution_task_id = $1,
         resolution_notes = $2
     WHERE error_id = $3`,
    [resolution_task_id, resolution_notes, error_id]
  );

  console.log(`✅ Error ${error_id} resolved`);
}

/**
 * Example: Complete workflow tracking
 */
export async function exampleWorkflowTracking() {
  console.log('=== Work History Tracking Example ===\n');

  const nodeId = 'alex-architect-ai';
  const projectId = 'proj-123';

  // 1. Start work session
  const sessionId = await startWorkSession({
    node_id: nodeId,
    project_id: projectId,
    session_type: 'development',
    description: 'Build e-commerce platform with payment integration',
    initial_prompt: 'Create a modern e-commerce website with Stripe payments',
    environment: 'production',
    git_branch: 'main',
  });

  // 2. Log initial message
  await logMessage({
    session_id: sessionId,
    node_id: nodeId,
    project_id: projectId,
    sender: 'user',
    message_type: 'instruction',
    message_content: 'Create a modern e-commerce website with Stripe payments',
  });

  // 3. Start frontend task
  const frontendTaskId = await startTask({
    session_id: sessionId,
    node_id: nodeId,
    project_id: projectId,
    task_type: 'code_generation',
    task_name: 'Create React frontend',
    description: 'Build responsive React UI with product catalog',
    tools_used: ['write', 'edit'],
  });

  // 4. Log file changes
  await logFileChange({
    task_id: frontendTaskId,
    session_id: sessionId,
    node_id: nodeId,
    project_id: projectId,
    file_path: 'src/App.tsx',
    change_type: 'created',
    lines_added: 150,
    file_size_after: 5120,
  });

  await logFileChange({
    task_id: frontendTaskId,
    session_id: sessionId,
    node_id: nodeId,
    project_id: projectId,
    file_path: 'src/components/ProductList.tsx',
    change_type: 'created',
    lines_added: 120,
    file_size_after: 4096,
  });

  // 5. Log tool usage
  await logToolUsage({
    task_id: frontendTaskId,
    session_id: sessionId,
    node_id: nodeId,
    tool_name: 'write',
    tool_category: 'file_operation',
    invocation_count: 5,
    success_count: 5,
    failure_count: 0,
  });

  // 6. Complete frontend task
  await completeTask(frontendTaskId, {
    status: 'completed',
    lines_added: 450,
    lines_deleted: 0,
    api_calls: 3,
    success: true,
    output_summary: 'Created React frontend with 5 components',
  });

  // 7. Start backend task
  const backendTaskId = await startTask({
    session_id: sessionId,
    node_id: nodeId,
    project_id: projectId,
    task_type: 'code_generation',
    task_name: 'Build Express backend API',
    description: 'Create REST API with database integration',
    tools_used: ['write', 'bash'],
  });

  // 8. Log an error (simulated)
  const errorId = await logError({
    session_id: sessionId,
    task_id: backendTaskId,
    node_id: nodeId,
    project_id: projectId,
    error_type: 'compilation_error',
    error_message: 'TypeScript type mismatch in payment handler',
    file_path: 'server/api/payments.ts',
    line_number: 42,
  });

  // 9. Resolve error
  await resolveError(errorId, backendTaskId, 'Fixed type definitions');

  // 10. Complete backend task
  await completeTask(backendTaskId, {
    status: 'completed',
    lines_added: 320,
    lines_deleted: 5,
    api_calls: 4,
    success: true,
    output_summary: 'Created Express API with 8 endpoints',
  });

  // 11. Start deployment task
  const deployTaskId = await startTask({
    session_id: sessionId,
    node_id: nodeId,
    project_id: projectId,
    task_type: 'deployment',
    task_name: 'Deploy to Arweave + Akash',
    description: 'Upload frontend to Arweave, deploy backend to Akash',
    tools_used: ['turbo_upload', 'akash_deploy'],
  });

  // 12. Complete deployment task
  await completeTask(deployTaskId, {
    status: 'completed',
    success: true,
    output_summary: 'Frontend: https://arweave.net/5x7abc..., Backend: akash1.../12345',
  });

  // 13. Complete work session
  await completeWorkSession(
    sessionId,
    'completed',
    'Full-stack e-commerce platform deployed successfully'
  );

  console.log('\n✅ Work history tracking complete!');
  console.log(`   Session ID: ${sessionId}`);
  console.log(`   Tasks: Frontend (${frontendTaskId}), Backend (${backendTaskId}), Deploy (${deployTaskId})`);
  console.log(`   Total lines: 770 added, 5 deleted`);
}

/**
 * Get work session summary
 */
export async function getSessionSummary(session_id: number) {
  const result = await pool.query(
    `SELECT
      ws.*,
      n.node_name,
      p.project_name,
      COUNT(DISTINCT wt.task_id) as task_count,
      SUM(wt.lines_added) as total_lines_added,
      SUM(wt.lines_deleted) as total_lines_deleted,
      COUNT(DISTINCT fc.file_path) as files_changed
    FROM work_sessions ws
    JOIN nodes n ON ws.node_id = n.node_id
    JOIN projects p ON ws.project_id = p.project_id
    LEFT JOIN work_tasks wt ON ws.session_id = wt.session_id
    LEFT JOIN file_changes fc ON ws.session_id = fc.session_id
    WHERE ws.session_id = $1
    GROUP BY ws.session_id, n.node_name, p.project_name`,
    [session_id]
  );

  return result.rows[0];
}

/**
 * Get node productivity stats
 */
export async function getNodeProductivity(node_id: string, days: number = 30) {
  const result = await pool.query(
    `SELECT * FROM node_productivity_summary WHERE node_id = $1`,
    [node_id]
  );

  return result.rows[0];
}

// Run example if executed directly
if (require.main === module) {
  exampleWorkflowTracking()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export default {
  startWorkSession,
  completeWorkSession,
  startTask,
  completeTask,
  logFileChange,
  logToolUsage,
  logMessage,
  logError,
  resolveError,
  getSessionSummary,
  getNodeProductivity,
};
