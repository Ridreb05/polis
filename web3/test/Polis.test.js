const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Polis", function () {
  let polis, steward, alice, bob, carol;
  const KEY = "council-2026";

  beforeEach(async function () {
    [steward, alice, bob, carol] = await ethers.getSigners();
    const Polis = await ethers.getContractFactory("Polis");
    polis = await Polis.deploy();
    await polis.waitForDeployment();
  });

  async function openElection() {
    const start = (await time.latest()) + 3 * 60 * 60; // 3h out
    const duration = 2 * 60 * 60; // 2h
    await polis.createVotingEvent("Council Seat", "Elect a delegate", KEY, start, duration, 3);
    return { start, duration };
  }

  it("creates an election", async function () {
    await openElection();
    expect(await polis.eventCount()).to.equal(1n);
    const e = await polis.getVotingEvent(0);
    expect(e.name).to.equal("Council Seat");
    expect(e.organizer).to.equal(steward.address);
    expect(e.active).to.equal(true);
  });

  it("rejects a start time under two hours away", async function () {
    const start = (await time.latest()) + 60 * 60;
    await expect(
      polis.createVotingEvent("X", "Y", KEY, start, 3600, 2)
    ).to.be.revertedWith("Start time must be at least 2 hours from now");
  });

  it("runs a full election lifecycle and reports the winner", async function () {
    const { start } = await openElection();

    // Two nominees apply with the key, steward approves both.
    await polis.connect(alice).registerCandidate(0, "Alice", KEY);
    await polis.connect(bob).registerCandidate(0, "Bob", KEY);
    await polis.approveCandidate(0, alice.address);
    await polis.approveCandidate(0, bob.address);

    // Carol joins as a member.
    await polis.connect(carol).registerVoter(0, KEY);
    expect(await polis.isVoterRegistered(0, carol.address)).to.equal(true);

    // Move to the voting window and cast a vote.
    await time.increaseTo(start + 1);
    await polis.connect(carol).vote(0, alice.address);
    expect(await polis.getVoteCount(0, alice.address)).to.equal(1n);

    // Steward closes the election, winner is readable.
    await polis.endVotingEvent(0);
    expect(await polis.getVotingResults(0)).to.equal(alice.address);
  });

  it("blocks double voting", async function () {
    const { start } = await openElection();
    await polis.connect(alice).registerCandidate(0, "Alice", KEY);
    await polis.approveCandidate(0, alice.address);
    await polis.connect(carol).registerVoter(0, KEY);
    await time.increaseTo(start + 1);
    await polis.connect(carol).vote(0, alice.address);
    await expect(polis.connect(carol).vote(0, alice.address)).to.be.revertedWith(
      "You have already voted"
    );
  });

  it("rejects an invalid access key", async function () {
    await openElection();
    await expect(
      polis.connect(alice).registerVoter(0, "wrong-key")
    ).to.be.revertedWith("Invalid key");
  });
});
