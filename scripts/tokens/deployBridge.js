const { deployContract, contractAt, writeTmpAddresses } = require("../shared/helpers")

async function deployBridge() {
  const gmx = { address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a" }
  const wGmx = { address: "0x590020B1005b8b25f1a2C82c5f743c540dcfa24d" }
  const bridge = await deployContract("Bridge", [gmx.address, wGmx.address], "Bridge")
  writeTmpAddresses({ bridge: bridge.address })
}

module.exports = {
  deployBridge
}
