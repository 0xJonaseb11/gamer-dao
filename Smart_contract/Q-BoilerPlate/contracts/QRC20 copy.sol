// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@q-dev/gdk-contracts/interfaces/tokens/IQRC20.sol";
import "@q-dev/gdk-contracts/metadata/ContractMetadata.sol";


/**
 * @title QRC20
 *
 * Regular QRC20 token with additional features:
 * - minting and burning
 * - total supply cap
 * - contract metadata
 */