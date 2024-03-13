import CloseIcon from "../../assets/CloseIcon"
import useTokenStore from "../../store/useTokenStore"
import CommonTokens from "./CommonTokens"

const SelectTokenModal = () => {
    const commonTokens = ['ETH', 'DAI', 'USDC', 'USDT', 'WBTC', 'WETH']
    const { setIsModalOpen } = useTokenStore()
    return (
        <div className="text-sky-950 p-5 z-20 bg-white w-80 h-80 absolute rounded-2xl top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col gap-2">
            <div className="flex justify-between">
                Select a token
                <CloseIcon onClose={() => setIsModalOpen(false)} />
            </div>
            <div className="bg-sky-50 flex justify-center items-center gap-2 p-1 rounded-xl ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#082f49" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input placeholder="Search name" className="block w-full h-8 bg-transparent rounded-md text-base" />
            </div>
            <CommonTokens commonTokens={commonTokens} />
            <hr />
            <h4>Popular Tokens</h4>
        </div >)
}

export default SelectTokenModal