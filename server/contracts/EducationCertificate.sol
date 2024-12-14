// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./AccessControl.sol";
import "./interfaces/IGradingSystem.sol";
import "./interfaces/IStudentManagement.sol";
import "./interfaces/ITeacherManagement.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EducationCertificate is AccessControl, ERC721 {
    /** Structs */
    struct Certificate {
        address owner;
        string imageURL;
        uint256 grade;
        uint256 id;
        bool exists;
    }

    /** State Variables */
    IGradingSystem public gradingContract;
    IStudentManagement public studentContract;
    ITeacherManagement public teacherContract;
    uint256 private certificateIDCounter;
    mapping(uint256 => Certificate) private certificates;

    /** Events */

    /** Errors */
    error CertificateNotFound(uint256 certificate);
    error GradeNotFound(uint256 grade);
    error UnauthorizedAccount(address caller);

    /** Constructor */
    constructor(
        address _gradingContractAddress,
        address _studentContractAddress,
        address _teacherContractAddress
    ) ERC721("MadaliCertificate", "MDLC") {
        gradingContract = IGradingSystem(_gradingContractAddress);
        studentContract = IStudentManagement(_studentContractAddress);
        teacherContract = ITeacherManagement(_teacherContractAddress);
    }

    /** Modifiers */
    modifier onlyAuthorizedTeacher(address _teacherAddress) {
        bool isTeacherAndSelf = teacherContract.doesTeacherExist(msg.sender) &&
            msg.sender == _teacherAddress;
        bool isOwner = msg.sender == owner();

        if (!isTeacherAndSelf && !isOwner) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    modifier requireAssignedCertificate(uint256 _certificateID) {
        if (!certificates[_certificateID].exists) {
            revert CertificateNotFound(_certificateID);
        }
        _;
    }

    modifier requireAssignedGrade(uint256 _gradeID) {
        if (!gradingContract.doesGradeExist(_gradeID)) {
            revert GradeNotFound(_gradeID);
        }
        _;
    }

    /** Management Functions */
    function mintCertificate(
        address _to,
        uint256 _gradeID,
        uint256 _courseID,
        string memory _imageURL
    )
        external
        onlyAuthorizedTeacher(teacherContract.getCourseTeacher(_courseID))
        whenNotPaused
        whenNotLocked
        validAddress(_to)
        requireAssignedGrade(_gradeID)
    {
        uint256 _certificateID = certificateIDCounter;
        ++certificateIDCounter;

        _mint(_to, _certificateID);

        // Store certificate metadata
        certificates[_certificateID] = Certificate({
            owner: _to,
            imageURL: _imageURL,
            grade: _gradeID,
            id: _certificateID,
            exists: true
        });
    }

    function updateCertificate(
        uint256 _certificateID,
        address _newOwner,
        string memory _newImageURL
    )
        external
        onlyOwner
        whenNotPaused
        whenNotLocked
        validAddress(_newOwner)
        requireAssignedCertificate(_certificateID)
    {
        Certificate storage _certificateToUpdate = certificates[_certificateID];

        _certificateToUpdate.owner = _newOwner;
        _certificateToUpdate.imageURL = _newImageURL;
    }

    /** Getter Functions */
    function getCertificate(
        uint256 _certificateID
    )
        external
        view
        requireAssignedCertificate(_certificateID)
        returns (Certificate memory)
    {
        return certificates[_certificateID];
    }

    /** Injection Functions */
    function updateStudentAndTeacherContracts(
        address _newGradingContractAddress,
        address _newStudentContractAddress,
        address _newTeacherContractAddress
    )
        external
        onlyOwner
        validAddress(_newGradingContractAddress)
        validAddress(_newStudentContractAddress)
        validAddress(_newTeacherContractAddress)
    {
        gradingContract = IGradingSystem(_newGradingContractAddress);
        studentContract = IStudentManagement(_newStudentContractAddress);
        teacherContract = ITeacherManagement(_newTeacherContractAddress);
    }
}
