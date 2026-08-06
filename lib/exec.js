import { resolve } from "path";
import { template, isNil, isPlainObject, isString } from "lodash-es";
import { execa } from "execa";

export default async function exec(
  cmdProp,
  { shell, execCwd, ...config },
  { cwd, env, stdout, stderr, logger, ...context },
) {
  const cmd = config[cmdProp] ? cmdProp : "cmd";

  const cmdParsed = parseCommand(config[cmd]);
  const script = template(cmdParsed.cmd)({ config, ...context });

  const envInterpolated = {
    ...env,
    ...Object.entries(cmdParsed.env).reduce((acc, [key, value]) => {
      acc[key] = template(value)({ config, ...context });
      return acc;
    }, {}),
  };

  logger.log("Call script %s", script);

  const result = execa(script, {
    shell: shell || true,
    cwd: execCwd ? resolve(cwd, execCwd) : cwd,
    env: envInterpolated,
  });

  result.stdout.pipe(stdout, { end: false });
  result.stderr.pipe(stderr, { end: false });

  return (await result).stdout.trim();
}

function parseCommand(cmd) {
  if (isString(cmd)) {
    return { cmd, env: {} };
  } else if (isPlainObject(cmd) && !isNil(cmd.cmd)) {
    return { cmd: cmd.cmd, env: cmd.env || {} };
  }
}
