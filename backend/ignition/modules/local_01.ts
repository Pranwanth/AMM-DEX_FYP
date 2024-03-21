import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import deployedAddresses from "../deployments/chain-1337/deployed_addresses.json"

export default buildModule("local_01", (m) => {
  const factory = m.contract("FactoryPool");
  const weth9 = m.contract("WETH9");
  const router = m.contract("Router", [deployedAddresses["local_01#FactoryPool"], deployedAddresses["local_01#WETH9"]])
  return { factory, weth9, router };
});