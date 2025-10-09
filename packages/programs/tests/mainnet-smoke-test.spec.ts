/**
 * Mainnet Smoke Test Suite
 *
 * Story 1.9: Deploy to Mainnet-Beta
 *
 * This test suite validates core functionality on mainnet with real SOL.
 * Tests use minimal amounts to reduce costs (~0.5 SOL total).
 *
 * PREREQUISITES:
 * 1. Program deployed to mainnet: `anchor deploy --provider.cluster mainnet`
 * 2. Anchor.toml updated with mainnet program ID
 * 3. HELIUS_RPC_URL environment variable set
 * 4. Test wallet funded with 0.5 SOL:
 *    - Create: `solana-keygen new -o ~/.config/solana/mainnet-test.json`
 *    - Fund: Transfer 0.5 SOL from exchange/DEX
 *    - Verify: `solana balance ~/.config/solana/mainnet-test.json --url mainnet-beta`
 *
 * EXECUTION:
 * ```bash
 * anchor test --provider.cluster mainnet --skip-build tests/mainnet-smoke-test.spec.ts
 * ```
 *
 * EXPECTED RESULTS:
 * - All 6 smoke tests pass
 * - Transaction signatures logged for verification on Solana Explorer
 * - Total SOL spent: ~0.3 SOL (0.1 project + 0.15 bid/stake + 0.05 fees)
 */

import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SlopMachine } from "../target/types/slop_machine";
import { expect, assert } from "chai";

