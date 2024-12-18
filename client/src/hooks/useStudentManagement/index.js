import { useContext, useEffect, useState } from 'react';
import studentManagement from '../../utils/studentManagement.config';
import { AppContext } from '../../contexts/AppContext';
import initializeContract from '../../utils/initializeContract';
import handleCustomError from '../../utils/handleCustomError';

function useStudentManagement() {
  const { ethereum, account, provider, signer } = useContext(AppContext);
  const [studentContract, setStudentContract] = useState(null);

  /** Initialize the contract. */
  useEffect(() => {
    if (!ethereum) {
      console.warn('MetaMask or Ethereum provider not detected.');
      return;
    }

    if (!provider) {
      console.warn('Web3 provider not detected.');
      return;
    }

    if (!signer) {
      console.warn('Web3 signer not detected.');
      return;
    }

    initializeContract(studentManagement, setStudentContract, provider, signer);
  }, [ethereum, provider, signer]); // Depend on provider and signer.

  /** Setup event listeners during initialization. */
  useEffect(() => {
    if (!ethereum) {
      console.warn('MetaMask or Ethereum provider not detected.');
      return;
    }

    if (!studentContract) {
      console.warn('Student contract instance is not initialized.');
      return;
    }

    console.info('Setting up event listeners for Student contract...');

    setupClassEventListeners();
    setupStudentEventListeners();

    return () => {
      console.info('Cleaned up Student contract event listeners.');

      cleanupClassEventListeners();
      cleanupStudentEventListeners();
    };
  }, [ethereum, studentContract]);

  /** Utility functions. */
  function dependenciesNullCheck() {
    if (!ethereum) {
      console.warn('MetaMask or Ethereum provider not detected.');
      return;
    }

    if (!studentContract) {
      console.warn('Student contract instance is not initialized.');
      return;
    }

    if (!account) {
      console.warn('Account not detected.');
      return;
    }
  }

  function contractError(error) {
    return handleCustomError(studentManagement.abi, error);
  }

  /** Class functions. */
  // Listeners.
  function setupClassEventListeners() {
    // Register class.
    // Delete class.
  }
  function cleanupClassEventListeners() {
    // Register class.
    // Delete class.
  }

  // Getters.

  // Setters.

  /** Student functions. */
  // Listeners.
  function setupStudentEventListeners() {
    // Register student.
    // Delete student.
  }
  function cleanupStudentEventListeners() {
    // Register student.
    // Delete student.
  }

  // Getters.

  // Setters.

  /** Exports */
  return { studentContract };
}

export default useStudentManagement;
