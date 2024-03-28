import { ethers } from "ethers";

import { ROUTER_ADDR } from "../ContractAdresses";
import routerABI from "../../../abi/Router.json"

const getRouterContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(ROUTER_ADDR, routerABI, signer);
};

export async function addLiquidity(
  tokenA: string,
  tokenB: string,
  amountADesired: string,
  amountBDesired: string,
  amountAMin: string,
  amountBMin: string,
  to: string,
  deadline: number
) {
  const router = await getRouterContract();
  const tx = await router.addLiquidity(
    tokenA,
    tokenB,
    ethers.parseUnits(amountADesired, 18),
    ethers.parseUnits(amountBDesired, 18),
    ethers.parseUnits(amountAMin, 18),
    ethers.parseUnits(amountBMin, 18),
    to,
    deadline
  );
  await tx.wait();
  return tx
}

export async function addLiquidityETH(
  token: string,
  amountTokenDesired: string,
  amountTokenMin: string,
  amountETHMin: string,
  to: string,
  deadline: number
) {
  const router = await getRouterContract();
  const tx = await router.addLiquidityETH(
    token,
    ethers.parseUnits(amountTokenDesired, 18),
    ethers.parseUnits(amountTokenMin, 18),
    ethers.parseUnits(amountETHMin, 18),
    to,
    deadline,
    { value: ethers.parseUnits(amountETHMin, 18) }
  );
  await tx.wait();
  return tx
}

export async function removeLiquidity(
  tokenA: string,
  tokenB: string,
  liquidity: bigint,
  amountAMin: bigint,
  amountBMin: bigint,
  to: string,
  deadline: number
) {
  const router = await getRouterContract();
  const tx = await router.removeLiquidity(
    tokenA,
    tokenB,
    liquidity,
    amountAMin,
    amountBMin,
    to,
    deadline
  );
  await tx.wait();
  return tx
}

export async function removeLiquidityETH(
  token: string,
  liquidity: string,
  amountTokenMin: string,
  amountETHMin: string,
  to: string,
  deadline: number
) {
  const router = await getRouterContract();
  const tx = await router.removeLiquidityETH(
    token,
    ethers.parseUnits(liquidity, 18),
    ethers.parseUnits(amountTokenMin, 18),
    ethers.parseUnits(amountETHMin, 18),
    to,
    deadline
  );
  await tx.wait();
  return tx
}

export async function swapExactTokensForTokens(
  amountIn: string,
  amountOutMin: string,
  path: string[],
  to: string,
  deadline: number
) {
  const router = await getRouterContract();
  const tx = await router.swapExactTokensForTokens(
    ethers.parseUnits(amountIn, 18),
    ethers.parseUnits(amountOutMin, 18),
    path,
    to,
    deadline
  );
  await tx.wait();
  return tx
}

export async function swapTokensForExactTokens(
  amountOut: string,
  amountInMax: string,
  path: string[],
  to: string,
  deadline: number
) {
  const router = await getRouterContract();
  const tx = await router.swapTokensForExactTokens(
    ethers.parseUnits(amountOut, 18),
    ethers.parseUnits(amountInMax, 18),
    path,
    to,
    deadline
  );
  await tx.wait();
  return tx
}

export async function swapExactETHForTokens(
  amountOutMin: string,
  path: string[],
  to: string,
  deadline: number,
  valueETH: string // ETH amount to swap
) {
  const router = await getRouterContract();
  const tx = await router.swapExactETHForTokens(
    ethers.parseUnits(amountOutMin, 18),
    path,
    to,
    deadline,
    { value: ethers.parseUnits(valueETH, 18) }
  );
  await tx.wait();
  return tx
}

export async function swapTokensForExactETH(
  amountOut: string,
  amountInMax: string,
  path: string[],
  to: string,
  deadline: number
) {
  const router = await getRouterContract();
  const tx = await router.swapTokensForExactETH(
    ethers.parseUnits(amountOut, 18),
    ethers.parseUnits(amountInMax, 18),
    path,
    to,
    deadline
  );
  await tx.wait();
  return tx
}

export async function swapExactTokensForETH(
  amountIn: string,
  amountOutMin: string,
  path: string[],
  to: string,
  deadline: number
) {
  const router = await getRouterContract();
  const tx = await router.swapExactTokensForETH(
    ethers.parseUnits(amountIn, 18),
    ethers.parseUnits(amountOutMin, 18),
    path,
    to,
    deadline
  );
  await tx.wait();
  return tx
}

export async function swapETHForExactTokens(
  amountOut: string,
  path: string[],
  to: string,
  deadline: number,
  valueETH: string
) {
  const router = await getRouterContract();
  const tx = await router.swapETHForExactTokens(
    ethers.parseUnits(amountOut, 18),
    path,
    to,
    deadline,
    { value: ethers.parseUnits(valueETH, 18) }
  );
  await tx.wait();
  return tx
}



