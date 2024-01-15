// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IFactory {

  event PoolCreated(address tokenA, address tokenB, address pool);
  
  function createNewPool(address tokenA, address tokenB) external returns (address pool);

  function setFeeAddress(address) external;
  function setOwner(address) external;
}