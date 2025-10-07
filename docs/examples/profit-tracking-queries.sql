-- =====================================================
-- Node Profit Tracking Schema Extension
-- =====================================================
-- Extends the cost tracking database with revenue/earnings tracking
-- to calculate node profitability and P&L statements

-- =====================================================
-- 1. REVENUE TRACKING TABLES
-- =====================================================

-- Node earnings from completed projects
CREATE TABLE IF NOT EXISTS node_earnings (
    earning_id SERIAL PRIMARY KEY,
    node_id VARCHAR(255) REFERENCES nodes(node_id),
    project_id VARCHAR(255) REFERENCES projects(project_id),
    deployment_id VARCHAR(255) REFERENCES deployments(deployment_id),

    -- Earnings breakdown
    amount_sol DECIMAL(20, 10), -- Earnings in SOL (if paid in SOL)
    amount_akt DECIMAL(20, 10), -- Earnings in AKT (if paid in AKT)
    amount_usd DECIMAL(10, 4) NOT NULL, -- USD equivalent at payment time

    -- Payment details
    payment_type VARCHAR(50) NOT NULL, -- 'project_completion', 'milestone', 'subscription', 'bonus'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed'

    -- Transaction info
    tx_hash VARCHAR(128), -- On-chain payment transaction hash
    chain VARCHAR(50), -- 'solana' or 'akash' if paid on-chain

    -- Metadata
    description TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,

    INDEX idx_earnings_node (node_id, earned_at),
    INDEX idx_earnings_project (project_id),
    INDEX idx_earnings_status (payment_status)
);

-- Revenue from marketplace fees (platform-level)
CREATE TABLE IF NOT EXISTS marketplace_revenue (
    revenue_id SERIAL PRIMARY KEY,

    -- Revenue source
    project_id VARCHAR(255) REFERENCES projects(project_id),
    user_id VARCHAR(255),

    -- Revenue breakdown
    amount_sol DECIMAL(20, 10),
    amount_akt DECIMAL(20, 10),
    amount_usd DECIMAL(10, 4) NOT NULL,

    -- Fee details
    fee_type VARCHAR(50) NOT NULL, -- 'platform_fee', 'listing_fee', 'transaction_fee'
    fee_percentage DECIMAL(5, 2), -- e.g., 10.00 for 10%

    -- Transaction info
    tx_hash VARCHAR(128),
    chain VARCHAR(50),

    -- Metadata
    description TEXT,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_revenue_project (project_id),
    INDEX idx_revenue_type (fee_type, collected_at)
);

-- Subscription revenue (if nodes have monthly subscriptions)
CREATE TABLE IF NOT EXISTS subscription_revenue (
    subscription_id SERIAL PRIMARY KEY,
    node_id VARCHAR(255) REFERENCES nodes(node_id),

    -- Subscription details
    plan_type VARCHAR(50) NOT NULL, -- 'basic', 'pro', 'enterprise'
    amount_usd DECIMAL(10, 4) NOT NULL,

    -- Billing cycle
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,

    -- Payment status
    payment_status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP,

    INDEX idx_subscription_node (node_id),
    INDEX idx_subscription_period (billing_period_start, billing_period_end)
);

-- =====================================================
-- 2. PROFIT CALCULATION VIEWS
-- =====================================================

