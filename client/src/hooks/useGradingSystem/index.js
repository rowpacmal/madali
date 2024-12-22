import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import gradingSystem from '../../utils/gradingSystem.config';
import initializeContract from '../../utils/initializeContract';
import handleCustomError from '../../utils/handleCustomError';

function useGradingSystem() {
  const { ethereum, account, provider, signer } = useContext(AppContext);
  const [gradingContract, setGradingContract] = useState(null);

  // Initialize the contract.
  useEffect(() => {
    if (!ethereum) {
      console.warn('MetaMask or Ethereum provider not detected.');
      return;
    }

    if (!provider) {
      console.warn('Web3 provider not detected.');
      return;
    }

    if (!signer) {
      console.warn('Web3 signer not detected.');
      return;
    }

    // Initialize the contract.
    console.info('Initializing Grading contract...');
    initializeContract(gradingSystem, setGradingContract, provider, signer);
  }, [ethereum, provider, signer]); // Depend on ethereum, provider and signer.

  /** Setup event listeners during initialization. */
  useEffect(
    () => {
      if (!ethereum) {
        console.warn('MetaMask or Ethereum provider not detected.');
        return;
      }

      if (!gradingContract) {
        console.warn('Grading contract instance is not initialized.');
        return;
      }

      console.info('Setting up event listeners for Grading contract...');

      setupGradingEventListeners();

      return () => {
        console.info('Cleaned up Grading contract event listeners.');

        cleanupGradingEventListeners();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ethereum, gradingContract]
  );

  /** Utility functions. */
  function dependenciesNullCheck() {
    if (!ethereum) {
      console.warn('MetaMask or Ethereum provider not detected.');
      return;
    }

    if (!gradingContract) {
      console.warn('Grading contract instance is not initialized.');
      return;
    }

    if (!account) {
      console.warn('Account not detected.');
      return;
    }
  }

  function contractError(error) {
    throw handleCustomError(gradingSystem.abi, error);
  }

  /** Grade functions. */
  // Listeners.
  function setupGradingEventListeners() {
    // Add grade.
    gradingContract.read.on('GradeAdditionFailed_ZeroAddress', () => {
      console.error(`Error: Cannot add grade to a student with zero address.`);
    });
    gradingContract.read.on(
      'GradeAdditionFailed_StudentNotFound',
      (address) => {
        console.error(`Error: Student with address ${address} not found.`);
      }
    );
    gradingContract.read.on('GradeAdded', (address, id) => {
      console.info(
        `Success: Grade with ID ${id} has been added to student with address ${address}.`
      );
    });

    // Delete grade.
    gradingContract.read.on('GradeDeleted', (address, id) => {
      console.info(
        `Success: Grade with ID ${id} has been deleted from student with address ${address}.`
      );
    });

    // Update grade.
    gradingContract.read.on('GradeUpdated', (id, oldGrade, newGrade) => {
      console.info(
        `Success: Grade with ID ${id} has been updated the assigned grade from ${oldGrade} to ${newGrade}.`
      );
    });
  }
  function cleanupGradingEventListeners() {
    // Add grade.
    gradingContract.read.removeAllListeners('GradeAdditionFailed_ZeroAddress');
    gradingContract.read.removeAllListeners(
      'GradeAdditionFailed_StudentNotFound'
    );
    gradingContract.read.removeAllListeners('GradeAdded');

    // Delete grade.
    gradingContract.read.removeAllListeners('GradeDeleted');

    // Update grade.
    gradingContract.read.removeAllListeners('GradeUpdated');
  }

  // Getters.
  async function getAllGradesByStudent(student) {
    dependenciesNullCheck();

    try {
      const allGrades = await gradingContract.read.getAllGradesByStudent(
        student,
        {
          from: account,
        }
      );
      const gradesArray = allGrades.map((grade) => Number(grade));

      console.info(`All Grades by student (${student}):`, gradesArray);

      return gradesArray;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getGrade(gradeID) {
    dependenciesNullCheck();

    try {
      const grade = await gradingContract.read.getGrade(gradeID, {
        from: account,
      });
      const gradeObj = {
        student: grade[0],
        teacher: grade[1],
        course: Number(grade[2]),
        id: Number(grade[3]),
        module: Number(grade[4]),
        grade: Number(grade[5]),
        exists: grade[6],
      };

      console.info('Grade:', gradeObj);

      return gradeObj;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getTotalGradesByStudent(student) {
    dependenciesNullCheck();

    try {
      const totalGrades = await gradingContract.read.getTotalGradesByStudent(
        student,
        {
          from: account,
        }
      );
      const totalGradesNumber = Number(totalGrades);

      console.info(
        `Total number of Grades by student (${student}):`,
        totalGradesNumber
      );

      return totalGradesNumber;
    } catch (error) {
      return contractError(error);
    }
  }

  // Setters.
  async function addGrades(course, module, students, grades) {
    dependenciesNullCheck();

    try {
      await gradingContract.write.addGrades(students, grades, course, module, {
        from: account,
      });

      for (let i = 0; i < students.length; i++) {
        console.info(
          `Grades to be added for student (${students[i]}) in course (${course}) and module (${module}):`,
          grades[i]
        );
      }
    } catch (error) {
      return contractError(error);
    }
  }
  async function deleteGrade(gradeID) {
    dependenciesNullCheck();

    try {
      await gradingContract.write.deleteGrade(gradeID, {
        from: account,
      });

      console.info('Grade to be deleted:', gradeID);
    } catch (error) {
      return contractError(error);
    }
  }
  async function updateGrade(gradeID, newGrade) {
    dependenciesNullCheck();

    try {
      await gradingContract.write.updateGrade(gradeID, newGrade, {
        from: account,
      });

      console.info('Grade to be updated:', gradeID);
      console.info('New grade to be assigned:', newGrade);
    } catch (error) {
      return contractError(error);
    }
  }

  /** Exports */
  return {
    // Contract.
    gradingContract,

    // Grade getters.
    getAllGradesByStudent,
    getGrade,
    getTotalGradesByStudent,

    // Grade setters.
    addGrades,
    deleteGrade,
    updateGrade,
  };
}

export default useGradingSystem;
