// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import './interfaces/IFactoryPool.sol';
import './interfaces/IPool.sol';
import './Pool.sol';

contract FactoryPool is IFactoryPool {

  mapping(address => mapping(address => address)) public getPool;
  address[] public allPools;

  constructor() { }

  function allPoolsLength() external view returns (uint) {
    return allPools.length;
  }

  function createPool(address tokenA, address tokenB) external returns (address pool) {
    require(tokenA != tokenB, 'Factory: IDENTICAL_ADDRESSES');
    (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    require(token0 != address(0), 'Factory: ZERO_ADDRESS');
    require(getPool[token0][token1] == address(0), 'Factory: POOL_EXISTS');
    bytes memory bytecode = type(Pool).creationCode;
    bytes32 salt = keccak256(abi.encodePacked(token0, token1));
    assembly {
      pool := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
    IPool(pool).initialize(token0, token1);
    getPool[token0][token1] = pool;
    getPool[token1][token0] = pool;
    allPools.push(pool);
    emit PoolCreated(token0, token1, pool, allPools.length);
  }
}