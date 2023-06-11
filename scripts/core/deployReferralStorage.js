const { getFrameSigner, deployContract, contractAt, sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function deployReferralStorage() {
  try {
    const { PositionRouter, PositionManager } = readTmpAddresses();
    const positionRouter = await contractAt("PositionRouter", PositionRouter, null, {
      libraries: {
        PositionUtils: readTmpAddresses().PositionUtils
      }
    })
    const positionManager = await contractAt("PositionManager", PositionManager, null, {
      libraries: {
        PositionUtils: readTmpAddresses().PositionUtils
      }
    })

    const referralStorage = await deployContract("ReferralStorage", []);
    writeTmpAddresses({ ReferralStorage: referralStorage.address });

    await positionRouter.setReferralStorage(referralStorage.address)
    await positionManager.setReferralStorage(referralStorage.address)

    await referralStorage.setHandler(positionRouter.address, true)
  }
  catch (error) {
    console.log("Error deploying ReferralStorage", error)
  }
}

module.exports = {
  deployReferralStorage
}
