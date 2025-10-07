-- =====================================================
-- AI Node Work History Tracking Schema
-- =====================================================
-- Comprehensive tracking of AI node work sessions, tasks, and activities
-- Integrates with cost tracking and profit tracking for complete visibility

-- =====================================================
-- 1. WORK SESSION TRACKING
-- =====================================================

-- Work sessions (overall project work periods)
CREATE TABLE IF NOT EXISTS work_sessions (
    session_id SERIAL PRIMARY KEY,
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    project_id VARCHAR(255) REFERENCES projects(project_id),
    deployment_id VARCHAR(255) REFERENCES deployments(deployment_id),

    -- Session details
    session_type VARCHAR(50) NOT NULL, -- 'development', 'deployment', 'debugging', 'testing', 'consultation'
    status VARCHAR(50) DEFAULT 'in-progress', -- 'in-progress', 'paused', 'completed', 'failed', 'cancelled'

    -- Timing
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    paused_at TIMESTAMP,
    total_duration_seconds INTEGER, -- Calculated on completion

    -- Context
    description TEXT,
    initial_prompt TEXT, -- User's original request
    final_deliverable TEXT, -- What was delivered

    -- Metadata
    environment VARCHAR(50), -- 'production', 'staging', 'development'
    git_branch VARCHAR(255),
    git_commit_hash VARCHAR(64),

    INDEX idx_session_node (node_id, started_at),
    INDEX idx_session_project (project_id),
    INDEX idx_session_status (status)
);

-- =====================================================
-- 2. TASK TRACKING (Within Work Sessions)
-- =====================================================

-- Individual tasks performed during a work session
CREATE TABLE IF NOT EXISTS work_tasks (
    task_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES work_sessions(session_id),
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    project_id VARCHAR(255) REFERENCES projects(project_id),

    -- Task details
    task_type VARCHAR(50) NOT NULL, -- 'code_generation', 'file_edit', 'debugging', 'testing', 'deployment', 'research'
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in-progress', 'completed', 'failed', 'skipped'

    -- Timing
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,

    -- Resources affected
    files_modified JSONB, -- Array of file paths
    lines_added INTEGER,
    lines_deleted INTEGER,
    lines_modified INTEGER,

    -- Tool usage
    tools_used JSONB, -- Array of tools: ['bash', 'edit', 'write', 'read', 'grep']
    api_calls INTEGER DEFAULT 0, -- Number of LLM API calls made

    -- Results
    success BOOLEAN,
    error_message TEXT,
    output_summary TEXT,

    INDEX idx_task_session (session_id),
    INDEX idx_task_node (node_id),
    INDEX idx_task_type (task_type),
    INDEX idx_task_status (status)
);

-- =====================================================
-- 3. FILE CHANGE TRACKING
-- =====================================================

-- Track all file changes made by AI nodes
CREATE TABLE IF NOT EXISTS file_changes (
    change_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES work_tasks(task_id),
    session_id INTEGER REFERENCES work_sessions(session_id),
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    project_id VARCHAR(255) REFERENCES projects(project_id),

    -- File details
    file_path VARCHAR(1024) NOT NULL,
    change_type VARCHAR(50) NOT NULL, -- 'created', 'modified', 'deleted', 'renamed'

    -- Change details
    lines_added INTEGER DEFAULT 0,
    lines_deleted INTEGER DEFAULT 0,
    lines_modified INTEGER DEFAULT 0,
    file_size_before BIGINT,
    file_size_after BIGINT,

    -- Content (optional, for small changes)
    diff_content TEXT, -- Git-style diff

    -- Metadata
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commit_hash VARCHAR(64), -- If committed to git

    INDEX idx_file_change_session (session_id),
    INDEX idx_file_change_project (project_id),
    INDEX idx_file_change_path (file_path),
    INDEX idx_file_change_type (change_type)
);

-- =====================================================
-- 4. TOOL USAGE TRACKING
-- =====================================================

