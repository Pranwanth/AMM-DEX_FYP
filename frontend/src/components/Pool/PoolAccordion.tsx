import { ethers } from "ethers";
import React, { useState } from "react";

import { PoolData } from "../GlobalTypes";
import { Link } from "react-router-dom";
type Props = {
  pools: PoolData[];
};

const PoolAccordion: React.FC<Props> = ({ pools }) => {
  const [openPools, setOpenPools] = useState<string[]>([]);
  const formatBigint = (value: bigint): string => value.toString();
  const bigintZero = ethers.toBigInt(0);

  const getStateForButton = (poolAddr: string) => {
    return pools.filter((pool) => pool.address === poolAddr);
  };
  const toggleVisibility = (poolAddr: string) => {
    if (openPools.includes(poolAddr)) {
      setOpenPools(openPools.filter((addr) => addr !== poolAddr)); // Remove from the array if already open
    } else {
      setOpenPools([...openPools, poolAddr]); // Add to the array if not open
    }
  };
  return (
    <div className="space-y-4">
      {pools.map((pool) => (
        <div
          key={pool.address}
          className="py-4 px-6 rounded-lg shadow-md bg-white max-w-128"
        >
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <div className="flex gap-2">
                <img
                  className="w-12 h-12"
                  src={
                    window.location.origin +
                    `/assets/${pool.pooledTokenA.ticker}.png`
                  }
                />

                <img
                  className="w-12 h-12"
                  src={
                    window.location.origin +
                    `/assets/${pool.pooledTokenB.ticker}.png`
                  }
                />
              </div>
              <h3 className="text-primaryText text-xl font-bold items-center">
                {pool.name}
              </h3>
              {pool.poolShare > bigintZero ? (
                <button className="text-highlight hover:text-primaryBackground">
                  Manage
                </button>
              ) : null}
            </div>
            <button onClick={() => toggleVisibility(pool.address)}>
              {/* Use an appropriate icon or text here for expand/collapse */}
              {openPools.includes(pool.address) ? "▲" : "▼"}
            </button>
          </div>
          {openPools.includes(pool.address) && (
            <div className="bg-gray-50 p-4">
              <div className="text-secondaryText mt-2">
                <div className="flex justify-between">
                  <div>Your total pool tokens:</div>
                  <div>{formatBigint(pool.totalPoolToken)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Pooled {pool.pooledTokenA.ticker}:</div>
                  <div className="flex items-center">
                    {formatBigint(pool.pooledTokenAQuantity)}
                    <img
                      src={pool.pooledTokenA.imageUrl}
                      alt={pool.pooledTokenA.name}
                      className="ml-1 h-4 w-4"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>Pooled {pool.pooledTokenB.ticker}:</div>
                  <div className="flex items-center">
                    {formatBigint(pool.pooledTokenBQuantity)}
                    <img
                      src={pool.pooledTokenB.imageUrl}
                      alt={pool.pooledTokenB.name}
                      className="ml-1 h-4 w-4"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>Your pool share:</div>
                  <div> {formatBigint(pool.poolShare)}</div>
                </div>
              </div>

              <div className="flex justify-between gap-2 items-center mt-4">
                {pool.userLiquidityTokens !== bigintZero && (
                  <button
                    id={pool.address}
                    className="w-6/12 py-2 border border-sky-950 rounded bg-transparent text-sky-950 hover:bg-sky-950 hover:text-white"
                  >
                    <Link to="/remove" state={getStateForButton(pool.address)}>
                      Remove
                    </Link>
                  </button>
                )}
                {/* Make this buttons in to a common component maybe */}
                <button className=" w-6/12  py-2 rounded bg-sky-950 text-white hover:bg-transparent hover:text-sky-950 hover:border-sky-950 hover:border">
                  <Link to="/add">Add</Link>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PoolAccordion;
