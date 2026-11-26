// Real sign-in run: launches the built app against the live account service on a fresh profile,
// walks onboarding and the sign-in options, clicks Google, hands the Google URL to the handoff
// branch, waits for the loopback callback URL to appear there, then captures every screen after
// login. Nothing is seeded: the account and its data come from the live service.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import electronPath from "electron";
import { _electron, type Page } from "playwright-core";

mkdirSync("shots", { recursive: true });
const WIDTH = 1600;
const HEIGHT = 900;
const REPO = process.env.GITHUB_REPOSITORY ?? "Dan-Labs-Agi/dani-dex";
const TOKEN = process.env.GITHUB_TOKEN ?? "";
const HANDOFF = "build/live-handoff";
const remote = `https://x-access-token:${TOKEN}@github.com/${REPO}.git`;
let counter = 0;

const paint = async (page: Page, settleMs: number) => {
  await page
    .evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null)))))
    .catch(() => {});
  await page.waitForTimeout(settleMs);
};
const shot = async (page: Page, name: string, settleMs = 2_000) => {
  await paint(page, settleMs);
  counter += 1;
  const file = `${String(counter).padStart(2, "0")}-${name}`;
  await page.screenshot({ path: `shots/${file}.png` });
  const text = await page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
  writeFileSync(`shots/${file}.txt`, text.slice(0, 3000));
  console.log("captured", file);
};
const textOf = (page: Page) => page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
const clickFirst = async (page: Page, names: RegExp[], what: string): Promise<boolean> => {
  for (const name of names) {
    for (const role of ["button", "link", "listitem", "tab"] as const) {
      try {
        const t = page.getByRole(role, { name }).first();
        if ((await t.count()) > 0 && (await t.isVisible())) {
          await t.click();
          return true;
        }
      } catch {}
    }
  }
  console.log("MISS", what);
  return false;
};

const app = await _electron.launch({
  executablePath: electronPath as unknown as string,
  args: ["--no-sandbox", "--disable-gpu", "."],
  env: {
    ...process.env,
    PATH: `/tmp/xdgbin:${process.env.PATH}`,
    OPENBOT_AUTH_API_URL: "https://auth.dani.danlab.dev",
    OPENBOT_DEV_INSTANCE_ID: `live-login-${Date.now()}`,
  } as Record<string, string>,
  timeout: 120_000,
});
let page: Page | null = null;
for (let i = 0; i < 30 && !page; i++) {
  for (const w of app.windows()) if (!w.url().startsWith("devtools://") && !w.url().includes("helper.html")) page = w;
  if (!page) await new Promise((r) => setTimeout(r, 2_000));
}
page ??= await app.firstWindow();
await page.setViewportSize({ width: WIDTH, height: HEIGHT });

// Phase 1: onboarding gates until the sign-in screen.
let seen = "";
let onSignIn = false;
for (let i = 0; i < 60 && !onSignIn; i++) {
  await page.waitForTimeout(4_000);
  const text = await textOf(page);
  if (text.length > 20 && text.slice(0, 200) !== seen) {
    seen = text.slice(0, 200);
    await shot(page, "pre-login-screen", 1_000);
  }
  if (/google/i.test(text) && /sign in|email/i.test(text)) {
    onSignIn = true;
    break;
  }
  await clickFirst(page, [/^Continue$/, /^Next$/, /^Get started$/i, /continue/i], "onboarding continue");
}
console.log("on sign-in:", onSignIn);
await shot(page, "sign-in-google-and-email", 2_000);

// Phase 2: email option shown (not submitted), then Google.
const email = page.locator('input[type="email"], input[name="email"], input[placeholder*="@"]').first();
if ((await email.count()) > 0) {
  await email.fill("you@example.com");
  await shot(page, "sign-in-email-option", 800);
  await email.fill("");
}
if (!(await clickFirst(page, [/google/i], "google button"))) throw new Error("No Google button found.");
for (let i = 0; i < 30 && !existsSync("/tmp/auth-url.txt"); i++) await page.waitForTimeout(1_000);
if (!existsSync("/tmp/auth-url.txt")) throw new Error("The app did not open a sign-in URL.");
const authUrl = readFileSync("/tmp/auth-url.txt", "utf8").trim();
await shot(page, "after-google-click-waiting", 1_000);

// Phase 3: hand the URL out through the handoff branch, wait for the loopback callback URL.
const git = (args: string[], cwd: string) => execFileSync("git", args, { cwd, stdio: "pipe" }).toString();
const work = "/tmp/handoff";
spawnSync("rm", ["-rf", work]);
git(["init", "-q", work], ".");
git(["config", "user.name", "somdipto"], work);
git(["config", "user.email", "somdiptonandy@gmail.com"], work);
git(["checkout", "-q", "-b", HANDOFF], work);
writeFileSync(`${work}/auth-url.txt`, `${authUrl}\n`);
git(["add", "."], work);
git(["commit", "-q", "-m", "Add sign-in handoff"], work);
git(["push", "-q", "-f", remote, `${HANDOFF}:${HANDOFF}`], work);
console.log("published sign-in URL to", HANDOFF);

