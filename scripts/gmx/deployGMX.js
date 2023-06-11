const { deployContract, contractAt, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  await deployContract("GMX", [])
}

async function deployGMX() {
  try {
    await main()
  }
  catch (error) {
    console.error("Error deploying Gmx", error)
  }
}

module.exports = {
  deployGMX
}
