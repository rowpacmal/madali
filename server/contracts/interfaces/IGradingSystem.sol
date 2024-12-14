// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IGradingSystem {
    /** Interface Functions */
    function doesGradeExist(uint256 _gradeID) external view returns (bool);
}
