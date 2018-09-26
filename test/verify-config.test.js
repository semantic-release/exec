import test from 'ava';
import verify from '../lib/verify-config';

test('Verify "cmd" and "shell" options', t => {
  t.notThrows(() => verify('verifyConditionsCmd', {verifyConditionsCmd: 'shell cmd'}));
  t.notThrows(() => verify('analyzeCommitsCmd', {analyzeCommitsCmd: 'shell cmd'}));
  t.notThrows(() => verify('verifyReleaseCmd', {verifyReleaseCmd: 'shell cmd'}));
  t.notThrows(() => verify('generateNotesCmd', {generateNotesCmd: 'shell cmd'}));
  t.notThrows(() => verify('prepareCmd', {prepareCmd: 'shell cmd'}));
  t.notThrows(() => verify('publishCmd', {publishCmd: 'shell cmd'}));
  t.notThrows(() => verify('successCmd', {successCmd: 'shell cmd'}));
  t.notThrows(() => verify('failCmd', {failCmd: 'shell cmd'}));

  t.notThrows(() => verify('verifyConditionsCmd', {cmd: 'shell cmd'}));

  t.notThrows(() => verify('verifyConditionsCmd', {cmd: 'shell cmd', shell: true}));
  t.notThrows(() => verify('verifyConditionsCmd', {cmd: 'shell cmd', shell: 'bash'}));
});

test('Throw SemanticReleaseError if "cmd" option is missing', t => {
  const [error] = t.throws(() => verify('verifyConditionsCmd', {}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test('Throw SemanticReleaseError if "cmd" option is not a String', t => {
  let [error] = t.throws(() => verify('verifyConditionsCmd', {verifyConditionsCmd: 1}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('analyzeCommitsCmd', {analyzeCommitsCmd: 1}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('verifyReleaseCmd', {verifyReleaseCmd: 1}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('generateNotesCmd', {generateNotesCmd: 1}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('prepareCmd', {prepareCmd: 1}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('publishCmd', {publishCmd: 1}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('successCmd', {successCmd: 1}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('failCmd', {failCmd: 1}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('verifyConditionsCmd', {cmd: 1}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test('Throw SemanticReleaseError if "cmd" option is an empty String', t => {
  let [error] = t.throws(() => verify('verifyConditionsCmd', {verifyConditionsCmd: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('analyzeCommitsCmd', {analyzeCommitsCmd: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('verifyReleaseCmd', {verifyReleaseCmd: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('generateNotesCmd', {generateNotesCmd: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('prepareCmd', {prepareCmd: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('publishCmd', {publishCmd: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('successCmd', {successCmd: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('failCmd', {failCmd: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');

  [error] = t.throws(() => verify('verifyConditionsCmd', {cmd: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCMD');
});

test('Throw SemanticReleaseError if "shell" option is not a String or "true"', t => {
  const [error] = t.throws(() => verify('verifyConditionsCmd', {shell: false}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDSHELL');
});

test('Throw SemanticReleaseError if "shell" option is an empty String', t => {
  const [error] = t.throws(() => verify('verifyConditionsCmd', {shell: '    '}));
  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDSHELL');
});

test('Return SemanticReleaseError Array if multiple config are invalid', t => {
  const [error1, error2] = t.throws(() => verify('verifyConditionsCmd', {verifyConditionsCmd: 1, shell: false}));

  t.is(error1.name, 'SemanticReleaseError');
  t.is(error1.code, 'EINVALIDSHELL');

  t.is(error2.name, 'SemanticReleaseError');
  t.is(error2.code, 'EINVALIDCMD');
});
