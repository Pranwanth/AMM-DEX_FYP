// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityPoolToken is ERC20 {
  address public owner;

  modifier OwnerOnly {
    require(msg.sender == owner, "ErrorLPTokenContract: Not Authorised");
    _;
  }

  constructor(address _owner, string memory _name, string memory _ticker, uint256 _initialSupply) ERC20(_name, _ticker) {
    owner = _owner;
    _mint(msg.sender, _initialSupply);
  }

  function mint(address account, uint256 value) OwnerOnly external {
    _mint(account, value);
  }

  function burn(address account, uint256 value) OwnerOnly external {
    _burn(account, value);
  }
}