interface Props {
  className?: string;
}

const SwapActionButton = (props: Props) => {
  const { className } = props;
  return (
    <button
      className={`w-full text-center font-bold bg-sky-900 text-white p-4 rounded ${
        className ?? ""
      }`}
    >
      Swap
    </button>
  );
};

export default SwapActionButton;
