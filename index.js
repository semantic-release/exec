const {castArray, isPlainObject} = require('lodash');
const parseJson = require('parse-json');
const debug = require('debug')('semantic-release:exec');
const SemanticReleaseError = require('@semantic-release/error');
const execScript = require('./lib/exec-script');
const verifyConfig = require('./lib/verify-config');

const PLUGIN_TYPES = ['analyzeCommits', 'verifyRelease', 'generateNotes', 'publish', 'success', 'fail'];

async function verifyConditions(pluginConfig, context) {
  for (const [option, value] of Object.entries(context.options || {})) {
    if (PLUGIN_TYPES.includes(option)) {
      for (const plugin of castArray(value)) {
        if (
          plugin === '@semantic-release/exec' ||
          (isPlainObject(plugin) && plugin.path === '@semantic-release/exec')
        ) {
          verifyConfig(plugin);
        }
      }
    }
  }

  verifyConfig(pluginConfig);

  try {
    await execScript(pluginConfig, context);
  } catch (err) {
    throw new SemanticReleaseError(err.stdout, 'EVERIFYCONDITIONS');
  }
}

async function analyzeCommits(pluginConfig, context) {
  const stdout = await execScript(pluginConfig, context);
  return stdout.trim() ? stdout : undefined;
}

async function verifyRelease(pluginConfig, context) {
  try {
    await execScript(pluginConfig, context);
  } catch (err) {
    throw new SemanticReleaseError(err.stdout, 'EVERIFYRELEASE');
  }
}

async function generateNotes(pluginConfig, context) {
  return execScript(pluginConfig, context);
}

async function prepare(pluginConfig, context) {
  await execScript(pluginConfig, context);
}

async function publish(pluginConfig, context) {
  const stdout = await execScript(pluginConfig, context);
  try {
    return stdout.trim() ? parseJson(stdout) : undefined;
  } catch (err) {
    debug(stdout);
    debug(err);
    context.logger.log(
      `The command ${pluginConfig.cmd} wrote invalid JSON to stdout. The stdout content will be ignored.`
    );
  }
}

async function success(pluginConfig, context) {
  await execScript(pluginConfig, context);
}

async function fail(pluginConfig, context) {
  await execScript(pluginConfig, context);
}

module.exports = {verifyConditions, analyzeCommits, verifyRelease, generateNotes, prepare, publish, success, fail};
