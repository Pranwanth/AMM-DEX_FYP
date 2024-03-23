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

