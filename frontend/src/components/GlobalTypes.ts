import { Address } from "viem"

export interface PoolTableRow {
  name: string
  liquidity: BigInt
  token0: string
  token1: string,
  liquidityTokenAddress: string
}

export interface Token {
  name: string
  ticker: string
  address: Address
  imageUrl: string
}