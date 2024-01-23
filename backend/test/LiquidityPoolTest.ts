import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("LiquidityPool", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployLiquidityPoolFixture() {
    // Contracts are deployed using the first signer/account by default
    const [factory, trader1, trader2] = await ethers.getSigners();
    const pool = await ethers.deployContract("LiquidityPool");
    const token0 = await ethers.deployContract("Lynx", trader1);
    const token1 = await ethers.deployContract("Obsidian", trader1);

    return { pool, token0, token1, factory, trader1, trader2 };
  }

  describe("creation of pool", function () {
    it("constructor", async function () {
      const { pool, factory } = await loadFixture(deployLiquidityPoolFixture);
      expect(await pool.factory()).to.equal(factory);
    });
    it("initialize", async function () {
      const { pool, token0, token1 } = await loadFixture(deployLiquidityPoolFixture);
      const poolAddress = await pool.getAddress();
      const token0Address = await token0.getAddress();
      const token1Address = await token1.getAddress();

      await expect(pool.initialize(token0Address, token1Address, "LPTOKEN1", "LP1"))
        .to.emit(pool, "LiquidityPoolTokenCreated")
        .withArgs(poolAddress, "LPTOKEN1", "LP1");
      expect(await pool.token0()).to.be.equal(token0Address);
      expect(await pool.token1()).to.be.equal(token1Address);
    });
  });
  describe("Adding Liquidity", function () {
    it("valid liqudity", async function () {
      const { pool, token0, token1, trader1, trader2 } = await loadFixture(deployLiquidityPoolFixture);

      const poolAddress = await pool.getAddress();
      const token0Address = await token0.getAddress();
      const token1Address = await token1.getAddress();

      await pool.initialize(token0Address, token1Address, "LPTOKEN1", "LP1");

      const token0AmountIn = ethers.parseUnits("50", 18);
      const token1AmountIn = ethers.parseUnits("50", 18);

      await token0.connect(trader1).approve(poolAddress, token0AmountIn);
      await token1.connect(trader1).approve(poolAddress, token1AmountIn);

      const expectedShares = Math.sqrt(Number(token0AmountIn) * Number(token1AmountIn))
      const bigIntExpectedShares = BigInt(expectedShares)

      await expect(await pool.connect(trader1).addLiquidity(token0AmountIn, token1AmountIn))
        .to.emit(pool, "AddLiquidity")
        .withArgs(trader1, token0AmountIn, token1AmountIn, bigIntExpectedShares);

      const expectedReserve0 = await token0.balanceOf(poolAddress)
      const expectedReserve1 = await token1.balanceOf(poolAddress)

      expect(expectedReserve0).to.be.equal(token0AmountIn);
      expect(expectedReserve1).to.be.equal(token1AmountIn);

      // To test subsquent add liquidity
      await token0.connect(trader1).transfer(trader2, token0AmountIn);
      await token1.connect(trader1).transfer(trader2, token1AmountIn);

      await token0.connect(trader2).approve(poolAddress, token0AmountIn);
      await token1.connect(trader2).approve(poolAddress, token1AmountIn);

      // using expectedShares as they would be the totalSupply of receipt tokens after the initial add liqudity
      const expectedSharesTrader2 = Math.min(
        Number(token0AmountIn) * expectedShares / Number(expectedReserve0),
        Number(token1AmountIn) * expectedShares / Number(expectedReserve1)
      )

      await expect(pool.connect(trader2).addLiquidity(token0AmountIn, token1AmountIn))
        .to.emit(pool, "AddLiquidity")
        .withArgs(trader2, token0AmountIn, token1AmountIn, BigInt(expectedSharesTrader2));

      expect(await token0.balanceOf(poolAddress)).to.be.equal(BigInt(Number(token0AmountIn) * 2));
      expect(await token1.balanceOf(poolAddress)).to.be.equal(BigInt(Number(token1AmountIn) * 2));
    })
    it("invalid liqudity: wrong ratio", async function () {
      const { pool, token0, token1, trader1, trader2 } = await loadFixture(deployLiquidityPoolFixture);

      const poolAddress = await pool.getAddress();
      const token0Address = await token0.getAddress();
      const token1Address = await token1.getAddress();

      await pool.initialize(token0Address, token1Address, "LPTOKEN1", "LP1");

      const token0AmountIn = ethers.parseUnits("50", 18);
      const token1AmountIn = ethers.parseUnits("50", 18);

      await token0.connect(trader1).approve(poolAddress, token0AmountIn);
      await token1.connect(trader1).approve(poolAddress, token1AmountIn);

      await pool.connect(trader1).addLiquidity(token0AmountIn, token1AmountIn);

      // To test subsquent add liquidity
      await token0.connect(trader1).transfer(trader2, token0AmountIn);
      await token1.connect(trader1).transfer(trader2, token1AmountIn);

      await token0.connect(trader2).approve(poolAddress, token0AmountIn);
      await token1.connect(trader2).approve(poolAddress, token1AmountIn);

      const wrongToken1AmountIn = ethers.parseUnits("25", 18);

      await expect(pool.connect(trader2).addLiquidity(token0AmountIn, wrongToken1AmountIn))
        .to.be.revertedWith("Error: Invalid Liquidity Quantites");
    })
  })
});
