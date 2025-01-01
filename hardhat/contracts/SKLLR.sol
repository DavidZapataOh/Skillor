// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SKLLR is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("SkillorToken", "SKLLR")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 amount) internal override {
        require(from == address(0) || to == address(0), "Tokens are non-transferable");
        super._update(from, to, amount);
    }
}
