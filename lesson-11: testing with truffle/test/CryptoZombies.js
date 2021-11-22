const CryptoZombies = artifacts.require("CryptoZombies");
const zombieNames = ["Zombie 1", "Zombie 2"];

contract("CryptoZombies", (accounts) => {
  const [alice, bob] = accounts;
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await CryptoZombies.new();
  });

  afterEach(async () => {
    await contractInstance.kill();
  });

  it("should be able to create a new zombie", async () => {
    const contractInstance = await CryptoZombies.new();
    const result = await contractInstance.createRandomZombie(zombieNames[0], {
      from: alice,
    });

    assert.equal(result.receipt.status, true);
    assert.equal(result.logs[0].args.name, zombieNames[0]);
  });

  it("should not allow two zombies", async () => {
    await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
    await utils.shouldThrow(
      contractInstance.createRandomZombie(zombieNames[1], { from: alice })
    );
  });

  xcontext("with the single-step transfer scenario", async () => {
    it("should transfer a zombie", async () => {
      // TODO: Test the single-step transfer scenario.
    });
  });

  xcontext("with the two-step transfer scenario", async () => {
    it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
      // TODO: Test the two-step scenario.  The approved address calls transferFrom
    });
    it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
      // TODO: Test the two-step scenario.  The owner calls transferFrom
    });
  });
});
