import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ContractContext } from '../contexts/ContractContext';

function Layout() {
  const { userRole, walletAddress } = useContext(ContractContext);

  return (
    <>
      <header>
        <h1>Madali</h1>

        <p>Role: {userRole}</p>
        <p>User: {walletAddress}</p>

        <nav>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/1">Link 1</NavLink>
            </li>
            <li>
              <NavLink to="/2">Link 2</NavLink>
            </li>
            <li>
              <NavLink to="/3">Link 3</NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
