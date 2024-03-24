// import { useState } from "react";
// import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import Card from "../components/Card";
// import { PoolData } from "../components/GlobalTypes";
import PoolAccordion from "../components/Pool/PoolAccordion";
// import { TOKEN_ADDR_TO_TOKEN_MAP } from "../components/Tokens";
// import { calculateUserPoolData, getExistingPools, getPoolReserves, getPoolTokensFromAddress, getTotalPoolLiquidityToken, getUserLiquidityTokens } from "../components/utils/helper";

const Pool = () => {
  const dummyData1 = {
    address: "0x5a39c5F13Ae9F2eAc2FEb358D239527fA1e32D56",
    name: "ARB/WBTC",
    poolShare: 0n,
    pooledTokenA: {
      name: "Arbitrum",
      ticker: "ARB",
      address: "0x1Da82267d729eF09Fd6a3dDF3a76B7b58e022375",
      imageUrl: "../../assets/ARB.png",
    },
    pooledTokenAQuantity: 0n,
    pooledTokenB: {
      name: "Wrapped BitCoin",
      ticker: "WBTC",
      address: "0xc9bd025e99F0e425EBD8Ff87153b236fd594518f",
      imageUrl: "../../assets/WBTC.png",
    },
    pooledTokenBQuantity: 0n,
    totalPoolToken: 110000000000000000000n,
    userLiquidityTokens: 10000000000000000000n,
  };
  const dummyData2 = {
    address: "0x3E966a0a491b7648193b59779231ab4b3c30C959",
    name: "WBTC/BNB",
    poolShare: 0n,
    pooledTokenA: {
      name: "Wrapped BitCoin",
      ticker: "WBTC",
      address: "0xc9bd025e99F0e425EBD8Ff87153b236fd594518f",
      imageUrl: "../../assets/WBTC.png",
    },
    pooledTokenAQuantity: 0n,
    pooledTokenB: {
      name: "BNB",
      ticker: "BNB",
      address: "0xF3f35E9bbCAFBD23F4501818668F49cc90C53823",
      imageUrl: "../../assets/BNB.png",
    },
    pooledTokenBQuantity: 0n,
    totalPoolToken: 100000000000000000000n,
    userLiquidityTokens: 0n,
  };

  const dummyData3 = {
    address: "0x9c3e5DF557892fFEf03CD5fb92d425d6EE9cBaB5",
    name: "LINK/BNB",
    poolShare: 0n,
    pooledTokenA: {
      name: "Chainlink",
      ticker: "LINK",
      address: "0x846704FC96381ec12831c61c1dAF0a1A1Ec506d7",
      imageUrl: "../../assets/LINK.png",
    },
    pooledTokenAQuantity: 0n,
    pooledTokenB: {
      name: "BNB",
      ticker: "BNB",
      address: "0xF3f35E9bbCAFBD23F4501818668F49cc90C53823",
      imageUrl: "../../assets/BNB.png",
    },
    pooledTokenBQuantity: 0n,
    totalPoolToken: 100000000000000000000n,
    userLiquidityTokens: 0n,
  };
  const poolData = [dummyData1, dummyData2, dummyData3];
  // const { address: userAddress, isConnected } = useAccount()
  // const [poolData, setPoolData] = useState<PoolData[]>([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       if (!isConnected) return

  //       if (!userAddress) return

  //       const poolAddresses = await getExistingPools();
  //       const promises = poolAddresses.map(async (address) => {
  //         const [reserve0, reserve1] = await getPoolReserves(address);
  //         // Fetch tokens for PoolName (use token ticker from tokenHashMap)
  //         const [token0Address, token1Address] = await getPoolTokensFromAddress(address);
  //         const pooledTokenA = TOKEN_ADDR_TO_TOKEN_MAP[token0Address];
  //         const pooledTokenB = TOKEN_ADDR_TO_TOKEN_MAP[token1Address];
  //         // Calculate total pool token (assuming the pool uses totalSupply())
  //         const totalPoolToken = await getTotalPoolLiquidityToken(address);
  //         // For pool name, use the tickers of the pooled tokens (e.g., ARB/WBTC)
  //         const poolName = `${pooledTokenA.ticker}/${pooledTokenB.ticker}`;

  //         // Calculate user's pooled token quantity and pool share (assuming you have user's address)
  //         const userLiquidityTokens = await getUserLiquidityTokens(userAddress, address);
  //         const [pooledTokenAQuantity, pooledTokenBQuantity, poolShare] = calculateUserPoolData(userLiquidityTokens, totalPoolToken, reserve0, reserve1);

  //         return {
  //           address,
  //           name: poolName,
  //           totalPoolToken,
  //           pooledTokenA,
  //           pooledTokenAQuantity,
  //           pooledTokenB,
  //           pooledTokenBQuantity,
  //           poolShare,
  //           userLiquidityTokens
  //         };
  //       });
  //       const poolDataArray = await Promise.all(promises);
  //       setPoolData(poolDataArray);
  //     } catch (error) {
  //       console.error("Error fetching pool data:", error);
  //     }
  //   }
  //   fetchData();
  // }, [isConnected]); // Run only once on component mount

  console.log(poolData);
  return (
    <div className="mx-auto w-96 py-2 relative card flex  flex-col  gap-4">
      <div className="mx-auto rounded-md border border-gray-400 p-2">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
          <div className="font-bold">Pool Rewards</div>
        </div>
        <div className="text-gray-500">
          Liquidity providers earn a 0.3% fee on all trades proportional to
          their share of the pool.Fees are added to the poo, accrue in real time
          and can be claimed by withdrawing your liquidity
        </div>
      </div>
      <Card className="rounded-sm bg-gray-50">
        <div className="flex justify-between pb-1.5">
          <h2 className="text-2xl text-sky-950 font-bold">Pool</h2>
          <button className="px-4 py-2 rounded border border-sky-950 bg-transparent text-sjy-950 hover:bg-sky-950 hover:text-white">
            <Link>Create Pool </Link>
          </button>
        </div>
        <PoolAccordion pools={poolData} />
      </Card>
    </div>
  );
};

export default Pool;
