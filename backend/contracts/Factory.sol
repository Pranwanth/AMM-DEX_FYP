// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import './interfaces/FactoryInterface.sol';
import './LiquidityPool.sol';

contract Factory is IFactory{
  address public owner;
  address public feeAddress;
  mapping(address => mapping(address => address)) public liquidityPools;
  address[] public allPoolAddress;

  constructor(address theOwner) {
    owner = theOwner;
  }

  function createNewPool(address tokenA, address tokenB) external override returns (address pool) {
    require(tokenA != tokenB, "Error: Both Tokens are the same");
    require(liquidityPools[tokenA][tokenB] == address(0), "Error: Liquidity Pool already exists");
    newPool = new LiquidityPool(tokenA, tokenB);
    address newPoolAddress = address(newPool);
    liquidityPools[tokenA][tokenB] = newPoolAddress;
    liquidityPools[tokenB][tokenA] = newPoolAddress;
    allPoolAddress.push(newPoolAddress);
    return newPoolAddress;
  }

  function setFeeAddress(address newFeeAddress) external override{
    require(msg.sender == owner, "Not Authorised");
    feeAddress = newFeeAddress;
  }

  function setOwner(address newOwner) external override{
    require(msg.sender == owner, "Not Authorised");
    owner = newOwner;
  }
}

