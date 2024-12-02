// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Madali {
    // Structs
    struct Class {
        address teacher;
        address[] students;
        bool exist;
    }

    struct Course {
        address teacher;
        bool exist;
        uint256 class;
    }

    struct Student {
        bool exist;
        mapping(uint256 => mapping(uint256 => uint256)) grades;
        uint256 class;
    }

    struct Teacher {
        bool exist;
        uint256 class;
        uint256[] courses;
    }

    // Variables
    address public admin;

    // Mappings

    // Events

    // Errors

    // Constructor
    constructor() {
        admin = msg.sender;
    }

    // Modifiers

    // Functions
}
