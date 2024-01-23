// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import './interfaces/IFactory.sol';
import './LiquidityPool.sol';
import './LiquidityPool.sol';

contract Factory is IFactory{
  using Strings for uint;
  mapping(address => mapping(address => address)) public liquidityPools;
  address[] public allPoolAddress;

  constructor() { }

  function createNewPool(address tokenA, address tokenB) external override returns (address pool) {
    require(tokenA != tokenB, "Error: Both Tokens are the same");
    require(tokenA != address(0) && tokenB != address(0), "Error: Zero Address");
    require(liquidityPools[tokenA][tokenB] == address(0), "Error: Liquidity Pool already exists");
 
    bytes memory bytecode = type(LiquidityPool).creationCode;
    bytes32 salt = keccak256(abi.encodePacked(tokenA, tokenB));
    assembly {
      pool := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }

    string memory allPoolLen = allPoolAddress.length.toString();
    string memory receiptTokenName = string.concat("LPTOKEN", allPoolLen);
    string memory receiptTokenSymbol = string.concat("LP", allPoolLen);

    LiquidityPoolToken receiptToken = new LiquidityPoolToken(pool, receiptTokenName, receiptTokenSymbol, 0);

    ILiquidityPool(pool).initialise(tokenA, tokenB, receiptToken);
    liquidityPools[tokenA][tokenB] = pool;
    liquidityPools[tokenB][tokenA] = pool;
    allPoolAddress.push(pool);
    emit PoolCreated(tokenA, tokenB, pool);
    return pool;
  }
}

