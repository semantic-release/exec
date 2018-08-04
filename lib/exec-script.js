const {template} = require('lodash');
const execa = require('execa');

module.exports = async ({cmd, ...config}, {cwd, env, stdout, stderr, logger, ...context}) => {
  const script = template(cmd)({config, ...context});

  logger.log('Call script %s', script);

  const shell = execa.shell(script, {cwd, env});
  shell.stdout.pipe(stdout);
  shell.stderr.pipe(stderr);

  return (await shell).stdout.trim();
};
