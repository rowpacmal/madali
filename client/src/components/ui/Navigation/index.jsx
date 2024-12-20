import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { UserRoleContext } from '../../../contexts/UserRoleContext';

import style from './style.module.css';

function Navigation() {
  const { account } = useContext(AppContext);
  const { userRole } = useContext(UserRoleContext);

  return (
    <>
      {account && (
        <nav>
          <ul className={style.ul}>
            {userRole === 'Admin' && (
              <>
                <li>
                  <NavLink to="/admin">Overview</NavLink>
                </li>
              </>
            )}

            {userRole === 'Teacher' && (
              <li>
                <NavLink to="/teacher">Overview</NavLink>
              </li>
            )}

            {userRole === 'Student' && (
              <li>
                <NavLink to="/student">Overview</NavLink>
              </li>
            )}
          </ul>
        </nav>
      )}
    </>
  );
}

export default Navigation;
