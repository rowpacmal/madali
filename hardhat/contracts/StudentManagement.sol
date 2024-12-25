// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Import custom AccessControl contract, and the teacher management contract interface.
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
    // This modifier is used to check if the caller is an student. (Not used , and may be deprecated.)
    modifier onlyStudent() {
        bool isStudent = students[msg.sender].exists;
        bool isTeacher = teacherContract.doesTeacherExist(msg.sender);
        bool isAdmin = msg.sender == owner();

        if (!isStudent && !isTeacher && !isAdmin) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    // This modifier is used to check if the caller is an teacher.
    modifier onlyTeacher() {
        bool isTeacher = teacherContract.doesTeacherExist(msg.sender);
        bool isAdmin = msg.sender == owner();

        if (!isTeacher && !isAdmin) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    // This modifier is used to check if provided classes not empty.
    modifier provideClasses(uint16[] memory _classes) {
        if (_classes.length == 0) {
            revert NoClassesProvided();
        }
        _;
    }

    // This modifier is used to check if provided students not empty.
    modifier provideStudents(address[] memory _students) {
        if (_students.length == 0) {
            revert NoStudentsProvided();
        }
        _;
    }

    /** Management Functions */
    // This function is used to delete students from the contract in batch.
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
        // Check if there is no students to delete.
        if (studentKeys[_classID].length == 0) {
            revert NoStudentsToDelete();
        }

        // Call the batch delete students function.
        batchDeleteStudents(_students, _classID);
    }

    // This function is used to register students to the contract in batch.
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
        // Loop through and register the students.
        for (uint256 i; i < _students.length; ++i) {
            address _studentAddress = _students[i];

            // Check if the student address is not a zero address.
            if (_studentAddress == address(0)) {
                emit StudentAdditionFailed_ZeroAddress();

                continue;
            }

            // Check if the student already exists.
            if (students[_studentAddress].exists) {
                emit StudentAdditionFailed_AlreadyExists(_studentAddress);

                continue;
            }

            // Register the student.
            students[_studentAddress] = Student({
                key: _studentAddress,
                exists: true,
                class: _classID
            });

            // Add the student to the students array.
            studentKeys[_classID].push(_studentAddress);
            studentIndex[_studentAddress] = studentKeys[_classID].length - 1;

            // Emit the student registered event.
            emit StudentRegistered(_studentAddress);
        }
    }

    // This function is used to update a student.
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
        // Check if the student exists.
        if (!students[_studentAddress].exists) {
            revert StudentNotFound(_studentAddress);
        }

        // Update the student's class.
        students[_studentAddress].class = _newClassID;

        // Update the students array.
        address _lastStudentKey = studentKeys[_oldClassID][
            studentKeys[_oldClassID].length - 1
        ];
        uint256 _studentIndex = studentIndex[_studentAddress];

        studentIndex[_lastStudentKey] = _studentIndex;
        studentKeys[_oldClassID][_studentIndex] = _lastStudentKey;
        studentKeys[_oldClassID].pop();

        studentKeys[_newClassID].push(_studentAddress);
        studentIndex[_studentAddress] = studentKeys[_newClassID].length - 1;

        // Emit the student updated event.
        emit StudentUpdated(_studentAddress);
    }

    // This function is used to add classes to the contract in batch.
    function addClass(
        uint16[] memory _classes
    ) external onlyOwner whenNotPaused whenNotLocked provideClasses(_classes) {
        // Loop through and add the classes.
        for (uint256 i = 0; i < _classes.length; ++i) {
            uint16 _classID = _classes[i];

            // Check if the class already exists.
            if (classes[_classID].exists) {
                emit ClassAdditionFailed_AlreadyExists(_classID);

                continue;
            }

            // Add the class.
            Class storage _newClass = classes[_classID];
            _newClass.id = _classID;
            _newClass.exists = true;

            // Add the class to the classes array.
            classID.push(_classID);
            classIndex[_classID] = classID.length - 1;

            // Emit the class created event.
            emit ClassCreated(_classID);
        }
    }

    // This function is used to delete classes from the contract in batch.
    function deleteClasses(
        uint16[] memory _classes
    ) external onlyOwner whenNotPaused whenNotLocked provideClasses(_classes) {
        // Check if there is no classes to delete.
        if (classID.length == 0) {
            revert NoClassesToDelete();
        }

        // Loop through and delete the classes.
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

            // Delete class index from the classIndex array.
            delete classIndex[_classID];

            // Check if there are any students to delete in the class.
            if (studentKeys[_classID].length == 0) {
                emit StudentDeletionFailed_NoStudentsToDelete();
            } else {
                // Call the batch delete students function.
                batchDeleteStudents(studentKeys[_classID], _classID);
            }

            delete studentKeys[_classID];

            // Emit the class deleted event.
            emit ClassDeleted(_classID);
        }
    }

    /** Getter Functions */
    // These functions are used to get data from the contract.
    // For classes.
    function getAllClasses() external view returns (uint16[] memory) {
        return classID;
    }

    function getTotalClasses() external view returns (uint256) {
        return classID.length;
    }

    // For students.
    function getAllStudents(
        uint16 _classID
    ) external view returns (address[] memory) {
        return studentKeys[_classID];
    }

    function getStudent(
        address _studentAddress
    ) external view validAddress(_studentAddress) returns (Student memory) {
        return (students[_studentAddress]);
    }

    function getTotalStudents(uint16 _classID) external view returns (uint256) {
        return studentKeys[_classID].length;
    }

    /** Utility Functions */
    // This function is used to delete students from the contract in batch.
    function batchDeleteStudents(
        address[] memory _students,
        uint16 _classID
    ) private {
        // Loop through and delete the students.
        for (uint256 i = 0; i < _students.length; ++i) {
            address _studentAddress = _students[i];

            // Check if the student address is not a zero address.
            if (_studentAddress == address(0)) {
                emit StudentDeletionFailed_ZeroAddress();

                continue;
            }

            // Check if the student exists.
            if (!students[_studentAddress].exists) {
                emit StudentDeletionFailed_NotFound(_studentAddress);

                continue;
            }

            // Check if the student is enrolled in the class.
            if (students[_studentAddress].class != _classID) {
                emit StudentDeletionFailed_NotEnrolledInClass(
                    _studentAddress,
                    _classID
                );

                continue;
            }

            // Delete student data.
            delete students[_studentAddress];

            // Delete student from the students array.
            address _lastStudentKey = studentKeys[_classID][
                studentKeys[_classID].length - 1
            ];
            uint256 _studentIndex = studentIndex[_studentAddress];

            studentIndex[_lastStudentKey] = _studentIndex;
            studentKeys[_classID][_studentIndex] = _lastStudentKey;
            studentKeys[_classID].pop();

            // Delete student index from the studentIndex array.
            delete studentIndex[_studentAddress];

            // Emit the student deleted event.
            emit StudentDeleted(_studentAddress);
        }
    }

    /** Injection Functions */
    // This function is used to update the teacher contract address.
    function updateTeacherContract(
        address _newTeacherContractAddress
    ) external onlyOwner validAddress(_newTeacherContractAddress) {
        teacherContract = ITeacherManagement(_newTeacherContractAddress);
    }

    /** Interface Functions */
    // These functions are used to check if a class or student exists in the contract from outside. (May be deprecated, but are still used for now.)
    function doesClassExist(uint16 _classID) external view returns (bool) {
        return classes[_classID].exists;
    }

    function doesStudentExist(
        address _studentAddress
    ) external view returns (bool) {
        return students[_studentAddress].exists;
    }
}
