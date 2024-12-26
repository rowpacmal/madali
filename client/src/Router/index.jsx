import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../Layout';
import Home from '../pages/home';
import Admin from '../pages/Admin';
import Teacher from '../pages/Teacher';
import Student from '../pages/Student';

// The Router component is used to handle the routing and rendering of the different pages.
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

          <Route path="student">
            <Route index element={<Student />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
