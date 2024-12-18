import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import gradingSystem from '../../utils/gradingSystem.config';
import handleCustomErrors from '../../utils/handleCustomErrors';
import useGradingSystem from '../useGradingSystem';

function useUserRole() {
  const { ethereum, account } = useContext(AppContext);
  const { gradingContract } = useGradingSystem();
  const [userRole, setUserRole] = useState('');

  // Fetch user role when gradingContract or account changes.
  useEffect(() => {
    (async function () {
      if (!ethereum || !gradingContract || !account) {
        setUserRole('');
        return;
      }

      try {
        // Ensure the userRole fetch is tied to the current signer/account.
        const role = await gradingContract.read.getUserRole(account, {
          from: account,
        });

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
  }, [ethereum, account, gradingContract]); // Depend on gradingContract and account.

  return { userRole };
}

export default useUserRole;
