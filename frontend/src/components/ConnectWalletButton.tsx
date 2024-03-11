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
    <div className="flex gap-2">
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
      className={`w-full text-center font-bold bg-sky-900 text-white p-4 rounded ${
        className ?? ""
      }`}
      onClick={() => connect({ connector: injected() })}
    >
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;