describe("Mainnet Smoke Tests", () => {
  // Configure provider for mainnet
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SlopMachine as Program<SlopMachine>;

  // Mainnet Pyth SOL/USD price feed (Story 1.9 AC #4)
  const PYTH_MAINNET_SOL_USD = new PublicKey(
    "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"
  );

  // Test wallet (should be pre-funded with 0.5 SOL)
  let testWallet: Keypair;

  // Test accounts
  let projectKeypair: Keypair;
  let projectPda: PublicKey;
  let escrowPda: PublicKey;
  let opportunityKeypair: Keypair;
  let nodeWallet: Keypair;
  let nodeRegistryPda: PublicKey;
  let bidPda: PublicKey;
  let stakePda: PublicKey;

  // Transaction signatures for verification
  const txSignatures: { test: string; signature: string }[] = [];

  before(async () => {
    console.log("\n=== Mainnet Smoke Test Suite ===");
    console.log(`Cluster: ${provider.connection.rpcEndpoint}`);
    console.log(`Program ID: ${program.programId.toBase58()}`);
    console.log(`Test Wallet: ${provider.wallet.publicKey.toBase58()}\n`);

    // Verify test wallet has sufficient balance
    const balance = await provider.connection.getBalance(provider.wallet.publicKey);
    const balanceSol = balance / LAMPORTS_PER_SOL;
    console.log(`Test Wallet Balance: ${balanceSol.toFixed(4)} SOL`);

    expect(balanceSol).to.be.greaterThan(
      0.3,
      "Test wallet must have at least 0.3 SOL for smoke tests"
    );

    // Initialize test wallet and accounts
    testWallet = provider.wallet.payer; // Use provider wallet as test wallet
    projectKeypair = Keypair.generate();
    opportunityKeypair = Keypair.generate();
    nodeWallet = Keypair.generate();

    console.log(`Project: ${projectKeypair.publicKey.toBase58()}`);
    console.log(`Opportunity: ${opportunityKeypair.publicKey.toBase58()}`);
    console.log(`Node: ${nodeWallet.publicKey.toBase58()}\n`);
  });

  describe("Smoke Test 1: Create Project", () => {
    it("should create test project with 0.1 SOL budget", async () => {
      // AC #5: Create test project with 0.1 SOL budget
      const projectName = "Mainnet Smoke Test Project";
      const budgetSol = new BN(0.1 * LAMPORTS_PER_SOL);
      const fundingType = { sol: {} }; // Native SOL funding

      // Derive project PDA
      [projectPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("project"), projectKeypair.publicKey.toBuffer()],
        program.programId
      );

      // Derive escrow PDA
      [escrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), projectPda.toBuffer()],
        program.programId
      );

      console.log(`Creating project: ${projectName}`);
      console.log(`Budget: 0.1 SOL`);
      console.log(`Project PDA: ${projectPda.toBase58()}`);
      console.log(`Escrow PDA: ${escrowPda.toBase58()}`);

      try {
        const tx = await program.methods
          .createProject(projectName, budgetSol, fundingType)
          .accounts({
            project: projectPda,
            projectAccount: projectKeypair.publicKey,
            escrow: escrowPda,
            creator: testWallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([projectKeypair])
          .rpc();

        console.log(`✓ Transaction signature: ${tx}\n`);
        txSignatures.push({ test: "Create Project", signature: tx });

        // Verify project account created
        const projectAccount = await program.account.project.fetch(projectPda);
        expect(projectAccount.budget.toString()).to.equal(budgetSol.toString());
        expect(projectAccount.creator.toBase58()).to.equal(testWallet.publicKey.toBase58());
      } catch (error) {
        console.error(`✗ Create project failed: ${error}`);
        throw error;
      }
    });
  });

  describe("Smoke Test 2: Create Opportunity", () => {
    it("should create test opportunity for $5 story", async () => {
      // AC #5: Create test opportunity for $5 story (USD to SOL via Pyth mainnet)
      const title = "Mainnet Smoke Test Story";
      const description = "Testing opportunity creation on mainnet with real SOL";
      const usdAmount = 5.0; // $5 USD
      const workType = { story: {} };

      console.log(`Creating opportunity: ${title}`);
      console.log(`Target: $${usdAmount} USD`);
      console.log(`Work type: Story`);

      try {
        // Get current SOL/USD price from Pyth
        const pythAccountInfo = await provider.connection.getAccountInfo(PYTH_MAINNET_SOL_USD);
        expect(pythAccountInfo).to.not.be.null;
        console.log(`Pyth price feed verified: ${PYTH_MAINNET_SOL_USD.toBase58()}`);

        const tx = await program.methods
          .createOpportunity(title, description, usdAmount, workType)
          .accounts({
            opportunity: opportunityKeypair.publicKey,
            project: projectPda,
            escrow: escrowPda,
            pythPriceAccount: PYTH_MAINNET_SOL_USD,
            creator: testWallet.publicKey,
            systemProgram: SystemProgram.programId,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          })
          .signers([opportunityKeypair])
          .rpc();

        console.log(`✓ Transaction signature: ${tx}\n`);
        txSignatures.push({ test: "Create Opportunity", signature: tx });

        // Verify opportunity account created
        const opportunityAccount = await program.account.opportunity.fetch(
          opportunityKeypair.publicKey
        );
        expect(opportunityAccount.project.toBase58()).to.equal(projectPda.toBase58());
        expect(opportunityAccount.title).to.equal(title);
      } catch (error) {
        console.error(`✗ Create opportunity failed: ${error}`);
        throw error;
      }
    });
  });

  describe("Smoke Test 3: Register Node", () => {
    it("should register test node (tier 0)", async () => {
      // AC #5: Register test node (tier 0)
      const nodeType = { developer: {} };
      const metadata = "Mainnet smoke test node";

      // Derive node registry PDA
      [nodeRegistryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("node_registry"), nodeWallet.publicKey.toBuffer()],
        program.programId
      );

      console.log(`Registering node: ${nodeWallet.publicKey.toBase58()}`);
      console.log(`Node type: Developer`);
      console.log(`Node Registry PDA: ${nodeRegistryPda.toBase58()}`);

      try {
        // First, airdrop some SOL to node wallet for transaction fees
        const airdropSig = await provider.connection.requestAirdrop(
          nodeWallet.publicKey,
          0.01 * LAMPORTS_PER_SOL
        );
        await provider.connection.confirmTransaction(airdropSig);
        console.log(`Node wallet funded with 0.01 SOL for fees`);

        const tx = await program.methods
          .registerNode(nodeType, metadata)
          .accounts({
            nodeRegistry: nodeRegistryPda,
            node: nodeWallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([nodeWallet])
          .rpc();

        console.log(`✓ Transaction signature: ${tx}\n`);
        txSignatures.push({ test: "Register Node", signature: tx });

        // Verify node registry account created
        const nodeRegistryAccount = await program.account.nodeRegistry.fetch(nodeRegistryPda);
        expect(nodeRegistryAccount.nodeAddress.toBase58()).to.equal(
          nodeWallet.publicKey.toBase58()
        );
        expect(nodeRegistryAccount.tier).to.equal(0); // New node starts at tier 0
      } catch (error) {
        console.error(`✗ Register node failed: ${error}`);
        throw error;
      }
    });
  });

  describe("Smoke Test 4: Submit Bid with Stake", () => {
    it("should submit bid with stake (0.025 SOL bid + 0.125 SOL stake @ 5x multiplier)", async () => {
      // AC #5: Submit bid with stake (0.025 SOL bid + 0.125 SOL stake @ 5x multiplier)
      // For a $5 story @ $100/SOL: 0.05 SOL payment
      // Tier 0 node: 5.0x multiplier, $10 min stake = 0.1 SOL
      // Bid: 0.05 SOL / 2 = 0.025 SOL (assuming 50% payment on acceptance)
      // Stake: max(0.1 SOL, 0.05 * 5.0) = 0.25 SOL (but we'll use 0.125 for smoke test)

      const bidAmount = new BN(0.025 * LAMPORTS_PER_SOL);
      const message = "Mainnet smoke test bid";

      // Derive bid and stake PDAs
      const clock = await provider.connection.getClock();
      const timestamp = new BN(clock.unixTimestamp);

      [bidPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("bid"),
          opportunityKeypair.publicKey.toBuffer(),
          nodeWallet.publicKey.toBuffer(),
          timestamp.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      [stakePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("stake"),
          opportunityKeypair.publicKey.toBuffer(),
          nodeWallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      console.log(`Submitting bid: ${bidAmount.toNumber() / LAMPORTS_PER_SOL} SOL`);
      console.log(`Bid PDA: ${bidPda.toBase58()}`);
      console.log(`Stake PDA: ${stakePda.toBase58()}`);

      try {
        // Fund node wallet with additional SOL for bid + stake
        const fundAmount = 0.2 * LAMPORTS_PER_SOL; // Extra buffer
        const fundTx = await provider.connection.requestAirdrop(
          nodeWallet.publicKey,
          fundAmount
        );
        await provider.connection.confirmTransaction(fundTx);
        console.log(`Node wallet funded with 0.2 SOL for bid/stake`);

        const tx = await program.methods
          .submitBidWithStake(bidAmount, message)
          .accounts({
            bid: bidPda,
            stake: stakePda,
            opportunity: opportunityKeypair.publicKey,
            nodeRegistry: nodeRegistryPda,
            pythPriceAccount: PYTH_MAINNET_SOL_USD,
            node: nodeWallet.publicKey,
            escrowPda: escrowPda,
            systemProgram: SystemProgram.programId,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          })
          .signers([nodeWallet])
          .rpc();

        console.log(`✓ Transaction signature: ${tx}\n`);
        txSignatures.push({ test: "Submit Bid", signature: tx });

        // Verify bid and stake accounts created
        const bidAccount = await program.account.bid.fetch(bidPda);
        expect(bidAccount.amount.toString()).to.equal(bidAmount.toString());
        expect(bidAccount.node.toBase58()).to.equal(nodeWallet.publicKey.toBase58());

        const stakeAccount = await program.account.stake.fetch(stakePda);
        expect(stakeAccount.nodeAddress.toBase58()).to.equal(nodeWallet.publicKey.toBase58());
        expect(stakeAccount.multiplier).to.equal(5.0); // Tier 0 multiplier
      } catch (error) {
        console.error(`✗ Submit bid failed: ${error}`);
        throw error;
      }
    });
  });

  describe("Smoke Test 5: Accept Bid and Verify Escrow", () => {
    it("should accept bid and verify escrow lock", async () => {
      // AC #5: Accept bid and verify escrow lock
      console.log(`Accepting bid from node: ${nodeWallet.publicKey.toBase58()}`);

      try {
        const tx = await program.methods
          .acceptBid()
          .accounts({
            bid: bidPda,
            opportunity: opportunityKeypair.publicKey,
            project: projectPda,
            escrow: escrowPda,
            creator: testWallet.publicKey,
            node: nodeWallet.publicKey,
          })
          .rpc();

        console.log(`✓ Transaction signature: ${tx}\n`);
        txSignatures.push({ test: "Accept Bid", signature: tx });

        // Verify bid status updated to accepted
        const bidAccount = await program.account.bid.fetch(bidPda);
        expect(bidAccount.status.hasOwnProperty("accepted")).to.be.true;

        // Verify opportunity status updated to in progress
        const opportunityAccount = await program.account.opportunity.fetch(
          opportunityKeypair.publicKey
        );
        expect(opportunityAccount.status.hasOwnProperty("inProgress")).to.be.true;
        expect(opportunityAccount.assignedNode?.toBase58()).to.equal(
          nodeWallet.publicKey.toBase58()
        );
      } catch (error) {
        console.error(`✗ Accept bid failed: ${error}`);
        throw error;
      }
    });
  });

  describe("Smoke Test 6: Simulate Validation Pass", () => {
    it("should simulate validation pass → verify payment + stake return", async () => {
      // AC #5: Simulate validation pass → verify payment + stake return
      console.log(`Simulating validation pass for opportunity`);

      // Get node wallet balance before payment
      const balanceBefore = await provider.connection.getBalance(nodeWallet.publicKey);

      try {
        // Submit work (stub - actual implementation depends on work submission instruction)
        // For smoke test, we'll directly call the payment release instruction
        const tx = await program.methods
          .releasePayment()
          .accounts({
            opportunity: opportunityKeypair.publicKey,
            project: projectPda,
            escrow: escrowPda,
            stake: stakePda,
            node: nodeWallet.publicKey,
            creator: testWallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        console.log(`✓ Transaction signature: ${tx}\n`);
        txSignatures.push({ test: "Release Payment", signature: tx });

        // Verify payment released to node
        const balanceAfter = await provider.connection.getBalance(nodeWallet.publicKey);
        const paymentReceived = (balanceAfter - balanceBefore) / LAMPORTS_PER_SOL;
        console.log(`Payment received: ${paymentReceived.toFixed(4)} SOL`);
        expect(balanceAfter).to.be.greaterThan(balanceBefore);

        // Verify stake returned
        const stakeAccount = await program.account.stake.fetch(stakePda);
        expect(stakeAccount.status.hasOwnProperty("released")).to.be.true;
      } catch (error) {
        console.error(`✗ Payment release failed: ${error}`);
        throw error;
      }
    });
  });

  after(() => {
    console.log("\n=== Smoke Test Summary ===\n");
    console.log("Transaction Signatures for Verification:\n");

    txSignatures.forEach(({ test, signature }) => {
      console.log(`${test}:`);
      console.log(`  Signature: ${signature}`);
      console.log(`  solscan.io: https://solscan.io/tx/${signature}`);
      console.log(`  solana.fm:  https://solana.fm/tx/${signature}?cluster=mainnet-beta\n`);
    });

    console.log("=== Smoke Tests Complete ===\n");
    console.log(`Total tests executed: ${txSignatures.length}/6`);
    console.log(`View full results: packages/programs/tests/mainnet-smoke-test-results.md\n`);
  });
});
