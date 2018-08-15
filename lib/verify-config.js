const {isUndefined, isString} = require('lodash');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = ({cmd, shell}) => {
  if (!isString(cmd) || !cmd.trim()) {
    throw new SemanticReleaseError(
      'The exec plugin must be configured with the shell command to execute in the a "cmd" option.',
      'EINVALIDCMD'
    );
  }

  if (!isUndefined(shell) && (!isString(shell) || !shell.trim())) {
    throw new SemanticReleaseError(
      'The "shell" option, if specified, must be a non empty String or the value "true".',
      'EINVALIDSHELL'
    );
  }
};
