"""Open a real session in the running GUI, click a native disclosure row, and
record whether the expand animation actually runs.

Usage: python3 tools/gui-expand-real.py [url] [--shot out.png]
"""

import base64
import hashlib
import hmac
import json
import os
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
GUI_URL = ARGS[0] if ARGS else "http://127.0.0.1:55288/"
SHOT = None
if "--shot" in sys.argv:
    SHOT = sys.argv[sys.argv.index("--shot") + 1]

CRED = Path.home() / ".dsh" / ".credentials.yaml"
SHELL = (
    "/Users/lixiongwei/Library/Caches/ms-playwright/"
    "chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell"
)
CHROME = (
    "/Users/lixiongwei/Library/Caches/ms-playwright/chromium-1228/"
    "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
)


def b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def make_cookie(authority: str):
    text = CRED.read_text()
    block = text.split("client-connection/browser-session:", 1)[1]
    secret_b64 = re.search(r"secret:\s*([A-Za-z0-9_-]+)", block).group(1)
    secret = base64.urlsafe_b64decode(secret_b64 + "==")
    now = int(time.time() * 1000)
    payload = {"version": 1, "authority": authority,
               "issuedAt": now, "expiresAt": now + 7 * 24 * 3600 * 1000}
    body = b64url(json.dumps(payload, separators=(",", ":")).encode())
    sig = b64url(hmac.new(secret, body.encode(), hashlib.sha256).digest())
    return ("dsh-auth-" + b64url(hashlib.sha256(authority.encode()).digest()),
            f"v1.{body}.{sig}")


INIT = """
window.__anim = [];
const __orig = Element.prototype.animate;
Element.prototype.animate = function (frames, options) {
  try {
    window.__anim.push({
      cls: String(this.className || this.tagName).slice(0, 80),
      dur: options && options.duration,
      heights: Array.isArray(frames) ? frames.map((f) => f.height) : null,
      at: Math.round(performance.now()),
    });
  } catch (e) {}
  return __orig.call(this, frames, options);
};
window.__frames = [];
window.__watch = (selector) => {
  const read = () => {
    const el = document.querySelector(selector);
    if (!el) return;
    window.__frames.push({
      t: Math.round(performance.now()),
      h: Math.round(el.getBoundingClientRect().height * 10) / 10,
      o: Math.round(parseFloat(getComputedStyle(el).opacity) * 100) / 100,
      ov: el.style.overflow,
    });
  };
  const id = setInterval(read, 16);
  setTimeout(() => clearInterval(id), 900);
};
"""


def launch(p):
    for exe in (SHELL, CHROME):
        if os.path.exists(exe):
            return p.chromium.launch(headless=True, executable_path=exe)
    return p.chromium.launch(headless=True)


authority = GUI_URL.split("//", 1)[1].split("/", 1)[0]
cname, cvalue = make_cookie(authority)
out = {}

with sync_playwright() as p:
    browser = launch(p)
    ctx = browser.new_context(viewport={"width": 1280, "height": 900})
    ctx.add_init_script(INIT)
    ctx.add_cookies([{"name": cname, "value": cvalue, "domain": "127.0.0.1",
                      "path": "/", "httpOnly": True, "sameSite": "Strict"}])
    page = ctx.new_page()
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)[:200]))
    page.goto(GUI_URL, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(3500)

    # open a session that has content: click the first sidebar session by text
    out["sidebar_items"] = page.evaluate(
        """() => {
          const all = Array.from(document.querySelectorAll('button, a, div[role="button"], li'));
          const hits = all.filter((el) => {
            const t = (el.textContent || '').trim();
            return t.length > 0 && t.length < 80 && el.getBoundingClientRect().width > 100
              && el.getBoundingClientRect().left < 300;
          });
          return hits.slice(0, 12).map((el) => (el.textContent || '').trim().slice(0, 30));
        }""")
    page.evaluate("""() => {
      const all = Array.from(document.querySelectorAll('button, a, div[role="button"], li'));
      const hit = all.find((el) => {
        const r = el.getBoundingClientRect();
        const t = (el.textContent || '').trim();
        return r.left < 300 && r.width > 100 && r.height > 16 && r.height < 60
          && t.length > 4 && /h$|now|m$|d$/i.test(t);
      });
      if (hit) hit.click();
    }""")
    page.wait_for_timeout(4000)

    out["rows"] = page.evaluate("document.querySelectorAll('[data-disclosure-row]').length")
    out["shape"] = page.evaluate("""() => {
      const row = document.querySelector('[data-disclosure-row]');
      if (!row) return null;
      let root = row.parentElement ? row.parentElement.parentElement : null;
      return {
        rowCls: String(row.className).slice(0, 80),
        rootCls: root ? String(root.className).slice(0, 80) : null,
        rootAttrs: root ? Array.from(root.attributes).map(a=>a.name).join(',') : null,
        childCount: root ? root.children.length : null,
        children: root ? Array.from(root.children).slice(0,4).map(c => ({
          tag: c.tagName, cls: String(c.className).slice(0,50),
          header: c.hasAttribute('data-disclosure-header'),
          h: Math.round(c.getBoundingClientRect().height),
        })) : null,
      };
    }""")

    # expand the first collapsed native row and watch the first child height
    clicked = page.evaluate("""() => {
      const rows = Array.from(document.querySelectorAll('[data-disclosure-row]'));
      const target = rows.find((r) => {
        const root = r.parentElement && r.parentElement.parentElement;
        return root && !root.hasAttribute('data-open');
      }) || rows[0];
      if (!target) return null;
      target.click();
      return String(target.textContent || '').slice(0, 60);
    }""")
    out["clicked"] = clicked
    page.wait_for_timeout(120)
    out["anim_after_click"] = page.evaluate("window.__anim.slice(-4)")
    page.wait_for_timeout(700)
    out["open_roots_after"] = page.evaluate("document.querySelectorAll('[data-open]').length")
    out["frames"] = page.evaluate("window.__frames.length")
    if SHOT:
        page.screenshot(path=SHOT, full_page=False)
    out["errors"] = errs[:5]
    browser.close()

print(json.dumps(out, ensure_ascii=False, indent=2))
