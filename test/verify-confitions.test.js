import test from 'ava';
import {stub} from 'sinon';
import {verifyConditions} from '..';

// Disable logs during tests
stub(process.stdout, 'write');
stub(process.stderr, 'write');

test.beforeEach(t => {
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test.serial('Verify plugin config is an Object with a "cmd" property', async t => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh'};
  const params = {logger: t.context.logger};

  await t.notThrows(verifyConditions(pluginConfig, params));
});

test.serial('Throw "SemanticReleaseError" if "cmd" options is missing', async t => {
  const pluginConfig = {};
  const params = {logger: t.context.logger};

  const error = await t.throws(verifyConditions(pluginConfig, params));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test.serial('Throw "SemanticReleaseError" if "cmd" options is empty', async t => {
  const pluginConfig = {cmd: '      '};
  const params = {logger: t.context.logger, options: {}};

  const error = await t.throws(verifyConditions(pluginConfig, params));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test.serial('Throw "SemanticReleaseError" if another script plugin "cmd" options is missing', async t => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh'};
  const params = {
    logger: t.context.logger,
    options: {publish: ['@semantic-release/npm', {path: '@semantic-release/script'}]},
  };

  const error = await t.throws(verifyConditions(pluginConfig, params));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test.serial('Throw "SemanticReleaseError" if another script plugin "cmd" options is empty', async t => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh'};
  const params = {
    logger: t.context.logger,
    options: {
      branch: 'master',
      getLastRelease: ['@semantic-release/npm', {path: '@semantic-release/script', cmd: '  '}],
    },
  };

  const error = await t.throws(verifyConditions(pluginConfig, params));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test.serial('Return if the verifyConditions script returns 0', async t => {
  const pluginConfig = {cmd: 'exit 0'};
  const params = {logger: t.context.logger, options: {}};

  await t.notThrows(verifyConditions(pluginConfig, params));
});

test.serial('Throw "SemanticReleaseError" if the verifyConditions script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const params = {logger: t.context.logger, options: {}};

  const error = await t.throws(verifyConditions(pluginConfig, params));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EVERIFYCONDITIONS');
});
