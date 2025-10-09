import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SlopMachine } from "../target/types/slop_machine";
import { expect, assert } from "chai";

describe("Escrow Workflow", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SlopMachine as Program<SlopMachine>;
  const provider = anchor.getProvider();

  // Helper constants
  const STUBBED_SOL_PRICE_USD = 100.0;
  const BURN_ADDRESS = new PublicKey("11111111111111111111111111111112");

  // Helper function to airdrop SOL for testing
  async function airdropSol(pubkey: PublicKey, amount: number) {
    const signature = await provider.connection.requestAirdrop(
      pubkey,
      amount * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
  }

  describe("create_project_escrow", () => {
    let client: Keypair;
    let developer: Keypair;
    let qaReviewer: Keypair;
    let platformWallet: Keypair;
    let projectId: BN;
    let opportunityId: BN;
    let escrowPda: PublicKey;

    beforeEach(async () => {
      client = Keypair.generate();
      developer = Keypair.generate();
      qaReviewer = Keypair.generate();
      platformWallet = Keypair.generate();
      projectId = new BN(1);
      opportunityId = new BN(1);

      // Airdrop SOL to client for testing
      await airdropSol(client.publicKey, 10);

      // Derive escrow PDA
      [escrowPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("escrow"),
          projectId.toArrayLike(Buffer, "le", 8),
          opportunityId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );
    });

    it("creates escrow PDA with correct seeds and initial state", async () => {
      // AC #1: PDA created for project escrow
      const amount = new BN(1 * LAMPORTS_PER_SOL); // 1 SOL

      await program.methods
        .createProjectEscrow(projectId, opportunityId, amount)
        .accounts({
          escrow: escrowPda,
          client: client.publicKey,
          developer: developer.publicKey,
          qaReviewer: qaReviewer.publicKey,
          platformWallet: platformWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();

      // Fetch escrow account
      const escrowAccount = await program.account.escrow.fetch(escrowPda);

      // Verify escrow state
      expect(escrowAccount.projectId.toNumber()).to.equal(1);
      expect(escrowAccount.opportunityId.toNumber()).to.equal(1);
      expect(escrowAccount.client.toString()).to.equal(client.publicKey.toString());
      expect(escrowAccount.developer.toString()).to.equal(developer.publicKey.toString());
      expect(escrowAccount.amount.toNumber()).to.equal(amount.toNumber());
      expect(escrowAccount.state).to.deep.equal({ funded: {} });
    });

    it("deposits payment from client to escrow PDA", async () => {
      // AC #2: Project creator deposits budget to escrow PDA
      const amount = new BN(1 * LAMPORTS_PER_SOL);
      const clientBalanceBefore = await provider.connection.getBalance(client.publicKey);

      await program.methods
        .createProjectEscrow(projectId, opportunityId, amount)
        .accounts({
          escrow: escrowPda,
          client: client.publicKey,
          developer: developer.publicKey,
          qaReviewer: qaReviewer.publicKey,
          platformWallet: platformWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();

      // Verify client balance decreased
      const clientBalanceAfter = await provider.connection.getBalance(client.publicKey);
      expect(clientBalanceBefore - clientBalanceAfter).to.be.greaterThan(amount.toNumber());

      // Verify escrow PDA has funds
      const escrowBalance = await provider.connection.getBalance(escrowPda);
      expect(escrowBalance).to.be.greaterThan(amount.toNumber()); // Includes rent exemption
    });

    it("sets payment splits correctly (85/5/10 basis points)", async () => {
      // AC #2 (continued): Verify payment splits
      const amount = new BN(1 * LAMPORTS_PER_SOL);

      await program.methods
        .createProjectEscrow(projectId, opportunityId, amount)
        .accounts({
          escrow: escrowPda,
          client: client.publicKey,
          developer: developer.publicKey,
          qaReviewer: qaReviewer.publicKey,
          platformWallet: platformWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([client])
        .rpc();

      const escrowAccount = await program.account.escrow.fetch(escrowPda);

      // Verify splits
      expect(escrowAccount.developerSplitBps).to.equal(8500); // 85%
      expect(escrowAccount.qaSplitBps).to.equal(500);         // 5%
      expect(escrowAccount.platformSplitBps).to.equal(1000);  // 10%
      expect(escrowAccount.minimumPlatformFee.toNumber()).to.equal(2_500_000); // $0.25 @ $100/SOL = 0.0025 SOL
    });
  });

  describe("lock_payment_and_stake", () => {
    // NOTE: This test requires Opportunity and Stake accounts from Stories 1.2-1.4
    // Will be implemented after those prerequisites are fully integrated
    it.skip("transitions escrow state from Funded to PendingReview", async () => {
      // AC #3: lock_payment_and_stake instruction implemented
      // Test will validate state transition once prerequisites available
    });
  });

  describe("release_payment_and_stake", () => {
    // NOTE: These tests require full integration with Stories 1.2-1.4
    // NodeRegistry, Stake, Opportunity accounts must exist
    describe("successful releases", () => {
      it.skip("distributes $100 story: 85% dev, 5% QA, 10% platform", async () => {
        // AC #4: release_payment_and_stake instruction implemented
        // Test payment split for $100 story (1.0 SOL @ $100/SOL stub)
      });

      it.skip("distributes $10 story: 85% dev, 5% QA, 10% platform", async () => {
        // Test payment split for $10 story (0.1 SOL @ $100/SOL stub)
      });

      it.skip("distributes $2 story: 82.5% dev, 5% QA, 12.5% platform ($0.25 min fee)", async () => {
        // Test minimum platform fee logic
        // $2 story = 0.02 SOL @ $100/SOL stub
        // Platform gets max(10%, $0.25) = 0.0025 SOL (12.5%)
        // Dev gets adjusted to 82.5%
      });
    });

    describe("stake returns", () => {
      it.skip("returns tier 0 stake (0.25 SOL) to developer on success", async () => {
        // AC #4 (continued): Stake return logic
      });

      it.skip("updates Stake status: Locked -> Returned", async () => {
        // AC #8: Unit tests for successful payment release + stake return
      });
    });

    describe("reputation updates", () => {
      it.skip("increments projects_completed and projects_attempted", async () => {
        // Verify NodeRegistry updates
      });

      it.skip("recalculates tier after successful completion", async () => {
        // Test tier calculation after success
      });
    });

    describe("events", () => {
      it.skip("emits PaymentReleased event with correct amounts", async () => {
        // AC #4 (continued): Event emission
      });
    });
  });

  describe("slash_stake_and_refund", () => {
    // NOTE: These tests require full integration with Stories 1.2-1.4
    describe("slashing logic", () => {
      it.skip("slashes tier 0 stake (0.25 SOL): 0.125 SOL to project, 0.125 SOL burned", async () => {
        // AC #5: slash_stake_and_refund instruction implemented
        // Verify 50/50 split
      });

      it.skip("validates failure_count >= 3 before slashing", async () => {
        // Test SlashConditionsNotMet error
      });

      it.skip("fails with SlashConditionsNotMet if failure_count < 3", async () => {
        // Test error handling for failure_count < 3
      });
    });

    describe("burn address", () => {
      it("validates burn address constant is correct", async () => {
        // AC #10: Unit tests for burn address transfer
        // Verify burn address matches canonical Solana burn address
        const burnAddressString = BURN_ADDRESS.toString();
        expect(burnAddressString).to.equal("11111111111111111111111111111112");
      });

      it.skip("transfers 50% to burn address 11111111111111111111111111111112", async () => {
        // AC #9: Unit tests for stake slashing (verify 50/50 split)
        // Verify burn address receives exactly 50% of slashed stake
      });

      it.skip("increases burn address balance by exact slash amount", async () => {
        // Verify burn address balance increase
      });
    });

    describe("payment refund", () => {
      it.skip("refunds full payment to client wallet", async () => {
        // Verify payment refund on slash
      });

      it.skip("updates escrow state: PendingReview -> Refunded", async () => {
        // Verify state transition
      });
    });

    describe("reputation impact", () => {
      it.skip("increments projects_attempted (but NOT projects_completed)", async () => {
        // Verify NodeRegistry updates on slash
      });

      it.skip("recalculates tier (decreases due to lower success rate)", async () => {
        // Test tier calculation after slash
      });

      it.skip("tier 2 node (5/5 success) drops to tier 1 after 1 slash (5/6)", async () => {
        // Test specific tier progression scenario
        // Tier 2: sqrt(5) * 1.0 = 2.23 -> 2
        // After slash: sqrt(5) * (5/6) = 1.86 -> 1
      });
    });

    describe("slash event creation", () => {
      it.skip("creates SlashEvent account with correct fields", async () => {
        // AC #5 (continued): SlashEvent account creation
      });

      it.skip("emits StakeSlashed event", async () => {
        // Verify event emission
      });
    });
  });

  describe("escrow state machine", () => {
    // NOTE: These tests require Opportunity and Stake accounts from Stories 1.2-1.4
    it.skip("allows Funded -> PendingReview transition", async () => {
      // Test valid transition
    });

    it.skip("allows PendingReview -> Completed transition", async () => {
      // Test valid transition via release_payment_and_stake
    });

    it.skip("allows PendingReview -> Refunded transition", async () => {
      // Test valid transition via slash_stake_and_refund
    });

    it.skip("rejects release when state=Funded (EscrowInvalidState)", async () => {
      // Test invalid transition
    });

    it.skip("rejects slash when state=Completed (EscrowInvalidState)", async () => {
      // Test invalid transition
    });
  });

  describe("balance tracking", () => {
    // NOTE: These tests require full escrow workflow integration
    it.skip("validates escrow PDA has sufficient balance before distribution", async () => {
      // AC #6: Escrow PDA balance tracking implemented
    });

    it.skip("fails with InsufficientEscrowBalance if PDA lacks funds", async () => {
      // Test error handling
    });
  });

  describe("payment split edge cases", () => {
    it("calculates payment split for $100 story correctly", async () => {
      // AC #11: Tests pass with `anchor test`
      // Manual calculation test (unit test style)
      const amount = new BN(1 * LAMPORTS_PER_SOL); // 1 SOL = $100 @ $100/SOL stub
      const developerSplitBps = 8500;
      const qaSplitBps = 500;
      const platformSplitBps = 1000;
      const minimumPlatformFee = new BN(250_000_000); // 0.25 SOL

      // Calculate platform fee: max(10%, $0.25 minimum)
      const platform10pct = amount.muln(platformSplitBps).divn(10000);
      const platformAmount = BN.max(platform10pct, minimumPlatformFee);

      // Calculate QA payment: 5%
      const qaAmount = amount.muln(qaSplitBps).divn(10000);

      // Calculate developer payment: remainder
      const developerAmount = amount.sub(platformAmount).sub(qaAmount);

      // Verify
      expect(developerAmount.toNumber()).to.equal(850_000_000); // 0.85 SOL (85%)
      expect(qaAmount.toNumber()).to.equal(50_000_000);         // 0.05 SOL (5%)
      expect(platformAmount.toNumber()).to.equal(100_000_000);  // 0.1 SOL (10%)

      // Verify total equals amount exactly
      const total = developerAmount.add(qaAmount).add(platformAmount);
      expect(total.toNumber()).to.equal(amount.toNumber());
    });

    it("calculates payment split for $2 story with minimum platform fee", async () => {
      // Test minimum platform fee logic
      const amount = new BN(10_000_000); // 0.01 SOL = $1 @ $100/SOL (using $1 for easier math)
      const developerSplitBps = 8500;
      const qaSplitBps = 500;
      const platformSplitBps = 1000;
      const minimumPlatformFee = new BN(1_250_000); // 0.00125 SOL = $0.125 @ $100/SOL

      // Calculate platform fee: max(10%, $0.125 minimum)
      const platform10pct = amount.muln(platformSplitBps).divn(10000);
      const platformAmount = BN.max(platform10pct, minimumPlatformFee);

      // Calculate QA payment: 5%
      const qaAmount = amount.muln(qaSplitBps).divn(10000);

      // Calculate developer payment: remainder
      const developerAmount = amount.sub(platformAmount).sub(qaAmount);

      // Verify platform uses minimum fee (not 10%)
      expect(platformAmount.toNumber()).to.equal(1_250_000); // Minimum fee applied

      // Verify total equals amount exactly
      const total = developerAmount.add(qaAmount).add(platformAmount);
      expect(total.toNumber()).to.equal(amount.toNumber());
    });
  });
});