-- Track which tools AI nodes use and how often
CREATE TABLE IF NOT EXISTS tool_usage (
    usage_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES work_tasks(task_id),
    session_id INTEGER REFERENCES work_sessions(session_id),
    node_id VARCHAR(255) REFERENCES nodes(node_id),

    -- Tool details
    tool_name VARCHAR(100) NOT NULL, -- 'bash', 'edit', 'write', 'read', 'grep', 'web_search', 'turbo_upload'
    tool_category VARCHAR(50), -- 'file_operation', 'shell_command', 'deployment', 'search', 'analysis'

    -- Usage details
    invocation_count INTEGER DEFAULT 1,
    total_duration_ms INTEGER,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,

    -- Parameters (store as JSON)
    parameters JSONB,

    -- Results
    result_summary TEXT,

    -- Timing
    first_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_tool_session (session_id),
    INDEX idx_tool_name (tool_name),
    INDEX idx_tool_node (node_id)
);

-- =====================================================
-- 5. COMMUNICATION LOG (AI ↔ User Interactions)
-- =====================================================

-- Track all messages between AI nodes and users
CREATE TABLE IF NOT EXISTS communication_log (
    message_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES work_sessions(session_id),
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    project_id VARCHAR(255) REFERENCES projects(project_id),

    -- Message details
    sender VARCHAR(50) NOT NULL, -- 'user', 'ai_node', 'system'
    message_type VARCHAR(50), -- 'question', 'instruction', 'response', 'clarification', 'error', 'status_update'
    message_content TEXT NOT NULL,

    -- Context
    token_count INTEGER, -- For cost tracking
    model_used VARCHAR(100), -- e.g., 'claude-sonnet-4-5-20250929'

    -- Metadata
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_message_id INTEGER REFERENCES communication_log(message_id), -- For threading

    INDEX idx_comm_session (session_id),
    INDEX idx_comm_node (node_id),
    INDEX idx_comm_sender (sender),
    INDEX idx_comm_timestamp (timestamp)
);

-- =====================================================
-- 6. ERROR LOG
-- =====================================================

-- Track all errors encountered during work sessions
CREATE TABLE IF NOT EXISTS error_log (
    error_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES work_sessions(session_id),
    task_id INTEGER REFERENCES work_tasks(task_id),
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    project_id VARCHAR(255) REFERENCES projects(project_id),

    -- Error details
    error_type VARCHAR(100) NOT NULL, -- 'compilation_error', 'runtime_error', 'deployment_error', 'api_error', 'timeout'
    error_message TEXT NOT NULL,
    error_stack_trace TEXT,

    -- Context
    file_path VARCHAR(1024), -- File where error occurred
    line_number INTEGER,
    function_name VARCHAR(255),

    -- Resolution
    resolved BOOLEAN DEFAULT false,
    resolution_task_id INTEGER REFERENCES work_tasks(task_id),
    resolution_notes TEXT,

    -- Timing
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,

    INDEX idx_error_session (session_id),
    INDEX idx_error_type (error_type),
    INDEX idx_error_resolved (resolved)
);

-- =====================================================
-- 7. WORK METRICS SUMMARY (Aggregated)
-- =====================================================

-- Daily work metrics per node (materialized for performance)
CREATE TABLE IF NOT EXISTS work_metrics_daily (
    metric_id SERIAL PRIMARY KEY,
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    metric_date DATE NOT NULL,

    -- Session metrics
    sessions_started INTEGER DEFAULT 0,
    sessions_completed INTEGER DEFAULT 0,
    sessions_failed INTEGER DEFAULT 0,
    total_session_duration_seconds INTEGER DEFAULT 0,

    -- Task metrics
    tasks_completed INTEGER DEFAULT 0,
    tasks_failed INTEGER DEFAULT 0,
    avg_task_duration_seconds INTEGER,

    -- Code metrics
    files_created INTEGER DEFAULT 0,
    files_modified INTEGER DEFAULT 0,
    files_deleted INTEGER DEFAULT 0,
    total_lines_added INTEGER DEFAULT 0,
    total_lines_deleted INTEGER DEFAULT 0,

    -- Tool usage
    total_tool_invocations INTEGER DEFAULT 0,
    unique_tools_used INTEGER DEFAULT 0,

    -- Communication
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    total_tokens_used INTEGER DEFAULT 0,

    -- Errors
    errors_encountered INTEGER DEFAULT 0,
    errors_resolved INTEGER DEFAULT 0,

    -- Costs (integrated from deployment_costs)
    total_deployment_costs_usd DECIMAL(10, 4) DEFAULT 0,

    -- Earnings (integrated from node_earnings)
    total_earnings_usd DECIMAL(10, 4) DEFAULT 0,

    -- Calculated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (node_id, metric_date),
    INDEX idx_metrics_node_date (node_id, metric_date)
);

