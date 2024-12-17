import { useContext, useEffect, useState } from 'react';
import teacherManagement from '../../utils/teacherManagement.config';
import { AppContext } from '../../contexts/AppContext';
import initializeContract from '../../utils/initializeContract';

function useTeacherManagement() {
  const { provider, signer } = useContext(AppContext);
  const [teacherContract, setTeacherContract] = useState(null);

  // Initialize the contract.
  useEffect(() => {
    initializeContract(teacherManagement, setTeacherContract, provider, signer);
  }, [provider, signer]); // Depend on provider and signer.

  return { teacherContract };
}

export default useTeacherManagement;
