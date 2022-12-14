import { useRef, useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Banner, CreatorCard, NFTCard, SearchBar } from '../components';
import { NFTContext } from '../context/NFTContext';
import images from '../assets';

import { getTopCreators } from '../utils/getTopCreators';
import { trimAddress } from '../utils/trimAddress';

const Home = () => {
  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const { fetchNFTs } = useContext(NFTContext);

  const [nfts, setNfts] = useState([]);
  const [showScrollBtns, setShowScrollBtns] = useState(false);
  // FOR SEARCHBAR
  const [copyNfts, setCopyNfts] = useState([]);
  const [activeSelected, setActiveSelected] = useState('Recently added');

  // GET TOP CREATORS USING UITILITY FUNCTION
  const topCreators = getTopCreators(copyNfts);

  // USE-EFFECT: FOR FETCHING ALL THE NFTs ON LOAD
  useEffect(() => {
    fetchNFTs()
      .then((items) => {
        setNfts(items);
        setCopyNfts(items);
      });
  }, []);

  // UTILITY FUNCTIONS FOR: BEST-CREATOR SCROLLCARDS
  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setShowScrollBtns(true);
    } else {
      setShowScrollBtns(false);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);
    return () => window.removeEventListener('resize', isScrollable);
  }, []);
  // END:UTILITY FUNCTIONS FOR: BEST-CREATOR SCROLLCARDS

  // START: UTILITY FUNCTIONS FOR SEARCHBAR
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

  // END: UTILITY FUNCTIONS FOR SEARCHBAR

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">

        {/*  BANNER DESCRIBING TAGLINE */}
        <Banner
          bannerTitle="Discover, collect, and sell extraordinary NFTs"
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
        />

        {/* BEST-CREATORS SCROLLABLE LIST/CARDS (SCROLLBAR OF CREATOR CARDS)  */}
        <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
            Best Creators
          </h1>
          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
              {/* REAL TOP CREATORS */}
              {topCreators && topCreators.map((creator, idx) => (
                <CreatorCard
                  key={creator.seller}
                  rank={idx + 1}
                  creatorImage={images[`creator${idx + 1}`]}
                  creatorName={trimAddress(creator.seller)}
                  creatorEths={creator.priceSum}
                />
              ))}

              {/* DUMMY TOP CREATORS */}
              {[1, 2, 3, 4, 5].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}`]}
                  creatorName="0xf34...j45g"
                  creatorEths={10 - i * 0.5}
                />
              ))}
              {showScrollBtns && (
                <>
                  <div className="absolute w-8 h-8 minlg:h-12 minlg:w-12 cursor-pointer left-0 top-45" onClick={() => handleScroll('left')}>
                    <Image
                      src={images.left}
                      objectFit="contain"
                      layout="fill"
                      alt="left-arrow"
                      className={theme === 'light' && 'filter invert'}
                    />
                  </div>
                  <div className="absolute w-8 h-8 minlg:h-12 minlg:w-12 cursor-pointer right-0 top-45" onClick={() => handleScroll('right')}>
                    <Image
                      src={images.right}
                      objectFit="contain"
                      layout="fill"
                      alt="right-arrow"
                      className={theme === 'light' && 'filter invert'}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* TOP NFTs FOR SELL (NFTs CARDS GRID) */}
        <div className="mt-12">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="flex-1 before:first:font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 ">
              Top NFTs
            </h1>

            <div className="flex-2 flex flex-row sm:w-full sm:flex-col ">
              <SearchBar setActiveSelect={setActiveSelected} handleSearch={onHandleSearch} clearSearch={onClearSearch} />
            </div>

          </div>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {
                nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)
            }
            {[1, 2, 3].map((i) => (
              <NFTCard
                key={`nft-${i}`}
                nft={{
                  i: `nft${i}`,
                  name: `Nifty-NFT ${i}`,
                  seller: '0xf34...j45g',
                  owener: '0xm38...k56l',
                  description: 'Aweesome NFT on sale',
                  price: (10 - i * 0.563).toFixed(2),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
