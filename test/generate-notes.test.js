import test from 'ava';
import {stub} from 'sinon';
import {WritableStreamBuffer} from 'stream-buffers';
import {generateNotes} from '..';

test.beforeEach(t => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test('Return the value generateNotes script wrote to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh "\nRelease note \n\n"',
  };
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await generateNotes(pluginConfig, context);
  t.is(result, 'Release note');
});

test('Throw "SemanticReleaseError" if "cmd" options is missing', async t => {
  const pluginConfig = {};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const error = await t.throws(generateNotes(pluginConfig, context));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test('Throw "SemanticReleaseError" if "cmd" options is empty', async t => {
  const pluginConfig = {cmd: '      '};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  const error = await t.throws(generateNotes(pluginConfig, context));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test('Throw "SemanticReleaseError" if "shell" options is invalid', async t => {
  const pluginConfig = {cmd: './test/fixtures/echo-args.sh', shell: '   '};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  const error = await t.throws(generateNotes(pluginConfig, context));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDSHELL');
});

test('Throw "Error" if if the generateNotes script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  await t.throws(generateNotes(pluginConfig, context), Error);
});
