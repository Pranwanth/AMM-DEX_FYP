// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface ILiquidityPool {
  function swap(address tokenIn, uint256 amountIn) external;
  function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint shares);
  function removeLiquidity(uint256 shares) external returns (uint amount0ToReturn, uint amount1ToReturn);
}