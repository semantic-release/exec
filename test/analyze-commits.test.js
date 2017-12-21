import test from 'ava';
import {stub} from 'sinon';
import {analyzeCommits} from '..';

// Disable logs during tests
stub(process.stdout, 'write');
stub(process.stderr, 'write');

test.beforeEach(t => {
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test.serial('Return the value analyzeCommits script wrote to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh "minor   "',
  };
  const params = {logger: t.context.logger};

  const result = await analyzeCommits(pluginConfig, params);
  t.is(result, 'minor');
});

test.serial('Return "undefined" if the analyzeCommits script wrtite nothing to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh "   "',
  };
  const params = {logger: t.context.logger};

  const result = await analyzeCommits(pluginConfig, params);
  t.is(result, undefined);
});

test.serial('Throw Error if if the analyzeCommits script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const params = {logger: t.context.logger};

  await t.throws(analyzeCommits(pluginConfig, params), Error);
});
