// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import './interfaces/LiquidityPoolInterface.sol';

contract LiquidityPool is ILiquidityPool, ERC20 {
  address public token0;
  address public token1;

  uint256 private token0Balance;
  uint256 private token1Balance;

  constructor(address tokenA, address tokenB) {
    token0 = tokenA;
    token1 = tokenB;
  }

  function mint() external override{}

  function swap(address tokenIn, uint256 amountIn) external override{}

  function addLiquidity(uint256 token0Amount, uint256 token1Amount) external override{
    token0.transferFrom(msg.sender, address(this), token0Amount);
    token1.transferFrom(msg.sender, address(this), token1Amount);
    // need to check token0Amount and token1Amount
  }

  function removeLiquidity(uint256 shares) external override{}
}