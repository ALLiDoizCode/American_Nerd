/**
 * Solana Wallet Creation and Management
 *
 * This module provides production-ready functions for creating, loading,
 * and managing Solana wallets for autonomous AI node deployments.
 */

import { Keypair, Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import fs from 'fs';
import path from 'path';

/**
 * Configuration for Solana wallet operations
 */
export interface SolanaWalletConfig {
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  rpcEndpoint?: string;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: SolanaWalletConfig = {
  network: 'mainnet-beta',
  rpcEndpoint: 'https://api.mainnet-beta.solana.com',
};

/**
 * Generate a new Solana keypair
 *
 * @returns New Keypair object
 *
 * @example
 * const wallet = generateSolanaWallet();
 * console.log('Public Key:', wallet.publicKey.toBase58());
 */
export function generateSolanaWallet(): Keypair {
  return Keypair.generate();
}

/**
 * Load Solana wallet from JSON file (Solana CLI format)
 *
 * @param filePath - Path to the JSON keypair file
 * @returns Keypair object
 *
 * @example
 * const wallet = loadWalletFromFile('./keypairs/node-wallet.json');
 */
export function loadWalletFromFile(filePath: string): Keypair {
  try {
    const secretKeyString = fs.readFileSync(filePath, { encoding: 'utf8' });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    throw new Error(`Failed to load wallet from ${filePath}: ${error}`);
  }
}

/**
 * Load Solana wallet from base58-encoded private key
 *
 * @param base58PrivateKey - Base58-encoded private key (e.g., from Phantom)
 * @returns Keypair object
 *
 * @example
 * const privateKey = 'your-base58-encoded-private-key';
 * const wallet = loadWalletFromBase58(privateKey);
 */
export function loadWalletFromBase58(base58PrivateKey: string): Keypair {
  try {
    const secretKey = bs58.decode(base58PrivateKey);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    throw new Error(`Failed to load wallet from base58 key: ${error}`);
  }
}

/**
 * Load Solana wallet from environment variable
 * Supports both JSON array format and base58 format
 *
 * @param envVarName - Name of environment variable containing the private key
 * @returns Keypair object
 *
 * @example
 * // In GitHub Actions secrets or .env file:
 * // DEPLOYMENT_WALLET=[1,2,3,...,64]
 * // or
 * // DEPLOYMENT_WALLET=base58encodedkey
 *
 * const wallet = loadWalletFromEnv('DEPLOYMENT_WALLET');
 */
export function loadWalletFromEnv(envVarName: string): Keypair {
  const privateKey = process.env[envVarName];

  if (!privateKey) {
    throw new Error(`Environment variable ${envVarName} not found`);
  }

  try {
    // Try parsing as JSON array first (Solana CLI format)
    const secretKey = Uint8Array.from(JSON.parse(privateKey));
    return Keypair.fromSecretKey(secretKey);
  } catch {
    // If JSON parsing fails, try base58
    try {
      return loadWalletFromBase58(privateKey);
    } catch (error) {
      throw new Error(
        `Failed to load wallet from ${envVarName}. ` +
        `Must be either JSON array or base58 string: ${error}`
      );
    }
  }
}

/**
 * Save Solana wallet to JSON file (Solana CLI format)
 *
 * @param keypair - Keypair to save
 * @param filePath - Path where to save the JSON file
 *
 * @example
 * const wallet = generateSolanaWallet();
 * saveWalletToFile(wallet, './keypairs/node-wallet.json');
 */
export function saveWalletToFile(keypair: Keypair, filePath: string): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const secretKey = Array.from(keypair.secretKey);
    fs.writeFileSync(filePath, JSON.stringify(secretKey), {
      encoding: 'utf8',
      mode: 0o600 // Owner read/write only for security
    });
  } catch (error) {
    throw new Error(`Failed to save wallet to ${filePath}: ${error}`);
  }
}

/**
 * Get wallet's base58-encoded private key
 * WARNING: Handle with extreme care - exposing this compromises the wallet
 *
 * @param keypair - Keypair object
 * @returns Base58-encoded private key
 */
