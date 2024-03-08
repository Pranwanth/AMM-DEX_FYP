
interface Props {
  name: "pay" | "receive"
  value: string
  onChangeFunc: (key: "pay" | "receive", value: string) => void
}

const SwapInput = (props: Props) => {
  const { name, value, onChangeFunc } = props

  return (
    <div className="block text-xl h-32 px-2 py-4 bg-neutral-500 rounded-md my-2">
      <p className="block">{name === "pay" ? "You pay" : "You receive"}</p>
      <input name={name} type="number" value={value} onChange={event => onChangeFunc(name, event.target.value)} className="block w-full h-12 bg-neutral-500 rounded-md text-2xl" />
    </div>
  )
}

export default SwapInput