interface Props {
  className?: string;
  handleClick: () => void
}

const SwapActionButton = (props: Props) => {
  const { className, handleClick } = props;
  return (
    <button
      className={`w-full text-center font-bold bg-sky-950 text-white p-4 rounded ${className ?? ""
        }`}
      onClick={handleClick}
    >
      Swap
    </button>
  );
};

export default SwapActionButton;
