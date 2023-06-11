const { deployContract, contractAt , sendTxn, writeTmpAddresses, readTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")
const { errors } = require("../../test/core/Vault/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const { OrderBook, Vault } = readTmpAddresses();
  await deployContract("OrderExecutor", [Vault, OrderBook])
  writeTmpAddresses({OrderExecutor: orderExecutor.address})
}

async function deployOrderExecutor() {
  try {
    await main()
  }
  catch (e) {
    console.error("deployOrderExecutor error", e)
  }
}

module.exports = {
  deployOrderExecutor
}
