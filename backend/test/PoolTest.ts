import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ContractRunner, ZeroAddress } from "ethers";
import { ethers } from "hardhat";

describe("Pool", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPoolFixture() {
    // Contracts are deployed using the first signer/account by default
    const [factory, trader1, trader2] = await ethers.getSigners();

    const pool = await ethers.deployContract("Pool");
    const poolAddress = await pool.getAddress()

    const token0 = await ethers.deployContract("Lynx", trader1); // deployed with trader1 so the inital supply of 100 goes to trader 1
    const token1 = await ethers.deployContract("Obsidian", trader1);

    const token0Address = await token0.getAddress()
    const token1Address = await token1.getAddress()

    await pool.initialize(token0Address, token1Address)

    async function addLiquidity(token0Amount: bigint, token1Amount: bigint, runner: HardhatEthersSigner) {
      await token0.connect(runner).transfer(poolAddress, token0Amount)
      await token1.connect(runner).transfer(poolAddress, token1Amount)
      await pool.mint(runner)
    }

    return { pool, poolAddress, token0, token1, factory, trader1, trader2, token0Address, token1Address, addLiquidity };
  }

  it("mint", async function () {
    const { pool, poolAddress, token0, factory, token1, trader1 } = await loadFixture(deployPoolFixture);

    const MINIMUM_LIQUIDITY = ethers.toBigInt(10 ** 3)

    const token0Amount = ethers.parseUnits("1", 18)
    const token1Amount = ethers.parseUnits("4", 18)

    await token0.connect(trader1).transfer(poolAddress, token0Amount)
    await token1.connect(trader1).transfer(poolAddress, token1Amount)

    const expectedLiquidity = ethers.parseUnits("2", 18)
    await expect(pool.mint(trader1))
      .to.emit(pool, "Transfer")
      .withArgs(ZeroAddress, "0x000000000000000000000000000000000000dEaD", MINIMUM_LIQUIDITY)
      .to.emit(pool, "Transfer")
      .withArgs(ZeroAddress, trader1, expectedLiquidity - MINIMUM_LIQUIDITY)
      .to.emit(pool, "Sync")
      .withArgs(token0Amount, token1Amount)
      .to.emit(pool, "Mint")
      .withArgs(factory, token0Amount, token1Amount)

    expect(await pool.totalSupply()).to.eq(expectedLiquidity)
    expect(await pool.balanceOf(trader1)).to.eq(expectedLiquidity - MINIMUM_LIQUIDITY)
    expect(await token0.balanceOf(poolAddress)).to.eq(token0Amount)
    expect(await token1.balanceOf(poolAddress)).to.eq(token1Amount)
    const reserves = await pool.getReserves()
    expect(reserves[0]).to.eq(token0Amount)
    expect(reserves[1]).to.eq(token1Amount)
  });

  const swapTestCases: bigint[][] = [
    [1, 5, 10, '1662497915624478906'],
    [1, 10, 5, '453305446940074565'],
    [2, 5, 10, '2851015155847869602'],
    [2, 10, 5, '831248957812239453'],
    [1, 10, 10, '906610893880149131'],
    [1, 100, 100, '987158034397061298'],
    [1, 1000, 1000, '996006981039903216']
  ].map(a => a.map(n => (typeof n === 'string' ? ethers.toBigInt(n) : ethers.parseUnits(n.toString(10), 18))))
  swapTestCases.forEach((swapTestCase, i) => {
    it(`getInputPrice:${i}`, async () => {
      const { pool, poolAddress, token0, trader1, addLiquidity } = await loadFixture(deployPoolFixture);
      const [swapAmount, token0Amount, token1Amount, expectedOutputAmount] = swapTestCase
      await addLiquidity(token0Amount, token1Amount, trader1)
      await token0.connect(trader1).transfer(poolAddress, swapAmount)
      await expect(pool.swap(0, expectedOutputAmount + BigInt(1), trader1)).to.be.revertedWith('Pool: K')
      await pool.swap(0, expectedOutputAmount, trader1)
    })
  })

  const optimisticTestCases: bigint[][] = [
    ['997000000000000000', 5, 10, 1], // given amountIn, amountOut = floor(amountIn * .997)
    ['997000000000000000', 10, 5, 1],
    ['997000000000000000', 5, 5, 1],
    [1, 5, 5, '1003009027081243732'] // given amountOut, amountIn = ceiling(amountOut / .997)
  ].map(a => a.map(n => (typeof n === 'string' ? ethers.toBigInt(n) : ethers.parseUnits(n.toString(10), 18))))
  optimisticTestCases.forEach((optimisticTestCase, i) => {
    it(`optimistic:${i}`, async () => {
      const [outputAmount, token0Amount, token1Amount, inputAmount] = optimisticTestCase
      const { pool, poolAddress, token0, trader1, addLiquidity } = await loadFixture(deployPoolFixture);
      await addLiquidity(token0Amount, token1Amount, trader1)
      await token0.connect(trader1).transfer(poolAddress, inputAmount)
      await expect(pool.swap(outputAmount + BigInt(1), 0, trader1)).to.be.revertedWith('Pool: K')
      await pool.swap(outputAmount, 0, trader1)
    })
  })

  it('swap:token0', async () => {
    const { pool, poolAddress, token0, token1, trader1, factory, addLiquidity } = await loadFixture(deployPoolFixture);
    const token0Amount = ethers.parseUnits('5', 18)
    const token1Amount = ethers.parseUnits('10', 18)
    await addLiquidity(token0Amount, token1Amount, trader1)

    const swapAmount = ethers.parseUnits('1', 18)
    const expectedOutputAmount = BigInt('1662497915624478906')
    await token0.connect(trader1).transfer(poolAddress, swapAmount)
    await expect(pool.swap(0, expectedOutputAmount, trader1))
      .to.emit(token1, 'Transfer')
      .withArgs(poolAddress, trader1.address, expectedOutputAmount)
      .to.emit(pool, 'Sync')
      .withArgs(token0Amount + swapAmount, token1Amount - expectedOutputAmount)
      .to.emit(pool, 'Swap')
      .withArgs(factory, swapAmount, 0, 0, expectedOutputAmount, trader1)

    const reserves = await pool.getReserves()
    expect(reserves[0]).to.eq(token0Amount + swapAmount)
    expect(reserves[1]).to.eq(token1Amount - expectedOutputAmount)
    expect(await token0.balanceOf(poolAddress)).to.eq(token0Amount + swapAmount)
    expect(await token1.balanceOf(poolAddress)).to.eq(token1Amount - expectedOutputAmount)
    const totalSupplyToken0 = await token0.totalSupply()
    const totalSupplyToken1 = await token1.totalSupply()
    expect(await token0.balanceOf(trader1)).to.eq(totalSupplyToken0 - token0Amount - swapAmount)
    expect(await token1.balanceOf(trader1)).to.eq(totalSupplyToken1 - token1Amount + expectedOutputAmount)
  })

  it('swap:token1', async () => {
    const { pool, poolAddress, token0, token1, trader1, factory, addLiquidity } = await loadFixture(deployPoolFixture);
    const token0Amount = ethers.parseUnits('5', 18)
    const token1Amount = ethers.parseUnits('10', 18)
    await addLiquidity(token0Amount, token1Amount, trader1)

    const swapAmount = ethers.parseUnits('1', 18)
    const expectedOutputAmount = BigInt('453305446940074565')
    await token1.connect(trader1).transfer(poolAddress, swapAmount)
    await expect(pool.swap(expectedOutputAmount, 0, trader1))
      .to.emit(token0, 'Transfer')
      .withArgs(poolAddress, trader1, expectedOutputAmount)
      .to.emit(pool, 'Sync')
      .withArgs(token0Amount - expectedOutputAmount, token1Amount + swapAmount)
      .to.emit(pool, 'Swap')
      .withArgs(factory, 0, swapAmount, expectedOutputAmount, 0, trader1)

    const reserves = await pool.getReserves()
    expect(reserves[0]).to.eq(token0Amount - expectedOutputAmount)
    expect(reserves[1]).to.eq(token1Amount + swapAmount)
    expect(await token0.balanceOf(poolAddress)).to.eq(token0Amount - expectedOutputAmount)
    expect(await token1.balanceOf(poolAddress)).to.eq(token1Amount + swapAmount)
    const totalSupplyToken0 = await token0.totalSupply()
    const totalSupplyToken1 = await token1.totalSupply()
    expect(await token0.balanceOf(trader1)).to.eq(totalSupplyToken0 - token0Amount + expectedOutputAmount)
    expect(await token1.balanceOf(trader1)).to.eq(totalSupplyToken1 - token1Amount - swapAmount)
  })
});
