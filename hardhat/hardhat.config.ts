import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY", "")
const PRIVATE_KEY = vars.get("PRIVATE_KEY", "")

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [PRIVATE_KEY]
    }
  }
};

export default config;
