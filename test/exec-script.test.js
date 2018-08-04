import test from 'ava';
import {stub} from 'sinon';
import {WritableStreamBuffer} from 'stream-buffers';
import execScript from '../lib/exec-script';

test.beforeEach(t => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test.serial('Pipe script output to stdout and stderr', async t => {
  const pluginConfig = {cmd: '>&2 echo "write to stderr" && echo "write to stdout"'};
  const context = {stdout: t.context.stdout, stderr: t.context.stderr, logger: t.context.logger, options: {}};

  const result = await execScript(pluginConfig, context);

  t.is(result, 'write to stdout');
  t.is(t.context.stdout.getContentsAsString('utf8').trim(), 'write to stdout');
  t.is(t.context.stderr.getContentsAsString('utf8').trim(), 'write to stderr');
});

test.serial('Generate command with template', async t => {
  const pluginConfig = {cmd: `./test/fixtures/echo-args.sh \${config.conf} \${lastRelease.version}`, conf: 'confValue'};
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    lastRelease: {version: '1.0.0'},
    logger: t.context.logger,
  };

  const result = await execScript(pluginConfig, context);
  t.is(result, 'confValue 1.0.0');
});
