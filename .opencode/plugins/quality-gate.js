import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const PNPM_EXECUTABLE = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function extractPatchedFiles(patchText, worktree) {
  if (!patchText) {
    return [];
  }

  const files = new Set();
  const lines = String(patchText).split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/);
    if (match) {
      files.add(path.join(worktree, match[1].trim()));
      continue;
    }

    const moveMatch = line.match(/^\*\*\* Move to: (.+)$/);
    if (moveMatch) {
      files.add(path.join(worktree, moveMatch[1].trim()));
    }
  }

  return [...files];
}

function normalizeCandidateFiles(input, worktree) {
  const args = input?.args ?? {};

  if (typeof args.filePath === "string") {
    return [args.filePath];
  }

  if (input.tool === "apply_patch") {
    return extractPatchedFiles(args.patchText, worktree);
  }

  return [];
}

function shouldLint(filePath) {
  if (!filePath) {
    return false;
  }

  if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) {
    return false;
  }

  if (
    filePath.includes("node_modules") ||
    filePath.includes(`${path.sep}src${path.sep}spec${path.sep}`) ||
    filePath.endsWith(".d.ts") ||
    filePath.includes("PageContainers")
  ) {
    return false;
  }

  return existsSync(filePath);
}

function buildPnpmEnv(worktree) {
  const fallbackTmpDir = process.env.HOME
    ? path.join(process.env.HOME, "tmp")
    : path.join(worktree, ".tmp");

  const tmpDir =
    process.env.TMPDIR || process.env.TEMP || process.env.TMP || fallbackTmpDir;

  mkdirSync(tmpDir, { recursive: true });

  return {
    ...process.env,
    TMPDIR: tmpDir,
    TEMP: tmpDir,
    TMP: tmpDir,
  };
}

function runEslint(worktree, filePath) {
  return spawnSync(
    PNPM_EXECUTABLE,
    ["exec", "eslint", filePath, "--format=compact", "--max-warnings", "0"],
    {
      cwd: worktree,
      encoding: "utf8",
      env: buildPnpmEnv(worktree),
    },
  );
}

function buildLintFailure(filePath, result) {
  if (result.error) {
    return result.error.message;
  }

  const output = [result.stdout, result.stderr]
    .filter(Boolean)
    .join("\n")
    .trim();
  if (!output) {
    return null;
  }

  if (!/[0-9]+ (error|warning)/.test(output)) {
    return result.status && result.status !== 0 ? output : null;
  }

  const errors = output
    .split(/\r?\n/)
    .filter((line) => /(error|warning)/.test(line))
    .slice(0, 20)
    .join("\n");

  if (!errors) {
    return null;
  }

  return `ESLint znalazł problemy w ${filePath} — napraw przed kontynuowaniem:\n${errors}`;
}

export const QualityGatePlugin = async ({ worktree }) => {
  return {
    "tool.execute.after": async (input) => {
      const candidateFiles = normalizeCandidateFiles(input, worktree).map(
        (filePath) =>
          path.isAbsolute(filePath) ? filePath : path.join(worktree, filePath),
      );

      const lintableFiles = [...new Set(candidateFiles)].filter(shouldLint);

      const failures = [];

      for (const filePath of lintableFiles) {
        const result = runEslint(worktree, filePath);
        const failure = buildLintFailure(filePath, result);

        if (failure) {
          failures.push(failure);
        }
      }

      if (failures.length > 0) {
        throw new Error(failures.join("\n\n"));
      }
    },
  };
};
