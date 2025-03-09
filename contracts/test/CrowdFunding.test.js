const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding", function () {
  let Crowdfunding, crowdfunding, owner, addr1, addr2;

  beforeEach(async function () {
    // create contract before each test
    [owner, addr1, addr2] = await ethers.getSigners();
    Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await Crowdfunding.deploy();
    await crowdfunding.waitForDeployment();
  });

  it("Должен создавать кампанию", async function () {
    await crowdfunding.createCampaign(
      "Test Campaign",
      "This is a test",
      ethers.parseEther("1"),
      Math.floor(Date.now() / 1000) + 86400 // 1 day ahead
    );

    const campaigns = await crowdfunding.getCampaigns();
    expect(campaigns.length).to.equal(1);
    expect(campaigns[0].title).to.equal("Test Campaign");
  });

  it("Должен принимать пожертвования", async function () {
    await crowdfunding.createCampaign(
      "Test Campaign",
      "This is a test",
      ethers.parseEther("1"),
      Math.floor(Date.now() / 1000) + 86400
    );

    await crowdfunding.connect(addr1).donateToCampaign(0, {
      value: ethers.parseEther("0.5"),
    });

    const campaigns = await crowdfunding.getCampaigns();
    expect(campaigns[0].fundsRaised).to.equal(ethers.parseEther("0.5"));
  });

  it("Должен не позволять пожертвования на несуществующую кампанию", async function () {
    await expect(
      crowdfunding.connect(addr1).donateToCampaign(999, {
        value: ethers.parseEther("0.5"),
      })
    ).to.be.revertedWith("Invalid campaign ID");
  });
});
