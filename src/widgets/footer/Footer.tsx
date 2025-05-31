import FooterIcon from "../../assets/footer-icon.png";

export const Footer = () => {
  return (
    <footer className="relative bg-white mt-10 py-6 px-4 flex justify-center items-center">
      <div className="text-xl font-bold text-black text-center w-full">
        @ 2025 PowderPeak
      </div>
      <img
        src={FooterIcon}
        alt="Cat on Skis"
        className="hidden md:block absolute right-4 bottom-0 h-24"
      />
    </footer>
  );
};

export default Footer;
