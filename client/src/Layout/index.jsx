import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import Navigation from '../components/Navigation';
import useGradingSystem from '../hooks/useGradingSystem';
import useTeacherManagement from '../hooks/useTeacherManagement';
import teacherManagement from '../utils/teacherManagement.config';
import handleCustomError from '../utils/handleCustomErrors';
import useStudentManagement from '../hooks/useStudentManagement';
import studentManagement from '../utils/studentManagement.config';

function Layout() {
  const { account } = useContext(AppContext);
  const { userRole } = useGradingSystem();
  const { teacherContract } = useTeacherManagement();
  const { studentContract } = useStudentManagement();
  const [status, setStatus] = useState('');

  async function handleAddTeacher() {
    try {
      await teacherContract.write.registerTeachers(
        ['0x70997970c51812dc3a010c7d01b50e0d17dc79c8'],
        [2401]
      );
    } catch (error) {
      setStatus(handleCustomError(teacherManagement.abi, error));
    }
  }

  async function handleAddStudent() {
    try {
      await studentContract.write.registerStudents(
        ['0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'],
        2401
      );
    } catch (error) {
      setStatus(handleCustomError(studentManagement.abi, error));
    }
  }

  async function handleGetTeachers() {
    try {
      console.log(
        await teacherContract.read.doesTeacherExist(
          '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          {
            from: account,
          }
        )
      );
      console.log(
        await teacherContract.read.getTeacher(
          '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          {
            from: account,
          }
        )
      );
      console.log(
        await teacherContract.read.getAllTeachers({
          from: account,
        })
      );
    } catch (error) {
      setStatus(handleCustomError(teacherManagement.abi, error));
    }
  }

  async function handleGetStudents() {
    try {
      console.log(
        await studentContract.read.getAllStudents(2401, {
          from: account,
        })
      );
    } catch (error) {
      setStatus(handleCustomError(studentManagement.abi, error));
    }
  }

  return (
    <>
      <header>
        <h1>Madali</h1>

        {userRole && <p>Role: {userRole}</p>}
        {account && <p>Wallet: {account}</p>}

        <Navigation />

        <p>
          <button onClick={handleAddStudent}>Add Student</button>
          <button onClick={handleGetStudents}>Get Students</button>
        </p>
        <br />
        <p>
          <button onClick={handleAddTeacher}>Add Teacher</button>
          <button onClick={handleGetTeachers}>Get Teachers</button>
        </p>

        {status && (
          <>
            <p>{status.name}</p>
            <p>{status.args}</p>
          </>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>&copy; Madali Education 2023</p>
      </footer>
    </>
  );
}

export default Layout;
