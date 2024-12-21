import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { ClipboardTextFilled } from '../../icons/ClipboardText';

import style from './style.module.css';

function ConnectWalletButton() {
  const { account, isConnecting, connectWallet } = useContext(AppContext);

  return (
    <>
      {isConnecting ? (
        <p>Loading...</p>
      ) : (
        <div>
          {account ? (
            <button type="button">
              {account.substring(0, 6)}...
              {account.substring(account.length - 4)}
            </button>
          ) : (
            <button type="button" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default ConnectWalletButton;
