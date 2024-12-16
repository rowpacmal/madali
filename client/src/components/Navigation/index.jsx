import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { ContractContext } from '../../contexts/ContractContext';

function Navigation() {
  const { userRole } = useContext(ContractContext);

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        {userRole === 'Admin' && (
          <li>
            <NavLink to="/admin">Admin</NavLink>
          </li>
        )}

        {userRole === 'Teacher' && (
          <li>
            <NavLink to="/teacher">Teacher</NavLink>
          </li>
        )}

        {userRole === 'Student' && (
          <li>
            <NavLink to="/student">Student</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
