import { ethers } from 'ethers';
import { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import Router from './Router';

import './styles/App.css';

function App() {
  /* const { setAccount, setProvider, setSigner } = useContext(AppContext);

  // Connect wallet on page load.
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    } else {
      console.warn('MetaMask is not installed.');
    }
  }, []);

  // Function to connect wallet.
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await newProvider.send('eth_requestAccounts', []);
        const newSigner = await newProvider.getSigner();

        setProvider(newProvider);
        setSigner(newSigner);
        setAccount(accounts[0]);

        console.info('Wallet connected:', accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.warn('MetaMask is not installed.');
    }
  };

  // Listener for account and network changes.
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          console.info('Account changed:', accounts[0]);
          connectWallet(); // Reconnect with the new account.
        } else {
          // Disconnect wallet if no accounts are found.
          console.info('No accounts found.');
          setAccount('');
          setProvider(null);
          setSigner(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        console.info('Network changed, reloading...');
        window.location.reload(); // Reload to handle network changes.
      });
    } else {
      console.warn('MetaMask is not installed.');
    }
  }, []); */

  return <Router />;
}

export default App;
