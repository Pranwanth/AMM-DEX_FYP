import Card from "../components/Card";
import { PoolTableRow } from "../components/GlobalTypes";
import PoolTabLayout from "../components/Pool/PoolTabLayout";
import PoolTable from "../components/Pool/PoolTable";

const Pool = () => {

  const dummyTableRow: PoolTableRow = {
    name: "TK0/TK1",
    liquidity: BigInt(100000),
    token0: "token0",
    token1: "token1"
  }

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