-- =====================================================
-- 8. WORK HISTORY VIEWS
-- =====================================================

-- Active work sessions
CREATE OR REPLACE VIEW active_work_sessions AS
SELECT
    ws.session_id,
    ws.node_id,
    n.node_name,
    ws.project_id,
    p.project_name,
    ws.session_type,
    ws.started_at,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - ws.started_at))::INTEGER as duration_seconds,
    COUNT(DISTINCT wt.task_id) as tasks_count,
    COUNT(DISTINCT CASE WHEN wt.status = 'completed' THEN wt.task_id END) as tasks_completed,
    COUNT(DISTINCT CASE WHEN wt.status = 'failed' THEN wt.task_id END) as tasks_failed
FROM work_sessions ws
JOIN nodes n ON ws.node_id = n.node_id
JOIN projects p ON ws.project_id = p.project_id
LEFT JOIN work_tasks wt ON ws.session_id = wt.session_id
WHERE ws.status = 'in-progress'
GROUP BY ws.session_id, ws.node_id, n.node_name, ws.project_id, p.project_name, ws.session_type, ws.started_at;

-- Node productivity summary
CREATE OR REPLACE VIEW node_productivity_summary AS
SELECT
    n.node_id,
    n.node_name,

    -- Sessions
    COUNT(DISTINCT ws.session_id) as total_sessions,
    COUNT(DISTINCT CASE WHEN ws.status = 'completed' THEN ws.session_id END) as completed_sessions,
    AVG(ws.total_duration_seconds) as avg_session_duration_seconds,

    -- Tasks
    COUNT(DISTINCT wt.task_id) as total_tasks,
    COUNT(DISTINCT CASE WHEN wt.status = 'completed' THEN wt.task_id END) as completed_tasks,
    ROUND(COUNT(DISTINCT CASE WHEN wt.status = 'completed' THEN wt.task_id END)::DECIMAL /
          NULLIF(COUNT(DISTINCT wt.task_id), 0) * 100, 1) as task_success_rate_pct,

    -- Code output
    SUM(wt.lines_added) as total_lines_added,
    SUM(wt.lines_deleted) as total_lines_deleted,

    -- Files
    COUNT(DISTINCT CASE WHEN fc.change_type = 'created' THEN fc.file_path END) as files_created,
    COUNT(DISTINCT CASE WHEN fc.change_type = 'modified' THEN fc.file_path END) as files_modified,

    -- Efficiency
    ROUND(AVG(wt.duration_seconds), 0) as avg_task_duration_seconds,
    ROUND(SUM(wt.lines_added)::DECIMAL / NULLIF(SUM(wt.duration_seconds) / 3600.0, 0), 0) as lines_per_hour

FROM nodes n
LEFT JOIN work_sessions ws ON n.node_id = ws.node_id
LEFT JOIN work_tasks wt ON ws.session_id = wt.session_id
LEFT JOIN file_changes fc ON ws.session_id = fc.session_id
GROUP BY n.node_id, n.node_name;

