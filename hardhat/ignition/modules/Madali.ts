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

  // Deploy GradingSystem, passing StudentManagement and TeacherManagement addresses.
  const gradingSystemContract = m.contract(
    'GradingSystem',
    [studentManagementContractAddress, teacherManagementContractAddress],
    {
      after: [factoryContract], // Ensure it runs after the Factory contract is deployed.
    }
  );

  // Deploy the EducationCertificate contract.
  const educationCertificateContract = m.contract(
    'EducationCertificate',
    [
      gradingSystemContract,
      studentManagementContractAddress,
      teacherManagementContractAddress,
    ],
    {
      after: [gradingSystemContract], // Ensure it runs after the GradingSystem contract is deployed.
    }
  );

  return {
    factoryContract,
    gradingSystemContract,
    educationCertificateContract,
  };
});

export default MadaliModule;
