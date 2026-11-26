// Launches the installed Mac app, walks the onboarding screens through the app window and saves a real screenshot of each.
import { chromium } from "playwright-core";
import { spawn, execSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";

const app = process.argv[2];
const dataDir = "/tmp/ob-data";
mkdirSync("shots", { recursive: true });
const child = spawn(`${app}/Contents/MacOS/dani-dex`, [`--user-data-dir=${dataDir}`, "--remote-debugging-port=9333", "--use-mock-keychain", "--no-sandbox"], { stdio: "ignore", detached: true });
child.unref();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let browser;
for (let i = 0; i < 40 && !browser; i++) {
  await sleep(2000);
  try { browser = await chromium.connectOverCDP("http://127.0.0.1:9333"); } catch {}
}
if (!browser) throw new Error("could not attach");
const findMain = async () => {
  for (let i = 0; i < 30; i++) {
    for (const ctx of browser.contexts()) for (const p of ctx.pages()) {
      console.log("page:", p.url().slice(0, 140));
      if (/index\.html|^openbot-app:\/\/app\/(?!helper)/.test(p.url())) return p;
    }
    await sleep(2000);
  }
  throw new Error("no main window");
};
const win = await findMain();
await win.setViewportSize({ width: 1280, height: 800 }).catch(() => {});
await sleep(8000);
const log = [];
const next = /^(continue|next|get started|start|allow|skip|skip for now|done|finish|let'?s go|i agree|accept|ok|got it|enable|maybe later)\b/i;
let last = "";
for (let n = 1; n <= 30; n++) {
  await sleep(2500);
  const nn = String(n).padStart(2, "0");
  const text = (await win.evaluate(() => document.body?.innerText ?? "").catch(() => "")).trim();
  const buttons = await win.getByRole("button").allInnerTexts().catch(() => []);
  await win.screenshot({ path: `shots/${nn}-window.png` });
  try { execSync(`screencapture -x shots/${nn}-screen.png`); } catch {}
  log.push({ step: nn, text: text.slice(0, 400), buttons: buttons.map((b) => b.trim()).filter(Boolean).slice(0, 20) });
  console.log(nn, JSON.stringify(log[log.length - 1]));
  writeFileSync("shots/walk.json", JSON.stringify(log, null, 1));
  const sig = text + buttons.join("|");
  if (sig === last) { console.log("no change, stopping"); break; }
  last = sig;
  let clicked = false;
  for (const b of await win.getByRole("button").all()) {
    const t = ((await b.innerText().catch(() => "")) || "").trim();
    if (next.test(t) && (await b.isVisible().catch(() => false)) && (await b.isEnabled().catch(() => false))) {
      console.log("click:", t);
      await b.click({ timeout: 5000 }).catch((e) => console.log("click failed", String(e).slice(0, 100)));
      clicked = true;
      break;
    }
  }
  if (!clicked) { console.log("no forward button, stopping"); break; }
}
try { process.kill(-child.pid); } catch {}
process.exit(0);
