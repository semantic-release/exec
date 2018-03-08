# @semantic-release/exec

Set of [semantic-release](https://github.com/semantic-release/semantic-release) plugins to execute custom shell commands.

[![Travis](https://img.shields.io/travis/semantic-release/exec.svg)](https://travis-ci.org/semantic-release/exec)
[![Codecov](https://img.shields.io/codecov/c/github/semantic-release/exec.svg)](https://codecov.io/gh/semantic-release/exec)
[![Greenkeeper badge](https://badges.greenkeeper.io/semantic-release/exec.svg)](https://greenkeeper.io/)

[![npm latest version](https://img.shields.io/npm/v/@semantic-release/exec/latest.svg)](https://www.npmjs.com/package/@semantic-release/exec)
[![npm next version](https://img.shields.io/npm/v/@semantic-release/exec/next.svg)](https://www.npmjs.com/package/@semantic-release/exec)

## verifyConditions

Execute a shell command to verify if the release should happen.

| Command property | Description                                                              |
|------------------|--------------------------------------------------------------------------|
| `exit code`      | `0` if the verification is successful, or any other exit code otherwise. |
| `stdout`         | Write only the reason for the verification to fail.                      |
| `stderr`         | Can be used for logging.                                                 |

## analyzeCommits

Execute a shell command to determine the type release.

| Command property | Description                                                                                                                                                |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `exit code`      | Any non `0` code is considered as an unexpected error and will stop the `semantic-release` execution with an error.                                        |
| `stdout`         | Only the release type (`major`, `minor` or `patch` etc..) can be written to `stdout`. If no release has to be done the command must not write to `stdout`. |
| `stderr`         | Can be used for logging.                                                                                                                                   |

## verifyRelease

Execute a shell command to verifying a release that was determined before and is about to be published.

| Command property | Description                                                              |
|------------------|--------------------------------------------------------------------------|
| `exit code`      | `0` if the verification is successful, or any other exit code otherwise. |
| `stdout`         | Only the reason for the verification to fail can be written to `stdout`. |
| `stderr`         | Can be used for logging.                                                 |

## generateNotes

Execute a shell command to generate the release note.

| Command property | Description                                                                                                         |
|------------------|---------------------------------------------------------------------------------------------------------------------|
| `exit code`      | Any non `0` code is considered as an unexpected error and will stop the `semantic-release` execution with an error. |
| `stdout`         | Only the release note must be written to `stdout`.                                                                  |
| `stderr`         | Can be used for logging.                                                                                            |

## prepare

Execute a shell command to prepare the release.

| Command property | Description                                                                                                         |
|------------------|---------------------------------------------------------------------------------------------------------------------|
| `exit code`      | Any non `0` code is considered as an unexpected error and will stop the `semantic-release` execution with an error. |
| `stdout`         | Can be used for logging.                                                                                            |
| `stderr`         | Can be used for logging.                                                                                            |

## publish

Execute a shell command to publish the release.

| Command property | Description                                                                                                                                                                                                                                        |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `exit code`      | Any non `0` code is considered as an unexpected error and will stop the `semantic-release` execution with an error.                                                                                                                                |
| `stdout`         | The `release` information can be written to `stdout` as parseable JSON (for example `{"name": "Release name", "url": "http://url/release/1.0.0"}`). If the command write non parseable JSON to `stdout` no `release` information will be returned. |
| `stderr`         | Can be used for logging.                                                                                                                                                                                                                           |

## success

Execute a shell command to notify of a successful release.

| Command property | Description                                                                                                         |
|------------------|---------------------------------------------------------------------------------------------------------------------|
| `exit code`      | Any non `0` code is considered as an unexpected error and will stop the `semantic-release` execution with an error. |
| `stdout`         | Can be used for logging.                                                                                            |
| `stderr`         | Can be used for logging.                                                                                            |

## fail

Execute a shell command to notify of a failed release.

| Command property | Description                                                                                                         |
|------------------|---------------------------------------------------------------------------------------------------------------------|
| `exit code`      | Any non `0` code is considered as an unexpected error and will stop the `semantic-release` execution with an error. |
| `stdout`         | Can be used for logging.                                                                                            |
| `stderr`         | Can be used for logging.                                                                                            |

## Configuration

### Options

| Options | Description                                    |
|---------|------------------------------------------------|
| `cmd`   | The shell command to execute. See [cmd](#cmd). |

#### `cmd`

The shell command is generated with [Lodash template](https://lodash.com/docs#template). All the objets passed to the [semantic-release plugins](https://github.com/semantic-release/semantic-release#plugins) are available as template options.

##### `cmd` examples

```json
{
  "release": {
    "publish": [
      {
        "path": "@semantic-release/exec",
        "cmd": "./publish.sh ${nextRelease.version} ${options.branch} ${commits.length} ${Date.now()}",
      },
      "@semantic-release/npm",
      "@semantic-release/github"
    ]
  }
}
```

This will execute the shell command `./publish.sh 1.0.0 master 3 870668040000` (for the release of version `1.0.0` from branch `master` with `3` commits on `August 4th, 1997 at 2:14 AM`).

### Usage

Options can be set within the plugin definition in the `semantic-release` configuration file:

```json
{
  "release": {
    "verifyConditions": [
      "@semantic-release/npm",
      {
        "path": "@semantic-release/exec",
        "cmd": "./verify.sh",
      }
    ],
    "publish": [
      "@semantic-release/npm",
      {
        "path": "@semantic-release/exec",
        "cmd": "./publish.sh ${nextRelease.version}",
      },
      "@semantic-release/github"
    ]
  }
}
```
