const { deployContract, contractAt, writeTmpAddresses } = require("../shared/helpers")
const { bigNumberify, expandDecimals } = require("../../test/shared/utilities")

async function deployGMXMigrator() {
  const { MaxUint256 } = ethers.constants
  const precision = 1000000

  const gmxMigrator = await deployContract("GmxMigrator", [2])
  writeTmpAddresses({ GmxMigrator: gmxMigrator.address })

  const gmtGmxIou = await deployContract("GmxIou", [gmxMigrator.address, "GMT GMX (IOU)", "GMT:GMX"])
  writeTmpAddresses({ GmtGmxIou: gmtGmxIou.address })

  const xgmtGmxIou = await deployContract("GmxIou", [gmxMigrator.address, "xGMT GMX (IOU)", "xGMT:GMX"])
  writeTmpAddresses({ XgmtGmxIou: xgmtGmxIou.address })

  const gmtUsdgGmxIou = await deployContract("GmxIou", [gmxMigrator.address, "GMT-USDG GMX (IOU)", "GMT-USDG:GMX"])
  writeTmpAddresses({ GmtUsdgGmxIou: gmtUsdgGmxIou.address })

  const xgmtUsdgGmxIou = await deployContract("GmxIou", [gmxMigrator.address, "xGMT-USDG GMX (IOU)", "xGMT-USDG:GMX"])
  writeTmpAddresses({ XgmtUsdgGmxIou: xgmtUsdgGmxIou.address })
}

module.exports = {
  deployGMXMigrator
}


