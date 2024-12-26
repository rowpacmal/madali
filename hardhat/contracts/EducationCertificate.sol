// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Import custom AccessControl contract, and the student, teacher and grading contract interfaces.
import "./AccessControl.sol";
import "./interfaces/IGradingSystem.sol";
import "./interfaces/IStudentManagement.sol";
import "./interfaces/ITeacherManagement.sol";

// Import OpenZeppelin contract, ERC721, for NFT management.
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
    event CertificateCreated(uint256 indexed certificate);
    event CertificateUpdated(uint256 indexed certificate);

    /** Errors */
    error CertificateNotFound(uint256 certificate);
    error CourseNotFound(uint256 course);
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
    // This modifier is used to check if the caller is an authorized teacher.
    modifier onlyAuthorizedTeacher(address _teacherAddress) {
        bool isTeacherAndSelf = teacherContract.doesTeacherExist(msg.sender) &&
            msg.sender == _teacherAddress;
        bool isOwner = msg.sender == owner();

        if (!isTeacherAndSelf && !isOwner) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    // This modifier is used to check if the certificate exists.
    modifier requireAssignedCertificate(uint256 _certificateID) {
        if (!certificates[_certificateID].exists) {
            revert CertificateNotFound(_certificateID);
        }
        _;
    }

    // This modifier is used to check if the grade exists.
    modifier requireAssignedGrade(uint256 _gradeID) {
        if (!gradingContract.doesGradeExist(_gradeID)) {
            revert GradeNotFound(_gradeID);
        }
        _;
    }

    /** Management Functions */
    // This function is used to mint certificates to students.
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
        // Get the certificate ID.
        uint256 _certificateID = certificateIDCounter;
        ++certificateIDCounter;

        // Mint the certificate.
        _mint(_to, _certificateID);

        // Should add URI here in the future, with the NFT metadata.
        // Why it's omitted for now is because the contract will not be deployed to a non-local testnet or mainnet yet.
        // Also hardhat seems to have an issue with presenting the URI metadata in a connected MetaMask wallet.
        // As for now, it works and it's possible to mint certificates.

        // Store certificate data.
        certificates[_certificateID] = Certificate({
            owner: _to,
            imageURL: _imageURL,
            grade: _gradeID,
            id: _certificateID,
            exists: true
        });

        // Emit the event.
        emit CertificateCreated(_certificateID);
    }

    // This function is used to update the owner and image URL of a certificate.
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
        // Update the certificate.
        Certificate storage _certificateToUpdate = certificates[_certificateID];

        _certificateToUpdate.owner = _newOwner;
        _certificateToUpdate.imageURL = _newImageURL;

        // Emit the event.
        emit CertificateUpdated(_certificateID);
    }

    /** Getter Functions */
    // This function is used to get a certificate.
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

    // This function is used to get the total number of certificates. (This only returns the current certificate ID counter. It works for now as there is no delete function for certificates. But in the future will be deprecated and changed in favor of a better system.)
    function getTotalCertificates() external view returns (uint256) {
        return certificateIDCounter;
    }

    /** Injection Functions */
    // This function is used to update the linked contracts.
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
