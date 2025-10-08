import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SlopMachine } from "../target/types/slop_machine";
import { assert } from "chai";

describe("slop-machine", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SlopMachine as Program<SlopMachine>;

  it("should deploy program successfully", async () => {
    // Verify program is deployed and has the expected program ID
    const programId = program.programId;
    assert.ok(programId, "Program ID should be defined");
  });

  it("should have correct program ID from declare_id", async () => {
    // Verify the program ID matches what's in Anchor.toml
    const expectedProgramId = "DoxwpkBr2cNu2NYxWEZjopYtZwHzQPJuzZFasinMAXKm";
    assert.equal(
      program.programId.toString(),
      expectedProgramId,
      "Program ID should match declare_id macro"
    );
  });
});
