import { ethers } from 'ethers'
import { ToastOptions, toast } from 'react-toastify'
import { TOKEN_ADDR_TO_TOKEN_MAP } from '../../Tokens'

const toastOptions: ToastOptions<unknown> = {
  autoClose: 5000,
}

export const createToastSuccess = (message: string) => {
  toast.success(message, toastOptions)
}

export const createTokenApproveSuccessFromTx = (transactions: ethers.ContractTransaction[]) => {
  for (let tx of transactions) {
    const token = TOKEN_ADDR_TO_TOKEN_MAP[tx.to]
    if (token) {
      toast.success(`${token.ticker} has been approved`, toastOptions)
    }
  }
}
