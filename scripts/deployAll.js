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
  // await deployGov();
  // await deployGMT();
  // await deployTokens();
  // await deployTokenManager();
  // await deployVault();
  // await deployVaultUtils();
  // await deployOrderBook();
  // await deployGMX();
  // await deployTreasury();
  // await deployPositionRouter();
  // await deployPositionManager();

  // await deployAMM();
  // await deployOracle();

  // await deployGMXMigrator();
  // await deployBridge();

  // Referrals
  await deployReferralReader();
  await deployReferralStorage();

  await deployRewards();
  
  await deployStakeManager();
  await deployStakedGlpMigrator();

  await deployPeripheral();
}


// "BTC": "0x6F75b19F35DDCBDf4dcB2ceB4586FcB427fdAAB1",
// "USDC": "0x5fBF9E312d70419aC5A26221aCfF3A3E276e84b7",
// "USDT": "0x4435bd725899694CAFd94AEcc2F94387673092bb",
// "BUSD": "0xcb14A2D8402A44dC946A18B94C80Eb80Ef6B93BC",
// "WETH": "0x77a6a035cD10e8bff0Ead89Ff85A5D9989F57a31",

runDeploy().catch((e) => {
  console.error(e);
  process.exit(1);
})
