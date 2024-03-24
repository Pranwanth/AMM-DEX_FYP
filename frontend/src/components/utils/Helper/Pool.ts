import { ethers } from "ethers";
import { FACTORY_ADDR } from "../ContractAdresses";

async function getProvider() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("Ethereum provider (e.g. MetaMask) is not available.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum)

  return provider
}

export async function getPoolAddress(token0Address: string, token1Address: string) {
  const provider = await getProvider()
  const Factory_ABI = [
    "function getPool(address,address) view returns (address)",
  ]
  const factoryContract = new ethers.Contract(FACTORY_ADDR, Factory_ABI, provider)

  const [tokenA, tokenB] = token0Address < token1Address ? [token0Address, token1Address] : [token1Address, token0Address]

  const poolAddress = await factoryContract.getPool(tokenA, tokenB)

  return poolAddress
}

export async function getExistingPools() {
  const provider = await getProvider()
  const Factory_ABI = [
    "function allPools(uint256) view returns (address)",
    "function allPoolsLength() view returns (uint256)",
  ]
  const factoryContract = new ethers.Contract(FACTORY_ADDR, Factory_ABI, provider)

  const allPoolsLength: bigint = await factoryContract.allPoolsLength()

  const allPoolsLengthNum = Number(allPoolsLength.toString(10))

  if (isNaN(allPoolsLengthNum)) {
    console.error("getExistingPools-invalid allPoolsLength")
    return
  }

  const allPools: string[] = []

  for (let i = 0; i < allPoolsLengthNum; i++) {
    const poolAddress = await factoryContract.allPools(i)
    allPools.push(poolAddress)
  }

  return allPools
}

export async function getPoolReservesFromTokens(token0Address: string, token1Address: string) {
  const provider = await getProvider()
  const poolAddress = await getPoolAddress(token0Address, token1Address)
  const Pool_ABI = [
    "function getReserves() view returns (uint112, uint112)",
  ]

  const poolContract = new ethers.Contract(poolAddress, Pool_ABI, provider)
  const reserves = await poolContract.getReserves()
  return reserves
}

export async function getPoolReserves(poolAddress: string) {
  const provider = await getProvider()
  const Pool_ABI = [
    "function getReserves() view returns (uint112, uint112)",
  ]

  const poolContract = new ethers.Contract(poolAddress, Pool_ABI, provider)
  const reserves = await poolContract.getReserves()
  return reserves
}

export async function getPoolTokensFromAddress(poolAddress: string) {
  const provider = await getProvider()
  const Pool_ABI = [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
  ]
  const poolContract = new ethers.Contract(poolAddress, Pool_ABI, provider)
  const token0 = await poolContract.token0()
  const token1 = await poolContract.token1()

  return [token0, token1]
}