let callback = "";
for (let i = 0; i < 300 && !callback; i++) {
  await page.waitForTimeout(5_000);
  try {
    git(["fetch", "-q", remote, HANDOFF], work);
    callback = git(["show", "FETCH_HEAD:callback.txt"], work).trim();
  } catch {}
}
if (!callback) throw new Error("No callback URL arrived.");
const u = new URL(callback);
if (!["127.0.0.1", "localhost"].includes(u.hostname)) throw new Error("Callback is not loopback.");
const res = await fetch(callback).catch((e) => ({ status: String(e) }) as { status: unknown });
console.log("callback delivered, status", String(res.status));

// Phase 4: every gate after login, then every screen, discovered from the live UI.
const gateButtons = [
  /^Use free models/i,
  /^Continue$/,
  /^Next$/,
  /^Skip/i,
  /^Get started$/i,
  /^Done$/,
  /^Start/i,
  /^Finish/i,
];
let steps = 0;
seen = "";
let mainApp = false;
for (let i = 0; i < 40 && !mainApp; i++) {
  await page.waitForTimeout(3_000);
  const text = await textOf(page);
  const key = text.slice(0, 160);
  if (text.length > 20 && key !== seen) {
    seen = key;
    steps += 1;
    await shot(page, `after-login-step-${String(steps).padStart(2, "0")}`, 1_500);
  }
  const railCount = await page
    .locator("nav button, nav a, [role=navigation] button")
    .count()
    .catch(() => 0);
  if (railCount >= 4) {
    mainApp = true;
    break;
  }
  await clickFirst(page, gateButtons, "gate");
}
console.log("main app:", mainApp);
await shot(page, "main-app", 2_500);

// Walk the rail: click each visible navigation item once and capture its page.
const labels: string[] = await page
  .evaluate(() => {
    const out: string[] = [];
    for (const el of Array.from(
      document.querySelectorAll("nav button, nav a, [role=navigation] button, [role=navigation] a"),
    )) {
      const r = (el as HTMLElement).getBoundingClientRect();
      const name = ((el as HTMLElement).getAttribute("aria-label") || (el as HTMLElement).innerText || "").trim();
      if (r.width > 0 && r.height > 0 && name && name.length < 40 && !out.includes(name)) out.push(name);
    }
    return out;
  })
  .catch(() => []);
writeFileSync("shots/rail-labels.json", JSON.stringify(labels, null, 1));
console.log("rail labels:", JSON.stringify(labels));
let k = 0;
for (const label of labels.slice(0, 30)) {
  k += 1;
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (await clickFirst(page, [new RegExp(`^${esc}$`)], label)) {
    await shot(
      page,
      `page-${String(k).padStart(2, "0")}-${label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 30)}`,
      2_500,
    );
    await page.keyboard.press("Escape").catch(() => {});
  }
}

