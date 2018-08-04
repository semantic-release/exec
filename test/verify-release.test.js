import test from 'ava';
import {stub} from 'sinon';
import {WritableStreamBuffer} from 'stream-buffers';
import {verifyRelease} from '..';

test.beforeEach(t => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test('Return if the verifyRelease script returns 0', async t => {
  const pluginConfig = {cmd: 'exit 0'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  await t.notThrows(verifyRelease(pluginConfig, context));
});

test('Throw "SemanticReleaseError" if the verifyRelease script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  const error = await t.throws(verifyRelease(pluginConfig, context));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EVERIFYRELEASE');
});
