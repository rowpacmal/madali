import { expect } from 'chai';
import {
  EducationCertificate,
  GradingSystem,
  StudentManagement,
  TeacherManagement,
} from '../typechain-types';
import deployContractFixture from '../utils/deployContractFixture';

describe('Education Certificate Functionality', function () {
  type Certificate = [string, string, BigInt, BigInt, boolean];

  let studentManagement: StudentManagement;
  let teacherManagement: TeacherManagement;
  let gradingSystem: GradingSystem;
  let educationCertificate: EducationCertificate;
  let imageURL: string;
  let owner: any,
    user1: any,
    user2: any,
    user3: any,
    user4: any,
    user5: any,
    user6: any,
    user7: any,
    user8: any,
    user9: any;
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
      user9,
      studentManagement,
      teacherManagement,
      gradingSystem,
      educationCertificate,
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

    // Add grades.
    await gradingSystem
      .connect(user1)
      .addGrades(studentsA, grades, courses[0], 1);

    // Set image URL.
    imageURL = 'https://example.com/image.png';
  });

  describe('Certificate Functionality', function () {
    describe('Add Certificate', function () {
      it('should get a certificate correctly', async function () {
        // Mint a certificate.
        await educationCertificate.mintCertificate(
          user8.address,
          0,
          1,
          imageURL
        );

        // Verify that the total number of certificates is 1.
        expect(await educationCertificate.getTotalCertificates()).to.equal(1);

        // Verify the certificate has been minted.
        const certificate: Certificate =
          await educationCertificate.getCertificate(0);
        const certificateRef: Certificate = [
          user8.address,
          imageURL,
          BigInt(0),
          BigInt(0),
          true,
        ];

        expect(certificate[0]).to.deep.equal(certificateRef[0]);
        expect(certificate[1]).to.deep.equal(certificateRef[1]);
        expect(certificate[2]).to.deep.equal(certificateRef[2]);
        expect(certificate[3]).to.deep.equal(certificateRef[3]);
        expect(certificate[4]).to.deep.equal(certificateRef[4]);
      });

      it('should revert when minting as a non-teacher or non-owner', async function () {
        // Try to mint a certificate as a non-teacher.
        await expect(
          educationCertificate
            .connect(user4)
            .mintCertificate(user8.address, 0, 1, imageURL)
        )
          .to.be.revertedWithCustomError(
            educationCertificate,
            'UnauthorizedAccount'
          )
          .withArgs(user4.address);

        await expect(
          educationCertificate
            .connect(user9)
            .mintCertificate(user8.address, 0, 1, imageURL)
        )
          .to.be.revertedWithCustomError(
            educationCertificate,
            'UnauthorizedAccount'
          )
          .withArgs(user9.address);
      });

      it('should revert when minting a certificate with a course that does not exist', async function () {
        // Try to mint a certificate with a course that does not exist.
        await expect(
          educationCertificate.mintCertificate(user8.address, 0, 4, imageURL)
        )
          .to.be.revertedWithCustomError(educationCertificate, 'CourseNotFound')
          .withArgs(4);
      });

      it('should revert when minting a certificate with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Try to mint a certificate with a zero address.
        await expect(
          educationCertificate.mintCertificate(zeroAddress, 0, 1, imageURL)
        ).to.be.revertedWithCustomError(
          educationCertificate,
          'ZeroAddressNotAllowed'
        );
      });

      it('should revert when minting a certificate with a grade that does not exist', async function () {
        // Try to mint a certificate with a grade that does not exist.
        await expect(
          educationCertificate.mintCertificate(user8.address, 2, 1, imageURL)
        )
          .to.be.revertedWithCustomError(educationCertificate, 'GradeNotFound')
          .withArgs(2);
      });

      it('should emit an event when minting a certificate', async function () {
        // Mint a certificate.
        await expect(
          educationCertificate.mintCertificate(user8.address, 0, 1, imageURL)
        )
          .to.emit(educationCertificate, 'CertificateCreated')
          .withArgs(0);
      });
    });

    describe('Update Certificate', function () {
      beforeEach(async function () {
        // Mint a certificate.
        await educationCertificate.mintCertificate(
          user8.address,
          0,
          1,
          imageURL
        );
      });

      it('should update a certificate correctly', async function () {
        const newAddress = user9.address;
        const newImageURL = 'https://example.com/new-image.png';

        // Update a certificate.
        await educationCertificate.updateCertificate(
          0,
          newAddress,
          newImageURL
        );

        // Verify that the certificate has been updated.
        const certificate: Certificate =
          await educationCertificate.getCertificate(0);
        const certificateRef: Certificate = [
          newAddress,
          newImageURL,
          BigInt(0),
          BigInt(0),
          true,
        ];

        expect(certificate[0]).to.deep.equal(certificateRef[0]);
        expect(certificate[1]).to.deep.equal(certificateRef[1]);
        expect(certificate[2]).to.deep.equal(certificateRef[2]);
        expect(certificate[3]).to.deep.equal(certificateRef[3]);
        expect(certificate[4]).to.deep.equal(certificateRef[4]);
      });

      it('should revert when updating a certificate as a non-owner', async function () {
        // Try to update a certificate as a non-owner.
        await expect(
          educationCertificate
            .connect(user1)
            .updateCertificate(0, user9.address, imageURL)
        )
          .to.be.revertedWithCustomError(
            educationCertificate,
            'OwnableUnauthorizedAccount'
          )
          .withArgs(user1.address);

        await expect(
          educationCertificate
            .connect(user4)
            .updateCertificate(0, user9.address, imageURL)
        )
          .to.be.revertedWithCustomError(
            educationCertificate,
            'OwnableUnauthorizedAccount'
          )
          .withArgs(user4.address);

        await expect(
          educationCertificate
            .connect(user9)
            .updateCertificate(0, user9.address, imageURL)
        )
          .to.be.revertedWithCustomError(
            educationCertificate,
            'OwnableUnauthorizedAccount'
          )
          .withArgs(user9.address);
      });

      it('should revert when updating a certificate with a zero address', async function () {
        const zeroAddress = '0x0000000000000000000000000000000000000000';

        // Try to update a certificate with a zero address.
        await expect(
          educationCertificate.updateCertificate(0, zeroAddress, imageURL)
        ).to.be.revertedWithCustomError(
          educationCertificate,
          'ZeroAddressNotAllowed'
        );
      });

      it('should revert when updating a certificate that does not exist', async function () {
        // Try to update a certificate that does not exist.
        await expect(
          educationCertificate.updateCertificate(1, user9.address, imageURL)
        )
          .to.be.revertedWithCustomError(
            educationCertificate,
            'CertificateNotFound'
          )
          .withArgs(1);
      });

      it('should emit an event when updating a certificate', async function () {
        // Update a certificate.
        await expect(
          educationCertificate.updateCertificate(0, user9.address, imageURL)
        )
          .to.emit(educationCertificate, 'CertificateUpdated')
          .withArgs(0);
      });
    });
  });

  describe('Getter Functionality', function () {
    beforeEach(async function () {
      // Mint a certificate.
      await educationCertificate.mintCertificate(user8.address, 0, 1, imageURL);
    });

    it('should get a certificate correctly', async function () {
      // Get a certificate.
      const certificate: Certificate =
        await educationCertificate.getCertificate(0);
      const certificateRef: Certificate = [
        user8.address,
        imageURL,
        BigInt(0),
        BigInt(0),
        true,
      ];

      expect(certificate[0]).to.deep.equal(certificateRef[0]);
      expect(certificate[1]).to.deep.equal(certificateRef[1]);
      expect(certificate[2]).to.deep.equal(certificateRef[2]);
      expect(certificate[3]).to.deep.equal(certificateRef[3]);
      expect(certificate[4]).to.deep.equal(certificateRef[4]);
    });

    it('should get the total number of certificates', async function () {
      // Get the total number of certificates.
      expect(await educationCertificate.getTotalCertificates()).to.equal(1);
    });

    it('should revert when getting a certificate that does not exist', async function () {
      // Try to get a certificate that does not exist.
      await expect(educationCertificate.getCertificate(1))
        .to.be.revertedWithCustomError(
          educationCertificate,
          'CertificateNotFound'
        )
        .withArgs(1);
    });
  });
});
