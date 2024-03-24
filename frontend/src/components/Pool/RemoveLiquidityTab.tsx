import { useState } from "react";
import { useLocation } from "react-router";

import Card from "../Card";
import { PoolData } from "../GlobalTypes";
import Slider from "../Slider/Slider";

const RemoveLiquidityTab = () => {
  const [percentage, setPercentage] = useState<number>(0);
  const [approved, setApproved] = useState<boolean>(false);

  const location = useLocation()

  const poolData = location.state[0] as PoolData

  // Placeholder data
  const tokenATicker = poolData.pooledTokenA.ticker
  const tokenBTicker = poolData.pooledTokenB.ticker
  const poolSharePercentage = poolData.poolShare;

  const tokenAmounts = {
    tokenA: Number(poolData.pooledTokenAQuantity.toString(10)),
    tokenB: Number(poolData.pooledTokenBQuantity.toString(10))
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
    <Card>
      <h1 className="text-2xl font-heading mb-6">Remove Liquidity</h1>
      <div className="mb-8">
        <h2 className="text-lg font-heading mb-2">Select Percentage</h2>
        <Slider value={percentage} handleSliderChange={handleSliderChange} />
        <p className="text-sm font-body text-secondaryText">
          {percentage}% of liquidity will be removed
        </p>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-heading mb-2">Tokens to Remove</h2>
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <p className="text-sm font-body text-primaryText mb-1">{tokenATicker}</p>
            <p className="text-lg font-heading">{(percentage / 100) * tokenAmounts.tokenA}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-body text-primaryText mb-1">{tokenBTicker}</p>
            <p className="text-lg font-heading">{(percentage / 100) * tokenAmounts.tokenB}</p>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <button
          onClick={handleApprove}
          disabled={approved}
          className={`btn ${approved ? 'btn-disabled' : 'btn-primary'}`}
        >
          Approve
        </button>
        <button onClick={handleRemove} disabled={!approved} className={`btn ${approved ? 'btn-primary' : 'btn-disabled'}`}>
          Remove
        </button>
      </div>
      <div>
        <h2 className="text-lg font-heading mb-2">Your Current Position</h2>
        <p className="text-sm font-body text-primaryText">
          Pool Share Percentage: {poolSharePercentage.toString(10)}%
        </p>
        <p className="text-sm font-body text-primaryText">
          {`${tokenATicker}: ${tokenAmounts.tokenA}    |    ${tokenBTicker}: ${tokenAmounts.tokenB}`}
        </p>
      </div>
    </Card>
  );
};

export default RemoveLiquidityTab;
