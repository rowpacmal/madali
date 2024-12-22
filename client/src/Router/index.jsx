import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../Layout';
import Home from '../pages/home';
import Admin from '../pages/Admin';
import Teacher from '../pages/Teacher';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<h2>404</h2>} />
          <Route index element={<Home />} />

          <Route path="admin">
            <Route index element={<Admin />} />
          </Route>

          <Route path="teacher">
            <Route index element={<Teacher />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
