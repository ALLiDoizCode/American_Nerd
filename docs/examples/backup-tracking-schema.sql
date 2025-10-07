-- =====================================================
-- Arweave Database Backup Tracking Schema
-- =====================================================
-- Tracks database backups stored on Arweave for audit and restore purposes

-- =====================================================
-- 1. BACKUP METADATA TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS arweave_backups (
    backup_id VARCHAR(255) PRIMARY KEY,

    -- Arweave storage details
    tx_id VARCHAR(64) NOT NULL UNIQUE,
    arweave_url VARCHAR(255) NOT NULL,

    -- Backup details
    backup_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'schema-only', 'data-only'
    database_name VARCHAR(255) NOT NULL,

    -- File information
    file_size_bytes BIGINT NOT NULL,
    compressed_size_bytes BIGINT NOT NULL,
    compression_ratio DECIMAL(5, 2), -- Percentage saved by compression

    -- Security
    encrypted BOOLEAN DEFAULT false,
    encryption_algorithm VARCHAR(50), -- 'aes-256-cbc', etc.
    checksum_sha256 VARCHAR(64) NOT NULL,

    -- Cost tracking
    cost_winc VARCHAR(50),
    cost_sol DECIMAL(20, 10),
    cost_usd DECIMAL(10, 4),

    -- Lifecycle
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- Soft expiry for metadata cleanup (data on Arweave is permanent)

    -- Restore testing
    restorable BOOLEAN DEFAULT true,
    restore_tested_at TIMESTAMP,
    last_restore_test_status VARCHAR(50), -- 'success', 'failed', 'not-tested'

    -- Metadata
    tags JSONB, -- Arweave tags stored as JSON
    notes TEXT,

    INDEX idx_backups_created (created_at),
    INDEX idx_backups_type (backup_type),
    INDEX idx_backups_restorable (restorable)
);

-- =====================================================
-- 2. BACKUP SCHEDULE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS backup_schedules (
    schedule_id SERIAL PRIMARY KEY,

    -- Schedule details
    schedule_name VARCHAR(255) NOT NULL,
    schedule_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly'
    backup_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', etc.

    -- Configuration
    enabled BOOLEAN DEFAULT true,
    compression_enabled BOOLEAN DEFAULT true,
    encryption_enabled BOOLEAN DEFAULT true,

    -- Schedule timing
    cron_expression VARCHAR(100), -- Cron format: '0 2 * * *' (daily at 2 AM)
    timezone VARCHAR(50) DEFAULT 'UTC',

    -- Last execution
    last_run_at TIMESTAMP,
    last_backup_id VARCHAR(255) REFERENCES arweave_backups(backup_id),
    last_run_status VARCHAR(50), -- 'success', 'failed', 'running'

    -- Next scheduled run
    next_run_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_schedule_next_run (next_run_at),
    INDEX idx_schedule_enabled (enabled)
);

-- =====================================================
-- 3. BACKUP RESTORE LOG TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS backup_restore_log (
    restore_id SERIAL PRIMARY KEY,
    backup_id VARCHAR(255) REFERENCES arweave_backups(backup_id),

    -- Restore details
    restore_type VARCHAR(50), -- 'full', 'partial', 'test'
    target_database VARCHAR(255),

    -- Status
    status VARCHAR(50) NOT NULL, -- 'started', 'in-progress', 'completed', 'failed'
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,

    -- Results
    rows_restored BIGINT,
    tables_restored INTEGER,
    error_message TEXT,

    -- Metadata
    restored_by VARCHAR(255), -- User/system that initiated restore
    notes TEXT,

    INDEX idx_restore_backup (backup_id),
    INDEX idx_restore_status (status),
    INDEX idx_restore_date (started_at)
);

-- =====================================================
-- 4. BACKUP COST TRACKING VIEW
-- =====================================================

