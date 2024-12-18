import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ConnectWalletButton from '../components/ConnectWalletButton';

function Layout() {
  return (
    <>
      <header>
        <h1>Madali</h1>

        <ConnectWalletButton />

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
