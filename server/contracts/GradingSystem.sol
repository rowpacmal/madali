// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./AccessControl.sol";
import "./interfaces/IStudentManagement.sol";
import "./interfaces/ITeacherManagement.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GradingSystem is AccessControl, ERC721 {
    /** Usings */
    using Counters for Counters.Counter;

    /** Enums */
    enum UserRole {
        Admin,
        Teacher,
        Student,
        Unauthorized
    }

    /** Structs */
    struct Certificate {
        address owner;
        string imageURL;
        uint256 grade;
        uint256 id;
        bool exists;
    }

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
    Counters.Counter private gradeIDCounter;
    Counters.Counter private certificateIDCounter;
    IStudentManagement private studentContract;
    ITeacherManagement private teacherContract;
    mapping(uint256 => Certificate) private certificates;
    mapping(address => uint256[]) private gradeID;
    mapping(uint256 => uint256) private gradeIndex;
    mapping(uint256 => Grade) private grades;

    /** Events */
    event GradeAdditionFailed_StudentNotFound(address indexed student);
    event GradeAdditionFailed_ZeroAddress();

    /** Errors */
    error CertificateNotFound(uint256 certificate);
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
    ) ERC721("MadaliCertificate", "MDLC") {
        // Set the initial StudentManagement and TeacherManagement address to 0
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

    modifier requireAssignedCertificate(uint256 _certificateID) {
        if (!certificates[_certificateID].exists) {
            revert CertificateNotFound(_certificateID);
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

        if (!teacherContract.doesCourseExist(_courseID)) {
            revert CourseNotFound(_courseID);
        }

        for (uint256 i; i < _students.length; ++i) {
            address _studentAddress = _students[i];
            uint8 _studentGrade = _grades[i];

            if (_studentAddress == address(0)) {
                emit GradeAdditionFailed_ZeroAddress();

                continue;
            }

            if (!studentContract.doesStudentExist(_studentAddress)) {
                emit GradeAdditionFailed_StudentNotFound(_studentAddress);

                continue;
            }

            uint256 _gradeID = gradeIDCounter.current();
            gradeIDCounter.increment();

            grades[_gradeID] = Grade({
                student: _studentAddress,
                teacher: msg.sender,
                course: _courseID,
                id: _gradeID,
                module: _module,
                grade: _studentGrade,
                exists: true
            });

            gradeID[_studentAddress].push(_gradeID);
            gradeIndex[_gradeID] = gradeID[_studentAddress].length;
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
        Grade storage _gradeToDelete = grades[_gradeID];

        delete grades[_gradeID];

        uint256 _lastGradeID = gradeID[_gradeToDelete.student][
            gradeID[_gradeToDelete.student].length - 1
        ];
        uint256 _gradeIndex = gradeIndex[_gradeID];

        gradeIndex[_lastGradeID] = _gradeIndex;
        gradeID[_gradeToDelete.student][_gradeIndex] = _lastGradeID;
        gradeID[_gradeToDelete.student].pop();

        delete gradeIndex[_gradeID];
    }

    function updateGrade(
        uint256 _gradeID,
        uint256 _courseID,
        uint8 _newGrade
    )
        external
        onlyAuthorizedTeacher(teacherContract.getCourseTeacher(_courseID))
        whenNotPaused
        whenNotLocked
        requireAssignedGrade(_gradeID)
    {
        Grade storage _gradeToUpdate = grades[_gradeID];

        _gradeToUpdate.grade = _newGrade;
    }

    // Certificate
    function mintCertificate(
        address _to,
        uint256 _gradeID,
        uint256 _courseID,
        string memory _imageURL
    )
        external
        onlyAuthorizedTeacher(teacherContract.getCourseTeacher(_courseID))
        whenNotPaused
        whenNotLocked
        validAddress(_to)
        requireAssignedGrade(_gradeID)
    {
        uint256 _certificateID = certificateIDCounter.current();
        certificateIDCounter.increment();

        _mint(_to, _certificateID);

        // Store certificate metadata
        certificates[_certificateID] = Certificate({
            owner: _to,
            imageURL: _imageURL,
            grade: _gradeID,
            id: _certificateID,
            exists: true
        });
    }

    function updateCertificate(
        uint256 _certificateID,
        address _newOwner,
        string memory _newImageURL
    )
        external
        onlyOwner
        whenNotPaused
        whenNotLocked
        validAddress(_newOwner)
        requireAssignedCertificate(_certificateID)
    {
        Certificate storage _certificateToUpdate = certificates[_certificateID];

        _certificateToUpdate.owner = _newOwner;
        _certificateToUpdate.imageURL = _newImageURL;
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

    // Certificate
    function getCertificate(
        uint256 _certificateID
    )
        external
        view
        requireAssignedCertificate(_certificateID)
        returns (Certificate memory)
    {
        return certificates[_certificateID];
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
}
