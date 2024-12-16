import { expect } from 'chai';
import {
  GradingSystem,
  StudentManagement,
  TeacherManagement,
} from '../typechain-types';
import deployContractFixture from '../utils/deployContractFixture';

describe('Grading System Functionality', function () {
  type Grade = [string, string, BigInt, BigInt, BigInt, BigInt, boolean];

  let studentManagement: StudentManagement;
  let teacherManagement: TeacherManagement;
  let gradingSystem: GradingSystem;
  let owner: any,
    user1: any,
    user2: any,
    user3: any,
    user4: any,
    user5: any,
    user6: any,
    user7: any,
    user8: any;
  let courses: number[],
    classes: number[],
    grades: number[],
    modules: number[],
    teachers: string[],
    studentsA: string[],
    studentsB: string[];

  beforeEach(async function () {
    // Use the deployContractFixture function to deploy the contract.
    ({
      owner,
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
      studentManagement,
      teacherManagement,
      gradingSystem,
    } = await deployContractFixture());

    // Create an initial test arrays.
    teachers = [user1.address, user2.address, user3.address];
    studentsA = [user4.address, user5.address];
    studentsB = [user6.address, user7.address];
    courses = [1, 2, 3];
    classes = [1, 2, 3];
    modules = [5, 5, 5];
    grades = [4, 6];

    // Add classes.
    await studentManagement.addClass(classes);

    // Add students.
    await studentManagement.registerStudents(studentsA, 1);
    await studentManagement.registerStudents(studentsB, 2);

    // Add teachers.
    await teacherManagement.registerTeachers(teachers, classes);

    // Add courses.
    await teacherManagement.registerCourse(
      teachers[0],
      courses,
      classes,
      modules
    );
  });

  describe('Grade CRUD Functionality', function () {
    describe('Add Grades', function () {
      it('should add grades correctly', async function () {
        // Add grades.
        await gradingSystem
          .connect(user1)
          .addGrades(studentsA, grades, courses[0], 1);

        // Check that the total number of grades is correct.
        expect(
          await gradingSystem.getTotalGradesByStudent(studentsA[0])
        ).to.equal(1);
        expect(
          await gradingSystem.getTotalGradesByStudent(studentsA[1])
        ).to.equal(1);

        // Check that the grades have been added correctly.
        expect(
          await gradingSystem.getAllGradesByStudent(studentsA[0])
        ).to.deep.equal([0]);
        expect(
          await gradingSystem.getAllGradesByStudent(studentsA[1])
        ).to.deep.equal([1]);

        // Check that the grades details are correct for each student.
        const gradeA: Grade = await gradingSystem.getGrade(0);
        const gradeARef: Grade = [
          studentsA[0],
          teachers[0],
          BigInt(courses[0]),
          BigInt(0),
          BigInt(1),
          BigInt(grades[0]),
          true,
        ];

        expect(gradeA[0]).to.equal(gradeARef[0]);
        expect(gradeA[1]).to.equal(gradeARef[1]);
        expect(gradeA[2]).to.equal(gradeARef[2]);
        expect(gradeA[3]).to.equal(gradeARef[3]);
        expect(gradeA[4]).to.equal(gradeARef[4]);
        expect(gradeA[5]).to.equal(gradeARef[5]);
        expect(gradeA[6]).to.equal(gradeARef[6]);

        const gradeB: Grade = await gradingSystem.getGrade(1);
        const gradeBRef: Grade = [
          studentsA[1],
          teachers[0],
          BigInt(courses[0]),
          BigInt(1),
          BigInt(1),
          BigInt(grades[1]),
          true,
        ];

        expect(gradeB[0]).to.equal(gradeBRef[0]);
        expect(gradeB[1]).to.equal(gradeBRef[1]);
        expect(gradeB[2]).to.equal(gradeBRef[2]);
        expect(gradeB[3]).to.equal(gradeBRef[3]);
        expect(gradeB[4]).to.equal(gradeBRef[4]);
        expect(gradeB[5]).to.equal(gradeBRef[5]);
        expect(gradeB[6]).to.equal(gradeBRef[6]);
      });

      it('should revert if a non-owner or non-teacher tries to add a grade', async function () {
        // Try to add a grade as a non-teacher.
        await expect(
          gradingSystem.connect(user4).addGrades(studentsA, grades, 1, 1)
        ).to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount');

        await expect(
          gradingSystem.connect(user8).addGrades(studentsA, grades, 1, 1)
        ).to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount');
      });

      it('should revert if no students or grades are provided', async function () {
        // Try to add a grade with no students.
        await expect(
          gradingSystem.connect(user1).addGrades([], grades, courses[0], 1)
        ).to.be.revertedWithCustomError(gradingSystem, 'NoStudentsProvided');

        // Try to add a grade with no grades.
        await expect(
          gradingSystem.connect(user1).addGrades(studentsA, [], courses[0], 1)
        ).to.be.revertedWithCustomError(gradingSystem, 'NoGradesProvided');
      });

      it('should revert if students and grades array lengths do not match', async function () {
        // Try to add a grade with mismatched lengths.
        await expect(
          gradingSystem
            .connect(user1)
            .addGrades(studentsA, [grades[0]], courses[0], 1)
        ).to.be.revertedWithCustomError(
          gradingSystem,
          'StudentsGradesLengthMismatch'
        );

        await expect(
          gradingSystem
            .connect(user1)
            .addGrades([studentsA[0]], grades, courses[0], 1)
        ).to.be.revertedWithCustomError(
          gradingSystem,
          'StudentsGradesLengthMismatch'
        );
      });

      it('should revert if course does not exist', async function () {
        // Try to add a grade to a course that does not exist.
        await expect(
          gradingSystem.connect(user1).addGrades(studentsA, grades, 4, 1)
        ).to.be.revertedWithCustomError(gradingSystem, 'CourseNotFound');
      });

      it('should emit an event when adding a grade to a student with a zero address', async function () {
        const zeroAddress: string =
          '0x0000000000000000000000000000000000000000';

        // Add a grade to a student with a zero address.
        await expect(
          gradingSystem
            .connect(user1)
            .addGrades([zeroAddress], [grades[0]], 1, 1)
        ).to.emit(gradingSystem, 'GradeAdditionFailed_ZeroAddress');
      });

      it('should emit an event when adding a grade to a student that does not exist', async function () {
        // Add a grade to a student that does not exist.
        await expect(
          gradingSystem
            .connect(user1)
            .addGrades([user8.address], [grades[0]], 1, 1)
        )
          .to.emit(gradingSystem, 'GradeAdditionFailed_StudentNotFound')
          .withArgs(user8.address);
      });

      it('should emit an event when adding a grade to a student', async function () {
        // Add a grade to a student.
        await expect(
          gradingSystem
            .connect(user1)
            .addGrades([studentsA[0]], [grades[0]], 1, 1)
        )
          .to.emit(gradingSystem, 'GradeAdded')
          .withArgs(studentsA[0], 0);
      });
    });

    describe('Delete Grades', function () {
      beforeEach(async function () {
        // Add grades.
        await gradingSystem
          .connect(user1)
          .addGrades([studentsA[0]], [grades[0]], courses[0], 1);

        // Check that the total number of grades is correct.
        expect(
          await gradingSystem.getTotalGradesByStudent(studentsA[0])
        ).to.equal(1);

        // Check that the grades have been added correctly.
        expect(
          await gradingSystem.getAllGradesByStudent(studentsA[0])
        ).to.deep.equal([0]);
      });

      it('should delete a grade correctly', async function () {
        // Delete a grade.
        await gradingSystem.deleteGrade(0);

        // Check that the grade was deleted.
        await expect(gradingSystem.getGrade(0)).to.be.reverted;

        // Check that the total number of grades is correct.
        expect(
          await gradingSystem.getTotalGradesByStudent(studentsA[0])
        ).to.equal(0);

        // Check that the grades have been deleted correctly.
        expect(
          await gradingSystem.getAllGradesByStudent(studentsA[0])
        ).to.deep.equal([]);
      });

      it('should revert when deleting as a non-owner', async function () {
        // Try to delete a grade as a non-owner.
        await expect(
          gradingSystem.connect(user1).deleteGrade(0)
        ).to.be.revertedWithCustomError(
          gradingSystem,
          'OwnableUnauthorizedAccount'
        );

        await expect(
          gradingSystem.connect(user8).deleteGrade(0)
        ).to.be.revertedWithCustomError(
          gradingSystem,
          'OwnableUnauthorizedAccount'
        );
      });

      it('should revert when deleting a grade that does not exist', async function () {
        // Try to delete a grade that does not exist.
        await expect(
          gradingSystem.deleteGrade(2)
        ).to.be.revertedWithCustomError(gradingSystem, 'GradeNotFound');
      });

      it('should emit an event when deleting a grade', async function () {
        // Delete a grade.
        await expect(gradingSystem.deleteGrade(0))
          .to.emit(gradingSystem, 'GradeDeleted')
          .withArgs(studentsA[0], 0);
      });
    });

    describe('Update Grades', function () {
      beforeEach(async function () {
        // Add grades.
        await gradingSystem
          .connect(user1)
          .addGrades([studentsA[0]], [grades[0]], courses[0], 1);

        // Check that the total number of grades is correct.
        expect(
          await gradingSystem.getTotalGradesByStudent(studentsA[0])
        ).to.equal(1);

        // Check that the grades have been added correctly.
        expect(
          await gradingSystem.getAllGradesByStudent(studentsA[0])
        ).to.deep.equal([0]);
      });

      it('should update a grade correctly', async function () {
        // Check the assigned grade.
        expect((await gradingSystem.getGrade(0)).grade).to.deep.equal(4);

        // Update a grade.
        await gradingSystem.connect(user1).updateGrade(0, 6);

        // Check that the grade was updated.
        expect((await gradingSystem.getGrade(0)).grade).to.deep.equal(6);
      });

      it('should revert when updating as a non-teacher', async function () {
        // Try to update a grade as a non-teacher.
        await expect(
          gradingSystem.connect(user4).updateGrade(0, 6)
        ).to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount');
        await expect(
          gradingSystem.connect(user8).updateGrade(0, 6)
        ).to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount');
      });

      it('should revert when updating a grade that does not exist', async function () {
        // Try to update a grade that does not exist.
        await expect(
          gradingSystem.connect(user1).updateGrade(1, 6)
        ).to.be.revertedWithCustomError(gradingSystem, 'CourseNotFound');
      });

      it('should emit an event when updating a grade', async function () {
        // Update a grade.
        await expect(gradingSystem.connect(user1).updateGrade(0, 6))
          .to.emit(gradingSystem, 'GradeUpdated')
          .withArgs(0, grades[0], 6);
      });
    });
  });

  describe('Getter Functionality', function () {
    beforeEach(async function () {
      // Add grades.
      await gradingSystem
        .connect(user1)
        .addGrades([studentsA[0]], [grades[0]], courses[0], 1);
    });

    it('should get a grade correctly', async function () {
      const grade: Grade = await gradingSystem.getGrade(0);
      const gradeRef: Grade = [
        studentsA[0],
        teachers[0],
        BigInt(courses[0]),
        BigInt(0),
        BigInt(1),
        BigInt(grades[0]),
        true,
      ];

      // Verify that the grade details is correct.
      expect(grade[0]).to.equal(gradeRef[0]);
      expect(grade[1]).to.equal(gradeRef[1]);
      expect(grade[2]).to.equal(gradeRef[2]);
      expect(grade[3]).to.equal(gradeRef[3]);
      expect(grade[4]).to.equal(gradeRef[4]);
      expect(grade[5]).to.equal(gradeRef[5]);
      expect(grade[6]).to.equal(gradeRef[6]);
    });

    it('should get all grades and the total number of grades correctly', async function () {
      // Verify that the grades is correct.
      expect(
        await gradingSystem.getAllGradesByStudent(studentsA[0])
      ).to.deep.equal([0]);

      // Verify that the total number of grades is correct.
      expect(
        await gradingSystem.getTotalGradesByStudent(studentsA[0])
      ).to.equal(1);
    });

    it('should revert when using the getters as a non-student, non-teacher or non-owner', async function () {
      // Try to get a grade as a non-student, non-teacher or non-owner.
      await expect(gradingSystem.connect(user8).getGrade(0))
        .to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount')
        .withArgs(user8.address);
      await expect(
        gradingSystem.connect(user8).getAllGradesByStudent(studentsA[0])
      )
        .to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount')
        .withArgs(user8.address);
      await expect(
        gradingSystem.connect(user8).getTotalGradesByStudent(studentsA[0])
      )
        .to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount')
        .withArgs(user8.address);
    });

    it('should revert when using the getters as not the authorized student', async function () {
      // Try to get a grade as a non-student, non-teacher or non-owner.
      await expect(gradingSystem.connect(user5).getGrade(0))
        .to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount')
        .withArgs(user5.address);
      await expect(
        gradingSystem.connect(user5).getAllGradesByStudent(studentsA[0])
      )
        .to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount')
        .withArgs(user5.address);
      await expect(
        gradingSystem.connect(user5).getTotalGradesByStudent(studentsA[0])
      )
        .to.be.revertedWithCustomError(gradingSystem, 'UnauthorizedAccount')
        .withArgs(user5.address);
    });

    it('should revert when getting a grade from a student with zero address', async function () {
      const zeroAddress: string = '0x0000000000000000000000000000000000000000';

      // Try to get a grades and total number of grades from a student with zero address.
      await expect(
        gradingSystem.getAllGradesByStudent(zeroAddress)
      ).to.be.revertedWithCustomError(gradingSystem, 'ZeroAddressNotAllowed');
      await expect(
        gradingSystem.getTotalGradesByStudent(zeroAddress)
      ).to.be.revertedWithCustomError(gradingSystem, 'ZeroAddressNotAllowed');
    });

    it('should revert when getting a grade that does not exist', async function () {
      // Try to get a grade that does not exist.
      await expect(gradingSystem.getGrade(1)).to.be.revertedWithCustomError(
        gradingSystem,
        'GradeNotFound'
      );
    });
  });

  describe('Check User Role Utility Functions Functionality', function () {
    enum UserRole {
      Unauthorized,
      Student,
      Teacher,
      Admin,
    }

    it('should check the user role correctly', async function () {
      // Check the user role.
      expect(await gradingSystem.connect(owner).getUserRole()).to.equal(
        UserRole.Admin
      );
      expect(await gradingSystem.connect(user1).getUserRole()).to.equal(
        UserRole.Teacher
      );
      expect(await gradingSystem.connect(user4).getUserRole()).to.equal(
        UserRole.Student
      );
      expect(await gradingSystem.connect(user8).getUserRole()).to.equal(
        UserRole.Unauthorized
      );
    });
  });

  describe('Interface Utility Functions Functionality', function () {
    beforeEach(async function () {
      // Add grades.
      await gradingSystem
        .connect(user1)
        .addGrades([studentsA[0]], [grades[0]], courses[0], 1);
    });

    it('should check if a grade is registered', async function () {
      // Check if a grade is registered.
      expect(await gradingSystem.doesGradeExist(0)).to.equal(true);

      // Check if a grade is not registered.
      expect(await gradingSystem.doesGradeExist(1)).to.equal(false);
    });
  });
});
