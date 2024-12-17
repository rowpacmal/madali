import { useContext, useEffect, useState } from 'react';
import studentManagement from '../../utils/studentManagement.config';
import { AppContext } from '../../contexts/AppContext';
import initializeContract from '../../utils/initializeContract';

function useStudentManagement() {
  const { provider, signer } = useContext(AppContext);
  const [studentContract, setStudentContract] = useState(null);

  // Initialize the contract.
  useEffect(() => {
    initializeContract(studentManagement, setStudentContract, provider, signer);
  }, [provider, signer]); // Depend on provider and signer.

  return { studentContract };
}

export default useStudentManagement;
