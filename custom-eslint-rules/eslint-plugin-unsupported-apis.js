const unsupportedApisRules = require("./enforce-unsupported-apis");
const plugin = { rules: { "enforce-unsupported-apis": unsupportedApisRules} };
module.exports = plugin;