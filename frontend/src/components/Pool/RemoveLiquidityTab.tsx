import { useState } from "react";

import Card from "../Card";
import SettingsButton from "../SettingsButton";
import Slider from "../Slider/Slider";

import { ethers } from "ethers";
import { useAccount } from "wagmi";
import useUserPoolDataStore from "../../store/useUserPoolData";
import { ROUTER_ADDR } from "../utils/ContractAdresses";
import { ETHER_BIGINT_ZERO, formatEthersBigInt } from "../utils/common";
import { getPoolReserves, getTotalPoolLiquidityToken, removeLiquidity } from "../utils/helper";
import { approveERC20 } from "../utils/helper/ERC20";
import { createToastSuccess, createTokenApproveSuccessToastFromTx } from "../utils/toast";

const RemoveLiquidityTab = () => {
  const [percentage, setPercentage] = useState<number>(0);
  const [removeAmountA, setRemoveAmountA] = useState<bigint>(ETHER_BIGINT_ZERO);
  const [removeAmountB, setRemoveAmountB] = useState<bigint>(ETHER_BIGINT_ZERO);
  const [approved, setApproved] = useState<boolean>(false);
  const { poolData } = useUserPoolDataStore()

  const { address: userAddress } = useAccount()

  if (!poolData) return null

  const tokenATicker = poolData.pooledTokenA.ticker;
  const tokenBTicker = poolData.pooledTokenB.ticker;
  const poolSharePercentage = poolData.poolShare;

  const handleSliderChange = (value: number) => {
    const ethersBigInt100 = ethers.toBigInt(100)
    const percentageEthersBigInt = ethers.toBigInt(value)
    const toRemoveAmountA = percentageEthersBigInt * poolData.pooledTokenAQuantity / ethersBigInt100
    const toRemoveAmountB = percentageEthersBigInt * poolData.pooledTokenBQuantity / ethersBigInt100
    setRemoveAmountA(toRemoveAmountA)
    setRemoveAmountB(toRemoveAmountB)
    setPercentage(value)
    if (approved) setApproved(false)
  };

  const calculateLiquidityToRemove = async () => {
    const poolTotalSupply = await getTotalPoolLiquidityToken(poolData?.address)
    const [reserveA, reserveB] = await getPoolReserves(poolData.address)
    const liquidityToRemoveA = removeAmountA * poolTotalSupply / reserveA
    const liquidityToRemoveB = removeAmountB * poolTotalSupply / reserveB
    return liquidityToRemoveA > liquidityToRemoveB ? liquidityToRemoveA : liquidityToRemoveB
  }

  const handleApprove = async () => {
    // Placeholder function to simulate approval
    const liquidityToRemove = await calculateLiquidityToRemove()
    const transaction = await approveERC20({
      contractAddress: poolData.address,
      spenderAddress: ROUTER_ADDR,
      amount: liquidityToRemove.toString(10),
    }, true)
    createTokenApproveSuccessToastFromTx([transaction])
    setApproved(true);
  };

  const handleRemove = async () => {
    if (!approved) return
    const liquidityToRemove = await calculateLiquidityToRemove()
    const transaction = await removeLiquidity(
      poolData.pooledTokenA.address,
      poolData.pooledTokenB.address,
      liquidityToRemove,
      removeAmountA,
      removeAmountB,
      userAddress as string,
      Number.MAX_SAFE_INTEGER
    )
    if (transaction) {
      createToastSuccess(`Successfully removed liquidity from ${tokenATicker}/${tokenBTicker}`)
    }
  };

  return (
    <Card className="rounded-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl  mb-6 font-bold text-sky-950">
          Remove Liquidity
        </h1>
        <SettingsButton />
      </div>
      <div className="mb-8">
        <h2 className="text-lg mb-2 font-medium">Select Percentage</h2>
        <Slider value={percentage} handleSliderChange={handleSliderChange} />
        <p className="text-sm  text-secondaryText">
          {percentage}% of liquidity will be removed
        </p>
      </div>
      <div className="mb-8">
        <h2 className="text-lg mb-2 font-medium">Tokens to Remove</h2>
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <p className="text-sm  text-primaryText mb-1">{tokenATicker}</p>
            <p className="text-lg ">
              {formatEthersBigInt(removeAmountA)}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm  text-primaryText mb-1">{tokenBTicker}</p>
            <p className="text-lg ">
              {formatEthersBigInt(removeAmountB)}
            </p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg mb-2 font-medium">Your Current Position</h2>
        <div className="text-sm  text-primaryText flex justify-between">
          <div> Pool Share Percentage:</div>
          <div> {poolSharePercentage.toString(10)}%</div>
        </div>
        <div className="text-sm text-primaryText  flex justify-between">
          <div>{`${tokenATicker}:`}</div>
          <div className="flex items-center">
            {` ${formatEthersBigInt(poolData.pooledTokenAQuantity)}    `}
            <img
              src={poolData.pooledTokenA.imageUrl}
              alt={poolData.pooledTokenA.name}
              className="ml-1 h-4 w-4"
            />
          </div>
        </div>
        <div className="text-sm text-primaryText  flex justify-between">
          <div>{`${tokenBTicker}:`}</div>
          <div className="flex items-center">
            {` ${formatEthersBigInt(poolData.pooledTokenBQuantity)}`}
            <img
              src={poolData.pooledTokenB.imageUrl}
              alt={poolData.pooledTokenB.name}
              className="ml-1 h-4 w-4"
            />
          </div>
        </div>
      </div>
      <div className="mt-2 mb-8 flex justify-between gap-2 items-center py-4">
        <button
          onClick={handleApprove}
          disabled={approved}
          className={`w-6/12 py-2  ${approved
            ? "border border-sky-950 rounded bg-transparent text-sky-950"
            : "bg-sky-950 text-white rounded"
            }`}
        >
          Approve
        </button>
        <button
          onClick={handleRemove}
          disabled={!approved}
          className={`w-6/12 py-2  ${approved
            ? "bg-sky-950 text-white rounded"
            : " border border-sky-950 rounded bg-transparent text-sky-950"
            }`}
        >
          Remove
        </button>
      </div>
    </Card>
  );
};

export default RemoveLiquidityTab;
