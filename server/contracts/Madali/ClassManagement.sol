// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BaseContract.sol";

contract ClassManagement is BaseContract {
    /** Class Management Functions */
    function addClass(
        uint256 _classID
    )
        external
        isNotPaused
        onlyAdmin
        isNotLocked
        requireClassNotAssigned(_classID)
    {
        classes[_classID] = true;
        classID.push(_classID);
    }

    function deleteClass(
        uint256 _classID
    )
        external
        isNotPaused
        onlyAdmin
        isNotLocked
        requireClassAssigned(_classID)
    {
        // Delete class data.
        delete classes[_classID];

        // Delete class id from the classID array.
        for (uint256 i = 0; i < classID.length; ++i) {
            if (classID[i] == _classID) {
                classID[i] = classID[classID.length - 1];
                classID.pop();

                break;
            }
        }

        // Delete all student data from the class.
        batchDeleteStudents(studentKeys[_classID], _classID);

        delete studentKeys[_classID];
    }

    /** Student Management Functions */
    function addStudents(
        address[] memory _students,
        uint256 _classID
    ) external isNotPaused onlyAdmin isNotLocked {
        for (uint256 i = 0; i < _students.length; ++i) {
            address _studentAddress = _students[i];

            // Check if the address is zero or if the student does not exist.
            if (_studentAddress == address(0)) {
                revert Error_ZeroAddressNotAllowed();
            } else if (students[_studentAddress].exist) {
                revert Error_StudentAlreadyAssigned(_studentAddress);
            }

            // Add student data.
            User storage _newStudent = students[_studentAddress];
            _newStudent.key = _studentAddress;
            _newStudent.exist = true;
            _newStudent.class = _classID;

            studentKeys[_classID].push(_studentAddress);
            studentIndex[_studentAddress] = studentKeys[_classID].length - 1;
        }
    }

    function deleteStudents(
        address[] memory _students,
        uint256 _classID
    ) external isNotPaused onlyAdmin isNotLocked {
        // Delete student data.
        batchDeleteStudents(_students, _classID);
    }

    function updateStudent(
        address _studentAddress,
        uint256 _newClassID
    )
        external
        isNotPaused
        onlyTeacher
        isNotLocked
        requireStudentAssigned(_studentAddress)
        requireClassAssigned(_newClassID)
    {
        User storage _studentToUpdate = students[_studentAddress];
        _studentToUpdate.class = _newClassID;
    }

    /** Getter Functions */
    function getAllStudents(
        uint256 _classID
    ) external view isNotPaused onlyStudent returns (address[] memory) {
        return (studentKeys[_classID]);
    }

    function getStudent(
        address _studentAddress
    )
        external
        view
        isNotPaused
        onlyStudent
        requireStudentAssigned(_studentAddress)
        returns (User memory, Grade[] memory)
    {
        return (students[_studentAddress], grades[_studentAddress]);
    }

    /** Utility Functions */
    function batchDeleteStudents(
        address[] memory _students,
        uint256 _classID
    ) private {
        for (uint256 i = 0; i < _students.length; ++i) {
            address _studentAddress = _students[i];

            // Check if the address is zero or if the student exists.
            if (_studentAddress == address(0)) {
                revert Error_ZeroAddressNotAllowed();
            } else if (!students[_studentAddress].exist) {
                revert Error_StudentNotFound(_studentAddress);
            }

            // Delete student data.
            delete students[_studentAddress];

            address _lastStudentKey = studentKeys[_classID][
                studentKeys[_classID].length - 1
            ];
            uint256 _studentIndex = studentIndex[_studentAddress];

            studentIndex[_lastStudentKey] = _studentIndex;
            studentKeys[_classID][_studentIndex] = _lastStudentKey;
            studentKeys[_classID].pop();

            delete studentIndex[_studentAddress];

            // Emit an event for transparency.
            emit Event_StudentDeleted(_studentAddress);
        }
    }
}
