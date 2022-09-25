import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Banner, CreatorCard, NFTCard } from '../components';
import images from '../assets';

const Home = () => {
  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const [showScrollBtns, setShowScrollBtns] = useState(false);

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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
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
        <div className="mt-10">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="flex-1 before:first:font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 ">
              Top NFTs
            </h1>
            <div>
              Search Bar
            </div>
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
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
