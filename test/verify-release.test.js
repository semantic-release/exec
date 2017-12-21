import test from 'ava';
import {stub} from 'sinon';
import {verifyRelease} from '..';

// Disable logs during tests
stub(process.stdout, 'write');
stub(process.stderr, 'write');

test.beforeEach(t => {
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test.serial('Return if the verifyRelease script returns 0', async t => {
  const pluginConfig = {cmd: 'exit 0'};
  const params = {logger: t.context.logger, options: {}};

  await t.notThrows(verifyRelease(pluginConfig, params));
});

test.serial('Throw "SemanticReleaseError" if the verifyRelease script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const params = {logger: t.context.logger, options: {}};

  const error = await t.throws(verifyRelease(pluginConfig, params));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EVERIFYRELEASE');
});
