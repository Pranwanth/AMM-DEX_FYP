// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityPoolToken is ERC20 {
  address public owner;

  constructor(string memory _name, string memory _ticker, uint256 _initialSupply) ERC20(_name, _ticker) {
    owner = msg.sender;
    _mint(msg.sender, _initialSupply);
  }

  function mint(address account, uint256 value) external {
    require(msg.sender == owner, "ErrorLPTokenContract: Not Authorised");
    _mint(account, value);
  }

  function burn(address account, uint256 value) external {
    require(msg.sender == owner, "ErrorLPTokenContract: Not Authorised");
    _burn(account, value);
  }
}