import { ContractProvider } from './contexts/ContractContext';
import Router from './Router';
import './styles/App.css';

function App() {
  return (
    <ContractProvider>
      <Router />
    </ContractProvider>
  );
}

export default App;
