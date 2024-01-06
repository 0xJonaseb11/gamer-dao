// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

// import resource contracts
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import { IQRC20 } from "@q-dev/gdk-contracts/interfaces/tokens/IQRC20.sol";
import { ContractMetadata } from "@q-dev/gdk-contracts/metadata/ContractMetadata.sol";

/**
 * @title QRC20
 * 
 * Regular QRC20 token with additional features
 * - minting and burning
 * total supply cap
 * contravt metadata
 */

contract QRC20 is IQRC20, ERC20Upgradeable, ContractMetadata, OwnableUpgradeable {
    string public QRC20_RESOURCE; // Resource of the QRC20 token
    uint256 public totalSupplyCap; // Maximum total supply cap of the token
    uint8 internal _decimals; // Number of decimals for the token

    // Initilize contract with provided metadata and configuration
    function initialize(
        string calldata name_, string calldata symbol_, uint8 decimals_,
        string calldata contractURI_, string calldata resource_, uint256 totalSupplyCap_
    ) public initializer {
        __ERC20_init(name_, symbol); // Initialize ERC20 token with name and symbol
        __ContractMetadata_init(contractURI_); // initialize contract metadata with URI
        QRC20_RESOURCE = resource_; // set QRC20 resource
        _decimals = decimals_; // set token decimals
        totalSupplyCap = totalSupplyCap_;

        // set contract owner
        __Ownable_init();
    }
}