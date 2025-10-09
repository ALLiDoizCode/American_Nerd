import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { SlopMachine } from "../target/types/slop_machine";
import { expect, assert } from "chai";

/**
 * Story 1.8: Devnet Integration Tests
 *
 * Comprehensive integration testing suite for Slop Machine program on Solana devnet.
 * Tests complete workflows including:
 * - Project creation and budget deposit
 * - Opportunity creation with Pyth oracle integration
 * - Node registration (tier 0, 5, 10)
 * - Bid submission with tier-based staking
 * - Opportunity assignment to lowest bidder
 * - Work submission with validation pass → payment + stake release
 * - Work submission with validation fail → failure tracking
 * - 3 consecutive failures → stake slashing
 * - Reputation tier progression (tier 0 → tier 3 after 10 successful stories)
 * - Pyth oracle SOL/USD price conversions
 */

describe("Devnet Integration Tests", () => {
  // Configure provider for devnet (NOT localnet)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SlopMachine as Program<SlopMachine>;
  const connection = provider.connection;

  // Pyth SOL/USD devnet price feed (Story 1.6)
  const PYTH_SOL_USD_DEVNET = new PublicKey(
    'J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix'
  );

  // Canonical Solana burn address (50% of slashed stake goes here)
  const BURN_ADDRESS = new PublicKey("11111111111111111111111111111112");

  // Test fixtures - wallet keypairs for different participants
  let projectCreator: Keypair;
  let tier0Node: Keypair;
  let tier5Node: Keypair;
  let tier10Node: Keypair;
  let qaReviewer: Keypair;
  let platformWallet: Keypair;

  // Test state - tracking PDAs and accounts across tests
  let projectId: BN;
  let projectEscrowPda: PublicKey;

  /**
   * Helper function to request devnet airdrop with retry logic
   * Devnet faucet has rate limits, so we retry a few times
   */
  async function requestAirdrop(pubkey: PublicKey, lamports: number, maxRetries = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const signature = await connection.requestAirdrop(pubkey, lamports);
        await connection.confirmTransaction(signature, "confirmed");
        console.log(`  ✓ Airdropped ${lamports / LAMPORTS_PER_SOL} SOL to ${pubkey.toBase58().slice(0, 8)}...`);
        return;
      } catch (err) {
        if (i === maxRetries - 1) {
          throw new Error(`Airdrop failed after ${maxRetries} retries: ${err.message}`);
        }
        console.log(`  ⚠ Airdrop attempt ${i + 1} failed, retrying in 2s...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  /**
   * Setup test wallets and fund them via devnet faucet
   * Called once before all tests
   */
  before(async () => {
    console.log("\n📋 Setting up devnet integration test environment...");
    console.log(`   RPC: ${connection.rpcEndpoint}`);
    console.log(`   Program: ${program.programId.toBase58()}`);

    // Generate test keypairs
    projectCreator = Keypair.generate();
    tier0Node = Keypair.generate();
    tier5Node = Keypair.generate();
    tier10Node = Keypair.generate();
    qaReviewer = Keypair.generate();
    platformWallet = Keypair.generate();

    console.log("\n💰 Funding test wallets via devnet faucet...");
    console.log("   (This may take 30-60 seconds due to rate limits)");

    // Fund each wallet with 2 SOL (enough for testing + rent + fees)
    // Devnet faucet is rate-limited, so we request sequentially
    await requestAirdrop(projectCreator.publicKey, 2 * LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay between requests

    await requestAirdrop(tier0Node.publicKey, 2 * LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await requestAirdrop(tier5Node.publicKey, 2 * LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await requestAirdrop(tier10Node.publicKey, 2 * LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await requestAirdrop(qaReviewer.publicKey, 2 * LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await requestAirdrop(platformWallet.publicKey, 2 * LAMPORTS_PER_SOL);

    console.log("\n✅ Test environment ready\n");
  });

  /**
   * Test 1: Project Creation
   * AC #3: Test project creation with budget deposit
   */
  describe("1. Project Creation", () => {
    it("creates project with 1 SOL budget deposit", async () => {
      projectId = new BN(Date.now()); // Use timestamp as unique project ID
      const opportunityId = new BN(1);
      const amount = new BN(1 * LAMPORTS_PER_SOL); // 1 SOL budget

      // Derive project escrow PDA
      [projectEscrowPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("escrow"),
          projectId.toArrayLike(Buffer, "le", 8),
          opportunityId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      // Get balances before
      const creatorBalanceBefore = await connection.getBalance(projectCreator.publicKey);

      // Create project escrow with budget deposit
      const tx = await program.methods
        .createProjectEscrow(projectId, opportunityId, amount)
        .accounts({
          escrow: projectEscrowPda,
          client: projectCreator.publicKey,
          developer: tier0Node.publicKey, // Placeholder for now
          qaReviewer: qaReviewer.publicKey,
          platformWallet: platformWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([projectCreator])
        .rpc();

      console.log(`     TX: ${tx.slice(0, 16)}...`);

      // Verify escrow account created
      const escrowAccount = await program.account.escrow.fetch(projectEscrowPda);
      expect(escrowAccount.projectId.toString()).to.equal(projectId.toString());
      expect(escrowAccount.amount.toString()).to.equal(amount.toString());
      expect(escrowAccount.client.toString()).to.equal(projectCreator.publicKey.toString());

      // Verify budget deposited to escrow PDA
      const escrowBalance = await connection.getBalance(projectEscrowPda);
      expect(escrowBalance).to.be.greaterThan(amount.toNumber()); // Includes rent

      // Verify creator balance decreased
      const creatorBalanceAfter = await connection.getBalance(projectCreator.publicKey);
      expect(creatorBalanceBefore - creatorBalanceAfter).to.be.greaterThan(amount.toNumber());

      console.log(`     ✓ Project ${projectId} created with 1 SOL budget`);
      console.log(`     ✓ Escrow PDA: ${projectEscrowPda.toBase58().slice(0, 16)}...`);
    });
  });

  /**
   * Test 2: Opportunity Creation (with Pyth Oracle)
   * AC #3: Test opportunity creation for $5 story
   * AC #4, #5: Test Pyth oracle integration (live devnet feed)
   */
  describe("2. Opportunity Creation with Pyth Oracle", () => {
    it.skip("creates opportunity for $5 story with SOL/USD conversion [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Call create_opportunity instruction
      // Fetch live SOL/USD price from Pyth devnet
      // Calculate $5 in lamports using usd_to_lamports helper
      // Verify opportunity created with correct budget_sol and budget_usd_equivalent
    });

    it("fetches live SOL/USD price from Pyth devnet", async () => {
      const pythAccount = await connection.getAccountInfo(PYTH_SOL_USD_DEVNET);
      expect(pythAccount).to.not.be.null;

      // Verify account has data (price feed data)
      expect(pythAccount.data.length).to.be.greaterThan(0);

      console.log(`     ✓ Pyth price feed: ${pythAccount.data.length} bytes`);
      console.log(`     ✓ Feed account: ${PYTH_SOL_USD_DEVNET.toBase58()}`);
    });

    it.skip("validates $2.50 minimum bid in USD [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Test minimum bid validation (AC #5)
      // Call create_opportunity with budget < $2.50
      // Verify error returned: BidBelowMinimumUSD
    });
  });

  /**
   * Test 3: Node Registration (3 test nodes: tier 0, 5, 10)
   * AC #3: Test node registration with different reputation tiers
   */
  describe("3. Node Registration", () => {
    it.skip("registers tier 0 node (0 completed, 0 attempted) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Call register_node instruction for tier0Node
      // Verify NodeRegistry account created with correct values:
      // - reputation_tier: 0
      // - stake_multiplier: 5.0x (500 basis points)
      // - max_story_size: $5 (500 cents)
      // - min_absolute_stake: $10 (1000 cents)
    });

    it.skip("registers tier 5 node (25 completed, 25 attempted, 100% success) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Call register_node instruction for tier5Node (mocked 25 completed)
      // Verify NodeRegistry account created with correct values:
      // - reputation_tier: 5 (sqrt(25) * 1.0 = 5.0)
      // - stake_multiplier: 2.36x
      // - max_story_size: $18 (1800 cents)
      // - min_absolute_stake: $13.89 (1389 cents)
    });

    it.skip("registers tier 10 node (100 completed, 100 attempted, 100% success) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Call register_node instruction for tier10Node (mocked 100 completed)
      // Verify NodeRegistry account created with correct values:
      // - reputation_tier: 10 (sqrt(100) * 1.0 = 10.0)
      // - stake_multiplier: 1.12x
      // - max_story_size: $72 (7200 cents)
      // - min_absolute_stake: $15.66 (1566 cents)
    });
  });

  /**
   * Test 4: Bid Submission with Tier-Based Staking
   * AC #3: Test bid submission with stake lock (all 3 nodes)
   */
  describe("4. Bid Submission with Staking", () => {
    it.skip("tier 0 node bids $5 (requires $25 stake = 5x) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Tier 0 node bids $5, requires $25 stake (5.0x multiplier)
      // At $100/SOL: $5 = 0.05 SOL, $25 = 0.25 SOL stake
    });

    it.skip("tier 5 node bids $4.50 (requires $10.62 stake = 2.36x) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Tier 5 node bids $4.50, requires $10.62 stake (2.36x multiplier)
      // At $100/SOL: $4.50 = 0.045 SOL, $10.62 = 0.1062 SOL stake
    });

    it.skip("tier 10 node bids $4 (requires $4.48 stake = 1.12x) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Tier 10 node bids $4, requires $4.48 stake (1.12x multiplier)
      // At $100/SOL: $4 = 0.04 SOL, $4.48 = 0.0448 SOL stake
    });
  });

  /**
   * Test 5: Opportunity Assignment
   * AC #3: Test opportunity assignment to lowest bidder
   */
  describe("5. Opportunity Assignment", () => {
    it.skip("assigns opportunity to lowest bidder (tier 10, $4 bid) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Accept tier 10 node's $4 bid (lowest among $5, $4.50, $4)
      // Verify opportunity status: Open → Assigned
      // Verify other bids marked as Rejected
      // Verify payment + stake locked in story escrow
    });
  });

  /**
   * Test 6: Successful Payment Flow
   * AC #3: Test work submission with validation pass → payment + stake release
   */
  describe("6. Work Submission - Validation Pass", () => {
    it.skip("releases $4 payment + $4.48 stake on validation success [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Submit work with mock Arweave TX ID
      // Simulate validation pass (all checks green)
      // Call release_payment_and_stake instruction
      // Verify $4 payment transferred to tier 10 node wallet
      // Verify $4.48 stake returned to tier 10 node wallet
      // Verify reputation updated: 100→101 completed, 100→101 attempted
      // Verify tier remains 10 (sqrt(101) * 1.0 = 10.04 → floor = 10)
    });

    it.skip("updates reputation: 100 → 101 completed, 100 → 101 attempted [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Verify NodeRegistry reputation counters incremented
    });

    it.skip("maintains tier 10 after successful completion [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Verify tier calculation: sqrt(101) * 1.0 = 10.04 → tier 10
    });
  });

  /**
   * Test 7: Failure Flow (Single Failure)
   * AC #3: Test work submission with validation fail → failure count increment
   */
  describe("7. Work Submission - Validation Fail", () => {
    it.skip("increments failure_count to 1 on validation failure [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Create new opportunity and assign to tier 0 node
      // Submit work with mock deliverable
      // Simulate validation failure (tests fail)
      // Verify failure_count increments to 1
      // Verify stake remains locked
      // Verify payment remains in escrow
    });

    it.skip("keeps stake locked after single failure [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Verify StakeEscrow status remains Locked
    });

    it.skip("keeps payment in escrow after single failure [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Verify Escrow status remains PendingReview
    });
  });

  /**
   * Test 8: Slashing Flow (3 Consecutive Failures)
   * AC #3: Test 3 failures → stake slash
   */
  describe("8. Stake Slashing - 3 Consecutive Failures", () => {
    it.skip("slashes stake after 3 validation failures (50/50 split) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Simulate 2 more validation failures (failure_count = 3)
      // Call slash_stake_and_refund instruction
      // Verify stake slashed: 50% to project escrow, 50% to burn address
      // Verify payment returned to project escrow
      // Verify reputation updated: 0 completed (unchanged), 0→1 attempted
      // Verify tier remains 0 (0/1 = 0% success → tier 0)
      // Verify SlashEvent account created with slash details
    });

    it.skip("distributes slashed stake: 50% to project, 50% burned [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // At $100/SOL: $25 stake = 0.25 SOL
      // Project escrow gets 0.125 SOL
      // Burn address gets 0.125 SOL
    });

    it.skip("refunds full payment to project escrow [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // $5 payment (0.05 SOL @ $100/SOL) returned to project
    });

    it.skip("updates reputation: attempted++ only (completed unchanged) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Tier 0 node: 0 completed, 0→1 attempted
    });

    it.skip("creates SlashEvent account with slash details [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Verify SlashEvent fields:
      // - slashed_amount: 0.25 SOL
      // - to_project: 0.125 SOL
      // - burned: 0.125 SOL
      // - reason: "3+ consecutive validation failures"
    });
  });

  /**
   * Test 9: Reputation Tier Progression
   * AC #6: Test reputation tier progression (complete 10 stories, verify tier increases)
   */
  describe("9. Reputation Tier Progression", () => {
    it.skip("progresses tier 0 node to tier 3 after 10 successful stories [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Start with tier 0 node (0 completed, 0 attempted)
      // Loop 10 times:
      //   - Create opportunity
      //   - Submit bid
      //   - Accept bid
      //   - Submit work
      //   - Simulate validation pass
      //   - Call release_payment_and_stake
      //   - Verify reputation counters increment
      //   - Verify tier recalculates
      //
      // After 10 successful completions:
      // - Tier: 0 → 3 (sqrt(10) * 1.0 = 3.16 → floor = 3)
      // - Stake multiplier: 5.0x → 3.18x
      // - Max story size: $5 → $13
    });

    it.skip("verifies tier calculation at each story completion [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Expected progression (100% success rate):
      // Story 0: tier 0 (0 completed)
      // Story 1: tier 1 (sqrt(1) = 1.0)
      // Story 2: tier 1 (sqrt(2) = 1.41)
      // Story 3: tier 1 (sqrt(3) = 1.73)
      // Story 4: tier 2 (sqrt(4) = 2.0)
      // Story 5: tier 2 (sqrt(5) = 2.23)
      // Story 6: tier 2 (sqrt(6) = 2.44)
      // Story 7: tier 2 (sqrt(7) = 2.64)
      // Story 8: tier 2 (sqrt(8) = 2.82)
      // Story 9: tier 3 (sqrt(9) = 3.0)
      // Story 10: tier 3 (sqrt(10) = 3.16)
    });

    it.skip("verifies stake multiplier progression [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Formula: 5.0 * exp(-0.15 * tier)
      // Tier 0: 5.0x
      // Tier 1: 4.30x
      // Tier 2: 3.70x
      // Tier 3: 3.18x
    });

    it.skip("verifies max story size progression [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Formula: 5.0 * 1.4^tier (whole dollars)
      // Tier 0: $5
      // Tier 1: $7 (5.0 * 1.4 = 7.0)
      // Tier 2: $9 (5.0 * 1.96 = 9.8 → $9)
      // Tier 3: $13 (5.0 * 2.74 = 13.72 → $13)
    });
  });

  /**
   * Test 10: Pyth Oracle Price Conversions
   * AC #4, #5: Test USD amount conversions with real devnet prices
   */
  describe("10. Pyth Oracle Integration - Price Conversions", () => {
    it("fetches live SOL/USD price from devnet Pyth feed", async () => {
      const pythAccount = await connection.getAccountInfo(PYTH_SOL_USD_DEVNET);
      expect(pythAccount).to.not.be.null;

      // Verify price data exists
      expect(pythAccount.data.length).to.be.greaterThan(0);

      console.log(`     ✓ Pyth SOL/USD devnet feed active`);
      console.log(`     ✓ Feed: ${PYTH_SOL_USD_DEVNET.toBase58()}`);

      // NOTE: This test verifies Pyth feed exists (implemented in Story 1.6)
      // Price parsing is done by program oracle utils, not tested here
    });

    it.skip("converts $5 USD to lamports using live price [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Call program helper function usd_to_lamports($5)
      // Verify conversion uses current SOL/USD price
      // Example: If SOL = $142.35, then $5 = 0.0351 SOL (35,130,419 lamports)
    });

    it.skip("converts 0.5 SOL to USD using live price [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Call program helper function lamports_to_usd(500000000)
      // Verify conversion uses current SOL/USD price
      // Example: If SOL = $142.35, then 0.5 SOL = $71.18 (7118 cents)
    });

    it.skip("verifies minimum bid validation ($2.50 USD) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Test minimum bid enforcement with live prices
      // Bid below $2.50 should fail with BidBelowMinimumUSD error
    });

    it.skip("rejects stale price data (>75 slots old) [Epic 2]", async () => {
      // TODO: Implement in Epic 2 - Story Workflow
      // Test staleness check
      // Mock Pyth account with old slot (76+ slots ago)
      // Verify error returned: OraclePriceStale
    });
  });
});