// Phase 5: character catalogue, Telegram connect and agent settings, from the live UI.
const step = async (label: string, run: () => Promise<void>) => {
  try {
    await run();
  } catch (error) {
    console.log("STEP FAILED", label, String(error).slice(0, 200));
  }
};
const settleKeys = async () => {
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(500);
};
await step("first agent setup", async () => {
  if (await clickFirst(page, [/Create your first agent/i, /New agent/i, /Create agent/i], "create agent")) {
    await shot(page, "first-run-setup", 2_500);
    const faces = page.getByRole("button", { name: /face/i });
    console.log("PICKER OPTIONS", await faces.count());
    const dots = page.getByRole("button", { name: /color|colour/i });
    const nd = await dots.count();
    console.log("COLOUR DOTS", nd);
    for (const i of [1, 4, 7]) {
      if (i < nd) {
        await dots
          .nth(i)
          .click()
          .catch(() => {});
        await shot(page, `colour-dot-${i}`, 1_200);
      }
    }
    const big = page.locator("[data-avatar-seed]").first();
    await big.hover().catch(() => {});
    for (let f = 0; f < 3; f++) await shot(page, `hover-frame-${f + 1}`, 400);
  }
});
await settleKeys();
await step("team starter", async () => {
  const sec = page.locator('section[aria-label="Start with a team"]').first();
  if ((await sec.count()) > 0) {
    await sec.scrollIntoViewIfNeeded().catch(() => {});
    await shot(page, "team-starter-top", 1_500);
    await page.getByText("Life admin crew", { exact: true }).first().scrollIntoViewIfNeeded().catch(() => {});
    await shot(page, "team-starter-life-admin", 1_500);
    await page.getByText("Research crew", { exact: true }).first().scrollIntoViewIfNeeded().catch(() => {});
    await shot(page, "team-starter-research", 1_000);
    await sec.screenshot({ path: "shots/zz-team-starter-section.png" }).catch(() => {});
    console.log("TEAM SECTION", ((await sec.innerText().catch(() => "")) || "").slice(0, 600).replace(/\n/g, " | "));
  } else console.log("MISS team starter section");
});
await settleKeys();
await step("create agent", async () => {
  if (await clickFirst(page, [/^Create agent$/i], "create agent submit")) await shot(page, "agent-created", 5_000);
});
await settleKeys();
const results: Array<Record<string, unknown>> = [];
const errRe = /(error|failed|couldn.t|unable|something went wrong|try again|not found|unavailable)/i;
const readMain = async () => (await page.evaluate(() => document.body?.innerText ?? "").catch(() => "")).slice(0, 1500);
const openSettings2 = async () => {
  await page.keyboard.press("Escape").catch(() => {});
  await page.locator('[aria-label="Settings"]').first().click({ timeout: 4_000 }).catch(() => {});
  await page.waitForTimeout(1_200);
};
const tab = async (label: string) => {
  let ok = await page.getByText(label, { exact: true }).first().click({ timeout: 4_000 }).then(() => true).catch(() => false);
  if (!ok) {
    await openSettings2();
    ok = await page.getByText(label, { exact: true }).first().click({ timeout: 4_000 }).then(() => true).catch(() => false);
  }
  console.log(ok ? "OK tab" : "MISS tab", label);
  return ok;
};
await step("settings voice", async () => {
  await openSettings2();
  if (await tab("Voice")) {
    await shot(page, "voice-top", 2_000);
    for (let k = 0; k < 3; k++) {
      await page.mouse.move(860, 450);
      await page.mouse.wheel(0, 600);
      await shot(page, `voice-scroll-${k + 1}`, 900);
    }
    await page.mouse.move(860, 450);
    await page.mouse.wheel(0, -4000);
    await page.waitForTimeout(500);
    console.log("SELECTS", await page.locator("select").count());
    const opts = await page.evaluate(() => Array.from(document.querySelectorAll("select option")).map((o) => (o as HTMLOptionElement).textContent));
    console.log("SELECT OPTIONS", JSON.stringify(opts).slice(0, 1500));
    await page.getByText(/Parakeet TDT/).first().click({ timeout: 3_000 }).catch(() => console.log("MISS dictation dropdown"));
    await page.waitForTimeout(800);
    await shot(page, "voice-dictation-model-list", 1_200);
    {
      const sc2 = await page.evaluate(() => window.innerWidth / 1429);
      for (let k = 0; k < 3; k++) {
        await page.mouse.move(1146 * sc2, 380 * sc2);
        await page.mouse.wheel(0, 220);
        await shot(page, `voice-dictation-list-scroll-${k + 1}`, 700);
      }
    }
    console.log("DICTATION TEXT", ((await page.evaluate(() => document.body?.innerText ?? "")) || "").slice(0, 1200).replace(/\n/g, " | "));
    await page.keyboard.press("Escape").catch(() => {});
  }
});
await step("settings billing and invite", async () => {
  await openSettings2();
  if (await tab("Billing")) await shot(page, "billing", 3_000);
  if (await tab("Invite friends")) await shot(page, "invite-friends", 3_000);
});
await step("providers and kilo", async () => {
  await page.keyboard.press("Escape").catch(() => {});
  await page.getByRole("button", { name: /^More$/ }).first().click({ timeout: 4_000 }).catch(() => {});
  await page.waitForTimeout(600);
  if (await page.getByText("Providers", { exact: true }).first().click({ timeout: 4_000 }).then(() => true).catch(() => false)) {
    await shot(page, "providers", 2_500);
    if (await page.getByText("KiloCode", { exact: true }).first().click({ timeout: 4_000 }).then(() => true).catch(() => false)) {
      await shot(page, "kilocode-detail", 2_500);
      await page.waitForTimeout(8_000);
      await shot(page, "kilocode-detail-after-wait", 1_000);
      await page.keyboard.press("Escape").catch(() => {});
      await page.getByText("Providers", { exact: true }).first().click({ timeout: 3_000 }).catch(() => {});
      await shot(page, "providers-after", 2_000);
    } else console.log("MISS kilocode row");
  }
});
await step("model picker kilo", async () => {
  await page.keyboard.press("Escape").catch(() => {});
  for (const rail of ["Agents"]) {
    await clickFirst(page, [new RegExp(`^${rail}$`, "i")], rail);
    await page.waitForTimeout(1_500);
  }
  await shot(page, "chat-composer", 2_000);
  if (await clickFirst(page, [/model/i, /kilo/i, /gpt|claude|gemini|sonnet|opus/i], "model picker")) {
    await shot(page, "model-picker", 2_000);
    const search = page.locator('input[placeholder*="earch" i]').first();
    if ((await search.count()) > 0) {
      await search.fill("kilo").catch(() => {});
      await shot(page, "model-picker-kilo-search", 2_000);
      await search.fill("").catch(() => {});
    }
    const sc = await page.evaluate(() => window.innerWidth / 1429);
    await page.mouse.click(1042 * sc, 98 * sc);
    await page.waitForTimeout(1_500);
    await shot(page, "model-picker-kilo-tab", 2_000);
    const s2 = page.locator('input[placeholder*="earch" i]').first();
    if ((await s2.count()) > 0) {
      await s2.fill("kilo").catch(() => {});
      await shot(page, "model-picker-kilo-tab-search", 1_500);
    }
  }
});
await app.close();
