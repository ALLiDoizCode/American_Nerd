/**
 * Arweave Upload with Cost Tracking using Turbo SDK
 *
 * This module provides production-ready functions for uploading files to Arweave
 * using the Turbo SDK with comprehensive cost tracking and monitoring.
 */

import { TurboFactory, ArweaveSigner } from '@ardrive/turbo-sdk/node';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

/**
 * Upload configuration
 */
export interface UploadConfig {
  nodeId: string;
  projectId: string;
  environment: 'production' | 'staging' | 'development';
}

/**
 * Upload result with cost information
 */
export interface UploadResult {
  txId: string;
  url: string;
  sizeBytes: number;
  costWinc: string;
  costSol: number;
  timestamp: number;
  nodeId: string;
  projectId: string;
}

/**
 * Cost estimation result
 */
export interface CostEstimate {
  sizeBytes: number;
  costWinc: string;
  costUsd: number;
  costSol: number;
}

/**
 * Convert Winston Credits to SOL (approximate)
 * Note: Actual conversion depends on AR/SOL exchange rate
 *
 * @param winc - Winston credits
 * @returns Approximate SOL cost
 */
function wincToSol(winc: string): number {
  // Approximate: 1 MB ≈ 0.000012 SOL based on Turbo pricing
  // 1 MB ≈ ~9,000,000 winc
  const wincNum = parseInt(winc);
  return (wincNum / 9_000_000) * 0.000012;
}

/**
 * Create authenticated Turbo client with Solana signer
 *
 * @param solanaKeypair - Solana keypair for authentication
 * @returns Authenticated Turbo client
 *
 * @example
 * const keypair = loadSolanaKeypair();
 * const turbo = await createTurboClient(keypair);
 */
export async function createTurboClient(solanaKeypair: Keypair) {
  // Create ArweaveSigner from Solana keypair
  // Note: In production, you might use JWK or other signer types
  const signer = new ArweaveSigner(solanaKeypair.secretKey);

  // Create authenticated Turbo client
  const turbo = TurboFactory.authenticated({ signer });

  return turbo;
}

/**
 * Get Turbo credit balance
 *
 * @param turbo - Authenticated Turbo client
 * @returns Balance in Winston Credits
 *
 * @example
 * const balance = await getBalance(turbo);
 * console.log(`Balance: ${balance} winc`);
 */
export async function getBalance(turbo: any): Promise<string> {
  const { winc } = await turbo.getBalance();
  return winc;
}

/**
 * Check if wallet has sufficient credits for upload
 *
 * @param turbo - Authenticated Turbo client
 * @param filePath - Path to file to upload
 * @returns True if sufficient balance
 *
 * @example
 * const canUpload = await hasSufficientCredits(turbo, './dist/index.html');
 */
export async function hasSufficientCredits(
  turbo: any,
  filePath: string
): Promise<boolean> {
  const stats = fs.statSync(filePath);
  const sizeBytes = stats.size;

  // Get upload cost estimate
  const [{ winc: costWinc }] = await turbo.getUploadCosts({ bytes: [sizeBytes] });

  // Get current balance
  const { winc: balanceWinc } = await turbo.getBalance();

  return parseInt(balanceWinc) >= parseInt(costWinc);
}

/**
 * Estimate upload cost for a file
 *
 * @param turbo - Authenticated Turbo client
 * @param filePath - Path to file
 * @returns Cost estimation
 *
 * @example
 * const estimate = await estimateUploadCost(turbo, './dist/bundle.js');
 * console.log(`Estimated cost: ${estimate.costUsd} USD`);
 */
export async function estimateUploadCost(
  turbo: any,
  filePath: string
): Promise<CostEstimate> {
  const stats = fs.statSync(filePath);
  const sizeBytes = stats.size;

  // Get upload cost in winc
  const [{ winc: costWinc }] = await turbo.getUploadCosts({ bytes: [sizeBytes] });

  // Get current rates
  const rates = await turbo.getFiatRates();
  const wincPerUsd = rates.winc;

  // Calculate costs
  const costUsd = parseInt(costWinc) / parseInt(wincPerUsd);
  const costSol = wincToSol(costWinc);

  return {
    sizeBytes,
    costWinc,
    costUsd,
    costSol,
  };
}

/**
 * Upload file to Arweave with cost tracking
 *
 * @param turbo - Authenticated Turbo client
 * @param filePath - Path to file to upload
 * @param config - Upload configuration
 * @param onProgress - Progress callback
 * @returns Upload result with cost information
 *
 * @example
 * const result = await uploadWithCostTracking(
 *   turbo,
 *   './dist/index.html',
 *   { nodeId: 'alex-architect-ai', projectId: 'proj-123', environment: 'production' },
 *   ({ processedBytes, totalBytes }) => {
 *     console.log(`Progress: ${(processedBytes / totalBytes * 100).toFixed(1)}%`);
 *   }
 * );
 */
