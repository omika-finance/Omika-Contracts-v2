const { deployContract, sendTxn, writeTmpAddresses, callWithRetries } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

async function main() {
  const addresses = {}
  addresses.BTC = (await callWithRetries(deployContract, ["FaucetToken", ["Bitcoin", "BTC", 18, expandDecimals(1000, 18)]])).address
  addresses.USDC = (await callWithRetries(deployContract, ["FaucetToken", ["USDC Coin", "USDC", 18, expandDecimals(1000, 18)]])).address
  addresses.USDT = (await callWithRetries(deployContract, ["FaucetToken", ["Tether", "USDT", 18, expandDecimals(1000, 18)]])).address
  addresses.BUSD = (await callWithRetries(deployContract, ["FaucetToken", ["Binance USD", "BUSD", 18, expandDecimals(1000, 18)]])).address
  addresses.WETH = (await callWithRetries(deployContract, ["FaucetToken", ["Wrapped Ether", "WETH", 18, expandDecimals(1000, 18)]])).address
  writeTmpAddresses(addresses)
}

async function deployTokens() {
  try {
    await main()
  }
  catch(error) {
    console.error("error deploying token", error)
  }
}

module.exports = {
  deployTokens
}
