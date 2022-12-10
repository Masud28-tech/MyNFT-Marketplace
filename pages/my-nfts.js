import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';

import { Banner, Loader, NFTCard } from '../components';
import { NFTContext } from '../context/NFTContext';
import images from '../assets';
import { trimAddress } from '../utils/trimAddress';

const MyNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { fetchListedNFTsOrMyNFTs, currentAccount } = useContext(NFTContext);

  // USE-EFFECT: FOR FETCHING My NFTs ON LOAD
  useEffect(() => {
    fetchListedNFTsOrMyNFTs()
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

  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          bannerTitle="Your Nifty NFTs"
          parentStyles="h-80 justify-center"
          childStyles="text-center mb-4"
        />

        <div className="felxCenter flex-col -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 rounded-full bg-nft-black-2">
            <Image
              className="rounded-full object-cover"
              src={images.creator}
              alt="creator-img"
              objectFit="cover"
            />
          </div>
          <p className="font-poppins font-semibold text-2xl mt-6 text-nft-black-1 dark:text-white">
            {currentAccount && trimAddress(currentAccount)}
          </p>
        </div>
      </div>

      {!isLoading && nfts.length === 0 ? (
        <div className="flexCenter p-16 sm:p-4">
          <h1 className="font-poppins font-extrabold text-3xl mt-6 text-nft-black-1 dark:text-white">
            No NFTs Owned
          </h1>
        </div>
      ) : (
        <div className="p-12 sm:px-4 w-full minmd:w-4/5 flexCenter flexCol">
          <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
            {/* Search Bar */}
          </div>
          <div className="flex flex-wrap mt-3 w-full">
            {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFTs;
