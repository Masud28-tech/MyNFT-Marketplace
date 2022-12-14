export const getTopCreators = (nfts) => {
  const topCreators = nfts.reduce((creator, nft) => {
    (creator[nft.seller] = (creator[nft.seller] || [])).push(nft);
    return creator;
  }, {});

  return Object.entries(topCreators).map((creator) => {
    const seller = creator[0];
    const priceSum = creator[1].map((item) => Number(item.price)).reduce((prev, curr) => prev + curr, 0);

    return { seller, priceSum };
  });
};
