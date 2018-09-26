const url = require('url');
const {inspect} = require('util');
const {isString} = require('lodash');
const pkg = require('../../package.json');

const homepage = url.format({...url.parse(pkg.homepage), ...{hash: null}});
const stringify = obj => (isString(obj) ? obj : inspect(obj, {breakLength: Infinity, depth: 2, maxArrayLength: 5}));
const linkify = file => `${homepage}/blob/master/${file}`;

module.exports = {
  EINVALIDCMD: ({cmd, cmdProp}) => ({
    message: `Invalid \`${cmdProp}\` option.`,
    details: `The [\`${cmdProp}\` option](${linkify(
      `README.md#${cmdProp}`
    )}) is required and must be a non empty \`String\`.

Your configuration for the \`${cmdProp}\` option is \`${stringify(cmd)}\`.`,
  }),
  EINVALIDSHELL: ({shell}) => ({
    message: 'Invalid `shell` option.',
    details: `The [\`shell\` option](${linkify(
      'README.md#options'
    )}) if defined, must be a non empty \`String\` or the value \`true\`.

Your configuration for the \`shell\` option is \`${stringify(shell)}\`.`,
  }),
};
