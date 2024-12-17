import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import gradingSystem from '../../utils/gradingSystem.config';
import initializeContract from '../../utils/initializeContract';
import handleCustomErrors from '../../utils/handleCustomErrors';

function useGradingSystem() {
  const { account, provider, signer } = useContext(AppContext);
  const [gradingContract, setGradingContract] = useState(null);
  const [userRole, setUserRole] = useState('');

  // Initialize the contract.
  useEffect(() => {
    initializeContract(gradingSystem, setGradingContract, provider, signer);
  }, [provider, signer]); // Depend on provider and signer.

  // Fetch user role when gradingContract or account changes.
  useEffect(() => {
    (async function () {
      if (!window.ethereum || !gradingContract || !account) {
        setUserRole('');
        return;
      }

      try {
        // Ensure the userRole fetch is tied to the current signer/account.
        const role = Number(await gradingContract.read.getUserRole(account));
        console.log('User role for account:', account, 'is:', role);

        switch (role) {
          case 3:
            setUserRole('Admin');
            break;

          case 2:
            setUserRole('Teacher');
            break;

          case 1:
            setUserRole('Student');
            break;

          case 0:
          default:
            setUserRole('Unauthorized');
            break;
        }
      } catch (error) {
        handleCustomErrors(gradingSystem.abi, error);
      }
    })();
  }, [gradingContract, account]); // Depend on gradingContract and account.

  return { gradingContract, userRole };
}

export default useGradingSystem;
