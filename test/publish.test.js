import test from 'ava';
import {stub} from 'sinon';
import {publish} from '..';

// Disable logs during tests
stub(process.stdout, 'write');
stub(process.stderr, 'write');

test.beforeEach(t => {
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test.serial('Parse JSON returned by publish script', async t => {
  const pluginConfig = {
    cmd:
      './test/fixtures/echo-args.sh {\\"name\\": \\"Release name\\", \\"url\\": \\"https://host.com/release/1.0.0\\"}',
  };
  const params = {logger: t.context.logger};

  const result = await publish(pluginConfig, params);
  t.deepEqual(result, {name: 'Release name', url: 'https://host.com/release/1.0.0'});
});

test.serial('Return "undefined" if the publish script wrtite nothing to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh',
  };
  const params = {logger: t.context.logger};

  const result = await publish(pluginConfig, params);
  t.is(result, undefined);
});

test.serial('Throw JSONError if publish script write invalid JSON to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh invalid_json',
  };
  const params = {logger: t.context.logger};

  const error = await t.throws(publish(pluginConfig, params));
  t.is(error.name, 'JSONError');
});

test.serial('Throw "Error" if the publish script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const params = {logger: t.context.logger, options: {}};

  await t.throws(publish(pluginConfig, params), Error);
});
