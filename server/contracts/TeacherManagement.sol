// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./AccessControl.sol";
import "./interfaces/IStudentManagement.sol";

contract TeacherManagement is AccessControl {
    /** Structs */
    struct Course {
        address teacher;
        uint256 id;
        uint16 class;
        uint8 modules;
        bool exists;
    }

    struct Teacher {
        address key;
        uint16 class;
        bool exists;
    }

    /** State Variables */
    IStudentManagement public studentContract;
    address[] private teacherKeys;
    mapping(address => uint256[]) private courseID;
    mapping(uint256 => uint256) private courseIndex;
    mapping(uint256 => Course) private courses;
    mapping(address => uint256) private teacherIndex;
    mapping(address => Teacher) private teachers;

    /** Events */
    event CourseAdditionFailed_AlreadyExists(uint256 indexed course);
    event CourseDeleted(uint256 indexed course);
    event CourseDeletionFailed_NoCoursesToDelete();
    event CourseDeletionFailed_NotFound(uint256 indexed course);
    event CourseDeletionFailed_NotOwned(uint256 indexed course);
    event CourseRegistered(uint256 indexed course);
    event TeacherAdditionFailed_AlreadyExists(address indexed teacher);
    event TeacherAdditionFailed_ZeroAddress();
    event TeacherDeletionFailed_NotFound(address indexed teacher);
    event TeacherDeletionFailed_ZeroAddress();
    event TeacherDeleted(address indexed teacher);
    event TeacherRegistered(address indexed teacher);

    /** Errors */
    error CourseNotFound(uint256 course);
    error CoursesClassesModulesLengthMismatch(
        uint256 coursesLength,
        uint256 classesLength,
        uint256 modulesLength
    );
    error NoClassesProvided();
    error NoCoursesProvided();
    error NoCoursesToDelete();
    error NoModulesProvided();
    error NoTeachersProvided();
    error NoTeachersToDelete();
    error TeachersClassesLengthMismatch(
        uint256 teachersLength,
        uint256 classesLength
    );
    error StudentContractNotFound();
    error TeacherNotFound(address teacher);
    error UnauthorizedAccount(address caller);

    /** Constructor */
    constructor() {
        // Set the initial StudentManagement address to 0
        studentContract = IStudentManagement(address(0));
    }

    /** Modifiers */
    modifier onlyAuthorizedTeacher(address _teacherAddress) {
        bool isTeacherAndSelf = teachers[msg.sender].exists &&
            msg.sender == _teacherAddress;
        bool isOwner = msg.sender == owner();

        if (!isTeacherAndSelf && !isOwner) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    modifier onlyTeacher() {
        bool isTeacher = teachers[msg.sender].exists;
        bool isOwner = msg.sender == owner();

        if (!isTeacher && !isOwner) {
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

    modifier provideCourses(uint256[] memory _courses) {
        if (_courses.length == 0) {
            revert NoCoursesProvided();
        }
        _;
    }

    modifier provideModules(uint8[] memory _modules) {
        if (_modules.length == 0) {
            revert NoModulesProvided();
        }
        _;
    }

    modifier provideTeachers(address[] memory _teachers) {
        if (_teachers.length == 0) {
            revert NoTeachersProvided();
        }
        _;
    }

    modifier requireAssignedTeacher(address _teacherAddress) {
        if (!teachers[_teacherAddress].exists) {
            revert TeacherNotFound(_teacherAddress);
        }
        _;
    }

    /** Management Functions */
    // Teacher
    function deleteTeachers(
        address[] memory _teachers
    )
        external
        onlyOwner
        whenNotPaused
        whenNotLocked
        provideTeachers(_teachers)
    {
        if (teacherKeys.length == 0) {
            revert NoTeachersToDelete();
        }

        for (uint256 i = 0; i < _teachers.length; ++i) {
            address _teacherAddress = _teachers[i];

            if (_teacherAddress == address(0)) {
                emit TeacherDeletionFailed_ZeroAddress();

                continue;
            }

            if (!teachers[_teacherAddress].exists) {
                emit TeacherDeletionFailed_NotFound(_teacherAddress);

                continue;
            }

            delete teachers[_teacherAddress];

            address _lastTeacherKey = teacherKeys[teacherKeys.length - 1];
            uint256 _teacherIndex = teacherIndex[_teacherAddress];

            teacherIndex[_lastTeacherKey] = _teacherIndex;
            teacherKeys[_teacherIndex] = _lastTeacherKey;
            teacherKeys.pop();

            delete teacherIndex[_teacherAddress];

            if (courseID[_teacherAddress].length == 0) {
                emit CourseDeletionFailed_NoCoursesToDelete();
            } else {
                batchDeleteCourses(courseID[_teacherAddress], _teacherAddress);
            }

            emit TeacherDeleted(_teacherAddress);
        }
    }

    function registerTeachers(
        address[] memory _teachers,
        uint16[] memory _classes
    )
        external
        onlyOwner
        whenNotPaused
        whenNotLocked
        provideTeachers(_teachers)
        provideClasses(_classes)
    {
        if (_teachers.length != _classes.length) {
            revert TeachersClassesLengthMismatch(
                _teachers.length,
                _classes.length
            );
        }

        for (uint256 i; i < _teachers.length; ++i) {
            address _teacherAddress = _teachers[i];

            if (_teacherAddress == address(0)) {
                emit TeacherAdditionFailed_ZeroAddress();

                continue;
            }

            if (teachers[_teacherAddress].exists) {
                emit TeacherAdditionFailed_AlreadyExists(_teacherAddress);

                continue;
            }

            teachers[_teacherAddress] = Teacher({
                key: _teacherAddress,
                exists: true,
                class: _classes[i]
            });

            teacherKeys.push(_teacherAddress);
            teacherIndex[_teacherAddress] = teacherKeys.length - 1;

            emit TeacherRegistered(_teacherAddress);
        }
    }

    function updateTeacher(
        address _teacherAddress,
        uint16 _newClassID
    )
        external
        onlyAuthorizedTeacher(_teacherAddress)
        whenNotPaused
        whenNotLocked
        validAddress(_teacherAddress)
        requireAssignedTeacher(_teacherAddress)
    {
        Teacher storage _teacherToUpdate = teachers[_teacherAddress];
        _teacherToUpdate.class = _newClassID;
    }

    // Course
    function deleteCourses(
        uint256[] memory _courses,
        address _teacherAddress
    )
        external
        onlyTeacher
        whenNotPaused
        whenNotLocked
        validAddress(_teacherAddress)
        requireAssignedTeacher(_teacherAddress)
    {
        if (_courses.length == 0) {
            revert NoCoursesProvided();
        }

        if (courseID[_teacherAddress].length == 0) {
            revert NoCoursesToDelete();
        }

        batchDeleteCourses(_courses, _teacherAddress);
    }

    function registerCourse(
        address _teacherAddress,
        uint256[] memory _courses,
        uint16[] memory _classes,
        uint8[] memory _modules
    )
        external
        onlyTeacher
        whenNotPaused
        whenNotLocked
        validAddress(_teacherAddress)
        requireAssignedTeacher(_teacherAddress)
        provideCourses(_courses)
        provideClasses(_classes)
        provideModules(_modules)
    {
        uint256 _totalArrayLength = _courses.length;

        if (
            _classes.length != _totalArrayLength ||
            _modules.length != _totalArrayLength
        ) {
            revert CoursesClassesModulesLengthMismatch(
                _courses.length,
                _classes.length,
                _modules.length
            );
        }

        for (uint256 i; i < _courses.length; ++i) {
            uint256 _courseID = _courses[i];

            if (courses[_courseID].exists) {
                emit CourseAdditionFailed_AlreadyExists(_courseID);

                continue;
            }

            courses[_courseID] = Course({
                teacher: _teacherAddress,
                exists: true,
                class: _classes[i],
                id: _courseID,
                modules: _modules[i]
            });

            addCourseToTeacher(_teacherAddress, _courseID);

            emit CourseRegistered(_courseID);
        }
    }

    /** Getter Functions */
    // Course
    function getAllCoursesByTeacher(
        address _teacherAddress
    )
        external
        view
        onlyTeacher
        validAddress(_teacherAddress)
        returns (uint256[] memory)
    {
        return courseID[_teacherAddress];
    }

    function getCourse(
        uint256 _courseID
    ) external view onlyTeacher returns (Course memory) {
        return courses[_courseID];
    }

    function getTotalCoursesByTeacher(
        address _teacherAddress
    )
        external
        view
        onlyTeacher
        validAddress(_teacherAddress)
        returns (uint256)
    {
        return courseID[_teacherAddress].length;
    }

    // Teacher
    function getAllTeachers()
        external
        view
        onlyTeacher
        returns (address[] memory)
    {
        return teacherKeys;
    }

    function getTeacher(
        address _teacherAddress
    )
        external
        view
        onlyTeacher
        validAddress(_teacherAddress)
        returns (Teacher memory, uint256[] memory)
    {
        return (teachers[_teacherAddress], courseID[_teacherAddress]);
    }

    function getTotalTeachers() external view onlyTeacher returns (uint256) {
        return teacherKeys.length;
    }

    /** Utility Functions */
    function addCourseToTeacher(
        address _teacherAddress,
        uint256 _courseID
    ) private {
        courseID[_teacherAddress].push(_courseID);
        courseIndex[_courseID] = courseID[_teacherAddress].length - 1;
    }

    function batchDeleteCourses(
        uint256[] memory _courses,
        address _teacherAddress
    ) private {
        for (uint256 i = 0; i < _courses.length; ++i) {
            uint256 _courseID = _courses[i];

            if (!courses[_courseID].exists) {
                emit CourseDeletionFailed_NotFound(_courseID);

                continue;
            }

            if (courses[_courseID].teacher != _teacherAddress) {
                emit CourseDeletionFailed_NotOwned(_courseID);

                continue;
            }

            delete courses[_courseID];

            uint256 _lastCourseID = courseID[_teacherAddress][
                courseID[_teacherAddress].length - 1
            ];
            uint256 _courseIndex = courseIndex[_courseID];

            courseIndex[_lastCourseID] = _courseIndex;
            courseID[_teacherAddress][_courseIndex] = _lastCourseID;
            courseID[_teacherAddress].pop();

            delete courseIndex[_courseID];

            emit CourseDeleted(_courseID);
        }
    }

    /** Injection Functions */
    function updateStudentContract(
        address _newStudentContractAddress
    ) external onlyOwner validAddress(_newStudentContractAddress) {
        studentContract = IStudentManagement(_newStudentContractAddress);
    }

    /** Interface Functions */
    function doesCourseExist(uint256 _courseID) external view returns (bool) {
        return courses[_courseID].exists;
    }

    function doesTeacherExist(
        address _teacherAddress
    ) external view returns (bool) {
        return teachers[_teacherAddress].exists;
    }

    function getCourseTeacher(
        uint256 _courseID
    ) external view returns (address) {
        if (!courses[_courseID].exists) {
            revert();
        }

        return courses[_courseID].teacher;
    }
}
