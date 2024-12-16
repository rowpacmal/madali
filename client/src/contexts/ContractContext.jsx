import { createContext, useEffect, useState } from 'react';
import initializeContract from '../utils/initializeContract';
import educationCertificate from '../utils/educationCertificate.config';
import gradingSystem from '../utils/gradingSystem.config';
import studentManagement from '../utils/studentManagement.config';
import teacherManagement from '../utils/teacherManagement.config';

const ContractContext = createContext({});

const ContractProvider = ({ children }) => {
  const [certificateContract, setCertificateContract] = useState(null);
  const [gradingContract, setGradingContract] = useState(null);
  const [studentContract, setStudentContract] = useState(null);
  const [teacherContract, setTeacherContract] = useState(null);

  useEffect(() => {
    (async () => {
      await handleContractState(educationCertificate, setCertificateContract);
      await handleContractState(gradingSystem, setGradingContract);
      await handleContractState(studentManagement, setStudentContract);
      await handleContractState(teacherManagement, setTeacherContract);
    })();
  }, []);

  async function handleContractState(contact, setState) {
    const { readContract, writeContract } = await initializeContract(contact);

    setState({
      read: readContract,
      write: writeContract,
    });
  }

  return (
    <ContractContext.Provider
      value={{
        certificateContract,
        gradingContract,
        studentContract,
        teacherContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export { ContractContext, ContractProvider };