-- Project work history
CREATE OR REPLACE VIEW project_work_history AS
SELECT
    p.project_id,
    p.project_name,
    COUNT(DISTINCT ws.session_id) as work_sessions,
    COUNT(DISTINCT ws.node_id) as nodes_involved,
    STRING_AGG(DISTINCT n.node_name, ', ') as node_names,
    MIN(ws.started_at) as work_started,
    MAX(ws.completed_at) as work_completed,
    SUM(ws.total_duration_seconds) as total_work_duration_seconds,
    COUNT(DISTINCT wt.task_id) as total_tasks,
    SUM(fc.lines_added) as total_lines_added,
    COUNT(DISTINCT fc.file_path) as files_affected
FROM projects p
LEFT JOIN work_sessions ws ON p.project_id = ws.project_id
LEFT JOIN nodes n ON ws.node_id = n.node_id
LEFT JOIN work_tasks wt ON ws.session_id = wt.session_id
LEFT JOIN file_changes fc ON ws.session_id = fc.session_id
GROUP BY p.project_id, p.project_name;

-- =====================================================
-- 9. WORK HISTORY QUERIES
-- =====================================================

-- Q1: Recent work sessions (last 24 hours)
SELECT
    ws.session_id,
    n.node_name,
    p.project_name,
    ws.session_type,
    ws.status,
    ws.started_at,
    ws.completed_at,
    EXTRACT(EPOCH FROM (COALESCE(ws.completed_at, CURRENT_TIMESTAMP) - ws.started_at))::INTEGER / 60 as duration_minutes
FROM work_sessions ws
JOIN nodes n ON ws.node_id = n.node_id
JOIN projects p ON ws.project_id = p.project_id
WHERE ws.started_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
ORDER BY ws.started_at DESC;

-- Q2: Node work activity timeline
SELECT
    n.node_id,
    n.node_name,
    DATE_TRUNC('day', ws.started_at) as work_date,
    COUNT(DISTINCT ws.session_id) as sessions,
    SUM(ws.total_duration_seconds) / 3600.0 as total_hours,
    COUNT(DISTINCT wt.task_id) as tasks_completed,
    SUM(fc.lines_added) as lines_added
FROM nodes n
JOIN work_sessions ws ON n.node_id = ws.node_id
LEFT JOIN work_tasks wt ON ws.session_id = wt.session_id AND wt.status = 'completed'
LEFT JOIN file_changes fc ON ws.session_id = fc.session_id
WHERE ws.started_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY n.node_id, n.node_name, DATE_TRUNC('day', ws.started_at)
ORDER BY work_date DESC, total_hours DESC;

-- Q3: Project development timeline
SELECT
    p.project_id,
    p.project_name,
    ws.session_id,
    n.node_name as developer,
    ws.started_at,
    ws.completed_at,
    ws.status,
    COUNT(wt.task_id) as tasks,
    SUM(fc.lines_added) as lines_added,
    ws.description
FROM projects p
JOIN work_sessions ws ON p.project_id = ws.project_id
JOIN nodes n ON ws.node_id = n.node_id
LEFT JOIN work_tasks wt ON ws.session_id = wt.session_id
LEFT JOIN file_changes fc ON ws.session_id = fc.session_id
WHERE p.project_id = 'proj-123' -- Replace with actual project ID
GROUP BY p.project_id, p.project_name, ws.session_id, n.node_name, ws.started_at, ws.completed_at, ws.status, ws.description
ORDER BY ws.started_at ASC;

-- Q4: Task breakdown for a work session
SELECT
    wt.task_id,
    wt.task_type,
    wt.task_name,
    wt.status,
    wt.started_at,
    wt.completed_at,
    wt.duration_seconds / 60 as duration_minutes,
    wt.lines_added,
    wt.lines_deleted,
    wt.success,
    wt.error_message
FROM work_tasks wt
WHERE wt.session_id = 1 -- Replace with actual session ID
ORDER BY wt.started_at ASC;

-- Q5: Most productive nodes (last 30 days)
SELECT
    node_id,
    node_name,
    completed_sessions,
    completed_tasks,
    task_success_rate_pct,
    total_lines_added,
    files_created + files_modified as files_changed,
    lines_per_hour
