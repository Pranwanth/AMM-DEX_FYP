interface DepositButtonProps {
  className?: string;
}

const DepositButton = (props: DepositButtonProps) => {
  const { className } = props;
  return (
    <button
      className={`w-full text-center font-bold bg-sky-900 text-white p-4 rounded ${className ?? ""
        }`}
    >
      Deposit
    </button>
  );
};

export default DepositButton;
