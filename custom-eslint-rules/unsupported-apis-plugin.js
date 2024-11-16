const unnsuportedApisRules = require("./unsupported-apis")
const plugin = { rules: { enforceUnsupportedApis: unnsuportedApisRules } }
module.exports = plugin
