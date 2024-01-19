// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import './interfaces/IFactory.sol';
import './LiquidityPool.sol';

contract Factory is IFactory{
  mapping(address => mapping(address => address)) public liquidityPools;
  address[] public allPoolAddress;

  constructor() { }

  function createNewPool(address tokenA, address tokenB) external override returns (address pool) {
    require(tokenA != tokenB, "Error: Both Tokens are the same");
    require(tokenA == address(0) || tokenB == address(0), "Error: Zero Address");
    require(liquidityPools[tokenA][tokenB] == address(0), "Error: Liquidity Pool already exists");
    LiquidityPool newPool = new LiquidityPool(tokenA, tokenB);
    address newPoolAddress = address(newPool);
    liquidityPools[tokenA][tokenB] = newPoolAddress;
    liquidityPools[tokenB][tokenA] = newPoolAddress;
    allPoolAddress.push(newPoolAddress);
    emit PoolCreated(tokenA, tokenB, newPoolAddress);
    return newPoolAddress;
  }
}

