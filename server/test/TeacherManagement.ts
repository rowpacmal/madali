import { expect } from 'chai';
import { TeacherManagement } from '../typechain-types';
import deployContractFixture from '../utils/deployContractFixture';

describe('Teacher Management Functionality', function () {
  type Teacher = [[string, BigInt, boolean], BigInt[]];

  let teacherManagement: TeacherManagement;
  let owner: any, user1: any, user2: any, user3: any, user4: any, user5: any;

  beforeEach(async function () {
    ({ owner, user1, user2, user3, user4, user5, teacherManagement } =
      await deployContractFixture());
  });

  describe('Teacher CRUD Functionality', function () {
    let teachers: string[];

    beforeEach(async function () {
      // Create an array of teacher addresses.
      teachers = [user1.address, user2.address, user3.address];

      // Check the initial total number of teachers is 0.
      expect(await teacherManagement.getTotalTeachers()).to.equal(0);
    });

    describe('Registering Teachers', function () {
      it('should verify registered teachers have been stored correctly', async function () {
        // Register new teachers.
        await teacherManagement.registerTeachers(teachers, [1, 2, 3]);

        // Check the total number of teachers is 3 after registration.
        expect(await teacherManagement.getTotalTeachers()).to.equal(3);

        // Verify that the teachers is registered with the correct details.
        for (let i = 0; i < teachers.length; i++) {
          const teacher: Teacher = await teacherManagement.getTeacher(
            teachers[i]
          );
          const teacherRef: Teacher = [[teachers[i], BigInt(i + 1), true], []];

          expect(teacher[0][0]).to.equal(teacherRef[0][0]);
          expect(teacher[0][1]).to.equal(teacherRef[0][1]);
          expect(teacher[0][2]).to.equal(teacherRef[0][2]);
        }

        // Check that the correct teachers are registered.
        expect(await teacherManagement.getAllTeachers()).to.deep.equal(
          teachers
        );
      });

      it('should revert when providing no teachers or classes', async function () {
        // Register with only classes provided but no teachers.
        await expect(
          teacherManagement.registerTeachers([], [1, 2, 3])
        ).to.be.revertedWithCustomError(
          teacherManagement,
          'NoTeachersProvided'
        );

        // Register with only teachers provided but no classes.
        await expect(
          teacherManagement.registerTeachers(teachers, [])
        ).to.be.revertedWithCustomError(teacherManagement, 'NoClassesProvided');
      });

      it('should revert when provided teachers and classes do not match', async function () {
        const classesA = [1, 2];
        const classesB = [1, 2, 3, 4];

        // Register with more teachers than classes.
        await expect(teacherManagement.registerTeachers(teachers, classesA))
          .to.be.revertedWithCustomError(
            teacherManagement,
            'TeachersClassesLengthMismatch'
          )
          .withArgs(teachers.length, classesA.length);

        // Register with more classes than teachers.
        await expect(teacherManagement.registerTeachers(teachers, classesB))
          .to.be.revertedWithCustomError(
            teacherManagement,
            'TeachersClassesLengthMismatch'
          )
          .withArgs(teachers.length, classesB.length);
      });

      it('should emit when registering a teacher with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Register a teacher with a zero address.
        await expect(
          teacherManagement.registerTeachers([zeroAddress], [1])
        ).to.be.emit(teacherManagement, 'TeacherAdditionFailed_ZeroAddress');
      });

      it('should emit when registering the same teacher twice', async function () {
        // Register a new teacher.
        await teacherManagement.registerTeachers([user1.address], [1]);

        // Register the same teacher again.
        await expect(teacherManagement.registerTeachers([user1.address], [1]))
          .to.be.emit(teacherManagement, 'TeacherAdditionFailed_AlreadyExists')
          .withArgs(user1.address);
      });

      it('should emit an event when registering a new teacher', async function () {
        // Register a new teacher.
        await expect(teacherManagement.registerTeachers([user1.address], [1]))
          .to.emit(teacherManagement, 'TeacherRegistered')
          .withArgs(user1.address);
      });
    });

    describe('Deleting Teachers', function () {
      beforeEach(async function () {
        // Register new teachers.
        await teacherManagement.registerTeachers(teachers, [1, 2, 3]);

        // Check the total number of teachers is 3 after registration.
        expect(await teacherManagement.getTotalTeachers()).to.equal(3);
      });

      it('should delete registered teachers correctly', async function () {
        // Delete 2 of the registered teachers.
        await teacherManagement.deleteTeachers([user1.address, user3.address]);

        // Check the total number of teachers is 1 after deletion.
        expect(await teacherManagement.getTotalTeachers()).to.equal(1);

        // Check that the correct teachers are registered.
        const teacher: Teacher = await teacherManagement.getTeacher(
          user2.address
        );
        const teacherRef: Teacher = [[user2.address, BigInt(2), true], []];

        expect(teacher[0][0]).to.equal(teacherRef[0][0]);
        expect(teacher[0][1]).to.equal(teacherRef[0][1]);
        expect(teacher[0][2]).to.equal(teacherRef[0][2]);

        expect(await teacherManagement.getAllTeachers()).to.deep.equal([
          user2.address,
        ]);
      });

      it('should revert when providing no teachers', async function () {
        // Delete with no teachers provided.
        await expect(
          teacherManagement.deleteTeachers([])
        ).to.be.revertedWithCustomError(
          teacherManagement,
          'NoTeachersProvided'
        );
      });

      it('should revert when there are no teachers registered', async function () {
        // Delete all registered teachers.
        await teacherManagement.deleteTeachers(teachers);

        // Delete a teacher when there are no teachers registered.
        await expect(
          teacherManagement.deleteTeachers([user1.address])
        ).to.be.revertedWithCustomError(
          teacherManagement,
          'NoTeachersToDelete'
        );
      });

      it('should emit when deleting a teacher with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Delete a teacher with a zero address.
        await expect(
          teacherManagement.deleteTeachers([zeroAddress])
        ).to.be.emit(teacherManagement, 'TeacherDeletionFailed_ZeroAddress');
      });

      it('should emit when deleting a teacher that does not exist', async function () {
        // Delete a teacher that does not exist.
        await expect(teacherManagement.deleteTeachers([user4.address]))
          .to.be.emit(teacherManagement, 'TeacherDeletionFailed_NotFound')
          .withArgs(user4.address);
      });

      it('should emit an event when deleting a registered teacher with no courses', async function () {
        // Delete 1 of the registered teachers.
        await expect(teacherManagement.deleteTeachers([user1.address])).to.emit(
          teacherManagement,
          'CourseDeletionFailed_NoCoursesToDelete'
        );
      });

      it('should emit an event when deleting a registered teacher', async function () {
        // Delete 1 of the registered teachers.
        await expect(teacherManagement.deleteTeachers([user1.address]))
          .to.emit(teacherManagement, 'TeacherDeleted')
          .withArgs(user1.address);
      });
    });

    describe('Updating Teacher', function () {});
  });

  describe('', function () {
    it('', async function () {});
  });
});
