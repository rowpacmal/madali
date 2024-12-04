// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BaseContract.sol";

contract TeacherManagement is BaseContract {
    constructor() {}

    /** Teacher Management Functions */
    function addTeacher(
        address _teacherAddress,
        uint256 _classID
    )
        external
        isNotPaused
        onlyAdmin
        isNotLocked
        isNotZeroAddress(_teacherAddress)
        requireTeacherNotAssigned(_teacherAddress)
    {
        // Add teacher data.
        User storage _newTeacher = teachers[_teacherAddress];
        _newTeacher.key = _teacherAddress;
        _newTeacher.exist = true;
        _newTeacher.class = _classID;

        teacherKeys.push(_teacherAddress);
    }

    function deleteTeacher(
        address _teacherAddress
    )
        external
        isNotPaused
        onlyAdmin
        isNotLocked
        isNotZeroAddress(_teacherAddress)
        requireStudentAssigned(_teacherAddress)
    {
        // Delete teacher data.
        delete teachers[_teacherAddress];

        // Delete teacher address from the teacherKeys array.
        for (uint256 i = 0; i < teacherKeys.length; ++i) {
            if (teacherKeys[i] == _teacherAddress) {
                teacherKeys[i] = teacherKeys[teacherKeys.length - 1];
                teacherKeys.pop();

                break;
            }
        }

        // Delete all course data from the teacher.
        batchDeleteCourses(courseID[_teacherAddress], _teacherAddress);

        delete courseID[_teacherAddress];
    }

    function updateTeacher(
        address _teacherAddress,
        uint256 _newClassID
    )
        external
        isNotPaused
        onlyAuthorizedTeacher(_teacherAddress)
        isNotLocked
        requireTeacherAssigned(_teacherAddress)
        requireClassAssigned(_newClassID)
    {
        User storage _teacherToUpdate = teachers[_teacherAddress];
        _teacherToUpdate.class = _newClassID;
    }

    /** Course Management Functions */
    function addCourses(
        address _teacherAddress,
        uint256[] memory _classes,
        uint256[] memory _courses,
        uint256[] memory _modules
    )
        external
        isNotPaused
        onlyTeacher
        isNotLocked
        requireTeacherAssigned(_teacherAddress)
    {
        uint256 _arrayLength = _classes.length;

        if (
            _courses.length != _arrayLength || _modules.length != _arrayLength
        ) {
            revert Error_ArrayLengthMismatch(
                _classes.length,
                _courses.length,
                _modules.length
            );
        }

        for (uint256 i = 0; i < _arrayLength; ++i) {
            uint256 _classID = _classes[i];

            // Check if the class exists.
            if (!classes[_classID]) {
                revert Error_ClassNotFound(_classID);
            }

            uint256 _courseID = _courses[i];

            // Check if the course does not exists.
            if (courses[_courseID].exist) {
                revert Error_CourseExists(_courseID);
            }

            courses[_courseID] = Course({
                teacher: _teacherAddress,
                exist: true,
                class: _classID,
                id: _courseID,
                modules: _modules[i]
            });

            courseID[_teacherAddress].push(_courseID);
            courseIndex[_courseID] = courseID[_teacherAddress].length - 1;
        }
    }

    function deleteCourses(
        uint256[] memory _courses,
        address _teacherAddress
    )
        external
        isNotPaused
        onlyTeacher
        isNotLocked
        requireTeacherAssigned(_teacherAddress)
    {
        // Delete course data.
        batchDeleteCourses(_courses, _teacherAddress);
    }

    function updateCourse(
        uint256 _courseID,
        address _newTeacherAddress,
        uint256 _newClassID,
        uint256 _newModules
    )
        external
        isNotPaused
        onlyTeacher
        isNotLocked
        requireCourseAssigned(_courseID)
        requireTeacherAssigned(_newTeacherAddress)
        requireClassAssigned(_newClassID)
    {
        // Update course data.
        Course storage _courseToUpdate = courses[_courseID];
        _courseToUpdate.teacher = _newTeacherAddress;
        _courseToUpdate.class = _newClassID;
        _courseToUpdate.modules = _newModules;
    }

    /** Getter Functions */
    function getAllCourses(
        address _teacherAddress
    ) external view isNotPaused onlyStudent returns (uint256[] memory) {
        return (courseID[_teacherAddress]);
    }

    function getAllTeachers()
        external
        view
        isNotPaused
        onlyStudent
        returns (address[] memory)
    {
        return (teacherKeys);
    }

    function getCourse(
        uint _courseID
    )
        external
        view
        isNotPaused
        onlyStudent
        requireCourseAssigned(_courseID)
        returns (Course memory)
    {
        return (courses[_courseID]);
    }

    function getTeacher(
        address _teacherAddress
    )
        external
        view
        isNotPaused
        onlyStudent
        requireTeacherAssigned(_teacherAddress)
        returns (User memory, uint256[] memory)
    {
        return (teachers[_teacherAddress], courseID[_teacherAddress]);
    }

    /** Utility Functions */
    function batchDeleteCourses(
        uint256[] memory _courses,
        address _teacherAddress
    ) private {
        for (uint256 i = 0; i < _courses.length; ++i) {
            uint256 _courseID = _courses[i];

            // Check if the course does exist.
            if (!courses[_courseID].exist) {
                revert Error_CourseNotFound(_courseID);
            }

            // Delete course data.
            delete courses[_courseID];

            uint256 _lastCourseID = courseID[_teacherAddress][
                courseID[_teacherAddress].length - 1
            ];
            uint256 _courseIndex = courseIndex[_courseID];

            courseIndex[_lastCourseID] = _courseIndex;
            courseID[_teacherAddress][_courseIndex] = _lastCourseID;
            courseID[_teacherAddress].pop();

            delete courseIndex[_courseID];

            // Emit an event for transparency.
            emit Event_CourseDeleted(_courseID);
        }
    }
}
