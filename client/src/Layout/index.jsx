import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import Navigation from '../components/Navigation';
import useGradingSystem from '../hooks/useGradingSystem';
import useTeacherManagement from '../hooks/useTeacherManagement';
import teacherManagement from '../utils/teacherManagement.config';
import handleCustomError from '../utils/handleCustomErrors';

function Layout() {
  const { account } = useContext(AppContext);
  const { userRole } = useGradingSystem();
  const { teacherContract } = useTeacherManagement();
  const [status, setStatus] = useState('');

  async function handleAddTeacher() {
    try {
      await teacherContract.write.registerTeachers([account], [2401]);
    } catch (error) {
      setStatus(handleCustomError(teacherManagement.abi, error));
    }
  }

  async function handleGetTeachers() {
    try {
      console.log(await teacherContract.read.getAllTeachers());
    } catch (error) {
      setStatus(handleCustomError(teacherManagement.abi, error));
    }
  }

  return (
    <>
      <header>
        <h1>Madali</h1>

        {userRole && <p>Role: {userRole}</p>}
        {account && <p>Wallet: {account}</p>}

        <Navigation />

        <button onClick={handleAddTeacher}>Add Teacher</button>
        <button onClick={handleGetTeachers}>Get Teachers</button>

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
