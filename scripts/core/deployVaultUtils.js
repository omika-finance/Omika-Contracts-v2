const { getFrameSigner, deployContract, contractAt , sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")
const { errors } = require("../../test/core/Vault/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  // const signer = await getFrameSigner()
  const { Vault: vaultAddress } = readTmpAddresses();   
  const vault = await contractAt("Vault", vaultAddress);
  const timelock = await contractAt("Timelock", await vault.gov());
  const vaultUtils = await deployContract("VaultUtils", [vaultAddress])
  writeTmpAddresses({VaultUtils: vaultUtils.address})

  await timelock.setVaultUtils(vault.address, vaultUtils.address)
}

async function deployVaultUtils() {
  try {
    await main();
  }
  catch (error) {
    console.log("Error deploying vault utils", error);
  }
}

module.exports = {
  deployVaultUtils
}
