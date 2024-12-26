import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './contexts/AppContext/index.jsx';
import App from './App.jsx';

import './styles/index.css';

// The main entry point of the app.
// The AppProvider is used to provide the app context to the rest of the app.
// The App component is rendered inside the AppProvider.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
