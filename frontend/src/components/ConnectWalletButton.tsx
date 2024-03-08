interface Props {
  className?: string
}

const ConnectWalletButton = (props: Props) => {

  const { className } = props

  return (
    <button className={`w-full text-center font-bold bg-blue-800 p-4 rounded ${className ?? ""}`}>
      Connect Wallet
    </button>
  )
}

export default ConnectWalletButton