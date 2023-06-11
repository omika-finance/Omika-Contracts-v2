const { deployContract, contractAt, writeTmpAddresses, readTmpAddresses } = require("../shared/helpers")

async function deployAMM() {
  try {
    const addressZero = ethers.constants.AddressZero
    const { WETH, USDC, BTC } = readTmpAddresses();
    const args = [WETH, USDC, BTC, addressZero, addressZero];

    const pancakeFactory = await deployContract("PancakeFactory", [args])
    writeTmpAddresses({ pancakeFactory: pancakeFactory.address });

    const pancakePair = await deployContract("PancakePair", [])
    writeTmpAddresses({ pancakePair: pancakePair.address });
  
    const pancakeRouter = await deployContract("PancakeRouter", [pancakePair.address])
    writeTmpAddresses({ pancakeRouter: pancakeRouter.address });

    const uniFactory = await deployContract("UniFactory", [])
    writeTmpAddresses({ uniFactory: uniFactory.address });

    const uniNftManager = await deployContract("UniNftManager", [])
    writeTmpAddresses({ uniNftManager: uniNftManager.address });

    const uniPool = await deployContract("UniPool", [])
    writeTmpAddresses({ uniPool: uniPool.address });

  }
  catch (error) {
    console.error("Error deploying AMM", error)
  }
}

module.exports = {
  deployAMM
}
