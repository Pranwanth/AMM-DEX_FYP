import { Token } from '../GlobalTypes'

interface TokenWithSymbolProps {
  token: Token
  className?: string
}

const TokenWithSymbol = ({ token, className }: TokenWithSymbolProps) => {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <img src={token.imageUrl} className='w-7' />
      {token.ticker}
    </div>
  )
}

export default TokenWithSymbol