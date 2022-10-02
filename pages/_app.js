import { ThemeProvider } from 'next-themes';
import Script from 'next/script';

import { NFTProvider } from '../context/NFTContext';
import { Footer, Navbar } from '../components';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => (
  <NFTProvider>
    <ThemeProvider attribute="class">

      <div className="dark:bg-nft-dark bg-white">
        <Navbar />
        <div className="pt-65">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>

      <Script src="https://kit.fontawesome.com/716877afa3.js" crossOrigin="anonymous" />
    </ThemeProvider>
  </NFTProvider>
);

export default MyApp;
