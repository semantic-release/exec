const {isString} = require('lodash');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = config => {
  if (!isString(config.cmd) || !config.cmd.trim()) {
    throw new SemanticReleaseError(
      'The script plugin must be configured with the shell command to execute in the a "cmd" option.',
      'EINVALIDCMD'
    );
  }
};
