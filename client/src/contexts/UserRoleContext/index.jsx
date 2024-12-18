import { createContext } from 'react';
import useUserRole from '../../hooks/useUserRole';

const UserRoleContext = createContext({});

function UserRoleProvider({ children }) {
  const { userRole } = useUserRole();

  return (
    <UserRoleContext.Provider value={{ userRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export { UserRoleContext, UserRoleProvider };
