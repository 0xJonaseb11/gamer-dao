// SPDX-License-Identifier: CC0-1.0
pragma solidity 0.8.19;

/**
 * @dev Interface of the ERC5484 standard as defined in the EIP.
 * Link: https://eips.ethereum.org/EIPS/eip-5484
 */
interface IERC5484 {
    /**
     * @notice A guideline to standardize burn-authorization's number coding
     */
    enum BurnAuth {
        IssuerOnly,
        OwnerOnly,
        Both,
        Neither
    }

    /**
     * @notice Emitted when a southbound token is issued.
     * @dev This emit is an add-on to nft's transfer emit in order to distinguish sbt
     * from vanilla nft while providing backward compatibility.
     * @param from The issuer
     * @param to The receiver
     * @param tokenId The id of the issued token
     * @param burnAuth The burn authorization of the token
     */
    event Issued(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId,
        BurnAuth burnAuth
    );

    /**
     * @notice Provides burn authorization of the token id.
     * @dev Unassigned tokenIds are invalid, and queries do throw.
     * @param tokenId_ The identifier for a token.
     */
    function burnAuth(uint256 tokenId_) external view returns (BurnAuth);
}
