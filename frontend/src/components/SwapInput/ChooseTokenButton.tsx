import useTokenStore from "../../store/useTokenStore"

interface Props {
    type: "pay" | "receive" | "addLiquidityTokenOne" | "addLiquidityTokenTwo"
}


const ChooseTokenButton = (props: Props) => {
    const { type } = props
    const { setIsModalOpen, setTokenType, tokens } = useTokenStore()
    return (
        <div className="flex items-center">
            <button className="bg-white text-sky-950 hover:bg-sky-600/20 font-bold py-1 px-2 rounded-3xl text-base whitespace-nowrap"
                onClick={() => { setIsModalOpen(true); setTokenType(type); }}>
                <div className="flex justify-center items-center gap-2">
                    {tokens[type] || "Select Token"}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </button>
        </div >
    )
}


export default ChooseTokenButton