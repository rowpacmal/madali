// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract BaseContract {
    /** Structs */
    struct Course {
        address teacher;
        bool exist;
        uint256 class;
        uint256 id;
        uint256 modules;
    }
    struct Grade {
        address student;
        address teacher;
        uint256 course;
        uint256 module;
        uint256 grade;
    }
    struct User {
        address key;
        bool exist;
        uint256 class;
    }

    /** Variables */
    address public admin;
    bool private paused;

    // Arrays
    address[] internal teacherKeys;
    uint256[] internal classID;

    // Mappings
    mapping(uint256 => bool) internal classes;
    mapping(address => uint256[]) internal courseID;
    mapping(uint256 => uint256) internal courseIndex;
    mapping(uint256 => Course) internal courses;
    mapping(address => Grade[]) internal grades;
    mapping(address => uint256) internal studentIndex;
    mapping(uint256 => address[]) internal studentKeys;
    mapping(address => User) internal students;
    mapping(address => User) internal teachers;
    mapping(address => bool) private userLocked;

    /** Events */
    event Event_CourseDeleted(uint256 courseID);
    event Event_StudentDeleted(address studentAddress);

    /** Errors */
    error Error_AccessDenied(address caller);
    error Error_AccessLocked(address caller);
    error Error_ArrayLengthMismatch(
        uint256 classIDArrayLength,
        uint256 courseIDArrayLength,
        uint256 modulesArrayLength
    );
    error Error_ClassExists(uint256 classID);
    error Error_ClassNotFound(uint256 classID);
    error Error_ContractPaused();
    error Error_ContractUnpaused();
    error Error_CourseAlreadyAssigned(address teacher, uint256 courseID);
    error Error_CourseExists(uint256 courseID);
    error Error_CourseNotFound(uint256 courseID);
    error Error_FunctionNotFound();
    error Error_StudentAlreadyAssigned(address student);
    error Error_StudentNotFound(address student);
    error Error_TeacherAlreadyAssigned(address teacher);
    error Error_TeacherNotFound(address teacher);
    error Error_ZeroAddressNotAllowed();

    /** Constructor */
    constructor() {
        admin = msg.sender;
    }

    /** Modifiers */
    modifier isNotLocked() {
        if (userLocked[msg.sender]) {
            revert Error_AccessLocked(msg.sender);
        }
        userLocked[msg.sender] = true;
        _;
        userLocked[msg.sender] = false;
    }
    modifier isNotPaused() {
        if (paused) {
            revert Error_ContractPaused();
        }
        _;
    }
    modifier isNotZeroAddress(address _address) {
        if (_address == address(0)) {
            revert Error_ZeroAddressNotAllowed();
        }
        _;
    }
    modifier isPaused() {
        if (!paused) {
            revert Error_ContractUnpaused();
        }
        _;
    }
    modifier onlyAdmin() {
        bool isAdmin = msg.sender == admin;

        if (!isAdmin) {
            revert Error_AccessDenied(msg.sender);
        }
        _;
    }
    modifier onlyAuthorizedTeacher(address _teacherAddress) {
        bool isTeacherAndSelf = teachers[msg.sender].exist &&
            msg.sender == _teacherAddress;
        bool isAdmin = msg.sender == admin;

        if (!isTeacherAndSelf && !isAdmin) {
            revert Error_AccessDenied(msg.sender);
        }
        _;
    }
    modifier onlyStudent() {
        bool isStudent = students[msg.sender].exist;
        bool isTeacher = teachers[msg.sender].exist;
        bool isAdmin = msg.sender == admin;

        if (!isStudent && !isTeacher && !isAdmin) {
            revert Error_AccessDenied(msg.sender);
        }
        _;
    }
    modifier onlyTeacher() {
        bool isTeacher = teachers[msg.sender].exist;
        bool isAdmin = msg.sender == admin;

        if (!isTeacher && !isAdmin) {
            revert Error_AccessDenied(msg.sender);
        }
        _;
    }
    modifier requireClassAssigned(uint256 _classID) {
        if (!classes[_classID]) {
            revert Error_ClassNotFound(_classID);
        }
        _;
    }
    modifier requireClassNotAssigned(uint256 _classID) {
        if (classes[_classID]) {
            revert Error_ClassExists(_classID);
        }
        _;
    }
    modifier requireCourseAssigned(uint256 _courseID) {
        if (!courses[_courseID].exist) {
            revert Error_CourseNotFound(_courseID);
        }
        _;
    }
    modifier requireCourseNotAssigned(uint256 _courseID) {
        if (courses[_courseID].exist) {
            revert Error_CourseExists(_courseID);
        }
        _;
    }
    modifier requireStudentAssigned(address _studentAddress) {
        if (!students[_studentAddress].exist) {
            revert Error_StudentNotFound(_studentAddress);
        }
        _;
    }
    modifier requireStudentNotAssigned(address _studentAddress) {
        if (students[_studentAddress].exist) {
            revert Error_StudentAlreadyAssigned(_studentAddress);
        }
        _;
    }
    modifier requireTeacherAssigned(address _teacherAddress) {
        if (!teachers[_teacherAddress].exist) {
            revert Error_TeacherNotFound(_teacherAddress);
        }
        _;
    }
    modifier requireTeacherNotAssigned(address _teacherAddress) {
        if (teachers[_teacherAddress].exist) {
            revert Error_TeacherAlreadyAssigned(_teacherAddress);
        }
        _;
    }

    /** Fallback Functions */
    fallback() external {
        revert Error_FunctionNotFound();
    }

    /** Access Control Functions */
    function changeAdmin(
        address _newAdmin
    ) external isNotPaused onlyAdmin isNotLocked isNotZeroAddress(_newAdmin) {
        admin = _newAdmin;
    }

    function pauseContract() external isNotPaused onlyAdmin isNotLocked {
        paused = true;
    }

    function unpauseContract() external isPaused onlyAdmin isNotLocked {
        paused = false;
    }
}
