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
    console.log("Error in deployGov: ", e)
  }
}

module.exports = {
  deployGov
}
