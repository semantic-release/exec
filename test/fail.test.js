import test from 'ava';
import {stub} from 'sinon';
import {fail} from '..';

stub(process.stdout, 'write');
stub(process.stderr, 'write');

test.beforeEach(t => {
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test.serial('Return the value fail script wrote to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh',
  };
  const params = {logger: t.context.logger};

  await t.notThrows(fail(pluginConfig, params));
});

test.serial('Throw "Error" if if the fail script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const params = {logger: t.context.logger};

  await t.throws(fail(pluginConfig, params), Error);
});
