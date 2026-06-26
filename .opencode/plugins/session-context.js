import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function resolveFrontendRoot(worktree) {
  const webSrcPath = path.join(worktree, "web", "src");

  if (existsSync(webSrcPath)) {
    return {
      absolutePath: webSrcPath,
      relativePath: path.join("web", "src"),
    };
  }

  return {
    absolutePath: path.join(worktree, "src"),
    relativePath: "src",
  };
}

function getGitBranch(worktree) {
  const result = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: worktree,
    encoding: "utf8",
  });

  return result.status === 0 && result.stdout
    ? result.stdout.trim()
    : "unknown";
}

function countLines(filePath) {
  const content = readFileSync(filePath, "utf8");
  if (content.length === 0) {
    return 0;
  }

  return content.split(/\r?\n/).length;
}

function getRequirementsStatus(worktree) {
  const requirementsPath = path.join(worktree, "REQUIREMENTS.md");
  if (!existsSync(requirementsPath)) {
    return "⏳ brak — to normalne na starcie; plik ma powstać w /discovery przed /plan-app i /build-app";
  }

  const lineCount = countLines(requirementsPath);
  if (lineCount > 20) {
    return `✅ wypełniony (${lineCount} linii)`;
  }

  return `⚠️ istnieje ale prawdopodobnie pusty (${lineCount} linii)`;
}

function getSpecStatus(frontendRoot) {
  const requiredSpec = [
    "pages.md",
    "sections.md",
    "design-tokens.md",
    "i18n.md",
    "routing.md",
    "components.md",
  ];

  const present = [];
  const missing = [];

  for (const fileName of requiredSpec) {
    const specPath = path.join(frontendRoot.absolutePath, "spec", fileName);
    if (existsSync(specPath)) {
      present.push(`✅ ${fileName}`);
    } else {
      missing.push(`❌ ${fileName}`);
    }
  }

  let summary;
  if (missing.length === 0) {
    summary = "✅ kompletna (6/6 plików)";
  } else if (present.length === 0) {
    summary = "⚪ brak — powstanie w /build-app po /discovery i /plan-app";
  } else {
    summary = `⏳ niepełna (${present.length}/6)`;
  }

  return { summary, present, missing };
}

function buildAdditionalContext(worktree) {
  const frontendRoot = resolveFrontendRoot(worktree);
  const branch = getGitBranch(worktree);
  const requirementsStatus = getRequirementsStatus(worktree);
  const specStatus = getSpecStatus(frontendRoot);
  const routerPath = path.join(frontendRoot.absolutePath, "router", "index.tsx");
  const legacyViteStyles = [
    path.join(frontendRoot.absolutePath, "App.tsx"),
    path.join(frontendRoot.absolutePath, "App.css"),
    path.join(frontendRoot.absolutePath, "index.css"),
  ].filter(existsSync);

  const lines = [
    "[PROJEKT STATE]",
    `Gałąź: ${branch}`,
    `REQUIREMENTS.md: ${requirementsStatus}`,
    `${frontendRoot.relativePath}/spec/: ${specStatus.summary}`,
  ];

  if (specStatus.present.length > 0 && specStatus.missing.length > 0) {
    lines.push(`  Gotowe: ${specStatus.present.join(", ")}`);
    lines.push(`  Brakuje: ${specStatus.missing.join(", ")}`);
  }

  if (existsSync(routerPath)) {
    lines.push(`Router: ✅ ${frontendRoot.relativePath}/router/index.tsx istnieje`);
  } else {
    lines.push(
      `Router: ❌ ${frontendRoot.relativePath}/router/ nie istnieje — utwórz przed implementacją stron`,
    );
  }

  if (existsSync(path.join(worktree, "server", "src"))) {
    lines.push("Backend: ✅ server/src istnieje");
  }

  if (legacyViteStyles.length > 0) {
    lines.push(
      `Legacy scaffold: ⚠️ usuń pozostałości Vite w ${frontendRoot.relativePath} (${legacyViteStyles
        .map((filePath) => path.basename(filePath))
        .join(", ")})`,
    );
  }

  return lines.join("\n");
}

export const SessionContextPlugin = async ({ worktree, client }) => {
  return {
    event: async ({ event }) => {
      if (event.type !== "session.created") {
        return;
      }

      if (event.properties.info.parentID) {
        return;
      }

      const additionalContext = buildAdditionalContext(worktree);
      if (!additionalContext) {
        return;
      }

      await client.tui.publish({
        body: {
          type: "tui.prompt.append",
          properties: {
            text: `${additionalContext}\n\n`,
          },
        },
        query: {
          directory: worktree,
        },
      });
    },
  };
};
