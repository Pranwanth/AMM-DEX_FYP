import { useState } from "react";

import Card from "../Card";
import SettingsButton from "../SettingsButton";
import Slider from "../Slider/Slider";

import useUserPoolDataStore from "../../store/useUserPoolData";

const RemoveLiquidityTab = () => {
  const [percentage, setPercentage] = useState<number>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const { poolData } = useUserPoolDataStore()

  if (!poolData) return null

  const tokenATicker = poolData.pooledTokenA.ticker;
  const tokenBTicker = poolData.pooledTokenB.ticker;
  const poolSharePercentage = poolData.poolShare;

  const tokenAmounts = {
    tokenA: Number(poolData.pooledTokenAQuantity.toString(10)),
    tokenB: Number(poolData.pooledTokenBQuantity.toString(10)),
  };

  const handleSliderChange = (value: number) => {
    setPercentage(value);
  };

  const handleApprove = () => {
    // Placeholder function to simulate approval
    setApproved(true);
  };

  const handleRemove = () => {
    // Placeholder function to handle removal
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
              {(percentage / 100) * tokenAmounts.tokenA}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm  text-primaryText mb-1">{tokenBTicker}</p>
            <p className="text-lg ">
              {(percentage / 100) * tokenAmounts.tokenB}
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
            {` ${tokenAmounts.tokenA}    `}
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
            {` ${tokenAmounts.tokenB}`}
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
