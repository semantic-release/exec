import test from "ava";
import { stub } from "sinon";
import { WritableStreamBuffer } from "stream-buffers";
import { success } from "../index.js";

test.beforeEach((t) => {
  t.context.stdout = new WritableStreamBuffer();
  t.context.stderr = new WritableStreamBuffer();
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {
    log: t.context.log,
    error: t.context.error,
    warn: t.context.warn,
  };
});

test("Execute script in success step", async (t) => {
  const pluginConfig = { successCmd: "./test/fixtures/echo-args.sh" };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  await t.notThrowsAsync(success(pluginConfig, context));
});

test('Throw "Error" if the success script does not returns 0', async (t) => {
  const pluginConfig = { successCmd: "exit 1" };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  await t.throwsAsync(success(pluginConfig, context), { instanceOf: Error });
});

test('Use "cmd" if defined and "successCmd" is not', async (t) => {
  const pluginConfig = { cmd: "./test/fixtures/echo-args.sh" };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  await t.notThrowsAsync(success(pluginConfig, context));
});

test('Use "successCmd" even if "cmd" is defined', async (t) => {
  const pluginConfig = {
    successCmd: "./test/fixtures/echo-args.sh",
    cmd: "exit 1",
  };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  await t.notThrowsAsync(success(pluginConfig, context));
});
