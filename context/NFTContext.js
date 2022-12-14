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

// FETCH-CONTRACT UTILITY FUNCTION: FOR FETCHING CONTRACT
const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

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

  // FUNCTION 4: CREATE NFT WITH NAME, DESCRIPTION AND IMAGE AS IMAGE-URL AND ALSO CREATING SALE FUNCTION
  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;
    console.log('holla');
    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);

      const url = `https://mynftmarketplace.infura-ipfs.io/ipfs/${added.path}`;

      await createSale(url, price);

      router.push('/');
    } catch (error) {
      console.log('Error uploading file to the IPFS ', error);
    }
  };

  // FUNCTION 5: CREATES NFT SALE USING SMART-CONTRACT BUILD IN 'MyNFTContract'
  const createSale = async (url, formInputPrice, isReselling, id) => {
    // ESTABLISHING CONNECTIONS REQUIRED FOR CONTRACT FETCHING
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether'); // CONVERTION: PRICE FROM (0.025 i.e HUMAN READABLE FORM) TO (25000000000 i.e. WHAT ACTUALLY BLOKCHAIN CONTRACT ACCEPTS)

    const contract = fetchContract(signer);

    const listingPrice = await contract.getListingPrice();

    const transaction = !isReselling
      ? await contract.createToken(url, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() });

    transaction.wait();
  };

  // FUNCTION 6: FOR FETCHING ALL THE NFTs CREATED USING 'fetchMarketItems' SMART CONTRACT
  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    // FETCHING ALL THE NFTS DATA
    const data = await contract.fetchMarketItems();

    // STORING DATA IN ITEMS ARRAY IN PROPER FORMAT
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);

      const { data: { image, name, description } } = await axios.get(tokenURI);

      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether'); // CONVERTION: PRICE FROM (25000000000 A HEXADECIMAL BIG INTEGER i.e. WHAT ACTUALLY BLOKCHAIN CONTRACT STORE) TO (0.025 i.e HUMAN READABLE FORM)

      return {
        tokenURI,
        image,
        name,
        description,
        price,
        seller,
        owner,
        tokenId: tokenId.toNumber(),
      };
    }));

    return items;
  };

  // FUNCTION 7: FETCH LISTED NFTs OR MY-NFTs BASED ON PASSED TYPE
  const fetchListedNFTsOrMyNFTs = async (type) => {
    // ESTABLISHING CONNECTIONS REQUIRED FOR CONTRACT FETCHING
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data = type === 'fetchItemsListed'
      ? await contract.fetchNFTsListed()
      : await contract.fetchMyNFTs();

    // STORING DATA IN ITEMS ARRAY FROM DATA BY CONVERTING IT INTO PROPER FORMAT
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);

      const { data: { image, name, description } } = await axios.get(tokenURI);

      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether'); // CONVERTION: PRICE FROM (25000000000 A HEXADECIMAL BIG INTEGER i.e. WHAT ACTUALLY BLOKCHAIN CONTRACT STORE) TO (0.025 i.e HUMAN READABLE FORM)

      return {
        tokenURI,
        image,
        name,
        description,
        price,
        seller,
        owner,
        tokenId: tokenId.toNumber(),
      };
    }));

    return items;
  };

  // FUNCTION 8: BUY LISTED NFT
  const buyNFT = async (nft) => {
    // ESTABLISHING CONNECTIONS REQUIRED FOR CONTRACT FETCHING
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether'); // CONVERTION: PRICE FROM (0.025 i.e HUMAN READABLE FORM) TO (25000000000 i.e. WHAT ACTUALLY BLOKCHAIN CONTRACT ACCEPTS)

    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });

    transaction.wait();
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, currentAccount, connectToWallet, uploadToIPFS, createNFT, fetchNFTs, fetchListedNFTsOrMyNFTs, buyNFT, createSale }}>
      {children}
    </NFTContext.Provider>
  );
};
