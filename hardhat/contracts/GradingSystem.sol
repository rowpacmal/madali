// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./AccessControl.sol";
import "./interfaces/IStudentManagement.sol";
import "./interfaces/ITeacherManagement.sol";

contract GradingSystem is AccessControl {
    /** Enums */
    enum UserRole {
        Admin,
        Teacher,
        Student,
        Unauthorized
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

    modifier onlyAuthorizedTeacher(address _teacherAddress) {
        bool isTeacherAndSelf = teacherContract.doesTeacherExist(msg.sender) &&
            msg.sender == _teacherAddress;
        bool isOwner = msg.sender == owner();

        if (!isTeacherAndSelf && !isOwner) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    modifier provideGrades(uint8[] memory _grades) {
        if (_grades.length == 0) {
            revert NoGradesProvided();
        }
        _;
    }

    modifier provideStudents(address[] memory _students) {
        if (_students.length == 0) {
            revert NoStudentsProvided();
        }
        _;
    }

    modifier requireAssignedGrade(uint256 _gradeID) {
        if (!grades[_gradeID].exists) {
            revert GradeNotFound(_gradeID);
        }
        _;
    }

    /** Management Functions */
    // Grade
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
        if (_students.length != _grades.length) {
            revert StudentsGradesLengthMismatch(
                _students.length,
                _grades.length
            );
        }

        for (uint256 i; i < _students.length; ++i) {
            address _studentAddress = _students[i];

            if (_studentAddress == address(0)) {
                emit GradeAdditionFailed_ZeroAddress();

                continue;
            }

            if (!studentContract.doesStudentExist(_studentAddress)) {
                emit GradeAdditionFailed_StudentNotFound(_studentAddress);

                continue;
            }

            uint256 _gradeID = gradeIDCounter;
            ++gradeIDCounter;

            grades[_gradeID] = Grade({
                student: _studentAddress,
                teacher: msg.sender,
                course: _courseID,
                id: _gradeID,
                module: _module,
                grade: _grades[i],
                exists: true
            });

            gradeID[_studentAddress].push(_gradeID);
            gradeIndex[_gradeID] = gradeID[_studentAddress].length - 1;

            emit GradeAdded(_studentAddress, _gradeID);
        }
    }

    function deleteGrade(
        uint256 _gradeID
    )
        external
        onlyOwner
        whenNotPaused
        whenNotLocked
        requireAssignedGrade(_gradeID)
    {
        address _studentAddress = grades[_gradeID].student;

        delete grades[_gradeID];

        uint256 _lastGradeID = gradeID[_studentAddress][
            gradeID[_studentAddress].length - 1
        ];
        uint256 _gradeIndex = gradeIndex[_gradeID];

        gradeIndex[_lastGradeID] = _gradeIndex;
        gradeID[_studentAddress][_gradeIndex] = _lastGradeID;
        gradeID[_studentAddress].pop();

        delete gradeIndex[_gradeID];

        emit GradeDeleted(_studentAddress, _gradeID);
    }

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
        Grade storage _gradeToUpdate = grades[_gradeID];
        uint8 _oldGrade = _gradeToUpdate.grade;

        _gradeToUpdate.grade = _newGrade;

        emit GradeUpdated(_gradeID, _oldGrade, _newGrade);
    }

    /** Getter Functions */
    // Grade
    function getAllGradesByStudent(
        address _studentAddress
    )
        external
        view
        onlyAuthorizedStudent(_studentAddress)
        validAddress(_studentAddress)
        returns (uint256[] memory)
    {
        return gradeID[_studentAddress];
    }

    function getGrade(
        uint256 _gradeID
    )
        external
        view
        onlyAuthorizedStudent(grades[_gradeID].student)
        requireAssignedGrade(_gradeID)
        returns (Grade memory)
    {
        return grades[_gradeID];
    }

    function getTotalGradesByStudent(
        address _studentAddress
    )
        external
        view
        onlyAuthorizedStudent(_studentAddress)
        validAddress(_studentAddress)
        returns (uint256)
    {
        return gradeID[_studentAddress].length;
    }

    // User Role
    function getUserRole() external view returns (UserRole) {
        UserRole _userRole;

        if (owner() == msg.sender) {
            _userRole = UserRole.Admin;
        } else if (teacherContract.doesTeacherExist(msg.sender)) {
            _userRole = UserRole.Teacher;
        } else if (studentContract.doesStudentExist(msg.sender)) {
            _userRole = UserRole.Student;
        } else {
            _userRole = UserRole.Unauthorized;
        }

        return _userRole;
    }

    /** Injection Functions */
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
    function doesGradeExist(uint256 _gradeID) external view returns (bool) {
        return grades[_gradeID].exists;
    }
}
