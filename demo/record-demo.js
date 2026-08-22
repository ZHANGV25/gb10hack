// Records the walkthrough paced to the narration: each beat lasts exactly as
// long as its voiceover segment, so audio and picture line up without editing.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "http://127.0.0.1:3000";
const SP = __dirname;
const OUT = process.argv[2] || "/tmp/dora-vo";
const W = 1440, H = 900;
const GAP = 0.6; // seconds of silence between segments

const timing = JSON.parse(fs.readFileSync(path.join(SP, "vo/timing.json"), "utf8"));
const dur = Object.fromEntries(timing.map((t) => [t.id, t.dur]));
const marks = [];
let t0 = 0;
const now = () => (Date.now() - t0) / 1000;

const CHROME = `
  #dz-cur{position:fixed;z-index:2147483646;width:22px;height:22px;margin:-11px 0 0 -11px;
    border-radius:50%;border:2px solid rgba(10,10,10,.85);background:rgba(255,255,255,.5);
    box-shadow:0 1px 6px rgba(0,0,0,.35);pointer-events:none;
    transition:all .5s cubic-bezier(.4,0,.2,1);opacity:0}
  #dz-cur.on{opacity:1}
  #dz-cur.tap{transform:scale(.6);background:rgba(140,230,210,.95)}
`;

async function chrome(page) {
  await page.addStyleTag({ content: CHROME }).catch(() => {});
  await page.evaluate(() => {
    if (!document.getElementById("dz-cur")) {
      const k = document.createElement("div");
      k.id = "dz-cur";
      document.body.appendChild(k);
    }
  });
}

async function cursor(page, x, y) {
  await page.evaluate(([x, y]) => {
    const k = document.getElementById("dz-cur");
    if (k) { k.classList.add("on"); k.style.left = x + "px"; k.style.top = y + "px"; }
  }, [x, y]);
  await page.mouse.move(x, y);
  await page.waitForTimeout(450);
}

async function clickEl(page, loc) {
  const b = await loc.boundingBox();
  if (!b) throw new Error("no box");
  await cursor(page, Math.round(b.x + b.width / 2), Math.round(b.y + Math.min(b.height / 2, 24)));
  await page.evaluate(() => document.getElementById("dz-cur")?.classList.add("tap"));
  await page.waitForTimeout(150);
  await loc.click({ timeout: 15000 });
  await page.evaluate(() => document.getElementById("dz-cur")?.classList.remove("tap"));
  await page.waitForTimeout(350);
}

async function go(page, url) {
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await chrome(page);
  await page.waitForTimeout(350);
}

async function glide(page, to, ms = 1600) {
  await page.evaluate(([to, ms]) => new Promise((res) => {
    const from = window.scrollY, d = to - from, s = performance.now();
    (function step(n) {
      const p = Math.min(1, (n - s) / ms);
      window.scrollTo(0, from + d * (p < .5 ? 2*p*p : 1 - (-2*p+2)**2/2));
      p < 1 ? requestAnimationFrame(step) : res();
    })(s);
  }), [to, ms]);
}

// Runs the body, then holds until the segment's narration would have finished.
async function beat(page, id, body) {
  const start = now();
  marks.push({ id, start });
  await body();
  const remaining = dur[id] - (now() - start);
  if (remaining > 0) await page.waitForTimeout(remaining * 1000);
  await page.waitForTimeout(GAP * 1000);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: OUT, size: { width: W, height: H } },
  });
  const page = await ctx.newPage();
  t0 = Date.now();

  await go(page, "/");
  await beat(page, "01_register", async () => {
    await page.waitForTimeout(6000);
    await glide(page, 300, 2000);
    await page.waitForTimeout(4500);
    await glide(page, 560, 2200);
    await page.waitForTimeout(3000);
    await glide(page, 180, 1800);
  });

  await beat(page, "02_helvetia", async () => {
    await go(page, "/contracts/NHB-ICT-2019-004");
    await page.waitForTimeout(5000);
    await glide(page, 260, 1800);
    await page.waitForTimeout(2500);
    await clickEl(page, page.locator("li button", { hasText: "Access, recovery and return of data" }).first());
  });

  await beat(page, "03_real", async () => {
    await go(page, "/contracts/SEC-0001193125-24-211246");
    await page.waitForTimeout(7000);
    await glide(page, 240, 2000);
    await page.waitForTimeout(5000);
    await glide(page, 520, 2200);
  });

  await beat(page, "04_teach", async () => {
    await go(page, "/contracts/NHB-ICT-2018-001");
    await page.waitForTimeout(4500);
    await clickEl(page, page.getByRole("button", { name: /Disagree/ }));
    await page.waitForTimeout(600);
    await page.selectOption("select >> nth=1", "critical");
    await page.locator("textarea").first().click();
    await page.locator("textarea").first().type(
      "A supplier that refuses customer-initiated penetration testing of its production environment cannot be assured for a critical function. Treat a self-testing-only clause as not compliant, not a routine gap.",
      { delay: 14 },
    );
    await page.waitForTimeout(800);
    await clickEl(page, page.getByRole("button", { name: /Store rule/ }));
    await page.waitForTimeout(4500);
  });

  await beat(page, "05_react", async () => {
    await go(page, "/activity");
    await page.waitForTimeout(6000);
    await glide(page, 150, 1500);
  });

  await beat(page, "06_memory", async () => {
    await go(page, "/memory");
    await page.waitForTimeout(5000);
    await glide(page, 230, 1800);
  });

  await beat(page, "07_aurora", async () => {
    await go(page, "/contracts/NHB-ICT-2023-018");
    await page.waitForTimeout(5000);
    await glide(page, 300, 2000);
    await page.waitForTimeout(4000);
    await glide(page, 520, 1800);
  });

  await beat(page, "08_close", async () => {
    await go(page, "/system");
    await page.waitForTimeout(5000);
    await glide(page, 420, 2400);
    await page.waitForTimeout(4000);
    await glide(page, 980, 2600);
  });

  await page.waitForTimeout(600);
  const video = page.video();
  await ctx.close();
  await browser.close();
  fs.writeFileSync(path.join(OUT, "marks.json"), JSON.stringify(marks, null, 2));
  console.log("VIDEO:" + (await video.path()));
  console.log("length:", now().toFixed(1) + "s");
})();
