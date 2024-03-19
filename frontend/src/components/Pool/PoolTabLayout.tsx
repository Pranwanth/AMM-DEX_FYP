import { useState } from "react";
import AddLiquidityTab from "./AddLiquidityTab";
import { useAccount } from "wagmi";
import DepositButton from "./DepositButton";
import ConnectWalletButton from "../ConnectWalletButton";
import RemoveLiquidityTab from "./RemoveLiquidityTab";

const PoolTabLayout = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mt-8">
      <header className="text-sky-950">
        <button
          onClick={() => setActiveTab(0)}
          className={`text-xl mx-4 h-full p-2 rounded-xl ${
            activeTab === 0 && "bg-sky-900 text-white"
          }`}
        >
          Add
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`text-xl mr-4 h-full p-2 rounded-xl ${
            activeTab === 1 && "bg-sky-900 text-white"
          }`}
        >
          Remove
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`text-xl mr-4 h-full p-2 rounded-xl ${
            activeTab === 2 && "bg-sky-900 text-white"
          }`}
        >
          Active
        </button>
      </header>
      <section className="mt-4">
        {activeTab === 0 && <AddLiquidityTab />}
        {activeTab === 1 && <RemoveLiquidityTab />}
        {/* {activeTab === 2 && <ActiveLiquidityTab />} */}
      </section>
      {isConnected ? <DepositButton /> : <ConnectWalletButton />}
    </div>
  );
};

export default PoolTabLayout;
