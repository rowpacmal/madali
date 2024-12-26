# Documentation for GradingSystem Solidity Contract

The **GradingSystem** contract is designed to manage grades for students and teachers within a decentralized education platform.

---

## **Key Components**

### **Enums**

- `UserRole`: Represents roles in the system:
  - `Unauthorized`: Default role.
  - `Student`: For students.
  - `Teacher`: For teachers.
  - `Admin`: For the contract owner.

### **Structs**

- `Grade`: Represents a grade with the following attributes:
  - `student`: Address of the student.
  - `teacher`: Address of the teacher assigning the grade.
  - `course`: Identifier for the course.
  - `id`: Unique grade ID.
  - `module`: Module number within the course.
  - `grade`: Numeric grade.
  - `exists`: Boolean to check if the grade exists.

---

## **State Variables**

- `studentContract`: Reference to the `IStudentManagement` contract.
- `teacherContract`: Reference to the `ITeacherManagement` contract.
- `gradeIDCounter`: Counter for unique grade IDs.
- `gradeID`: Maps student addresses to their list of grade IDs.
- `gradeIndex`: Maps grade IDs to their index in a student's list.
- `grades`: Maps grade IDs to `Grade` details.

---

## **Events**

- `GradeAdded(address indexed student, uint256 indexed grade)`: Triggered when a grade is added.
- `GradeDeleted(address indexed student, uint256 indexed grade)`: Triggered when a grade is deleted.
- `GradeUpdated(uint256 indexed grade, uint8 indexed assignedGrade, uint8 indexed newAssignedGrade)`: Triggered when a grade is updated.
- `GradeAdditionFailed_StudentNotFound(address indexed student)`: Triggered when a grade addition fails due to a missing student.
- `GradeAdditionFailed_ZeroAddress()`: Triggered when a grade addition fails due to an invalid address.

---

## **Errors**

- `CourseNotFound(uint256 course)`: Course not found.
- `GradeAlreadyAssigned(uint256 course, uint8 module)`: Grade already exists for the module.
- `GradeNotFound(uint256 grade)`: Grade not found.
- `NoGradesProvided()`: No grades were provided.
- `NoStudentsProvided()`: No student addresses were provided.
- `StudentsGradesLengthMismatch(uint256 studentsLength, uint256 gradesLength)`: Mismatch in the number of students and grades.
- `UnauthorizedAccount(address caller)`: Caller is not authorized.

---

## **Constructor**

- Initializes the `studentContract` and `teacherContract` with their respective addresses.

---

## **Modifiers**

1. `onlyAuthorizedStudent(address _studentAddress)`: Ensures the caller is either:

   - The student themselves,
   - A teacher, or
   - The contract owner.

2. `onlyAuthorizedTeacher(address _teacherAddress)`: Ensures the caller is either:

   - The teacher themselves, or
   - The contract owner.

3. `provideGrades(uint8[] memory _grades)`: Checks if grades array is not empty.

4. `provideStudents(address[] memory _students)`: Checks if students array is not empty.

5. `requireAssignedGrade(uint256 _gradeID)`: Ensures the grade with `_gradeID` exists.

---

## **Functions**

### **Management Functions**

1. **`addGrades(address[] memory _students, uint8[] memory _grades, uint256 _courseID, uint8 _module)`**

   - Adds grades for multiple students.
   - Only authorized teachers can call this function.
   - Emits `GradeAdded` on success.
   - Emits `GradeAdditionFailed_StudentNotFound` or `GradeAdditionFailed_ZeroAddress` if student issues arise.

2. **`deleteGrade(uint256 _gradeID)`**

   - Deletes a grade by its ID.
   - Only the contract owner can call this function.
   - Emits `GradeDeleted` on success.

3. **`updateGrade(uint256 _gradeID, uint8 _newGrade)`**
   - Updates an existing grade with a new value.
   - Only authorized teachers can call this function.
   - Emits `GradeUpdated` on success.

### **Getter Functions**

1. **`getAllGradesByStudent(address _studentAddress)`**

   - Returns all grade IDs associated with a student.

2. **`getGrade(uint256 _gradeID)`**

   - Retrieves details of a grade by its ID.

3. **`getTotalGradesByStudent(address _studentAddress)`**

   - Returns the total number of grades for a student.

4. **`getUserRole(address _userAddress)`**
   - Determines the role of a user (e.g., Student, Teacher, Admin).

### **Utility Functions**

1. **`updateStudentAndTeacherContracts(address _newStudentContractAddress, address _newTeacherContractAddress)`**

   - Updates the addresses of the student and teacher contract dependencies.
   - Only the contract owner can call this function.

2. **`doesGradeExist(uint256 _gradeID)`**
   - Checks if a grade exists.

---

## **Usage Notes**

- **Role-Based Access Control**: Functions use modifiers to enforce access rules based on the caller's role.
- **Batch Operations**: `addGrades` supports batch grade assignment, ensuring scalability.
- **Error Handling**: Custom errors and events provide detailed feedback for debugging and error management.
- **Modular Design**: Integrates with external student and teacher management contracts for flexibility.

---

## **Potential Future Enhancements**

- Deprecate `getUserRole` for a more robust role management system.
- Improve error reporting with additional details (e.g., specific grade/course context).
