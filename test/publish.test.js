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

test.serial('Return if the publish script returns 0', async t => {
  const pluginConfig = {cmd: 'exit 0'};
  const params = {logger: t.context.logger, options: {}};

  await t.notThrows(publish(pluginConfig, params));
});

test.serial('Throw "Error" if the publish script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const params = {logger: t.context.logger, options: {}};

  await t.throws(publish(pluginConfig, params), Error);
});
