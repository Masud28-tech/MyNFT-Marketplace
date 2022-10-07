import { useState, useEffect, useContext } from 'react';

import { Loader, NFTCard } from '../components';
import { NFTContext } from '../context/NFTContext';

const ListedNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchListedNFTsOrMyNFTs } = useContext(NFTContext);

  // USE-EFFECT: FOR FETCHING ALL THE NFTs ON LOAD
  useEffect(() => {
    fetchListedNFTsOrMyNFTs('fetchItemsListed')
      .then((items) => {
        setNfts(items);
        console.log({ items });
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter min-h-screen p-16 sm:p-4">
        <h1 className="font-poppins text-3xl font-extrabold dark:text-white text-nft-black-1">
          No NFTs Listed for sale.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen p-12 sm:px-4">
      <div className="w-full minmd:w-4/5">
        <div className="mt-4">
          <h2 className="font-poppins text-2xl font-semibold dark:text-white text-nft-black-1">
            NFTs Listed for Sale
          </h2>
        </div>
        <div className="flex w-full mt-3 flex-wrap justify-start md:justify-center">
          {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
        </div>
      </div>
    </div>
  );
};

export default ListedNFTs;
