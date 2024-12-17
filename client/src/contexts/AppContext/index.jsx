import { createContext, useState } from 'react';

const AppContext = createContext({});

function AppProvider({ children }) {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  return (
    <AppContext.Provider
      value={{ account, setAccount, provider, setProvider, signer, setSigner }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
