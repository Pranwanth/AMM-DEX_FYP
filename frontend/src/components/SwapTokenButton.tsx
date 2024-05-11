interface SwapTokenButtonProps {
  changeTokenPosition: () => void
}

const SwapTokenButton = (props: SwapTokenButtonProps) => {
  const { changeTokenPosition } = props;
  return (
    <div
      className="absolute top-[37%] left-[45%] h-10 w-10 bg-sky-50 rounded-xl border-4  border-white flex justify-center items-center"
      onClick={changeTokenPosition}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#083344"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
        />
      </svg>
    </div>
  );
};

export default SwapTokenButton;
