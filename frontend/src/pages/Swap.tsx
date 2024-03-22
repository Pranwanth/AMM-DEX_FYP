import { useState } from "react";

import ConnectWalletButton from "../components/ConnectWalletButton";
import SwapInput from "../components/SwapInput/SwapInput";
import SwapTokenButton from "../components/SwapTokenButton";
import SwapActionButton from "../components/SwapActionButton";
import { useAccount } from "wagmi";

const Swap = () => {
  const { isConnected } = useAccount();
  const [payAmount, setPayAmount] = useState<number>(0);
  const [receiveAmount, setReceiveAmount] = useState<number>(0);

  const onInputChange = (key: "pay" | "receive", value: string) => {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      console.error(`${value} cannot be converted to Number`);
      return;
    }

    switch (key) {
      case "pay": {
        setPayAmount(numValue);
        // do something to receive
        break;
      }
      case "receive": {
        setReceiveAmount(numValue);
        // do something to pay
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <section className="mt-12 mx-auto w-128 relative">
      <h3 className="text-sky-800 font-bold">Swap</h3>
      <div>
        <SwapInput
          name="pay"
          value={payAmount.toString(10)}
          onChangeFunc={onInputChange}
        />
        <SwapInput
          name="receive"
          value={receiveAmount.toString(10)}
          onChangeFunc={onInputChange}
        />
        <SwapTokenButton />
      </div>
      {isConnected ? <SwapActionButton /> : <ConnectWalletButton />}
    </section>
  );
};

export default Swap;
