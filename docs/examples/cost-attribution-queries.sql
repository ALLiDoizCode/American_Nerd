-- =====================================================
-- Multi-Chain Deployment Cost Tracking Database Schema
-- =====================================================
-- This SQL file defines the database schema and queries for tracking
-- deployment costs across Solana (Arweave) and Cosmos (Akash) chains

-- =====================================================
-- 1. DATABASE SCHEMA
-- =====================================================

-- Nodes table
CREATE TABLE IF NOT EXISTS nodes (
    node_id VARCHAR(255) PRIMARY KEY,
    node_name VARCHAR(255) NOT NULL,
    solana_address VARCHAR(88), -- Base58 Solana public key
    akash_address VARCHAR(63),  -- Bech32 Akash address
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    project_id VARCHAR(255) PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    owner_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deployments table
CREATE TABLE IF NOT EXISTS deployments (
    deployment_id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) REFERENCES projects(project_id),
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    deployment_type VARCHAR(50) NOT NULL, -- 'arweave-frontend' or 'akash-backend'
    environment VARCHAR(50) NOT NULL, -- 'production', 'staging', 'development'
    status VARCHAR(50) DEFAULT 'pending',
    deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cost records table (multi-chain)
CREATE TABLE IF NOT EXISTS deployment_costs (
    cost_id SERIAL PRIMARY KEY,
    deployment_id VARCHAR(255) REFERENCES deployments(deployment_id),
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    project_id VARCHAR(255) REFERENCES projects(project_id),

    -- Chain and transaction info
    chain VARCHAR(50) NOT NULL, -- 'solana' or 'akash'
    tx_hash VARCHAR(128) NOT NULL,

    -- Cost information
    amount_native DECIMAL(20, 10) NOT NULL, -- Amount in native token (SOL or AKT)
    amount_usd DECIMAL(10, 4), -- USD equivalent at time of transaction

    -- Additional metadata
    deployment_type VARCHAR(50), -- 'arweave-frontend', 'akash-backend', 'akash-ai-worker'
    resource_details JSONB, -- Store size, duration, etc.

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes for fast queries
    CONSTRAINT unique_tx_hash UNIQUE (chain, tx_hash)
);

-- Arweave-specific cost details
CREATE TABLE IF NOT EXISTS arweave_uploads (
    upload_id SERIAL PRIMARY KEY,
    cost_id INTEGER REFERENCES deployment_costs(cost_id),
    deployment_id VARCHAR(255) REFERENCES deployments(deployment_id),

    -- Arweave transaction details
    tx_id VARCHAR(64) NOT NULL UNIQUE,
    arweave_url VARCHAR(255),

    -- File information
    file_size_bytes BIGINT NOT NULL,
    content_type VARCHAR(100),

    -- Cost breakdown
    cost_winc VARCHAR(50), -- Winston Credits
    cost_sol DECIMAL(20, 10),
    cost_usd DECIMAL(10, 4),

    -- Metadata
    tags JSONB,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Akash-specific cost details
CREATE TABLE IF NOT EXISTS akash_deployments (
    akash_deployment_id SERIAL PRIMARY KEY,
    cost_id INTEGER REFERENCES deployment_costs(cost_id),
    deployment_id VARCHAR(255) REFERENCES deployments(deployment_id),

    -- Akash deployment details
    dseq VARCHAR(50) NOT NULL, -- Deployment sequence number
    gseq VARCHAR(50), -- Group sequence number
    lease_id VARCHAR(100),

    -- Resource specifications
    cpu_units INTEGER,
    memory_mb INTEGER,
    storage_gb INTEGER,

    -- Cost information
    cost_per_block DECIMAL(20, 10),
    blocks_duration INTEGER,
    total_cost_akt DECIMAL(20, 10),
    total_cost_usd DECIMAL(10, 4),

    -- Lease details
    provider_address VARCHAR(63),
    lease_start TIMESTAMP,
    lease_end TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet balance snapshots (for monitoring)
CREATE TABLE IF NOT EXISTS wallet_balances (
    balance_id SERIAL PRIMARY KEY,
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    chain VARCHAR(50) NOT NULL,
    address VARCHAR(88) NOT NULL,
    balance DECIMAL(20, 10) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_wallet_time (address, chain, checked_at)
);

-- =====================================================
-- 2. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_costs_node ON deployment_costs(node_id, created_at);
CREATE INDEX idx_costs_project ON deployment_costs(project_id, created_at);
CREATE INDEX idx_costs_chain ON deployment_costs(chain, created_at);
CREATE INDEX idx_costs_deployment ON deployment_costs(deployment_id);
CREATE INDEX idx_arweave_deployment ON arweave_uploads(deployment_id);
CREATE INDEX idx_akash_deployment ON akash_deployments(deployment_id);

-- =====================================================
-- 3. COST ATTRIBUTION QUERIES
-- =====================================================

-- Q1: Total costs per node (all chains)
SELECT
    n.node_id,
    n.node_name,
    COUNT(DISTINCT dc.deployment_id) as total_deployments,
    SUM(CASE WHEN dc.chain = 'solana' THEN dc.amount_native ELSE 0 END) as total_sol_spent,
    SUM(CASE WHEN dc.chain = 'akash' THEN dc.amount_native ELSE 0 END) as total_akt_spent,
    SUM(dc.amount_usd) as total_usd_spent
FROM nodes n
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
GROUP BY n.node_id, n.node_name
ORDER BY total_usd_spent DESC;

-- Q2: Total costs per project
SELECT
    p.project_id,
    p.project_name,
    COUNT(DISTINCT dc.deployment_id) as total_deployments,
    SUM(CASE WHEN dc.chain = 'solana' THEN dc.amount_native ELSE 0 END) as total_sol_spent,
    SUM(CASE WHEN dc.chain = 'akash' THEN dc.amount_native ELSE 0 END) as total_akt_spent,
    SUM(dc.amount_usd) as total_usd_spent
FROM projects p
LEFT JOIN deployment_costs dc ON p.project_id = dc.project_id
GROUP BY p.project_id, p.project_name
ORDER BY total_usd_spent DESC;

-- Q3: Monthly costs breakdown by node
SELECT
    n.node_id,
    n.node_name,
    DATE_TRUNC('month', dc.created_at) as month,
    dc.chain,
    SUM(dc.amount_native) as total_native,
    SUM(dc.amount_usd) as total_usd,
    COUNT(*) as transaction_count
FROM nodes n
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
WHERE dc.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
GROUP BY n.node_id, n.node_name, DATE_TRUNC('month', dc.created_at), dc.chain
ORDER BY month DESC, total_usd DESC;

-- Q4: Detailed Arweave upload costs by node
SELECT
    n.node_id,
    n.node_name,
    au.tx_id,
    au.arweave_url,
    au.file_size_bytes / 1024.0 / 1024.0 as size_mb,
    au.cost_sol,
    au.cost_usd,
    au.uploaded_at,
    d.deployment_type,
    d.environment
FROM nodes n
JOIN deployment_costs dc ON n.node_id = dc.node_id
JOIN arweave_uploads au ON dc.cost_id = au.cost_id
JOIN deployments d ON au.deployment_id = d.deployment_id
WHERE dc.chain = 'solana'
ORDER BY au.uploaded_at DESC;

-- Q5: Detailed Akash deployment costs by node
SELECT
    n.node_id,
    n.node_name,
    ad.dseq,
    ad.lease_id,
    ad.cpu_units,
    ad.memory_mb,
    ad.storage_gb,
    ad.total_cost_akt,
    ad.total_cost_usd,
    ad.lease_start,
    ad.lease_end,
    EXTRACT(EPOCH FROM (ad.lease_end - ad.lease_start)) / 3600 as hours_duration,
    d.deployment_type,
    d.environment
FROM nodes n
JOIN deployment_costs dc ON n.node_id = dc.node_id
JOIN akash_deployments ad ON dc.cost_id = ad.cost_id
JOIN deployments d ON ad.deployment_id = d.deployment_id
WHERE dc.chain = 'akash'
ORDER BY ad.lease_start DESC;

-- Q6: Cost efficiency analysis (cost per MB for Arweave)
SELECT
    n.node_id,
    n.node_name,
    COUNT(au.upload_id) as total_uploads,
    SUM(au.file_size_bytes) / 1024.0 / 1024.0 as total_mb_uploaded,
    SUM(au.cost_usd) as total_cost_usd,
    (SUM(au.cost_usd) / NULLIF(SUM(au.file_size_bytes) / 1024.0 / 1024.0, 0)) as cost_per_mb_usd
FROM nodes n
JOIN deployment_costs dc ON n.node_id = dc.node_id
JOIN arweave_uploads au ON dc.cost_id = au.cost_id
GROUP BY n.node_id, n.node_name
HAVING COUNT(au.upload_id) > 0
ORDER BY cost_per_mb_usd ASC;

-- Q7: Cost efficiency analysis (cost per hour for Akash)
SELECT
    n.node_id,
    n.node_name,
    ad.deployment_type,
    AVG(ad.cpu_units) as avg_cpu,
    AVG(ad.memory_mb) as avg_memory_mb,
    AVG(ad.total_cost_usd / NULLIF(EXTRACT(EPOCH FROM (ad.lease_end - ad.lease_start)) / 3600, 0)) as avg_cost_per_hour_usd
FROM nodes n
JOIN deployment_costs dc ON n.node_id = dc.node_id
JOIN akash_deployments ad ON dc.cost_id = ad.cost_id
JOIN deployments d ON ad.deployment_id = d.deployment_id
WHERE ad.lease_end > ad.lease_start
GROUP BY n.node_id, n.node_name, ad.deployment_type
ORDER BY avg_cost_per_hour_usd ASC;

-- Q8: Node operating expenses (last 30 days)
SELECT
    n.node_id,
    n.node_name,
    SUM(CASE WHEN dc.chain = 'solana' THEN dc.amount_usd ELSE 0 END) as arweave_costs_usd,
    SUM(CASE WHEN dc.chain = 'akash' THEN dc.amount_usd ELSE 0 END) as akash_costs_usd,
    SUM(dc.amount_usd) as total_operating_expenses_usd
FROM nodes n
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
WHERE dc.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY n.node_id, n.node_name
ORDER BY total_operating_expenses_usd DESC;

-- Q9: Recent transactions for a specific node
SELECT
    dc.tx_hash,
    dc.chain,
    dc.amount_native,
    dc.amount_usd,
    dc.deployment_type,
    dc.created_at,
    CASE
        WHEN dc.chain = 'solana' THEN CONCAT('https://solscan.io/tx/', dc.tx_hash)
        WHEN dc.chain = 'akash' THEN CONCAT('https://www.mintscan.io/akash/txs/', dc.tx_hash)
    END as explorer_url
FROM deployment_costs dc
WHERE dc.node_id = 'alex-architect-ai' -- Replace with actual node ID
ORDER BY dc.created_at DESC
LIMIT 50;

-- Q10: Cost forecast (based on last 30 days average)
SELECT
    n.node_id,
    n.node_name,
    AVG(dc.amount_usd) as avg_daily_cost_usd,
    AVG(dc.amount_usd) * 30 as projected_monthly_cost_usd,
    AVG(dc.amount_usd) * 365 as projected_yearly_cost_usd
FROM nodes n
JOIN deployment_costs dc ON n.node_id = dc.node_id
WHERE dc.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY n.node_id, n.node_name
ORDER BY projected_monthly_cost_usd DESC;

-- =====================================================
-- 4. EXAMPLE DATA INSERTION
-- =====================================================

-- Insert example node
INSERT INTO nodes (node_id, node_name, solana_address, akash_address)
VALUES (
    'alex-architect-ai',
    'Alex the Architect AI',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    'akash1abc123xyz789...'
);

-- Insert example project
INSERT INTO projects (project_id, project_name, owner_id)
VALUES ('proj-123', 'E-commerce Platform', 'user-456');

-- Insert example deployment
INSERT INTO deployments (deployment_id, project_id, node_id, deployment_type, environment, status)
VALUES ('deploy-001', 'proj-123', 'alex-architect-ai', 'arweave-frontend', 'production', 'completed');

-- Insert example Arweave upload cost
INSERT INTO deployment_costs (deployment_id, node_id, project_id, chain, tx_hash, amount_native, amount_usd, deployment_type)
VALUES ('deploy-001', 'alex-architect-ai', 'proj-123', 'solana', '5x7abc123...', 0.000012, 0.0024, 'arweave-frontend');

-- Insert Arweave upload details
INSERT INTO arweave_uploads (cost_id, deployment_id, tx_id, arweave_url, file_size_bytes, cost_winc, cost_sol, cost_usd)
VALUES (
    (SELECT cost_id FROM deployment_costs WHERE tx_hash = '5x7abc123...'),
    'deploy-001',
    '5x7abc123...',
    'https://arweave.net/5x7abc123...',
    1024000,
    '9000000',
    0.000012,
    0.0024
);

-- Insert example Akash deployment cost
INSERT INTO deployment_costs (deployment_id, node_id, project_id, chain, tx_hash, amount_native, amount_usd, deployment_type)
VALUES ('deploy-002', 'alex-architect-ai', 'proj-123', 'akash', 'ABC123...', 0.5, 1.50, 'akash-backend');

-- Insert Akash deployment details
INSERT INTO akash_deployments (
    cost_id, deployment_id, dseq, lease_id,
    cpu_units, memory_mb, storage_gb,
    total_cost_akt, total_cost_usd,
    lease_start, lease_end
)
VALUES (
    (SELECT cost_id FROM deployment_costs WHERE tx_hash = 'ABC123...'),
    'deploy-002',
    '12345',
    'akash1.../12345/1/1',
    1000,
    512,
    1,
    0.5,
    1.50,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '30 days'
);

-- =====================================================
-- 5. MONITORING QUERIES
-- =====================================================

-- Check wallets that need refilling
SELECT
    n.node_id,
    n.node_name,
    wb.chain,
    wb.address,
    wb.balance,
    wb.symbol,
    wb.checked_at,
    CASE
        WHEN wb.chain = 'solana' AND wb.balance < 0.1 THEN 'LOW'
        WHEN wb.chain = 'akash' AND wb.balance < 10 THEN 'LOW'
        ELSE 'OK'
    END as status
FROM wallet_balances wb
JOIN nodes n ON wb.node_id = n.node_id
WHERE wb.checked_at = (
    SELECT MAX(checked_at)
    FROM wallet_balances wb2
    WHERE wb2.address = wb.address AND wb2.chain = wb.chain
)
ORDER BY wb.checked_at DESC;