-- Total backup costs over time
CREATE OR REPLACE VIEW backup_costs_summary AS
SELECT
    DATE_TRUNC('month', created_at) as month,
    backup_type,
    COUNT(*) as backup_count,
    SUM(file_size_bytes) / 1024.0 / 1024.0 / 1024.0 as total_gb_backed_up,
    SUM(compressed_size_bytes) / 1024.0 / 1024.0 / 1024.0 as total_gb_stored,
    SUM(cost_sol) as total_cost_sol,
    SUM(cost_usd) as total_cost_usd,
    AVG(compression_ratio) as avg_compression_ratio
FROM arweave_backups
GROUP BY DATE_TRUNC('month', created_at), backup_type
ORDER BY month DESC, backup_type;

-- =====================================================
-- 5. BACKUP QUERIES
-- =====================================================

-- Q1: List all backups (most recent first)
SELECT
    backup_id,
    backup_type,
    database_name,
    compressed_size_bytes / 1024.0 / 1024.0 as size_mb,
    cost_usd,
    created_at,
    restorable,
    arweave_url
FROM arweave_backups
ORDER BY created_at DESC
LIMIT 50;

-- Q2: Find backups by date range
SELECT
    backup_id,
    backup_type,
    created_at,
    arweave_url
FROM arweave_backups
WHERE created_at >= '2025-01-01'
  AND created_at < '2025-02-01'
ORDER BY created_at ASC;

-- Q3: Check backup health (untested backups)
SELECT
    backup_id,
    backup_type,
    created_at,
    restore_tested_at,
    CASE
        WHEN restore_tested_at IS NULL THEN 'Never tested'
        WHEN restore_tested_at < CURRENT_DATE - INTERVAL '90 days' THEN 'Needs testing'
        ELSE 'Recently tested'
    END as test_status
FROM arweave_backups
WHERE restorable = true
ORDER BY created_at DESC;

-- Q4: Monthly backup costs
SELECT
    TO_CHAR(month, 'YYYY-MM') as month,
    backup_count,
    ROUND(total_gb_stored, 2) as gb_stored,
    ROUND(total_cost_usd, 2) as cost_usd,
    ROUND(avg_compression_ratio, 1) as avg_compression_pct
FROM backup_costs_summary
WHERE month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
ORDER BY month DESC;

-- Q5: Find latest full backup
SELECT
    backup_id,
    tx_id,
    arweave_url,
    created_at,
    compressed_size_bytes / 1024.0 / 1024.0 as size_mb
FROM arweave_backups
WHERE backup_type = 'full'
  AND restorable = true
ORDER BY created_at DESC
LIMIT 1;

-- Q6: Restore history for a backup
SELECT
    rl.restore_id,
    rl.restore_type,
    rl.status,
    rl.started_at,
    rl.completed_at,
    rl.duration_seconds,
    rl.rows_restored,
    rl.tables_restored,
    rl.error_message
FROM backup_restore_log rl
WHERE rl.backup_id = 'db-backup-full-2025-10-07T10-30-00'
ORDER BY rl.started_at DESC;

-- Q7: Backup schedule status
SELECT
    schedule_name,
    schedule_type,
    enabled,
    last_run_at,
    last_run_status,
    next_run_at,
    CASE
        WHEN next_run_at < CURRENT_TIMESTAMP AND enabled = true THEN 'Overdue'
        WHEN enabled = false THEN 'Disabled'
        ELSE 'Scheduled'
    END as status
FROM backup_schedules
ORDER BY next_run_at ASC;

-- Q8: Storage efficiency (compression ratios)
SELECT
    backup_type,
    COUNT(*) as backup_count,
    AVG(compression_ratio) as avg_compression_pct,
    MIN(compression_ratio) as min_compression_pct,
    MAX(compression_ratio) as max_compression_pct
FROM arweave_backups
GROUP BY backup_type
ORDER BY avg_compression_pct DESC;

