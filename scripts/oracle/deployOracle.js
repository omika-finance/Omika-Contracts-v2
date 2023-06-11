const { deployContract, contractAt, writeTmpAddresses, readTmpAddresses } = require("../shared/helpers")

async function deployOracle() {
  try {
    const fastPriceEvents = await deployContract("FastPriceEvents", [])
    writeTmpAddresses({ fastPriceEvents: fastPriceEvents.address });

    const {TokenManager} = readTmpAddresses();
    const buffer = 24 * 60

    const fastPriceFeed = await deployContract("FastPriceFeed", [
      buffer,
      buffer,
      buffer,
      30,
      fastPriceEvents.address,
      TokenManager
    ])
    writeTmpAddresses({ fastPriceFeed: fastPriceFeed.address });


    const priceFeed = await deployContract("PriceFeed", [])
    writeTmpAddresses({ priceFeed: priceFeed.address });
  }
  catch (error) {
    console.error("Error deploying Oracle", error)
  }
}

module.exports = {
  deployOracle
}
