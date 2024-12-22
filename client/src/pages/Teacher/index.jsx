import { useContext, useEffect, useState } from 'react';
import { UserRoleContext } from '../../contexts/UserRoleContext';
import { useNavigate } from 'react-router-dom';
import style from './style.module.css';
import { AppContext } from '../../contexts/AppContext';
import CourseTab from '../../components/ui/Teacher/CourseTab';

function Teacher() {
  const navigate = useNavigate();
  const { account } = useContext(AppContext);
  const { userRole } = useContext(UserRoleContext);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!account || !userRole || userRole !== 'Teacher') {
      navigate('/');
    }
  }, [navigate, userRole]);

  function handleButtonStyle(type) {
    return style.button + (tab === type ? ' ' + style.active : '');
  }

  return (
    <>
      {userRole === 'Teacher' && (
        <>
          <div className={style.tabs}>
            <button
              onClick={() => setTab('overview')}
              className={handleButtonStyle('overview')}
            >
              Overview
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
            {tab === 'overview' && <h2>Overview</h2>}

            {tab === 'courses' && <CourseTab />}

            {tab === 'grades' && <h2>Grade Management</h2>}

            {tab === 'certificates' && <h2>Certificate Management</h2>}
          </div>
        </>
      )}
    </>
  );
}

export default Teacher;
