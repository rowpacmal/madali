import { expect } from 'chai';
import { TeacherManagement } from '../typechain-types';
import deployContractFixture from '../utils/deployContractFixture';

describe('Teacher Management Functionality', function () {
  type Teacher = [[string, BigInt, boolean], BigInt[]];

  let teacherManagement: TeacherManagement;
  let owner: any, user1: any, user2: any, user3: any, user4: any, user5: any;
  let teachers: string[];

  beforeEach(async function () {
    // Use the deployContractFixture function to deploy the contract.
    ({ owner, user1, user2, user3, user4, user5, teacherManagement } =
      await deployContractFixture());

    // Create an array of teacher addresses.
    teachers = [user1.address, user2.address, user3.address];

    // Check the initial total number of teachers is 0.
    expect(await teacherManagement.getTotalTeachers()).to.equal(0);
  });

  describe('Teacher CRUD Functionality', function () {
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

    describe('Updating Teacher', function () {
      beforeEach(async function () {
        // Register a new teacher.
        await teacherManagement.registerTeachers(teachers, [1, 2, 3]);

        // Check that a teacher has been registered.
        expect(await teacherManagement.getTotalTeachers()).to.equal(3);
      });

      it('should update teacher details correctly', async function () {
        // Update the teacher details.
        await teacherManagement.updateTeacher(user1.address, 2);

        // Check the teacher details have been updated.
        const teacher: Teacher = await teacherManagement.getTeacher(
          user1.address
        );
        const teacherRef: Teacher = [[user1.address, BigInt(2), true], []];

        expect(teacher[0][0]).to.equal(teacherRef[0][0]);
        expect(teacher[0][1]).to.equal(teacherRef[0][1]);
        expect(teacher[0][2]).to.equal(teacherRef[0][2]);
      });

      it('should revert when updating a teacher when not the owner', async function () {
        // Update the teacher details as a non-owner user.
        await expect(
          teacherManagement.connect(user4).updateTeacher(user1.address, 2)
        )
          .to.be.revertedWithCustomError(
            teacherManagement,
            'UnauthorizedAccount'
          )
          .withArgs(user4.address);
      });

      it('should revert when updating another teachers details', async function () {
        // Update another teachers details.
        await expect(
          teacherManagement.connect(user2).updateTeacher(user1.address, 2)
        )
          .to.be.revertedWithCustomError(
            teacherManagement,
            'UnauthorizedAccount'
          )
          .withArgs(user2.address);
      });

      it('should revert when updating a teacher with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Update a teacher with a zero address.
        await expect(
          teacherManagement.updateTeacher(zeroAddress, 2)
        ).to.be.revertedWithCustomError(
          teacherManagement,
          'ZeroAddressNotAllowed'
        );
      });

      it('should revert when updating a teacher that does not exist', async function () {
        // Update a teacher that does not exist.
        await expect(teacherManagement.updateTeacher(user4.address, 2))
          .to.be.revertedWithCustomError(teacherManagement, 'TeacherNotFound')
          .withArgs(user4.address);
      });
    });
  });

  describe('Course CRUD Functionality', function () {
    let courses: number[], classes: number[], modules: number[];

    beforeEach(async function () {
      // Register a new teachers.
      await teacherManagement.registerTeachers(teachers, [1, 2, 3]);

      // Check that 3 teachers have been registered.
      expect(await teacherManagement.getTotalTeachers()).to.equal(3);

      // Check that no courses have been registered.
      expect(
        await teacherManagement.getTotalCoursesByTeacher(teachers[0])
      ).to.equal(0);

      // Register courses for a teacher.
      courses = [1, 2, 3];
      classes = [1, 2, 3];
      modules = [5, 5, 5];
    });

    describe('Registering Courses', function () {
      it('should register courses for a teacher correctly', async function () {
        // Register courses for a teacher.
        await teacherManagement.registerCourse(
          teachers[0],
          courses,
          classes,
          modules
        );

        // Check that 3 courses have been registered.
        expect(
          await teacherManagement.getTotalCoursesByTeacher(teachers[0])
        ).to.equal(3);

        // Check that the courses have been registered correctly.
        const allCourses = await teacherManagement.getAllCoursesByTeacher(
          teachers[0]
        );
        const course1 = await teacherManagement.getCourse(allCourses[0]);
        const course2 = await teacherManagement.getCourse(allCourses[1]);
        const course3 = await teacherManagement.getCourse(allCourses[2]);

        expect(course1[1]).to.equal(courses[0]);
        expect(course1[2]).to.equal(classes[0]);
        expect(course1[3]).to.equal(modules[0]);

        expect(course2[1]).to.equal(courses[1]);
        expect(course2[2]).to.equal(classes[1]);
        expect(course2[3]).to.equal(modules[1]);

        expect(course3[1]).to.equal(courses[2]);
        expect(course3[2]).to.equal(classes[2]);
        expect(course3[3]).to.equal(modules[2]);
      });

      it('should revert when registering courses as a non-owner or non-teacher user', async function () {
        // Attempt to register courses as a non-owner or non-teacher user.
        await expect(
          teacherManagement
            .connect(user4)
            .registerCourse(teachers[0], courses, classes, modules)
        )
          .to.be.revertedWithCustomError(
            teacherManagement,
            'UnauthorizedAccount'
          )
          .withArgs(user4.address);

        // Attempt to register courses as the owner.
        await expect(
          teacherManagement.registerCourse(teachers[1], [4], [4], [5])
        ).to.not.be.revertedWithCustomError(
          teacherManagement,
          'UnauthorizedAccount'
        );

        // Attempt to register courses as a teacher.
        await expect(
          teacherManagement
            .connect(user1)
            .registerCourse(teachers[2], [4], [4], [5])
        ).to.not.be.revertedWithCustomError(
          teacherManagement,
          'UnauthorizedAccount'
        );
      });

      it('should revert when registering a courses to a teacher with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Attempt to register a courses to a teacher with a zero address.
        await expect(
          teacherManagement.registerCourse(zeroAddress, [4], [4], [5])
        ).to.be.revertedWithCustomError(
          teacherManagement,
          'ZeroAddressNotAllowed'
        );
      });

      it('should revert when registering a course to a teacher that does not exist', async function () {
        // Attempt to register a course to a teacher that does not exist.
        await expect(
          teacherManagement.registerCourse(user4.address, [4], [4], [5])
        )
          .to.be.revertedWithCustomError(teacherManagement, 'TeacherNotFound')
          .withArgs(user4.address);
      });

      it('should revert when registering a course with no courses, classes, or modules', async function () {
        // Attempt to register a course with no courses.
        await expect(
          teacherManagement.registerCourse(teachers[0], [], [1], [5])
        ).to.be.revertedWithCustomError(teacherManagement, 'NoCoursesProvided');

        // Attempt to register a course with no classes.
        await expect(
          teacherManagement.registerCourse(teachers[0], [1], [], [5])
        ).to.be.revertedWithCustomError(teacherManagement, 'NoClassesProvided');

        // Attempt to register a course with no modules.
        await expect(
          teacherManagement.registerCourse(teachers[0], [1], [1], [])
        ).to.be.revertedWithCustomError(teacherManagement, 'NoModulesProvided');
      });

      it('should revert when registering a course with mismatching lengths of courses, classes, and modules', async function () {
        // Attempt to register a course with mismatching lengths of courses, classes, and modules.
        // 2 courses, 1 class, 1 module
        await expect(
          teacherManagement.registerCourse(teachers[0], [1, 2], [1], [5])
        )
          .to.be.revertedWithCustomError(
            teacherManagement,
            'CoursesClassesModulesLengthMismatch'
          )
          .withArgs(2, 1, 1);

        // 1 course, 2 classes, 1 module
        await expect(
          teacherManagement.registerCourse(teachers[0], [1], [1, 2], [5])
        )
          .to.be.revertedWithCustomError(
            teacherManagement,
            'CoursesClassesModulesLengthMismatch'
          )
          .withArgs(1, 2, 1);

        // 1 course, 1 class, 2 modules
        await expect(
          teacherManagement.registerCourse(teachers[0], [1], [1], [5, 5])
        )
          .to.be.revertedWithCustomError(
            teacherManagement,
            'CoursesClassesModulesLengthMismatch'
          )
          .withArgs(1, 1, 2);
      });

      it('should emit when registering the same course twice', async function () {
        // Register a new course.
        await teacherManagement.registerCourse(teachers[0], [1], [1], [5]);

        // Attempt to register the same course again.
        await expect(
          teacherManagement.registerCourse(teachers[0], [1], [2], [7])
        )
          .to.be.emit(teacherManagement, 'CourseAdditionFailed_AlreadyExists')
          .withArgs(1);

        // Attempt to register the same course twice
        await expect(
          teacherManagement.registerCourse(teachers[0], [2, 2], [2, 3], [7, 7])
        )
          .to.be.emit(teacherManagement, 'CourseAdditionFailed_AlreadyExists')
          .withArgs(2);
      });

      it('should emit when registering a course', async function () {
        // Register a new course.
        await expect(
          teacherManagement.registerCourse(teachers[0], [1], [1], [5])
        )
          .to.emit(teacherManagement, 'CourseRegistered')
          .withArgs(1);
      });
    });

    describe('Deleting Courses', function () {
      beforeEach(async function () {
        // Register courses for a teacher.
        await teacherManagement.registerCourse(
          teachers[0],
          courses,
          classes,
          modules
        );

        // Check that 3 courses have been registered.
        expect(
          await teacherManagement.getTotalCoursesByTeacher(teachers[0])
        ).to.equal(3);
      });

      it('should delete courses form a teacher correctly', async function () {
        // Delete 2 of the registered courses.
        await teacherManagement.deleteCourses([1, 3], teachers[0]);

        // Check that 1 course is left.
        expect(
          await teacherManagement.getTotalCoursesByTeacher(teachers[0])
        ).to.equal(1);

        // Check that the deleted courses no longer exist.
        expect(
          await teacherManagement.getAllCoursesByTeacher(teachers[0])
        ).to.deep.equal([2]);
      });

      it('should revert when deleting courses as a non-owner or non-teacher user', async function () {
        // Attempt to delete courses as a non-owner or non-teacher user.
        await expect(
          teacherManagement.connect(user4).deleteCourses([1, 3], teachers[0])
        )
          .to.be.revertedWithCustomError(
            teacherManagement,
            'UnauthorizedAccount'
          )
          .withArgs(user4.address);

        // Attempt to delete courses as the owner.
        await expect(
          teacherManagement.deleteCourses([1, 3], teachers[1])
        ).to.not.be.revertedWithCustomError(
          teacherManagement,
          'UnauthorizedAccount'
        );

        // Attempt to delete courses as a teacher.
        await expect(
          teacherManagement.connect(user1).deleteCourses([1, 3], teachers[2])
        ).to.not.be.revertedWithCustomError(
          teacherManagement,
          'UnauthorizedAccount'
        );
      });

      it('should revert when deleting a courses from a teacher with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Attempt to delete a course from a teacher with a zero address.
        await expect(
          teacherManagement.deleteCourses([1, 3], zeroAddress)
        ).to.be.revertedWithCustomError(
          teacherManagement,
          'ZeroAddressNotAllowed'
        );
      });

      it('should revert when deleting a course from a teacher that does not exist', async function () {
        // Attempt to delete a course from a teacher that does not exist.
        await expect(teacherManagement.deleteCourses([1, 3], user4.address))
          .to.be.revertedWithCustomError(teacherManagement, 'TeacherNotFound')
          .withArgs(user4.address);
      });

      it('should revert when deleting with no courses provided and there are no registered courses', async function () {
        // Delete with no courses provided.
        await expect(
          teacherManagement.deleteCourses([], teachers[0])
        ).to.be.revertedWithCustomError(teacherManagement, 'NoCoursesProvided');

        // Delete courses from a teacher with no registered courses.
        await expect(
          teacherManagement.deleteCourses([1, 2, 3], teachers[1])
        ).to.be.revertedWithCustomError(teacherManagement, 'NoCoursesToDelete');
      });

      it('should emit when deleting a course that does not exist', async function () {
        // Delete a course that does not exist.
        await expect(teacherManagement.deleteCourses([4], teachers[0]))
          .to.be.emit(teacherManagement, 'CourseDeletionFailed_NotFound')
          .withArgs(4);
      });

      it('should emit when deleting a course from another teacher', async function () {
        // Register a course for another teacher.
        await teacherManagement.registerCourse(teachers[1], [4], [4], [5]);

        // Delete a course from another teacher.
        await expect(teacherManagement.deleteCourses([1], teachers[1]))
          .to.be.emit(teacherManagement, 'CourseDeletionFailed_NotOwned')
          .withArgs(1);
      });

      it('should emit when deleting a registered course', async function () {
        // Delete 1 of the registered courses.
        await expect(teacherManagement.deleteCourses([1], teachers[0])).to.emit(
          teacherManagement,
          'CourseDeleted'
        );
      });
    });
  });

  describe('', function () {
    it('', async function () {});
  });
});
