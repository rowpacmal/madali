import { UserRoleProvider } from './contexts/UserRoleContext';
import Router from './Router';

import './styles/App.css';

function App() {
  return (
    <UserRoleProvider>
      <Router />
    </UserRoleProvider>
  );
}

export default App;
