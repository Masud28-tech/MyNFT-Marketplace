/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['mynftmarketplace.infura-ipfs.io'],
  },
};

module.exports = nextConfig;
