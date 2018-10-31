import test from 'ava';
import m from '..';

test('Skip step if neither "cmd" nor step cmd is defined', async t => {
  await t.notThrows(m.verifyConditions({}, {}));
  await t.notThrows(m.analyzeCommits({}, {}));
  await t.notThrows(m.verifyRelease({}, {}));
  await t.notThrows(m.generateNotes({}, {}));
  await t.notThrows(m.prepare({}, {}));
  await t.notThrows(m.publish({}, {}));
  await t.notThrows(m.addChannel({}, {}));
  await t.notThrows(m.success({}, {}));
  await t.notThrows(m.fail({}, {}));
});
