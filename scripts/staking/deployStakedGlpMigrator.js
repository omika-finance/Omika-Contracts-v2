const { getFrameSigner, deployContract, contractAt, sendTxn, writeTmpAddresses, readTmpAddresses } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');

async function getArbValues() {
  const glp = { address: "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258" }
  const stakedGlpTracker = await contractAt("RewardTracker", "0x1aDDD80E6039594eE970E5872D247bf0414C8903")
  const feeGlpTracker = await contractAt("RewardTracker", "0x4e971a87900b931fF39d1Aad67697F49835400b6")

  return { glp, stakedGlpTracker, feeGlpTracker }
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }
}

async function main() {
  const { GLP, stakedGlpTracker, feeGlpTracker } = readTmpAddresses();
  const sender = "0x551c95fEA9aE2bB0FC969526166692E26D28e40d"

  await deployContract("StakedGlpMigrator", [
      sender,
      GLP,
      stakedGlpTracker,
      feeGlpTracker
  ])
}


async function deployStakedGlpMigrator() {
  try {
    await main()
  }
  catch (e) {
    console.log("Error in deploy stakedglpMigrator: ", e)
  }
}

module.exports = {
  deployStakedGlpMigrator
}
