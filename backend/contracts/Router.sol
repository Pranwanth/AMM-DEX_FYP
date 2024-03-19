// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import './libraries/RouterHelper.sol';

import './interfaces/IRouter.sol';
import './interfaces/IFactoryPool.sol';
import './interfaces/IPool.sol';

import './interfaces/IWETH.sol';

contract Router is IRouter {
  using SafeERC20 for IERC20;

  address public immutable override factory;
  address public immutable override WETH;

  modifier ensure(uint deadline) {
    require(deadline >= block.timestamp, 'Router: EXPIRED');
    _;
  }

  constructor(address _factory, address _WETH) {
    factory = _factory;
    WETH = _WETH;
  }

  receive() external payable {
    assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
  }

  function _safeTransfer(address token, address to, uint amount) private {
    IERC20(token).safeTransfer(to, amount);
  }

  function _safeTransferFrom(address token, address from, address to, uint amount) private {
    IERC20(token).safeTransferFrom(from, to, amount);
  }

  function _addLiquidity(
    address tokenA,
    address tokenB,
    uint amountADesired,
    uint amountBDesired,
    uint amountAMin,
    uint amountBMin
  ) internal virtual returns (uint amountA, uint amountB) {
    // create the pair if it doesn't exist yet
    if (IFactoryPool(factory).getPool(tokenA, tokenB) == address(0)) {
      IFactoryPool(factory).createPool(tokenA, tokenB);
    }
    (uint reserveA, uint reserveB) = RouterHelper.getReserves(factory, tokenA, tokenB);
    if (reserveA == 0 && reserveB == 0) {
      (amountA, amountB) = (amountADesired, amountBDesired);
    } 
    else {
      uint amountBOptimal = RouterHelper.getQuote(amountADesired, reserveA, reserveB);
      if (amountBOptimal <= amountBDesired) {
        require(amountBOptimal >= amountBMin, 'Router: INSUFFICIENT_B_AMOUNT');
        (amountA, amountB) = (amountADesired, amountBOptimal);
      } else {
        uint amountAOptimal = RouterHelper.getQuote(amountBDesired, reserveB, reserveA);
        assert(amountAOptimal <= amountADesired);
        require(amountAOptimal >= amountAMin, 'Router: INSUFFICIENT_A_AMOUNT');
        (amountA, amountB) = (amountAOptimal, amountBDesired);
      }
    }
  }
  
  function addLiquidity(
    address tokenA,
    address tokenB,
    uint amountADesired,
    uint amountBDesired,
    uint amountAMin,
    uint amountBMin,
    address to,
    uint deadline
  ) external virtual override ensure(deadline) returns (uint amountA, uint amountB, uint liquidityTokens) {
    (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);
    address pool = RouterHelper.poolFor(factory, tokenA, tokenB);

    _safeTransferFrom(tokenA, msg.sender, pool, amountA);
    _safeTransferFrom(tokenB, msg.sender, pool, amountB);
    liquidityTokens = IPool(pool).mint(to);
  }

  function addLiquidityETH(
      address token,
      uint amountTokenDesired,
      uint amountTokenMin,
      uint amountETHMin,
      address to,
      uint deadline
  ) external virtual override payable ensure(deadline) returns (uint amountToken, uint amountETH, uint liquidityTokens) {
    (amountToken, amountETH) = _addLiquidity(token, WETH, amountTokenDesired, msg.value, amountTokenMin, amountETHMin);
    address pool = RouterHelper.poolFor(factory, token, WETH);
    _safeTransferFrom(token, msg.sender, pool, amountToken);
    IWETH(WETH).deposit{value: amountETH}();
    require(IWETH(WETH).transfer(pool, amountETH), 'Router: FAILED TO TRANSFER');
    liquidityTokens = IPool(pool).mint(to);

    // refund dust eth, if any
    if (msg.value > amountETH) RouterHelper.safeTransferETH(msg.sender, msg.value - amountETH);
  }

  function removeLiquidity(
    address tokenA,
    address tokenB,
    uint liquidity,
    uint amountAMin,
    uint amountBMin,
    address to,
    uint deadline
  ) public virtual override ensure(deadline) returns (uint amountA, uint amountB) {
    address pool = RouterHelper.poolFor(factory, tokenA, tokenB);
    IERC20(pool).transferFrom(msg.sender, pool, liquidity); // send liquidity to pool
    (uint amount0, uint amount1) = IPool(pool).burn(to);
    (address token0,) = RouterHelper.sortTokens(tokenA, tokenB);
    (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
    require(amountA >= amountAMin, 'Router: INSUFFICIENT_A_AMOUNT');
    require(amountB >= amountBMin, 'Router: INSUFFICIENT_B_AMOUNT');
  }
  
  function removeLiquidityETH(
    address token,
    uint liquidity,
    uint amountTokenMin,
    uint amountETHMin,
    address to,
    uint deadline
  ) public virtual override ensure(deadline) returns (uint amountToken, uint amountETH) {
    (amountToken, amountETH) = removeLiquidity(
      token,
      WETH,
      liquidity,
      amountTokenMin,
      amountETHMin,
      address(this),
      deadline
    );
    _safeTransfer(token, to, amountToken);
    IWETH(WETH).withdraw(amountETH);
    RouterHelper.safeTransferETH(to, amountETH);
  }

  // requires the initial amount to have already been sent to the first pair
  function _swap(uint[] memory amounts, address[] memory path, address _to) internal virtual {
    for (uint i; i < path.length - 1; i++) {
      (address input, address output) = (path[i], path[i + 1]);
      (address token0,) = RouterHelper.sortTokens(input, output);
      uint amountOut = amounts[i + 1];
      (uint amount0Out, uint amount1Out) = input == token0 ? (uint(0), amountOut) : (amountOut, uint(0));
      address to = i < path.length - 2 ? RouterHelper.poolFor(factory, output, path[i + 2]) : _to;
      IPool(RouterHelper.poolFor(factory, input, output)).swap(
        amount0Out, amount1Out, to
      );
    }
  }

  function swapExactTokensForTokens(
    uint amountIn,
    uint amountOutMin,
    address[] calldata path,
    address to,
    uint deadline
  ) external virtual override ensure(deadline) returns (uint[] memory amounts) {
    amounts = RouterHelper.getAmountsOut(factory, amountIn, path);
    require(amounts[amounts.length - 1] >= amountOutMin, 'Router: INSUFFICIENT_OUTPUT_AMOUNT');
    _safeTransferFrom(
      path[0], msg.sender, RouterHelper.poolFor(factory, path[0], path[1]), amounts[0]
    );
    _swap(amounts, path, to);
  }

  function swapTokensForExactTokens(
    uint amountOut,
    uint amountInMax,
    address[] calldata path,
    address to,
    uint deadline
  ) external virtual override ensure(deadline) returns (uint[] memory amounts) {
    amounts = RouterHelper.getAmountsIn(factory, amountOut, path);
    require(amounts[0] <= amountInMax, 'Router: EXCESSIVE_INPUT_AMOUNT');
    _safeTransferFrom(
      path[0], msg.sender, RouterHelper.poolFor(factory, path[0], path[1]), amounts[0]
    );
    _swap(amounts, path, to);
  }

  function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
    external
    virtual
    override
    payable
    ensure(deadline)
    returns (uint[] memory amounts)
  {
    require(path[0] == WETH, 'Router: INVALID_PATH');
    amounts = RouterHelper.getAmountsOut(factory, msg.value, path);
    require(amounts[amounts.length - 1] >= amountOutMin, 'Router: INSUFFICIENT_OUTPUT_AMOUNT');
    IWETH(WETH).deposit{value: amounts[0]}();
    assert(IWETH(WETH).transfer(RouterHelper.poolFor(factory, path[0], path[1]), amounts[0]));
    _swap(amounts, path, to);
  }

  function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
    external
    virtual
    override
    ensure(deadline)
    returns (uint[] memory amounts)
  {
    require(path[path.length - 1] == WETH, 'Router: INVALID_PATH');
    amounts = RouterHelper.getAmountsIn(factory, amountOut, path);
    require(amounts[0] <= amountInMax, 'Router: EXCESSIVE_INPUT_AMOUNT');
    _safeTransferFrom(
      path[0], msg.sender, RouterHelper.poolFor(factory, path[0], path[1]), amounts[0]
    );
    _swap(amounts, path, address(this));
    IWETH(WETH).withdraw(amounts[amounts.length - 1]);
    RouterHelper.safeTransferETH(to, amounts[amounts.length - 1]);
  }

  function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
    external
    virtual
    override
    ensure(deadline)
    returns (uint[] memory amounts)
  {
    require(path[path.length - 1] == WETH, 'Router: INVALID_PATH');
    amounts = RouterHelper.getAmountsOut(factory, amountIn, path);
    require(amounts[amounts.length - 1] >= amountOutMin, 'Router: INSUFFICIENT_OUTPUT_AMOUNT');
    _safeTransferFrom(
      path[0], msg.sender, RouterHelper.poolFor(factory, path[0], path[1]), amounts[0]
    );
    _swap(amounts, path, address(this));
    IWETH(WETH).withdraw(amounts[amounts.length - 1]);
    RouterHelper.safeTransferETH(to, amounts[amounts.length - 1]);
  }

  function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
    external
    virtual
    override
    payable
    ensure(deadline)
    returns (uint[] memory amounts)
  {
    require(path[0] == WETH, 'Router: INVALID_PATH');
    amounts = RouterHelper.getAmountsIn(factory, amountOut, path);
    require(amounts[0] <= msg.value, 'Router: EXCESSIVE_INPUT_AMOUNT');
    IWETH(WETH).deposit{value: amounts[0]}();
    assert(IWETH(WETH).transfer(RouterHelper.poolFor(factory, path[0], path[1]), amounts[0]));
    _swap(amounts, path, to);
    // refund dust eth, if any
    if (msg.value > amounts[0]) RouterHelper.safeTransferETH(msg.sender, msg.value - amounts[0]);
  }

  // **** LIBRARY FUNCTIONS MAINLY USED FOR TESTING ****
  function quote(uint amountA, uint reserveA, uint reserveB) public pure virtual override returns (uint amountB) {
    return RouterHelper.getQuote(amountA, reserveA, reserveB);
  }

  function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut)
    public
    pure
    virtual
    override
    returns (uint amountOut)
  {
    return RouterHelper.getAmountOut(amountIn, reserveIn, reserveOut);
  }

  function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut)
    public
    pure
    virtual
    override
    returns (uint amountIn)
  {
    return RouterHelper.getAmountIn(amountOut, reserveIn, reserveOut);
  }

  function getAmountsOut(uint amountIn, address[] memory path)
    public
    view
    virtual
    override
    returns (uint[] memory amounts)
  {
    return RouterHelper.getAmountsOut(factory, amountIn, path);
  }

  function getAmountsIn(uint amountOut, address[] memory path)
    public
    view
    virtual
    override
    returns (uint[] memory amounts)
  {
    return RouterHelper.getAmountsIn(factory, amountOut, path);
  }
}