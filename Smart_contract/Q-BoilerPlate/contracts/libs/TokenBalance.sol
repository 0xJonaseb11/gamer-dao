// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {ETHEREUM_ADDRESS} from "@q-dev/gdk-contracts/core/Globals.sol";

/**
 * @title TokenBalance library
 * @dev Provides a function to transfer ETH or ERC20 tokens to a specified address.
 */
library TokenBalance {
    using SafeERC20 for IERC20;

    /**
     * @dev Transfers the specified amount of ETH or ERC20 tokens to the specified receiver.
     * @param token The address of the token to transfer, or the Ethereum address to transfer ETH.
     * @param receiver The address to receive the transferred funds.
     * @param amount The amount of tokens or ETH to transfer.
     */
    function sendFunds(address token, address receiver, uint256 amount) internal {
        if (token == ETHEREUM_ADDRESS) {
            (bool status, ) = receiver.call{value: amount}("");
            require(status, "TokenBalance: Transferring of native currency failed.");
        } else {
            IERC20(token).safeTransfer(receiver, amount);
        }
    }
}
