import { useContext, useEffect, useState } from 'react';
import studentManagement from '../../utils/studentManagement.config';
import { AppContext } from '../../contexts/AppContext';
import initializeContract from '../../utils/initializeContract';
import handleCustomError from '../../utils/handleCustomError';

function useStudentManagement() {
  const { ethereum, account, provider, signer } = useContext(AppContext);
  const [studentContract, setStudentContract] = useState(null);

  /** Initialize the contract. */
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
    console.info('Initializing Student contract...');
    initializeContract(studentManagement, setStudentContract, provider, signer);
  }, [ethereum, provider, signer]); // Depend on provider and signer.

  /** Setup event listeners during initialization. */
  useEffect(
    () => {
      if (!ethereum) {
        console.warn('MetaMask or Ethereum provider not detected.');
        return;
      }

      if (!studentContract) {
        console.warn('Student contract instance is not initialized.');
        return;
      }

      console.info('Setting up event listeners for Student contract...');

      setupClassEventListeners();
      setupStudentEventListeners();

      return () => {
        console.info('Cleaned up Student contract event listeners.');

        cleanupClassEventListeners();
        cleanupStudentEventListeners();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ethereum, studentContract]
  );

  /** Utility functions. */
  function dependenciesNullCheck() {
    if (!ethereum) {
      console.warn('MetaMask or Ethereum provider not detected.');
      return;
    }

    if (!studentContract) {
      console.warn('Student contract instance is not initialized.');
      return;
    }

    if (!account) {
      console.warn('Account not detected.');
      return;
    }
  }

  function contractError(error) {
    return handleCustomError(studentManagement.abi, error);
  }

  /** Class functions. */
  // Listeners.
  function setupClassEventListeners() {
    // Add class.
    studentContract.read.on('ClassAdditionFailed_AlreadyExists', (id) => {
      console.error(`Error: Class with ID ${id} already exists.`);
    });
    studentContract.read.on('ClassCreated', (id) => {
      console.info(`Success: Class with ID ${id} has been created.`);
    });

    // Delete class.
    studentContract.read.on('ClassDeletionFailed_NotFound', (id) => {
      console.error(`Error: Class with ID ${id} not found.`);
    });
    studentContract.read.on('ClassDeleted', (id) => {
      console.info(`Success: Class with ID ${id} has been deleted.`);
    });
  }
  function cleanupClassEventListeners() {
    // Add class.
    studentContract.read.removeAllListeners(
      'ClassAdditionFailed_AlreadyExists'
    );
    studentContract.read.removeAllListeners('ClassCreated');

    // Delete class.
    studentContract.read.removeAllListeners('ClassDeletionFailed_NotFound');
    studentContract.read.removeAllListeners('ClassDeleted');
  }

  // Getters.
  async function getAllClasses() {
    dependenciesNullCheck();

    try {
      const allClasses = await studentContract.read.getAllClasses({
        from: account,
      });
      const classesArray = allClasses.map((classID) => Number(classID));

      console.info('All Classes:', classesArray);

      return classesArray;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getTotalClasses() {
    dependenciesNullCheck();

    try {
      const totalClasses = await studentContract.read.getTotalClasses({
        from: account,
      });
      const totalClassesNumber = Number(totalClasses);

      console.info('Total number of Classes:', totalClassesNumber);

      return totalClassesNumber;
    } catch (error) {
      return contractError(error);
    }
  }

  // Setters.
  async function addClass(classes) {
    dependenciesNullCheck();

    try {
      await studentContract.write.addClass(classes, {
        from: account,
      });

      console.info('Classes to be added:', classes);
    } catch (error) {
      return contractError(error);
    }
  }
  async function deleteClasses(classes) {
    dependenciesNullCheck();

    try {
      await studentContract.write.deleteClasses(classes, {
        from: account,
      });

      console.info('Classes to be deleted:', classes);
    } catch (error) {
      return contractError(error);
    }
  }

  /** Student functions. */
  // Listeners.
  function setupStudentEventListeners() {
    // Register student.
    studentContract.read.on('StudentAdditionFailed_ZeroAddress', () => {
      console.error(`Error: Cannot register students with zero address.`);
    });
    studentContract.read.on(
      'StudentAdditionFailed_AlreadyExists',
      (address) => {
        console.error(`Error: Student with address ${address} already exists.`);
      }
    );
    studentContract.read.on('StudentRegistered', (address) => {
      console.info(
        `Success: Student with address ${address} has been registered.`
      );
    });

    // Delete student.
    studentContract.read.on('StudentDeletionFailed_NoStudentsToDelete', () => {
      console.error(`Error: Class has no students to delete.`);
    });
    studentContract.read.on('StudentDeletionFailed_ZeroAddress', () => {
      console.error(`Error: Cannot delete students with zero address.`);
    });
    studentContract.read.on('StudentDeletionFailed_NotFound', (address) => {
      console.error(`Error: Student with address ${address} not found.`);
    });
    studentContract.read.on(
      'StudentDeletionFailed_NotEnrolledInClass',
      (address, id) => {
        console.error(
          `Error: Student with address ${address} is not enrolled in class ${id}.`
        );
      }
    );
    studentContract.read.on('StudentDeleted', (address) => {
      console.info(
        `Success: Student with address ${address} has been deleted.`
      );
    });

    // Update student.
    studentContract.read.on('StudentUpdated', (address) => {
      console.info(
        `Success: Student with address ${address} has been updated.`
      );
    });
  }
  function cleanupStudentEventListeners() {
    // Register student.
    studentContract.read.removeAllListeners(
      'StudentAdditionFailed_ZeroAddress'
    );
    studentContract.read.removeAllListeners(
      'StudentAdditionFailed_AlreadyExists'
    );
    studentContract.read.removeAllListeners('StudentRegistered');

    // Delete student.
    studentContract.read.removeAllListeners(
      'StudentDeletionFailed_NoStudentsToDelete'
    );
    studentContract.read.removeAllListeners(
      'StudentDeletionFailed_ZeroAddress'
    );
    studentContract.read.removeAllListeners('StudentDeletionFailed_NotFound');
    studentContract.read.removeAllListeners(
      'StudentDeletionFailed_NotEnrolledInClass'
    );
    studentContract.read.removeAllListeners('StudentDeleted');

    // Update student.
    studentContract.read.removeAllListeners('StudentUpdated');
  }

  // Getters.
  async function getAllStudents(classID) {
    dependenciesNullCheck();

    try {
      const allStudents = await studentContract.read.getAllStudents(classID, {
        from: account,
      });
      const studentsArray = [...allStudents];

      console.info(`All Students in class (${classID}):`, studentsArray);

      return studentsArray;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getStudent(studentAddress) {
    dependenciesNullCheck();

    try {
      const student = await studentContract.read.getStudent(studentAddress, {
        from: account,
      });

      const studentObj = {
        student: student[0],
        class: Number(student[1]),
        exists: student[2],
      };

      console.info('Student:', studentObj);

      return studentObj;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getTotalStudents(classID) {
    dependenciesNullCheck();

    try {
      const totalStudents = await studentContract.read.getTotalStudents(
        classID,
        {
          from: account,
        }
      );
      const totalStudentsNumber = Number(totalStudents);

      console.info(
        `Total number of Students in class (${classID}):`,
        totalStudentsNumber
      );

      return totalStudentsNumber;
    } catch (error) {
      return contractError(error);
    }
  }

  // Setters.
  async function deleteStudents(classID, students) {
    dependenciesNullCheck();

    try {
      await studentContract.write.deleteStudents(students, classID, {
        from: account,
      });

      console.info('Students to be deleted:', students);
    } catch (error) {
      return contractError(error);
    }
  }
  async function registerStudents(classID, students) {
    dependenciesNullCheck();

    try {
      await studentContract.write.registerStudents(students, classID, {
        from: account,
      });

      console.info('Students to be registered:', students);
    } catch (error) {
      return contractError(error);
    }
  }
  async function updateStudent(student, oldClass, newClass) {
    dependenciesNullCheck();

    try {
      await studentContract.write.updateStudent(student, oldClass, newClass, {
        from: account,
      });

      console.info('Student to be updated:', student);
      console.info('New class to be assigned:', newClass);
    } catch (error) {
      return contractError(error);
    }
  }

  /** Exports */
  return {
    // Contract.
    studentContract,

    // Class getters.
    getAllClasses,
    getTotalClasses,

    // Class setters.
    addClass,
    deleteClasses,

    // Student getters.
    getAllStudents,
    getStudent,
    getTotalStudents,

    // Student setters.
    deleteStudents,
    registerStudents,
    updateStudent,
  };
}

export default useStudentManagement;
