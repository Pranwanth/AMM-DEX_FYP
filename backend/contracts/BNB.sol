// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BNB is ERC20 {
  constructor() ERC20("BNB Token", "BNB") {
    address trader = 0x02114A9f7f296cFADFB78FBd3fA769426ed6eb99;
    _mint(msg.sender, 10000*10**18);
    _mint(trader, 50*10**18);
  }
}