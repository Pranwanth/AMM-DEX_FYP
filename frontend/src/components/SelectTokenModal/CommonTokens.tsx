import useTokenStore from "../../store/useTokenStore"

interface Props {
    commonTokens: string[]
}
const CommonTokens=(props: Props)=>{
    const { setIsModalOpen, setTokens, tokenType } = useTokenStore()
    const { commonTokens } = props
    return <div className="flex gap-1  flex-wrap">
    {commonTokens.map(token => {
        return <div className="py-1 px-2 rounded-2xl border-2 border-sky-800/20 font-medium" onClick={() => { setTokens(tokenType, token); setIsModalOpen(false) }}>{token}</div>
    })}
    </div>
}

export default CommonTokens