-- Q9: Backup reliability (restore success rate)
SELECT
    ab.backup_type,
    COUNT(DISTINCT ab.backup_id) as total_backups,
    COUNT(DISTINCT CASE WHEN rl.status = 'completed' THEN rl.backup_id END) as successful_restores,
    COUNT(DISTINCT CASE WHEN rl.status = 'failed' THEN rl.backup_id END) as failed_restores,
    ROUND(
        COUNT(DISTINCT CASE WHEN rl.status = 'completed' THEN rl.backup_id END)::DECIMAL /
        NULLIF(COUNT(DISTINCT ab.backup_id), 0) * 100,
        1
    ) as restore_success_rate_pct
FROM arweave_backups ab
LEFT JOIN backup_restore_log rl ON ab.backup_id = rl.backup_id
GROUP BY ab.backup_type;

-- Q10: Total backup costs (all-time)
SELECT
    COUNT(*) as total_backups,
    SUM(file_size_bytes) / 1024.0 / 1024.0 / 1024.0 as total_original_gb,
    SUM(compressed_size_bytes) / 1024.0 / 1024.0 / 1024.0 as total_stored_gb,
    SUM(cost_sol) as total_cost_sol,
    SUM(cost_usd) as total_cost_usd,
    AVG(cost_usd) as avg_cost_per_backup_usd
FROM arweave_backups;

-- =====================================================
-- 6. EXAMPLE DATA INSERTION
-- =====================================================

-- Insert example backup record
INSERT INTO arweave_backups (
    backup_id,
    tx_id,
    arweave_url,
    backup_type,
    database_name,
    file_size_bytes,
    compressed_size_bytes,
    compression_ratio,
    encrypted,
    encryption_algorithm,
    checksum_sha256,
    cost_winc,
    cost_sol,
    cost_usd,
    created_at,
    restorable,
    tags
)
VALUES (
    'db-backup-full-2025-10-07T10-30-00',
    '5x7abc123def456...',
    'https://arweave.net/5x7abc123def456...',
    'full',
    'slopmachine',
    524288000, -- 500 MB original
    157286400, -- 150 MB compressed
    70.0, -- 70% compression ratio
    true,
    'aes-256-cbc',
    'a1b2c3d4e5f6...',
    '1350000000', -- Winston credits
    0.000180, -- SOL
    0.036, -- USD
    CURRENT_TIMESTAMP,
    true,
    '{"Environment": "production", "Retention-Days": "90"}'::jsonb
);

-- Insert example backup schedule
INSERT INTO backup_schedules (
    schedule_name,
    schedule_type,
    backup_type,
    enabled,
    compression_enabled,
    encryption_enabled,
    cron_expression,
    timezone,
    next_run_at
)
VALUES (
    'Daily Full Backup',
    'daily',
    'full',
    true,
    true,
    true,
    '0 2 * * *', -- Every day at 2 AM
    'UTC',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '2 hours'
);

-- Insert example restore log
INSERT INTO backup_restore_log (
    backup_id,
    restore_type,
    target_database,
    status,
    started_at,
    completed_at,
    duration_seconds,
    rows_restored,
    tables_restored,
    restored_by
)
VALUES (
    'db-backup-full-2025-10-07T10-30-00',
    'test',
    'slopmachine_test',
    'completed',
    CURRENT_TIMESTAMP - INTERVAL '10 minutes',
    CURRENT_TIMESTAMP - INTERVAL '5 minutes',
    300, -- 5 minutes
    1000000,
    25,
    'backup-test-automation'
);

-- =====================================================
-- 7. AUTOMATED BACKUP CLEANUP (Metadata Only)
-- =====================================================
-- Note: Arweave data is permanent, this only cleans up metadata

-- Function to mark old backup metadata as expired
CREATE OR REPLACE FUNCTION mark_expired_backups()
RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    UPDATE arweave_backups
    SET expires_at = created_at + INTERVAL '90 days'
    WHERE expires_at IS NULL
      AND created_at < CURRENT_DATE - INTERVAL '90 days';

    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run monthly)
-- SELECT mark_expired_backups();
