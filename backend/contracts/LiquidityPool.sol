// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/ILiquidityPool.sol";
import "./LiquidityPoolToken.sol";

contract LiquidityPool is ILiquidityPool {

  address public factory;
  address public token0;
  address public token1;

  LiquidityPoolToken public receiptToken;

  uint256 private reserve0;
  uint256 private reserve1;

  constructor() {
    factory = msg.sender;
  }

  event LiquidityPoolTokenIntialised(address owner, string tokenName, string tokenSymbol);
  event AddLiquidity(address liquidityProvider, uint token0AmountIn, uint token1AmountIn, uint shares);
  event RemoveLiquidity(uint shareBurned, uint token0AmountOut, uint token1AmountOut);
  event Swap(address tokenIn, uint amountIn, address tokenOut, uint amountOut);

  function initialise(address tokenA, address tokenB, LiquidityPoolToken _receiptToken) external {
    require(msg.sender == factory, "Error: Access Denied");
    token0 = tokenA;
    token1 = tokenB;
    receiptToken = _receiptToken;
    emit LiquidityPoolTokenIntialised(address(this), receiptToken.name(), receiptToken.symbol());
  }

  function swap(address _tokenIn, uint256 _amountIn) external{

    require(_tokenIn == address(token0) || _tokenIn == address(token1), "Error: Token cannot be swapped with this LP");
    require(_amountIn > 0, "Error: Amount to swap cannot be zero");
    require(IERC20(_tokenIn).allowance(msg.sender, address(this)) >= _amountIn, "Error: Token Allowance must be greater than or equal to swap amount");

    (address tokenIn, address tokenOut, uint256 reserveIn, uint256 reserveOut) = _tokenIn == address(token0) 
    ? (token0, token1, reserve0, reserve1) 
    : (token1, token0, reserve1, reserve0);
        
    SafeERC20.safeTransferFrom(IERC20(tokenIn), msg.sender, address(this), _amountIn);

    uint256 amountInWithFee = (_amountIn * 997)/1000; // 0.3% fee
    uint256 amountOut = reserveOut - (reserveIn * reserveOut)/(reserveIn + amountInWithFee);

    if (tokenIn == address(token0)) {
      reserve0 += _amountIn;
      reserve1 -= amountOut;
    } else {
      reserve1 += _amountIn;
      reserve0 -= amountOut;
    }

    SafeERC20.safeTransfer(IERC20(tokenOut), msg.sender, amountOut);
    
    emit Swap(tokenIn, _amountIn, tokenOut, amountOut);
  }

  function addLiquidity(uint256 token0AmountAdded, uint256 token1AmountAdded) external returns (uint shares){

    require(token0AmountAdded > 0 && token1AmountAdded > 0, "Error: Token Amount Added cannot be zero");
    require(IERC20(token0).allowance(msg.sender, address(this)) >= token0AmountAdded, "Error: Token Allowance must be greater than or equal to liquidity"); 
    require(IERC20(token1).allowance(msg.sender, address(this)) >= token1AmountAdded, "Error: Token Allowance must be greater than or equal to liquidity"); 
    
    SafeERC20.safeTransferFrom(IERC20(token0), msg.sender, address(this), token0AmountAdded);
    SafeERC20.safeTransferFrom(IERC20(token1), msg.sender, address(this), token1AmountAdded);
    
    if (reserve0 > 0 || reserve1 > 0) {
      require(reserve1 * token0AmountAdded == reserve0 * token1AmountAdded, "Error: Invalid Liquidity Quantites");
    }

    // Shares to mint (S) = (dy/y)*T = (dx/x)*T
    uint _totalSupply = receiptToken.totalSupply();
    uint _shares = 0;
    if (_totalSupply == 0) {
      _shares = sqrt(token0AmountAdded*token1AmountAdded);
    } else {
      _shares = min(
        (token0AmountAdded*_totalSupply)/reserve0,
        (token1AmountAdded*_totalSupply)/reserve1 
        );
    }
    require(_shares > 0, "Error: Shares must be greater than zero");
    receiptToken.mint(msg.sender, _shares);
    reserve0 = IERC20(token0).balanceOf(address(this));
    reserve1 = IERC20(token1).balanceOf(address(this));
    
    emit AddLiquidity(msg.sender, token0AmountAdded, token1AmountAdded, _shares);
    return _shares;
  }

  function removeLiquidity(uint256 shares) external returns (uint amount0ToReturn, uint amount1ToReturn){

    require(shares > 0, "Error: Zero Shares");
    require(shares <= receiptToken.balanceOf(msg.sender), "Error: Invalid Shares");

    uint _totalSupply = receiptToken.totalSupply();
    require(_totalSupply > 0, "Error: Total Supply is Zero");

    uint token0Balance = IERC20(token0).balanceOf(address(this));
    uint token1Balance = IERC20(token1).balanceOf(address(this));

    uint _amount0ToReturn = (shares * token0Balance) / _totalSupply;
    uint _amount1ToReturn = (shares * token1Balance) / _totalSupply;

    require(_amount0ToReturn > 0 && _amount1ToReturn > 0, "Error: Amount to be returned cannot be zero");

    receiptToken.burn(msg.sender, shares);

    reserve0 = token0Balance - amount0ToReturn;
    reserve1 = token1Balance - amount1ToReturn;

    SafeERC20.safeTransfer(IERC20(token0), msg.sender, _amount0ToReturn);
    SafeERC20.safeTransfer(IERC20(token1), msg.sender, _amount1ToReturn);    

    emit RemoveLiquidity(shares, _amount0ToReturn, _amount1ToReturn);
    return (_amount0ToReturn, _amount1ToReturn);
  }

  function min(uint x, uint y) private pure returns (uint z) {
    z = x < y ? x : y;
  }

  function sqrt(uint y) private pure returns (uint z) {
    if (y > 3) {
      z = y;
      uint x = y / 2 + 1;
      while (x < z) {
        z = x;
        x = (y / x + x) / 2;
      }
    } else if (y != 0) {
      z = 1;
    }
  }
}