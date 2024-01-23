// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "../LiquidityPoolToken.sol";

interface ILiquidityPool {
  function initialise(address tokenA, address tokenB, LiquidityPoolToken receiptToken) external;
  function swap(address tokenIn, uint256 amountIn) external;
  function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint shares);
  function removeLiquidity(uint256 shares) external returns (uint amount0ToReturn, uint amount1ToReturn);
}