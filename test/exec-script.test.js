import test from 'ava';
import {stub} from 'sinon';
import execScript from '../lib/exec-script';

test.beforeEach(t => {
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
  t.context.stdout = stub(process.stdout, 'write');
  t.context.stderr = stub(process.stderr, 'write');
});

test.afterEach.always(t => {
  // Restore the logs
  t.context.stdout.restore();
  t.context.stderr.restore();
});

test.serial('Pipe script output to stdout and stderr', async t => {
  const pluginConfig = {cmd: '>&2 echo "write to stderr" && echo "write to stdout"'};
  const context = {logger: t.context.logger, options: {}};

  const result = await execScript(pluginConfig, context);

  t.is(result, 'write to stdout');
  t.is(t.context.stdout.args[0][0].toString().trim(), 'write to stdout');
  t.is(t.context.stderr.args[0][0].toString().trim(), 'write to stderr');
});

test.serial('Generate command with template', async t => {
  const pluginConfig = {cmd: `./test/fixtures/echo-args.sh \${config.conf} \${lastRelease.version}`, conf: 'confValue'};
  const context = {lastRelease: {version: '1.0.0'}, logger: t.context.logger};

  const result = await execScript(pluginConfig, context);
  t.is(result, 'confValue 1.0.0');
});
