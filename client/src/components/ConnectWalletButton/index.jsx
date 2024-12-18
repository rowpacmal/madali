import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

function ConnectWalletButton() {
  const { account, isConnecting, connectWallet } = useContext(AppContext);

  return (
    <>
      {isConnecting ? (
        <p>Loading...</p>
      ) : (
        <div>
          {account ? (
            <p>Connected: {account}</p>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      )}
    </>
  );
}

export default ConnectWalletButton;
