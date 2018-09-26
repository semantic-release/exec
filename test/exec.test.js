import test from 'ava';
import {stub} from 'sinon';
import {WritableStreamBuffer} from 'stream-buffers';
import exec from '../lib/exec';

test.beforeEach(t => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test('Pipe script output to stdout and stderr', async t => {
  const pluginConfig = {publishCmd: '>&2 echo "write to stderr" && echo "write to stdout"'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  const result = await exec('publishCmd', pluginConfig, context);

  t.is(result, 'write to stdout');
  t.is(t.context.stdout.getContentsAsString('utf8').trim(), 'write to stdout');
  t.is(t.context.stderr.getContentsAsString('utf8').trim(), 'write to stderr');
});

test('Generate command with template', async t => {
  const pluginConfig = {
    publishCmd: `./test/fixtures/echo-args.sh \${config.conf} \${lastRelease.version}`,
    conf: 'confValue',
  };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    lastRelease: {version: '1.0.0'},
    logger: t.context.logger,
  };

  const result = await exec('publishCmd', pluginConfig, context);
  t.is(result, 'confValue 1.0.0');
});

test('Execute the script with the specified "shell"', async t => {
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  let result = await exec('publishCmd', {publishCmd: 'echo $0', shell: 'bash'}, context);
  t.is(result, 'bash');

  result = await exec('publishCmd', {publishCmd: 'echo $0', shell: 'sh'}, context);
  t.is(result, 'sh');
});

test('Execute the script in "cmd" if no step specific command is passed', async t => {
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger};

  const result = await exec('publishCmd', {cmd: 'echo run cmd'}, context);
  t.is(result, 'run cmd');
});
