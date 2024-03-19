import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { MaxUint256 } from 'ethers';
import { ethers } from "hardhat";

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Lynx, Obsidian, Router } from "../typechain-types";

// File must be named RouterTestHelperLib to run after RouterTest

describe("RouterHelperLib", () => {
  async function deployRouterFixture() {
    const [_wallet] = await ethers.getSigners();

    const factory = await ethers.deployContract("FactoryPool")
    const _token0 = await ethers.deployContract("Lynx");
    const _token1 = await ethers.deployContract("Obsidian");
    const weth9 = await ethers.deployContract("WETH9")

    const factoryAddress = await factory.getAddress()
    const _token0Address = await _token0.getAddress()
    const _token1Address = await _token1.getAddress()
    const weth9Address = await weth9.getAddress()

    const routerFactory = await ethers.getContractFactory("Router")
    const _router = await routerFactory.deploy(factoryAddress, weth9Address)
    const _routerAddress = await _router.getAddress()

    return {
      _router,
      _token0,
      _token1,
      _routerAddress,
      _token0Address,
      _token1Address,
      _wallet,
    };
  }

  let token0: Lynx
  let token1: Obsidian
  let router: Router
  let token0Address: string
  let token1Address: string
  let routerAddress: string
  let wallet: HardhatEthersSigner
  beforeEach(async function () {
    const { _token0, _token1, _router, _token0Address, _token1Address, _routerAddress, _wallet } = await loadFixture(deployRouterFixture)
    token0 = _token0
    token1 = _token1
    router = _router
    token0Address = _token0Address
    token1Address = _token1Address
    routerAddress = _routerAddress
    wallet = _wallet
  })

  it('quote', async () => {
    expect(await router.quote(ethers.toBigInt(1), ethers.toBigInt(100), ethers.toBigInt(200))).to.eq(ethers.toBigInt(2))
    expect(await router.quote(ethers.toBigInt(2), ethers.toBigInt(200), ethers.toBigInt(100))).to.eq(ethers.toBigInt(1))
    await expect(router.quote(ethers.toBigInt(0), ethers.toBigInt(100), ethers.toBigInt(200))).to.be.revertedWith(
      'RouterHelper: INSUFFICIENT_AMOUNT'
    )
    await expect(router.quote(ethers.toBigInt(1), ethers.toBigInt(0), ethers.toBigInt(200))).to.be.revertedWith(
      'RouterHelper: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.quote(ethers.toBigInt(1), ethers.toBigInt(100), ethers.toBigInt(0))).to.be.revertedWith(
      'RouterHelper: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountOut', async () => {
    expect(await router.getAmountOut(ethers.toBigInt(2), ethers.toBigInt(100), ethers.toBigInt(100))).to.eq(ethers.toBigInt(1))
    await expect(router.getAmountOut(ethers.toBigInt(0), ethers.toBigInt(100), ethers.toBigInt(100))).to.be.revertedWith(
      'RouterHelper: INSUFFICIENT_INPUT_AMOUNT'
    )
    await expect(router.getAmountOut(ethers.toBigInt(2), ethers.toBigInt(0), ethers.toBigInt(100))).to.be.revertedWith(
      'RouterHelper: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.getAmountOut(ethers.toBigInt(2), ethers.toBigInt(100), ethers.toBigInt(0))).to.be.revertedWith(
      'RouterHelper: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountIn', async () => {
    expect(await router.getAmountIn(ethers.toBigInt(1), ethers.toBigInt(100), ethers.toBigInt(100))).to.eq(ethers.toBigInt(2))
    await expect(router.getAmountIn(ethers.toBigInt(0), ethers.toBigInt(100), ethers.toBigInt(100))).to.be.revertedWith(
      'RouterHelper: INSUFFICIENT_OUTPUT_AMOUNT'
    )
    await expect(router.getAmountIn(ethers.toBigInt(1), ethers.toBigInt(0), ethers.toBigInt(100))).to.be.revertedWith(
      'RouterHelper: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.getAmountIn(ethers.toBigInt(1), ethers.toBigInt(100), ethers.toBigInt(0))).to.be.revertedWith(
      'RouterHelper: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountsOut', async () => {
    await token0.approve(routerAddress, MaxUint256)
    await token1.approve(routerAddress, MaxUint256)
    await router.addLiquidity(
      token0Address,
      token1Address,
      ethers.toBigInt(10000),
      ethers.toBigInt(10000),
      0,
      0,
      wallet.address,
      MaxUint256,
    )

    await expect(router.getAmountsOut(ethers.toBigInt(2), [token0Address])).to.be.revertedWith(
      'RouterHelper: INVALID_PATH'
    )
    const path = [token0Address, token1Address]
    expect(await router.getAmountsOut(ethers.toBigInt(2), path)).to.deep.eq([ethers.toBigInt(2), ethers.toBigInt(1)])
  })

  it('getAmountsIn', async () => {
    await token0.approve(routerAddress, MaxUint256)
    await token1.approve(routerAddress, MaxUint256)
    await router.addLiquidity(
      token0Address,
      token1Address,
      ethers.toBigInt(10000),
      ethers.toBigInt(10000),
      0,
      0,
      wallet.address,
      MaxUint256,
    )

    await expect(router.getAmountsIn(ethers.toBigInt(1), [token0Address])).to.be.revertedWith(
      'RouterHelper: INVALID_PATH'
    )
    const path = [token0Address, token1Address]
    expect(await router.getAmountsIn(ethers.toBigInt(1), path)).to.deep.eq([ethers.toBigInt(2), ethers.toBigInt(1)])
  })
})
