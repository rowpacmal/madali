import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react';

// Create context.
const AppContext = createContext({});

// Web3 provider.
const ethereum = window.ethereum;
const warningMessage =
  'Warning: A web3 provider is required. Please install a web3 wallet such as MetaMask.';

function AppProvider({ children }) {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Function to connect wallet.
  const connectWallet = async () => {
    if (ethereum) {
      try {
        const newProvider = new ethers.BrowserProvider(ethereum);
        // const accounts = await newProvider.send('eth_requestAccounts', []);
        const newSigner = await newProvider.getSigner();

        setProvider(newProvider);
        setSigner(newSigner);
        // setAccount(accounts[0]);
        setAccount(newSigner.address);

        // console.info('Wallet connected:', accounts[0]);
        console.info('Wallet connected:', newSigner.address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.warn(warningMessage); // Handle case where web3 provider is not installed.
    }
  };

  // Connect wallet on page load.
  useEffect(() => {
    const autoConnectWallet = async () => {
      if (ethereum) {
        try {
          // Check for connected accounts
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });

          if (accounts.length > 0) {
            console.info('Auto-connecting wallet:', accounts[0]);

            await connectWallet();
          } else {
            console.info('No accounts connected to dApp.');
          }
        } catch (error) {
          console.error('Failed to auto-connect wallet:', error);
        }
      } else {
        console.warn(warningMessage); // Handle case where web3 provider is not installed.
      }
    };

    autoConnectWallet();
  }, []);

  // Listener for account and network changes.
  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts) => {
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

      ethereum.on('chainChanged', () => {
        console.info('Network changed, reloading...');

        window.location.reload(); // Reload to handle network changes.
      });
    } else {
      console.warn(warningMessage); // Handle case where web3 provider is not installed.
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        account,
        setAccount,
        provider,
        setProvider,
        signer,
        setSigner,
        connectWallet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
