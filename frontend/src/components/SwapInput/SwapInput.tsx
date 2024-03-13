import ChooseTokenButton from "./ChooseTokenButton"

interface Props {
  name: "pay" | "receive"
  value: string
  onChangeFunc: (key: "pay" | "receive", value: string) => void
}

const SwapInput = (props: Props) => {
  const { name, value, onChangeFunc } = props

  return (
    <div className="flex justify-between items-center text-xl h-32 px-2 py-4 bg-sky-50 rounded-md my-2 text-sky-950 relative">
      <div>
        <p className="block">{name === "pay" ? "You pay" : "You receive"}</p>
        <input name={name} type="number" value={value} min="0" onChange={event => onChangeFunc(name, event.target.value)} className="block w-full h-12 bg-transparent rounded-md text-2xl focus-visible:outline-none" />
      </div>
      <ChooseTokenButton type={name} />
    </div>
  )
}

export default SwapInput