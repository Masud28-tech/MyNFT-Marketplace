import { useState, useCallback, useMemo, useContext } from 'react';
import Router from 'next/router';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { useTheme } from 'next-themes';

import { Button } from '../components';
import images from '../assets';

const CreateNFT = () => {
  const { theme } = useTheme();
  const [fileUrl, setFileUrl] = useState(null);

  const onDrop = useCallback(() => {
    // It will upload images to ipfs (i.e. to the blockchain)
  }, []);

  const { getRootProps, getInputProps, isDragAccept, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });
  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:barder-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive && 'border-file-active'}
    ${isDragAccept && 'border-file-accept'}
    ${isDragReject && 'border-file-reject'}
    `
  ), [isDragAccept, isDragActive, isDragReject]);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold ml-4 xs:ml-0">
          Create New NFT
        </h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload File
          </p>

          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  PNG, GIF, SVM, WEBM Max 100Mb.
                </p>

                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="file upload"
                    className={theme === 'light' && 'filter invert'}
                  />
                </div>

                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  or Browse media on your device
                </p>
              </div>
            </div>

            {fileUrl && (
              <aside>
                <div>
                  <img src={fileUrl} alt="asset_file" />
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
