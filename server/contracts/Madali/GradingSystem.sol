// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BaseContract.sol";

contract GradingSystem is BaseContract {
    constructor() {}

    /** Grade Management Functions */
    function gradeStudent(
        address _studentAddress,
        uint256 _courseID,
        uint256 _module,
        uint256 _grade
    )
        external
        isNotPaused
        onlyAuthorizedTeacher(courses[_courseID].teacher)
        isNotLocked
        requireStudentAssigned(_studentAddress)
        requireCourseAssigned(_courseID)
    {
        grades[_studentAddress].push(
            Grade({
                student: _studentAddress,
                teacher: msg.sender,
                course: _courseID,
                module: _module,
                grade: _grade
            })
        );
    }
}
