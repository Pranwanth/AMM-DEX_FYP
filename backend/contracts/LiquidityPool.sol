// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import './interfaces/LiquidityPoolInterface.sol';

contract LiquidityPool is ILiquidityPool {
  IERC20 public immutable token0;
  IERC20 public immutable token1;

  uint256 private reserve0;
  uint256 private reserve1;

  constructor(address tokenA, address tokenB) {
    token0 = IERC20(tokenA);
    token1 = IERC20(tokenB);
  }

  function mint() external override{}

  function swap(address _tokenIn, uint256 _amountIn) external override{
    require(_tokenIn == address(token0) || _tokenIn == address(token1), "Error: Token cannot be swapped with this LP");
    require(_amountIn > 0, "Error: Amount to swap cannot be zero");
    require(IERC20(_tokenIn).allowance(msg.sender, address(this)) > _amountIn, "Error: Token Allowance must be greater than swap amount")

    (IERC20 tokenIn, IERC20 tokenOut, uint256 reserveIn, uint256 reserveOut) = tokenIn == address(token0) ? (token0, token1, reserve0, reserve1) : (token1, token0, reserve1, reserve0);
        
    uint256 amountInWithFee = _amountIn * 0.997; // 0.3% fee
    uint256 amountOut = reserveOut - (reserveIn * reserveOut)/(reserveIn + amountInWithFee);

    if (tokenIn == address(token0)) {
      reserve0 += _amountIn;
      reserve1 -= amountOut;
    } else {
      reserve1 += _amountIn;
      reserve0 -= amountOut;
    }

    tokenIn.transferFrom(msg.sender, address(this), _amountIn);
    tokenOut.transferFrom(address(this), msg.sender, amountOut);
  }

  function addLiquidity(uint256 token0Amount, uint256 token1Amount) external override{
    token0.transferFrom(msg.sender, address(this), token0Amount);
    token1.transferFrom(msg.sender, address(this), token1Amount);
    // need to check token0Amount and token1Amount
  }

  function removeLiquidity(uint256 shares) external override{}
}