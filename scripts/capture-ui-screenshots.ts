// Launches the built desktop app under xvfb on CI and captures real screenshots of
// the screens it can reach without signing in. Run: xvfb-run -a bun scripts/capture-ui-screenshots.ts
import { mkdirSync } from "node:fs";
import electronPath from "electron";
import { _electron } from "playwright-core";

mkdirSync("shots", { recursive: true });

const app = await _electron.launch({
  executablePath: electronPath as unknown as string,
  args: ["--no-sandbox", "--disable-gpu", "."],
  timeout: 120_000,
});
const win = await app.firstWindow();
await win.setViewportSize({ width: 1440, height: 900 });
await win.waitForLoadState("domcontentloaded");
await win.waitForTimeout(12_000);
await win.screenshot({ path: "shots/01-first-screen.png" });

let n = 2;
const snap = async (label: string) => {
  const file = `shots/${String(n).padStart(2, "0")}-${label}.png`;
  n += 1;
  await win.waitForTimeout(2_500);
  await win.screenshot({ path: file });
  console.log("captured", file);
};

// Reach every named screen the sidebar/header offers without any account.
for (const label of ["New agent", "Agents", "Chats", "Library", "Workflows", "Skills", "Settings"]) {
  try {
    const target = win
      .getByRole("button", { name: new RegExp(`^${label}`, "i") })
      .first();
    if ((await target.count()) > 0 && (await target.isVisible())) {
      await target.click();
      await snap(label.toLowerCase().replace(/\s+/g, "-"));
    }
  } catch (error) {
    console.log("skip", label, String(error).slice(0, 120));
  }
}

// Record what the window actually contains so missed screens are diagnosable.
const labels = await win
  .getByRole("button")
  .allInnerTexts()
  .catch(() => [] as string[]);
console.log("buttons seen:", JSON.stringify(labels.slice(0, 60)));
await snap("final-state");
await app.close();
