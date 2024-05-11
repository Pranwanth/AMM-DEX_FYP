interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  handleClick: () => void
}

const SwapActionButton = (props: Props) => {
  const { className, handleClick, ...rest } = props;
  return (
    <button
      className={`w-full text-center font-bold bg-sky-950 text-white p-4 rounded ${className ?? ""}`}
      onClick={handleClick}
      {...rest}
    >
      Swap
    </button>
  );
};

export default SwapActionButton;
