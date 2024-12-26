// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Import custom AccessControl contract, and the student and teacher contract interfaces.
import "./AccessControl.sol";
import "./interfaces/IStudentManagement.sol";
import "./interfaces/ITeacherManagement.sol";

contract GradingSystem is AccessControl {
    /** Enums */
    enum UserRole {
        Unauthorized,
        Student,
        Teacher,
        Admin
    }

    /** Structs */
    struct Grade {
        address student;
        address teacher;
        uint256 course;
        uint256 id;
        uint8 module;
        uint8 grade;
        bool exists;
    }

    /** State Variables */
    IStudentManagement public studentContract;
    ITeacherManagement public teacherContract;
    uint256 private gradeIDCounter;
    mapping(address => uint256[]) private gradeID;
    mapping(uint256 => uint256) private gradeIndex;
    mapping(uint256 => Grade) private grades;

    /** Events */
    event GradeAdded(address indexed student, uint256 indexed grade);
    event GradeDeleted(address indexed student, uint256 indexed grade);
    event GradeUpdated(
        uint256 indexed grade,
        uint8 indexed assignedGrade,
        uint8 indexed newAssignedGrade
    );
    event GradeAdditionFailed_StudentNotFound(address indexed student);
    event GradeAdditionFailed_ZeroAddress();

    /** Errors */
    error CourseNotFound(uint256 course);
    error GradeAlreadyAssigned(uint256 course, uint8 module);
    error GradeNotFound(uint256 grade);
    error NoGradesProvided();
    error NoStudentsProvided();
    error StudentsGradesLengthMismatch(
        uint256 studentsLength,
        uint256 gradesLength
    );
    error UnauthorizedAccount(address caller);

    /** Constructor */
    constructor(
        address _studentContractAddress,
        address _teacherContractAddress
    ) {
        studentContract = IStudentManagement(_studentContractAddress);
        teacherContract = ITeacherManagement(_teacherContractAddress);
    }

    /** Modifiers */
    // This modifier is used to check if the caller is an authorized student. (Not used , and may be deprecated.)
    modifier onlyAuthorizedStudent(address _studentAddress) {
        bool isStudentAndSelf = studentContract.doesStudentExist(msg.sender) &&
            msg.sender == _studentAddress;
        bool isTeacher = teacherContract.doesTeacherExist(msg.sender);
        bool isOwner = msg.sender == owner();

        if (!isStudentAndSelf && !isTeacher && !isOwner) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    // This modifier is used to check if the caller is an authorized teacher.
    modifier onlyAuthorizedTeacher(address _teacherAddress) {
        bool isTeacherAndSelf = teacherContract.doesTeacherExist(msg.sender) &&
            msg.sender == _teacherAddress;
        bool isOwner = msg.sender == owner();

        if (!isTeacherAndSelf && !isOwner) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    // This modifier is used to check if provided grades is not empty.
    modifier provideGrades(uint8[] memory _grades) {
        if (_grades.length == 0) {
            revert NoGradesProvided();
        }
        _;
    }

    // This modifier is used to check if provided students is not empty.
    modifier provideStudents(address[] memory _students) {
        if (_students.length == 0) {
            revert NoStudentsProvided();
        }
        _;
    }

    // This modifier is used to check if a grade is already assigned/exists.
    modifier requireAssignedGrade(uint256 _gradeID) {
        if (!grades[_gradeID].exists) {
            revert GradeNotFound(_gradeID);
        }
        _;
    }

    /** Management Functions */
    // This function is used to add grades to students.
    function addGrades(
        address[] memory _students,
        uint8[] memory _grades,
        uint256 _courseID,
        uint8 _module
    )
        external
        onlyAuthorizedTeacher(teacherContract.getCourseTeacher(_courseID))
        whenNotPaused
        whenNotLocked
        provideStudents(_students)
        provideGrades(_grades)
    {
        // Check if the number of students and grades provided are the same length.
        if (_students.length != _grades.length) {
            revert StudentsGradesLengthMismatch(
                _students.length,
                _grades.length
            );
        }

        // Loop through and add the grades.
        for (uint256 i; i < _students.length; ++i) {
            address _studentAddress = _students[i];

            // Check if the student address is not a zero address.
            if (_studentAddress == address(0)) {
                emit GradeAdditionFailed_ZeroAddress();

                continue;
            }

            // Check if the student exists.
            if (!studentContract.doesStudentExist(_studentAddress)) {
                emit GradeAdditionFailed_StudentNotFound(_studentAddress);

                continue;
            }

            // Get the current grade ID and then increment it.
            uint256 _gradeID = gradeIDCounter;
            ++gradeIDCounter;

            // Add the grade.
            grades[_gradeID] = Grade({
                student: _studentAddress,
                teacher: msg.sender,
                course: _courseID,
                id: _gradeID,
                module: _module,
                grade: _grades[i],
                exists: true
            });

            // Add the grade ID to the student's list of grades.
            gradeID[_studentAddress].push(_gradeID);
            gradeIndex[_gradeID] = gradeID[_studentAddress].length - 1;

            // Emit the event.
            emit GradeAdded(_studentAddress, _gradeID);
        }
    }

    // This function is used to delete a grade.
    function deleteGrade(
        uint256 _gradeID
    )
        external
        onlyOwner
        whenNotPaused
        whenNotLocked
        requireAssignedGrade(_gradeID)
    {
        // Get the student address.
        address _studentAddress = grades[_gradeID].student;

        // Delete the grade.
        delete grades[_gradeID];

        // Remove the grade ID from the student's list of grades.
        uint256 _lastGradeID = gradeID[_studentAddress][
            gradeID[_studentAddress].length - 1
        ];
        uint256 _gradeIndex = gradeIndex[_gradeID];

        gradeIndex[_lastGradeID] = _gradeIndex;
        gradeID[_studentAddress][_gradeIndex] = _lastGradeID;
        gradeID[_studentAddress].pop();

        // Delete the grade index.
        delete gradeIndex[_gradeID];

        // Emit the event.
        emit GradeDeleted(_studentAddress, _gradeID);
    }

    // This function is used to update a grade.
    function updateGrade(
        uint256 _gradeID,
        uint8 _newGrade
    )
        external
        onlyAuthorizedTeacher(
            teacherContract.getCourseTeacher(grades[_gradeID].course)
        )
        whenNotPaused
        whenNotLocked
    {
        // Update the grade.
        Grade storage _gradeToUpdate = grades[_gradeID];
        uint8 _oldGrade = _gradeToUpdate.grade;

        _gradeToUpdate.grade = _newGrade;

        // Emit the event.
        emit GradeUpdated(_gradeID, _oldGrade, _newGrade);
    }

    /** Getter Functions */
    // These functions are used to get information from the contract.
    // This function is used to get all the grades by a student.
    function getAllGradesByStudent(
        address _studentAddress
    ) external view validAddress(_studentAddress) returns (uint256[] memory) {
        return gradeID[_studentAddress];
    }

    // This function is used to get a grade.
    function getGrade(
        uint256 _gradeID
    ) external view requireAssignedGrade(_gradeID) returns (Grade memory) {
        return grades[_gradeID];
    }

    // This function is used to get the total number of grades by a student.
    function getTotalGradesByStudent(
        address _studentAddress
    ) external view validAddress(_studentAddress) returns (uint256) {
        return gradeID[_studentAddress].length;
    }

    /** Utility Functions */
    // This function is used to get the role of a user. (Would like to make this deprecated, and use a better system in the future.)
    function getUserRole(
        address _userAddress
    ) external view returns (address, UserRole) {
        UserRole _userRole = UserRole.Unauthorized;

        if (_userAddress == address(0)) {
            return (msg.sender, _userRole);
        }

        if (_userAddress != msg.sender) {
            return (msg.sender, _userRole);
        }

        if (owner() == msg.sender) {
            _userRole = UserRole.Admin;
        }

        if (teacherContract.doesTeacherExist(msg.sender)) {
            _userRole = UserRole.Teacher;
        }

        if (studentContract.doesStudentExist(msg.sender)) {
            _userRole = UserRole.Student;
        }

        return (msg.sender, _userRole);
    }

    /** Injection Functions */
    // This function is used to update the student and teacher contracts.
    function updateStudentAndTeacherContracts(
        address _newStudentContractAddress,
        address _newTeacherContractAddress
    )
        external
        onlyOwner
        validAddress(_newStudentContractAddress)
        validAddress(_newTeacherContractAddress)
    {
        studentContract = IStudentManagement(_newStudentContractAddress);
        teacherContract = ITeacherManagement(_newTeacherContractAddress);
    }

    /** Interface Functions */
    // These functions are used to check if a grade exists in the contract from outside.
    function doesGradeExist(uint256 _gradeID) external view returns (bool) {
        return grades[_gradeID].exists;
    }
}
