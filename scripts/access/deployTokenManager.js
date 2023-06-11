const { deployContract, contractAt, writeTmpAddresses, sendTxn } = require("../shared/helpers")

async function main() {
  const tokenManager = await deployContract("TokenManager", [1], "TokenManager")
  writeTmpAddresses({TokenManager: tokenManager.address})

  const signers = [
    "0x551c95fEA9aE2bB0FC969526166692E26D28e40d" // My address
  ]

  const tx = await tokenManager.initialize(signers);
  const len = await tokenManager.signersLength();
  console.log("signersLength", len.toString());
}


async function deployTokenManager() {
  try {
    await main()
  }
  catch (e) {
    console.log("Error in deployTokenManager: ", e)
  }
}

module.exports = { 
  deployTokenManager
}
