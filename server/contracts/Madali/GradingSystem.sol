// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BaseContract.sol";

contract GradingSystem is BaseContract {
    /** Grade Management Functions */
    function addGrade(
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

    function updateGrade(
        address _studentAddress,
        uint256 _courseID,
        uint256 _module,
        uint256 _newGrade
    )
        external
        isNotPaused
        onlyAuthorizedTeacher(courses[_courseID].teacher)
        isNotLocked
        requireStudentAssigned(_studentAddress)
        requireCourseAssigned(_courseID)
    {
        for (uint256 i = 0; i < grades[_studentAddress].length; ++i) {
            if (
                grades[_studentAddress][i].course == _courseID &&
                grades[_studentAddress][i].module == _module
            ) {
                grades[_studentAddress][i].grade = _newGrade;
            }
        }
    }
}
