const { deployContract, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  const stakeManager = await deployContract("StakeManager", [])
  writeTmpAddresses({ StakeManager: stakeManager.address })
}

async function deployStakeManager() {
  try {
    await main()
  }
  catch (e) {
    console.log("Error in deployGov: ", e)
  }
}

module.exports = {
  deployStakeManager
}
