import { UserRoleProvider } from './contexts/UserRoleContext';
import Router from './Router';

import './styles/App.css';

// The main App component.
// The User Role Provider is used to provide the user role to the rest of the app.
// The Router component is used to handle the routing and rendering of the different pages.
function App() {
  return (
    <UserRoleProvider>
      <Router />
    </UserRoleProvider>
  );
}

export default App;
