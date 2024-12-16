import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../Layout';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<h2>404</h2>} />
          <Route index element={<h2>Home</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
