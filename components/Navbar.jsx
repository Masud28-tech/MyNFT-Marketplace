import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import Button from './Button';
import image from '../assets';

// CHILD FUNCTIONAL COMPONENT 1
const MenuItems = ({ isMobile, active, setActive }) => {
  const goToLink = (idx) => {
    switch (idx) {
      case 0: return 'explore-nfts';
      case 1: return 'listed-nfts';
      case 2: return 'my-nfts';
      default: return '/';
    }
  };
  return (
    <ul className={`list-none flexCenter ${isMobile && 'flex-col h-full'}`}>

      {['Explore NFTs', 'Listed NFTs', 'My NFTs'].map((item, idx) => (
        <li
          key={idx}
          onClick={() => setActive(item)}
          className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 ${active === item ? 'dark:text-white text-nft-black-1' : 'dark:text-nft-gray-3 text-nft-gray-2'}`}
        >
          <Link href={goToLink(idx)}>{item}</Link>
        </li>
      ))}

    </ul>
  );
};

// CHILD FUNCTIONAL COMPONENT 2
const ButtonGroup = ({ setActive, router }) => {
  const hasConnected = true;
  return hasConnected ? (
    <Button
      btnName="Create"
      customStyles="rounded-xl"
      handleClick={() => {
        setActive('');
        router.push('/create-nft');
      }}
    />
  ) : (
    <Button btnName="Connect" customStyles="rounded-xl" handleClick={() => { }} />
  );
};

const Navbar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState('Explore NFTs');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flexBetween w-full fixed z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-bft-black-1 border-nft-grey-1">

      {/* LOGO AND BRANDING */}
      <div className="flex flex-1 flex-row justify-start">
        {/* A] FOR DESKTOP VIEW */}
        <Link href="/">
          <div className="flexCenter md:hidden cursor:pointer" onClick={() => { }}>
            <Image src={image.logo02} objectFit="contain" width={32} height={32} alt="logo" />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">
              MyNFT Market
            </p>
          </div>
        </Link>

        {/* B] FOR MOBILE AND TAB VIEW */}
        <Link href="/">
          <div className="hidden md:flex cursor:pointer" onClick={() => { }}>
            <Image src={image.logo02} objectFit="contain" width={32} height={32} alt="logo" />
          </div>
        </Link>
      </div>

      <div className="flex flex-initial flex-row jusitfy-end">
        {/* DARK/LIGHT THEME TOGGLE */}
        <div className="flex items-center mr-2">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <label htmlFor="checkbox" className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="ball w-3 h-3 absolute bg-white rounded-full" />
          </label>
        </div>
      </div>

      {/* NAVBAR LINKS/ITEMS AND BUTTONS  */}
      {/* A] FOR DESKTOP VIEW:  */}
      <div className="md:hidden flex">
        <MenuItems active={active} setActive={setActive} />
        <div className="ml-4">
          <ButtonGroup setActive={setActive} router={router} />
        </div>
      </div>

      {/* B] FOR MOBILE VIEW:  */}
      <div className="hidden md:flex ml-2">
        {isMenuOpen ? (
          <Image
            src={image.cross}
            objectFit="contain"
            width={20}
            height={20}
            alt="close-menu"
            onClick={() => setIsMenuOpen(false)}
            className={theme === 'light' && 'filter invert'}
          />
        ) : (
          <Image
            src={image.menu}
            objectFit="contain"
            width={20}
            height={20}
            alt="open-menu"
            onClick={() => setIsMenuOpen(true)}
            className={theme === 'light' && 'filter invert'}
          />
        )}
        {
          isMenuOpen && (
            <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
              <div className="flex-1 p-4">
                <MenuItems active={active} setActive={setActive} isMobile />
              </div>
              <div className="flexCenter p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
                <ButtonGroup setActive={setActive} router={router} />
              </div>
            </div>
          )
        }
      </div>
    </nav>
  );
};

export default Navbar;