export function getBase58PrivateKey(keypair: Keypair): string {
  return bs58.encode(keypair.secretKey);
}

/**
 * Check SOL balance for a wallet
 *
 * @param publicKey - Public key to check balance for
 * @param config - Network configuration
 * @returns Balance in SOL
 *
 * @example
 * const balance = await getBalance(wallet.publicKey);
 * console.log(`Balance: ${balance} SOL`);
 */
export async function getBalance(
  publicKey: PublicKey,
  config: SolanaWalletConfig = DEFAULT_CONFIG
): Promise<number> {
  const connection = new Connection(config.rpcEndpoint || DEFAULT_CONFIG.rpcEndpoint!);
  const lamports = await connection.getBalance(publicKey);
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Check if wallet has sufficient balance for operation
 *
 * @param publicKey - Public key to check
 * @param requiredSol - Required SOL amount
 * @param config - Network configuration
 * @returns True if balance is sufficient
 *
 * @example
 * const hasFunds = await hasSufficientBalance(
 *   wallet.publicKey,
 *   0.1 // Need at least 0.1 SOL
 * );
 */
export async function hasSufficientBalance(
  publicKey: PublicKey,
  requiredSol: number,
  config: SolanaWalletConfig = DEFAULT_CONFIG
): Promise<boolean> {
  const balance = await getBalance(publicKey, config);
  return balance >= requiredSol;
}

/**
 * Initialize wallet for CI/CD deployment
 * Loads from environment variable with validation
 *
 * @param envVarName - Environment variable name
 * @param minBalanceSol - Minimum required SOL balance
 * @param config - Network configuration
 * @returns Initialized and validated Keypair
 *
 * @example
 * // In GitHub Actions workflow:
 * const deploymentWallet = await initializeDeploymentWallet(
 *   'DEPLOYMENT_WALLET_SECRET',
 *   0.1 // Require at least 0.1 SOL
 * );
 */
export async function initializeDeploymentWallet(
  envVarName: string,
  minBalanceSol: number = 0.1,
  config: SolanaWalletConfig = DEFAULT_CONFIG
): Promise<Keypair> {
  // Load wallet
  const keypair = loadWalletFromEnv(envVarName);

  // Validate balance
  const balance = await getBalance(keypair.publicKey, config);

  if (balance < minBalanceSol) {
    throw new Error(
      `Insufficient balance for deployment. ` +
      `Required: ${minBalanceSol} SOL, Available: ${balance} SOL. ` +
      `Please fund wallet: ${keypair.publicKey.toBase58()}`
    );
  }

  console.log(`✓ Deployment wallet initialized: ${keypair.publicKey.toBase58()}`);
  console.log(`✓ Balance: ${balance} SOL`);

  return keypair;
}

/**
 * Example: Complete setup for autonomous node deployment
 */
export async function exampleNodeSetup() {
  console.log('=== Solana Wallet Setup for AI Node ===\n');

  // 1. Generate new wallet for the node
  const nodeWallet = generateSolanaWallet();
  console.log('Generated new wallet:', nodeWallet.publicKey.toBase58());

  // 2. Save to file (for local testing)
  saveWalletToFile(nodeWallet, './keypairs/test-node-wallet.json');
  console.log('✓ Saved to ./keypairs/test-node-wallet.json');

  // 3. Get base58 key for GitHub Actions secret
  const base58Key = getBase58PrivateKey(nodeWallet);
  console.log('\n📋 Add this to GitHub Actions secrets:');
  console.log(`DEPLOYMENT_WALLET=${base58Key}`);

  console.log('\n⚠️  Fund this address before deploying:');
  console.log(`   ${nodeWallet.publicKey.toBase58()}`);
  console.log('   Recommended: 1 SOL for production deployments\n');

  // 4. Example: Load from environment in CI/CD
  // const deploymentWallet = await initializeDeploymentWallet('DEPLOYMENT_WALLET', 0.1);
}

// Run example if executed directly
if (require.main === module) {
  exampleNodeSetup().catch(console.error);
}
