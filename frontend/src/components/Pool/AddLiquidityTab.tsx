import { useState } from 'react'
import Card from '../Card'
import TokenSelector from '../Dialog/TokenSelector'
import { Token } from '../GlobalTypes'
import InputField from '../Input/InputField'
import { ROUTER_ADDR } from '../utils/ContractAdresses'
import { approveMultipleERC20 } from '../utils/Helper'

const AddLiquidityTab = () => {

  const [tokenZero, setTokenZero] = useState<Token | undefined>(undefined)
  const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined)

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

  const selectTokenOne = (token: Token) => {
    setTokenOne(token)
  }

  const handleApprove = async () => {
    if (tokenZero && tokenOne && tokenZeroValue !== '' && tokenOneValue !== '') {
      try {
        const approvalRequests = [
          { contractAddress: tokenZero.address, spenderAddress: ROUTER_ADDR, amount: tokenZeroValue },
          { contractAddress: tokenOne.address, spenderAddress: ROUTER_ADDR, amount: tokenOneValue },
        ]

        const transactions = await approveMultipleERC20(approvalRequests)
        console.log('Transactions:', transactions);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      console.error("AddLiquidityTab-handleApprove-InvalidInputs")
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
        <TokenSelector token={tokenOne} tokenSelectHandler={selectTokenOne} />
      </InputField>
      <button className='connect-wallet-btn mt-2' onClick={handleApprove}>Approve Tokens</button>
      <button className='connect-wallet-btn mt-5'>Supply</button>
    </Card>

  )
}

export default AddLiquidityTab