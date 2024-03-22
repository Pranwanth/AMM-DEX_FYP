import { useState } from 'react'
import Card from '../Card'
import TokenSelector from '../Dialog/TokenSelector'
import { Token } from '../GlobalTypes'
import InputField from '../Input/InputField'
import { useERC20Approve } from '../../hooks/useERC20Approve'

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

  const { approve, error } = useERC20Approve({
    contractAddress: "0x5D1d5FD179b00E2bc9E32ECBcF8100a175B71f1d",
    spenderAddress: "0x71949b1ac51355c7b917f629f2f6BD0a78D8DE4a",
    amount: "10",
  })

  const handleApprove = async () => {
    try {
      const transactionReceipt = await approve();
      console.log("Transaction Receipt:", transactionReceipt);
    } catch (err) {
      console.error("Transaction Failed:", error);
    }
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
      <button className='connect-wallet-btn mt-2' onClick={handleApprove}>Approve Tokens</button>
      <button className='connect-wallet-btn mt-5'>Supply</button>
    </Card>

  )
}

export default AddLiquidityTab