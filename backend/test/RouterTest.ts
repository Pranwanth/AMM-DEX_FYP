import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MaxUint256, ZeroAddress, keccak256 } from 'ethers'

import Pool from "../artifacts/contracts/Pool.sol/Pool.json"

const MINIMUM_LIQUIDITY = ethers.toBigInt(10 ** 3)

describe("Router", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployRouterFixture() {
    // Contracts are deployed using the first signer/account by default
    const [wallet1] = await ethers.getSigners();
    const factory = await ethers.deployContract("FactoryPool")
    const lynx = await ethers.deployContract("Lynx");
    const obsidian = await ethers.deployContract("Obsidian");
    const weth9 = await ethers.deployContract("WETH9")

    const lynxAddress = await lynx.getAddress()
    const obsidianAddress = await obsidian.getAddress()

    const [token0, token0Address, token1, token1Address] = lynxAddress < obsidianAddress ? [lynx, lynxAddress, obsidian, obsidianAddress] : [obsidian, obsidianAddress, lynx, lynxAddress]

    const factoryAddress = await factory.getAddress()
    const weth9Address = await weth9.getAddress()

    await factory.createPool(token0Address, token1Address)
    const poolAddress = await factory.getPool(token0, token1)
    const pool = await ethers.getContractAt("Pool", poolAddress)

    await factory.createPool(token0Address, weth9Address)
    const wethPairAddress = await factory.getPool(token0Address, weth9Address)
    const wethPair = await ethers.getContractAt("Pool", wethPairAddress)

    const routerFactory = await ethers.getContractFactory("Router")
    const router = await routerFactory.deploy(factoryAddress, weth9Address)
    const routerAddress = await router.getAddress()

    /*
    Run this code to calculate Pool's initCodeHash for RouterHelper.PoolFor function

    const poolByteCode = Pool.bytecode
    console.log("HashedByteCode", keccak256(poolByteCode))
    */

    // Only use this function for removeLiquidityTesting
    async function addLiquidity(token0Amount: bigint, token1Amount: bigint) {
      await token0.transfer(poolAddress, token0Amount)
      await token1.transfer(poolAddress, token1Amount)
      await pool.mint(wallet1.address)
    }

    return {
      factory,
      router,
      pool,
      token0,
      token1,
      weth9,
      wethPair,
      factoryAddress,
      poolAddress,
      wethPairAddress,
      routerAddress,
      token0Address,
      token1Address,
      weth9Address,
      wallet1,
      addLiquidity
    };
  }

  it("addLiquidity", async function () {
    const { router, pool, token0, token1, routerAddress, poolAddress, token0Address, token1Address, wallet1 } = await loadFixture(deployRouterFixture)

    const token0Amount = ethers.parseUnits("1", 18)
    const token1Amount = ethers.parseUnits("4", 18)

    const expectedLiquidity = ethers.parseUnits("2", 18)

    await token0.approve(routerAddress, MaxUint256)
    await token1.approve(routerAddress, MaxUint256)
    await expect(
      router.addLiquidity(
        token0Address,
        token1Address,
        token0Amount,
        token1Amount,
        0,
        0,
        wallet1.address,
        MaxUint256,
      )
    )
      .to.emit(token0, 'Transfer')
      .withArgs(wallet1.address, poolAddress, token0Amount)
      .to.emit(token1, 'Transfer')
      .withArgs(wallet1.address, poolAddress, token1Amount)
      .to.emit(pool, 'Transfer')
      .withArgs(ZeroAddress, "0x000000000000000000000000000000000000dEaD", MINIMUM_LIQUIDITY)
      .to.emit(pool, 'Transfer')
      .withArgs(ZeroAddress, wallet1.address, expectedLiquidity - MINIMUM_LIQUIDITY)
      .to.emit(pool, 'Sync')
      .withArgs(token0Amount, token1Amount)
      .to.emit(pool, 'Mint')
      .withArgs(routerAddress, token0Amount, token1Amount)

    expect(await pool.balanceOf(wallet1.address)).to.eq(expectedLiquidity - MINIMUM_LIQUIDITY)
  })

  it('addLiquidityETH', async () => {
    const { router, wethPair, token0, routerAddress, token0Address, wallet1 } = await loadFixture(deployRouterFixture)
    const WETHPartnerAmount = ethers.parseUnits("1", 18)
    const ETHAmount = ethers.parseUnits("4", 18)

    const expectedLiquidity = ethers.parseUnits("2", 18)
    const WETHPairToken0 = await wethPair.token0()
    await token0.approve(routerAddress, MaxUint256)
    await expect(
      router.addLiquidityETH(
        token0Address,
        WETHPartnerAmount,
        WETHPartnerAmount,
        ETHAmount,
        wallet1.address,
        MaxUint256,
        { value: ETHAmount }
      )
    )
      .to.emit(wethPair, 'Transfer')
      .withArgs(ZeroAddress, "0x000000000000000000000000000000000000dEaD", MINIMUM_LIQUIDITY)
      .to.emit(wethPair, 'Transfer')
      .withArgs(ZeroAddress, wallet1.address, expectedLiquidity - MINIMUM_LIQUIDITY)
      .to.emit(wethPair, 'Sync')
      .withArgs(
        WETHPairToken0 === token0Address ? WETHPartnerAmount : ETHAmount,
        WETHPairToken0 === token0Address ? ETHAmount : WETHPartnerAmount
      )
      .to.emit(wethPair, 'Mint')
      .withArgs(
        routerAddress,
        WETHPairToken0 === token0Address ? WETHPartnerAmount : ETHAmount,
        WETHPairToken0 === token0Address ? ETHAmount : WETHPartnerAmount
      )

    expect(await wethPair.balanceOf(wallet1.address)).to.eq(expectedLiquidity - MINIMUM_LIQUIDITY)
  })

  it('removeLiquidity', async () => {
    const { router, pool, token0, token1, routerAddress, poolAddress, token0Address, token1Address, wallet1, addLiquidity } = await loadFixture(deployRouterFixture)

    const token0Amount = ethers.parseUnits("1", 18)
    const token1Amount = ethers.parseUnits("4", 18)
    await addLiquidity(token0Amount, token1Amount)

    const expectedLiquidity = ethers.parseUnits("2", 18)
    await pool.approve(routerAddress, MaxUint256)
    await expect(
      router.removeLiquidity(
        token0Address,
        token1Address,
        expectedLiquidity - MINIMUM_LIQUIDITY,
        0,
        0,
        wallet1.address,
        MaxUint256,
      )
    )
      .to.emit(pool, 'Transfer')
      .withArgs(wallet1.address, poolAddress, expectedLiquidity - MINIMUM_LIQUIDITY)
      .to.emit(pool, 'Transfer')
      .withArgs(poolAddress, ZeroAddress, expectedLiquidity - MINIMUM_LIQUIDITY)
      .to.emit(token0, 'Transfer')
      .withArgs(poolAddress, wallet1.address, token0Amount - BigInt(500))
      .to.emit(token1, 'Transfer')
      .withArgs(poolAddress, wallet1.address, token1Amount - BigInt(2000))
      .to.emit(pool, 'Sync')
      .withArgs(500, 2000)
      .to.emit(pool, 'Burn')
      .withArgs(routerAddress, token0Amount - BigInt(500), token1Amount - BigInt(2000), wallet1.address)

    expect(await pool.balanceOf(wallet1.address)).to.eq(0)
    const totalSupplyToken0 = await token0.totalSupply()
    const totalSupplyToken1 = await token1.totalSupply()
    expect(await token0.balanceOf(wallet1.address)).to.eq(totalSupplyToken0 - BigInt(500))
    expect(await token1.balanceOf(wallet1.address)).to.eq(totalSupplyToken1 - BigInt(2000))
  })

  it('removeLiquidityETH', async () => {
    const { router, wethPair, token0, routerAddress, wallet1, wethPairAddress, weth9, token0Address } = await loadFixture(deployRouterFixture)

    const WETHPartnerAmount = ethers.parseUnits("1", 18)
    const ETHAmount = ethers.parseUnits("4", 18)
    await token0.transfer(wethPairAddress, WETHPartnerAmount)
    await weth9.deposit({ value: ETHAmount })
    await weth9.transfer(wethPairAddress, ETHAmount)
    await wethPair.mint(wallet1.address)

    const expectedLiquidity = ethers.parseUnits("2", 18)
    const WETHPairToken0 = await wethPair.token0()
    await wethPair.approve(routerAddress, MaxUint256)
    await expect(
      router.removeLiquidityETH(
        token0Address,
        expectedLiquidity - MINIMUM_LIQUIDITY,
        0,
        0,
        wallet1.address,
        MaxUint256,
      )
    )
      .to.emit(wethPair, 'Transfer')
      .withArgs(wallet1.address, wethPairAddress, expectedLiquidity - MINIMUM_LIQUIDITY)
      .to.emit(wethPair, 'Transfer')
      .withArgs(wethPairAddress, ZeroAddress, expectedLiquidity - MINIMUM_LIQUIDITY)
      .to.emit(weth9, 'Transfer')
      .withArgs(wethPairAddress, routerAddress, ETHAmount - BigInt(2000))
      .to.emit(token0, 'Transfer')
      .withArgs(wethPairAddress, routerAddress, WETHPartnerAmount - BigInt(500))
      .to.emit(token0, 'Transfer')
      .withArgs(routerAddress, wallet1.address, WETHPartnerAmount - BigInt(500))
      .to.emit(wethPair, 'Sync')
      .withArgs(
        WETHPairToken0 === token0Address ? BigInt(500) : BigInt(2000),
        WETHPairToken0 === token0Address ? BigInt(2000) : BigInt(500)
      )
      .to.emit(wethPair, 'Burn')
      .withArgs(
        routerAddress,
        WETHPairToken0 === token0Address ? WETHPartnerAmount - BigInt(500) : ETHAmount - BigInt(2000),
        WETHPairToken0 === token0Address ? ETHAmount - BigInt(2000) : WETHPartnerAmount - BigInt(500),
        routerAddress
      )

    expect(await wethPair.balanceOf(wallet1.address)).to.eq(0)
    const totalSupplyWETHPartner = await token0.totalSupply()
    const totalSupplyWETH = await weth9.totalSupply()
    expect(await token0.balanceOf(wallet1.address)).to.eq(totalSupplyWETHPartner - BigInt(500))
    expect(await weth9.balanceOf(wallet1.address)).to.eq(totalSupplyWETH - BigInt(2000))
  })

  it('swapExactTokensForTokens happy path (direct pool exists)', async () => {
    const { router, pool, token0, token1, poolAddress, routerAddress, wallet1, token0Address, token1Address, addLiquidity } = await loadFixture(deployRouterFixture)

    const token0Amount = ethers.parseUnits("5", 18)
    const token1Amount = ethers.parseUnits("10", 18)
    const swapAmount = ethers.parseUnits("1", 18)
    const expectedOutputAmount = ethers.toBigInt('1662497915624478906')

    await addLiquidity(token0Amount, token1Amount)
    await token0.approve(routerAddress, MaxUint256)

    await expect(
      router.swapExactTokensForTokens(
        swapAmount,
        0,
        [token0Address, token1Address],
        wallet1.address,
        MaxUint256,
      )
    )
      .to.emit(token0, 'Transfer')
      .withArgs(wallet1.address, poolAddress, swapAmount)
      .to.emit(token1, 'Transfer')
      .withArgs(poolAddress, wallet1.address, expectedOutputAmount)
      .to.emit(pool, 'Sync')
      .withArgs(token0Amount + swapAmount, token1Amount - expectedOutputAmount)
      .to.emit(pool, 'Swap')
      .withArgs(routerAddress, swapAmount, 0, 0, expectedOutputAmount, wallet1.address)
  })

  it('swapTokensForExactTokens happy path (direct pool exists)', async () => {
    const { router, pool, token0, token1, poolAddress, routerAddress, wallet1, token0Address, token1Address, addLiquidity } = await loadFixture(deployRouterFixture)

    const token0Amount = ethers.parseUnits("5", 18)
    const token1Amount = ethers.parseUnits("10", 18)
    const expectedSwapAmount = ethers.toBigInt('557227237267357629')
    const outputAmount = ethers.parseUnits("1", 18)
    await addLiquidity(token0Amount, token1Amount)

    await token0.approve(routerAddress, MaxUint256)
    await expect(
      router.swapTokensForExactTokens(
        outputAmount,
        MaxUint256,
        [token0Address, token1Address],
        wallet1.address,
        MaxUint256,
      )
    )
      .to.emit(token0, 'Transfer')
      .withArgs(wallet1.address, poolAddress, expectedSwapAmount)
      .to.emit(token1, 'Transfer')
      .withArgs(poolAddress, wallet1.address, outputAmount)
      .to.emit(pool, 'Sync')
      .withArgs(token0Amount + expectedSwapAmount, token1Amount - outputAmount)
      .to.emit(pool, 'Swap')
      .withArgs(routerAddress, expectedSwapAmount, 0, 0, outputAmount, wallet1.address)
  })

  it('swapExactETHForTokens happy path (direct pool exists)', async () => {
    const { router, wethPair, token0, routerAddress, wallet1, wethPairAddress, weth9, token0Address, weth9Address } = await loadFixture(deployRouterFixture)

    const WETHPartnerAmount = ethers.parseUnits("10", 18) // token0Amount
    const ETHAmount = ethers.parseUnits("5", 18)
    const swapAmount = ethers.parseUnits("1", 18)
    const expectedOutputAmount = ethers.toBigInt('1662497915624478906')

    await token0.transfer(wethPairAddress, WETHPartnerAmount)
    await weth9.deposit({ value: ETHAmount })
    await weth9.transfer(wethPairAddress, ETHAmount)
    await wethPair.mint(wallet1.address)

    await token0.approve(routerAddress, MaxUint256)

    const WETHPairToken0 = await wethPair.token0()
    await expect(
      router.swapExactETHForTokens(0, [weth9Address, token0Address], wallet1.address, MaxUint256, {
        value: swapAmount
      })
    )
      .to.emit(weth9, 'Transfer')
      .withArgs(routerAddress, wethPairAddress, swapAmount)
      .to.emit(token0, 'Transfer')
      .withArgs(wethPairAddress, wallet1.address, expectedOutputAmount)
      .to.emit(wethPair, 'Sync')
      .withArgs(
        WETHPairToken0 === token0Address
          ? WETHPartnerAmount - expectedOutputAmount
          : ETHAmount + swapAmount,
        WETHPairToken0 === token0Address
          ? ETHAmount + swapAmount
          : WETHPartnerAmount - expectedOutputAmount
      )
      .to.emit(wethPair, 'Swap')
      .withArgs(
        routerAddress,
        WETHPairToken0 === token0Address ? 0 : swapAmount,
        WETHPairToken0 === token0Address ? swapAmount : 0,
        WETHPairToken0 === token0Address ? expectedOutputAmount : 0,
        WETHPairToken0 === token0Address ? 0 : expectedOutputAmount,
        wallet1.address
      )
  })

  it('swapTokensForExactETH happy path (direct pool exists)', async () => {
    const { router, wethPair, token0, routerAddress, wallet1, wethPairAddress, weth9, token0Address, weth9Address } = await loadFixture(deployRouterFixture)

    const WETHPartnerAmount = ethers.parseUnits("5", 18) // token0Amount
    const ETHAmount = ethers.parseUnits("10", 18)
    const expectedSwapAmount = ethers.toBigInt('557227237267357629')
    const outputAmount = ethers.parseUnits("1", 18)

    await token0.transfer(wethPairAddress, WETHPartnerAmount)
    await weth9.deposit({ value: ETHAmount })
    await weth9.transfer(wethPairAddress, ETHAmount)
    await wethPair.mint(wallet1.address)

    await token0.approve(routerAddress, MaxUint256)
    const WETHPairToken0 = await wethPair.token0()
    await expect(
      router.swapTokensForExactETH(
        outputAmount,
        MaxUint256,
        [token0Address, weth9Address],
        wallet1.address,
        MaxUint256,
      )
    )
      .to.emit(token0, 'Transfer')
      .withArgs(wallet1.address, wethPairAddress, expectedSwapAmount)
      .to.emit(weth9, 'Transfer')
      .withArgs(wethPairAddress, routerAddress, outputAmount)
      .to.emit(wethPair, 'Sync')
      .withArgs(
        WETHPairToken0 === token0Address
          ? WETHPartnerAmount + expectedSwapAmount
          : ETHAmount - outputAmount,
        WETHPairToken0 === token0Address
          ? ETHAmount - outputAmount
          : WETHPartnerAmount + expectedSwapAmount
      )
      .to.emit(wethPair, 'Swap')
      .withArgs(
        routerAddress,
        WETHPairToken0 === token0Address ? expectedSwapAmount : 0,
        WETHPairToken0 === token0Address ? 0 : expectedSwapAmount,
        WETHPairToken0 === token0Address ? 0 : outputAmount,
        WETHPairToken0 === token0Address ? outputAmount : 0,
        routerAddress
      )
  })

  it('swapExactTokensForETH happy path (direct pool exists)', async () => {
    const { router, wethPair, token0, routerAddress, wallet1, wethPairAddress, weth9, token0Address, weth9Address } = await loadFixture(deployRouterFixture)

    const WETHPartnerAmount = ethers.parseUnits("5", 18)
    const ETHAmount = ethers.parseUnits("10", 18)
    const swapAmount = ethers.parseUnits("1", 18)
    const expectedOutputAmount = ethers.toBigInt('1662497915624478906')

    await token0.transfer(wethPairAddress, WETHPartnerAmount)
    await weth9.deposit({ value: ETHAmount })
    await weth9.transfer(wethPairAddress, ETHAmount)
    await wethPair.mint(wallet1.address)

    await token0.approve(routerAddress, MaxUint256)
    const WETHPairToken0 = await wethPair.token0()
    await expect(
      router.swapExactTokensForETH(
        swapAmount,
        0,
        [token0Address, weth9Address],
        wallet1.address,
        MaxUint256,
      )
    )
      .to.emit(token0, 'Transfer')
      .withArgs(wallet1.address, wethPairAddress, swapAmount)
      .to.emit(weth9, 'Transfer')
      .withArgs(wethPairAddress, routerAddress, expectedOutputAmount)
      .to.emit(wethPair, 'Sync')
      .withArgs(
        WETHPairToken0 === token0Address
          ? WETHPartnerAmount + swapAmount
          : ETHAmount - expectedOutputAmount,
        WETHPairToken0 === token0Address
          ? ETHAmount - expectedOutputAmount
          : WETHPartnerAmount + swapAmount
      )
      .to.emit(wethPair, 'Swap')
      .withArgs(
        routerAddress,
        WETHPairToken0 === token0Address ? swapAmount : 0,
        WETHPairToken0 === token0Address ? 0 : swapAmount,
        WETHPairToken0 === token0Address ? 0 : expectedOutputAmount,
        WETHPairToken0 === token0Address ? expectedOutputAmount : 0,
        routerAddress
      )
  })

  it('swapETHForExactTokens happy path (direct pool exists)', async () => {
    const { router, wethPair, token0, routerAddress, wallet1, wethPairAddress, weth9, token0Address, weth9Address } = await loadFixture(deployRouterFixture)

    const WETHPartnerAmount = ethers.parseUnits("10", 18)
    const ETHAmount = ethers.parseUnits("5", 18)
    const expectedSwapAmount = ethers.toBigInt('557227237267357629')
    const outputAmount = ethers.parseUnits("1", 18)

    await token0.transfer(wethPairAddress, WETHPartnerAmount)
    await weth9.deposit({ value: ETHAmount })
    await weth9.transfer(wethPairAddress, ETHAmount)
    await wethPair.mint(wallet1.address)

    const WETHPairToken0 = await wethPair.token0()
    await expect(
      router.swapETHForExactTokens(
        outputAmount,
        [weth9Address, token0Address],
        wallet1.address,
        MaxUint256,
        {
          value: expectedSwapAmount
        }
      )
    )
      .to.emit(weth9, 'Transfer')
      .withArgs(routerAddress, wethPairAddress, expectedSwapAmount)
      .to.emit(token0, 'Transfer')
      .withArgs(wethPairAddress, wallet1.address, outputAmount)
      .to.emit(wethPair, 'Sync')
      .withArgs(
        WETHPairToken0 === token0Address
          ? WETHPartnerAmount - outputAmount
          : ETHAmount + expectedSwapAmount,
        WETHPairToken0 === token0Address
          ? ETHAmount + expectedSwapAmount
          : WETHPartnerAmount - outputAmount
      )
      .to.emit(wethPair, 'Swap')
      .withArgs(
        routerAddress,
        WETHPairToken0 === token0Address ? 0 : expectedSwapAmount,
        WETHPairToken0 === token0Address ? expectedSwapAmount : 0,
        WETHPairToken0 === token0Address ? outputAmount : 0,
        WETHPairToken0 === token0Address ? 0 : outputAmount,
        wallet1.address
      )
  })
});
