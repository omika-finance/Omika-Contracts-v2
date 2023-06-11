const { deployContract, contractAt, sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const PRECISION = 1000000

async function main() {
  const treasury = await deployContract("Treasury", [], "Treasury")
  writeTmpAddresses({Treasury: treasury.address})
  const { GMT: gmtAddress, Router: routerAddress, BUSD: busdAddress } = readTmpAddresses();
  const fund = { address: "0x58CAaCa45a213e9218C5fFd605d5B953da9b9a91" }
  const gmtPresalePrice = 4.5 * PRECISION
  const gmtListingPrice = 5 * PRECISION
  const busdSlotCap = expandDecimals(2000, 18)
  const busdHardCap = expandDecimals(900 * 1000, 18)
  const busdBasisPoints = 5000 // 50%
  const unlockTime = 1615291200 // Tuesday, 9 March 2021 12:00:00 (GMT+0)

  await treasury.initialize(
    [
      gmtAddress,
      busdAddress,
      routerAddress,
      fund.address
    ],
    [
      gmtPresalePrice,
      gmtListingPrice,
      busdSlotCap,
      busdHardCap,
      busdBasisPoints,
      unlockTime
    ]
  )

  return { treasury }
}

async function deployTreasury() {
  try {
    await main()
  }
  catch (e) {
    console.log("Error in deployTreasury: ", e)
  }
}

module.exports  = {
  deployTreasury
}
