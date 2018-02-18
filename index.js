const {castArray, isPlainObject} = require('lodash');
const parseJson = require('parse-json');
const SemanticReleaseError = require('@semantic-release/error');
const execScript = require('./lib/exec-script');
const verifyConfig = require('./lib/verify-config');

const PLUGIN_TYPES = ['analyzeCommits', 'verifyRelease', 'generateNotes', 'publish', 'success', 'fail'];

async function verifyConditions(pluginConfig, params) {
  for (const [option, value] of Object.entries(params.options || {})) {
    if (PLUGIN_TYPES.includes(option)) {
      for (const plugin of castArray(value)) {
        if (
          plugin === '@semantic-release/script' ||
          (isPlainObject(plugin) && plugin.path === '@semantic-release/script')
        ) {
          verifyConfig(plugin);
        }
      }
    }
  }

  verifyConfig(pluginConfig);

  try {
    await execScript(pluginConfig, params);
  } catch (err) {
    throw new SemanticReleaseError(err.stdout, 'EVERIFYCONDITIONS');
  }
}

async function analyzeCommits(pluginConfig, params) {
  const stdout = await execScript(pluginConfig, params);
  return stdout.trim() ? stdout : undefined;
}

async function verifyRelease(pluginConfig, params) {
  try {
    await execScript(pluginConfig, params);
  } catch (err) {
    throw new SemanticReleaseError(err.stdout, 'EVERIFYRELEASE');
  }
}

async function generateNotes(pluginConfig, params) {
  return execScript(pluginConfig, params);
}

async function publish(pluginConfig, params) {
  const stdout = await execScript(pluginConfig, params);
  return stdout.trim() ? parseJson(stdout) : undefined;
}

async function success(pluginConfig, params) {
  await execScript(pluginConfig, params);
}

async function fail(pluginConfig, params) {
  await execScript(pluginConfig, params);
}

module.exports = {verifyConditions, analyzeCommits, verifyRelease, generateNotes, publish, success, fail};