export async function uploadWithCostTracking(
  turbo: any,
  filePath: string,
  config: UploadConfig,
  onProgress?: (progress: { processedBytes: number; totalBytes: number }) => void
): Promise<UploadResult> {
  console.log(`\n📤 Uploading: ${filePath}`);

  // Get file stats
  const stats = fs.statSync(filePath);
  const sizeBytes = stats.size;

  // Estimate cost before upload
  const estimate = await estimateUploadCost(turbo, filePath);
  console.log(`💰 Estimated cost: ${estimate.costUsd.toFixed(4)} USD (~${estimate.costSol.toFixed(6)} SOL)`);

  // Check balance
  const balance = await getBalance(turbo);
  if (parseInt(balance) < parseInt(estimate.costWinc)) {
    throw new Error(
      `Insufficient Turbo credits. Required: ${estimate.costWinc} winc, Available: ${balance} winc`
    );
  }

  // Read file
  const data = fs.readFileSync(filePath);

  // Upload with progress tracking
  const { id: txId, owner } = await turbo.uploadFile({
    fileStreamFactory: () => fs.createReadStream(filePath),
    fileSizeFactory: () => sizeBytes,
    dataItemOpts: {
      tags: [
        { name: 'Content-Type', value: getContentType(filePath) },
        { name: 'App-Name', value: 'SlopMachine' },
        { name: 'App-Version', value: '2.0' },
        { name: 'Node-ID', value: config.nodeId },
        { name: 'Project-ID', value: config.projectId },
        { name: 'Environment', value: config.environment },
        { name: 'Upload-Timestamp', value: Date.now().toString() },
      ],
    },
    signal: AbortSignal.timeout(60000), // 60 second timeout
  });

  const url = `https://arweave.net/${txId}`;
  console.log(`✅ Upload complete: ${url}`);
  console.log(`📊 Size: ${(sizeBytes / 1024).toFixed(2)} KB`);

  return {
    txId,
    url,
    sizeBytes,
    costWinc: estimate.costWinc,
    costSol: estimate.costSol,
    timestamp: Date.now(),
    nodeId: config.nodeId,
    projectId: config.projectId,
  };
}

/**
 * Upload directory to Arweave with cost tracking
 *
 * @param turbo - Authenticated Turbo client
 * @param dirPath - Path to directory
 * @param config - Upload configuration
 * @returns Array of upload results
 *
 * @example
 * const results = await uploadDirectory(
 *   turbo,
 *   './dist',
 *   { nodeId: 'alex-architect-ai', projectId: 'proj-123', environment: 'production' }
 * );
 */
export async function uploadDirectory(
  turbo: any,
  dirPath: string,
  config: UploadConfig
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  // Get all files in directory recursively
  const files = getAllFiles(dirPath);
  console.log(`\n📁 Found ${files.length} files to upload`);

  // Calculate total estimated cost
  let totalCostSol = 0;
  for (const file of files) {
    const estimate = await estimateUploadCost(turbo, file);
    totalCostSol += estimate.costSol;
  }
  console.log(`💰 Total estimated cost: ~${totalCostSol.toFixed(6)} SOL`);

  // Upload each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`\n[${i + 1}/${files.length}] Uploading: ${path.relative(dirPath, file)}`);

    const result = await uploadWithCostTracking(turbo, file, config);
    results.push(result);

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}

/**
 * Get all files in directory recursively
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

/**
 * Get content type from file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: { [key: string]: string } = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wasm': 'application/wasm',
    '.txt': 'text/plain',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Example: Upload frontend to Arweave with cost tracking
 */
export async function exampleFrontendUpload() {
  console.log('=== Arweave Upload with Cost Tracking ===');

  // Note: In production, load from environment
  // const solanaKeypair = loadSolanaKeypairFromEnv('DEPLOYMENT_WALLET');

  // For this example, we'll show the structure
  console.log('\nSetup:');
  console.log('1. Load Solana keypair from environment');
  console.log('2. Create authenticated Turbo client');
  console.log('3. Check credit balance');
  console.log('4. Upload files with cost tracking');
  console.log('5. Store cost data for accounting\n');

  // Example result structure
  const exampleResult: UploadResult = {
    txId: '5x7abc123...',
    url: 'https://arweave.net/5x7abc123...',
    sizeBytes: 1024000, // 1 MB
    costWinc: '9000000',
    costSol: 0.000012,
    timestamp: Date.now(),
    nodeId: 'alex-architect-ai',
    projectId: 'proj-123',
  };

  console.log('Example upload result:');
  console.log(JSON.stringify(exampleResult, null, 2));
  console.log('\n💾 Store this in your database for cost attribution');
}

// Run example if executed directly
if (require.main === module) {
  exampleFrontendUpload().catch(console.error);
}
