export interface PoolData {
  address: string;
  name: string;
  totalPoolToken: bigint;
  pooledTokenA: Token;
  pooledTokenAQuantity: bigint;
  pooledTokenB: Token;
  pooledTokenBQuantity: bigint;
  poolShare: bigint;
  userLiquidityTokens: bigint;
}

export interface Token {
  name: string
  ticker: string
  address: string
  imageUrl: string
}