import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserRoleContext } from '../../../contexts/UserRoleContext';

import style from './style.module.css';

function Navigation() {
  const { userRole } = useContext(UserRoleContext);

  return (
    <>
      <nav>
        <ul className={style.ul}>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>

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
    </>
  );
}

export default Navigation;
