const { getFrameSigner, deployContract, contractAt , sendTxn, writeTmpAddresses, readTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")
const { errors } = require("../../test/core/Vault/helpers");
const { ethers } = require("hardhat");

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

const depositFee = 30 // 0.3%

async function main() {
  const { Vault, Router, ShortsTracker, WETH, OrderBook } = readTmpAddresses();
  console.log("Deploying new position manager")

  const positionManagerArgs = [Vault, Router, ShortsTracker, WETH, depositFee, OrderBook]
  let positionManager = await ethers.getContractFactory("PositionManager", {
    libraries: {
      PositionUtils: readTmpAddresses().PositionUtils
    }
  })
  positionManager = await positionManager.deploy(...positionManagerArgs)
  writeTmpAddresses({PositionManager: positionManager.address})

  console.info(`Deploying PositionManager`)
  await positionManager.deployTransaction.wait()
  console.info("... Completed!")

  if (await positionManager.shouldValidateIncreaseOrder()) {
    await positionManager.setShouldValidateIncreaseOrder(false)
  }
}

async function deployPositionManager() {
  try {
    await main()
  }
  catch (error) {
    console.log("Error deploying position manager", error)
  }
}

module.exports = {
  deployPositionManager
}
