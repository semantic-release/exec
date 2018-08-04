const {template} = require('lodash');
const execa = require('execa');

module.exports = async ({cmd, ...config}, {cwd, env, stdout, stderr, logger, ...context}) => {
  const script = template(cmd)({config, ...context});

  logger.log('Call script %s', script);

  const {stdout: cmdStdout, stderr: cmdStderr} = await execa.shell(script, {cwd, env});
  stdout.write(cmdStdout);
  stderr.write(cmdStderr);

  return cmdStdout.trim();
};
