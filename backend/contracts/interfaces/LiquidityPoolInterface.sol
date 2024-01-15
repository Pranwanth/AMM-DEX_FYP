// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ILiquidityPool {
  function mint() external; // responsible for minting new LP tokens
  function swap(address tokenIn, uint256 amountIn) external;
  function addLiquidity(uint256 amountA, uint256 amountB) external;
  function removeLiquidity(uint256 shares) external;
}