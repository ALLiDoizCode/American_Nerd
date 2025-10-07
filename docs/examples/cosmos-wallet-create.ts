/**
 * Cosmos/Akash Wallet Creation and Management
 *
 * This module provides production-ready functions for creating, loading,
 * and managing Cosmos SDK wallets (including Akash Network AKT) for
 * autonomous AI node deployments.
 */

import { DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import fs from 'fs';
import path from 'path';

/**
 * Configuration for Cosmos wallet operations
 */
export interface CosmosWalletConfig {
  prefix: string;  // 'akash' for Akash Network, 'cosmos' for Cosmos Hub
  rpcEndpoint: string;
  denom: string;   // 'uakt' for Akash, 'uatom' for Cosmos Hub
}

/**
 * Akash Network configuration
 */
export const AKASH_CONFIG: CosmosWalletConfig = {
  prefix: 'akash',
  rpcEndpoint: 'https://rpc.akash.forbole.com:443',
  denom: 'uakt', // 1 AKT = 1,000,000 uakt
};

/**
 * Cosmos Hub configuration
 */
export const COSMOS_CONFIG: CosmosWalletConfig = {
  prefix: 'cosmos',
  rpcEndpoint: 'https://rpc.cosmos.network:443',
  denom: 'uatom',
};

/**
 * Generate a new Cosmos HD wallet with a random mnemonic
 *
 * @param prefix - Address prefix ('akash', 'cosmos', etc.)
 * @param mnemonicLength - Mnemonic length (12, 15, 18, 21, or 24 words)
 * @returns Wallet and mnemonic
 *
 * @example
 * const { wallet, mnemonic } = await generateCosmosWallet('akash');
 * console.log('Save this mnemonic securely:', mnemonic);
 */
export async function generateCosmosWallet(
  prefix: string = 'akash',
  mnemonicLength: 12 | 15 | 18 | 21 | 24 = 24
): Promise<{ wallet: DirectSecp256k1HdWallet; mnemonic: string }> {
  const wallet = await DirectSecp256k1HdWallet.generate(mnemonicLength, {
    prefix: prefix,
  });

  return {
    wallet,
    mnemonic: wallet.mnemonic,
  };
}

/**
 * Load Cosmos wallet from mnemonic phrase
 *
 * @param mnemonic - BIP39 mnemonic phrase
 * @param prefix - Address prefix ('akash', 'cosmos', etc.)
 * @returns Wallet instance
 *
 * @example
 * const mnemonic = 'word1 word2 word3 ... word24';
 * const wallet = await loadWalletFromMnemonic(mnemonic, 'akash');
 */
export async function loadWalletFromMnemonic(
  mnemonic: string,
  prefix: string = 'akash'
): Promise<DirectSecp256k1HdWallet> {
  try {
    return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: prefix,
    });
  } catch (error) {
    throw new Error(`Failed to load wallet from mnemonic: ${error}`);
  }
}

/**
 * Load Cosmos wallet from environment variable
 *
 * @param envVarName - Name of environment variable containing mnemonic
 * @param prefix - Address prefix
 * @returns Wallet instance
 *
 * @example
 * // In GitHub Actions secrets:
 * // AKASH_WALLET_MNEMONIC="word1 word2 word3 ... word24"
 *
 * const wallet = await loadWalletFromEnv('AKASH_WALLET_MNEMONIC', 'akash');
 */
export async function loadWalletFromEnv(
  envVarName: string,
  prefix: string = 'akash'
): Promise<DirectSecp256k1HdWallet> {
  const mnemonic = process.env[envVarName];

  if (!mnemonic) {
    throw new Error(`Environment variable ${envVarName} not found`);
  }

  return loadWalletFromMnemonic(mnemonic.trim(), prefix);
}

/**
 * Load Cosmos wallet from JSON file
 *
 * @param filePath - Path to JSON file containing mnemonic
 * @param prefix - Address prefix
 * @returns Wallet instance
 *
 * @example
 * // File format: { "mnemonic": "word1 word2 ..." }
 * const wallet = await loadWalletFromFile('./keypairs/akash-wallet.json', 'akash');
 */
export async function loadWalletFromFile(
  filePath: string,
  prefix: string = 'akash'
): Promise<DirectSecp256k1HdWallet> {
  try {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    const { mnemonic } = JSON.parse(fileContent);

    if (!mnemonic) {
      throw new Error('Mnemonic not found in file');
    }

    return loadWalletFromMnemonic(mnemonic, prefix);
  } catch (error) {
    throw new Error(`Failed to load wallet from ${filePath}: ${error}`);
  }
}

/**
 * Save Cosmos wallet mnemonic to JSON file
 * WARNING: Store securely with proper file permissions
 *
 * @param mnemonic - Mnemonic phrase to save
 * @param filePath - Path where to save the JSON file
 *
 * @example
 * const { mnemonic } = await generateCosmosWallet('akash');
 * saveWalletToFile(mnemonic, './keypairs/akash-wallet.json');
 */
export function saveWalletToFile(mnemonic: string, filePath: string): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const walletData = { mnemonic };
    fs.writeFileSync(filePath, JSON.stringify(walletData, null, 2), {
      encoding: 'utf8',
      mode: 0o600, // Owner read/write only for security
    });
  } catch (error) {
    throw new Error(`Failed to save wallet to ${filePath}: ${error}`);
  }
}

