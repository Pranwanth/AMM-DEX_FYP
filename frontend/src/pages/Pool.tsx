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
    <section className="mt-12 mx-auto w-3/4 h-screen">
      <h3 className="text-2xl text-secondary font-bold">Pools</h3>
      <PoolTable
        tableRows={[dummyTableRow]}
      />
      {/* <PoolTabLayout /> */}
    </section>
  );
};

export default Pool;
