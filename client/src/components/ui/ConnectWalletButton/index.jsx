import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';

function ConnectWalletButton() {
  const { account, isConnecting, connectWallet } = useContext(AppContext);

  return (
    <>
      {isConnecting ? (
        <p>Loading...</p>
      ) : (
        <div>
          {account ? (
            <p>
              Connected: {account.substring(0, 6)}...
              {account.substring(account.length - 4)}
            </p>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      )}
    </>
  );
}

export default ConnectWalletButton;
