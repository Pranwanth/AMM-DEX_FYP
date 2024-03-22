import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "hardhat-abi-exporter";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.SEED_PHRASE
      },
      chainId: 1337,
    }
  },
  abiExporter: {
    path: "../frontend/src/abi",
    runOnCompile: true,
    clear: true,
    flat: true,
    spacing: 2,
    format: "minimal",
  }
};

export default config;
