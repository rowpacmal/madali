// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./AccessControl.sol";
import "./interfaces/ITeacherManagement.sol";

contract StudentManagement is AccessControl {
    /** Structs */
    struct Class {
        uint16 id;
        bool exists;
    }

    struct Student {
        address key;
        uint16 class;
        bool exists;
    }

    /** State Variables */
    ITeacherManagement public teacherContract;
    uint16[] private classID;
    mapping(uint16 => Class) private classes;
    mapping(uint16 => uint256) private classIndex;
    mapping(address => uint256) private studentIndex;
    mapping(uint16 => address[]) private studentKeys;
    mapping(address => Student) private students;

    /** Events */
    event ClassAdditionFailed_AlreadyExists(uint16 indexed classID);
    event ClassCreated(uint16 indexed classID);
    event ClassDeleted(uint16 indexed classID);
    event ClassDeletionFailed_NotFound(uint16 indexed classID);
    event StudentAdditionFailed_AlreadyExists(address indexed student);
    event StudentAdditionFailed_ZeroAddress();
    event StudentDeleted(address indexed student);
    event StudentDeletionFailed_NotFound(address indexed student);
    event StudentDeletionFailed_NotEnrolledInClass(
        address indexed student,
        uint16 indexed classID
    );
    event StudentDeletionFailed_NoStudentsToDelete();
    event StudentDeletionFailed_ZeroAddress();
    event StudentRegistered(address indexed student);
    event StudentUpdated(address indexed student);

    /** Errors */
    error NoClassesProvided();
    error NoClassesToDelete();
    error NoStudentsProvided();
    error NoStudentsToDelete();
    error StudentNotFound(address student);
    error TeacherContractNotFound();
    error UnauthorizedAccount(address caller);

    /** Constructor */
    constructor() {
        // Set the initial TeacherManagement address to 0
        teacherContract = ITeacherManagement(address(0));
    }

    /** Modifiers */
    modifier onlyStudent() {
        bool isStudent = students[msg.sender].exists;
        bool isTeacher = teacherContract.doesTeacherExist(msg.sender);
        bool isAdmin = msg.sender == owner();

        if (!isStudent && !isTeacher && !isAdmin) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    modifier onlyTeacher() {
        bool isTeacher = teacherContract.doesTeacherExist(msg.sender);
        bool isAdmin = msg.sender == owner();

        if (!isTeacher && !isAdmin) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    modifier provideClasses(uint16[] memory _classes) {
        if (_classes.length == 0) {
            revert NoClassesProvided();
        }
        _;
    }

    modifier provideStudents(address[] memory _students) {
        if (_students.length == 0) {
            revert NoStudentsProvided();
        }
        _;
    }

    /** Management Functions */
    // Students
    function deleteStudents(
        address[] memory _students,
        uint16 _classID
    )
        external
        onlyOwner
        whenNotPaused
        whenNotLocked
        provideStudents(_students)
    {
        if (studentKeys[_classID].length == 0) {
            revert NoStudentsToDelete();
        }

        batchDeleteStudents(_students, _classID);
    }

    function registerStudents(
        address[] memory _students,
        uint16 _classID
    )
        external
        onlyOwner
        whenNotPaused
        whenNotLocked
        provideStudents(_students)
    {
        for (uint256 i; i < _students.length; ++i) {
            address _studentAddress = _students[i];

            if (_studentAddress == address(0)) {
                emit StudentAdditionFailed_ZeroAddress();

                continue;
            }

            if (students[_studentAddress].exists) {
                emit StudentAdditionFailed_AlreadyExists(_studentAddress);

                continue;
            }

            students[_studentAddress] = Student({
                key: _studentAddress,
                exists: true,
                class: _classID
            });

            studentKeys[_classID].push(_studentAddress);
            studentIndex[_studentAddress] = studentKeys[_classID].length - 1;

            emit StudentRegistered(_studentAddress);
        }
    }

    function updateStudent(
        address _studentAddress,
        uint16 _oldClassID,
        uint16 _newClassID
    )
        external
        onlyTeacher
        whenNotPaused
        whenNotLocked
        validAddress(_studentAddress)
    {
        if (!students[_studentAddress].exists) {
            revert StudentNotFound(_studentAddress);
        }

        students[_studentAddress].class = _newClassID;

        address _lastStudentKey = studentKeys[_oldClassID][
            studentKeys[_oldClassID].length - 1
        ];
        uint256 _studentIndex = studentIndex[_studentAddress];

        studentIndex[_lastStudentKey] = _studentIndex;
        studentKeys[_oldClassID][_studentIndex] = _lastStudentKey;
        studentKeys[_oldClassID].pop();

        studentKeys[_newClassID].push(_studentAddress);
        studentIndex[_studentAddress] = studentKeys[_newClassID].length - 1;

        emit StudentUpdated(_studentAddress);
    }

    // Class
    function addClass(
        uint16[] memory _classes
    ) external onlyOwner whenNotPaused whenNotLocked provideClasses(_classes) {
        for (uint256 i = 0; i < _classes.length; ++i) {
            uint16 _classID = _classes[i];

            if (classes[_classID].exists) {
                emit ClassAdditionFailed_AlreadyExists(_classID);

                continue;
            }

            Class storage _newClass = classes[_classID];
            _newClass.id = _classID;
            _newClass.exists = true;

            classID.push(_classID);
            classIndex[_classID] = classID.length - 1;

            emit ClassCreated(_classID);
        }
    }

    function deleteClasses(
        uint16[] memory _classes
    ) external onlyOwner whenNotPaused whenNotLocked provideClasses(_classes) {
        if (classID.length == 0) {
            revert NoClassesToDelete();
        }

        for (uint256 i = 0; i < _classes.length; ++i) {
            uint16 _classID = _classes[i];

            if (!classes[_classID].exists) {
                emit ClassDeletionFailed_NotFound(_classID);

                continue;
            }

            // Delete class data.
            delete classes[_classID];

            // Delete class id from the classID array.
            uint256 _classIndex = classIndex[_classID];
            uint16 _lastClassID = classID[classID.length - 1];

            classIndex[_lastClassID] = _classIndex;
            classID[_classIndex] = _lastClassID;
            classID.pop();

            delete classIndex[_classID];

            // Delete all student data from the class.
            if (studentKeys[_classID].length == 0) {
                emit StudentDeletionFailed_NoStudentsToDelete();
            } else {
                batchDeleteStudents(studentKeys[_classID], _classID);
            }

            delete studentKeys[_classID];

            emit ClassDeleted(_classID);
        }
    }

    /** Getter Functions */
    // Course
    function getAllClasses()
        external
        view
        onlyStudent
        returns (uint16[] memory)
    {
        return classID;
    }

    function getTotalClasses() external view onlyStudent returns (uint256) {
        return classID.length;
    }

    // Student
    function getAllStudents(
        uint16 _classID
    ) external view onlyStudent returns (address[] memory) {
        return studentKeys[_classID];
    }

    function getStudent(
        address _studentAddress
    )
        external
        view
        onlyStudent
        validAddress(_studentAddress)
        returns (Student memory)
    {
        return (students[_studentAddress]);
    }

    function getTotalStudents(
        uint16 _classID
    ) external view onlyStudent returns (uint256) {
        return studentKeys[_classID].length;
    }

    /** Utility Functions */
    function batchDeleteStudents(
        address[] memory _students,
        uint16 _classID
    ) private {
        for (uint256 i = 0; i < _students.length; ++i) {
            address _studentAddress = _students[i];

            if (_studentAddress == address(0)) {
                emit StudentDeletionFailed_ZeroAddress();

                continue;
            }

            if (!students[_studentAddress].exists) {
                emit StudentDeletionFailed_NotFound(_studentAddress);

                continue;
            }

            if (students[_studentAddress].class != _classID) {
                emit StudentDeletionFailed_NotEnrolledInClass(
                    _studentAddress,
                    _classID
                );

                continue;
            }

            delete students[_studentAddress];

            address _lastStudentKey = studentKeys[_classID][
                studentKeys[_classID].length - 1
            ];
            uint256 _studentIndex = studentIndex[_studentAddress];

            studentIndex[_lastStudentKey] = _studentIndex;
            studentKeys[_classID][_studentIndex] = _lastStudentKey;
            studentKeys[_classID].pop();

            delete studentIndex[_studentAddress];

            emit StudentDeleted(_studentAddress);
        }
    }

    /** Injection Functions */
    function updateTeacherContract(
        address _newTeacherContractAddress
    ) external onlyOwner validAddress(_newTeacherContractAddress) {
        teacherContract = ITeacherManagement(_newTeacherContractAddress);
    }

    /** Interface Functions */
    function doesClassExist(uint16 _classID) external view returns (bool) {
        return classes[_classID].exists;
    }

    function doesStudentExist(
        address _studentAddress
    ) external view returns (bool) {
        return students[_studentAddress].exists;
    }
}