FROM node_productivity_summary
ORDER BY completed_tasks DESC, lines_per_hour DESC
LIMIT 10;

-- Q6: Tool usage analysis by node
SELECT
    n.node_id,
    n.node_name,
    tu.tool_name,
    SUM(tu.invocation_count) as total_invocations,
    SUM(tu.success_count) as successful_invocations,
    SUM(tu.failure_count) as failed_invocations,
    ROUND(SUM(tu.success_count)::DECIMAL / NULLIF(SUM(tu.invocation_count), 0) * 100, 1) as success_rate_pct,
    AVG(tu.total_duration_ms) as avg_duration_ms
FROM nodes n
JOIN tool_usage tu ON n.node_id = tu.node_id
GROUP BY n.node_id, n.node_name, tu.tool_name
ORDER BY total_invocations DESC;

-- Q7: Error analysis (most common errors)
SELECT
    error_type,
    COUNT(*) as occurrence_count,
    COUNT(CASE WHEN resolved THEN 1 END) as resolved_count,
    ROUND(COUNT(CASE WHEN resolved THEN 1 END)::DECIMAL / COUNT(*) * 100, 1) as resolution_rate_pct,
    AVG(EXTRACT(EPOCH FROM (resolved_at - occurred_at)) / 60) as avg_resolution_time_minutes
FROM error_log
WHERE occurred_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY error_type
ORDER BY occurrence_count DESC;

-- Q8: Communication patterns (messages per session)
SELECT
    ws.session_id,
    p.project_name,
    n.node_name,
    COUNT(cl.message_id) as total_messages,
    COUNT(CASE WHEN cl.sender = 'user' THEN 1 END) as user_messages,
    COUNT(CASE WHEN cl.sender = 'ai_node' THEN 1 END) as ai_messages,
    SUM(cl.token_count) as total_tokens,
    ws.started_at,
    ws.completed_at
FROM work_sessions ws
JOIN projects p ON ws.project_id = p.project_id
JOIN nodes n ON ws.node_id = n.node_id
LEFT JOIN communication_log cl ON ws.session_id = cl.session_id
GROUP BY ws.session_id, p.project_name, n.node_name, ws.started_at, ws.completed_at
ORDER BY ws.started_at DESC
LIMIT 20;

-- Q9: Files most frequently modified
SELECT
    fc.file_path,
    COUNT(DISTINCT fc.session_id) as sessions_modified,
    COUNT(fc.change_id) as total_changes,
    SUM(fc.lines_added) as total_lines_added,
    SUM(fc.lines_deleted) as total_lines_deleted,
    MAX(fc.timestamp) as last_modified,
    STRING_AGG(DISTINCT n.node_name, ', ') as nodes_modified_by
FROM file_changes fc
JOIN nodes n ON fc.node_id = n.node_id
GROUP BY fc.file_path
ORDER BY total_changes DESC
LIMIT 50;

