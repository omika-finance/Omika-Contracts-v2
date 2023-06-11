const { deployGov } = require("./access/deployGovernable");
const { deployTokenManager } = require("./access/deployTokenManager");
const { deployAMM } = require("./amm/deployamm");
const { deployOrderBook } = require("./core/deployOrderBook");
const { deployPositionManager } = require("./core/deployPositionManager");
const { deployPositionRouter } = require("./core/deployPositionRouter");
const { deployReferralReader } = require("./core/deployReferralReader");
const { deployReferralStorage } = require("./core/deployReferralStorage");
const { deployVault } = require("./core/deployVault");
const { deployVaultUtils } = require("./core/deployVaultUtils");
const { deployGMT } = require("./gambit-token/deployGMT");
const { deployTreasury } = require("./gambit-token/deployTreasury");
const { deployGMX } = require("./gmx/deployGMX");
const { deployGMXMigrator } = require("./gmx/deployGmxMigrator");
const { deployOracle } = require("./oracle/deployOracle");
const { deployPeripheral } = require("./peripherals/deployPeripheral");
const { deployRewards } = require("./staking/deployRewards");
const { deployStakeManager } = require("./staking/deployStakeManager");
const { deployStakedGlpMigrator } = require("./staking/deployStakedGlpMigrator");
const { deployTokens } = require("./tokens/deployTokens");
const { deployBridge } = require("./tokens/deployBridge");

async function runDeploy() {
  await deployGov();
  await deployGMT();
  await deployTokens();
  await deployTokenManager();
  await deployVault();
  await deployVaultUtils();
  await deployOrderBook();
  await deployGMX();
  await deployTreasury();
  await deployPositionRouter();
  await deployPositionManager();

  await deployAMM();
  await deployOracle();

  await deployGMXMigrator();
  await deployBridge();

  // Referrals
  await deployReferralReader();
  await deployReferralStorage();

  await deployRewards();
  
  await deployStakeManager();
  await deployStakedGlpMigrator();

  await deployPeripheral();
}

runDeploy().catch((e) => {
  console.error(e);
  process.exit(1);
})
