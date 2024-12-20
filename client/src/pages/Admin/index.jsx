import { useContext, useEffect, useState } from 'react';
import { UserRoleContext } from '../../contexts/UserRoleContext';
import { useNavigate } from 'react-router-dom';
import ClassTab from '../../components/ui/Admin/ClassTab';

import style from './style.module.css';
import { AppContext } from '../../contexts/AppContext';
import TeacherTab from '../../components/ui/Admin/TeacherTab';

function Admin() {
  const navigate = useNavigate();
  const { account } = useContext(AppContext);
  const { userRole } = useContext(UserRoleContext);
  const [tab, setTab] = useState('admin');

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
          </div>

          <div className={style.content}>
            {tab === 'admin' && (
              <div>
                <h2>Admin</h2>
              </div>
            )}

            {tab === 'classes' && <ClassTab />}

            {tab === 'teachers' && <TeacherTab />}

            {tab === 'students' && (
              <div>
                <h2>Students</h2>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Admin;
