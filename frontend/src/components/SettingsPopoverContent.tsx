import React from 'react'
import useSettingStore from '../store/useSettingStore'

const SettingsPopoverContent = () => {

  const {
    addLiquiditySlippage,
    addLiquidityDeadline,
    setAddLiquiditySlippage,
    setAddLiquidityDeadline
  } = useSettingStore()


  const handleSlippage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (isNaN(Number(value))) return

    setAddLiquiditySlippage(Number(value))
  }

  const handleDeadline = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (isNaN(Number(value))) return

    setAddLiquidityDeadline(Number(value))
  }

  return (
    <div className='text-primaryText text-nowrap'>
      <div className="flex justify-between items-center gap-2">
        <div>Max.slippage</div>
        <div className="flex justify-between items-center gap-2">
          <input
            type="number"
            value={addLiquiditySlippage}
            onChange={handleSlippage}
            className="block border focus:border-highlight text-right rounded-lg pr-2 w-16"
          />
          <div>%</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-5 gap-2">
        <div>
          Transaction deadline
        </div>
        <div className="flex justify-between items-center gap-2">
          <input
            type="number"
            value={addLiquidityDeadline}
            onChange={handleDeadline}
            className="block border focus:border-highlight text-right rounded-lg pr-2 w-16"
          />
          <div>min</div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPopoverContent