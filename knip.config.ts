import type { KnipConfig } from "knip";

const CSS_IMPORT = /@import\s+["']([^"']+)["']/g;

function compileCss(text: string): string {
  return [...text.matchAll(CSS_IMPORT)].map(([, specifier]) => `import "${specifier}";`).join("\n");
}

const config: KnipConfig = {
  compilers: { css: compileCss },
  ignoreIssues: {
    "packages/contracts/src/team-protocol/v*.ts": ["exports", "types"],
    "packages/contracts/src/team-protocol/*-v*.ts": ["exports", "types"],
    "packages/contracts/src/team-protocol/provider-aware-codec.ts": ["exports", "types"],
    "src/backend/migrations/[0-9]*.ts": ["exports"],
    "apps/auth-api/src/lib/plugin-catalog.generated.ts": ["exports", "types"],
    // Client functions for the account service land before their callers.
    "src/main/dani-account.ts": ["exports"],
    "apps/dani-account/src/remote.ts": ["exports"],
    "package.json": ["catalog"],
  },
  ignoreBinaries: [
    "xterm",
    "ssh-keygen",
    "ssh-keyscan",
    "ssh-add",
    "cmake",
    "otool",
    "install_name_tool",
    "ldd",
    "taskkill.exe",
    "tasklist",
    "cloudflared",
    "sqlite3",
    "ditto",
    "say",
    "pgrep",
    "screencapture",
    "osascript",
    "mkfifo",
    "browser-harness",
    "vm_stat",
    "dbus-run-session",
    "xcode-select",
    "sips",
    "iconutil",
    "Xvfb",
    "xdpyinfo",
    "openbox",
    "wmctrl",
    "picom",
    "ffmpeg",
    "gdbus",
    "import",
  ],
  workspaces: {
    ".": {
      entry: ["scripts/**/*.ts", "tools/**/*.ts", "src/renderer/stories/prototype-support.tsx"],
      project: ["src/**/*.{ts,tsx,css}", "scripts/**/*.ts", "tools/**/*.ts"],
      ignoreDependencies: [
        "@speed-highlight/core",
        "class-variance-authority",
        "marked",
        "solid-recharts",
        "solid-sonner",
        "@noble/hashes",
        "@cacheable/node-cache",
        "@noble/curves",
        "async-mutex",
        "long",
        "lru-cache",
        "music-metadata",
        "p-queue",
        "pino",
        "protobufjs",
      ],
      ignoreUnresolved: ["scripts/.+\\.ts"],
      storybook: { config: ["config/storybook/main.ts"] },
    },
    "apps/auth-api": {
      entry: ["*.ts", "src/email-relay-entry.ts", "scripts/*.ts"],
      project: ["src/**/*.{ts,tsx,css}", "test/**/*.ts", "scripts/**/*.ts", "*.ts"],
      ignoreDependencies: ["cloudflare"],
    },
    "apps/dani-account": {
      entry: ["scripts/*.ts"],
    },
    "apps/site-router": {
      project: ["src/**/*.ts"],
    },
    "remote/api": {
      entry: ["src/capacity-report.ts"],
      project: ["src/**/*.ts"],
    },
    "packages/i18n": {
      entry: ["src/lazy-catalogs.ts", "src/mobile-catalogs.native.ts"],
      project: ["src/**/*.{ts,tsx,css}"],
    },
    "packages/whatsapp": {
      entry: ["src/*.ts", "scripts/*.ts"],
      project: ["src/**/*.ts", "scripts/*.ts"],
      ignoreDependencies: [
        "@cacheable/node-cache",
        "@hapi/boom",
        "async-mutex",
        "long",
        "lru-cache",
        "music-metadata",
        "p-queue",
        "pino",
        "protobufjs",
        "ws",
        "@types/ws",
      ],
    },
    "packages/*": {
      project: ["src/**/*.{ts,tsx,css}"],
    },
  },
};

export default config;
