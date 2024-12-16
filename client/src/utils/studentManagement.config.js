const studentManagement = {
  name: 'StudentManagement',
  address: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be',
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
      name: 'NoClassesToDelete',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoStudentsProvided',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NoStudentsToDelete',
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
          internalType: 'address',
          name: 'student',
          type: 'address',
        },
      ],
      name: 'StudentNotFound',
      type: 'error',
    },
    {
      inputs: [],
      name: 'TeacherContractNotFound',
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
      inputs: [
        {
          indexed: true,
          internalType: 'uint16',
          name: 'classID',
          type: 'uint16',
        },
      ],
      name: 'ClassAdditionFailed_AlreadyExists',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint16',
          name: 'classID',
          type: 'uint16',
        },
      ],
      name: 'ClassCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint16',
          name: 'classID',
          type: 'uint16',
        },
      ],
      name: 'ClassDeleted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint16',
          name: 'classID',
          type: 'uint16',
        },
      ],
      name: 'ClassDeletionFailed_NotFound',
      type: 'event',
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
          name: 'student',
          type: 'address',
        },
      ],
      name: 'StudentAdditionFailed_AlreadyExists',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'StudentAdditionFailed_ZeroAddress',
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
      name: 'StudentDeleted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'StudentDeletionFailed_NoStudentsToDelete',
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
          internalType: 'uint16',
          name: 'classID',
          type: 'uint16',
        },
      ],
      name: 'StudentDeletionFailed_NotEnrolledInClass',
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
      name: 'StudentDeletionFailed_NotFound',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'StudentDeletionFailed_ZeroAddress',
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
      name: 'StudentRegistered',
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
      name: 'StudentUpdated',
      type: 'event',
    },
    {
      stateMutability: 'nonpayable',
      type: 'fallback',
    },
    {
      inputs: [
        {
          internalType: 'uint16[]',
          name: '_classes',
          type: 'uint16[]',
        },
      ],
      name: 'addClass',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint16[]',
          name: '_classes',
          type: 'uint16[]',
        },
      ],
      name: 'deleteClasses',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: '_students',
          type: 'address[]',
        },
        {
          internalType: 'uint16',
          name: '_classID',
          type: 'uint16',
        },
      ],
      name: 'deleteStudents',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint16',
          name: '_classID',
          type: 'uint16',
        },
      ],
      name: 'doesClassExist',
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
      name: 'doesStudentExist',
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
      name: 'getAllClasses',
      outputs: [
        {
          internalType: 'uint16[]',
          name: '',
          type: 'uint16[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint16',
          name: '_classID',
          type: 'uint16',
        },
      ],
      name: 'getAllStudents',
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
          internalType: 'address',
          name: '_studentAddress',
          type: 'address',
        },
      ],
      name: 'getStudent',
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
          internalType: 'struct StudentManagement.Student',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getTotalClasses',
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
          internalType: 'uint16',
          name: '_classID',
          type: 'uint16',
        },
      ],
      name: 'getTotalStudents',
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
          internalType: 'address[]',
          name: '_students',
          type: 'address[]',
        },
        {
          internalType: 'uint16',
          name: '_classID',
          type: 'uint16',
        },
      ],
      name: 'registerStudents',
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
          internalType: 'address',
          name: '_studentAddress',
          type: 'address',
        },
        {
          internalType: 'uint16',
          name: '_oldClassID',
          type: 'uint16',
        },
        {
          internalType: 'uint16',
          name: '_newClassID',
          type: 'uint16',
        },
      ],
      name: 'updateStudent',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_newTeacherContractAddress',
          type: 'address',
        },
      ],
      name: 'updateTeacherContract',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};

export default studentManagement;
