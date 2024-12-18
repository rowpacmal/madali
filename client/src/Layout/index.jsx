import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import Navigation from '../components/Navigation';

function Layout() {
  const { account } = useContext(AppContext);

  return (
    <>
      <header>
        <h1>Madali</h1>

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
