require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const providerApiKey = process.env.ALCHEMY_API_KEY;
const etherscanApiKey = process.env.ETHERSCAN_MAINNET_API_KEY;
// const etherscanOptimisticApiKey = process.env.ETHERSCAN_OPTIMISTIC_API_KEY;
// const basescanApiKey = process.env.BASESCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: `${etherscanApiKey}`,
  },
};
