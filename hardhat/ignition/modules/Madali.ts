import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const MadaliModule = buildModule('MadaliModule', (m) => {
  // Deploy the Factory Contract.
  const factoryContract = m.contract('Factory');

  // Retrieve the addresses of StudentManagement and TeacherManagement from Factory's events.
  const studentManagementContractAddress = m.readEventArgument(
    factoryContract,
    'StudentContractDeployed',
    'studentContract'
  );
  const teacherManagementContractAddress = m.readEventArgument(
    factoryContract,
    'TeacherContractDeployed',
    'teacherContract'
  );

  // Create contract instances for StudentManagement and TeacherManagement
  const studentManagementContract = m.contractAt(
    'StudentManagement',
    studentManagementContractAddress,
    {
      after: [factoryContract], // Ensure it runs after the Factory contract is deployed.
    }
  );
  const teacherManagementContract = m.contractAt(
    'TeacherManagement',
    teacherManagementContractAddress,
    {
      after: [studentManagementContract], // Ensure it runs after the StudentManagement contract is deployed.
    }
  );

  // Deploy the GradingSystem contract.
  const gradingSystemContract = m.contract(
    'GradingSystem',
    [studentManagementContract, teacherManagementContract],
    {
      after: [teacherManagementContract], // Ensure it runs after the TeacherManagement contract is deployed.
    }
  );

  // Deploy the EducationCertificate contract.
  const educationCertificateContract = m.contract(
    'EducationCertificate',
    [
      gradingSystemContract,
      studentManagementContract,
      teacherManagementContract,
    ],
    {
      after: [gradingSystemContract], // Ensure it runs after the GradingSystem contract is deployed.
    }
  );

  return {
    factoryContract,
    studentManagementContract,
    teacherManagementContract,
    gradingSystemContract,
    educationCertificateContract,
  };
});

export default MadaliModule;
