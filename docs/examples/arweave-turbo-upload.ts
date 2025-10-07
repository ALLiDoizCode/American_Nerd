/**
 * Arweave Turbo SDK Upload Script
 *
 * This script uploads a Next.js static export to Arweave using the Turbo SDK.
 * Designed for use in GitHub Actions or local deployment workflows.
 *
 * Usage:
 *   node arweave-turbo-upload.js <build-folder> <project-id>
 *
 * Environment Variables:
 *   ARWEAVE_WALLET - JSON string of Arweave wallet (JWK format)
 *   PROJECT_NAME - Name of the project (for Arweave tags)
 */

import { TurboFactory, ArweaveSigner } from '@ardrive/turbo-sdk';
import fs from 'fs';
import path from 'path';

interface UploadResult {
  txId: string;
  url: string;
  size: number;
  cost: string;
}

class ArweaveDeployer {
  private turbo: any;

  constructor(private walletJwk: string) {}

  /**
   * Initialize Turbo SDK client with Arweave wallet
   */
  async initialize() {
    try {
      const jwk = JSON.parse(this.walletJwk);
      const signer = new ArweaveSigner(jwk);

      this.turbo = TurboFactory.authenticated({ signer });

      console.log('✅ Turbo SDK initialized');

      // Check credit balance
      const balance = await this.turbo.getBalance();
      console.log(`💰 Turbo Credit Balance: ${balance.winc} winc`);

      if (balance.winc < 100000000) {
        console.warn('⚠️  WARNING: Low credit balance. Consider topping up.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Turbo SDK:', error);
      throw error;
    }
  }

  /**
   * Upload a folder to Arweave
   */
  async uploadFolder(
    folderPath: string,
    projectId: string,
    projectName: string
  ): Promise<UploadResult> {
    // Get folder size
    const size = this.getFolderSize(folderPath);
    console.log(`📦 Build size: ${(size / 1024 / 1024).toFixed(2)} MB`);

    // Estimate cost
    const costEstimate = await this.turbo.getUploadCosts({
      bytes: [size]
    });
    console.log(`💵 Estimated cost: ${costEstimate.winc} winc (~$${(costEstimate.winc / 1e12).toFixed(3)})`);

    // Upload folder
    console.log('⬆️  Uploading to Arweave...');
    const startTime = Date.now();

    const result = await this.turbo.uploadFolder({
      folderPath,
      dataItemOpts: {
        tags: [
          { name: 'App-Name', value: projectName },
          { name: 'Project-ID', value: projectId },
          { name: 'Content-Type', value: 'text/html' },
          { name: 'Deployed-By', value: 'SlopMachine' },
          { name: 'Deployment-Timestamp', value: new Date().toISOString() },
          { name: 'App-Version', value: process.env.GITHUB_SHA || 'dev' }
        ]
      },
      events: {
        onProgress: ({ totalBytes, processedBytes, step }) => {
          const percent = ((processedBytes / totalBytes) * 100).toFixed(1);
          console.log(`  📊 Upload progress: ${percent}% (${step})`);
        },
        onComplete: ({ dataCaches, fastFinalityIndexes }) => {
          console.log('✅ Upload complete!');
          console.log(`  Data caches: ${dataCaches.length}`);
          console.log(`  Fast finality indexes: ${fastFinalityIndexes.length}`);
        },
        onError: (error) => {
          console.error('❌ Upload error:', error);
        }
      }
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⏱️  Upload duration: ${duration}s`);

    const txId = result.id;
    const url = `https://arweave.net/${txId}`;

    console.log('\n🎉 Deployment successful!');
    console.log(`  Transaction ID: ${txId}`);
    console.log(`  Arweave URL: ${url}`);
    console.log(`  Gateway URL (ar.io): https://${txId}.ar.io`);

    return {
      txId,
      url,
      size,
      cost: costEstimate.winc
    };
  }

  /**
   * Calculate total size of folder
   */
  private getFolderSize(folderPath: string): number {
    let totalSize = 0;

    const files = this.getAllFiles(folderPath);
    for (const file of files) {
      totalSize += fs.statSync(file).size;
    }

    return totalSize;
  }

  /**
   * Recursively get all files in a folder
   */
  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(filePath, arrayOfFiles);
      } else {
        arrayOfFiles.push(filePath);
      }
    }

    return arrayOfFiles;
  }

  /**
   * Save deployment result to file (for GitHub Actions)
   */
  saveDeploymentInfo(result: UploadResult, outputPath: string = 'arweave-deployment.json') {
    const deploymentInfo = {
      txId: result.txId,
      url: result.url,
      size: result.size,
      cost: result.cost,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    };

    fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));

    // Also save just TX ID for simple consumption
    fs.writeFileSync('arweave-tx-id.txt', result.txId);

    console.log(`📝 Deployment info saved to ${outputPath}`);
  }
}

/**
 * Main execution function
 */
async function main() {
  const buildFolder = process.argv[2];
  const projectId = process.argv[3];
  const projectName = process.env.PROJECT_NAME || 'slopmachine-project';

  if (!buildFolder || !projectId) {
    console.error('Usage: node arweave-turbo-upload.js <build-folder> <project-id>');
    process.exit(1);
  }

  if (!process.env.ARWEAVE_WALLET) {
    console.error('ERROR: ARWEAVE_WALLET environment variable not set');
    process.exit(1);
  }

  if (!fs.existsSync(buildFolder)) {
    console.error(`ERROR: Build folder not found: ${buildFolder}`);
    process.exit(1);
  }

  console.log('🚀 Starting Arweave deployment...');
  console.log(`  Build folder: ${buildFolder}`);
  console.log(`  Project ID: ${projectId}`);
  console.log(`  Project name: ${projectName}`);
  console.log('');

  try {
    const deployer = new ArweaveDeployer(process.env.ARWEAVE_WALLET);
    await deployer.initialize();

    const result = await deployer.uploadFolder(buildFolder, projectId, projectName);
    deployer.saveDeploymentInfo(result);

    console.log('\n✅ Deployment complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { ArweaveDeployer, UploadResult };
