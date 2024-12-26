# Education Certificate Contract Documentation

## Overview

The **EducationCertificate** contract is a system for issuing, managing, and verifying education certificates as ERC721 NFTs. It leverages OpenZeppelin's ERC721 implementation for tokenization and integrates with custom student, teacher, and grading management contracts for data consistency and access control.

---

## Features

1. **Minting Certificates:** Issue education certificates to students as NFTs.
2. **Certificate Management:** Update certificate ownership and associated image URLs.
3. **Access Control:** Enforces role-based access through modifiers and linked external contracts.
4. **Integration with External Systems:** Communicates with grading, student, and teacher management contracts for consistency and validation.

---

## Components

### 1. **Structs**

- **`Certificate`**  
  Stores information about a certificate:
  - `owner`: The current owner of the certificate.
  - `imageURL`: A URL pointing to the certificate's image.
  - `grade`: The grade associated with the certificate.
  - `id`: Unique identifier of the certificate.
  - `exists`: Boolean indicating if the certificate exists.

---

### 2. **State Variables**

- **`gradingContract`**: Interface to the grading management system.
- **`studentContract`**: Interface to the student management system.
- **`teacherContract`**: Interface to the teacher management system.
- **`certificateIDCounter`**: Counter for generating unique certificate IDs.
- **`certificates`**: Mapping of certificate IDs to `Certificate` structs.

---

### 3. **Events**

- **`CertificateCreated(uint256 indexed certificate)`**: Emitted when a certificate is minted.
- **`CertificateUpdated(uint256 indexed certificate)`**: Emitted when a certificate is updated.

---

### 4. **Errors**

- **`CertificateNotFound(uint256 certificate)`**: Thrown when attempting to access a non-existent certificate.
- **`GradeNotFound(uint256 grade)`**: Thrown when attempting to use a non-existent grade.
- **`UnauthorizedAccount(address caller)`**: Thrown when an unauthorized user tries to perform an action.

---

### 5. **Modifiers**

- **`onlyAuthorizedTeacher(address _teacherAddress)`**: Restricts access to authorized teachers or the contract owner.
- **`requireAssignedCertificate(uint256 _certificateID)`**: Ensures a certificate exists before performing an operation.
- **`requireAssignedGrade(uint256 _gradeID)`**: Ensures the specified grade exists in the grading system.

---

### 6. **Constructor**

Initializes the contract with addresses of the grading, student, and teacher management contracts:

```solidity
constructor(
    address _gradingContractAddress,
    address _studentContractAddress,
    address _teacherContractAddress
) ERC721("MadaliCertificate", "MDLC")
```

---

## Key Functions

### 1. **Management Functions**

#### `mintCertificate`

Mint a new certificate as an NFT and assign it to a student:

```solidity
function mintCertificate(
    address _to,
    uint256 _gradeID,
    uint256 _courseID,
    string memory _imageURL
)
```

**Parameters:**

- `_to`: Address of the student.
- `_gradeID`: Associated grade.
- `_courseID`: Course ID for validation.
- `_imageURL`: Image URL for the certificate.

**Requirements:**

- Caller must be an authorized teacher for the course.
- Grade must exist.

#### `updateCertificate`

Update the ownership and image URL of an existing certificate:

```solidity
function updateCertificate(
    uint256 _certificateID,
    address _newOwner,
    string memory _newImageURL
)
```

**Parameters:**

- `_certificateID`: ID of the certificate to update.
- `_newOwner`: New owner address.
- `_newImageURL`: New image URL.

**Requirements:**

- Only the owner can perform this action.
- Certificate must exist.

---

### 2. **Getter Functions**

#### `getCertificate`

Retrieve certificate details by ID:

```solidity
function getCertificate(uint256 _certificateID) external view returns (Certificate memory)
```

**Returns:**  
A `Certificate` struct containing the details.

#### `getTotalCertificates`

Get the total number of certificates issued:

```solidity
function getTotalCertificates() external view returns (uint256)
```

---

### 3. **Injection Functions**

#### `updateStudentAndTeacherContracts`

Update the linked contracts for grading, student, and teacher management:

```solidity
function updateStudentAndTeacherContracts(
    address _newGradingContractAddress,
    address _newStudentContractAddress,
    address _newTeacherContractAddress
)
```

**Parameters:**

- `_newGradingContractAddress`: New grading contract address.
- `_newStudentContractAddress`: New student contract address.
- `_newTeacherContractAddress`: New teacher contract address.

**Requirements:**

- Caller must be the contract owner.

---

## Access Control

The contract integrates with external student, teacher, and grading management systems to enforce role-based access and ensure that operations are performed only by authorized individuals.

---

## Notes

- **Metadata:** Currently, the URI for NFT metadata is omitted due to testing limitations.
- **Future Improvements:**
  - Implement a proper URI system for certificates.
  - Replace `getTotalCertificates` with a more robust system when deletion of certificates is introduced.
