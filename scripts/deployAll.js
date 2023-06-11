const { deployGov } = require("./access/deployGovernable");
const { deployTokenManager } = require("./access/deployTokenManager");
const { deployOrderBook } = require("./core/deployOrderBook");
// const { deployOrderExecutor } = require("./core/deployOrderExecutor");
const { deployVault } = require("./core/deployVault");
const { deployVaultUtils } = require("./core/deployVaultUtils");
const { deployGMT } = require("./gambit-token/deployGMT");
const { deployGMX } = require("./gmx/deployGMX");
const { deployTokens } = require("./tokens/deployTokens");

async function runDeploy() {
  await deployGov();
  await deployGMT();
  await deployTokens();
  await deployTokenManager();
  await deployVault();
  await deployVaultUtils();
  await deployOrderBook();
  await deployGMX();
  // await deployOrderExecutor();
}

runDeploy().catch((e) => {
  console.error(e);
  process.exit(1);
})
