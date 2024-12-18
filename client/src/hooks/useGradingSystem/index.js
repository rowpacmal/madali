import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import gradingSystem from '../../utils/gradingSystem.config';
import initializeContract from '../../utils/initializeContract';
// import handleCustomErrors from '../../utils/handleCustomErrors';

function useGradingSystem() {
  const { provider, signer } = useContext(AppContext);
  const [gradingContract, setGradingContract] = useState(null);

  // Initialize the contract.
  useEffect(() => {
    initializeContract(gradingSystem, setGradingContract, provider, signer);
  }, [provider, signer]); // Depend on provider and signer.

  return { gradingContract };
}

export default useGradingSystem;
