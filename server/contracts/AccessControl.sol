// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract AccessControl is Ownable {
    /** State Variables */
    bool private paused;

    // Mappings
    mapping(address => bool) private locked;

    /** Events */
    event ContractPaused();
    event ContractUnpaused();

    /** Errors */
    error AccountLocked(address caller);
    error ContractIsPaused();
    error ContractIsNotPaused();
    error InvalidFunctionCall();
    error ZeroAddressNotAllowed();

    /** Constructor */
    constructor() Ownable(msg.sender) {}

    /** Modifiers */
    modifier validAddress(address _address) {
        if (_address == address(0)) {
            revert ZeroAddressNotAllowed();
        }
        _;
    }
    modifier whenNotLocked() {
        if (locked[msg.sender]) {
            revert AccountLocked(msg.sender);
        }
        locked[msg.sender] = true;
        _;
        locked[msg.sender] = false;
    }

    modifier whenNotPaused() {
        if (paused) {
            revert ContractIsPaused();
        }
        _;
    }

    /** Fallback Functions */
    fallback() external virtual {
        revert InvalidFunctionCall();
    }

    /** Access Control Functions */
    function pause() external virtual onlyOwner whenNotPaused whenNotLocked {
        paused = true;
        emit ContractPaused();
    }

    function unpause() external virtual onlyOwner whenNotLocked {
        if (!paused) {
            revert ContractIsNotPaused();
        }

        paused = false;
        emit ContractUnpaused();
    }

    /** Getter Functions */
    function isPaused() external view virtual returns (bool) {
        return paused;
    }
}
