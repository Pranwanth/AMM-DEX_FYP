import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Card from "../components/Card";
import { PoolData } from "../components/GlobalTypes";
import PoolAccordion from "../components/Pool/PoolAccordion";
import { TOKEN_ADDR_TO_TOKEN_MAP } from "../components/Tokens";
import { calculateUserPoolData, getExistingPools, getPoolReserves, getPoolTokensFromAddress, getTotalPoolLiquidityToken, getUserLiquidityTokens } from "../components/utils/helper";

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
    <Card>
      <h2 className="text-2xl text-primaryText font-heading font-bold">Pools</h2>
      <PoolAccordion pools={poolData} />
    </Card>
  );
};

export default Pool;
