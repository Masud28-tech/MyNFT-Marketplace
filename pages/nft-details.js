import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button, Loader, Modal } from '../components';
import { NFTContext } from '../context/NFTContext';
import { trimAddress } from '../utils/trimAddress';

import images from '../assets';

const PaymentBodyComp = ({ nft, nftCurrency }) => (
  <div className="flex flex-col">
    <div className="flexBetween">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
        Item
      </p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
        Subtotal
      </p>
    </div>

    <div className="flexBetweenStart my-5">
      <div className="flex-1 flexStartCenter">
        <div className="relative w-28 h-28">
          <Image src={nft.image || images[`${nft.i}`]} layout="fill" objectFit="cover" />
        </div>

        <div className="flexCenterStart flex-col ml-5">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
            {trimAddress(nft.seller)}
          </p>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
            {nft.name}
          </p>
        </div>
      </div>

      <div>
        <p className="font-poppins dark:text-white text-nft-black-1 font-noraml text-sm minlg:text-xl">
          {nft.price} <span className="font-semibold"> {nftCurrency} </span>
        </p>
      </div>
    </div>

    <div className="flexBetween mt-10">
      <p className="font-poppins dark:text-white text-nft-black-1 font-noraml text-sm minlg:text-xl">
        Total
      </p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-noraml text-sm minlg:text-xl">
        {nft.price} <span className="font-semibold">{nftCurrency}</span>
      </p>
    </div>
  </div>
);

const NFTDetails = () => {
  const router = useRouter();
  const { currentAccount, nftCurrency, buyNFT } = useContext(NFTContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [nft, setNft] = useState({ image: '', tokenId: '', tokenURI: '', name: '', description: '', owner: '', price: '', seller: '' });

  useEffect(() => {
    if (!router.isReady) return;

    setNft(router.query);
    setIsLoading(false);
  }, [router.isReady]);

  const checkoutNFTBuy = async () => {
    await buyNFT(nft);

    setIsModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 midmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-full h-557">
          <Image src={nft.image || images[`${nft.i}`]} alt="nft-image" objectFit="cover" className="rounded-xl shadow-lg" layout="fill" />
        </div>
      </div>

      <div className="flex-1 justify-start sm:px-4 p-12 sm:bg-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">
            {nft.name}
          </h2>
        </div>

        <div className="mt-10">
          <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs  minlg:text-base">
            Creator
          </p>

          <div className="flex flex-row items-center mt-3">
            <div className="reltaive w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image
                src={images.creator1}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs  minlg:text-base">
              {trimAddress(nft.seller)}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col">

          <div className="w-full border-b border-nft-gray-1 dark:border-nft-black-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-base font-medium mb-2">
              Details
            </p>
          </div>

          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal">
              {nft.description}
            </p>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col mt-10">
          {
            currentAccount === nft.seller.toLowerCase()
              ? (
                <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal border border-gray p-2">
                  You cannot buy your own NFT
                </p>
              )
              : currentAccount === nft.owner.toLowerCase()
                ? (
                  <Button
                    btnName="List on Marketplace"
                    customStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                    handleClick={() => router.push(`/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)}
                  />
                )
                : (
                  <Button
                    btnName={`Buy for ${nft.price} ${nftCurrency}`}
                    customStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                    handleClick={() => setIsModalOpen(true)}
                  />
                )
          }
        </div>
      </div>
      {
        isModalOpen
        && (
        <Modal
          header="Check Out"
          body={<PaymentBodyComp nft={nft} nftCurrency={nftCurrency} />}
          footer={(
            <div className="flex flex-row sm:flex-col">
              <Button
                btnName="Check out"
                customStyles="rounded-xl mr-5 sm:mb-5 sm:mr-0"
                handleClick={checkoutNFTBuy}
              />

              <Button
                btnName="Cencel"
                customStyles="rounded-xl"
                handleClick={() => setIsModalOpen(false)}
              />
            </div>
          )}
          handleClose={() => { setIsModalOpen(false); }}
        />
        )
      }

      {
        isSuccessModalOpen
        && (
          <Modal
            header="Payment Successfull"
            body={(
              <div className="flexCenter flex-col text-center">
                <div className="relative w-52 h-52">
                  <Image src={nft.image || images[`${nft.i}`]} objectFit="cover" layout="fill" />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl mt-10">
                  You successfully purchased <span> {nft.name} </span> from <span> {trimAddress(nft.seller)}</span>
                </p>
              </div>
            )}
            footer={(
              <Button
                btnName="Check it out"
                customStyles="rounded-xl sm:mb-5"
                handleClick={() => { router.push('/my-nfts'); }}
              />
            )}
            handleClose={() => setIsSuccessModalOpen(false)}
          />
        )
      }
    </div>
  );
};

export default NFTDetails;
