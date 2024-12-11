// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./AccessControl.sol";
import "./StudentManagement.sol";
import "./TeacherManagement.sol";

contract Factory is AccessControl {
    /** State Variables */
    StudentManagement public studentContract;
    TeacherManagement public teacherContract;

    /** Events */
    event StudentContractDeployed(address indexed studentContract);
    event TeacherContractDeployed(address indexed teacherContract);

    /** Constructor */
    constructor() {
        // Deploy dependent contracts
        studentContract = new StudentManagement();
        teacherContract = new TeacherManagement();

        // Link contracts with each other
        studentContract.updateTeacherContract(address(teacherContract));
        teacherContract.updateStudentContract(address(studentContract));

        // Emit events
        emit StudentContractDeployed(address(studentContract));
        emit TeacherContractDeployed(address(teacherContract));
    }

    /** Functions */
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
        // Deploy dependent contracts
        studentContract = StudentManagement(_newStudentContract);
        teacherContract = TeacherManagement(_newTeacherContract);

        // Link contracts with each other
        studentContract.updateTeacherContract(address(teacherContract));
        teacherContract.updateStudentContract(address(studentContract));

        // Emit events
        emit StudentContractDeployed(address(studentContract));
        emit TeacherContractDeployed(address(teacherContract));
    }
}
