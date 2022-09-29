import React from 'react';

const Input = ({ inputType, title, placeholder, handleChange }) => (
  <div className="mt-10 w-full">
    <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
      {title}
    </p>

    {
        inputType === 'number' ? (
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins text-base mt-4 px-4 py-3 dark:text-white text-nft-gray-2 flexBetween flex-row">
            <input
              type="number"
              className="flex w-full dark:bg-nft-black-1 bg-nft-white outline-none"
              placeholder={placeholder}
              onChange={handleChange}
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-lg">
              ETH
            </p>
          </div>

        ) : inputType === 'textarea' ? (

          <textarea
            rows={10}
            className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg  w-full outline-none font-poppins text-base mt-4 px-4 py-3 dark:text-white text-nft-gray-2"
            placeholder={placeholder}
            onChange={handleChange}
          />

        ) : (
          <input
            className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg  w-full outline-none font-poppins text-base mt-4 px-4 py-3 dark:text-white text-nft-gray-2"
            placeholder={placeholder}
            onChange={handleChange}
          />
        )
    }

  </div>
);

export default Input;
