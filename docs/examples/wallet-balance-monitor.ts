/**
 * Multi-Chain Wallet Balance Monitoring System
 *
 * This module provides production-ready monitoring for Solana (SOL) and
 * Cosmos/Akash (AKT) wallet balances with threshold-based alerting.
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { StargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

/**
 * Alert configuration
 */
export interface AlertConfig {
  // Notification channels
  discordWebhook?: string;
  slackWebhook?: string;
  email?: string;

  // Alert thresholds
  solThreshold: number;  // Alert when SOL < this value
  aktThreshold: number;  // Alert when AKT < this value

  // Alert frequency (milliseconds)
  alertCooldown: number; // Minimum time between alerts for same wallet
}

/**
 * Wallet balance information
 */
export interface WalletBalance {
  address: string;
  chain: 'solana' | 'akash';
  balance: number;
  symbol: string;
  timestamp: number;
  belowThreshold: boolean;
}

/**
 * Alert record for tracking
 */
export interface AlertRecord {
  walletAddress: string;
  chain: string;
  balance: number;
  threshold: number;
  timestamp: number;
  alertSent: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: AlertConfig = {
  solThreshold: 0.1, // Alert when < 0.1 SOL
  aktThreshold: 10,  // Alert when < 10 AKT
  alertCooldown: 3600000, // 1 hour between alerts
};

/**
 * In-memory alert history (use database in production)
 */
const alertHistory = new Map<string, number>();

/**
 * Check Solana wallet balance
 *
 * @param publicKey - Solana public key
 * @param rpcEndpoint - RPC endpoint
 * @param threshold - Alert threshold in SOL
 * @returns Balance information
 */
export async function checkSolanaBalance(
  publicKey: PublicKey,
  rpcEndpoint: string = 'https://api.mainnet-beta.solana.com',
  threshold: number = 0.1
): Promise<WalletBalance> {
  const connection = new Connection(rpcEndpoint);
  const lamports = await connection.getBalance(publicKey);
  const balance = lamports / LAMPORTS_PER_SOL;

  return {
    address: publicKey.toBase58(),
    chain: 'solana',
    balance,
    symbol: 'SOL',
    timestamp: Date.now(),
    belowThreshold: balance < threshold,
  };
}

/**
 * Check Akash wallet balance
 *
 * @param address - Akash address
 * @param rpcEndpoint - RPC endpoint
 * @param threshold - Alert threshold in AKT
 * @returns Balance information
 */
export async function checkAkashBalance(
  address: string,
  rpcEndpoint: string = 'https://rpc.akash.forbole.com:443',
  threshold: number = 10
): Promise<WalletBalance> {
  const client = await StargateClient.connect(rpcEndpoint);
  const balance = await client.getBalance(address, 'uakt');
  await client.disconnect();

  const akt = parseInt(balance.amount) / 1_000_000;

  return {
    address,
    chain: 'akash',
    balance: akt,
    symbol: 'AKT',
    timestamp: Date.now(),
    belowThreshold: akt < threshold,
  };
}

/**
 * Check if alert should be sent (based on cooldown)
 *
 * @param walletAddress - Wallet address
 * @param cooldownMs - Cooldown period in milliseconds
 * @returns True if alert should be sent
 */
function shouldSendAlert(walletAddress: string, cooldownMs: number): boolean {
  const lastAlert = alertHistory.get(walletAddress);

  if (!lastAlert) {
    return true;
  }

  return Date.now() - lastAlert > cooldownMs;
}

/**
 * Record that alert was sent
 *
 * @param walletAddress - Wallet address
 */
function recordAlert(walletAddress: string): void {
  alertHistory.set(walletAddress, Date.now());
}

/**
 * Send Discord webhook notification
 *
 * @param webhookUrl - Discord webhook URL
 * @param balance - Balance information
 */
async function sendDiscordAlert(
  webhookUrl: string,
  balance: WalletBalance
): Promise<void> {
  const message = {
    embeds: [
      {
        title: '⚠️ Low Wallet Balance Alert',
        color: 0xff9900, // Orange
        fields: [
          { name: 'Chain', value: balance.chain.toUpperCase(), inline: true },
          { name: 'Address', value: balance.address, inline: false },
          { name: 'Balance', value: `${balance.balance.toFixed(6)} ${balance.symbol}`, inline: true },
          { name: 'Status', value: '🔴 Below Threshold', inline: true },
        ],
        timestamp: new Date(balance.timestamp).toISOString(),
        footer: { text: 'SlopMachine Wallet Monitor' },
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.statusText}`);
  }
}

/**
 * Send Slack webhook notification
 *
 * @param webhookUrl - Slack webhook URL
 * @param balance - Balance information
 */
async function sendSlackAlert(
  webhookUrl: string,
  balance: WalletBalance
): Promise<void> {
  const message = {
    text: '⚠️ Low Wallet Balance Alert',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '⚠️ Low Wallet Balance Alert',
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Chain:*\n${balance.chain.toUpperCase()}` },
          { type: 'mrkdwn', text: `*Balance:*\n${balance.balance.toFixed(6)} ${balance.symbol}` },
          { type: 'mrkdwn', text: `*Address:*\n\`${balance.address}\`` },
          { type: 'mrkdwn', text: `*Status:*\n🔴 Below Threshold` },
        ],
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.statusText}`);
  }
}

/**
 * Send alert notifications
 *
 * @param balance - Balance information
 * @param config - Alert configuration
 */
async function sendAlerts(
  balance: WalletBalance,
  config: AlertConfig
): Promise<void> {
  const promises: Promise<void>[] = [];

  if (config.discordWebhook) {
    promises.push(sendDiscordAlert(config.discordWebhook, balance));
  }

  if (config.slackWebhook) {
    promises.push(sendSlackAlert(config.slackWebhook, balance));
  }

  await Promise.all(promises);
  console.log(`✅ Alerts sent for ${balance.address}`);
}

/**
 * Monitor single Solana wallet
 *
 * @param publicKey - Solana public key
 * @param config - Alert configuration
 * @returns Balance information
 */
export async function monitorSolanaWallet(
  publicKey: PublicKey,
  config: AlertConfig = DEFAULT_CONFIG
): Promise<WalletBalance> {
  const balance = await checkSolanaBalance(publicKey, undefined, config.solThreshold);

  console.log(`\n💎 SOL Balance: ${balance.balance.toFixed(6)} SOL`);
  console.log(`   Address: ${balance.address}`);

  if (balance.belowThreshold) {
    console.log(`   ⚠️  Below threshold (${config.solThreshold} SOL)`);

    if (shouldSendAlert(balance.address, config.alertCooldown)) {
      await sendAlerts(balance, config);
      recordAlert(balance.address);
    } else {
      console.log(`   ⏳ Alert cooldown active, skipping notification`);
    }
  } else {
    console.log(`   ✅ Above threshold`);
  }

  return balance;
}

/**
 * Monitor single Akash wallet
 *
 * @param address - Akash address
 * @param config - Alert configuration
 * @returns Balance information
 */
export async function monitorAkashWallet(
  address: string,
  config: AlertConfig = DEFAULT_CONFIG
): Promise<WalletBalance> {
  const balance = await checkAkashBalance(address, undefined, config.aktThreshold);

  console.log(`\n⚛️  AKT Balance: ${balance.balance.toFixed(6)} AKT`);
  console.log(`   Address: ${balance.address}`);

  if (balance.belowThreshold) {
    console.log(`   ⚠️  Below threshold (${config.aktThreshold} AKT)`);

    if (shouldSendAlert(balance.address, config.alertCooldown)) {
      await sendAlerts(balance, config);
      recordAlert(balance.address);
    } else {
      console.log(`   ⏳ Alert cooldown active, skipping notification`);
    }
  } else {
    console.log(`   ✅ Above threshold`);
  }

  return balance;
}

/**
 * Monitor multiple wallets across chains
 *
 * @param wallets - Map of wallet addresses by chain
 * @param config - Alert configuration
 * @returns Array of balance information
 */
export async function monitorAllWallets(
  wallets: {
    solana: PublicKey[];
    akash: string[];
  },
  config: AlertConfig = DEFAULT_CONFIG
): Promise<WalletBalance[]> {
  console.log('=== Multi-Chain Wallet Balance Monitor ===');
  console.log(`Monitoring ${wallets.solana.length} Solana + ${wallets.akash.length} Akash wallets\n`);

  const results: WalletBalance[] = [];

  // Check all Solana wallets
  for (const publicKey of wallets.solana) {
    const balance = await monitorSolanaWallet(publicKey, config);
    results.push(balance);
  }

  // Check all Akash wallets
  for (const address of wallets.akash) {
    const balance = await monitorAkashWallet(address, config);
    results.push(balance);
  }

  // Summary
  const lowBalanceCount = results.filter(b => b.belowThreshold).length;
  console.log(`\n📊 Summary:`);
  console.log(`   Total wallets: ${results.length}`);
  console.log(`   Low balance: ${lowBalanceCount}`);
  console.log(`   OK: ${results.length - lowBalanceCount}`);

  return results;
}

/**
 * Example: Continuous monitoring with cron-like scheduling
 *
 * @param wallets - Wallets to monitor
 * @param config - Alert configuration
 * @param intervalMs - Check interval in milliseconds
 */
export async function startContinuousMonitoring(
  wallets: { solana: PublicKey[]; akash: string[] },
  config: AlertConfig = DEFAULT_CONFIG,
  intervalMs: number = 300000 // 5 minutes
): Promise<void> {
  console.log(`Starting continuous monitoring (interval: ${intervalMs / 1000}s)\n`);

  // Initial check
  await monitorAllWallets(wallets, config);

  // Schedule periodic checks
  setInterval(async () => {
    console.log(`\n--- Check at ${new Date().toISOString()} ---`);
    await monitorAllWallets(wallets, config);
  }, intervalMs);
}

/**
 * Example usage
 */
export async function exampleMonitoring() {
  // Load configuration from environment
  const config: AlertConfig = {
    discordWebhook: process.env.DISCORD_WEBHOOK,
    slackWebhook: process.env.SLACK_WEBHOOK,
    solThreshold: parseFloat(process.env.SOL_THRESHOLD || '0.1'),
    aktThreshold: parseFloat(process.env.AKT_THRESHOLD || '10'),
    alertCooldown: 3600000, // 1 hour
  };

  // Define wallets to monitor
  const wallets = {
    solana: [
      new PublicKey('your-solana-address-1'),
      new PublicKey('your-solana-address-2'),
    ],
    akash: [
      'akash1abc123...',
      'akash1xyz789...',
    ],
  };

  // Start monitoring
  await startContinuousMonitoring(wallets, config, 300000);
}

// Run if executed directly
if (require.main === module) {
  exampleMonitoring().catch(console.error);
}
