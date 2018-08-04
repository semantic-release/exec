import test from 'ava';
import {stub} from 'sinon';
import {WritableStreamBuffer} from 'stream-buffers';
import {verifyConditions} from '..';

test.beforeEach(t => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test('Verify plugin config is an Object with a "cmd" property', async t => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  await t.notThrows(verifyConditions(pluginConfig, context));
});

test('Throw "SemanticReleaseError" if "cmd" options is missing', async t => {
  const pluginConfig = {};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const error = await t.throws(verifyConditions(pluginConfig, context));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test('Throw "SemanticReleaseError" if "cmd" options is empty', async t => {
  const pluginConfig = {cmd: '      '};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  const error = await t.throws(verifyConditions(pluginConfig, context));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test('Throw "SemanticReleaseError" if another exec plugin "cmd" options is missing', async t => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh'};
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
    options: {publish: ['@semantic-release/npm', {path: '@semantic-release/exec'}]},
  };

  const error = await t.throws(verifyConditions(pluginConfig, context));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test('Throw "SemanticReleaseError" if another exec plugin "cmd" options is empty', async t => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh'};
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
    options: {
      branch: 'master',
      publish: ['@semantic-release/npm', {path: '@semantic-release/exec', cmd: '  '}],
    },
  };

  const error = await t.throws(verifyConditions(pluginConfig, context));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test('Return if the verifyConditions script returns 0', async t => {
  const pluginConfig = {cmd: 'exit 0'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  await t.notThrows(verifyConditions(pluginConfig, context));
});

test('Throw "SemanticReleaseError" if the verifyConditions script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  const error = await t.throws(verifyConditions(pluginConfig, context));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EVERIFYCONDITIONS');
});
