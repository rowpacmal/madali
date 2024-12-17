import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import Navigation from '../components/Navigation';
import useGradingSystem from '../hooks/useGradingSystem';

function Layout() {
  const { account } = useContext(AppContext);
  const { userRole } = useGradingSystem();

  return (
    <>
      <header>
        <h1>Madali</h1>

        {userRole && <p>Role: {userRole}</p>}
        {account && <p>Wallet: {account}</p>}

        <Navigation />
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>&copy; Madali Education 2023</p>
      </footer>
    </>
  );
}

export default Layout;
