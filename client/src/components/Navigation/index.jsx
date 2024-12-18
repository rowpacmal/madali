import { NavLink } from 'react-router-dom';

function Navigation({ userRole }) {
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
