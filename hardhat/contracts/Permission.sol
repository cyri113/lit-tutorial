// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Permission {
    mapping(address => mapping(address => bool)) _permissions;

    function getPermission(
        address resource_,
        address account_
    ) external view returns (bool) {
        return _permissions[resource_][account_];
    }

    function setPermission(
        address resource_,
        address account_,
        bool grant_
    ) external {
        _permissions[resource_][account_] = grant_;
    }
}
