const test = require('ava');
const {stub} = require('sinon');
const {WritableStreamBuffer} = require('stream-buffers');
const {fail} = require('..');

test.beforeEach((t) => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test('Execute script in fail step', async (t) => {
  const pluginConfig = {failCmd: './test/fixtures/echo-args.sh'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  await t.notThrowsAsync(fail(pluginConfig, context));
});

test('Throw "Error" if the fail script does not returns 0', async (t) => {
  const pluginConfig = {failCmd: 'exit 1'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  await t.throwsAsync(fail(pluginConfig, context), {instanceOf: Error});
});

test('Use "cmd" if defined and "failCmd" is not', async (t) => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  await t.notThrowsAsync(fail(pluginConfig, context));
});

test('Use "failCmd" even if "cmd" is defined', async (t) => {
  const pluginConfig = {failCmd: './test/fixtures/echo-args.sh', cmd: 'exit 1'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  await t.notThrowsAsync(fail(pluginConfig, context));
});
