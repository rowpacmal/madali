import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import gradingSystem from '../../utils/gradingSystem.config';
import handleCustomErrors from '../../utils/handleCustomErrors';
import useGradingSystem from '../useGradingSystem';

function useUserRole() {
  const { account } = useContext(AppContext);
  const { gradingContract } = useGradingSystem();
  const [userRole, setUserRole] = useState('');

  // Fetch user role when gradingContract or account changes.
  useEffect(() => {
    (async function () {
      if (!window.ethereum || !gradingContract || !account) {
        setUserRole('');
        return;
      }

      try {
        // Ensure the userRole fetch is tied to the current signer/account.
        const role = await gradingContract.read.getUserRole(account, {
          from: account,
        });

        if (account === role[0]) {
          console.info('User role for account:', role[0], 'is:', role[1]);
        } else {
          console.warn('Something is wrong.');
          console.warn(
            'Wallet address:',
            account,
            'does not match msg.sender:',
            role[0]
          );
        }

        switch (Number(role[1])) {
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

  return userRole;
}

export default useUserRole;
