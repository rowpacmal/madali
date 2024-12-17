const gradingSystem = {
  name: 'GradingSystem',
  address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_studentContractAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_teacherContractAddress',
          type: 'address',
        },
      ],
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
          name: 'course',
          type: 'uint256',
        },
        {
          internalType: 'uint8',
          name: 'module',
          type: 'uint8',
        },
      ],
      name: 'GradeAlreadyAssigned',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'grade',
          type: 'uint256',
        },
      ],
      name: 'GradeNotFound',
      type: 'error',
    },
    {
      inputs: [],
      name: 'InvalidFunctionCall',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoGradesProvided',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoStudentsProvided',
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
      inputs: [
        {
          internalType: 'uint256',
          name: 'studentsLength',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'gradesLength',
          type: 'uint256',
        },
      ],
      name: 'StudentsGradesLengthMismatch',
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
          internalType: 'address',
          name: 'student',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'grade',
          type: 'uint256',
        },
      ],
      name: 'GradeAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'student',
          type: 'address',
        },
      ],
      name: 'GradeAdditionFailed_StudentNotFound',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'GradeAdditionFailed_ZeroAddress',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'student',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'grade',
          type: 'uint256',
        },
      ],
      name: 'GradeDeleted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'grade',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint8',
          name: 'assignedGrade',
          type: 'uint8',
        },
        {
          indexed: true,
          internalType: 'uint8',
          name: 'newAssignedGrade',
          type: 'uint8',
        },
      ],
      name: 'GradeUpdated',
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
      stateMutability: 'nonpayable',
      type: 'fallback',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: '_students',
          type: 'address[]',
        },
        {
          internalType: 'uint8[]',
          name: '_grades',
          type: 'uint8[]',
        },
        {
          internalType: 'uint256',
          name: '_courseID',
          type: 'uint256',
        },
        {
          internalType: 'uint8',
          name: '_module',
          type: 'uint8',
        },
      ],
      name: 'addGrades',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_gradeID',
          type: 'uint256',
        },
      ],
      name: 'deleteGrade',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_gradeID',
          type: 'uint256',
        },
      ],
      name: 'doesGradeExist',
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
          name: '_studentAddress',
          type: 'address',
        },
      ],
      name: 'getAllGradesByStudent',
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
      inputs: [
        {
          internalType: 'uint256',
          name: '_gradeID',
          type: 'uint256',
        },
      ],
      name: 'getGrade',
      outputs: [
        {
          components: [
            {
              internalType: 'address',
              name: 'student',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'teacher',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'course',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'module',
              type: 'uint8',
            },
            {
              internalType: 'uint8',
              name: 'grade',
              type: 'uint8',
            },
            {
              internalType: 'bool',
              name: 'exists',
              type: 'bool',
            },
          ],
          internalType: 'struct GradingSystem.Grade',
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
          internalType: 'address',
          name: '_studentAddress',
          type: 'address',
        },
      ],
      name: 'getTotalGradesByStudent',
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
      inputs: [
        {
          internalType: 'address',
          name: '_userAddress',
          type: 'address',
        },
      ],
      name: 'getUserRole',
      outputs: [
        {
          internalType: 'enum GradingSystem.UserRole',
          name: '',
          type: 'uint8',
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
      inputs: [],
      name: 'teacherContract',
      outputs: [
        {
          internalType: 'contract ITeacherManagement',
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
          internalType: 'uint256',
          name: '_gradeID',
          type: 'uint256',
        },
        {
          internalType: 'uint8',
          name: '_newGrade',
          type: 'uint8',
        },
      ],
      name: 'updateGrade',
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
        {
          internalType: 'address',
          name: '_newTeacherContractAddress',
          type: 'address',
        },
      ],
      name: 'updateStudentAndTeacherContracts',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};

export default gradingSystem;
