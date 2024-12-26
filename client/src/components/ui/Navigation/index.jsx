import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { UserRoleContext } from '../../../contexts/UserRoleContext';

import style from './style.module.css';

// This component is used to display the navigation bar.
// It changes based on the user's role.
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
                  <NavLink to="/admin">Dashboard</NavLink>
                </li>
              </>
            )}

            {userRole === 'Teacher' && (
              <li>
                <NavLink to="/teacher">Dashboard</NavLink>
              </li>
            )}

            {userRole === 'Student' && (
              <li>
                <NavLink to="/student">Dashboard</NavLink>
              </li>
            )}
          </ul>
        </nav>
      )}
    </>
  );
}

export default Navigation;
