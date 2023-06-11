const { deployContract, contractAt, writeTmpAddresses, sendTxn } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');

async function deployReferralReader() {
  try {
    const referralReader = await deployContract("ReferralReader", [], "ReferralReader")
    writeTmpAddresses({ ReferralReader: referralReader.address })
  }
  catch(error) {
    console.log("Error deploying ReferralReader", error)
  }
}

module.exports = {
  deployReferralReader
}
