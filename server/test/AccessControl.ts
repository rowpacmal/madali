import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Factory } from '../typechain-types';
import deployContractFixture from '../utils/deployContractFixture';

describe('Access Control Functionality', function () {
  let factory: Factory;
  let owner: any, user1: any;

  beforeEach(async function () {
    ({ owner, user1, factory } = await deployContractFixture());
  });

  describe('Pause and Unpause a Contract', function () {
    it('should pause and unpause a contract', async function () {
      // Verify that the contract initially is not paused.
      expect(await factory.isPaused()).to.equal(false);

      // Pause the contract.
      await factory.pause();

      // Verify that the contract is paused.
      expect(await factory.isPaused()).to.equal(true);

      // Unpause the contract.
      await factory.unpause();

      // Verify that the contract is not paused.
      expect(await factory.isPaused()).to.equal(false);
    });

    it('should emit events when pause and unpause a contract', async function () {
      // Verify that the contract initially is not paused.
      expect(await factory.isPaused()).to.equal(false);

      // Emit the 'Paused' event when pausing the contract.
      await expect(factory.pause()).to.emit(factory, 'ContractPaused');

      // Verify that the contract is paused.
      expect(await factory.isPaused()).to.equal(true);

      // Emit the 'Unpaused' event when unpausing the contract.
      await expect(factory.unpause()).to.emit(factory, 'ContractUnpaused');

      // Verify that the contract is not paused.
      expect(await factory.isPaused()).to.equal(false);
    });

    it('should revert when pausing or unpausing the contract as a non-owner user', async function () {
      // Verify that the contract initially is not paused.
      expect(await factory.isPaused()).to.equal(false);

      // Attempt to call the pause function as a non-owner user.
      await expect(
        factory.connect(user1).pause()
      ).to.be.revertedWithCustomError(factory, 'OwnableUnauthorizedAccount');

      // Verify that the contract still is not paused.
      expect(await factory.isPaused()).to.equal(false);

      // Pause the contract as the owner.
      await factory.pause();

      // Verify that the contract is paused.
      expect(await factory.isPaused()).to.equal(true);

      // Attempt to call the unpause function as a non-owner user.
      await expect(
        factory.connect(user1).unpause()
      ).to.be.revertedWithCustomError(factory, 'OwnableUnauthorizedAccount');

      // Verify that the contract is still paused.
      expect(await factory.isPaused()).to.equal(true);

      // Unpause the contract as the owner.
      await factory.unpause();

      // Verify that the contract is not paused.
      expect(await factory.isPaused()).to.equal(false);
    });

    it('should revert when attempting to pause while already paused, and when attempting to unpause while not paused', async function () {
      // Verify that the contract initially is not paused.
      expect(await factory.isPaused()).to.equal(false);

      // Pause the contract.
      await factory.pause();

      // Attempt to call the pause function again.
      await expect(factory.pause()).to.be.revertedWithCustomError(
        factory,
        'ContractIsPaused'
      );

      // Verify that the contract is paused.
      expect(await factory.isPaused()).to.equal(true);

      // Unpause the contract.
      await factory.unpause();

      // Attempt to call the unpause function again.
      await expect(factory.unpause()).to.be.revertedWithCustomError(
        factory,
        'ContractIsNotPaused'
      );

      // Verify that the contract is not paused.
      expect(await factory.isPaused()).to.equal(false);
    });
  });

  describe('Revert on invalid function call', function () {
    it('should revert with InvalidFunctionCall when calling a non-existent function or sending random data', async function () {
      // Attempt to call the contract with invalid data to the fallback function.
      const randomData = '0x12345678';

      await expect(
        ethers.provider.call({
          to: await factory.getAddress(),
          data: randomData,
        })
      ).to.be.revertedWithCustomError(factory, 'InvalidFunctionCall');
    });
  });

  describe('Prevent reentrancy', function () {
    it('should revert when the contract is called recursively', async function () {
      // Call the contracts reentryTest function.
      await expect(factory.reentryTest())
        .to.be.revertedWithCustomError(factory, 'AccountLocked')
        .withArgs(owner.address);

      await expect(factory.connect(user1).reentryTest())
        .to.be.revertedWithCustomError(factory, 'AccountLocked')
        .withArgs(user1.address);
    });
  });

  describe('Ownable by @openzeppelin Functionality', function () {
    it('should initialize with the correct owner', async function () {
      // Verify that the contract is owned by the owner.
      expect(await factory.owner()).to.equal(owner.address);
    });

    it('should transfer ownership to another account', async function () {
      // Transfer ownership to another account.
      await factory.transferOwnership(user1.address);

      // Verify that the contract is owned by the new owner.
      expect(await factory.owner()).to.equal(user1.address);
    });

    it('should renounce ownership to the zero address', async function () {
      const zeroAddress = '0x0000000000000000000000000000000000000000';

      // Renounce ownership to the zero address.
      await factory.renounceOwnership();

      // Verify that the contract is owned by the zero address.
      expect(await factory.owner()).to.equal(zeroAddress);
    });

    it('should revert when trying to transfer ownership to the zero address', async function () {
      const zeroAddress = '0x0000000000000000000000000000000000000000';

      // Attempt to transfer ownership to the zero address.
      await expect(factory.transferOwnership(zeroAddress))
        .to.be.revertedWithCustomError(factory, 'OwnableInvalidOwner')
        .withArgs(zeroAddress);
    });

    it('should emit when transferring ownership', async function () {
      // Transfer ownership to another account.
      await expect(factory.transferOwnership(user1.address))
        .to.be.emit(factory, 'OwnershipTransferred')
        .withArgs(owner.address, user1.address);
    });
  });
});
