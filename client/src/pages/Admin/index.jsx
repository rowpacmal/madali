import { useContext, useEffect, useState } from 'react';
import { UserRoleContext } from '../../contexts/UserRoleContext';
import { useNavigate } from 'react-router-dom';
import ClassTab from '../../components/ui/Admin/ClassTab';
import style from './style.module.css';
import { AppContext } from '../../contexts/AppContext';
import TeacherTab from '../../components/ui/Admin/TeacherTab';
import StudentTab from '../../components/ui/Admin/StudentTab';

// This is the admin page for creating classes, teachers, and students.
// Users that are not admins are redirected to the home page.
function Admin() {
  const navigate = useNavigate();
  const { account } = useContext(AppContext);
  const { userRole } = useContext(UserRoleContext);
  const [tab, setTab] = useState('classes');

  useEffect(() => {
    if (!account || !userRole || userRole !== 'Admin') {
      navigate('/');
    }
  }, [navigate, userRole]);

  function handleButtonStyle(type) {
    return style.button + (tab === type ? ' ' + style.active : '');
  }

  return (
    <>
      {userRole === 'Admin' && (
        <>
          <div className={style.tabs}>
            {/* The overview tab is not yet implemented. It's supposed to be a overview of the contracts status and extra admin management. But these are not necessary for the project to work, and will be improved upon at a later stage. */}
            {/* <button
              onClick={() => setTab('overview')}
              className={handleButtonStyle('overview')}
            >
              Overview
            </button> */}

            <button
              onClick={() => setTab('classes')}
              className={handleButtonStyle('classes')}
            >
              Classes
            </button>

            <button
              onClick={() => setTab('teachers')}
              className={handleButtonStyle('teachers')}
            >
              Teachers
            </button>

            <button
              onClick={() => setTab('students')}
              className={handleButtonStyle('students')}
            >
              Students
            </button>
          </div>

          <div className={style.content}>
            {/* {tab === 'overview' && (
              <div>
                <h2>Overview</h2>
              </div>
            )} */}

            {tab === 'classes' && <ClassTab />}

            {tab === 'teachers' && <TeacherTab />}

            {tab === 'students' && <StudentTab />}
          </div>
        </>
      )}
    </>
  );
}

export default Admin;
