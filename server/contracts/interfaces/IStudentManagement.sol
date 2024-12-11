// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IStudentManagement {
    /** Interface Functions */
    function doesClassExist(uint256 _classID) external view returns (bool);

    function doesStudentExist(
        address _studentAddress
    ) external view returns (bool);
}
