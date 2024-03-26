// import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { expect } from "chai";
// import { ethers } from "hardhat";

// describe("LiquidityPoolERC20Token", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployLiquidityPoolTokenFixture() {
//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();
//     const initialSupply = ethers.parseUnits("1000", 18) // To create a initial supply of 1000 units
//     const lpTokenFactory = await ethers.getContractFactory("LiquidityPoolToken", owner)
//     const lpTokenERC20 = await lpTokenFactory.deploy(owner, "testToken", "TT", initialSupply)

//     return { lpTokenERC20, owner, initialSupply, otherAccount };
//   }

//   describe("Deployment of LiquidityPoolERC20Token", function () {
//     it("Should set the correct owner", async function () {
//       const { lpTokenERC20, owner } = await loadFixture(deployLiquidityPoolTokenFixture);
//       expect(await lpTokenERC20.owner()).to.equal(owner.address);
//     });

//     it("Should set the correct name", async function () {
//       const { lpTokenERC20 } = await loadFixture(deployLiquidityPoolTokenFixture);
//       expect(await lpTokenERC20.name()).to.equal("testToken");
//     });

//     it("Should set the correct ticker", async function () {
//       const { lpTokenERC20 } = await loadFixture(deployLiquidityPoolTokenFixture);
//       expect(await lpTokenERC20.symbol()).to.equal("TT");
//     });

//     it("Should set the correct initialSupply", async function () {
//       const { lpTokenERC20, initialSupply } = await loadFixture(deployLiquidityPoolTokenFixture);
//       expect(await lpTokenERC20.totalSupply()).to.equal(initialSupply);
//     });

//     it("Should mint the correct supply to the owner's address when deployed", async function () {
//       const { lpTokenERC20, owner, initialSupply } = await loadFixture(deployLiquidityPoolTokenFixture);
//       expect(await lpTokenERC20.balanceOf(owner.address)).to.equal(initialSupply);
//     });

//     it("Should mint the correct amount of tokens specified", async function () {
//       const { lpTokenERC20, otherAccount } = await loadFixture(deployLiquidityPoolTokenFixture);
//       const valueToSend = ethers.parseUnits("100", 18); // to mint 100 tokens to otherAccount
//       await lpTokenERC20.mint(otherAccount.address, valueToSend)
//       expect(await lpTokenERC20.balanceOf(otherAccount.address)).to.equal(valueToSend)
//     });

//     it("Should not allow anyone other than owner to mint tokens", async function () {
//       const { lpTokenERC20, otherAccount, initialSupply } = await loadFixture(deployLiquidityPoolTokenFixture);
//       await expect(lpTokenERC20.connect(otherAccount).mint(otherAccount, initialSupply)).to.be.revertedWith("ErrorLPTokenContract: Not Authorised");
//     })
//   });
// });
