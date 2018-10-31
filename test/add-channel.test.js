import test from 'ava';
import {stub} from 'sinon';
import {WritableStreamBuffer} from 'stream-buffers';
import {addChannel} from '..';

test.beforeEach(t => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test('Parse JSON returned by addChannel script', async t => {
  const pluginConfig = {
    addChannelCmd:
      './test/fixtures/echo-args.sh {\\"name\\": \\"Release name\\", \\"url\\": \\"https://host.com/release/1.0.0\\"}',
  };
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await addChannel(pluginConfig, context);
  t.deepEqual(result, {name: 'Release name', url: 'https://host.com/release/1.0.0'});
});

test('Return "undefined" if the addChannel script wrtite invalid JSON to stdout (with "publishCmd")', async t => {
  const pluginConfig = {addChannelCmd: './test/fixtures/echo-args.sh invalid_json'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await addChannel(pluginConfig, context);
  t.is(result, undefined);
});

test('Return "undefined" if the addChannel script wrtite invalid JSON to stdout (with "cmd")', async t => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh invalid_json'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await addChannel(pluginConfig, context);
  t.is(result, undefined);
});

test('Return "undefined" if the addChannel script wrtite nothing to stdout', async t => {
  const pluginConfig = {addChannelCmd: './test/fixtures/echo-args.sh'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await addChannel(pluginConfig, context);
  t.is(result, undefined);
});

test('Throw "Error" if the addChannel script does not returns 0', async t => {
  const pluginConfig = {addChannelCmd: 'exit 1'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  await t.throws(addChannel(pluginConfig, context), Error);
});

test('Use "cmd" if defined and "addChannelCmd" is not', async t => {
  const pluginConfig = {
    cmd:
      './test/fixtures/echo-args.sh {\\"name\\": \\"Release name\\", \\"url\\": \\"https://host.com/release/1.0.0\\"}',
  };
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await addChannel(pluginConfig, context);
  t.deepEqual(result, {name: 'Release name', url: 'https://host.com/release/1.0.0'});
});

test('Use "addChannelCmd" even if "cmd" is defined', async t => {
  const pluginConfig = {
    addChannelCmd:
      './test/fixtures/echo-args.sh {\\"name\\": \\"Release name\\", \\"url\\": \\"https://host.com/release/1.0.0\\"}',
    cmd: 'exit 1',
  };
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await addChannel(pluginConfig, context);
  t.deepEqual(result, {name: 'Release name', url: 'https://host.com/release/1.0.0'});
});
