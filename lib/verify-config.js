import { isNil, isPlainObject, isString } from "lodash-es";
import AggregateError from "aggregate-error";
import getError from "./get-error.js";

const isNonEmptyString = (value) => isString(value) && value.trim();
const isOptional = (validator) => (value) => isNil(value) || validator(value);
const isCmdWithEnv = (value) =>
  isPlainObject(value) &&
  isNonEmptyString(value.cmd) &&
  isOptional(isObjectOfStrings)(value.env);
const isStringOrCmdWithEnv = (value) =>
  isNonEmptyString(value) || isCmdWithEnv(value);
const isObjectOfStrings = (value) =>
  isPlainObject(value) &&
  Object.values(value).every((element) => isString(element));

const VALIDATORS = {
  cmd: isStringOrCmdWithEnv,
  shell: isOptional((shell) => shell === true || isNonEmptyString(shell)),
  execCwd: isOptional(isNonEmptyString),
};

export default function verifyConfig(
  cmdProp,
  { shell, execCwd, ...pluginConfig },
) {
  const cmd = pluginConfig[cmdProp]
    ? cmdProp
    : pluginConfig.cmd
      ? "cmd"
      : cmdProp;

  const errors = Object.entries({
    shell,
    execCwd,
    cmd: pluginConfig[cmd],
  }).reduce(
    (errors, [option, value]) =>
      VALIDATORS[option](value)
        ? errors
        : [
            ...errors,
            getError(`EINVALID${option.toUpperCase()}`, {
              [option]: value,
              cmdProp,
            }),
          ],
    [],
  );

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
}
