// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import './libraries/UQ112x112.sol';
import './libraries/Math.sol';
import './interfaces/IPool.sol';
import './interfaces/IFactory.sol';

contract Pool is IPool, ERC20 {
  using UQ112x112 for uint224;
  using SafeERC20 for IERC20;

  uint public constant MINIMUM_LIQUIDITY = 10**3;
  address public immutable LOCK_ADDRESS = 0x000000000000000000000000000000000000dEaD;

  address public factory;
  address public token0;
  address public token1;

  uint112 private reserve0;
  uint112 private reserve1;

  uint private unlocked = 1;
  modifier lock() {
    require(unlocked == 1, 'Pool: LOCKED');
    unlocked = 0;
    _;
    unlocked = 1;
  }

  function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1) {
    _reserve0 = reserve0;
    _reserve1 = reserve1;
  }

  function _safeTransfer(address token, address to, uint amount) private {
    IERC20(token).safeTransfer(to, amount);
  }

  constructor() ERC20("SKYSWAP", "SKY") {
    factory = msg.sender;
  }

  function initialize(address _token0, address _token1) external {
    require(msg.sender == factory, 'Pool: FORBIDDEN'); 
    token0 = _token0;
    token1 = _token1;
  }

  function updateReserves(uint balance0, uint balance1) private {
    reserve0 = uint112(balance0);
    reserve1 = uint112(balance1);
    emit Sync(reserve0, reserve1);
  }

  function mint(address to) external lock returns (uint liquidity) {
    (uint112 _reserve0, uint112 _reserve1) = getReserves(); 
    uint balance0 = IERC20(token0).balanceOf(address(this));
    uint balance1 = IERC20(token1).balanceOf(address(this));
    uint amount0 = balance0 - _reserve0;
    uint amount1 = balance1 - _reserve1;
    uint _totalSupply = IERC20(this).totalSupply();

    if (_totalSupply == 0) {
      liquidity = Math.sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
      _mint(LOCK_ADDRESS, MINIMUM_LIQUIDITY);
    } else {
      liquidity = Math.min(amount0 * _totalSupply / _reserve0, amount1 * _totalSupply / _reserve1);
    }

    require(liquidity > 0, 'Pool: INSUFFICIENT_LIQUIDITY_MINTED');
    _mint(to, liquidity);

    updateReserves(balance0, balance1);
    
    emit Mint(msg.sender, amount0, amount1);
  }

  function burn(address to) external lock returns (uint amount0, uint amount1) {
    address _token0 = token0;                                
    address _token1 = token1;                                
    uint balance0 = IERC20(_token0).balanceOf(address(this));
    uint balance1 = IERC20(_token1).balanceOf(address(this));
    uint liquidity = IERC20(this).balanceOf(address(this));
    uint _totalSupply = IERC20(this).totalSupply();

    amount0 = liquidity * balance0 / _totalSupply;
    amount1 = liquidity * balance1 / _totalSupply;
    require(amount0 > 0 && amount1 > 0, 'Pool: INSUFFICIENT_LIQUIDITY_BURNED');
    _burn(address(this), liquidity);
    _safeTransfer(_token0, to, amount0);
    _safeTransfer(_token1, to, amount1);
    balance0 = IERC20(_token0).balanceOf(address(this));
    balance1 = IERC20(_token1).balanceOf(address(this));

    updateReserves(balance0, balance1);

    emit Burn(msg.sender, amount0, amount1, to);
  }

  function swap(uint amount0Out, uint amount1Out, address to) external lock {
    require(amount0Out > 0 || amount1Out > 0, 'Pool: INSUFFICIENT_OUTPUT_AMOUNT');
    (uint112 _reserve0, uint112 _reserve1) = getReserves();
    require(amount0Out < _reserve0 && amount1Out < _reserve1, 'Pool: INSUFFICIENT_LIQUIDITY');

    uint balance0;
    uint balance1;

    address _token0 = token0;
    address _token1 = token1;
    require(to != _token0 && to != _token1, 'Pool: INVALID_TO');
    if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out);
    if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out);
    balance0 = IERC20(_token0).balanceOf(address(this));
    balance1 = IERC20(_token1).balanceOf(address(this));

    uint amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
    uint amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
    require(amount0In > 0 || amount1In > 0, 'Pool: INSUFFICIENT_INPUT_AMOUNT');

    uint balance0Adjusted = balance0 * 1000 - amount0In * 3;
    uint balance1Adjusted = balance1 * 1000 - amount1In * 3;
    require(balance0Adjusted * balance1Adjusted >= uint(_reserve0) * uint(_reserve1) * (1000**2), 'Pool: K');

    updateReserves(balance0, balance1);
    emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
  }

  function skim(address to) external lock {
    address _token0 = token0;
    address _token1 = token1;
    _safeTransfer(_token0, to, IERC20(_token0).balanceOf(address(this)) - reserve0);
    _safeTransfer(_token1, to, IERC20(_token1).balanceOf(address(this)) - reserve1);
  }

  function sync() external lock {
    updateReserves(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)));
  }
}