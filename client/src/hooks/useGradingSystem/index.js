import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import gradingSystem from '../../utils/gradingSystem.config';
import initializeContract from '../../utils/initializeContract';
// import handleCustomError from '../../utils/handleCustomError';

function useGradingSystem() {
  const { ethereum, provider, signer } = useContext(AppContext);
  const [gradingContract, setGradingContract] = useState(null);

  // Initialize the contract.
  useEffect(() => {
    if (!ethereum || !provider || !signer) {
      return;
    }

    initializeContract(gradingSystem, setGradingContract, provider, signer);
  }, [ethereum, provider, signer]); // Depend on ethereum, provider and signer.

  return { gradingContract };
}

export default useGradingSystem;
