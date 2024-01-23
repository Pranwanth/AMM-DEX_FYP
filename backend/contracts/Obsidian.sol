// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Obsidian is ERC20 {
  constructor() ERC20("OBSIDIAN_TOKEN", "OBSD") {
    _mint(msg.sender, 100*10**18);
  }
}