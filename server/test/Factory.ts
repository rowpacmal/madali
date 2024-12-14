import { expect } from 'chai';
import {
  EducationCertificate,
  Factory,
  GradingSystem,
  StudentManagement,
  TeacherManagement,
} from '../typechain-types';
import deployContractFixture from '../utils/deployContractFixture';

describe('Factory Deployment and Contract Interaction', function () {
  let factory: Factory;
  let studentManagement: StudentManagement;
  let teacherManagement: TeacherManagement;
  let gradingSystem: GradingSystem;
  let educationCertificate: EducationCertificate;
  let owner: any;

  beforeEach(async function () {
    ({
      owner,
      factory,
      studentManagement,
      teacherManagement,
      gradingSystem,
      educationCertificate,
    } = await deployContractFixture());
  });

  describe('Deploying and Linking Contracts', function () {
    it('should deploy and link StudentManagement and TeacherManagement contracts correctly', async function () {
      // Verify that TeacherManagement knows the StudentManagement address
      const linkedStudentAddress = await teacherManagement.studentContract();
      expect(linkedStudentAddress).to.equal(
        await studentManagement.getAddress()
      );

      // Verify that StudentManagement knows the TeacherManagement address
      const linkedTeacherAddress = await studentManagement.teacherContract();
      expect(linkedTeacherAddress).to.equal(
        await teacherManagement.getAddress()
      );
    });

    it('should deploy the GradingSystem contract with correct parameters', async function () {
      // Verify that the GradingSystem contract was deployed with the correct addresses
      const gradingSystemStudentContract =
        await gradingSystem.studentContract();
      const gradingSystemTeacherContract =
        await gradingSystem.teacherContract();

      expect(gradingSystemStudentContract).to.equal(
        await studentManagement.getAddress()
      );
      expect(gradingSystemTeacherContract).to.equal(
        await teacherManagement.getAddress()
      );
    });

    it('should deploy the EducationCertificate contract with correct parameters', async function () {
      // Verify that the EducationCertificate contract was deployed with the correct addresses
      const educationCertificateGradingSystemContract =
        await educationCertificate.gradingContract();
      const educationCertificateStudentContract =
        await educationCertificate.studentContract();
      const educationCertificateTeacherContract =
        await educationCertificate.teacherContract();

      expect(educationCertificateGradingSystemContract).to.equal(
        await gradingSystem.getAddress()
      );
      expect(educationCertificateStudentContract).to.equal(
        await studentManagement.getAddress()
      );
      expect(educationCertificateTeacherContract).to.equal(
        await teacherManagement.getAddress()
      );
    });

    it('should set the contract owner to the same address for all contracts', async function () {
      // Verify that the contract owner is set to the same address.
      expect(await factory.owner()).to.equal(owner.address);
      expect(await studentManagement.owner()).to.equal(owner.address);
      expect(await teacherManagement.owner()).to.equal(owner.address);
      expect(await gradingSystem.owner()).to.equal(owner.address);
      expect(await educationCertificate.owner()).to.equal(owner.address);
    });
  });
});
