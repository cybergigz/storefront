const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project root
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Block .ignored* files that cause permission issues on Windows with pnpm
config.resolver.blockList = [/.*\/\.ignored.*/];

module.exports = config;
