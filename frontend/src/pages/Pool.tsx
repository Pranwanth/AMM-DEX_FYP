import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { PoolData } from "../components/GlobalTypes";
import PoolAccordion from "../components/Pool/PoolAccordion";
import { TOKEN_ADDR_TO_TOKEN_MAP } from "../components/Tokens";
import { calculateUserPoolData, getExistingPools, getPoolReserves, getPoolTokensFromAddress, getTotalPoolLiquidityToken, getUserLiquidityTokens } from "../components/utils/helper";
import PoolRewards from "../components/PoolRewards";

const Pool = () => {
  const { address: userAddress, isConnected } = useAccount()
  const [poolData, setPoolData] = useState<PoolData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!isConnected) return

        if (!userAddress) return

        const poolAddresses = await getExistingPools();
        const promises = poolAddresses.map(async (address) => {
          const [reserve0, reserve1] = await getPoolReserves(address);
          // Fetch tokens for PoolName (use token ticker from tokenHashMap)
          const [token0Address, token1Address] = await getPoolTokensFromAddress(address);
          const pooledTokenA = TOKEN_ADDR_TO_TOKEN_MAP[token0Address];
          const pooledTokenB = TOKEN_ADDR_TO_TOKEN_MAP[token1Address];
          // Calculate total pool token (assuming the pool uses totalSupply())
          const totalPoolToken = await getTotalPoolLiquidityToken(address);
          // For pool name, use the tickers of the pooled tokens (e.g., ARB/WBTC)
          const poolName = `${pooledTokenA.ticker}/${pooledTokenB.ticker}`;

          // Calculate user's pooled token quantity and pool share (assuming you have user's address)
          const userLiquidityTokens = await getUserLiquidityTokens(userAddress, address);
          const [pooledTokenAQuantity, pooledTokenBQuantity, poolShare] = calculateUserPoolData(userLiquidityTokens, totalPoolToken, reserve0, reserve1);

          return {
            address,
            name: poolName,
            totalPoolToken,
            pooledTokenA,
            pooledTokenAQuantity,
            pooledTokenB,
            pooledTokenBQuantity,
            poolShare,
            userLiquidityTokens
          };
        });
        const poolDataArray = await Promise.all(promises);
        setPoolData(poolDataArray);
      } catch (error) {
        console.error("Error fetching pool data:", error);
      }
    }
    fetchData();
  }, [isConnected]); // Run only once on component mount
  console.log(poolData)
  return (
    <div className="mx-auto w-96 py-2 relative card">
      <PoolRewards className="mt-10" />
      <Card className="rounded-sm bg-gray-50">
        <div className="flex justify-between pb-6">
          <h2 className="text-2xl text-sky-950 font-bold">Pool</h2>
          <button className="px-4 py-2 rounded border border-sky-950 bg-transparent text-sjy-950 hover:bg-sky-950 hover:text-white">
            <Link to="/add">Create Pool </Link>
          </button>
        </div>
        <PoolAccordion pools={poolData} />
      </Card>
    </div>
  );
};

export default Pool;
