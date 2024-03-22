import { useState } from 'react'
import Card from '../Card'
import TokenSelector from '../Dialog/TokenSelector'
import { Token } from '../GlobalTypes'
import InputField from '../Input/InputField'

const AddLiquidityTab = () => {

  const [tokenZero, setTokenZero] = useState<Token | undefined>(undefined)
  const [tokenOne, setTokenTwo] = useState<Token | undefined>(undefined)

  const [tokenZeroValue, setTokenZeroValue] = useState('')
  const [tokenOneValue, setTokenOneValue] = useState('')

  const onInputChange = (key: "tokenZero" | "tokenOne", value: string) => {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      console.error(`AddLiquidityTokenInput - ${value} cannot be converted to Number`);
      return;
    }

    if (key === "tokenZero") {
      setTokenZeroValue(value)
    }
    else {
      setTokenOneValue(value)
    }
  }

  const selectTokenZero = (token: Token) => {
    setTokenZero(token)
  }

  const selectTokenTwo = (token: Token) => {
    setTokenTwo(token)
  }

  return (
    <Card className="relative">
      <InputField
        type="number"
        min="0"
        value={tokenZeroValue}
        onChange={event => onInputChange("tokenZero", event.target.value)}
      >
        <TokenSelector token={tokenZero} tokenSelectHandler={selectTokenZero} />
      </InputField>
      <InputField
        type="number"
        min="0"
        value={tokenOneValue}
        onChange={event => onInputChange("tokenOne", event.target.value)}
      >
        <TokenSelector token={tokenOne} tokenSelectHandler={selectTokenTwo} />
      </InputField>
      <button className='connect-wallet-btn mt-2'>Approve Tokens</button>
      <button className='connect-wallet-btn mt-5'>Supply</button>
    </Card>

  )
}

export default AddLiquidityTab