const { deployContract, contractAt, sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

async function deployRewards() {
  try {
    const wallet = { address: "0x5F799f365Fa8A2B60ac0429C48B153cA5a6f0Cf8" }
    const { AddressZero } = ethers.constants

    const { WETH: weth } = readTmpAddresses();

    const gmx = await deployContract("GMX", []);
    writeTmpAddresses({ GMX: gmx.address })

    const esGmx = await deployContract("EsGMX", []);
    writeTmpAddresses({ EsGMX: esGmx.address })

    const bnGmx = await deployContract("MintableBaseToken", ["Bonus GMX", "bnGMX", 0]);
    writeTmpAddresses({ bnGMX: bnGmx.address })

    const stakedGmxTracker = await deployContract("RewardTracker", ["Staked GMX", "sGMX"])
    writeTmpAddresses({ stakedGmxTracker: stakedGmxTracker.address })

    const stakedGlpTracker = await deployContract("RewardTracker", ["Staked GLP", "sGLP"])
    writeTmpAddresses({ stakedGlpTracker: stakedGlpTracker.address })

    const stakedGmxDistributor = await deployContract("RewardDistributor", [esGmx.address, stakedGmxTracker.address])
    writeTmpAddresses({ stakedGmxDistributor: stakedGmxDistributor.address })

    await stakedGmxTracker.initialize([gmx.address, esGmx.address], stakedGmxDistributor.address)
    await stakedGmxDistributor.updateLastDistributionTime()

    const bonusGmxTracker = await deployContract("RewardTracker", ["Staked + Bonus GMX", "sbGMX"])
    writeTmpAddresses({ bonusGmxTracker: bonusGmxTracker.address })

    const bonusGmxDistributor = await deployContract("BonusDistributor", [bnGmx.address, bonusGmxTracker.address])
    writeTmpAddresses({ bonusGmxDistributor: bonusGmxDistributor.address })

    await bonusGmxTracker.initialize([stakedGmxTracker.address], bonusGmxDistributor.address)
    await bonusGmxDistributor.updateLastDistributionTime()

    const feeGmxTracker = await deployContract("RewardTracker", ["Staked + Bonus + Fee GMX", "sbfGMX"])
    writeTmpAddresses({ feeGmxTracker: feeGmxTracker.address });

    const feeGlpTracker = await deployContract("RewardTracker", ["Staked + Bonus + Fee GLP", "sbfGLP"])
    writeTmpAddresses({ feeGlpTracker: feeGlpTracker.address });

    const feeGmxDistributor = await deployContract("RewardDistributor", [weth, feeGmxTracker.address])
    writeTmpAddresses({ feeGmxDistributor: feeGmxDistributor.address });

    await feeGmxTracker.initialize([bonusGmxTracker.address, bnGmx.address], feeGmxDistributor.address)
    await feeGmxDistributor.updateLastDistributionTime()


    const stakedAlpTracker = { address: AddressZero }
    const bonusAlpTracker = { address: AddressZero }

    const glpManager = { address: AddressZero }
    const { GLP: glp, GlpManager } = readTmpAddresses();

    await stakedGmxTracker.setInPrivateTransferMode(true)
    await stakedGmxTracker.setInPrivateStakingMode(true)
    await bonusGmxTracker.setInPrivateTransferMode(true)
    await bonusGmxTracker.setInPrivateStakingMode(true)
    await bonusGmxTracker.setInPrivateClaimingMode(true)
    await feeGmxTracker.setInPrivateTransferMode(true)
    await feeGmxTracker.setInPrivateStakingMode(true)

    const rewardRouter = await deployContract("RewardRouter", [])
    writeTmpAddresses({ RewardRouter: rewardRouter.address })

    await rewardRouter.initialize(
      weth,
      gmx.address,
      esGmx.address,
      bnGmx.address,
      glp,
      stakedGmxTracker.address,
      bonusGmxTracker.address,
      feeGmxTracker.address,
      feeGlpTracker.address,
      stakedGlpTracker.address,
      GlpManager
    )

    // allow rewardRouter to stake in stakedGmxTracker
    await stakedGmxTracker.setHandler(rewardRouter.address, true)
    // allow bonusGmxTracker to stake stakedGmxTracker
    await stakedGmxTracker.setHandler(bonusGmxTracker.address, true)
    // allow rewardRouter to stake in bonusGmxTracker
    await bonusGmxTracker.setHandler(rewardRouter.address, true)
    // allow bonusGmxTracker to stake feeGmxTracker
    await bonusGmxTracker.setHandler(feeGmxTracker.address, true)
    await bonusGmxDistributor.setBonusMultiplier(10000)
    // allow rewardRouter to stake in feeGmxTracker
    await feeGmxTracker.setHandler(rewardRouter.address, true)
    // allow stakedGmxTracker to stake esGmx
    await esGmx.setHandler(stakedGmxTracker.address, true)
    // allow feeGmxTracker to stake bnGmx
    await bnGmx.setHandler(feeGmxTracker.address, true)
    // allow rewardRouter to burn bnGmx
    await bnGmx.setMinter(rewardRouter.address, true)

    // mint esGmx for distributors
    await esGmx.setMinter(wallet.address, true)
    await stakedGmxDistributor.setTokensPerInterval("20667989410000000")// 0.02066798941 esGmx per second

    // mint bnGmx for distributor
    await bnGmx.setMinter(wallet.address, true)
  }
  catch (e) {
    console.log("Error in deploy Rewards: ", e)
  }
}

module.exports = {
  deployRewards
}