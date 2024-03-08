import { useState } from "react"

import ConnectWalletButton from "./ConnectWalletButton"
import SwapInput from "./SwapInput"

const Swap = () => {

  const [payAmount, setPayAmount] = useState<number>(0)
  const [receiveAmount, setReceiveAmount] = useState<number>(0)

  const onInputChange = (key: "pay" | "receive", value: string) => {

    const numValue = Number(value)

    if (isNaN(numValue)) {
      console.error(`${value} cannot be converted to Number`)
      return
    }

    switch (key) {
      case "pay": {
        setPayAmount(numValue)
        // do something to receive
        break
      }
      case "receive": {
        setReceiveAmount(numValue)
        // do something to pay
        break
      }
      default: {
        break
      }
    }
  }

  return (
    <section className="mt-32 mx-auto border-2 border-red-500 w-128">
      <h3 className="text-base font-bold">Swap</h3>
      <div>
        <SwapInput
          name="pay"
          value={payAmount.toString(10)}
          onChangeFunc={onInputChange}
        />
        <SwapInput
          name="receive"
          value={receiveAmount.toString(10)}
          onChangeFunc={onInputChange}
        />
      </div>
      <ConnectWalletButton />
    </section>
  )
}

export default Swap