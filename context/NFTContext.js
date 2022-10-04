import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import axios from 'axios';

import { MarketAddress, MarketAddressABI } from './constants';

// IPFS (INTERPLANETORY FILE SYSTEM i.e. DISTRIBUTED FILE SYSTEM: CREATING CLIENT URL FOR CONNECTING TO INFURA THE IPFS ONLINE PLATFORM)
const projectId = '2FfzTqOSQwWfsk1fPvSFwjqRu64';
const projectSecret = '50431682f6ff6e9363756a2fbad425ef';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});
// IPFS - END

export const NFTContext = createContext();

export const NFTProvider = ({ children }) => {
  const nftCurrency = 'ETH';
  const [currentAccount, setCurrentAccount] = useState(null);

  // FUNCTION 1: CHECK IF METAMASK IS INSTALLED OR NOT. IF INSTALLED CONNECT WALLET ACCOUNT AUTOMATICALLY
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) { return alert('Please install Metamask!'); }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No Account found.');
    }
    console.log({ accounts });
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // FUNCTION 2: CONNECT TO METAMASK WALLET USING 'windows.ethereum.request' PROPERTY
  const connectToWallet = async () => {
    if (!window.ethereum) { return alert('Please install Metamask!'); }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);

    window.location.reload();
  };

  // FUCNTION 3: UPLOAD FILE(IMG) ON IPFS USING INFURA PLATFORM AND RETURNS URL OF IMG UPLOADED
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });

      const url = `https://mynftmarketplace.infura-ipfs.io/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.log(`Error uploading file to IPFS. ${error}`);
    }
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, currentAccount, connectToWallet, uploadToIPFS }}>
      {children}
    </NFTContext.Provider>
  );
};
