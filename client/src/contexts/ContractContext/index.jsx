import { createContext, useEffect, useState } from 'react';
import educationCertificate from '../../utils/educationCertificate.config';
import gradingSystem from '../../utils/gradingSystem.config';
import studentManagement from '../../utils/studentManagement.config';
import teacherManagement from '../../utils/teacherManagement.config';
import { ethers } from 'ethers';

const ContractContext = createContext({});

function ContractProvider({ children }) {
  const [userRole, setUserRole] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const [certificateContract, setCertificateContract] = useState(null);
  const [gradingContract, setGradingContract] = useState(null);
  const [studentContract, setStudentContract] = useState(null);
  const [teacherContract, setTeacherContract] = useState(null);

  useEffect(() => {
    (async function () {
      await handleContractStates(
        [
          educationCertificate,
          gradingSystem,
          studentManagement,
          teacherManagement,
        ],
        [
          setCertificateContract,
          setGradingContract,
          setStudentContract,
          setTeacherContract,
        ]
      );
    })();
  }, []);

  useEffect(() => {
    if (!gradingContract) {
      return;
    }

    (async function () {
      const role = Number(await gradingContract.read.getUserRole());

      console.log(role);

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
    })();
  }, [gradingContract]);

  async function handleContractStates(contracts, setStates) {
    let provider,
      signer = null;

    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      setWalletAddress(await signer.getAddress());
    } catch (error) {
      console.error('Error initializing the provider : ', error);
    }

    for (let i = 0; i < contracts.length; i++) {
      const { name, abi, address } = contracts[i];
      let readContract,
        writeContract = null;

      try {
        readContract = new ethers.Contract(address, abi, provider);
        writeContract = new ethers.Contract(address, abi, signer);
      } catch (error) {
        console.error(`Error initializing the ${name} contract : ${error}`);
      }

      setStates[i]({
        read: readContract,
        write: writeContract,
      });
    }
  }

  return (
    <ContractContext.Provider
      value={{
        userRole,
        walletAddress,
        certificateContract,
        gradingContract,
        studentContract,
        teacherContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export { ContractContext, ContractProvider };
