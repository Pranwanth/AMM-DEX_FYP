// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface IFactoryPool {
  event PoolCreated(address indexed token0, address indexed token1, address pool, uint);

  function getPool(address tokenA, address tokenB) external view returns (address pool);
  function allPools(uint) external view returns (address pool);
  function allPoolsLength() external view returns (uint);

  function createPool(address tokenA, address tokenB) external returns (address pool);
}