-- Per-node profit/loss summary
CREATE OR REPLACE VIEW node_profit_summary AS
SELECT
    n.node_id,
    n.node_name,

    -- Revenue (earnings)
    COALESCE(SUM(ne.amount_usd), 0) as total_revenue_usd,

    -- Costs (deployments)
    COALESCE(SUM(dc.amount_usd), 0) as total_costs_usd,

    -- Profit
    COALESCE(SUM(ne.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0) as net_profit_usd,

    -- Margin
    CASE
        WHEN COALESCE(SUM(ne.amount_usd), 0) > 0
        THEN ((COALESCE(SUM(ne.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0)) / COALESCE(SUM(ne.amount_usd), 0) * 100)
        ELSE 0
    END as profit_margin_percentage,

    -- Counts
    COUNT(DISTINCT ne.project_id) as projects_completed,
    COUNT(DISTINCT dc.deployment_id) as total_deployments

FROM nodes n
LEFT JOIN node_earnings ne ON n.node_id = ne.node_id AND ne.payment_status = 'paid'
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
GROUP BY n.node_id, n.node_name;

-- Monthly profit/loss by node
CREATE OR REPLACE VIEW node_monthly_profit AS
SELECT
    n.node_id,
    n.node_name,
    DATE_TRUNC('month', COALESCE(ne.earned_at, dc.created_at)) as month,

    -- Revenue
    COALESCE(SUM(ne.amount_usd), 0) as monthly_revenue_usd,

    -- Costs
    COALESCE(SUM(dc.amount_usd), 0) as monthly_costs_usd,

    -- Profit
    COALESCE(SUM(ne.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0) as monthly_profit_usd,

    -- ROI
    CASE
        WHEN COALESCE(SUM(dc.amount_usd), 0) > 0
        THEN ((COALESCE(SUM(ne.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0)) / COALESCE(SUM(dc.amount_usd), 0) * 100)
        ELSE 0
    END as roi_percentage

FROM nodes n
LEFT JOIN node_earnings ne ON n.node_id = ne.node_id AND ne.payment_status = 'paid'
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
WHERE COALESCE(ne.earned_at, dc.created_at) >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
GROUP BY n.node_id, n.node_name, DATE_TRUNC('month', COALESCE(ne.earned_at, dc.created_at))
ORDER BY month DESC, monthly_profit_usd DESC;

-- Platform-wide profit summary
CREATE OR REPLACE VIEW platform_profit_summary AS
SELECT
    DATE_TRUNC('month', month) as month,

    -- Total revenue (node earnings + marketplace fees)
    SUM(node_revenue) + SUM(marketplace_fees) as total_revenue_usd,

    -- Total costs (all deployments)
    SUM(total_costs) as total_costs_usd,

    -- Net profit
    (SUM(node_revenue) + SUM(marketplace_fees)) - SUM(total_costs) as net_profit_usd,

    -- Breakdown
    SUM(node_revenue) as node_payments_usd,
    SUM(marketplace_fees) as platform_fees_usd,
    SUM(total_costs) as deployment_costs_usd

FROM (
    -- Node earnings
    SELECT
        DATE_TRUNC('month', earned_at) as month,
        SUM(amount_usd) as node_revenue,
        0 as marketplace_fees,
        0 as total_costs
    FROM node_earnings
    WHERE payment_status = 'paid'
    GROUP BY DATE_TRUNC('month', earned_at)

    UNION ALL

    -- Marketplace fees
    SELECT
        DATE_TRUNC('month', collected_at) as month,
        0 as node_revenue,
        SUM(amount_usd) as marketplace_fees,
        0 as total_costs
    FROM marketplace_revenue
    GROUP BY DATE_TRUNC('month', collected_at)

    UNION ALL

    -- Deployment costs
    SELECT
        DATE_TRUNC('month', created_at) as month,
        0 as node_revenue,
        0 as marketplace_fees,
        SUM(amount_usd) as total_costs
    FROM deployment_costs
    GROUP BY DATE_TRUNC('month', created_at)
) combined
GROUP BY DATE_TRUNC('month', month)
ORDER BY month DESC;

-- =====================================================
-- 3. PROFIT TRACKING QUERIES
-- =====================================================

-- Q1: Node profitability ranking (most to least profitable)
SELECT
    node_id,
    node_name,
    total_revenue_usd,
    total_costs_usd,
    net_profit_usd,
    profit_margin_percentage,
    projects_completed,
    total_deployments
FROM node_profit_summary
ORDER BY net_profit_usd DESC;

-- Q2: Top earning nodes (last 30 days)
SELECT
    n.node_id,
    n.node_name,
    COUNT(ne.earning_id) as payments_received,
    SUM(ne.amount_usd) as total_earned_usd,
    AVG(ne.amount_usd) as avg_payment_usd,
    MAX(ne.earned_at) as last_payment_date
FROM nodes n
JOIN node_earnings ne ON n.node_id = ne.node_id
WHERE ne.payment_status = 'paid'
  AND ne.earned_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY n.node_id, n.node_name
ORDER BY total_earned_usd DESC
LIMIT 20;

-- Q3: Unprofitable nodes (need attention)
SELECT
    node_id,
    node_name,
    total_revenue_usd,
    total_costs_usd,
    net_profit_usd,
    profit_margin_percentage
FROM node_profit_summary
WHERE net_profit_usd < 0
ORDER BY net_profit_usd ASC;

-- Q4: Monthly P&L statement (last 12 months)
SELECT
    month,
    total_revenue_usd,
    deployment_costs_usd,
    net_profit_usd,
    ROUND((net_profit_usd / NULLIF(total_revenue_usd, 0) * 100), 2) as profit_margin_pct
FROM platform_profit_summary
WHERE month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
ORDER BY month DESC;

-- Q5: Node earnings vs. costs breakdown
SELECT
    n.node_id,
    n.node_name,

    -- Earnings breakdown
    SUM(CASE WHEN ne.payment_type = 'project_completion' THEN ne.amount_usd ELSE 0 END) as project_earnings_usd,
    SUM(CASE WHEN ne.payment_type = 'milestone' THEN ne.amount_usd ELSE 0 END) as milestone_earnings_usd,
    SUM(CASE WHEN ne.payment_type = 'bonus' THEN ne.amount_usd ELSE 0 END) as bonus_earnings_usd,
    SUM(ne.amount_usd) as total_earnings_usd,

    -- Cost breakdown
    SUM(CASE WHEN dc.deployment_type = 'arweave-frontend' THEN dc.amount_usd ELSE 0 END) as arweave_costs_usd,
    SUM(CASE WHEN dc.deployment_type = 'akash-backend' THEN dc.amount_usd ELSE 0 END) as akash_costs_usd,
    SUM(dc.amount_usd) as total_costs_usd,

    -- Profit
    SUM(ne.amount_usd) - SUM(dc.amount_usd) as net_profit_usd

FROM nodes n
LEFT JOIN node_earnings ne ON n.node_id = ne.node_id AND ne.payment_status = 'paid'
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
GROUP BY n.node_id, n.node_name
ORDER BY net_profit_usd DESC;

-- Q6: Project profitability analysis
SELECT
    p.project_id,
    p.project_name,

    -- Earnings for this project
    COALESCE(SUM(ne.amount_usd), 0) as node_earnings_usd,

    -- Costs for this project
    COALESCE(SUM(dc.amount_usd), 0) as deployment_costs_usd,

    -- Marketplace fees collected
    COALESCE(SUM(mr.amount_usd), 0) as platform_fees_usd,

    -- Net profit (for platform)
    COALESCE(SUM(mr.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0) as platform_profit_usd,

    -- Node that worked on it
    STRING_AGG(DISTINCT d.node_id, ', ') as nodes_involved

FROM projects p
LEFT JOIN deployments d ON p.project_id = d.project_id
LEFT JOIN node_earnings ne ON p.project_id = ne.project_id AND ne.payment_status = 'paid'
LEFT JOIN deployment_costs dc ON p.project_id = dc.project_id
LEFT JOIN marketplace_revenue mr ON p.project_id = mr.project_id
GROUP BY p.project_id, p.project_name
HAVING COALESCE(SUM(mr.amount_usd), 0) > 0 OR COALESCE(SUM(ne.amount_usd), 0) > 0
ORDER BY platform_profit_usd DESC;

-- Q7: Pending payments (revenue at risk)
SELECT
    n.node_id,
    n.node_name,
    COUNT(ne.earning_id) as pending_payments,
    SUM(ne.amount_usd) as pending_revenue_usd,
    MIN(ne.earned_at) as oldest_pending_date,
    MAX(ne.earned_at) as newest_pending_date
FROM nodes n
JOIN node_earnings ne ON n.node_id = ne.node_id
WHERE ne.payment_status = 'pending'
GROUP BY n.node_id, n.node_name
ORDER BY pending_revenue_usd DESC;

-- Q8: ROI by node (return on investment)
SELECT
    node_id,
    node_name,
    total_costs_usd as investment_usd,
    total_revenue_usd as return_usd,
    net_profit_usd,
    CASE
        WHEN total_costs_usd > 0
        THEN ROUND((net_profit_usd / total_costs_usd * 100), 2)
        ELSE 0
    END as roi_percentage,
    CASE
        WHEN net_profit_usd > 0 AND total_costs_usd > 0
        THEN ROUND((total_costs_usd / (net_profit_usd / 30.0)), 2) -- Payback period in months (assuming monthly profit)
        ELSE NULL
    END as payback_period_months
FROM node_profit_summary
WHERE total_costs_usd > 0
ORDER BY roi_percentage DESC;

-- Q9: Cost efficiency by node (cost per deployment)
SELECT
    n.node_id,
    n.node_name,
    COUNT(dc.deployment_id) as total_deployments,
    SUM(dc.amount_usd) as total_deployment_costs_usd,
    ROUND(AVG(dc.amount_usd), 4) as avg_cost_per_deployment_usd,
    COALESCE(SUM(ne.amount_usd), 0) as total_earnings_usd,
    CASE
        WHEN COUNT(dc.deployment_id) > 0
        THEN ROUND(COALESCE(SUM(ne.amount_usd), 0) / COUNT(dc.deployment_id), 2)
        ELSE 0
    END as avg_earnings_per_deployment_usd
FROM nodes n
JOIN deployment_costs dc ON n.node_id = dc.node_id
LEFT JOIN node_earnings ne ON n.node_id = ne.node_id AND ne.payment_status = 'paid'
GROUP BY n.node_id, n.node_name
ORDER BY avg_earnings_per_deployment_usd DESC;

-- Q10: Profit forecast (based on last 30 days)
SELECT
    n.node_id,
    n.node_name,

    -- Historical (last 30 days)
    COALESCE(SUM(ne.amount_usd), 0) as last_30d_revenue_usd,
    COALESCE(SUM(dc.amount_usd), 0) as last_30d_costs_usd,
    COALESCE(SUM(ne.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0) as last_30d_profit_usd,

    -- Forecast (next 30 days)
    COALESCE(SUM(ne.amount_usd), 0) as projected_next_30d_revenue_usd,
    COALESCE(SUM(dc.amount_usd), 0) as projected_next_30d_costs_usd,
    COALESCE(SUM(ne.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0) as projected_next_30d_profit_usd,

    -- Annual projection
    (COALESCE(SUM(ne.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0)) * 12 as projected_annual_profit_usd

FROM nodes n
LEFT JOIN node_earnings ne ON n.node_id = ne.node_id
    AND ne.payment_status = 'paid'
    AND ne.earned_at >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
    AND dc.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY n.node_id, n.node_name
ORDER BY projected_annual_profit_usd DESC;

-- =====================================================
-- 4. EXAMPLE DATA INSERTION
-- =====================================================

-- Insert example node earning
INSERT INTO node_earnings (
    node_id,
    project_id,
    deployment_id,
    amount_usd,
    payment_type,
    payment_status,
    description,
    earned_at,
    paid_at
)
VALUES (
    'alex-architect-ai',
    'proj-123',
    'deploy-001',
    500.00,
    'project_completion',
    'paid',
    'Full-stack e-commerce platform deployment',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
);

-- Insert example marketplace fee
INSERT INTO marketplace_revenue (
    project_id,
    user_id,
    amount_usd,
    fee_type,
    fee_percentage,
    description,
    collected_at
)
VALUES (
    'proj-123',
    'user-456',
    50.00,
    'platform_fee',
    10.00,
    '10% platform fee on project completion',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
);

-- =====================================================
-- 5. PROFIT DASHBOARD QUERIES (For Admin UI)
-- =====================================================

-- Dashboard: Key metrics (current month)
SELECT
    COUNT(DISTINCT n.node_id) as active_nodes,
    COUNT(DISTINCT ne.project_id) as completed_projects,
    COALESCE(SUM(ne.amount_usd), 0) as total_revenue_usd,
    COALESCE(SUM(dc.amount_usd), 0) as total_costs_usd,
    COALESCE(SUM(ne.amount_usd), 0) - COALESCE(SUM(dc.amount_usd), 0) as net_profit_usd,
    COALESCE(SUM(mr.amount_usd), 0) as platform_fees_usd
FROM nodes n
LEFT JOIN node_earnings ne ON n.node_id = ne.node_id
    AND ne.payment_status = 'paid'
    AND ne.earned_at >= DATE_TRUNC('month', CURRENT_DATE)
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
    AND dc.created_at >= DATE_TRUNC('month', CURRENT_DATE)
LEFT JOIN marketplace_revenue mr ON mr.collected_at >= DATE_TRUNC('month', CURRENT_DATE);

-- Dashboard: Top 5 most profitable nodes (all-time)
SELECT
    node_id,
    node_name,
    net_profit_usd,
    profit_margin_percentage,
    projects_completed
FROM node_profit_summary
ORDER BY net_profit_usd DESC
LIMIT 5;

-- Dashboard: Recent earnings (last 10)
SELECT
    ne.earning_id,
    n.node_name,
    p.project_name,
    ne.amount_usd,
    ne.payment_type,
    ne.earned_at,
    ne.payment_status
FROM node_earnings ne
JOIN nodes n ON ne.node_id = n.node_id
JOIN projects p ON ne.project_id = p.project_id
ORDER BY ne.earned_at DESC
LIMIT 10;

-- Dashboard: Monthly trend (last 6 months)
SELECT
    TO_CHAR(month, 'YYYY-MM') as month,
    total_revenue_usd,
    deployment_costs_usd,
    net_profit_usd,
    platform_fees_usd
FROM platform_profit_summary
WHERE month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
ORDER BY month ASC;
