require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('hardhat/config');
//import('hardhat/config').HardhatUserConfig 
module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks:{
    hardhat:{
      chainId:1337
    }
  },
};
