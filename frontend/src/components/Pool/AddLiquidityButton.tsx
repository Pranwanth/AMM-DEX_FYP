interface AddLiquidityButtonProps {
  className?: string;
}

const AddLiquidityButton = (props: AddLiquidityButtonProps) => {
  const { className } = props;
  return (
    <button
      className={`w-full text-center font-bold bg-sky-900 text-white p-4 rounded ${className ?? ""
        }`}
    >
      Add Liquidity
    </button>
  );
};

export default AddLiquidityButton;
