import test from 'ava';
import {stub} from 'sinon';
import {WritableStreamBuffer} from 'stream-buffers';
import {analyzeCommits} from '..';

test.beforeEach(t => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test('Return the value analyzeCommits script wrote to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh "minor   "',
  };
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await analyzeCommits(pluginConfig, context);
  t.is(result, 'minor');
});

test('Return "undefined" if the analyzeCommits script wrtite nothing to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh "   "',
  };
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await analyzeCommits(pluginConfig, context);
  t.is(result, undefined);
});

test('Throw Error if if the analyzeCommits script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  await t.throws(analyzeCommits(pluginConfig, context), Error);
});
