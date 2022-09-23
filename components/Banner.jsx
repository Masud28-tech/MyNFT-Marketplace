
const Banner = ({ bannerTitle, parentStyles, childStyles }) => (
  <div className={`${parentStyles} relative w-full flex items-center overflow-hidden nft-gradient`}>
    <p className={`${childStyles} font-bold text-5xl font-poppins leading-70`}>
      {bannerTitle}
    </p>

    {/* DECORATIVE CIRCLE-1 */}
    <div className="absolute white-bg w-48 h-48 sm:w-32 sm:h-32 rounded-full -bottom-10 -left-16 z-5" />
    {/* DECORATIVE CIRCLE-2 */}
    <div className="absolute white-bg w-72 h-72 sm:w-56 sm:h-56 rounded-full -top-24 -right-14 z-5" />
  </div>
);

export default Banner;
