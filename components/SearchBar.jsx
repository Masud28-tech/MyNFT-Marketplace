import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import images from '../assets';

const SearchBar = ({ setActiveSelect, handleSearch, clearSearch }) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(debouncedSearch);
    }, 1000);

    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  useEffect(() => {
    if (search) {
      handleSearch(search);
    } else {
      clearSearch();
    }
  }, [search]);

  return (
    <>
      <div className="flex-1 flexCenter dark:bg-nft-black-2 bg-white border dark:border-nft-black-1 border-nft-gray-2 px-3 py-3 rounded-md">
        <Image
          src={images.search}
          alt="search"
          className={theme === 'light' && 'filter invert'}
          objectFit="contain"
          height={20}
          width={20}
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setDebouncedSearch(e.target.value)}
          placeholder="Search NFT here..."
          className="dark:bg-nft-black-2 bg-white mx-4 w-full dark:text-white text-nft-black-1 font-noraml text-xs outline-none"
        />
      </div>
      <div className="relative flexBetween ml-4 sm:ml-0 sm:mt-2 min-w-190 cursor-pointer dark:bg-nft-black-2 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-md px-4">
        <p className="font-poppins dark:text-white text-nft-black-1 font-noraml text-sm">
          Recenty Listed
        </p>
        <Image
          src={images.arrow}
          objectFit="contain"
          width={15}
          height={15}
          className={theme === 'light' && 'filter invert'}
          onClick={() => setToggle((preVal) => !preVal)}
        />
        {toggle && (
        <div className="absolute top-full left-0 right-0 w-full mt-3 z-10 dark:bg-nft-black-2 bg-white border dark:border-nft-black-1 border-nft-gray-2 py-3 px-3 rounded-md">
          {['Recently added', 'Price (low to high)', 'Price (high to low)'].map((item, idx) => (
            <p
              key={idx}
              className="font-poppins dark:text-white text-nft-black-1 font-noraml text-xs my-3 hover:text-sm"
              onClick={() => setActiveSelect(item)}
            >
              {item}
            </p>
          ))}
        </div>
        )}
      </div>

    </>
  );
};

export default SearchBar;
