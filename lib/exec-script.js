const {template} = require('lodash');
const execa = require('execa');

module.exports = async ({cmd, ...config}, {logger, ...opts}) => {
  const script = template(cmd)({config, ...opts});

  logger.log('Call script %s', script);

  const shell = execa.shell(script);
  shell.stdout.pipe(process.stdout);
  shell.stderr.pipe(process.stderr);

  return (await shell).stdout.trim();
};
