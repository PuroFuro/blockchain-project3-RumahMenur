const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  let Voting, voting, owner, alice, bob;
  const candidates = ["Alice", "Bob", "Carol"];

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(candidates);
    await voting.waitForDeployment();
  });

  describe("deployment", function () {
    it("sets the owner to the deployer", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("seeds the ballot with the constructor candidates", async function () {
      expect(await voting.getCandidateCount()).to.equal(candidates.length);
      const [, name] = await voting.getCandidate(1);
      expect(name).to.equal("Alice");
    });

    it("starts with zero total votes", async function () {
      expect(await voting.totalVotes()).to.equal(0n);
    });
  });

  describe("voting", function () {
    it("records a vote and increments the tally", async function () {
      await voting.connect(alice).vote(1);
      const [, , voteCount] = await voting.getCandidate(1);
      expect(voteCount).to.equal(1n);
      expect(await voting.totalVotes()).to.equal(1n);
      expect(await voting.hasVoted(alice.address)).to.equal(true);
    });

    it("emits a Voted event with the new count", async function () {
      await expect(voting.connect(alice).vote(2))
        .to.emit(voting, "Voted")
        .withArgs(alice.address, 2, 1);
    });

    it("prevents the same address from voting twice", async function () {
      await voting.connect(alice).vote(1);
      await expect(voting.connect(alice).vote(2)).to.be.revertedWith(
        "Voting: address has already voted"
      );
    });

    it("rejects an out-of-range candidate id", async function () {
      await expect(voting.connect(alice).vote(0)).to.be.revertedWith(
        "Voting: invalid candidate id"
      );
      await expect(voting.connect(alice).vote(99)).to.be.revertedWith(
        "Voting: invalid candidate id"
      );
    });

    it("lets different addresses vote independently", async function () {
      await voting.connect(alice).vote(1);
      await voting.connect(bob).vote(1);
      const [, , voteCount] = await voting.getCandidate(1);
      expect(voteCount).to.equal(2n);
      expect(await voting.totalVotes()).to.equal(2n);
    });
  });

  describe("addCandidate", function () {
    it("lets the owner add a candidate", async function () {
      await expect(voting.addCandidate("Dave"))
        .to.emit(voting, "CandidateAdded")
        .withArgs(4, "Dave");
      expect(await voting.getCandidateCount()).to.equal(4);
    });

    it("rejects a non-owner adding a candidate", async function () {
      await expect(voting.connect(alice).addCandidate("Dave")).to.be.revertedWith(
        "Voting: caller is not the owner"
      );
    });

    it("rejects an empty candidate name", async function () {
      await expect(voting.addCandidate("")).to.be.revertedWith(
        "Voting: empty candidate name"
      );
    });
  });

  describe("getAllCandidates", function () {
    it("returns the full ballot", async function () {
      const all = await voting.getAllCandidates();
      expect(all.length).to.equal(3);
      expect(all[0].name).to.equal("Alice");
      expect(all[2].name).to.equal("Carol");
    });
  });
});
