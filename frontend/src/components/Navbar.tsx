import ConnectWalletButton from "./ConnectWalletButton"

const Navbar = () => {
  return (
    <nav className="flex justify-between w-full px-8 py-10">
      <div className="flex gap-8">
        <button>Swap</button>
        <button>Pools</button>
      </div>
      <ConnectWalletButton className="w-48" />
    </nav>
  )
}

export default Navbar