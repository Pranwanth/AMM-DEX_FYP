import { useNavigate } from "react-router-dom";

interface DepositButtonProps {
  className?: string;
}

const AddLiquidityButton = (props: DepositButtonProps) => {
  const { className } = props;
  const navigate = useNavigate()

  return (
    <button
      className={`w-full text-center font-bold bg-sky-900 text-white p-4 rounded ${className ?? ""}`}
      onClick={() => navigate("/add")}
    >
      Add Liquidity
    </button>
  );
};

export default AddLiquidityButton;
