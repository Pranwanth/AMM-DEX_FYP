import { ethers } from 'ethers';
import React from 'react';

import { PoolData } from '../GlobalTypes';
import { Link } from 'react-router-dom';

type Props = {
  pools: PoolData[];
};

const PoolAccordion: React.FC<Props> = ({ pools }) => {
  const formatBigint = (value: bigint): string => value.toString();
  const bigintZero = ethers.toBigInt(0)

  const getStateForButton = (poolAddr: string) => {
    return pools.filter(pool => pool.address === poolAddr)
  }

  return (
    <div className="space-y-4">
      {pools.map((pool) => (
        <div
          key={pool.address}
          className="p-4 rounded-lg shadow-md bg-white max-w-128"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-primaryText font-heading text-xl">
              {pool.name}
            </h3>
            {pool.poolShare > bigintZero ? (
              <button className="text-highlight hover:text-primaryBackground">
                Manage
              </button>
            ) : null}
          </div>
          {pool.poolShare > bigintZero ? (
            <div className="text-secondaryText font-body mt-2">
              <div>Your total pool tokens: {formatBigint(pool.totalPoolToken)}</div>
              <div className="flex items-center">
                <img src={pool.pooledTokenA.imageUrl} alt={pool.pooledTokenA.name} className="h-6 w-6 mr-2" />
                Pooled {pool.pooledTokenA.ticker}: {formatBigint(pool.pooledTokenAQuantity)}
              </div>
              <div className="flex items-center">
                <img src={pool.pooledTokenB.imageUrl} alt={pool.pooledTokenB.name} className="h-6 w-6 mr-2" />
                Pooled {pool.pooledTokenB.ticker}: {formatBigint(pool.pooledTokenBQuantity)}
              </div>
              <div>Your pool share: {formatBigint(pool.poolShare)}</div>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-4">
              {pool.userLiquidityTokens !== bigintZero && (
                <button id={pool.address} className="px-4 py-2 rounded bg-interactiveElements text-white font-body hover:bg-highlight">
                  <Link
                    to="/remove"
                    state={getStateForButton(pool.address)}
                  >
                    Remove
                  </Link>
                </button>
              )}
              {/* Make this buttons in to a common component maybe */}
              <button className="px-4 py-2 rounded bg-interactiveElements text-white font-body hover:bg-highlight">
                <Link to="/add">Add</Link>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PoolAccordion;
