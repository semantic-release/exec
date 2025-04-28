import test from "ava";
import {
  verifyConditions,
  analyzeCommits,
  verifyRelease,
  generateNotes,
  prepare,
  publish,
  addChannel,
  success,
  fail,
} from "../index.js";

test('Skip step if neither "cmd" nor step cmd is defined', async (t) => {
  await t.notThrowsAsync(verifyConditions({}, {}));
  await t.notThrowsAsync(analyzeCommits({}, {}));
  await t.notThrowsAsync(verifyRelease({}, {}));
  await t.notThrowsAsync(generateNotes({}, {}));
  await t.notThrowsAsync(prepare({}, {}));
  await t.notThrowsAsync(publish({}, {}));
  await t.notThrowsAsync(addChannel({}, {}));
  await t.notThrowsAsync(success({}, {}));
  await t.notThrowsAsync(fail({}, {}));
});

const assertReferenceError = test.macro(async (t, fn) => {
  const err = await t.throwsAsync(fn({ cmd: "echo ${iDont.exist}" }, {}));
  t.regex(err.message, /iDont is not defined/);
});

test(
  "Throws a useful error for bad interpolation in verifyConditions",
  assertReferenceError,
  verifyConditions,
);

test(
  "Throws a useful error for bad interpolation in verifyRelease",
  assertReferenceError,
  verifyRelease,
);
