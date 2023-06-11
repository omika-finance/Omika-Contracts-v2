const { deployContract, contractAt , sendTxn, writeTmpAddresses, readTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const { nativeToken } = tokens

  const orderBook = await deployContract("OrderBook", []);
  writeTmpAddresses({OrderBook: orderBook.address})

  const { Router, Vault, USDG  } = readTmpAddresses();

  // Arbitrum mainnet addresses
  await orderBook.initialize(
    Router, // router
    Vault, // vault
    nativeToken.address, // weth
    USDG, // usdg
    "10000000000000000", // 0.01 AVAX
    expandDecimals(10, 30) // min purchase token amount usd
  )
}

async function deployOrderBook() {
  try {
    await main()
  }
  catch (e) {
    console.log("deployOrderBook error", e)
  }
}


module.exports = {
  deployOrderBook
}
