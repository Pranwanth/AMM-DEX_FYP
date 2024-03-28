import { injected } from "wagmi/connectors";
import { useConnect, useAccount, useDisconnect } from "wagmi";
interface Props {
  className?: string;
}

const ConnectWalletButton = (props: Props) => {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { className } = props;
  return isConnected ? (
    <div className="flex gap-2 items-center">
      <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 border border-sky-800">
        {/* <svg
          className="absolute w-12 h-12 text-sky-800 -left-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          ></path>
        </svg> */}
        <img
          src="https://img.lovepik.com/free-png/20210926/lovepik-cartoon-avatar-png-image_401440477_wh1200.png"
          alt="placeholder"
        />
      </div>
      {address?.slice(0, 6)}...{address?.slice(address?.length - 5)}
      <button onClick={() => disconnect()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
          />
        </svg>
      </button>
    </div>
  ) : (
    <button
      className={`connect-wallet-btn ${className ?? ""}`}
      onClick={() => connect({ connector: injected() })}
    >
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;
