const {template} = require('lodash');
const execa = require('execa');
const verifyConfig = require('./verify-config');

module.exports = async (cfg, {cwd, env, stdout, stderr, logger, ...context}) => {
  // so that if cfg.cmd is not present - error is thrown
  verifyConfig(cfg);

  const {cmd, ...config} = cfg;
  const script = template(cmd)({config, ...context});

  logger.log('Call script %s', script);

  const {stdout: cmdStdout, stderr: cmdStderr} = await execa.shell(script, {cwd, env});
  stdout.write(cmdStdout);
  stderr.write(cmdStderr);

  return cmdStdout.trim();
};
