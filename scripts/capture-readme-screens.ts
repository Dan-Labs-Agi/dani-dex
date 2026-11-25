// Captures real screenshots of every reachable screen for the README, at 1600x900.
//
// Phase A (SIGNIN=1): launches the packaged-style app against the live account service
//   and captures the clean sign-in screen.
// Phase B (default): attaches over CDP to the seeded dev stack (bun run dev) and walks
//   every screen. Run after the dev stack is up: bun scripts/capture-readme-screens.ts
// Phase C (FRESH=1): launches the app on a fresh profile against the local dev API for
//   the first-run setup screen.
import { mkdirSync, writeFileSync } from "node:fs";
import electronPath from "electron";
import { _electron, chromium, type Page } from "playwright-core";

mkdirSync("shots", { recursive: true });
const WIDTH = 1600;
const HEIGHT = 900;

const dump = async (page: Page, name: string) => {
  const text = await page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
  writeFileSync(`shots/${name}.txt`, text.slice(0, 3000));
  const buttons = await page.getByRole("button").allInnerTexts().catch(() => [] as string[]);
  writeFileSync(`shots/${name}.buttons.txt`, JSON.stringify(buttons.slice(0, 80), null, 1));
};

// Wait until the renderer has actually painted: the DOM can hold the full UI while the
// window still shows only the backdrop. Two animation frames plus settle time.
const paint = async (page: Page, settleMs: number) => {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve(null)))),
  ).catch(() => {});
  await page.waitForTimeout(settleMs);
};

const shot = async (page: Page, name: string, settleMs = 2_000) => {
  await paint(page, settleMs);
  await page.screenshot({ path: `shots/${name}.png` });
  await dump(page, name);
  console.log("captured", name);
};

const clickFirst = async (page: Page, names: RegExp[], what: string): Promise<boolean> => {
  for (const name of names) {
    try {
      const target = page.getByRole("button", { name }).first();
      if ((await target.count()) > 0 && (await target.isVisible())) {
        await target.click();
        return true;
      }
    } catch {}
    try {
      const item = page.getByRole("listitem", { name }).first();
      if ((await item.count()) > 0 && (await item.isVisible())) {
        await item.click();
        return true;
      }
    } catch {}
  }
  console.log("MISS", what, names.map(String).join(" | "));
  return false;
};

async function launchApp(env: NodeJS.ProcessEnv, extraArgs: string[] = []) {
  const app = await _electron.launch({
    executablePath: electronPath as unknown as string,
    args: ["--no-sandbox", "--disable-gpu", ...extraArgs, "."],
    env: { ...process.env, ...env } as Record<string, string>,
    timeout: 120_000,
  });
  let page: Page | null = null;
  for (let i = 0; i < 30 && !page; i++) {
    for (const w of app.windows()) if (!w.url().startsWith("devtools://") && !w.url().includes("helper.html")) page = w;
    if (!page) await new Promise((r) => setTimeout(r, 2_000));
  }
  page ??= await app.firstWindow();
  page.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 200)));
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });
  return { app, page };
}

if (process.env.SIGNIN === "1") {
  // Clean sign-in screen on the live account service.
  const { app, page } = await launchApp({ OPENBOT_AUTH_API_URL: "https://auth.dani.danlab.dev" });
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(3_000);
    const text = await page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
    if (text.includes("Sign in")) break;
  }
  await shot(page, "01-sign-in", 6_000);
  await app.close();
  process.exit(0);
}

if (process.env.FRESH === "1") {
  // First-run setup on a fresh profile against the local dev API.
  const { app, page } = await launchApp({
    OPENBOT_AUTH_API_URL: process.env.OPENBOT_AUTH_API_URL ?? "http://127.0.0.1:3100",
    OPENBOT_DEV_INSTANCE_ID: `readme-fresh-${Date.now()}`,
  });
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(3_000);
    const text = await page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
    if (text.length > 50) break;
  }
  await shot(page, "02-first-run-setup", 6_000);
  await app.close();
  process.exit(0);
}

