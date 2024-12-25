# Documentation for AccessControl Contract

## Overview

The `AccessControl` contract is an abstract Solidity contract designed to provide essential access control mechanisms, such as pausing and locking accounts, along with safe and secure execution of contract functions. It leverages the OpenZeppelin `Ownable` contract to enable ownership management.

## Features

1. **Ownership Management**: Uses OpenZeppelin's `Ownable` contract for owner-restricted actions.
2. **Pause/Unpause**: Allows the owner to pause and unpause the contract.
3. **Account Locking**: Temporarily locks accounts during critical operations to prevent reentrancy attacks.
4. **Input Validation**: Validates inputs to prevent common issues, such as passing a zero address.
5. **Fallback Function**: Reverts invalid function calls.
6. **Reentrancy Protection**: Ensures safe function execution by locking accounts during their use.

---

## Components

### **State Variables**

- `bool private paused`: Indicates whether the contract is paused (`true`) or active (`false`).
- `mapping(address => bool) private locked`: Tracks whether a specific address is temporarily locked.

---

### **Events**

- `event ContractPaused()`: Emitted when the contract is paused.
- `event ContractUnpaused()`: Emitted when the contract is unpaused.

---

### **Errors**

- `error AccountLocked(address caller)`: Thrown when a locked account attempts to execute a restricted function.
- `error ContractIsPaused()`: Thrown when a function is called while the contract is paused.
- `error ContractIsNotPaused()`: Thrown when trying to unpause an already active contract.
- `error InvalidFunctionCall()`: Thrown when an invalid function is called via the fallback mechanism.
- `error ZeroAddressNotAllowed()`: Thrown when a zero address is used as input.

---

### **Constructor**

- `constructor() Ownable(msg.sender)`: Initializes the contract and sets the deployer as the owner.

---

### **Modifiers**

- `modifier validAddress(address _address)`: Ensures the provided address is not the zero address. Reverts with `ZeroAddressNotAllowed` if invalid.
- `modifier whenNotLocked()`: Ensures the caller's account is not locked. Locks the account during function execution to prevent reentrancy and unlocks it afterward. Reverts with `AccountLocked` if locked.
- `modifier whenNotPaused()`: Ensures the contract is not paused. Reverts with `ContractIsPaused` if paused.

---

### **Fallback Function**

- `fallback() external virtual`: Reverts any invalid function calls with `InvalidFunctionCall`.

---

### **Functions**

#### **Access Control Functions**

1. `function pause() external virtual onlyOwner whenNotPaused whenNotLocked`:  
   Pauses the contract. Can only be called by the owner, and only if the contract is active. Emits `ContractPaused`.

2. `function unpause() external virtual onlyOwner whenNotLocked`:  
   Unpauses the contract. Can only be called by the owner, and only if the contract is paused. Emits `ContractUnpaused`.

---

#### **Getter Functions**

1. `function isPaused() external view virtual returns (bool)`:  
   Returns the current pause state of the contract (`true` if paused, `false` otherwise).

---

#### **Test Functions**

1. `function reentryTest() external virtual whenNotPaused whenNotLocked`:  
   Demonstrates reentrancy protection by calling an internal function, `reentryCall`.

2. `function reentryCall() internal virtual whenNotPaused whenNotLocked`:  
   Internal function used to test reentrancy protection.

---

## Usage

1. **Pausing the Contract**:  
   The owner can call the `pause` function to pause the contract, preventing operations requiring the `whenNotPaused` modifier.

2. **Unpausing the Contract**:  
   The owner can call the `unpause` function to reactivate the contract.

3. **Reentrancy Protection**:  
   Functions with the `whenNotLocked` modifier ensure that the caller's account cannot execute another function requiring the same modifier until the initial function completes.

4. **Fallback Mechanism**:  
   The `fallback` function prevents unauthorized or invalid function calls by reverting with `InvalidFunctionCall`.

---

## Security Considerations

1. **Owner-Only Functions**: Critical functions such as `pause` and `unpause` are restricted to the contract owner.
2. **Reentrancy Protection**: The `whenNotLocked` modifier prevents reentrancy attacks by temporarily locking the caller's account.
3. **Input Validation**: The `validAddress` modifier ensures no zero addresses are accepted.
4. **Fallback Protection**: The `fallback` function prevents accidental or malicious calls to non-existent functions.

This contract is modular and can be extended to include more advanced access control mechanisms or integrated with other functionalities.
