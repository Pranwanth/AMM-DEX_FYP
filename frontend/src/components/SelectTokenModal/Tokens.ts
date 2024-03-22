import { Token } from "../GlobalTypes"

import deployedAddress from "../../../../backend/ignition/deployments/chain-1337/deployed_addresses.json"
import { Address } from "viem"

const arb: Token = {
  name: "Arbitrum",
  ticker: "ARB",
  address: deployedAddress["local_01#ARB"] as Address,
  imageUrl: "../../assets/ARB.png"
}

const wBtc: Token = {
  name: "Wrapped BitCoin",
  ticker: "WBTC",
  address: deployedAddress["local_01#WBTC"] as Address,
  imageUrl: "../../assets/WBTC.png"
}

const COMMON_TOKENS = [arb, wBtc]

export default COMMON_TOKENS