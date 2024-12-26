import { Link, Outlet } from 'react-router-dom';
import Navigation from '../components/ui/Navigation';
import ConnectWalletButton from '../components/ui/ConnectWalletButton';
import Plant2 from '../components/icons/Plant2';
import style from './style.module.css';

// This is the main layout of the app.
// It contains header, navigation bar, main content and footer.
function Layout() {
  return (
    <>
      <header className={style.header}>
        <Link to="/">
          <h1 className={style.h1}>
            <Plant2 size={40} />

            <span>madali</span>
          </h1>
        </Link>

        <div className={style.connected}>
          <Navigation />

          <ConnectWalletButton />
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className={style.footer}>
        <p>&copy; Madali Education 2024</p>
      </footer>
    </>
  );
}

export default Layout;
