const Marketplace = artifacts.require("Marketplace");

contract("Marketplace", (accounts) => {
  it("should deploy the contract successfully", async () => {
    const marketplaceInstance = await Marketplace.deployed();
    assert(marketplaceInstance.address !== '', "Contract was not deployed");
  });

  it("should allow a user to list a model", async () => {
    const marketplaceInstance = await Marketplace.deployed();
    await marketplaceInstance.listModel("AI Model", "Description", 100, { from: accounts[0] });
    const model = await marketplaceInstance.getModelDetails(0);
    assert.equal(model[0], "AI Model", "Model name does not match");
    assert.equal(model[1], "Description", "Model description does not match");
    assert.equal(model[2].toNumber(), 100, "Model price does not match");
  });
});
