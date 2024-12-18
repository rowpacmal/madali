import { useContext, useEffect, useState } from 'react';
import teacherManagement from '../../utils/teacherManagement.config';
import { AppContext } from '../../contexts/AppContext';
import initializeContract from '../../utils/initializeContract';
import handleCustomError from '../../utils/handleCustomError';

function useTeacherManagement() {
  const { ethereum, account, provider, signer } = useContext(AppContext);
  const [teacherContract, setTeacherContract] = useState(null);

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
    console.info('Initializing Teacher contract...');
    initializeContract(teacherManagement, setTeacherContract, provider, signer);
  }, [ethereum, provider, signer]); // Depend on ethereum, provider and signer.

  /** Setup event listeners during initialization. */
  useEffect(
    () => {
      if (!ethereum) {
        console.warn('MetaMask or Ethereum provider not detected.');
        return;
      }

      if (!teacherContract) {
        console.warn('Teacher contract instance is not initialized.');
        return;
      }

      console.info('Setting up event listeners for Teacher contract...');

      setupCourseEventListeners();
      setupTeacherEventListeners();

      return () => {
        console.info('Cleaned up Teacher contract event listeners.');

        cleanupCourseEventListeners();
        cleanupTeacherEventListeners();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ethereum, teacherContract]
  );

  /** Utility functions. */
  function dependenciesNullCheck() {
    if (!ethereum) {
      console.warn('MetaMask or Ethereum provider not detected.');
      return;
    }

    if (!teacherContract) {
      console.warn('Teacher contract instance is not initialized.');
      return;
    }

    if (!account) {
      console.warn('Account not detected.');
      return;
    }
  }

  function contractError(error) {
    return handleCustomError(teacherManagement.abi, error);
  }

  /** Course functions. */
  // Listeners.
  function setupCourseEventListeners() {
    // Register course.
    teacherContract.read.on('CourseAdditionFailed_AlreadyExists', (id) => {
      console.error(`Error: Course with ID ${id} already exists.`);
    });
    teacherContract.read.on('CourseRegistered', (id) => {
      console.info(`Success: Course with ID ${id} has been registered.`);
    });

    // Delete course.
    teacherContract.read.on('CourseDeletionFailed_NoCoursesToDelete', () => {
      console.error(`Error: Teacher has no courses to delete.`);
    });
    teacherContract.read.on('CourseDeletionFailed_NotFound', (id) => {
      console.error(`Error: Course with ID ${id} not found.`);
    });
    teacherContract.read.on('CourseDeletionFailed_NotOwned', (id) => {
      console.error(`Error: Course with ID ${id} not owned by teacher.`);
    });
    teacherContract.read.on('CourseDeleted', (id) => {
      console.info(`Success: Course with ID ${id} has been deleted.`);
    });
  }
  function cleanupCourseEventListeners() {
    // Register course.
    teacherContract.read.removeAllListeners(
      'CourseAdditionFailed_AlreadyExists'
    );
    teacherContract.read.removeAllListeners('CourseRegistered');

    // Delete course.
    teacherContract.read.removeAllListeners(
      'CourseDeletionFailed_NoCoursesToDelete'
    );
    teacherContract.read.removeAllListeners('CourseDeletionFailed_NotFound');
    teacherContract.read.removeAllListeners('CourseDeletionFailed_NotOwned');
    teacherContract.read.removeAllListeners('CourseDeleted');
  }

  // Getters.
  async function getAllCoursesByTeacher(teacherAddress) {
    dependenciesNullCheck();

    try {
      const allCourses = await teacherContract.read.getAllCoursesByTeacher(
        teacherAddress,
        {
          from: account,
        }
      );
      const coursesArray = allCourses.map((course) => Number(course));

      console.info(`All Courses by teacher (${teacherAddress}):`, coursesArray);

      return coursesArray;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getCourse(courseID) {
    dependenciesNullCheck();

    try {
      const course = await teacherContract.read.getCourse(courseID, {
        from: account,
      });
      const courseObj = {
        teacher: course[0],
        id: Number(course[1]),
        class: Number(course[2]),
        modules: Number(course[3]),
        exists: course[4],
      };

      console.info('Course:', courseObj);

      return courseObj;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getTotalCoursesByTeacher(teacherAddress) {
    dependenciesNullCheck();

    try {
      const totalCourses = await teacherContract.read.getTotalCoursesByTeacher(
        teacherAddress,
        {
          from: account,
        }
      );
      const totalCoursesNumber = Number(totalCourses);

      console.info(
        `Total number of Courses by teacher (${teacherAddress}):`,
        totalCoursesNumber
      );

      return totalCoursesNumber;
    } catch (error) {
      return contractError(error);
    }
  }

  // Setters.
  async function deleteCourses(teacher, courses) {
    dependenciesNullCheck();

    try {
      await teacherContract.write.deleteCourses(courses, teacher, {
        from: account,
      });

      console.info('Courses to be deleted:', courses);
    } catch (error) {
      return contractError(error);
    }
  }
  async function registerCourses(teacher, courses, classes, modules) {
    dependenciesNullCheck();

    try {
      await teacherContract.write.registerCourse(
        teacher,
        courses,
        classes,
        modules,
        {
          from: account,
        }
      );

      console.info('Courses to be registered:', courses);
    } catch (error) {
      return contractError(error);
    }
  }

  /** Teacher functions. */
  // Listeners.
  function setupTeacherEventListeners() {
    // Register teacher.
    teacherContract.read.on('TeacherAdditionFailed_ZeroAddress', () => {
      console.error(`Error: Cannot register teacher with zero address.`);
    });
    teacherContract.read.on(
      'TeacherAdditionFailed_AlreadyExists',
      (address) => {
        console.error(`Error: Teacher with address ${address} already exists.`);
      }
    );
    teacherContract.read.on('TeacherRegistered', (address) => {
      console.info(
        `Success: Teacher with address ${address} has been registered.`
      );
    });

    // Delete teacher.
    teacherContract.read.on('TeacherDeletionFailed_ZeroAddress', () => {
      console.error(`Error: Cannot delete teacher with zero address.`);
    });
    teacherContract.read.on('TeacherDeletionFailed_NotFound', (address) => {
      console.error(`Error: Teacher with address ${address} not found.`);
    });
    teacherContract.read.on('TeacherDeleted', (address) => {
      console.info(
        `Success: Teacher with address ${address} has been deleted.`
      );
    });
  }
  function cleanupTeacherEventListeners() {
    // Register teacher.
    teacherContract.read.removeAllListeners(
      'TeacherAdditionFailed_ZeroAddress'
    );
    teacherContract.read.removeAllListeners(
      'TeacherAdditionFailed_AlreadyExists'
    );
    teacherContract.read.removeAllListeners('TeacherRegistered');

    // Delete teacher.
    teacherContract.read.removeAllListeners(
      'TeacherDeletionFailed_ZeroAddress'
    );
    teacherContract.read.removeAllListeners('TeacherDeletionFailed_NotFound');
    teacherContract.read.removeAllListeners('TeacherDeleted');
  }

  // Getters.
  async function getAllTeachers() {
    dependenciesNullCheck();

    try {
      const allTeachers = await teacherContract.read.getAllTeachers({
        from: account,
      });
      const teachersArray = [...allTeachers];

      console.info('All Teachers:', teachersArray);

      return teachersArray;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getTeacher(teacherAddress) {
    dependenciesNullCheck();

    try {
      const teacher = await teacherContract.read.getTeacher(teacherAddress, {
        from: account,
      });
      const teacherObj = {
        teacher: teacher[0][0],
        class: Number(teacher[0][1]),
        exists: teacher[0][2],
        courses: teacher[1].map((course) => Number(course)),
      };

      console.info('Teacher:', teacherObj);

      return teacherObj;
    } catch (error) {
      return contractError(error);
    }
  }
  async function getTotalTeachers() {
    dependenciesNullCheck();

    try {
      const totalTeachers = await teacherContract.read.getTotalTeachers({
        from: account,
      });
      const totalTeachersNumber = Number(totalTeachers);

      console.info('Total number of Teachers:', totalTeachersNumber);

      return totalTeachersNumber;
    } catch (error) {
      return contractError(error);
    }
  }

  // Setters.
  async function deleteTeachers(teachers) {
    dependenciesNullCheck();

    try {
      await teacherContract.write.deleteTeachers(teachers, {
        from: account,
      });

      console.info('Teachers to be deleted:', teachers);
    } catch (error) {
      return contractError(error);
    }
  }
  async function registerTeachers(teachers, classes) {
    dependenciesNullCheck();

    try {
      await teacherContract.write.registerTeachers(teachers, classes, {
        from: account,
      });

      console.info('Teachers to be registered:', teachers);
    } catch (error) {
      return contractError(error);
    }
  }
  async function updateTeacher(teacher, newClass) {
    dependenciesNullCheck();

    try {
      await teacherContract.write.updateTeacher(teacher, newClass, {
        from: account,
      });

      console.info('Teacher to be updated:', teacher);
      console.info('New class to be assigned:', newClass);
    } catch (error) {
      return contractError(error);
    }
  }

  /** Exports */
  return {
    // Contract.
    teacherContract,

    // Course getters.
    getAllCoursesByTeacher,
    getCourse,
    getTotalCoursesByTeacher,

    // Course setters.
    deleteCourses,
    registerCourses,

    // Teacher getters.
    getAllTeachers,
    getTeacher,
    getTotalTeachers,

    // Teacher setters.
    deleteTeachers,
    registerTeachers,
    updateTeacher,
  };
}

export default useTeacherManagement;
