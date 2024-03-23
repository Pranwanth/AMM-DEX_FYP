import { Link } from "react-router-dom";

interface DepositButtonProps {
  className?: string;
}

const AddLiquidityButton = (props: DepositButtonProps) => {
  const { className } = props;


  return (
    <button
      className={`w-full text-center font-bold bg-sky-900 text-white p-4 rounded ${className ?? ""}`}
    >
      <Link to="/add">Add Liquidity</Link>
    </button>
  );
};

export default AddLiquidityButton;
