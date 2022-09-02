// Imports
// ========================================================
import { ethers } from "ethers";
import React, { useState } from "react";

// Main Component
// ========================================================
const App = () => {
  // State / Props
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [signerAddress, setSignerAddress] = useState('');

  // Functions
  const onClickConnect = async () => {
    if (window?.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts?.[0]);
      setIsWalletConnected(true);
      // Reset other values
      setMessage('');
      setSignature('');
      setSignerAddress('');
    } else {
      alert('Browser wallet connection not supported!');
    }
  }

  const onChangeWalletAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value);
  }

  const onChangeInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }

  const onChangeInputSignature = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignature(event.target.value);
  }

  const onSubmitFormSignMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message) return;
    if (window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signedSignature = await signer.signMessage(message);
      setSignature(signedSignature);
      // const address = await signer.getAddress();
    } else {
      alert('Browser wallet connection not supported!');
    }
  }

  const onSubmitFormVerifyMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (window?.ethereum) {
      const signerAddress = await ethers.utils.verifyMessage(message, signature);
      setSignerAddress(signerAddress);
    } else {
      alert('Browser wallet connection not supported!');
    }
  }

  // Render
  return (
    <div className="App">
      <h1>React Signature Implementation</h1>
      {!isWalletConnected
        ? <button onClick={onClickConnect}>Connect Wallet</button>
        : <div>
          <h2>Signing Message</h2>
          <p><strong><small>Connected Wallet</small></strong></p>
          <pre><code>{walletAddress}</code></pre>
          <form onSubmit={onSubmitFormSignMessage}>
            <div className="group">
              <label htmlFor="message">Message To Sign:</label>
              <input id="message" type="text" placeholder="Ex: hello world" value={message} onChange={onChangeInputMessage} />
            </div>
            <div className="group">
              <button>Sign Message</button>
            </div>
          </form>

          <hr />

          <h2>Verifying Message</h2>
          <form onSubmit={onSubmitFormVerifyMessage}>
            <div className="group">
              <label htmlFor="address">Wallet Address:</label>
              <input id="address" type="text" placeholder="Ex: hello world" value={walletAddress} onChange={onChangeWalletAddress} />
            </div>
            <div className="group">
              <label htmlFor="message">Message:</label>
              <input id="message" type="text" placeholder="Ex: hello world" value={message} onChange={onChangeInputMessage} />
            </div>
            <div className="group">
              <label htmlFor="signature">Signature:</label>
              <input id="signature" type="text" placeholder="Ex: 0xa123..." value={signature} onChange={onChangeInputSignature} />
            </div>
            <div className="group">
              <button>Verify Message</button>
            </div>
          </form>

          <p><strong><small>Verification:</small></strong></p>

          <pre>
            <code>{JSON.stringify({
              walletAddress,
              signerAddress,
              isVerified: walletAddress === signerAddress.toLowerCase() ? '✅' : '❌'
            }, null, ' ')}
            </code>
          </pre>

          <hr />

          <p><strong><small>Debug:</small></strong></p>

          <pre>
            <code>{JSON.stringify({
              message,
              signature,
              walletAddress,
              signerAddress
            }, null, ' ')}
            </code>
          </pre>
        </div>}
    </div>
  );
};

// Exports
// ========================================================
export default App;
