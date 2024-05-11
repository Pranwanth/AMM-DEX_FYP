import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Card from "../components/Card";
import ConnectWalletButton from "../components/ConnectWalletButton";
import TokenSelector from "../components/Dialog/TokenSelector";
import { Token } from "../components/GlobalTypes";
import { InputField, InputFieldLabel } from "../components/Input";
import Popover from "../components/Popover/Popover";
import SettingsButton from "../components/SettingsButton";
import SettingsPopoverContent from "../components/SettingsPopoverContent";
import SwapActionButton from "../components/SwapActionButton";
import SwapTokenButton from "../components/SwapTokenButton";
import { ROUTER_ADDR } from "../components/utils/ContractAdresses";
import { formatToSixSignificantDigits } from "../components/utils/common";
import { findSwapPath, getAmountsIn, getAmountsOut, swapETHForExactTokens, swapExactETHForTokens, swapExactTokensForETH, swapExactTokensForTokens, swapTokensForExactETH, swapTokensForExactTokens } from "../components/utils/helper";
import { approveERC20 } from "../components/utils/helper/ERC20";
import { createTokenApproveSuccessToastFromTx } from "../components/utils/toast";
import useSettingStore from "../store/useSettingStore";
import useTokenGraphStore from "../store/useTokenGraphStore";

const Swap = () => {
  const { isConnected, address: userAddress } = useAccount();
  const [openPopover, setOpenPopover] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [tokenZeroValue, setTokenZeroValue] = useState("");
  const [tokenOneValue, setTokenOneValue] = useState("");
  const [tokenZero, setTokenZero] = useState<Token | undefined>(undefined);
  const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
  const [approved, setApproved] = useState(false)
  const [userChosenInputField, setUserChosenInputField] = useState<number | undefined>(undefined)
  const [swapPath, setSwapPath] = useState<string[]>([])

  const { swapSlippage } = useSettingStore();
  const { tokenGraph } = useTokenGraphStore();

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

  const onInputChange = async (key: "tokenZero" | "tokenOne", value: string) => {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      console.error(
        `SwapTokenInput - ${value} cannot be converted to Number`
      );
      return;
    }

    if (key === "tokenZero") {
      setTokenZeroValue(value);
      setUserChosenInputField(0)
      if (tokenZero && tokenOne && swapPath) {
        const amountsOut = await getAmountsOut(value, swapPath)
        const tokenOneQuantity = amountsOut[amountsOut.length - 1]
        setTokenOneValue(formatToSixSignificantDigits(tokenOneQuantity).toString(10))
      }
    } else {
      setTokenOneValue(value);
      setUserChosenInputField(1)
      if (tokenZero && tokenOne) {
        const amountsIn = await getAmountsIn(value, swapPath)
        const tokenZeroQuantity = amountsIn[0]
        setTokenZeroValue(formatToSixSignificantDigits(tokenZeroQuantity).toString(10))
      }
    }
  };

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
    if (tokenZero && tokenOne && approved) {
      const isInputETH = tokenZero.ticker === "ETH";
      const isOutputETH = tokenOne.ticker === "ETH";

      try {
        if (isInputETH) {
          // Swapping ETH for tokens
          if (userChosenInputField === 0) {
            await swapExactETHForTokens(
              "0",
              swapPath,
              userAddress as string,
              Number.MAX_SAFE_INTEGER,
              tokenZeroValue
            );
          } else {
            await swapETHForExactTokens(
              tokenOneValue,
              swapPath,
              userAddress as string,
              Number.MAX_SAFE_INTEGER,
              tokenZeroValue
            );
          }
        } else if (isOutputETH) {
          // Swapping tokens for ETH
          if (userChosenInputField === 0) {
            await swapExactTokensForETH(
              tokenZeroValue,
              "0",
              swapPath,
              userAddress as string,
              Number.MAX_SAFE_INTEGER
            );
          } else {
            await swapTokensForExactETH(
              tokenOneValue,
              tokenZeroValue,
              swapPath,
              userAddress as string,
              Number.MAX_SAFE_INTEGER
            );
          }
        } else {
          // Standard token to token swap
          if (userChosenInputField === 0) {
            // Exact tokens for tokens
            await swapExactTokensForTokens(
              tokenZeroValue,
              "0",
              swapPath,
              userAddress as string,
              Number.MAX_SAFE_INTEGER
            );
          } else {
            // Tokens for exact tokens
            await swapTokensForExactTokens(
              tokenOneValue,
              tokenZeroValue,
              swapPath,
              userAddress as string,
              Number.MAX_SAFE_INTEGER
            );
          }
        }
      } catch (error) {
        console.error("An error occurred during the swap:", error);
      }
    } else {
      console.error("Swap conditions not met: Missing input values, tokens, or approval.");
    }
  };

  useEffect(() => {
    const getSwapPath = async () => {
      if (tokenZero && tokenOne && tokenGraph) {
        const path = await findSwapPath(tokenGraph, tokenZero.address, tokenOne.address)
        if (path.length > 0) {
          setSwapPath(path)
        }
      }
    }
    getSwapPath()
  }, [tokenZero, tokenOne])

  const changeTokenPosition = () => {
    const initialTokenZero = tokenZero
    setTokenZero(tokenOne)
    setTokenOne(initialTokenZero)
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
        <InputFieldLabel>
          <div className="text-base text-secondaryText mb-2">You pay</div>
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
        </InputFieldLabel>
        <InputFieldLabel>
          <div className="text-base text-secondaryText mb-2">You receive</div>
          <InputField
            type="number"
            min="0"
            placeholder="0"
            value={tokenOneValue}
            onChange={(event) => onInputChange("tokenOne", event.target.value)}
          >
            <TokenSelector token={tokenOne} tokenSelectHandler={selectTokenOne} />
          </InputField>
        </InputFieldLabel>
        <div className="flex justify-between text-slate-500 py-4">
          <div>Slippage Tolerance</div>
          <div className="text-l text-black font-bold">{`${swapSlippage}%`}</div>
        </div>
        {(swapPath.length === 0 && tokenZero && tokenOne) && (
          <div className="text-red-600 py-4 text-center">
            <div>No swap path exists for this pair, please create a pool</div>
          </div>
        )}
        <SwapTokenButton changeTokenPosition={changeTokenPosition} />
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
            <SwapActionButton handleClick={handleSwap} disabled={swapPath.length === 0} />
          }
        </>
      )}
    </Card>
  );
};

export default Swap;
