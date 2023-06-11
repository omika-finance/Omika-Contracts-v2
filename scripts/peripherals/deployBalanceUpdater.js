const { deployContract, contractAt } = require("../shared/helpers")

async function main() {
  await deployContract("BalanceUpdater", [])
}


