import test from "ava";
import { stub } from "sinon";
import { WritableStreamBuffer } from "stream-buffers";
import { verifyRelease } from "../index.js";

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

test("Return if the verifyRelease script returns 0", async (t) => {
  const pluginConfig = { verifyReleaseCmd: "exit 0" };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
    options: {},
  };

  await t.notThrowsAsync(verifyRelease(pluginConfig, context));
});

test('Throw "SemanticReleaseError" if the verifyRelease script does not returns 0', async (t) => {
  const pluginConfig = { verifyReleaseCmd: "exit 1" };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
    options: {},
  };

  const error = await t.throwsAsync(verifyRelease(pluginConfig, context));

  t.is(error.name, "SemanticReleaseError");
  t.is(error.code, "EVERIFYRELEASE");
});

test('Use "cmd" if defined and "verifyReleaseCmd" is not', async (t) => {
  const pluginConfig = { cmd: "./test/fixtures/echo-args.sh" };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  await t.notThrowsAsync(verifyRelease(pluginConfig, context));
});

test('Use "verifyReleaseCmd" even if "cmd" is defined', async (t) => {
  const pluginConfig = {
    verifyReleaseCmd: "./test/fixtures/echo-args.sh",
    cmd: "exit 1",
  };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  await t.notThrowsAsync(verifyRelease(pluginConfig, context));
});
