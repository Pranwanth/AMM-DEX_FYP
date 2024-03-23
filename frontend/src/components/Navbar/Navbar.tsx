import { Link } from "react-router-dom";
import ConnectWalletButton from "../ConnectWalletButton";
const Navbar = () => {
  return (
    <nav className="flex justify-between w-full px-8 py-10">
      <div className="flex gap-8 text-xl text-primaryText font-bold">
        <button>
          <Link to="/">Swap</Link>
        </button>
        <button>
          <Link to="/pool">Pool</Link>
        </button>
      </div>
      <ConnectWalletButton className="w-40 p-2" />
    </nav>
  );
};

export default Navbar;
