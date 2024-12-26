// Configuration for the TeacherManagement contract.
// This file contains the name, address and ABI for the contract.
const teacherManagement = {
  name: 'TeacherManagement',
  address: '0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968',
  abi: [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'AccountLocked',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ContractIsNotPaused',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ContractIsPaused',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'course',
          type: 'uint256',
        },
      ],
      name: 'CourseNotFound',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'coursesLength',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'classesLength',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'modulesLength',
          type: 'uint256',
        },
      ],
      name: 'CoursesClassesModulesLengthMismatch',
      type: 'error',
    },
    {
      inputs: [],
      name: 'InvalidFunctionCall',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoClassesProvided',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoCoursesProvided',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoCoursesToDelete',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoModulesProvided',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoTeachersProvided',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoTeachersToDelete',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'OwnableInvalidOwner',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'OwnableUnauthorizedAccount',
      type: 'error',
    },
    {
      inputs: [],
      name: 'StudentContractNotFound',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'teacher',
          type: 'address',
        },
      ],
      name: 'TeacherNotFound',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'teachersLength',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'classesLength',
          type: 'uint256',
        },
      ],
      name: 'TeachersClassesLengthMismatch',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'caller',
          type: 'address',
        },
      ],
      name: 'UnauthorizedAccount',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ZeroAddressNotAllowed',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'ContractPaused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'ContractUnpaused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'course',
          type: 'uint256',
        },
      ],
      name: 'CourseAdditionFailed_AlreadyExists',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'course',
          type: 'uint256',
        },
      ],
      name: 'CourseDeleted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'CourseDeletionFailed_NoCoursesToDelete',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'course',
          type: 'uint256',
        },
      ],
      name: 'CourseDeletionFailed_NotFound',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'course',
          type: 'uint256',
        },
      ],
      name: 'CourseDeletionFailed_NotOwned',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'course',
          type: 'uint256',
        },
      ],
      name: 'CourseRegistered',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'teacher',
          type: 'address',
        },
      ],
      name: 'TeacherAdditionFailed_AlreadyExists',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'TeacherAdditionFailed_ZeroAddress',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'teacher',
          type: 'address',
        },
      ],
      name: 'TeacherDeleted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'teacher',
          type: 'address',
        },
      ],
      name: 'TeacherDeletionFailed_NotFound',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'TeacherDeletionFailed_ZeroAddress',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'teacher',
          type: 'address',
        },
      ],
      name: 'TeacherRegistered',
      type: 'event',
    },
    {
      stateMutability: 'nonpayable',
      type: 'fallback',
    },
    {
      inputs: [
        {
          internalType: 'uint256[]',
          name: '_courses',
          type: 'uint256[]',
        },
        {
          internalType: 'address',
          name: '_teacherAddress',
          type: 'address',
        },
      ],
      name: 'deleteCourses',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: '_teachers',
          type: 'address[]',
        },
      ],
      name: 'deleteTeachers',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_courseID',
          type: 'uint256',
        },
      ],
      name: 'doesCourseExist',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_teacherAddress',
          type: 'address',
        },
      ],
      name: 'doesTeacherExist',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_teacherAddress',
          type: 'address',
        },
      ],
      name: 'getAllCoursesByTeacher',
      outputs: [
        {
          internalType: 'uint256[]',
          name: '',
          type: 'uint256[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getAllTeachers',
      outputs: [
        {
          internalType: 'address[]',
          name: '',
          type: 'address[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_courseID',
          type: 'uint256',
        },
      ],
      name: 'getCourse',
      outputs: [
        {
          components: [
            {
              internalType: 'address',
              name: 'teacher',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              internalType: 'uint16',
              name: 'class',
              type: 'uint16',
            },
            {
              internalType: 'uint8',
              name: 'modules',
              type: 'uint8',
            },
            {
              internalType: 'bool',
              name: 'exists',
              type: 'bool',
            },
          ],
          internalType: 'struct TeacherManagement.Course',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_courseID',
          type: 'uint256',
        },
      ],
      name: 'getCourseTeacher',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_teacherAddress',
          type: 'address',
        },
      ],
      name: 'getTeacher',
      outputs: [
        {
          components: [
            {
              internalType: 'address',
              name: 'key',
              type: 'address',
            },
            {
              internalType: 'uint16',
              name: 'class',
              type: 'uint16',
            },
            {
              internalType: 'bool',
              name: 'exists',
              type: 'bool',
            },
          ],
          internalType: 'struct TeacherManagement.Teacher',
          name: '',
          type: 'tuple',
        },
        {
          internalType: 'uint256[]',
          name: '',
          type: 'uint256[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_teacherAddress',
          type: 'address',
        },
      ],
      name: 'getTotalCoursesByTeacher',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getTotalTeachers',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'isPaused',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'pause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'reentryTest',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_teacherAddress',
          type: 'address',
        },
        {
          internalType: 'uint256[]',
          name: '_courses',
          type: 'uint256[]',
        },
        {
          internalType: 'uint16[]',
          name: '_classes',
          type: 'uint16[]',
        },
        {
          internalType: 'uint8[]',
          name: '_modules',
          type: 'uint8[]',
        },
      ],
      name: 'registerCourse',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: '_teachers',
          type: 'address[]',
        },
        {
          internalType: 'uint16[]',
          name: '_classes',
          type: 'uint16[]',
        },
      ],
      name: 'registerTeachers',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'studentContract',
      outputs: [
        {
          internalType: 'contract IStudentManagement',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'unpause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_newStudentContractAddress',
          type: 'address',
        },
      ],
      name: 'updateStudentContract',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_teacherAddress',
          type: 'address',
        },
        {
          internalType: 'uint16',
          name: '_newClassID',
          type: 'uint16',
        },
      ],
      name: 'updateTeacher',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};

export default teacherManagement;
