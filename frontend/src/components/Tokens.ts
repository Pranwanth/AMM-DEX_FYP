import { Token } from "./GlobalTypes"

import deployedAddress from "../../../backend/ignition/deployments/chain-1337/deployed_addresses.json"

const ARB: Token = {
  name: "Arbitrum",
  ticker: "ARB",
  address: deployedAddress["local_01#ARB"],
  imageUrl: `${window.location.origin}/assets/ARB.png`
}

const BNB: Token = {
  name: "BNB",
  ticker: "BNB",
  address: deployedAddress["local_01#BNB"],
  imageUrl: `${window.location.origin}/assets/BNB.png`
}

const LINK: Token = {
  name: "Chainlink",
  ticker: "LINK",
  address: deployedAddress["local_01#LINK"],
  imageUrl: `${window.location.origin}/assets/LINK.png`
}

const MATIC: Token = {
  name: "Polygon",
  ticker: "MATIC",
  address: deployedAddress["local_01#MATIC"],
  imageUrl: `${window.location.origin}/assets/MATIC.png`
}

const OKB: Token = {
  name: "OKEx",
  ticker: "OKB",
  address: deployedAddress["local_01#OKB"],
  imageUrl: `${window.location.origin}/assets/OKB.png`
}

const PEPE: Token = {
  name: "PepeCoin",
  ticker: "PEPE",
  address: deployedAddress["local_01#PEPE"],
  imageUrl: `${window.location.origin}/assets/PEPE.png`
}

const SHIBA: Token = {
  name: "Shiba Inu",
  ticker: "SHIBA",
  address: deployedAddress["local_01#SHIBA"],
  imageUrl: `${window.location.origin}/assets/SHIBA.png`
}

const WBTC: Token = {
  name: "Wrapped BitCoin",
  ticker: "WBTC",
  address: deployedAddress["local_01#WBTC"],
  imageUrl: `${window.location.origin}/assets/WBTC.png`
}

const WETH9: Token = {
  name: "Wrapped Ether",
  ticker: "WETH9",
  address: deployedAddress["local_01#WETH9"],
  imageUrl: `${window.location.origin}/assets/WETH.png`
}

export const TOKEN_ADDR_TO_TOKEN_MAP = {
  [deployedAddress["local_01#ARB"]]: ARB,
  [deployedAddress["local_01#BNB"]]: BNB,
  [deployedAddress["local_01#LINK"]]: LINK,
  [deployedAddress["local_01#MATIC"]]: MATIC,
  [deployedAddress["local_01#OKB"]]: OKB,
  [deployedAddress["local_01#PEPE"]]: PEPE,
  [deployedAddress["local_01#SHIBA"]]: SHIBA,
  [deployedAddress["local_01#WBTC"]]: WBTC,
  [deployedAddress["local_01#WETH9"]]: WETH9
};

const COMMON_TOKENS = [ARB, BNB, WBTC]

export default COMMON_TOKENS