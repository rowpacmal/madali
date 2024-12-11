import { ethers } from 'hardhat';
import {
  Factory,
  GradingSystem,
  StudentManagement,
  TeacherManagement,
} from '../typechain-types';

export default async function deployContractFixture() {
  // Get signers
  const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

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

  return {
    owner,
    user1,
    user2,
    user3,
    user4,
    user5,
    factory,
    studentAddress,
    teacherAddress,
    studentManagement,
    teacherManagement,
    gradingSystem,
  };
}
