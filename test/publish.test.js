import test from 'ava';
import {stub} from 'sinon';
import {WritableStreamBuffer} from 'stream-buffers';
import {publish} from '..';

test.beforeEach(t => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test('Parse JSON returned by publish script', async t => {
  const pluginConfig = {
    cmd:
      './test/fixtures/echo-args.sh {\\"name\\": \\"Release name\\", \\"url\\": \\"https://host.com/release/1.0.0\\"}',
  };
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await publish(pluginConfig, context);
  t.deepEqual(result, {name: 'Release name', url: 'https://host.com/release/1.0.0'});
});

test('Return "undefined" if the publish script wrtite invalid JSON to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh invalid_json',
  };
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await publish(pluginConfig, context);
  t.is(result, undefined);
});

test('Return "undefined" if the publish script wrtite nothing to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh',
  };
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await publish(pluginConfig, context);
  t.is(result, undefined);
});

test('Throw "Error" if the publish script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  await t.throws(publish(pluginConfig, context), Error);
});
