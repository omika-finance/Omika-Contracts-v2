const { getFrameSigner, deployContract, contractAt , sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

const depositFee = 30 // 0.3%
const minExecutionFee = 30


async function main() {

  const positionUtils = await deployContract("PositionUtils", [])
  writeTmpAddresses({PositionUtils: positionUtils.address});

  const { Vault, Router, ShortsTracker, WETH, OrderBook } = readTmpAddresses();

  const positionRouterArgs = [Vault, Router, WETH, ShortsTracker, depositFee, minExecutionFee]

  let positionRouter = await ethers.getContractFactory("PositionRouter", {
    libraries: {
      PositionUtils: positionUtils.address
    }
  })
  positionRouter = await positionRouter.deploy(...positionRouterArgs)
  await positionRouter.deployTransaction.wait()
  console.info(`Deploying PositionRouter`)
  console.info("... Completed!")
  
  writeTmpAddresses({PositionRouter: positionRouter.address})
  writeTmpAddresses({PositionRouter: positionRouter.address})

  await positionRouter.setDelayValues(0, 180, 30 * 60)

}

async function deployPositionRouter() {
  try {
    await main()
  }
  catch (error) {
    console.log("Error deploying position router", error)
  }
}

module.exports = {
  deployPositionRouter
}
