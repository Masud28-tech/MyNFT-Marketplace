import { useState, useEffect, useContext } from 'react';

import { Loader, NFTCard, SearchBar } from '../components';
import { NFTContext } from '../context/NFTContext';

const ListedNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [copyNfts, setCopyNfts] = useState([]);
  const [activeSelected, setActiveSelected] = useState('Recently added');
  const [isLoading, setIsLoading] = useState(true);

  const { fetchListedNFTsOrMyNFTs } = useContext(NFTContext);

  // USE-EFFECT: FOR FETCHING ALL THE NFTs ON LOAD
  useEffect(() => {
    fetchListedNFTsOrMyNFTs('fetchItemsListed')
      .then((items) => {
        setNfts(items);
        setCopyNfts(items);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelected) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelected]);

  const onHandleSearch = (search) => {
    const filteredNFTs = nfts.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));

    if (filteredNFTs.length) {
      setNfts(filteredNFTs);
    } else {
      setNfts(copyNfts);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && copyNfts.length) setNfts(copyNfts);
  };

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

          <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
            <SearchBar
              setActiveSelect={setActiveSelected}
              handleSearch={onHandleSearch}
              clearSearch={onClearSearch}
            />
          </div>

          <div className="flex flex-wrap mt-3 w-full">
            {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ListedNFTs;
