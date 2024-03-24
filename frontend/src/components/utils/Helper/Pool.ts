import { ethers } from "ethers";
import { FACTORY_ADDR } from "../ContractAdresses";
import FactoryABI from "../../../abi/FactoryPool.json";
import PoolABI from "../../../abi/Pool.json";

async function getProvider() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("Ethereum provider (e.g. MetaMask) is not available.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum)
  return provider;
}

export async function getPoolAddress(token0Address: string, token1Address: string): Promise<string> {
  const provider = await getProvider();
  const factoryContract = new ethers.Contract(FACTORY_ADDR, FactoryABI, provider);

  const [tokenA, tokenB] = token0Address < token1Address ? [token0Address, token1Address] : [token1Address, token0Address];

  const poolAddress = await factoryContract.getPool(tokenA, tokenB);
  return poolAddress;
}

export async function getExistingPools() {
  try {
    const provider = await getProvider();
    const factoryContract = new ethers.Contract(FACTORY_ADDR, FactoryABI, provider);

    const allPoolsLength: bigint = await factoryContract.allPoolsLength();
    const allPoolsLengthNum = Number(allPoolsLength.toString(10));

    if (isNaN(allPoolsLengthNum)) {
      throw new Error("getExistingPools - invalid allPoolsLength");
    }

    const allPools: string[] = [];

    for (let i = 0; i < allPoolsLengthNum; i++) {
      const poolAddress = await factoryContract.allPools(i);
      allPools.push(poolAddress);
    }

    return allPools;
  } catch (error) {
    console.error("Error fetching existing pools:", error);
    return [];
  }
}

export async function getPoolReservesFromTokens(token0Address: string, token1Address: string): Promise<[bigint, bigint]> {
  try {
    const provider = await getProvider();
    const poolAddress = await getPoolAddress(token0Address, token1Address);

    const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);
    const [reserve0, reserve1] = await poolContract.getReserves();

    return [ethers.toBigInt(reserve0), ethers.toBigInt(reserve1)];
  } catch (error) {
    console.error("Error fetching pool reserves from tokens:", error);
    return [ethers.toBigInt(0), ethers.toBigInt(0)];
  }
}

export async function getPoolReserves(poolAddress: string): Promise<[bigint, bigint]> {
  try {
    const provider = await getProvider();
    const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);
    const [reserve0, reserve1] = await poolContract.getReserves();

    return [ethers.toBigInt(reserve0), ethers.toBigInt(reserve1)];
  } catch (error) {
    console.error("Error fetching pool reserves:", error);
    return [ethers.toBigInt(0), ethers.toBigInt(0)];
  }
}

export async function getPoolTokensFromAddress(poolAddress: string): Promise<string[]> {
  try {
    const provider = await getProvider();
    const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);
    const token0: string = await poolContract.token0();
    const token1: string = await poolContract.token1();
    return [token0, token1];
  } catch (error) {
    console.error("Error fetching pool tokens from address:", error);
    return [];
  }
}


export async function getTotalPoolLiquidityToken(poolAddress: string): Promise<bigint> {
  try {
    const provider = await getProvider();
    const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);
    const totalSupply = await poolContract.totalSupply();
    return ethers.toBigInt(totalSupply);
  } catch (error) {
    console.error("Error fetching total pool liquidity tokens:", error);
    return ethers.toBigInt(0);
  }
}

export async function getUserLiquidityTokens(userAddress: string, poolAddress: string) {
  try {
    const provider = await getProvider();
    // Get the user's liquidity tokens balance from the pool contract
    const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);
    const userLiquidityTokens = await poolContract.balanceOf(userAddress);
    return ethers.toBigInt(userLiquidityTokens);
  } catch (error) {
    console.error("Error fetching user's liquidity tokens:", error);
    return ethers.toBigInt(0);
  }
}

export function calculateUserPoolData(userLiquidityTokens: bigint, totalPoolToken: bigint, pooledTokenAReserve: bigint, pooledTokenBReserve: bigint) {
  // Calculate the proportional share of the user's liquidity tokens
  const userProportionalShare = userLiquidityTokens / totalPoolToken;

  // Calculate the user's pooled token quantity for Token A and Token B
  const pooledTokenAQuantity = pooledTokenAReserve * userProportionalShare;
  const pooledTokenBQuantity = pooledTokenBReserve * userProportionalShare;

  // Calculate the user's pool share
  const poolShare = userProportionalShare * 100n; // In percentage

  return [pooledTokenAQuantity, pooledTokenBQuantity, poolShare];
}


