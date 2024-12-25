// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Import OpenZeppelin contract, Ownable, for ownership management.
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
    // Modifier to check if the address is valid.
    modifier validAddress(address _address) {
        if (_address == address(0)) {
            revert ZeroAddressNotAllowed();
        }
        _;
    }

    // Modifier to check if the account is locked.
    modifier whenNotLocked() {
        if (locked[msg.sender]) {
            revert AccountLocked(msg.sender);
        }
        locked[msg.sender] = true;
        _;
        locked[msg.sender] = false;
    }

    // Modifier to check if the contract is paused.
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
    // Function to pause the contract.
    function pause() external virtual onlyOwner whenNotPaused whenNotLocked {
        paused = true;
        emit ContractPaused();
    }

    // Function to unpause the contract.
    function unpause() external virtual onlyOwner whenNotLocked {
        if (!paused) {
            revert ContractIsNotPaused();
        }

        paused = false;
        emit ContractUnpaused();
    }

    /** Getter Functions */
    // Function to check if the contract is paused.
    function isPaused() external view virtual returns (bool) {
        return paused;
    }

    /** Test Functions */
    function reentryTest() external virtual whenNotPaused whenNotLocked {
        reentryCall();
    }

    function reentryCall() internal virtual whenNotPaused whenNotLocked {}
}
