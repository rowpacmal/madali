import { useContext, useEffect, useState } from 'react';
import { UserRoleContext } from '../../contexts/UserRoleContext';
import { useNavigate } from 'react-router-dom';
import style from './style.module.css';
import { AppContext } from '../../contexts/AppContext';
import GradeTab from '../../components/ui/Student/GradeTab';

function Student() {
  const navigate = useNavigate();
  const { account } = useContext(AppContext);
  const { userRole } = useContext(UserRoleContext);
  const [tab, setTab] = useState('grades');

  useEffect(() => {
    if (!account || !userRole || userRole !== 'Student') {
      navigate('/');
    }
  }, [navigate, userRole]);

  function handleButtonStyle(type) {
    return style.button + (tab === type ? ' ' + style.active : '');
  }

  return (
    <>
      {userRole === 'Student' && (
        <>
          <div className={style.tabs}>
            <button
              onClick={() => setTab('grades')}
              className={handleButtonStyle('grades')}
            >
              Grades
            </button>

            <button
              onClick={() => setTab('badges')}
              className={handleButtonStyle('badges')}
            >
              Badges
            </button>
          </div>

          <div className={style.content}>
            {tab === 'grades' && <GradeTab />}

            {tab === 'badges' && <h2>Badge Collection</h2>}
          </div>
        </>
      )}
    </>
  );
}

export default Student;
