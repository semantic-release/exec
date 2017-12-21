import test from 'ava';
import {stub} from 'sinon';
import {getLastRelease} from '..';

// Disable logs during tests
stub(process.stdout, 'write');
stub(process.stderr, 'write');

test.beforeEach(t => {
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test.serial('Parse JSON returned by getLastRelease script', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh {\\"version\\": \\"1.0.0\\", \\"gitHead\\": \\"12345678\\"}',
  };
  const params = {logger: t.context.logger};

  const result = await getLastRelease(pluginConfig, params);
  t.deepEqual(result, {version: '1.0.0', gitHead: '12345678'});
});

test.serial('Return "undefined" if the getLastRelease script wrtite nothing to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh',
  };
  const params = {logger: t.context.logger};

  const result = await getLastRelease(pluginConfig, params);
  t.is(result, undefined);
});

test.serial('Throw JSONError if getLastRelease script write invalid JSON to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh invalid_json',
  };
  const params = {logger: t.context.logger};

  const error = await t.throws(getLastRelease(pluginConfig, params));
  t.is(error.name, 'JSONError');
});

test.serial('Throw Error if if the getLastRelease script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const params = {logger: t.context.logger};

  await t.throws(getLastRelease(pluginConfig, params), Error);
});
