import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import BigNumber from "bignumber.js"

describe("LiquidityPool", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployLiquidityPoolFixture() {
    // Contracts are deployed using the first signer/account by default
    const [factory, trader1, trader2] = await ethers.getSigners();

    const pool = await ethers.deployContract("LiquidityPool");
    const poolAddress = await pool.getAddress()

    const receiptTokenFactory = await ethers.getContractFactory("LiquidityPoolToken");
    const receiptToken = await receiptTokenFactory.deploy(poolAddress, "LPTOKEN1", "LP1", 0)

    const token0 = await ethers.deployContract("Lynx", trader1); // deployed with trader1 so the inital supply of 100 goes to trader 1
    const token1 = await ethers.deployContract("Obsidian", trader1);

    const token0Address = await token0.getAddress()
    const token1Address = await token1.getAddress()

    return { pool, poolAddress, receiptToken, token0, token1, factory, trader1, trader2, token0Address, token1Address };
  }

  describe("creation of pool", function () {
    it("constructor", async function () {
      const { pool, factory } = await loadFixture(deployLiquidityPoolFixture);
      expect(await pool.factory()).to.equal(factory);
    });
    it("initialise", async function () {
      const { pool, poolAddress, receiptToken, token0Address, token1Address } = await loadFixture(deployLiquidityPoolFixture);

      await expect(pool.initialise(token0Address, token1Address, receiptToken))
        .to.emit(pool, "LiquidityPoolTokenIntialised")
        .withArgs(poolAddress, "LPTOKEN1", "LP1");
      expect(await pool.token0()).to.be.equal(token0Address);
      expect(await pool.token1()).to.be.equal(token1Address);
    });
  });
  describe("Adding Liquidity", function () {
    it("valid liqudity", async function () {
      const { pool, poolAddress, receiptToken, token0, token1, token0Address, token1Address, trader1, trader2 } = await loadFixture(deployLiquidityPoolFixture);

      await pool.initialise(token0Address, token1Address, receiptToken);

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
      const { pool, poolAddress, receiptToken, token0, token1, token0Address, token1Address, trader1, trader2 } = await loadFixture(deployLiquidityPoolFixture);

      await pool.initialise(token0Address, token1Address, receiptToken);

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
    it("invalid liqudity: insufficient balance", async function () {
      const { pool, poolAddress, receiptToken, token0, token1, token0Address, token1Address, trader1, trader2 } = await loadFixture(deployLiquidityPoolFixture);



      await pool.initialise(token0Address, token1Address, receiptToken)
      const token0AmountIn = ethers.parseUnits("50", 18);
      const token1AmountIn = ethers.parseUnits("50", 18);

      const transferToTrader2Token0 = ethers.parseUnits("75", 18);

      await token0.connect(trader1).approve(poolAddress, token0AmountIn);
      await token1.connect(trader1).approve(poolAddress, token1AmountIn);

      await token0.connect(trader1).transfer(trader2, transferToTrader2Token0);

      await expect(pool.connect(trader1).addLiquidity(token0AmountIn, token1AmountIn))
        .to.be.revertedWithCustomError(token0, "ERC20InsufficientBalance");
    })
    it("invalid liqudity: insufficient allowance", async function () {
      const { pool, poolAddress, receiptToken, token0, token1, token0Address, token1Address, trader1 } = await loadFixture(deployLiquidityPoolFixture);



      await pool.initialise(token0Address, token1Address, receiptToken); const token0AmountIn = ethers.parseUnits("50", 18);
      const token1AmountIn = ethers.parseUnits("50", 18);

      await token1.connect(trader1).approve(poolAddress, token1AmountIn);

      await expect(pool.connect(trader1).addLiquidity(token0AmountIn, token1AmountIn))
        .to.be.revertedWithCustomError(token0, "ERC20InsufficientAllowance");
    })
  })
  describe("Removing Liquidity", function () {
    it("valid", async function () {
      const { pool, poolAddress, receiptToken, token0, token1, token0Address, token1Address, trader1 } = await loadFixture(deployLiquidityPoolFixture);

      await pool.initialise(token0Address, token1Address, receiptToken);

      const token0AmountIn = ethers.parseUnits("50", 18)
      const token1AmountIn = ethers.parseUnits("50", 18);

      await token0.connect(trader1).approve(poolAddress, token0AmountIn);
      await token1.connect(trader1).approve(poolAddress, token1AmountIn);

      await pool.connect(trader1).addLiquidity(token0AmountIn, token1AmountIn)

      const shares = await receiptToken.balanceOf(trader1)
      const sharesBN = BigNumber(shares.toString(10))
      const halfSharesBN = sharesBN.div(2)

      const totalSupply = await receiptToken.totalSupply()
      const token0Balance = await token0.balanceOf(poolAddress)
      const token1Balance = await token1.balanceOf(poolAddress)

      const totalSupplyBN = BigNumber(totalSupply.toString(10))
      const token0BalanceBN = BigNumber(token0Balance.toString(10))
      const token1BalanceBN = BigNumber(token1Balance.toString(10))

      const amount0ToReturnBN = halfSharesBN.multipliedBy(token0BalanceBN).div(totalSupplyBN).toNumber()
      const amount1ToReturnBN = halfSharesBN.multipliedBy(token1BalanceBN).div(totalSupplyBN).toNumber()

      await expect(pool.connect(trader1).removeLiquidity(BigInt(halfSharesBN.toString(10))))
        .to.emit(pool, "RemoveLiquidity")
        .withArgs(BigInt(halfSharesBN.toString(10)), BigInt(amount0ToReturnBN.toString(10)), BigInt(amount1ToReturnBN.toString(10)))
    })
    it("invalid: zero shares", async function () {
      const { pool, receiptToken, token0Address, token1Address, trader1 } = await loadFixture(deployLiquidityPoolFixture);

      await pool.initialise(token0Address, token1Address, receiptToken);

      await expect(pool.connect(trader1).removeLiquidity(0))
        .to.revertedWith("Error: Zero Shares")
    })
    it("invalid: invalid shares balance", async function () {
      const { pool, poolAddress, receiptToken, token0, token1, token0Address, token1Address, trader1 } = await loadFixture(deployLiquidityPoolFixture);

      await pool.initialise(token0Address, token1Address, receiptToken);

      const shares = ethers.parseUnits("50", 18);

      // trying to remove without adding liquidit      
      await expect(pool.connect(trader1).removeLiquidity(shares))
        .to.revertedWith("Error: Invalid Shares");

      const token0AmountIn = ethers.parseUnits("50", 18);
      const token1AmountIn = ethers.parseUnits("50", 18);

      await token0.connect(trader1).approve(poolAddress, token0AmountIn);
      await token1.connect(trader1).approve(poolAddress, token1AmountIn);

      await pool.connect(trader1).addLiquidity(token0AmountIn, token1AmountIn)

      const invalidShares = ethers.parseUnits("100", 18)

      // trying to remove more than shares in posession
      await expect(pool.connect(trader1).removeLiquidity(invalidShares))
        .to.be.revertedWith("Error: Invalid Shares")
    })
  })
  describe("Swap", function () {
    it("valid swap", async function () {

    })
  })
});