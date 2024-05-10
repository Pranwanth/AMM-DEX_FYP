import { ethers } from "hardhat";
import deployAddresses from "../ignition/deployments/chain-1337/deployed_addresses.json"


async function main() {
  const [deployer] = await ethers.getSigners();
  const factory = await ethers.getContractAt("FactoryPool", deployAddresses["local_01#FactoryPool"])
  const router = await ethers.getContractAt("Router", deployAddresses["local_01#Router"])

  const tokenAddresses: string[] = [
    deployAddresses["local_01#ARB"],
    deployAddresses["local_01#WBTC"],
    deployAddresses["local_01#BNB"],
    deployAddresses["local_01#LINK"],
    deployAddresses["local_01#OKB"],
  ]

  const allowanceAmount = ethers.parseEther("10000") // 10,000 tokens

  // createPoolParams
  const amountAMin = 0; // Minimum amount of token A
  const amountBMin = 0; // Minimum amount of token B
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

  // Approve
  const arb = await ethers.getContractAt("ARB", deployAddresses["local_01#ARB"])
  const wbtc = await ethers.getContractAt("WBTC", deployAddresses["local_01#WBTC"])
  const bnb = await ethers.getContractAt("BNB", deployAddresses["local_01#BNB"])
  const link = await ethers.getContractAt("LINK", deployAddresses["local_01#LINK"])
  const okb = await ethers.getContractAt("OKB", deployAddresses["local_01#OKB"])

  await arb.approve(deployAddresses["local_01#Router"], allowanceAmount)
  await wbtc.approve(deployAddresses["local_01#Router"], allowanceAmount)
  await bnb.approve(deployAddresses["local_01#Router"], allowanceAmount)
  await link.approve(deployAddresses["local_01#Router"], allowanceAmount)
  await okb.approve(deployAddresses["local_01#Router"], allowanceAmount)

  const numberOfPoolsToCreate: number = 5;
  for (let i = 0; i < numberOfPoolsToCreate; i++) {
    const amountANum = Math.floor(Math.random() * 100)
    const amountBNum = Math.floor(Math.random() * 100)
    const amountADesired = ethers.parseEther(amountANum.toString(10));
    const amountBDesired = ethers.parseEther(amountBNum.toString(10));
    const tokenA = tokenAddresses[i];
    const tokenB = tokenAddresses[(i + 1) % tokenAddresses.length]; // Ensure different tokens for each pool
    console.log(`Creating pool with tokens ${tokenA} and ${tokenB}...`);
    await factory.createPool(tokenA, tokenB);
    const poolAddr = await factory.getPool(tokenA, tokenB)
    console.log(`Pool created with tokens ${tokenA} and ${tokenB} at ${poolAddr}`);
    await router.addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, deployer.address, deadline);
    console.log(`Liquidity added to pool ${i + 1}\namountA_added: ${amountADesired}\namountB_added: ${amountBDesired}`);
    const poolContract = await ethers.getContractAt("Pool", poolAddr)
    const [reserve0, reserve1] = await poolContract.getReserves()
    console.log(`Pool Reserves\nreserve0: ${reserve0}\nreserve1: ${reserve1}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });