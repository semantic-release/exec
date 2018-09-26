const {template} = require('lodash');
const execa = require('execa');

module.exports = async (cmdProp, {shell, ...config}, {cwd, env, stdout, stderr, logger, ...context}) => {
  const cmd = config[cmdProp] ? cmdProp : 'cmd';
  const script = template(config[cmd])({config, ...context});

  logger.log('Call script %s', script);

  const result = execa.shell(script, {shell, cwd, env});

  result.stdout.pipe(
    stdout,
    {end: false}
  );
  result.stderr.pipe(
    stderr,
    {end: false}
  );

  return (await result).stdout.trim();
};
