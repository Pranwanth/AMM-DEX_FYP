import { useState } from 'react'
import { useAccount } from 'wagmi'

import Card from '../Card'
import ConnectWalletButton from '../ConnectWalletButton'
import TokenSelector from '../Dialog/TokenSelector'
import { Token } from '../GlobalTypes'
import InputField from '../Input/InputField'
import { Popover } from '../Popover'
import SettingsButton from '../SettingsButton'
import SettingsPopoverContent from '../SettingsPopoverContent'
import { ROUTER_ADDR } from '../utils/ContractAdresses'
import { addLiquidity, approveMultipleERC20 } from '../utils/helper'

const AddLiquidityTab = () => {

  const [tokenZero, setTokenZero] = useState<Token | undefined>(undefined)
  const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined)

  const [tokenZeroValue, setTokenZeroValue] = useState('')
  const [tokenOneValue, setTokenOneValue] = useState('')

  const [approved, setApproved] = useState(false)

  const [openPopover, setOpenPopover] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const { address, isConnected } = useAccount()

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
        setApproved(true)
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      console.error("AddLiquidityTab-handleApprove-InvalidInputs")
    }
  }

  const handleSupply = async () => {
    if (!approved) return

    if (tokenZero && tokenOne && tokenZeroValue !== '' && tokenOneValue !== '') {
      try {
        const transaction = await addLiquidity(
          tokenZero.address,
          tokenOne.address,
          tokenZeroValue,
          tokenOneValue,
          "0",
          "0",
          address as string,
          Number.MAX_SAFE_INTEGER,
        )
        console.log("handleSupplySuccess\n", transaction)
      } catch (error) {
        console.error(error)
      }
    }
    else {
      console.error("AddLiquidityTab-handleSupply-InvalidInputs")
    }
  }

  const handleSettings = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
    setOpenPopover(true)
  }

  const handleClosePopover = () => {
    setAnchorElement(null)
    setOpenPopover(false)
  }

  return (

    <Card className="relative">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl text-primaryText font-heading font-bold">Add Liquidity</h2>
        <SettingsButton onClick={handleSettings} />
        <Popover
          isOpen={openPopover}
          anchorElement={anchorElement}
          closePopover={handleClosePopover}
        >
          <SettingsPopoverContent />
        </Popover>
      </div>
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
      {!isConnected && <ConnectWalletButton className='mt-5' />}
      {isConnected && (
        <div className='flex flex-col gap-4'>
          <button className='connect-wallet-btn mt-5' onClick={handleApprove}>Approve Tokens</button>
          <button className='connect-wallet-btn disabled:bg-disabled' onClick={handleSupply} disabled={!approved}>Supply</button>
        </div>
      )}
    </Card>
  )
}

export default AddLiquidityTab