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


 contract QRC20 is IQRC20, ERC20Upgradeable, ContractMetadata, OwnableUpgradeable {
    string public QRC20_RESOURCE;
    uint256 public totalSupplyCap();
    uint256 internal _decimals;


    function initialize (
        string calldata name_,
        string calldata symbol_,
        uint8 deimals_,
        string calldata contractURI_,
        string calldata resource_,
        uint256 totalSupplyCap_

    ) public  initializer {
        _ERC20_init(name_, symbol_);
        _ContractMetadata_init(contractURI_);
        QRC20_RESOURCE = resource_;
        _decimals = decimals_;
        totalSupplyCap = totalSupplyCap_;

        // set owner
        __Ownable_init();
    }

    modifier mintTo(address account, uint256 amount) external override onlyOwner {
        require(totalSupplyCap == 0 || totalSupply() + amount <= totalSupplyCap, "[QGDK-015000]-The total supply capacity exceeded, minting is not allowed.");
        
    }
 }