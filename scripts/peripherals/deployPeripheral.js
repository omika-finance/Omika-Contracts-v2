const { expandDecimals } = require("../../test/shared/utilities")
const { deployContract, contractAt, writeTmpAddresses, readTmpAddresses } = require("../shared/helpers")

async function deployPeripheral() {
  const balanceUpdater = await deployContract("BalanceUpdater", [])
  writeTmpAddresses({ balanceUpdater: balanceUpdater.address })

  const batchSender = await deployContract("BatchSender", [])
  writeTmpAddresses({ batchSender: batchSender.address })

  const { EsGMX } = await readTmpAddresses();
  const esGmxBatchSender = await deployContract("EsGmxBatchSender", [EsGMX])
  writeTmpAddresses({ esGmxBatchSender: esGmxBatchSender.address })

  const AddressZero = ethers.constants.AddressZero
  const admin = "0x49B373D422BdA4C6BfCdd5eC1E48A9a26fdA2F8b"
  const rewardManager = { address: ethers.constants.AddressZero }
  const buffer = 24 * 60 * 60
  const longBuffer = 7 * 24 * 60 * 60
  const tokenManager = { address: "0x8b25Ba1cAEAFaB8e9926fabCfB6123782e3B4BC2" }
  const mintReceiver = { address: AddressZero }
  const maxTokenSupply = expandDecimals("13250000", 18)

  const gmxTimelock = await deployContract("GmxTimelock", [
    admin,
    buffer,
    longBuffer,
    rewardManager.address,
    tokenManager.address,
    mintReceiver.address,
    maxTokenSupply
  ])
  writeTmpAddresses({ gmxTimelock: gmxTimelock.address })

  const orderBookReader = await deployContract("OrderBookReader", [])
  writeTmpAddresses({ orderBookReader: orderBookReader.address })


  const positionRouterReader = await deployContract("PositionRouterReader", [], "PositionRouterReader")
  writeTmpAddresses({ positionRouterReader: positionRouterReader.address })

  const { TokenManager, GlpManager, RewardRouter } = await readTmpAddresses();

  const timelockPriceFeed = await deployContract("PriceFeedTimelock", [
    admin,
    buffer,
    TokenManager
  ], "Timelock")
  writeTmpAddresses({ timelockPriceFeed: timelockPriceFeed.address })

  const reader = await deployContract("Reader", [], "Reader")
  writeTmpAddresses({ reader: reader.address })

  const rewardReader = await deployContract("RewardReader", [], "RewardReader")
  writeTmpAddresses({ rewardReader: rewardReader.address });


  const updateDelay = 300 // 300 seconds, 5 minutes
  const maxAveragePriceChange = 20 // 0.2%
  let shortsTrackerTimelock = await deployContract("ShortsTrackerTimelock", [admin, buffer, updateDelay, maxAveragePriceChange])
  writeTmpAddresses({ shortsTrackerTimelock: shortsTrackerTimelock.address })

  const timelock = await deployContract("Timelock", [
    admin, // admin
    buffer, // buffer
    TokenManager, // tokenManager
    mintReceiver.address, // mintReceiver
    GlpManager, // glpManager
    RewardRouter, // rewardRouter
    maxTokenSupply, // maxTokenSupply
    10, // marginFeeBasisPoints 0.1%
    500 // maxMarginFeeBasisPoints 5%
  ], "Timelock")
  writeTmpAddresses({ timelock: timelock.address })

  const vaultReader = await deployContract("VaultReader", [], "VaultReader")
  writeTmpAddresses({
    vaultReader: vaultReader.address
  })

}

module.exports = {
  deployPeripheral
}


