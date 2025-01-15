const AIModelMarketplace = artifacts.require("AImodelMarketplace");
module.exports = async function (deployer, network, accounts) {
  const creatorAccount = accounts[0];
  await deployer.deploy(AIModelMarketplace, { from: creatorAccount });
  const aiModelMarketplaceInstance = await AIModelMarketplace.deployed();
  console.log(`AIModelMarketplace deployed at address: ${aiModelMarketplaceInstance.address}`);
};
