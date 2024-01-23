// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
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

  event LiquidityPoolTokenCreated(address owner, string tokenName, string tokenSymbol);
  event AddLiquidity(address liquidityProvider, uint token0AmountIn, uint token1AmountIn, uint shares);

  function initialize(address tokenA, address tokenB, string memory lpTokenName, string memory lpTokenSymbol) external {
    require(msg.sender == factory, "Error: Access Denied");
    token0 = tokenA;
    token1 = tokenB;
    receiptToken = new LiquidityPoolToken(lpTokenName, lpTokenSymbol, 0);
    emit LiquidityPoolTokenCreated(address(this), lpTokenName, lpTokenSymbol);
  }

  function swap(address _tokenIn, uint256 _amountIn) external{
    require(_tokenIn == address(token0) || _tokenIn == address(token1), "Error: Token cannot be swapped with this LP");
    require(_amountIn > 0, "Error: Amount to swap cannot be zero");
    require(IERC20(_tokenIn).allowance(msg.sender, address(this)) > _amountIn, "Error: Token Allowance must be greater than swap amount");

    (address tokenIn, address tokenOut, uint256 reserveIn, uint256 reserveOut) = _tokenIn == address(token0) ? (token0, token1, reserve0, reserve1) : (token1, token0, reserve1, reserve0);
        
    IERC20(tokenIn).transferFrom(msg.sender, address(this), _amountIn);

    uint256 amountInWithFee = (_amountIn * 997)/1000; // 0.3% fee
    uint256 amountOut = reserveOut - (reserveIn * reserveOut)/(reserveIn + amountInWithFee);

    if (tokenIn == address(token0)) {
      reserve0 += _amountIn;
      reserve1 -= amountOut;
    } else {
      reserve1 += _amountIn;
      reserve0 -= amountOut;
    }

    IERC20(tokenOut).transferFrom(address(this), msg.sender, amountOut);
  }

  function addLiquidity(uint256 token0AmountAdded, uint256 token1AmountAdded) external returns (uint shares){
    IERC20(token0).transferFrom(msg.sender, address(this), token0AmountAdded);
    IERC20(token1).transferFrom(msg.sender, address(this), token1AmountAdded);
    
    require(token0AmountAdded > 0 && token1AmountAdded > 0, "Error: Token Amount Added cannot be zero"); 

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

    uint token0Balance = IERC20(token0).balanceOf(address(this));
    uint token1Balance = IERC20(token1).balanceOf(address(this));

    uint _totalSupply = receiptToken.totalSupply();
    require(_totalSupply > 0, "Error: Total Supply is Zero");

    uint _amount0ToReturn = (shares * token0Balance) / _totalSupply;
    uint _amount1ToReturn = (shares * token1Balance) / _totalSupply;

    require(_amount0ToReturn > 0 && _amount1ToReturn > 0, "Error: Amount to be returned cannot be zero");

    receiptToken.burn(msg.sender, shares);
    IERC20(token0).transferFrom(address(this), msg.sender, _amount0ToReturn);
    IERC20(token1).transferFrom(address(this), msg.sender, _amount1ToReturn);

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