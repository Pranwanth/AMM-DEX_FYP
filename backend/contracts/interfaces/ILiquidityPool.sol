// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.2;

interface ILiquidityPool {
  function initialize(address tokenA, address tokenB, string memory lpTokenName, string memory lpTokenSymbol) external;
  function swap(address tokenIn, uint256 amountIn) external;
  function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint shares);
  function removeLiquidity(uint256 shares) external returns (uint amount0ToReturn, uint amount1ToReturn);
}