const parseJson = require('parse-json');
const debug = require('debug')('semantic-release:exec');
const SemanticReleaseError = require('@semantic-release/error');
const execScript = require('./lib/exec-script');
const verifyConfig = require('./lib/verify-config');

async function verifyConditions(pluginConfig, context) {
  verifyConfig(pluginConfig);

  try {
    await execScript(pluginConfig, context);
  } catch (error) {
    throw new SemanticReleaseError(error.stdout, 'EVERIFYCONDITIONS');
  }
}

async function analyzeCommits(pluginConfig, context) {
  verifyConfig(pluginConfig);

  const stdout = await execScript(pluginConfig, context);
  return stdout || undefined;
}

async function verifyRelease(pluginConfig, context) {
  verifyConfig(pluginConfig);

  try {
    await execScript(pluginConfig, context);
  } catch (error) {
    throw new SemanticReleaseError(error.stdout, 'EVERIFYRELEASE');
  }
}

async function generateNotes(pluginConfig, context) {
  verifyConfig(pluginConfig);

  const stdout = await execScript(pluginConfig, context);
  return stdout;
}

async function prepare(pluginConfig, context) {
  verifyConfig(pluginConfig);

  await execScript(pluginConfig, context);
}

async function publish(pluginConfig, context) {
  verifyConfig(pluginConfig);

  const stdout = await execScript(pluginConfig, context);

  try {
    return stdout ? parseJson(stdout) : undefined;
  } catch (error) {
    debug(stdout);
    debug(error);
    context.logger.log(
      `The command ${pluginConfig.cmd} wrote invalid JSON to stdout. The stdout content will be ignored.`
    );
  }
}

async function success(pluginConfig, context) {
  verifyConfig(pluginConfig);

  await execScript(pluginConfig, context);
}

async function fail(pluginConfig, context) {
  verifyConfig(pluginConfig);

  await execScript(pluginConfig, context);
}

module.exports = {verifyConditions, analyzeCommits, verifyRelease, generateNotes, prepare, publish, success, fail};
