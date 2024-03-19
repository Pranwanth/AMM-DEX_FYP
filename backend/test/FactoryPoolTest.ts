import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import Pool from "../artifacts/contracts/Pool.sol/Pool.json";

const TEST_ADDRESSES: [string, string] = [
  '0x1000000000000000000000000000000000000000',
  '0x2000000000000000000000000000000000000000'
]

function getCreate2Address(
  factoryAddress: string,
  [tokenA, tokenB]: [string, string],
  bytecode: string
): string {
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
  const create2Inputs = [
    '0xff',
    factoryAddress,
    ethers.keccak256(ethers.solidityPacked(['address', 'address'], [token0, token1])),
    ethers.keccak256(bytecode)
  ]
  const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`
  return ethers.getAddress(`0x${ethers.keccak256(sanitizedInputs).slice(-40)}`)
}

describe("FactoryPool", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFactoryFixture() {
    // Contracts are deployed using the first signer/account by default
    const [provider] = await ethers.getSigners();
    const factory = await ethers.deployContract("FactoryPool");
    const factoryAddress = await factory.getAddress()

    async function createPool(tokens: [string, string]) {
      const bytecode = Pool.bytecode
      const create2Address = getCreate2Address(factoryAddress, tokens, bytecode)
      await expect(factory.createPool(...tokens))
        .to.emit(factory, 'PoolCreated')
        .withArgs(TEST_ADDRESSES[0], TEST_ADDRESSES[1], create2Address, BigInt(1))

      await expect(factory.createPool(tokens[0], tokens[1])).to.be.reverted // Factory: POOL_EXISTS
      await expect(factory.createPool(tokens[1], tokens[0])).to.be.reverted // Factory: POOL_EXISTS
      expect(await factory.getPool(tokens[0], tokens[1])).to.eq(create2Address)
      expect(await factory.getPool(tokens[1], tokens[0])).to.eq(create2Address)
      expect(await factory.allPools(0)).to.eq(create2Address)
      expect(await factory.allPoolsLength()).to.eq(1)

      const pool = new ethers.Contract(create2Address, JSON.stringify(Pool.abi), provider)
      expect(await pool.factory()).to.eq(factoryAddress)
      expect(await pool.token0()).to.eq(TEST_ADDRESSES[0])
      expect(await pool.token1()).to.eq(TEST_ADDRESSES[1])
    }
    return { factory, createPool };
  }

  it("allPools", async function () {
    const { factory } = await loadFixture(deployFactoryFixture);
    expect(factory.allPools.length).to.equal(0);
  });

  it('createPool', async () => {
    const { createPool } = await loadFixture(deployFactoryFixture);
    await createPool(TEST_ADDRESSES)
  })

  it('createPool:reverse', async () => {
    const { createPool } = await loadFixture(deployFactoryFixture);
    await createPool(TEST_ADDRESSES.slice().reverse() as [string, string])
  })

  it('createPool:gas', async () => {
    const { factory } = await loadFixture(deployFactoryFixture);
    const tx = await factory.createPool(...TEST_ADDRESSES)
    const receipt = await tx.wait()
    expect(receipt?.gasUsed).to.eq(1617374)
  })
});