-- Q10: Integrated work & profit analysis
SELECT
    n.node_id,
    n.node_name,

    -- Work metrics
    COUNT(DISTINCT ws.session_id) as work_sessions,
    SUM(ws.total_duration_seconds) / 3600.0 as total_work_hours,
    COUNT(DISTINCT wt.task_id) as tasks_completed,
    SUM(fc.lines_added) as lines_added,

    -- Financial metrics
    COALESCE(SUM(dc.amount_usd), 0) as deployment_costs_usd,
    COALESCE(SUM(ne.amount_usd), 0) as earnings_usd,
    COALESCE(SUM(ne.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0) as net_profit_usd,

    -- Efficiency
    ROUND(COALESCE(SUM(ne.amount_usd), 0) / NULLIF(SUM(ws.total_duration_seconds) / 3600.0, 0), 2) as earnings_per_hour,
    ROUND(SUM(fc.lines_added)::DECIMAL / NULLIF(SUM(ws.total_duration_seconds) / 3600.0, 0), 0) as lines_per_hour

FROM nodes n
LEFT JOIN work_sessions ws ON n.node_id = ws.node_id AND ws.status = 'completed'
LEFT JOIN work_tasks wt ON ws.session_id = wt.session_id AND wt.status = 'completed'
LEFT JOIN file_changes fc ON ws.session_id = fc.session_id
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
LEFT JOIN node_earnings ne ON n.node_id = ne.node_id AND ne.payment_status = 'paid'
WHERE ws.started_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY n.node_id, n.node_name
ORDER BY net_profit_usd DESC;

-- =====================================================
-- 10. EXAMPLE DATA INSERTION
-- =====================================================

-- Insert example work session
INSERT INTO work_sessions (
    node_id,
    project_id,
    session_type,
    status,
    started_at,
    completed_at,
    total_duration_seconds,
    description,
    initial_prompt,
    environment
)
VALUES (
    'alex-architect-ai',
    'proj-123',
    'development',
    'completed',
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    CURRENT_TIMESTAMP - INTERVAL '15 minutes',
    6300, -- 1 hour 45 minutes
    'Built full-stack e-commerce platform with payment integration',
    'Create a modern e-commerce website with Stripe payments',
    'production'
);

-- Insert example tasks
INSERT INTO work_tasks (
    session_id,
    node_id,
    project_id,
    task_type,
    task_name,
    status,
    started_at,
    completed_at,
    duration_seconds,
    lines_added,
    lines_deleted,
    success
)
VALUES
(1, 'alex-architect-ai', 'proj-123', 'code_generation', 'Create React frontend', 'completed',
 CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes', 1800, 450, 0, true),
(1, 'alex-architect-ai', 'proj-123', 'code_generation', 'Build Express backend API', 'completed',
 CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes', CURRENT_TIMESTAMP - INTERVAL '45 minutes', 2700, 320, 0, true),
(1, 'alex-architect-ai', 'proj-123', 'deployment', 'Deploy to Arweave + Akash', 'completed',
 CURRENT_TIMESTAMP - INTERVAL '45 minutes', CURRENT_TIMESTAMP - INTERVAL '15 minutes', 1800, 0, 0, true);

-- Insert example file changes
INSERT INTO file_changes (
    task_id,
    session_id,
    node_id,
    project_id,
    file_path,
    change_type,
    lines_added,
    lines_deleted
)
VALUES
(1, 1, 'alex-architect-ai', 'proj-123', 'src/App.tsx', 'created', 150, 0),
(1, 1, 'alex-architect-ai', 'proj-123', 'src/components/ProductList.tsx', 'created', 120, 0),
(2, 1, 'alex-architect-ai', 'proj-123', 'server/api/products.ts', 'created', 200, 0),
(2, 1, 'alex-architect-ai', 'proj-123', 'server/api/payments.ts', 'created', 120, 0);

-- =====================================================
-- 11. AUTOMATED METRICS AGGREGATION
-- =====================================================

-- Function to update daily work metrics
CREATE OR REPLACE FUNCTION update_daily_work_metrics(target_date DATE)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    INSERT INTO work_metrics_daily (
        node_id,
        metric_date,
        sessions_started,
        sessions_completed,
        sessions_failed,
        total_session_duration_seconds,
        tasks_completed,
        tasks_failed,
        files_created,
        files_modified,
        files_deleted,
        total_lines_added,
        total_lines_deleted,
        total_tool_invocations,
        messages_sent,
        total_tokens_used,
        errors_encountered,
        errors_resolved,
        total_deployment_costs_usd,
        total_earnings_usd
    )
    SELECT
        n.node_id,
        target_date,
        COUNT(DISTINCT CASE WHEN DATE(ws.started_at) = target_date THEN ws.session_id END),
        COUNT(DISTINCT CASE WHEN DATE(ws.completed_at) = target_date AND ws.status = 'completed' THEN ws.session_id END),
        COUNT(DISTINCT CASE WHEN DATE(ws.completed_at) = target_date AND ws.status = 'failed' THEN ws.session_id END),
        COALESCE(SUM(CASE WHEN DATE(ws.completed_at) = target_date THEN ws.total_duration_seconds END), 0),
        COUNT(DISTINCT CASE WHEN DATE(wt.completed_at) = target_date AND wt.status = 'completed' THEN wt.task_id END),
        COUNT(DISTINCT CASE WHEN DATE(wt.completed_at) = target_date AND wt.status = 'failed' THEN wt.task_id END),
        COUNT(CASE WHEN DATE(fc.timestamp) = target_date AND fc.change_type = 'created' THEN 1 END),
        COUNT(CASE WHEN DATE(fc.timestamp) = target_date AND fc.change_type = 'modified' THEN 1 END),
        COUNT(CASE WHEN DATE(fc.timestamp) = target_date AND fc.change_type = 'deleted' THEN 1 END),
        COALESCE(SUM(CASE WHEN DATE(fc.timestamp) = target_date THEN fc.lines_added END), 0),
        COALESCE(SUM(CASE WHEN DATE(fc.timestamp) = target_date THEN fc.lines_deleted END), 0),
        COALESCE(SUM(CASE WHEN DATE(tu.first_used_at) = target_date THEN tu.invocation_count END), 0),
        COUNT(CASE WHEN DATE(cl.timestamp) = target_date AND cl.sender = 'ai_node' THEN 1 END),
        COALESCE(SUM(CASE WHEN DATE(cl.timestamp) = target_date THEN cl.token_count END), 0),
        COUNT(CASE WHEN DATE(el.occurred_at) = target_date THEN 1 END),
        COUNT(CASE WHEN DATE(el.resolved_at) = target_date THEN 1 END),
        COALESCE(SUM(CASE WHEN DATE(dc.created_at) = target_date THEN dc.amount_usd END), 0),
        COALESCE(SUM(CASE WHEN DATE(ne.earned_at) = target_date AND ne.payment_status = 'paid' THEN ne.amount_usd END), 0)
    FROM nodes n
    LEFT JOIN work_sessions ws ON n.node_id = ws.node_id
    LEFT JOIN work_tasks wt ON n.node_id = wt.node_id
    LEFT JOIN file_changes fc ON n.node_id = fc.node_id
    LEFT JOIN tool_usage tu ON n.node_id = tu.node_id
    LEFT JOIN communication_log cl ON n.node_id = cl.node_id
    LEFT JOIN error_log el ON n.node_id = el.node_id
    LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
    LEFT JOIN node_earnings ne ON n.node_id = ne.node_id
    GROUP BY n.node_id
    ON CONFLICT (node_id, metric_date)
    DO UPDATE SET
        sessions_started = EXCLUDED.sessions_started,
        sessions_completed = EXCLUDED.sessions_completed,
        sessions_failed = EXCLUDED.sessions_failed,
        total_session_duration_seconds = EXCLUDED.total_session_duration_seconds,
        tasks_completed = EXCLUDED.tasks_completed,
        tasks_failed = EXCLUDED.tasks_failed,
        files_created = EXCLUDED.files_created,
        files_modified = EXCLUDED.files_modified,
        files_deleted = EXCLUDED.files_deleted,
        total_lines_added = EXCLUDED.total_lines_added,
        total_lines_deleted = EXCLUDED.total_lines_deleted,
        total_tool_invocations = EXCLUDED.total_tool_invocations,
        messages_sent = EXCLUDED.messages_sent,
        total_tokens_used = EXCLUDED.total_tokens_used,
        errors_encountered = EXCLUDED.errors_encountered,
        errors_resolved = EXCLUDED.errors_resolved,
        total_deployment_costs_usd = EXCLUDED.total_deployment_costs_usd,
        total_earnings_usd = EXCLUDED.total_earnings_usd,
        updated_at = CURRENT_TIMESTAMP;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule daily metrics update (run at midnight)
-- SELECT update_daily_work_metrics(CURRENT_DATE - INTERVAL '1 day');
