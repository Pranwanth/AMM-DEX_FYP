// import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { LiquidityPool__factory } from "../typechain-types";

// const TEST_ADDRESSES: [string, string] = [
//   '0x1000000000000000000000000000000000000000',
//   '0x2000000000000000000000000000000000000000'
// ]

// function getCreate2Address(
//   factoryAddress: string,
//   [tokenA, tokenB]: [string, string],
//   bytecode: string
// ): string {
//   const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
//   const create2Inputs = [
//     '0xff',
//     factoryAddress,
//     ethers.keccak256(ethers.solidityPacked(['address', 'address'], [token0, token1])),
//     ethers.keccak256(bytecode)
//   ]
//   const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`
//   return ethers.getAddress(`0x${ethers.keccak256(sanitizedInputs).slice(-40)}`)
// }

// describe("Factory", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployFactoryFixture() {
//     // Contracts are deployed using the first signer/account by default
//     const factory = await ethers.deployContract("Factory");
//     return { factory };
//   }

//   describe("constructor", function () {
//     it("allPoolAddress", async function () {
//       const { factory } = await loadFixture(deployFactoryFixture);
//       expect(factory.allPoolAddress.length).to.equal(0);
//     });
//   });
//   describe("createNewPool", function () {
//     it("should emit pool address when given two valid tokens", async function () {
//       const { factory } = await loadFixture(deployFactoryFixture);
//       const factoryAddress = await factory.getAddress()
//       const byteCode = LiquidityPool__factory.bytecode
//       const create2Address = getCreate2Address(factoryAddress, [...TEST_ADDRESSES], byteCode)
//       await expect(factory.createNewPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1]))
//         .to.emit(factory, "PoolCreated")
//         .withArgs(TEST_ADDRESSES[0], TEST_ADDRESSES[1], create2Address)
//     });
//     it("should revert zero address token", async function () {
//       const { factory } = await loadFixture(deployFactoryFixture);
//       await expect(factory.createNewPool('0x0000000000000000000000000000000000000000', TEST_ADDRESSES[1])).to.be.revertedWith("Error: Zero Address")
//     });
//     it("should revert duplicate tokens", async function () {
//       const { factory } = await loadFixture(deployFactoryFixture);
//       await expect(factory.createNewPool(TEST_ADDRESSES[1], TEST_ADDRESSES[1])).to.be.revertedWith("Error: Both Tokens are the same")
//     });
//     it("should revert if liquidity pool already exists", async function () {
//       const { factory } = await loadFixture(deployFactoryFixture);
//       await factory.createNewPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1]);
//       await expect(factory.createNewPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1])).to.be.revertedWith("Error: Liquidity Pool already exists")
//     });
//     it("should store pool address in liquidityPools mapping after creation", async function () {
//       const { factory } = await loadFixture(deployFactoryFixture);
//       const factoryAddress = await factory.getAddress()
//       const byteCode = LiquidityPool__factory.bytecode
//       const create2Address = getCreate2Address(factoryAddress, [...TEST_ADDRESSES], byteCode)
//       await factory.createNewPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1]);
//       expect(await factory.liquidityPools(TEST_ADDRESSES[0], TEST_ADDRESSES[1])).to.be.equal(create2Address)
//     });
//     it("should have same pool address in liquidityPools mapping in both two directions after creation", async function () {
//       const { factory } = await loadFixture(deployFactoryFixture);
//       await factory.createNewPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1]);
//       const poolAddress = await factory.liquidityPools(TEST_ADDRESSES[1], TEST_ADDRESSES[0]);
//       expect(await factory.liquidityPools(TEST_ADDRESSES[0], TEST_ADDRESSES[1])).to.be.equal(poolAddress);
//     });
//     it("should store pool address in allPoolAddress after creation", async function () {
//       const { factory } = await loadFixture(deployFactoryFixture);
//       const factoryAddress = await factory.getAddress()
//       const byteCode = LiquidityPool__factory.bytecode
//       const create2Address = getCreate2Address(factoryAddress, [...TEST_ADDRESSES], byteCode)
//       await factory.createNewPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1]);
//       const firstPoolAddress = await factory.allPoolAddress(0);
//       expect(create2Address).to.be.equal(firstPoolAddress);
//     });
//   });
// });
