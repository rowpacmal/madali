import { useContext, useEffect, useState } from 'react';
import teacherManagement from '../../utils/teacherManagement.config';
import { AppContext } from '../../contexts/AppContext';
import initializeContract from '../../utils/initializeContract';
import handleCustomErrors from '../../utils/handleCustomErrors';

function useTeacherManagement() {
  const { ethereum, account, provider, signer } = useContext(AppContext);
  const [providerError] = useState(
    'Error getting all teachers: Web3 provider not found.'
  );
  const [teacherContract, setTeacherContract] = useState(null);

  // Initialize the contract.
  useEffect(() => {
    if (!ethereum || !provider || !signer) {
      console.error(providerError);

      return;
    }

    initializeContract(teacherManagement, setTeacherContract, provider, signer);
  }, [ethereum, provider, providerError, signer]); // Depend on ethereum, provider and signer.

  function checkWeb3Provider() {
    if (!ethereum || !teacherContract || !account) {
      console.error(providerError);

      return providerError;
    }
  }

  async function getAllTeachers() {
    checkWeb3Provider();

    try {
      const allTeachers = await teacherContract.read.getAllTeachers({
        from: account,
      });
      const teachersArray = [...allTeachers];

      console.info('All Teachers:', teachersArray);

      return teachersArray;
    } catch (error) {
      const customError = handleCustomErrors(teacherManagement.abi, error);
      console.error('Error getting all teachers:', customError);

      return customError;
    }
  }

  async function getTeacher(teacherAddress) {
    checkWeb3Provider();

    try {
      const teacher = await teacherContract.read.getTeacher(teacherAddress, {
        from: account,
      });
      const teacherObj = {
        teacher: teacher[0][0],
        class: Number(teacher[0][1]),
        exists: teacher[0][2],
        courses: [...teacher[1]],
      };

      console.info('Teacher:', teacherObj);

      return teacherObj;
    } catch (error) {
      const customError = handleCustomErrors(teacherManagement.abi, error);
      console.error('Error getting a teacher:', customError);

      return customError;
    }
  }

  async function getTotalTeachers() {
    checkWeb3Provider();

    try {
      const totalTeachers = Number(
        await teacherContract.read.getTotalTeachers({
          from: account,
        })
      );
      const totalTeachersNumber = Number(totalTeachers);

      console.info('Total number of teachers:', totalTeachersNumber);

      return totalTeachersNumber;
    } catch (error) {
      const customError = handleCustomErrors(teacherManagement.abi, error);
      console.error('Error getting total number of teachers:', customError);

      return customError;
    }
  }

  return { teacherContract, getAllTeachers, getTeacher, getTotalTeachers };
}

export default useTeacherManagement;
