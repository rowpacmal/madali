// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface ITeacherManagement {
    /** Interface Functions */
    function doesCourseExist(uint256 _courseID) external view returns (bool);

    function doesTeacherExist(
        address _teacherAddress
    ) external view returns (bool);

    function getCourseTeacher(
        uint256 _courseID
    ) external view returns (address);
}
