const { deployContract, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  const governable = await deployContract("Governable", [], "Governable");
  writeTmpAddresses({Governable: governable.address})
}


async function deployGov() {
  try {
    await main()
  }
  catch (e) {
    throw new Error(`deployGovernable error: ${e.toString()}`)
  }
}

module.exports = {
  deployGov
}
