import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { ContractContext } from '../contexts/ContractContext';
import Navigation from '../components/Navigation';

function Layout() {
  const { userRole, walletAddress } = useContext(ContractContext);

  return (
    <>
      <header>
        <h1>Madali</h1>

        {userRole && <p>Role: {userRole}</p>}
        {walletAddress && <p>Wallet: {walletAddress}</p>}

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
