const { deployContract, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

async function main() {
  const initialSupply = expandDecimals(401 * 1000, 18)
  const gmt = await deployContract("GMT", [initialSupply])
  writeTmpAddresses({ GMT: gmt.address })
  return { gmt }
}

async function deployGMT() {
  try {
    await main()
  }
  catch (e) {
    console.error("deployGMT error", e)
  }
}

module.exports = {
  deployGMT
}
