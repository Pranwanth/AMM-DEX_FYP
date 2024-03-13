import { useState } from 'react'
import ChooseTokenButton from '../SwapInput/ChooseTokenButton'
import PlusIcon from '../../assets/PlusIcon'

const AddLiquidityTab = () => {

  const [tokenOneValue, setTokenOneValue] = useState('')
  const [tokenTwoValue, setTokenTwoValue] = useState('')

  const onInputChange = (key: "tokenOne" | "tokenTwo", value: string) => {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      console.error(`AddLiquidityTokenOneInput - ${value} cannot be converted to Number`);
      return;
    }

    if (key === "tokenOne") {
      setTokenOneValue(value)
    }
    else {
      setTokenTwoValue(value)
    }
  }

  return (
    <div className="relative">
      <div className="flex text-xl h-32 p-4 bg-sky-50 rounded-md my-2 text-sky-950">
        <input type="number" value={tokenOneValue} min="0" onChange={event => onInputChange("tokenOne", event.target.value)} className="flex w-full bg-transparent rounded-md text-2xl focus-visible:outline-none" />
        <ChooseTokenButton type="addLiquidityTokenOne" />
      </div>
      <PlusIcon />
      <div className="flex text-xl h-32 p-4 bg-sky-50 rounded-md my-2 text-sky-950">
        <input type="number" value={tokenTwoValue} min="0" onChange={event => onInputChange("tokenTwo", event.target.value)} className="block w-full bg-transparent rounded-md text-2xl focus-visible:outline-none" />
        <ChooseTokenButton type="addLiquidityTokenTwo" />
      </div>
    </div>

  )
}

export default AddLiquidityTab