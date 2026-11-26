// Opens the installed Mac app and walks the onboarding screens over the debugging port, saving a real screenshot of each.
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const app = process.argv[2];
mkdirSync("shots", { recursive: true });
execSync(`open -n "${app}" --args --user-data-dir=/tmp/ob-data --remote-debugging-port=9333 --no-sandbox`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let target;
for (let i = 0; i < 60 && !target; i++) {
  await sleep(2000);
  try {
    const t = await (await fetch("http://127.0.0.1:9333/json")).json();
    target = t.find((x) => x.type === "page" && /^openbot-app:\/\/app\/index\.html/.test(x.url));
  } catch {}
}
if (!target) { try { execSync("screencapture -x shots/00-nomain.png"); } catch {} throw new Error("no main window"); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const cdp = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expression) => (await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
await cdp("Page.enable");
await cdp("Page.bringToFront");
await sleep(8000);

const clickJs = `(() => {
  const next = /^(continue|next|get started|start|allow|skip|skip for now|done|finish|let'?s go|i agree|accept|ok|got it|enable|maybe later)\\b/i;
  for (const b of document.querySelectorAll('button,[role=button]')) {
    const t = (b.innerText || '').trim();
    const r = b.getBoundingClientRect();
    if (next.test(t) && r.width > 0 && r.height > 0 && !b.disabled) { b.click(); return t; }
  }
  return null;
})()`;
const log = [];
let last = "";
for (let n = 1; n <= 30; n++) {
  await sleep(2500);
  const nn = String(n).padStart(2, "0");
  const text = ((await evalJs("document.body ? document.body.innerText : ''")) ?? "").trim();
  const buttons = (await evalJs("[...document.querySelectorAll('button,[role=button]')].map(b=>(b.innerText||'').trim()).filter(Boolean).slice(0,20)")) ?? [];
  const shot = await cdp("Page.captureScreenshot", { format: "png" });
  writeFileSync(`shots/${nn}-window.png`, Buffer.from(shot.result.data, "base64"));
  try { execSync(`screencapture -x shots/${nn}-screen.png`); } catch {}
  log.push({ step: nn, text: text.slice(0, 500), buttons });
  console.log(nn, JSON.stringify(log[log.length - 1]));
  writeFileSync("shots/walk.json", JSON.stringify(log, null, 1));
  const sig = text + buttons.join("|");
  if (sig === last) { console.log("no change, stopping"); break; }
  last = sig;
  const clicked = await evalJs(clickJs);
  console.log("click:", clicked);
  if (!clicked) { console.log("no forward button, stopping"); break; }
}
try { execSync("pkill -f dani-dex"); } catch {}
process.exit(0);
