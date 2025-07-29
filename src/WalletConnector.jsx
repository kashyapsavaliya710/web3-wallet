import React, { useState } from 'react';
import { ethers } from 'ethers';
import './WalletConnector.css';
import { Copy } from 'lucide-react';

const WalletConnector = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask not found. Please install MetaMask.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(4);
      const network = await provider.getNetwork();

      setWalletAddress(address);
      setWalletBalance(formattedBalance);
      setNetworkName(network.name);
      setConnected(true);
      setError('');
    } catch (err) {
      setError('Connection failed: ' + err.message);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setWalletBalance('');
    setNetworkName('');
    setConnected(false);
    setError('');
    setCopied(false);
  };

  const refreshBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(4);
      setWalletBalance(formattedBalance);
    } catch {
      setError('Failed to refresh balance.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="wallet-container">
      <div className="wallet-card">
        <div className="wallet-header">
          <h2>Wallet</h2>
          <div className={`wallet-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {connected ? (
          <div className="wallet-info">
            <div className="wallet-address-row">
              <p><strong>Address:</strong> {walletAddress}</p>
              <button className="copy-btn" onClick={handleCopy}>git
                {copied ? '✓' :  <Copy size={10} />}
              </button>
            </div>
            <p><strong>Balance:</strong> {walletBalance} ETH</p>
            <p><strong>Network:</strong> {networkName}</p>
            <div className="wallet-actions">
              <button onClick={refreshBalance}>Refresh</button>
              <button onClick={disconnectWallet} className="secondary">Disconnect</button>
            </div>
          </div>
        ) : (
          <button className="connect-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {error && <div className="wallet-error">{error}</div>}
      </div>
    </div>
  );
};

export default WalletConnector;
