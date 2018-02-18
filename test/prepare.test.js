import test from 'ava';
import {stub} from 'sinon';
import {prepare} from '..';

stub(process.stdout, 'write');
stub(process.stderr, 'write');

test.beforeEach(t => {
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test.serial('Execute script in prepare step', async t => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh'};
  const params = {logger: t.context.logger};

  await t.notThrows(prepare(pluginConfig, params));
});

test.serial('Throw "Error" if the prepare script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const params = {logger: t.context.logger};

  await t.throws(prepare(pluginConfig, params), Error);
});
