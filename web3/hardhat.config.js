require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    aiaTestnet: {
      url: process.env.API_URL || "https://aia-dataseed1-testnet.aiachain.org/",
      accounts: process.env.PRIVATE_KEY !== undefined ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 1320,
    },
  },
};
