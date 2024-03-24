import Card from "../components/Card";
import { PoolTableRow } from "../components/GlobalTypes";
import PoolTable from "../components/Pool/PoolTable";
import { getPoolTokensFromAddress } from "../components/utils/helper";

const Pool = () => {

  const dummyTableRow: PoolTableRow = {
    name: "TK0/TK1",
    liquidity: BigInt(100000),
    token0: "token0",
    token1: "token1",
    liquidityTokenAddress: ""
  }

  getPoolTokensFromAddress("0x5a39c5F13Ae9F2eAc2FEb358D239527fA1e32D56").then(data => console.log(data))

  return (
    <Card>
      <h2 className="text-2xl text-primaryText font-heading font-bold">Pools</h2>
      <PoolTable
        tableRows={[dummyTableRow]}
      />
      {/* <PoolTabLayout /> */}
    </Card>
  );
};

export default Pool;
