import ArrowDown from "../../../public/assets/ArrowDown";
import useTokenStore from "../../store/useTokenStore";

interface Props {
  type: "pay" | "receive" | "addLiquidityToken0" | "addLiquidityToken1";
}

const ChooseTokenButton = (props: Props) => {
  const { type } = props;
  const { setIsModalOpen, setTokenType } = useTokenStore();

  return (
    <div className="flex items-center">
      <button
        className="bg-white text-sky-950 hover:bg-sky-600/20 font-bold py-1 px-2 rounded-3xl text-base whitespace-nowrap"
        onClick={() => {
          setIsModalOpen(true);
          setTokenType(type);
        }}
      >
        <div className="flex justify-center items-center gap-2">
          {"Select Token"}
          <ArrowDown />
        </div>
      </button>
    </div>
  );
};

export default ChooseTokenButton;
