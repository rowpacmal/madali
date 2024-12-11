// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./AccessControl.sol";
import "./StudentManagement.sol";
import "./TeacherManagement.sol";

contract Factory is AccessControl {
    StudentManagement public studentContract;
    TeacherManagement public teacherContract;

    constructor() {
        // Deploy dependent contracts
        studentContract = new StudentManagement();
        teacherContract = new TeacherManagement();

        // Link contracts with each other
        studentContract.updateTeacherContract(address(teacherContract));
        teacherContract.updateStudentContract(address(studentContract));
    }

    // Allow owner to update or re-link contracts
    function updateContracts(
        address _newStudentContract,
        address _newTeacherContract
    )
        external
        onlyOwner
        validAddress(_newStudentContract)
        validAddress(_newTeacherContract)
    {
        studentContract = StudentManagement(_newStudentContract);
        teacherContract = TeacherManagement(_newTeacherContract);

        studentContract.updateTeacherContract(address(teacherContract));
        teacherContract.updateStudentContract(address(studentContract));
    }
}
