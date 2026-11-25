// Launches the built desktop app under xvfb on CI and captures real screenshots of
// the screens it can reach without signing in. Run: xvfb-run -a bun scripts/capture-ui-screenshots.ts
import { mkdirSync } from "node:fs";
import electronPath from "electron";
import { _electron, type Page } from "playwright-core";

mkdirSync("shots", { recursive: true });

const app = await _electron.launch({
  executablePath: electronPath as unknown as string,
  args: ["--no-sandbox", "--disable-gpu", "."],
  timeout: 120_000,
});

// The app opens a main window (app/index.html) plus small helper windows
// (dynamic island, overlay). Only the main window carries the UI.
const mainWindow = async (): Promise<Page> => {
  for (let i = 0; i < 30; i++) {
    for (const w of app.windows()) {
      const url = w.url();
      console.log("window:", url.slice(0, 120));
      if (url.includes("index.html")) return w;
    }
    await new Promise((r) => setTimeout(r, 2_000));
  }
  return app.firstWindow();
};
const win = await mainWindow();
win.on("console", (m) => console.log("[renderer]", m.type(), m.text().slice(0, 300)));
win.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 300)));
await win.setViewportSize({ width: 1440, height: 900 });
await win.bringToFront().catch(() => {});

// Wait up to 90s for the app UI to mount (body grows beyond the splash markup).
let mounted = false;
for (let i = 0; i < 18; i++) {
  await win.waitForTimeout(5_000);
  const size = await win.evaluate(() => document.body?.innerText?.length ?? 0).catch(() => 0);
  const buttons = await win.getByRole("button").count().catch(() => 0);
  console.log(`t+${(i + 1) * 5}s text=${size} buttons=${buttons} url=${win.url().slice(0, 100)}`);
  if (buttons > 2 || size > 400) {
    mounted = true;
    break;
  }
}
await win.screenshot({ path: "shots/01-first-screen.png" });
console.log("mounted:", mounted);
console.log("body text:", (await win.evaluate(() => document.body?.innerText?.slice(0, 500)).catch(() => "")) as string);

let n = 2;
const snap = async (label: string) => {
  const file = `shots/${String(n).padStart(2, "0")}-${label}.png`;
  n += 1;
  await win.waitForTimeout(2_500);
  await win.screenshot({ path: file });
  console.log("captured", file);
};

for (const label of ["New agent", "Agents", "Chats", "Library", "Workflows", "Skills", "Settings", "Sign in", "Get started", "Continue"]) {
  try {
    const target = win.getByRole("button", { name: new RegExp(`^${label}`, "i") }).first();
    if ((await target.count()) > 0 && (await target.isVisible())) {
      await target.click();
      await snap(label.toLowerCase().replace(/\s+/g, "-"));
    }
  } catch (error) {
    console.log("skip", label, String(error).slice(0, 120));
  }
}
const labels = await win.getByRole("button").allInnerTexts().catch(() => [] as string[]);
console.log("buttons seen:", JSON.stringify(labels.slice(0, 60)));
await snap("final-state");
await app.close();
