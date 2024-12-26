# Student Management Contract Documentation

The **StudentManagement** contract provides functionality for managing students and classes in an educational system. It includes functionality for registering, updating, and deleting students and classes in batches, and integrates with a teacher management system.

---

## **Key Features**

1. **Class Management**:

   - Add or delete classes in batches.
   - Retrieve all or specific class details.

2. **Student Management**:

   - Register, update, or delete students in batches.
   - Retrieve all or specific student details.

3. **Access Control**:

   - Basic access control for contract Owner.
   - Integration with an external Teacher Management contract.

4. **Event-Driven Design**:

   - Emits events for class and student actions, aiding in monitoring and debugging.

5. **Error Handling**:
   - Custom errors for invalid operations like unauthorized access, empty inputs, or nonexistent entities.

---

## **State Variables**

- **Structs**:

  - `Class`: Stores the `id` and existence status of a class.
  - `Student`: Stores the student's `address`, `class` assignment, and existence status.

- **Mappings**:

  - `classes`: Maps a class ID to its details.
  - `students`: Maps a student's address to their details.
  - `studentKeys`: Maps a class ID to an array of student addresses.
  - `classIndex`, `studentIndex`: Help manage index-based operations for classes and students.

- **Other Variables**:
  - `teacherContract`: Address of the Teacher Management contract.
  - `classID`: Array of active class IDs.

---

## **Modifiers**

1. **`onlyStudent`**: Ensures the caller is a student, teacher, or owner.
2. **`onlyTeacher`**: Ensures the caller is a teacher or owner.
3. **`provideClasses`**: Ensures provided class list is non-empty.
4. **`provideStudents`**: Ensures provided student list is non-empty.
5. **`validAddress`**: Ensures the provided address is not zero.

---

## **Core Functions**

### **Class Management**

1. `addClass(uint16[] memory _classes)`: Adds multiple classes.

   - Emits `ClassCreated` or `ClassAdditionFailed_AlreadyExists`.

2. `deleteClasses(uint16[] memory _classes)`: Deletes multiple classes.

   - Emits `ClassDeleted` or `ClassDeletionFailed_NotFound`.

3. `getAllClasses()`: Returns all active class IDs.

4. `getTotalClasses()`: Returns the total number of classes.

---

### **Student Management**

1. `registerStudents(address[] memory _students, uint16 _classID)`: Registers multiple students to a class.

   - Emits `StudentRegistered`, `StudentAdditionFailed_AlreadyExists`, or `StudentAdditionFailed_ZeroAddress`.

2. `updateStudent(address _studentAddress, uint16 _oldClassID, uint16 _newClassID)`: Updates a student's class assignment.

   - Emits `StudentUpdated`.

3. `deleteStudents(address[] memory _students, uint16 _classID)`: Deletes multiple students from a class.

   - Emits `StudentDeleted` or relevant failure events.

4. `getAllStudents(uint16 _classID)`: Returns all students in a specific class.

5. `getStudent(address _studentAddress)`: Retrieves details of a specific student.

6. `getTotalStudents(uint16 _classID)`: Returns the total number of students in a class.

---

### **Utility Functions**

1. `batchDeleteStudents(address[] memory _students, uint16 _classID)`: Deletes multiple students internally.
   - Handles zero addresses, nonexistent students, or students not enrolled in a class.

---

### **Injection Functions**

1. `updateTeacherContract(address _newTeacherContractAddress)`: Updates the Teacher Management contract address.

---

### **Interface Functions**

1. `doesClassExist(uint16 _classID)`: Checks if a class exists.
2. `doesStudentExist(address _studentAddress)`: Checks if a student exists.

---

## **Events**

1. **Class Events**:

   - `ClassCreated`: Triggered when a class is successfully created.
   - `ClassDeleted`: Triggered when a class is successfully deleted.
   - `ClassAdditionFailed_AlreadyExists`: Triggered if a class being added already exists.
   - `ClassDeletionFailed_NotFound`: Triggered if a class being deleted does not exist.

2. **Student Events**:
   - `StudentRegistered`: Triggered when a student is successfully registered.
   - `StudentUpdated`: Triggered when a student's details are updated.
   - `StudentDeleted`: Triggered when a student is successfully deleted.
   - Failure events for various invalid scenarios (e.g., `StudentAdditionFailed_ZeroAddress`, `StudentDeletionFailed_NotFound`).

---

## **Custom Errors**

1. `UnauthorizedAccount(address caller)`: Raised for unauthorized access attempts.
2. `NoClassesProvided`, `NoClassesToDelete`: Raised for empty class input or no classes available to delete.
3. `NoStudentsProvided`, `NoStudentsToDelete`: Raised for empty student input or no students available to delete.
4. `StudentNotFound(address student)`: Raised when a student does not exist.
5. `TeacherContractNotFound`: Raised if the Teacher Management contract is not set.

---

## **Access Control**

- **Owner**:
  - Add/delete classes and students.
  - Update Teacher Management contract.
- **Teacher**:
  - Update student details.
- **Student**:
  - (Currently unused but provisioned for access checks).

---

## **Notes**

- The contract integrates with an external Teacher Management contract via the `ITeacherManagement` interface.
- Pausability and locking features (assumed inherited from `AccessControl`) prevent updates during critical operations.
- Designed for batch operations to efficiently manage large datasets.
