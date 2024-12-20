import { useContext, useEffect, useState } from 'react';
import { UserRoleContext } from '../../contexts/UserRoleContext';
import { useNavigate } from 'react-router-dom';

import style from './style.module.css';
import ClassTab from '../../components/ui/ClassTab';

function Admin() {
  const navigate = useNavigate();
  const { userRole } = useContext(UserRoleContext);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState('admin');

  useEffect(() => {
    if (!userRole) {
      return;
    }

    if (userRole !== 'Admin') {
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
            <button
              onClick={() => setTab('admin')}
              className={handleButtonStyle('admin')}
            >
              Admin
            </button>

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
              Teacher
            </button>

            <button
              onClick={() => setTab('students')}
              className={handleButtonStyle('students')}
            >
              Students
            </button>

            <button
              onClick={() => setTab('courses')}
              className={handleButtonStyle('courses')}
            >
              Courses
            </button>

            <button
              onClick={() => setTab('grades')}
              className={handleButtonStyle('grades')}
            >
              Grades
            </button>

            <button
              onClick={() => setTab('certificates')}
              className={handleButtonStyle('certificates')}
            >
              Certificates
            </button>
          </div>

          <div className={style.content}>
            {tab === 'admin' && (
              <div>
                <h2>Admin</h2>
              </div>
            )}

            {tab === 'classes' && <ClassTab />}

            {tab === 'teachers' && (
              <div>
                <h2>Teachers</h2>
              </div>
            )}

            {tab === 'students' && (
              <div>
                <h2>Students</h2>
              </div>
            )}

            {tab === 'courses' && (
              <div>
                <h2>Courses</h2>
              </div>
            )}

            {tab === 'grades' && (
              <div>
                <h2>Grades</h2>
              </div>
            )}

            {tab === 'certificates' && (
              <div>
                <h2>Certificates</h2>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Admin;