/**
 * Get wallet address
 *
 * @param wallet - Wallet instance
 * @returns Address string
 *
 * @example
 * const address = await getAddress(wallet);
 * console.log('Akash address:', address);
 */
export async function getAddress(wallet: DirectSecp256k1HdWallet): Promise<string> {
  const [account] = await wallet.getAccounts();
  return account.address;
}

/**
 * Check token balance for a wallet
 *
 * @param address - Wallet address
 * @param config - Network configuration
 * @returns Balance in base tokens (e.g., AKT not uakt)
 *
 * @example
 * const balance = await getBalance(address, AKASH_CONFIG);
 * console.log(`Balance: ${balance} AKT`);
 */
export async function getBalance(
  address: string,
  config: CosmosWalletConfig
): Promise<number> {
  const client = await StargateClient.connect(config.rpcEndpoint);
  const balance = await client.getBalance(address, config.denom);
  await client.disconnect();

  // Convert from micro-units to base units (1 AKT = 1,000,000 uakt)
  return parseInt(balance.amount) / 1_000_000;
}

/**
 * Check if wallet has sufficient balance
 *
 * @param address - Wallet address
 * @param requiredAmount - Required amount in base tokens (e.g., AKT)
 * @param config - Network configuration
 * @returns True if balance is sufficient
 *
 * @example
 * const hasFunds = await hasSufficientBalance(
 *   address,
 *   10, // Need at least 10 AKT
 *   AKASH_CONFIG
 * );
 */
export async function hasSufficientBalance(
  address: string,
  requiredAmount: number,
  config: CosmosWalletConfig
): Promise<boolean> {
  const balance = await getBalance(address, config);
  return balance >= requiredAmount;
}

/**
 * Create a signing client for transactions
 *
 * @param wallet - Wallet instance
 * @param config - Network configuration
 * @returns Signing client
 *
 * @example
 * const signingClient = await createSigningClient(wallet, AKASH_CONFIG);
 * // Use signingClient to send transactions
 */
export async function createSigningClient(
  wallet: OfflineSigner,
  config: CosmosWalletConfig
): Promise<SigningStargateClient> {
  return await SigningStargateClient.connectWithSigner(
    config.rpcEndpoint,
    wallet
  );
}

/**
 * Initialize wallet for CI/CD deployment with validation
 *
 * @param envVarName - Environment variable name containing mnemonic
 * @param minBalance - Minimum required balance in base tokens
 * @param config - Network configuration
 * @returns Initialized and validated wallet
 *
 * @example
 * const deploymentWallet = await initializeDeploymentWallet(
 *   'AKASH_WALLET_MNEMONIC',
 *   10, // Require at least 10 AKT
 *   AKASH_CONFIG
 * );
 */
export async function initializeDeploymentWallet(
  envVarName: string,
  minBalance: number = 10,
  config: CosmosWalletConfig
): Promise<DirectSecp256k1HdWallet> {
  // Load wallet
  const wallet = await loadWalletFromEnv(envVarName, config.prefix);
  const address = await getAddress(wallet);

  // Validate balance
  const balance = await getBalance(address, config);
  const tokenSymbol = config.denom.replace('u', '').toUpperCase();

  if (balance < minBalance) {
    throw new Error(
      `Insufficient balance for deployment. ` +
      `Required: ${minBalance} ${tokenSymbol}, Available: ${balance} ${tokenSymbol}. ` +
      `Please fund wallet: ${address}`
    );
  }

  console.log(`✓ Deployment wallet initialized: ${address}`);
  console.log(`✓ Balance: ${balance} ${tokenSymbol}`);

  return wallet;
}

/**
 * Example: Complete setup for Akash Network deployment
 */
export async function exampleAkashNodeSetup() {
  console.log('=== Akash Network Wallet Setup for AI Node ===\n');

  // 1. Generate new wallet for the node
  const { wallet, mnemonic } = await generateCosmosWallet('akash', 24);
  const address = await getAddress(wallet);

  console.log('Generated new Akash wallet:', address);
  console.log('\n⚠️  SAVE THIS MNEMONIC SECURELY (24 words):');
  console.log(`   ${mnemonic}\n`);

  // 2. Save to file (for local testing)
  saveWalletToFile(mnemonic, './keypairs/test-akash-wallet.json');
  console.log('✓ Saved to ./keypairs/test-akash-wallet.json');

  // 3. Instructions for GitHub Actions
  console.log('\n📋 Add this to GitHub Actions secrets:');
  console.log(`AKASH_WALLET_MNEMONIC="${mnemonic}"`);

  console.log('\n⚠️  Fund this address before deploying:');
  console.log(`   ${address}`);
  console.log('   Recommended: 50 AKT for production deployments');
  console.log('   (minimum 5 AKT per deployment + transaction fees)\n');

  // 4. Example: Check balance (will be 0 for new wallet)
  try {
    const balance = await getBalance(address, AKASH_CONFIG);
    console.log(`Current balance: ${balance} AKT`);
  } catch (error) {
    console.log('Note: Cannot check balance until wallet is funded');
  }
}

// Run example if executed directly
if (require.main === module) {
  exampleAkashNodeSetup().catch(console.error);
}
