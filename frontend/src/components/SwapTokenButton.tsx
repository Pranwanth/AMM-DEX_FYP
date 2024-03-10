import useTokenStore from "../store/useTokenStore"

const SwapTokenButton = () => {
    const { swapTokens } = useTokenStore()
    return <div className="absolute top-[40%] left-[45%] h-10 w-10 bg-sky-50 rounded-xl border-4  border-white flex justify-center items-center" onClick={swapTokens}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#083344" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
    </div>

}

export default SwapTokenButton