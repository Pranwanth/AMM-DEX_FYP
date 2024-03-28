import { useState } from "react";
import { useAccount } from "wagmi";

import Card from "../components/Card";
import ConnectWalletButton from "../components/ConnectWalletButton";
import TokenSelector from "../components/Dialog/TokenSelector";
import { Token } from "../components/GlobalTypes";
import InputField from "../components/Input/InputField";
import Popover from "../components/Popover/Popover";
import SettingsButton from "../components/SettingsButton";
import SettingsPopoverContent from "../components/SettingsPopoverContent";
import SwapActionButton from "../components/SwapActionButton";
import SwapTokenButton from "../components/SwapTokenButton";
import useSettingStore from "../store/useSettingStore";
import { swapExactTokensForTokens } from "../components/utils/helper";
import { approveERC20 } from "../components/utils/helper/ERC20";
import { ROUTER_ADDR } from "../components/utils/ContractAdresses";
import { createTokenApproveSuccessToastFromTx } from "../components/utils/toast";

const Swap = () => {
  const { isConnected, address: userAddress } = useAccount();
  const [openPopover, setOpenPopover] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [tokenZeroValue, setTokenZeroValue] = useState("");
  const [tokenOneValue, setTokenOneValue] = useState("");
  const [tokenZero, setTokenZero] = useState<Token | undefined>(undefined);
  const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
  const [approved, setApproved] = useState(false)

  const { swapSlippage } = useSettingStore();

  const handleSettings = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
    setOpenPopover(true);
  };

  const handleClosePopover = () => {
    setAnchorElement(null);
    setOpenPopover(false);
  };

  const selectTokenZero = (token: Token) => {
    setTokenZero(token);
  };

  const selectTokenOne = (token: Token) => {
    setTokenOne(token);
  };

  const onInputChange = (key: "tokenZero" | "tokenOne", value: string) => {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      console.error(
        `AddLiquidityTokenInput - ${value} cannot be converted to Number`
      );
      return;
    }

    if (key === "tokenZero") {
      setTokenZeroValue(value);
    } else {
      setTokenOneValue(value);
    }
  };

  // const onInputChange = (key: "pay" | "receive", value: string) => {
  //   const numValue = Number(value);

  //   if (isNaN(numValue)) {
  //     console.error(`${value} cannot be converted to Number`);
  //     return;
  //   }

  //   switch (key) {
  //     case "pay": {
  //       setPayAmount(numValue);
  //       // do something to receive
  //       break;
  //     }
  //     case "receive": {
  //       setReceiveAmount(numValue);
  //       // do something to pay
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // };
  const handleApprove = async () => {
    if (tokenZero && tokenZeroValue !== "") {
      const tx = await approveERC20({
        contractAddress: tokenZero.address,
        spenderAddress: ROUTER_ADDR,
        amount: tokenZeroValue,
      }, false)
      createTokenApproveSuccessToastFromTx([tx])
      setApproved(true)
    }
    else {
      return
    }
  }

  const handleSwap = async () => {
    if (tokenZero && tokenOne && tokenZeroValue !== "" && tokenOneValue !== "" && approved) {
      await swapExactTokensForTokens(
        tokenZeroValue,
        "0",
        [tokenZero.address, tokenOne.address],
        userAddress as string,
        Number.MAX_SAFE_INTEGER
      )
    }
    else {
      return
    }
  }

  return (
    <Card className="mt-12 mx-auto w-128 relative bg-gray-50 p-8 rounded-sm">
      <div className="flex justify-between mb-4">
        <h3 className="text-sky-950 text-2xl font-bold">Swap</h3>
        <SettingsButton onClick={handleSettings} />
        <Popover
          isOpen={openPopover}
          anchorElement={anchorElement}
          closePopover={handleClosePopover}
        >
          <SettingsPopoverContent />
        </Popover>
      </div>
      <div>
        <InputField
          type="number"
          min="0"
          value={tokenZeroValue}
          placeholder="0"
          onChange={(event) => onInputChange("tokenZero", event.target.value)}
        >
          <TokenSelector
            token={tokenZero}
            tokenSelectHandler={selectTokenZero}
          />
        </InputField>
        <InputField
          type="number"
          min="0"
          placeholder="0"
          value={tokenOneValue}
          onChange={(event) => onInputChange("tokenOne", event.target.value)}
        >
          <TokenSelector token={tokenOne} tokenSelectHandler={selectTokenOne} />
        </InputField>
        <div className="flex justify-between text-slate-500 py-4">
          <div>Slippage Tolerance</div>
          <div className="text-l text-black font-bold">{`${swapSlippage}%`}</div>
        </div>
        <SwapTokenButton />
      </div>
      {!isConnected && <ConnectWalletButton />}
      {isConnected && (
        <>
          {!approved
            ?
            <button className="connect-wallet-btn mt-5" onClick={handleApprove}>
              Approve Token
            </button>
            :
            <SwapActionButton handleClick={handleSwap} />
          }
        </>
      )}
    </Card>
  );
};

export default Swap;
