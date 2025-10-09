/**
 * SOL to AKT Cross-Chain Swap using Rango Exchange
 *
 * Solution: Bridge aggregator that routes through multiple protocols
 * Route: SOL (Solana) → [Multiple possible paths] → AKT (Cosmos/Akash)
 * Complexity: LOW - Single API call handles entire routing
 *
 * Prerequisites:
 * - npm install rango-sdk-basic @solana/web3.js @cosmjs/stargate
 * - Solana RPC endpoint (Helius, QuickNode, or public)
 * - Funded Solana wallet
 */

import { RangoClient } from 'rango-sdk-basic';
import { Connection, Keypair, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

// Initialize Rango Client
const API_KEY = process.env.RANGO_API_KEY || ''; // Optional: Get from https://rango.exchange
const rangoClient = new RangoClient(API_KEY);

// Solana connection
const solanaConnection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

interface SwapResult {
  requestId: string;
  txHash?: string;
  amountAKTReceived: number;
  totalCostUSD: number;
  status: 'pending' | 'completed' | 'failed';
  route?: string;
}

/**
 * Swap SOL to AKT using Rango Exchange aggregator
 *
 * @param amountSOL - Amount of SOL to swap (in SOL, not lamports)
 * @param minAKTOut - Minimum AKT tokens to receive (slippage protection)
 * @param fromWallet - Solana wallet keypair
 * @param toCosmosAddress - Destination Cosmos/Akash address (e.g., akash1...)
 * @returns Swap result with transaction details
 */
export async function swapSOLtoAKT(
  amountSOL: number,
  minAKTOut: number,
  fromWallet: Keypair,
  toCosmosAddress: string
): Promise<SwapResult> {
  try {
    console.log(`[Rango] Initiating swap: ${amountSOL} SOL → AKT (min: ${minAKTOut})`);

    // Step 1: Get available blockchains and tokens
    const meta = await rangoClient.meta();

    // Find SOL and AKT in metadata
    const solBlockchain = meta.blockchains.find((b: any) => b.name === 'SOLANA');
    const cosmosBlockchain = meta.blockchains.find((b: any) => b.name === 'COSMOS');

    if (!solBlockchain || !cosmosBlockchain) {
      throw new Error('SOL or Cosmos blockchain not supported by Rango');
    }

    // Step 2: Get best route for swap
    const routeRequest = {
      from: {
        blockchain: 'SOLANA',
        symbol: 'SOL',
        address: null // Native SOL
      },
      to: {
        blockchain: 'COSMOS',
        symbol: 'AKT',
        address: null // Will need to find AKT token address
      },
      amount: (amountSOL * 1e9).toString(), // Convert to lamports
      slippage: calculateSlippage(amountSOL, minAKTOut), // Calculate from minAKTOut
    };

    console.log('[Rango] Fetching route...');
    const routeResponse = await rangoClient.getBestRoute(routeRequest);

    if (routeResponse.resultType !== 'OK') {
      throw new Error(`Route not available: ${routeResponse.resultType}`);
    }

    console.log(`[Rango] Route found: ${routeResponse.route?.swapper || 'Unknown'}`);
    console.log(`[Rango] Estimated output: ${routeResponse.route?.outputAmount || 0} AKT`);
    console.log(`[Rango] Estimated fee: $${routeResponse.route?.feeUsd || 0}`);

    // Validate minimum output
    const estimatedAKT = parseFloat(routeResponse.route?.outputAmount || '0') / 1e6; // Assuming 6 decimals
    if (estimatedAKT < minAKTOut) {
      throw new Error(`Slippage exceeded: Estimated ${estimatedAKT} AKT < minimum ${minAKTOut} AKT`);
    }

    // Step 3: Create swap transaction
    const swapRequest = {
      ...routeRequest,
      fromAddress: fromWallet.publicKey.toBase58(),
      toAddress: toCosmosAddress,
      disableEstimate: false,
    };

    console.log('[Rango] Creating swap transaction...');
    const swapResponse = await rangoClient.swap(swapRequest);

    if (!swapResponse.tx) {
      throw new Error('Failed to create swap transaction');
    }

    // Step 4: Sign and send Solana transaction
    console.log('[Rango] Signing and sending transaction...');
    const transaction = Transaction.from(
      Buffer.from(swapResponse.tx.serializedMessage, 'base64')
    );

    transaction.sign(fromWallet);

    const txHash = await solanaConnection.sendRawTransaction(
      transaction.serialize(),
      { skipPreflight: false }
    );

    console.log(`[Rango] Transaction sent: ${txHash}`);
    console.log(`[Rango] Request ID: ${swapResponse.requestId}`);

    // Step 5: Wait for confirmation
    await solanaConnection.confirmTransaction(txHash, 'confirmed');
    console.log('[Rango] Solana transaction confirmed');

    // Note: Cross-chain transfer will take additional time (5-15 minutes)
    console.log('[Rango] Cross-chain transfer in progress. Check status with requestId.');

    return {
      requestId: swapResponse.requestId,
      txHash,
      amountAKTReceived: estimatedAKT,
      totalCostUSD: parseFloat(routeResponse.route?.feeUsd || '0'),
      status: 'pending',
      route: routeResponse.route?.swapper
    };

  } catch (error) {
    console.error('[Rango] Swap failed:', error);
    throw error;
  }
}

/**
 * Check swap status by request ID
 */
export async function checkSwapStatus(requestId: string): Promise<SwapResult> {
  try {
    const status = await rangoClient.status({ requestId });

    return {
      requestId,
      status: status.status === 'success' ? 'completed' :
              status.status === 'failed' ? 'failed' : 'pending',
      amountAKTReceived: parseFloat(status.outputAmount || '0') / 1e6,
      totalCostUSD: parseFloat(status.feeUsd || '0'),
    };
  } catch (error) {
    console.error('[Rango] Status check failed:', error);
    throw error;
  }
}

/**
 * Calculate slippage tolerance percentage from min output
 */
function calculateSlippage(amountSOL: number, minAKTOut: number): number {
  // Simplified calculation - in production, fetch current SOL/AKT rate
  const estimatedRate = 5; // Example: 1 SOL = 5 AKT (PLACEHOLDER)
  const expectedAKT = amountSOL * estimatedRate;
  const slippagePercent = ((expectedAKT - minAKTOut) / expectedAKT) * 100;
  return Math.max(0.5, Math.min(slippagePercent, 5)); // Clamp between 0.5% and 5%
}

/**
 * Example usage for node operator auto-refill
 */
export async function autoRefillAKT(
  nodeWallet: Keypair,
  cosmosAddress: string,
  aktThreshold: number = 10
): Promise<void> {
  try {
    // Check current SOL balance
    const solBalance = await solanaConnection.getBalance(nodeWallet.publicKey);
    const solBalanceInSOL = solBalance / 1e9;

    console.log(`[AutoRefill] SOL balance: ${solBalanceInSOL} SOL`);

    // Determine swap amount (keep 0.1 SOL for fees)
    const reserveSOL = 0.1;
    const availableSOL = solBalanceInSOL - reserveSOL;

    if (availableSOL <= 0) {
      console.log('[AutoRefill] Insufficient SOL balance');
      return;
    }

    // Calculate how much to swap to reach threshold + buffer
    const targetAKT = aktThreshold * 1.5; // Add 50% buffer
    const amountToSwap = Math.min(availableSOL, 0.5); // Cap at 0.5 SOL per refill

    console.log(`[AutoRefill] Swapping ${amountToSwap} SOL to reach ${targetAKT} AKT`);

    // Execute swap
    const result = await swapSOLtoAKT(
      amountToSwap,
      targetAKT * 0.95, // Allow 5% slippage
      nodeWallet,
      cosmosAddress
    );

    console.log(`[AutoRefill] Swap initiated: ${result.requestId}`);
    console.log(`[AutoRefill] Expected AKT: ${result.amountAKTReceived}`);
    console.log(`[AutoRefill] Cost: $${result.totalCostUSD}`);

    // Log cost for accounting
    await logDeploymentCost({
      nodeId: nodeWallet.publicKey.toBase58(),
      type: 'swap',
      chain: 'solana+cosmos',
      cost: result.totalCostUSD,
      txHash: result.txHash || '',
      requestId: result.requestId
    });

  } catch (error) {
    console.error('[AutoRefill] Failed:', error);
    throw error;
  }
}

/**
 * Log deployment cost for accounting (stub - implement with your DB)
 */
async function logDeploymentCost(data: any): Promise<void> {
  // TODO: Implement database logging
  console.log('[CostTracking]', JSON.stringify(data, null, 2));
}

// Example: Run auto-refill
if (require.main === module) {
  (async () => {
    // Load wallet from environment
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('SOLANA_PRIVATE_KEY not set');
    }

    const wallet = Keypair.fromSecretKey(bs58.decode(privateKey));
    const cosmosAddress = process.env.COSMOS_ADDRESS || '';

    await autoRefillAKT(wallet, cosmosAddress);
  })();
}
