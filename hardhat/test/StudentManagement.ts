import { expect } from 'chai';
import { StudentManagement } from '../typechain-types';
import deployContractFixture from '../utils/deployContractFixture';

describe('Student Management Functionality', function () {
  type Student = [string, BigInt, boolean];

  let studentManagement: StudentManagement;
  let user1: any, user2: any, user3: any, user4: any, user5: any;
  let classes: number[], studentsA: string[], studentsB: string[];

  beforeEach(async function () {
    // Use the deployContractFixture function to deploy the contract.
    ({ user1, user2, user3, user4, user5, studentManagement } =
      await deployContractFixture());

    // Create an array of class IDs.
    classes = [1, 2, 3];

    // Create arrays of student addresses.
    studentsA = [user1.address, user2.address];
    studentsB = [user3.address, user4.address];

    // Check the initial total number of students is 0 in each class.
    expect(await studentManagement.getTotalStudents(1)).to.equal(0);
    expect(await studentManagement.getTotalStudents(2)).to.equal(0);
    expect(await studentManagement.getTotalStudents(3)).to.equal(0);
  });

  describe('Class CRUD Functionality', function () {
    describe('Add Classes', function () {
      it('should add classes correctly', async function () {
        // Add classes.
        await studentManagement.addClass(classes);

        // Check the total number of classes.
        expect(await studentManagement.getTotalClasses()).to.equal(3);

        // Check that the classes have been added correctly.
        expect(await studentManagement.getAllClasses()).to.deep.equal(classes);

        // Check the total number of students in each class.
        expect(await studentManagement.getTotalStudents(1)).to.equal(0);
        expect(await studentManagement.getTotalStudents(2)).to.equal(0);
        expect(await studentManagement.getTotalStudents(3)).to.equal(0);
      });

      it('should revert when adding classes as a non-owner', async function () {
        // Try to add classes as a non-owner.
        await expect(
          studentManagement.connect(user4).addClass(classes)
        ).to.be.revertedWithCustomError(
          studentManagement,
          'OwnableUnauthorizedAccount'
        );
      });

      it('should revert when providing no classes', async function () {
        // Try to add no classes.
        await expect(
          studentManagement.addClass([])
        ).to.be.revertedWithCustomError(studentManagement, 'NoClassesProvided');
      });

      it('should emit an error when adding the same class twice', async function () {
        // Add classes.
        await studentManagement.addClass([1]);

        // Try to add the same classes again.
        await expect(studentManagement.addClass([1]))
          .to.be.emit(studentManagement, 'ClassAdditionFailed_AlreadyExists')
          .withArgs(1);
      });

      it('should emit an event when adding a new class', async function () {
        // Add classes.
        await expect(studentManagement.addClass([1]))
          .to.emit(studentManagement, 'ClassCreated')
          .withArgs(1);
      });
    });

    describe('Delete Classes', function () {
      beforeEach(async function () {
        // Add classes.
        await studentManagement.addClass(classes);

        // Check the total number of classes.
        expect(await studentManagement.getTotalClasses()).to.equal(3);

        // Add students to classes.
        await studentManagement.registerStudents(studentsA, 1);
        await studentManagement.registerStudents(studentsB, 2);

        // Check the total number of students in each class.
        expect(await studentManagement.getTotalStudents(1)).to.equal(2);
        expect(await studentManagement.getTotalStudents(2)).to.equal(2);
      });

      it('should delete classes correctly', async function () {
        // Delete classes.
        await studentManagement.deleteClasses([1, 3]);

        // Check the total number of classes.
        expect(await studentManagement.getTotalClasses()).to.equal(1);

        // Check that the classes have been deleted correctly.
        expect(await studentManagement.getAllClasses()).to.deep.equal([2]);

        // Check the total number of students in each class.
        expect(await studentManagement.getTotalStudents(1)).to.equal(0);
        expect(await studentManagement.getTotalStudents(2)).to.equal(2);
      });

      it('should revert when deleting classes as a non-owner', async function () {
        // Try to delete classes as a non-owner.
        await expect(
          studentManagement.connect(user4).deleteClasses([1, 3])
        ).to.be.revertedWithCustomError(
          studentManagement,
          'OwnableUnauthorizedAccount'
        );
      });

      it('should revert when providing no classes', async function () {
        // Try to delete no classes.
        await expect(
          studentManagement.deleteClasses([])
        ).to.be.revertedWithCustomError(studentManagement, 'NoClassesProvided');
      });

      it('should revert when deleting classes when there is no registered classes', async function () {
        // Delete all classes.
        await studentManagement.deleteClasses(classes);

        // Try to delete classes when there are no registered classes.
        await expect(
          studentManagement.deleteClasses(classes)
        ).to.be.revertedWithCustomError(studentManagement, 'NoClassesToDelete');
      });

      it('should emit an event when deleting a class that does not exist', async function () {
        // Delete classes.
        await expect(studentManagement.deleteClasses([4]))
          .to.emit(studentManagement, 'ClassDeletionFailed_NotFound')
          .withArgs(4);
      });

      it('should emit an event when deleting a class that has no students', async function () {
        // Delete class.
        await expect(studentManagement.deleteClasses([3])).to.emit(
          studentManagement,
          'StudentDeletionFailed_NoStudentsToDelete'
        );
      });

      it('should emit an event when deleting a class', async function () {
        // Delete classes.
        await expect(studentManagement.deleteClasses([1]))
          .to.emit(studentManagement, 'ClassDeleted')
          .withArgs(1);
      });
    });
  });

  describe('Student CRUD Functionality', function () {
    beforeEach(async function () {
      // Add classes.
      await studentManagement.addClass(classes);

      // Check the total number of classes.
      expect(await studentManagement.getTotalClasses()).to.equal(3);
    });

    describe('Register Students', function () {
      it('should register students correctly', async function () {
        // Add students to classes.
        await studentManagement.registerStudents(studentsA, 1);
        await studentManagement.registerStudents(studentsB, 2);

        // Check the total number of students in each class.
        expect(await studentManagement.getTotalStudents(1)).to.equal(2);
        expect(await studentManagement.getTotalStudents(2)).to.equal(2);

        // Check that the students have been registered correctly.
        expect(await studentManagement.getAllStudents(1)).to.deep.equal(
          studentsA
        );
        expect(await studentManagement.getAllStudents(2)).to.deep.equal(
          studentsB
        );

        // Check that each students in class 1 have been registered with the correct details.
        for (let i = 0; i < studentsA.length; i++) {
          const student: Student = await studentManagement.getStudent(
            studentsA[i]
          );
          const studentRef: Student = [studentsA[i], BigInt(1), true];

          expect(student[0]).to.equal(studentRef[0]);
          expect(student[1]).to.equal(studentRef[1]);
          expect(student[2]).to.equal(studentRef[2]);
        }

        // Check that each students in class 2 have been registered with the correct details.
        for (let i = 0; i < studentsB.length; i++) {
          const student: Student = await studentManagement.getStudent(
            studentsB[i]
          );
          const studentRef: Student = [studentsB[i], BigInt(2), true];

          expect(student[0]).to.equal(studentRef[0]);
          expect(student[1]).to.equal(studentRef[1]);
          expect(student[2]).to.equal(studentRef[2]);
        }
      });

      it('should revert when registering students as a non-owner', async function () {
        // Try to register students as a non-owner.
        await expect(
          studentManagement.connect(user4).registerStudents(studentsA, 1)
        ).to.be.revertedWithCustomError(
          studentManagement,
          'OwnableUnauthorizedAccount'
        );
      });

      it('should revert when providing no students', async function () {
        // Try to register no students.
        await expect(
          studentManagement.registerStudents([], 1)
        ).to.be.revertedWithCustomError(
          studentManagement,
          'NoStudentsProvided'
        );
      });

      it.skip('should revert when registering students to a non-existent class', async function () {
        // Try to register students to a non-existent class.
      });

      it('should emit an event when registering a student with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Register a student with a zero address.
        await expect(
          studentManagement.registerStudents([zeroAddress], 1)
        ).to.be.emit(studentManagement, 'StudentAdditionFailed_ZeroAddress');
      });

      it('should emit an event when registering a student twice', async function () {
        // Register a new student.
        await studentManagement.registerStudents([studentsA[0]], 1);

        // Try to register the same student again.
        await expect(studentManagement.registerStudents([studentsA[0]], 1))
          .to.be.emit(studentManagement, 'StudentAdditionFailed_AlreadyExists')
          .withArgs(studentsA[0]);
      });

      it('should emit an event when registering students', async function () {
        // Register students.
        await expect(studentManagement.registerStudents(studentsA, 1))
          .to.emit(studentManagement, 'StudentRegistered')
          .withArgs(studentsA[0]);
      });
    });

    describe('Delete Students', function () {
      beforeEach(async function () {
        // Add students to classes.
        await studentManagement.registerStudents(studentsA, 1);
        await studentManagement.registerStudents(studentsB, 2);

        // Check the total number of students in each class.
        expect(await studentManagement.getTotalStudents(1)).to.equal(2);
        expect(await studentManagement.getTotalStudents(2)).to.equal(2);
      });

      it('should delete registered students correctly', async function () {
        // Delete students.
        await studentManagement.deleteStudents([studentsA[0]], 1);

        // Check the total number of students is correct.
        expect(await studentManagement.getTotalStudents(1)).to.equal(1);

        // Check that the correct students are registered.
        expect(await studentManagement.getAllStudents(1)).to.deep.equal([
          studentsA[1],
        ]);
      });

      it('should revert when deleting students as a non-owner', async function () {
        // Try to delete students as a non-owner.
        await expect(
          studentManagement.connect(user4).deleteStudents(studentsA, 1)
        ).to.be.revertedWithCustomError(
          studentManagement,
          'OwnableUnauthorizedAccount'
        );
      });

      it('should revert when providing no students', async function () {
        // Try to delete no students.
        await expect(
          studentManagement.deleteStudents([], 1)
        ).to.be.revertedWithCustomError(
          studentManagement,
          'NoStudentsProvided'
        );
      });

      it.skip('should revert when deleting students from a non-existent class', async function () {
        // Try to delete students from a non-existent class.
      });

      it('should revert when deleting students when there are no registered students', async function () {
        // Try to delete students when there are no registered students.
        await expect(
          studentManagement.deleteStudents(studentsA, 3)
        ).to.be.revertedWithCustomError(
          studentManagement,
          'NoStudentsToDelete'
        );
      });

      it('should emit an event when deleting a student with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Delete a student with a zero address.
        await expect(
          studentManagement.deleteStudents([zeroAddress], 1)
        ).to.be.emit(studentManagement, 'StudentDeletionFailed_ZeroAddress');
      });

      it('should emit an event when deleting a student that does not exist', async function () {
        // Delete a student.
        await expect(studentManagement.deleteStudents([user5.address], 1))
          .to.emit(studentManagement, 'StudentDeletionFailed_NotFound')
          .withArgs(user5.address);
      });

      it('should emit an event when deleting a student in another class', async function () {
        // Delete a student in another class.
        await expect(studentManagement.deleteStudents([studentsB[0]], 1))
          .to.emit(
            studentManagement,
            'StudentDeletionFailed_NotEnrolledInClass'
          )
          .withArgs(studentsB[0], 1);
      });

      it('should emit an event when deleting a student', async function () {
        // Delete a student.
        await expect(studentManagement.deleteStudents([studentsA[0]], 1))
          .to.emit(studentManagement, 'StudentDeleted')
          .withArgs(studentsA[0]);
      });
    });

    describe('Update Students', function () {
      beforeEach(async function () {
        // Add students to classes.
        await studentManagement.registerStudents(studentsA, 1);
        await studentManagement.registerStudents(studentsB, 2);

        // Check the total number of students in each class.
        expect(await studentManagement.getTotalStudents(1)).to.equal(2);
        expect(await studentManagement.getTotalStudents(2)).to.equal(2);
      });

      it('should update students correctly', async function () {
        // Update students.
        await studentManagement.updateStudent(studentsA[0], 1, 3);

        // Check that the student has been updated correctly.
        expect(await studentManagement.getStudent(studentsA[0])).to.deep.equal([
          studentsA[0],
          BigInt(3),
          true,
        ]);

        // Check that the correct students are in the correct classes.
        expect(await studentManagement.getAllStudents(1)).to.deep.equal([
          studentsA[1],
        ]);
        expect(await studentManagement.getAllStudents(3)).to.deep.equal([
          studentsA[0],
        ]);
      });

      it('should revert when updating a student as a non-owner or non-teacher', async function () {
        // Try to update a student as a non-owner or non-teacher.
        await expect(
          studentManagement.connect(user5).updateStudent(studentsA[0], 1, 3)
        ).to.be.revertedWithCustomError(
          studentManagement,
          'UnauthorizedAccount'
        );

        // Try to update a student as a student.
        await expect(
          studentManagement.connect(user1).updateStudent(studentsA[0], 1, 3)
        ).to.be.revertedWithCustomError(
          studentManagement,
          'UnauthorizedAccount'
        );
      });

      it('should revert when updating a student with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Update a student with a zero address.
        await expect(
          studentManagement.updateStudent(zeroAddress, 1, 3)
        ).to.be.revertedWithCustomError(
          studentManagement,
          'ZeroAddressNotAllowed'
        );
      });

      it('should revert when updating a student that does not exist', async function () {
        // Update a student that does not exist.
        await expect(studentManagement.updateStudent(user5.address, 1, 3))
          .to.be.revertedWithCustomError(studentManagement, 'StudentNotFound')
          .withArgs(user5.address);
      });

      it('should emit an event when updating a student', async function () {
        // Update a student.
        await expect(studentManagement.updateStudent(studentsA[0], 1, 3))
          .to.emit(studentManagement, 'StudentUpdated')
          .withArgs(studentsA[0]);
      });
    });
  });

  describe('Getters', function () {
    beforeEach(async function () {
      // Add classes.
      await studentManagement.addClass(classes);

      // Check the total number of classes.
      expect(await studentManagement.getTotalClasses()).to.equal(3);

      // Add students to classes.
      await studentManagement.registerStudents(studentsA, 1);
      await studentManagement.registerStudents(studentsB, 2);

      // Check the total number of students in each class.
      expect(await studentManagement.getTotalStudents(1)).to.equal(2);
      expect(await studentManagement.getTotalStudents(2)).to.equal(2);
    });

    it('should get classes correctly', async function () {
      // Get classes.
      expect(await studentManagement.getAllClasses()).to.deep.equal(classes);

      // Check total number of classes.
      expect(await studentManagement.getTotalClasses()).to.equal(3);
    });

    it('should get students correctly', async function () {
      // Get students.
      expect(await studentManagement.getAllStudents(1)).to.deep.equal(
        studentsA
      );
      expect(await studentManagement.getAllStudents(2)).to.deep.equal(
        studentsB
      );

      // Check total number of students in each class.
      expect(await studentManagement.getTotalStudents(1)).to.equal(2);
      expect(await studentManagement.getTotalStudents(2)).to.equal(2);
    });

    it('should get students in a class correctly', async function () {
      // Get students in a class.
      const student: Student = await studentManagement.getStudent(studentsA[0]);
      const studentRef: Student = [studentsA[0], BigInt(1), true];

      expect(student[0]).to.equal(studentRef[0]);
      expect(student[1]).to.equal(studentRef[1]);
      expect(student[2]).to.equal(studentRef[2]);
    });
  });

  describe('Interface Utility Functions Functionality', function () {
    beforeEach(async function () {
      // Add classes.
      await studentManagement.addClass(classes);

      // Check the total number of classes.
      expect(await studentManagement.getTotalClasses()).to.equal(3);

      // Add students to classes.
      await studentManagement.registerStudents(studentsA, 1);
      await studentManagement.registerStudents(studentsB, 2);

      // Check the total number of students in each class.
      expect(await studentManagement.getTotalStudents(1)).to.equal(2);
      expect(await studentManagement.getTotalStudents(2)).to.equal(2);
    });

    it('should check if a class is registered', async function () {
      // Check if a class is registered.
      expect(await studentManagement.doesClassExist(1)).to.equal(true);

      // Check if a class is not registered.
      expect(await studentManagement.doesClassExist(4)).to.equal(false);
    });

    it('should check if a student is registered', async function () {
      // Check if a student is registered.
      expect(await studentManagement.doesStudentExist(studentsA[0])).to.equal(
        true
      );

      // Check if a student is not registered.
      expect(await studentManagement.doesStudentExist(user5.address)).to.equal(
        false
      );
    });
  });
});
