import { Link, Outlet } from 'react-router-dom';
import Navigation from '../components/ui/Navigation';
import ConnectWalletButton from '../components/ui/ConnectWalletButton';
import Plant from '../components/icons/Plant';

import style from './style.module.css';

function Layout() {
  return (
    <>
      <header>
        <div className={style.connect}>
          <Link to="/">
            <h1 className={style.h1}>
              <Plant size={40} />

              <span>madali</span>
            </h1>
          </Link>

          <ConnectWalletButton />
        </div>

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
