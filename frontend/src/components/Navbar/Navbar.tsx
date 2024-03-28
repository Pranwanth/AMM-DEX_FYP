import { Link } from "react-router-dom";
import ConnectWalletButton from "../ConnectWalletButton";
const Navbar = () => {
  return (
    <nav className="flex justify-between w-full px-8 py-3 bg-white">
      <div className="flex gap-8 text-xl text-primaryText font-bold items-center">
        <Link to="/" className="bg-gradient-to-r from-sky-400 via-sky-700 to-sky-950 inline-block text-transparent bg-clip-text">
          SkySwap
        </Link>
        <Link to="/">Swap</Link>
        <Link to="/pool">Pool</Link>
      </div>
      <ConnectWalletButton className="w-40 p-2" />
    </nav>
  );
};

export default Navbar;
