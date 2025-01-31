// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Import custom AccessControl contract, and the student management contract interface.
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
    // This modifier is used to check if the caller is an authorized teacher.
    modifier onlyAuthorizedTeacher(address _teacherAddress) {
        bool isTeacherAndSelf = teachers[msg.sender].exists &&
            msg.sender == _teacherAddress;
        bool isOwner = msg.sender == owner();

        if (!isTeacherAndSelf && !isOwner) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    // This modifier is used to check if the caller is a teacher.
    modifier onlyTeacher() {
        bool isTeacher = teachers[msg.sender].exists;
        bool isOwner = msg.sender == owner();

        if (!isTeacher && !isOwner) {
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

    // This modifier is used to check if provided courses not empty.
    modifier provideCourses(uint256[] memory _courses) {
        if (_courses.length == 0) {
            revert NoCoursesProvided();
        }
        _;
    }

    // This modifier is used to check if provided modules not empty.
    modifier provideModules(uint8[] memory _modules) {
        if (_modules.length == 0) {
            revert NoModulesProvided();
        }
        _;
    }

    // This modifier is used to check if provided teachers not empty.
    modifier provideTeachers(address[] memory _teachers) {
        if (_teachers.length == 0) {
            revert NoTeachersProvided();
        }
        _;
    }

    // This modifier is used to check if teacher exists.
    modifier requireAssignedTeacher(address _teacherAddress) {
        if (!teachers[_teacherAddress].exists) {
            revert TeacherNotFound(_teacherAddress);
        }
        _;
    }

    /** Management Functions */
    // This function is used to delete teachers from the contract in batch.
    function deleteTeachers(
        address[] memory _teachers
    )
        external
        onlyOwner
        whenNotPaused
        whenNotLocked
        provideTeachers(_teachers)
    {
        // Check if there are teachers to delete.
        if (teacherKeys.length == 0) {
            revert NoTeachersToDelete();
        }

        // Loop through and delete the teachers.
        for (uint256 i = 0; i < _teachers.length; ++i) {
            address _teacherAddress = _teachers[i];

            // Check if the teacher address is zero.
            if (_teacherAddress == address(0)) {
                emit TeacherDeletionFailed_ZeroAddress();

                continue;
            }

            // Check if the teacher exists.
            if (!teachers[_teacherAddress].exists) {
                emit TeacherDeletionFailed_NotFound(_teacherAddress);

                continue;
            }

            // Delete the teacher.
            delete teachers[_teacherAddress];

            // Delete the teacher from the teacherKeys array.
            address _lastTeacherKey = teacherKeys[teacherKeys.length - 1];
            uint256 _teacherIndex = teacherIndex[_teacherAddress];

            teacherIndex[_lastTeacherKey] = _teacherIndex;
            teacherKeys[_teacherIndex] = _lastTeacherKey;
            teacherKeys.pop();

            delete teacherIndex[_teacherAddress];

            // Delete the teacher's courses.
            if (courseID[_teacherAddress].length == 0) {
                emit CourseDeletionFailed_NoCoursesToDelete();
            } else {
                // Call the batch delete courses function.
                batchDeleteCourses(courseID[_teacherAddress], _teacherAddress);
            }

            // Emit the teacher deleted event.
            emit TeacherDeleted(_teacherAddress);
        }
    }

    // This function is used to register teachers in the contract in batch.
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
        // Check if the number of teachers and classes are the same length.
        if (_teachers.length != _classes.length) {
            revert TeachersClassesLengthMismatch(
                _teachers.length,
                _classes.length
            );
        }

        // Loop through and register the teachers.
        for (uint256 i; i < _teachers.length; ++i) {
            address _teacherAddress = _teachers[i];

            // Check if the teacher address is zero.
            if (_teacherAddress == address(0)) {
                emit TeacherAdditionFailed_ZeroAddress();

                continue;
            }

            // Check if the teacher already exists.
            if (teachers[_teacherAddress].exists) {
                emit TeacherAdditionFailed_AlreadyExists(_teacherAddress);

                continue;
            }

            // Register the teacher.
            teachers[_teacherAddress] = Teacher({
                key: _teacherAddress,
                exists: true,
                class: _classes[i]
            });

            // Add the teacher to the teacherKeys array.
            teacherKeys.push(_teacherAddress);
            teacherIndex[_teacherAddress] = teacherKeys.length - 1;

            // Emit the teacher registered event.
            emit TeacherRegistered(_teacherAddress);
        }
    }

    // This function is used to update a teacher.
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
        // Update the teacher.
        Teacher storage _teacherToUpdate = teachers[_teacherAddress];
        _teacherToUpdate.class = _newClassID;
    }

    // This function is used to delete courses from the contract in batch.
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
        // Check if there are provided courses to delete.
        if (_courses.length == 0) {
            revert NoCoursesProvided();
        }

        // Check if there are courses to delete.
        if (courseID[_teacherAddress].length == 0) {
            revert NoCoursesToDelete();
        }

        // Call the batch delete courses function.
        batchDeleteCourses(_courses, _teacherAddress);
    }

    // This function is used to register courses in the contract in batch.
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

        // Check if the number of courses, classes, and modules are the same length.
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

        // Loop through and register the courses.
        for (uint256 i; i < _courses.length; ++i) {
            uint256 _courseID = _courses[i];

            // Check if the course already exists.
            if (courses[_courseID].exists) {
                emit CourseAdditionFailed_AlreadyExists(_courseID);

                continue;
            }

            // Register the course.
            courses[_courseID] = Course({
                teacher: _teacherAddress,
                exists: true,
                class: _classes[i],
                id: _courseID,
                modules: _modules[i]
            });

            // Add the course to the courseID array.
            // Call the add course to teacher function.
            // This was added because of a "too deep nesting" error in Solidity.
            addCourseToTeacher(_teacherAddress, _courseID);

            // Emit the course registered event.
            emit CourseRegistered(_courseID);
        }
    }

    /** Getter Functions */
    // These functions are used to get information from the contract.
    // For courses.
    function getAllCoursesByTeacher(
        address _teacherAddress
    ) external view validAddress(_teacherAddress) returns (uint256[] memory) {
        return courseID[_teacherAddress];
    }

    function getCourse(
        uint256 _courseID
    ) external view returns (Course memory) {
        return courses[_courseID];
    }

    function getTotalCoursesByTeacher(
        address _teacherAddress
    ) external view validAddress(_teacherAddress) returns (uint256) {
        return courseID[_teacherAddress].length;
    }

    // For teachers.
    function getAllTeachers() external view returns (address[] memory) {
        return teacherKeys;
    }

    function getTeacher(
        address _teacherAddress
    )
        external
        view
        validAddress(_teacherAddress)
        returns (Teacher memory, uint256[] memory)
    {
        return (teachers[_teacherAddress], courseID[_teacherAddress]);
    }

    function getTotalTeachers() external view returns (uint256) {
        return teacherKeys.length;
    }

    /** Utility Functions */
    // These functions are used to add or remove courses from the contract.
    function addCourseToTeacher(
        address _teacherAddress,
        uint256 _courseID
    ) private {
        // Add the course to the courseID array.
        courseID[_teacherAddress].push(_courseID);
        courseIndex[_courseID] = courseID[_teacherAddress].length - 1;
    }

    function batchDeleteCourses(
        uint256[] memory _courses,
        address _teacherAddress
    ) private {
        // Loop through and delete the courses.
        for (uint256 i = 0; i < _courses.length; ++i) {
            uint256 _courseID = _courses[i];

            // Check if the course exists.
            if (!courses[_courseID].exists) {
                emit CourseDeletionFailed_NotFound(_courseID);

                continue;
            }

            // Check if the course is owned by the teacher.
            if (courses[_courseID].teacher != _teacherAddress) {
                emit CourseDeletionFailed_NotOwned(_courseID);

                continue;
            }

            // Delete the course.
            delete courses[_courseID];

            // Delete the course from the courseID array.
            uint256 _lastCourseID = courseID[_teacherAddress][
                courseID[_teacherAddress].length - 1
            ];
            uint256 _courseIndex = courseIndex[_courseID];

            courseIndex[_lastCourseID] = _courseIndex;
            courseID[_teacherAddress][_courseIndex] = _lastCourseID;
            courseID[_teacherAddress].pop();

            // Delete the course from the courseIndex array.
            delete courseIndex[_courseID];

            // Emit the course deleted event.
            emit CourseDeleted(_courseID);
        }
    }

    /** Injection Functions */
    // This function is used to update the student contract address.
    function updateStudentContract(
        address _newStudentContractAddress
    ) external onlyOwner validAddress(_newStudentContractAddress) {
        studentContract = IStudentManagement(_newStudentContractAddress);
    }

    /** Interface Functions */
    // These functions are used to interact with the contract from outside. (May be deprecated, but are still used for now.)
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
            revert CourseNotFound(_courseID);
        }

        return courses[_courseID].teacher;
    }
}
