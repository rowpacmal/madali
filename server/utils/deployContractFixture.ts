import { ethers } from 'hardhat';
import {
  EducationCertificate,
  Factory,
  GradingSystem,
  StudentManagement,
  TeacherManagement,
} from '../typechain-types';

export default async function deployContractFixture() {
  // Get signers
  const [
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
    user10,
  ] = await ethers.getSigners();

  // Deploy the Factory contract
  const Factory = await ethers.getContractFactory('Factory');
  const factory: Factory = await Factory.deploy();

  // Get addresses of the deployed StudentManagement and TeacherManagement contracts
  const studentAddress: any = await factory.studentContract();
  const teacherAddress: any = await factory.teacherContract();

  // Get contract instances
  const studentManagement: StudentManagement = await ethers.getContractAt(
    'StudentManagement',
    studentAddress
  );
  const teacherManagement: TeacherManagement = await ethers.getContractAt(
    'TeacherManagement',
    teacherAddress
  );

  // Deploy the GradingSystem contract, passing the addresses of StudentManagement and TeacherManagement
  const GradingSystem = await ethers.getContractFactory('GradingSystem');
  const gradingSystem: GradingSystem = await GradingSystem.deploy(
    studentAddress,
    teacherAddress
  );

  // Deploy the Education Certification contract, passing the addresses of grading, student, and teacher contracts
  const EducationCertificate = await ethers.getContractFactory(
    'EducationCertificate'
  );
  const educationCertificate: EducationCertificate =
    await EducationCertificate.deploy(
      gradingSystem.getAddress(),
      studentAddress,
      teacherAddress
    );

  return {
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
    user10,
    factory,
    studentAddress,
    teacherAddress,
    studentManagement,
    teacherManagement,
    gradingSystem,
    educationCertificate,
  };
}
