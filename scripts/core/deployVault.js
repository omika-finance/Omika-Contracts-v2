const { deployContract, contractAt, sendTxn, writeTmpAddresses, readTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")
const { errors } = require("../../test/core/Vault/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const { nativeToken } = tokens

  try {

    const vault = await deployContract("Vault", [])
    writeTmpAddresses({Vault: vault.address})
    // const vault = await contractAt("Vault", "0x489ee077994B6658eAfA855C308275EAd8097C4A")
    const usdg = await deployContract("USDG", [vault.address])
    writeTmpAddresses({USDG: usdg.address})
    // const usdg = await contractAt("USDG", "0x45096e7aA921f27590f8F19e457794EB09678141")
    const router = await deployContract("Router", [vault.address, usdg.address, nativeToken.address])
    writeTmpAddresses({Router: router.address})
    // const router = await contractAt("Router", "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064")
    // const vaultPriceFeed = await contractAt("VaultPriceFeed", "0x30333ce00ac3025276927672aaefd80f22e89e54")
    // const secondaryPriceFeed = await deployContract("FastPriceFeed", [5 * 60])

    const vaultPriceFeed = await deployContract("VaultPriceFeed", [])
    writeTmpAddresses({VaultPriceFeed: vaultPriceFeed.address})

    await vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(1, 28)) // 0.05 USD
    await vaultPriceFeed.setPriceSampleSpace(1)
    await vaultPriceFeed.setIsAmmEnabled(false)

    const glp = await deployContract("GLP", [])
    writeTmpAddresses({GLP: glp.address})

    const { Vault: vaultAddress, Governable: govAddress } = readTmpAddresses();
    const shortsTracker = await deployContract("ShortsTracker", [vaultAddress], "ShortsTracker", { gasLimit: 12500000 })
    writeTmpAddresses({ShortsTracker: shortsTracker.address})
    
    await shortsTracker.setGov(govAddress)

    await glp.setInPrivateTransferMode(true)
    // const glp = await contractAt("GLP", "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258")
    const glpManager = await deployContract("GlpManager", [vault.address, usdg.address, glp.address, shortsTracker.address, 15 * 60])
    writeTmpAddresses({GlpManager: glpManager.address})

    await glpManager.setInPrivateMode(true)

    await glp.setMinter(glpManager.address, true)
    await usdg.addVault(glpManager.address)

    await vault.initialize(
      router.address, // router
      usdg.address, // usdg
      vaultPriceFeed.address, // priceFeed
      toUsd(2), // liquidationFeeUsd
      100, // fundingRateFactor
      100 // stableFundingRateFactor
    )

    await vault.setFundingRate(60 * 60, 100, 100)

    await vault.setInManagerMode(true)
    await vault.setManager(glpManager.address, true)

    await vault.setFees(
      10, // _taxBasisPoints
      5, // _stableTaxBasisPoints
      20, // _mintBurnFeeBasisPoints
      20, // _swapFeeBasisPoints
      1, // _stableSwapFeeBasisPoints
      10, // _marginFeeBasisPoints
      toUsd(2), // _liquidationFeeUsd
      24 * 60 * 60, // _minProfitTime
      true // _hasDynamicFees
    )

    const vaultErrorController = await deployContract("VaultErrorController", [])
    writeTmpAddresses({VaultErrorController: vaultErrorController.address})

    await vault.setErrorController(vaultErrorController.address)
    await vaultErrorController.setErrors(vault.address, errors)

    // const vaultUtils = await deployContract("VaultUtils", [vault.address])
    // await vault.setVaultUtils(vaultUtils.address)
  }
  catch (error) {
    console.error(error);
  }
}


async function deployVault() {
  try {
    await main()
  }
  catch (e) {
    console.log("Error in deployVault: ", e)
  }
}

module.exports = {
  deployVault
} 
