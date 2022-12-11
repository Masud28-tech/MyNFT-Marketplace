import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { Button, Input, Loader } from '../components';
import { NFTContext } from '../context/NFTContext';

const ResellNft = () => {
  const router = useRouter();
  const { createSale } = useContext(NFTContext);
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { tokenId, tokenURI } = router.query;

  const fetchNFT = async () => {
    const { data } = await axios.get(tokenURI);

    setPrice(data.price);
    setImage(data.image);
    setIsLoading(false);
  };

  useEffect(() => {
    if (tokenURI) fetchNFT();
  }, [tokenURI]);

  const resellNFT = async () => {
    console.log(price);
    await createSale(tokenURI, price, true, tokenId);

    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">
          Resell NFT
        </h1>

        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleChange={(e) => setPrice(e.target.value)}
        />

        {
            image && <img src={image} className="rounded mt-4" width={350} />
        }

        <div className="mt-7 flex justify-start w-full">
          <Button
            btnName="List NFT"
            customStyles="rounded-lg "
            handleClick={resellNFT}
          />
        </div>
      </div>
    </div>
  );
};

export default ResellNft;
