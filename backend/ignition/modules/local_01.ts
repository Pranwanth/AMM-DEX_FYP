import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import deployedAddresses from "../deployments/chain-1337/deployed_addresses.json"

export default buildModule("local_01", (m) => {
  const factory = m.contract("FactoryPool");
  const weth9 = m.contract("WETH9");
  const router = m.contract("Router", [deployedAddresses["local_01#FactoryPool"], deployedAddresses["local_01#WETH9"]])

  // ERC20 Tokens for testing
  const wBtc = m.contract("WBTC")
  const link = m.contract("LINK")
  const pepe = m.contract("PEPE")
  const bnb = m.contract("BNB")
  const matic = m.contract("MATIC")
  const shiba = m.contract("SHIBA")
  const arb = m.contract("ARB")
  const okb = m.contract("OKB")

  return {
    factory,
    weth9,
    router,
    wBtc,
    link,
    pepe,
    bnb,
    matic,
    shiba,
    arb,
    okb
  };
});