// Phase B: attach to the running dev stack.
const debugPort = process.env.OPENBOT_DEV_REMOTE_DEBUGGING_PORT ?? "9333";
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${debugPort}`);
const contexts = browser.contexts();
console.log("contexts:", contexts.length);
let page: Page | undefined;
let island: Page | undefined;
for (const ctx of contexts) {
  for (const p of ctx.pages()) {
    console.log("page:", p.url().slice(0, 120));
    if (p.url().includes("helper.html")) island = p;
    else if (!p.url().startsWith("devtools://")) page = p;
  }
}
if (!page) throw new Error("main page not found over CDP");
await page.setViewportSize({ width: WIDTH, height: HEIGHT });

// Wait for the seeded, signed-in home screen.
let ready = false;
for (let i = 0; i < 120; i++) {
  await page.waitForTimeout(5_000);
  const text = await page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
  if (/agents|new agent|chief|research/i.test(text) && !/sign in/i.test(text)) {
    ready = true;
    break;
  }
}
console.log("ready:", ready);
await shot(page, "00-home-raw", 500);

// 03 agent list + direct chat
await clickFirst(page, [/^Agents$/], "agents rail");
await clickFirst(page, [/chief/i, /research/i, /launch/i], "seeded agent");
await shot(page, "03-agent-list-chat", 3_000);

// 04 group/channel chat
await clickFirst(page, [/Agents$/], "agents rail back");
await clickFirst(page, [/standup/i, /group/i, /channel/i, /team/i], "group chat");
await shot(page, "04-group-channel-chat", 2_500);

// 05 model picker (open the composer model menu on a chat)
await clickFirst(page, [/chief/i, /research/i], "agent for model picker");
await page.waitForTimeout(2_000);
const modelOpened = await clickFirst(page, [/claude|sonnet|opus|gpt|kilo|model/i], "model picker");
await shot(page, "05-model-picker", 1_500);
if (modelOpened) await page.keyboard.press("Escape");

// 06 computer use panel
await clickFirst(page, [/computer/i], "computer panel");
await shot(page, "06-computer-use", 1_500);
await page.keyboard.press("Escape");

// 07 browser pane
await clickFirst(page, [/browser/i], "browser pane");
await shot(page, "07-browser-pane", 1_500);
await page.keyboard.press("Escape");

// 08 global search
await page.keyboard.press("Control+k");
await shot(page, "08-global-search", 1_200);
await page.keyboard.press("Escape");

// Rail pages
for (const [name, labels] of [
  ["09-tasks", [/^Tasks$/]],
  ["10-schedule", [/^Schedule$/]],
  ["11-workflows", [/^Workflows$/]],
  ["12-library", [/^Library$/]],
  ["13-usage", [/^Usage/]],
  ["14-marketplace", [/^Marketplace$/]],
  ["16-providers", [/^Providers$/]],
  ["20-crm", [/^CRM$/]],
] as const) {
  await clickFirst(page, [...labels], name);
  await shot(page, name, 2_500);
}

// 15 vault/keys: look under Settings and the Providers page
await clickFirst(page, [/^Settings/], "settings");
await page.waitForTimeout(2_000);
await clickFirst(page, [/vault|keys/i, /Profile$/], "vault section");
await shot(page, "15-vault", 1_500);

// 17 settings pages: every visible tab
const settingsTabs = [
  "General", "Appearance", "Notifications", "Voice", "Keyboard", "Profile", "Billing",
  "Invite friends", "Mobile Connect", "App behavior", "Dynamic Island", "Agent dock",
  "Computer Use", "Updates",
];
let tabIndex = 0;
for (const tab of settingsTabs) {
  tabIndex += 1;
  const clicked = await clickFirst(page, [new RegExp(`^${tab}$`)], `settings ${tab}`);
  if (clicked) await shot(page, `17-settings-${String(tabIndex).padStart(2, "0")}-${tab.toLowerCase().replace(/\s+/g, "-")}`, 1_500);
}
await page.keyboard.press("Escape");

// 18 agent templates / team
await clickFirst(page, [/^Agents$/], "agents for templates");
await clickFirst(page, [/new agent/i, /template/i], "agent templates");
await shot(page, "18-agent-templates", 1_500);
await page.keyboard.press("Escape");

// 19 add server dialog
await clickFirst(page, [/this computer|server/i], "server switcher");
await clickFirst(page, [/add server/i, /connect.*server/i], "add server");
await shot(page, "19-add-server", 1_500);
await page.keyboard.press("Escape");

// 21 dynamic island window
if (island) {
  await island.screenshot({ path: "shots/21-dynamic-island.png" });
  console.log("captured 21-dynamic-island");
} else {
  console.log("MISS dynamic island window");
}

await browser.close();
console.log("DONE");
