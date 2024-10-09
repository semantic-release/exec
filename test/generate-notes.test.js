import test from "ava";
import { stub } from "sinon";
import { WritableStreamBuffer } from "stream-buffers";
import { generateNotes } from "../index.js";

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

test("Return the value generateNotes script wrote to stdout", async (t) => {
  const pluginConfig = {
    generateNotesCmd: './test/fixtures/echo-args.sh "\nRelease note \n\n"',
  };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  const result = await generateNotes(pluginConfig, context);
  t.is(result, "Release note");
});

test('Throw "Error" if if the generateNotes script does not returns 0', async (t) => {
  const pluginConfig = { generateNotesCmd: "exit 1" };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  await t.throwsAsync(generateNotes(pluginConfig, context), {
    instanceOf: Error,
  });
});

test('Use "cmd" if defined and "generateNotesCmd" is not', async (t) => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh "\nRelease note \n\n"',
  };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  const result = await generateNotes(pluginConfig, context);
  t.is(result, "Release note");
});

test('Use "generateNotesCmd" even if "cmd" is defined', async (t) => {
  const pluginConfig = {
    generateNotesCmd: './test/fixtures/echo-args.sh "\nRelease note \n\n"',
    cmd: "exit 1",
  };
  const context = {
    stdout: t.context.stdout,
    stderr: t.context.stderr,
    logger: t.context.logger,
  };

  const result = await generateNotes(pluginConfig, context);
  t.is(result, "Release note");
});
