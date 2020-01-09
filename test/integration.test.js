import test from 'ava';
import m from '..';

test('Skip step if neither "cmd" nor step cmd is defined', async t => {
  await t.notThrowsAsync(m.verifyConditions({}, {}));
  await t.notThrowsAsync(m.analyzeCommits({}, {}));
  await t.notThrowsAsync(m.verifyRelease({}, {}));
  await t.notThrowsAsync(m.generateNotes({}, {}));
  await t.notThrowsAsync(m.prepare({}, {}));
  await t.notThrowsAsync(m.publish({}, {}));
  await t.notThrowsAsync(m.addChannel({}, {}));
  await t.notThrowsAsync(m.success({}, {}));
  await t.notThrowsAsync(m.fail({}, {}));
});
