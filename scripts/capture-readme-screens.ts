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

// Phase B: launch the app directly against the seeded dev API (bun run dev:api).
// The dev-services app service exits on the free runner, so the script drives its own
// electron instance, the same way the sign-in and first-run phases do. This launch
// opens the shared seeded profile, then drives the launch gates (language step, dev
// sign-in) itself: the dev API returns a developmentCode on the sign-in response,
// which this script captures from the app's own network traffic.
const { app, page } = await launchApp({
  OPENBOT_AUTH_API_URL: process.env.OPENBOT_AUTH_API_URL ?? "http://127.0.0.1:3100",
});
let island: Page | undefined;
for (const w of app.windows()) {
  if (w.url().includes("helper.html")) island = w;
}

let devCode: string | undefined;
page.on("response", async (res) => {
  try {
    const body = await res.json();
    if (body && typeof body.developmentCode === "string") devCode = body.developmentCode;
  } catch {}
});

// Wait for the seeded, signed-in home screen, driving each gate the app shows.
let ready = false;
let signInRequested = false;
for (let i = 0; i < 120 && !ready; i++) {
  await page.waitForTimeout(5_000);
  const text = await page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
  if (i % 6 === 0) console.log("gate", i, JSON.stringify(text.slice(0, 120)));
  if (/agents|new agent|chief|research/i.test(text) && !/sign in/i.test(text)) {
    ready = true;
    break;
  }
  if (/choose your language/i.test(text)) {
    await clickFirst(page, [/^Continue$/, /continue/i], "language continue");
    continue;
  }
  if (/sign in|one-time code|email/i.test(text)) {
    if (!signInRequested) {
      const email = page
        .locator('input[type="email"], input[name="email"], input[placeholder*="@"]')
        .first();
      if ((await email.count()) > 0) {
        await email.fill("openbot-dev-host@example.com");
        signInRequested = true;
        await clickFirst(page, [/send sign-in code/i, /send code/i, /^Continue$/], "send code");
      }
    } else {
      // The dev build prints the one-time code on the page itself. The 8-box
      // widget auto-advances while typing, so type the characters, no dash.
      const shown = /Development code:\s*([A-Z0-9]{4})-([A-Z0-9]{4})/.exec(text);
      const code = shown ? shown[1] + shown[2] : devCode?.replace(/-/g, "");
      if (code) {
        const box = page.locator('input[maxlength="1"], input[autocomplete="one-time-code"]').first();
        if ((await box.count()) > 0) await box.click().catch(() => {});
        await page.keyboard.type(code, { delay: 60 });
        devCode = undefined;
        await page.waitForTimeout(1_000);
        await clickFirst(page, [/verify/i, /^Continue$/, /sign in/i], "verify code");
      }
    }
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

await app.close();
console.log("DONE");
