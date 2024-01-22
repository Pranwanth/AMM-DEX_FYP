import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { LiquidityPoolToken__factory } from "../typechain-types";

const TEST_ADDRESSES: [string, string] = [
  '0x1000000000000000000000000000000000000000',
  '0x2000000000000000000000000000000000000000'
]

describe("LiquidityPoolERC20Token", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployLiquidityPoolFixture() {
    // Contracts are deployed using the first signer/account by default
    const [factory, trader1, trader2] = await ethers.getSigners();
    const pool = await ethers.deployContract("LiquidityPool");

    return { pool, factory, trader1, trader2 };
  }

  describe("creation of pool", function () {
    it("constructor", async function () {
      const { pool, factory } = await loadFixture(deployLiquidityPoolFixture);
      expect(await pool.factory()).to.equal(factory);
    });
    it("initialize", async function () {
      const { pool } = await loadFixture(deployLiquidityPoolFixture);
      const poolAddress = await pool.getAddress();

      await expect(pool.initialize(TEST_ADDRESSES[0], TEST_ADDRESSES[1], "LPTOKEN1", "LP1"))
        .to.emit(pool, "LiquidityPoolTokenCreated")
        .withArgs(poolAddress, "LPTOKEN1", "LP1");
      expect(await pool.token0()).to.be.equal(TEST_ADDRESSES[0]);
      expect(await pool.token1()).to.be.equal(TEST_ADDRESSES[1]);
    });
  });
});
