// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Import custom AccessControl contract, and the student and teacher contracts.
import "./AccessControl.sol";
import "./StudentManagement.sol";
import "./TeacherManagement.sol";

// Factory contract to deploy dependent contracts.
// Dependent contracts: StudentManagement, TeacherManagement.
// Dependent contracts are linked with each other.
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

        // Set owner
        studentContract.transferOwnership(owner());
        teacherContract.transferOwnership(owner());

        // Emit events
        emit StudentContractDeployed(address(studentContract));
        emit TeacherContractDeployed(address(teacherContract));
    }
}
