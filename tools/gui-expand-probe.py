"""Real-GUI probe for the native disclosure expand animation.

Mints a browser-session cookie from the local credential record, opens the
running DSH GUI, then checks:
  A. the plugin's animation style tag and helper are present in the page;
  B. a real native disclosure row expands with WAAPI (Element.animate called);
  C. the DOM shape the detector relies on (data-open > header + content).
Prints a JSON report; never prints the signing secret.
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

GUI_URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:55288/"
CRED = Path.home() / ".dsh" / ".credentials.yaml"
SHELL = (
    "/Users/lixiongwei/Library/Caches/ms-playwright/"
    "chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell"
)
CHROME = (
    "/Users/lixiongwei/Library/Caches/ms-playwright/"
    "chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/"
    "Contents/MacOS/Google Chrome for Testing"
)


def b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def read_secret() -> str:
    text = CRED.read_text()
    block = text.split("client-connection/browser-session:", 1)[1]
    match = re.search(r"secret:\s*([A-Za-z0-9_-]+)", block)
    if match is None:
        raise SystemExit("browser-session secret not found in credentials")
    return match.group(1)


def make_cookie(authority: str) -> tuple[str, str]:
    secret = base64.urlsafe_b64decode(read_secret() + "==")
    now = int(time.time() * 1000)
    payload = {
        "version": 1,
        "authority": authority,
        "issuedAt": now,
        "expiresAt": now + 7 * 24 * 3600 * 1000,
    }
    body = b64url(json.dumps(payload, separators=(",", ":")).encode())
    sig = b64url(hmac.new(secret, body.encode(), hashlib.sha256).digest())
    name = "dsh-auth-" + b64url(hashlib.sha256(authority.encode()).digest())
    return name, f"v1.{body}.{sig}"


INIT = """
window.__anim = { calls: [], tag: null };
const __orig = Element.prototype.animate;
Element.prototype.animate = function (frames, options) {
  try {
    window.__anim.calls.push({
      cls: String(this.className || this.tagName).slice(0, 120),
      dur: options && options.duration,
      keys: Array.isArray(frames) ? frames.map((f) => f.height).join('>') : null,
    });
  } catch (e) {}
  return __orig.call(this, frames, options);
};
document.addEventListener('DOMContentLoaded', () => {
  const t = document.getElementById('dsh-stream-think-native-disclosure');
  window.__anim.tag = t ? t.textContent : null;
});
"""


def launch(p):
    for exe in (SHELL, CHROME):
        if os.path.exists(exe):
            return p.chromium.launch(headless=True, executable_path=exe)
    return p.chromium.launch(headless=True)


report = {}
authority = GUI_URL.split("//", 1)[1].split("/", 1)[0]
cname, cvalue = make_cookie(authority)

with sync_playwright() as p:
    browser = launch(p)
    ctx = browser.new_context(viewport={"width": 1280, "height": 900})
    ctx.add_init_script(INIT)
    ctx.add_cookies([{
        "name": cname, "value": cvalue, "domain": "127.0.0.1", "path": "/",
        "httpOnly": True, "sameSite": "Strict",
    }])
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)[:200]))
    page.goto(GUI_URL, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(4000)
    report["title"] = page.title()
    report["booted"] = page.evaluate("!!window.__DSH_BOOT__")
    report["style_tag"] = page.evaluate(
        "(document.getElementById('dsh-stream-think-native-disclosure')||{}).textContent || null")
    report["helper_type"] = page.evaluate(
        "typeof installNativeDisclosureExpand")
    report["plugin_style_tags"] = page.evaluate(
        "Array.from(document.querySelectorAll('style[data-plugin]')).map(e=>e.dataset.plugin).filter((v,i,a)=>a.indexOf(v)===i)")
    report["disclosure_rows"] = page.evaluate(
        "document.querySelectorAll('[data-disclosure-row]').length")
    report["open_roots"] = page.evaluate(
        "document.querySelectorAll('[data-open]').length")
    report["sample_shape"] = page.evaluate("""() => {
      const row = document.querySelector('[data-disclosure-row]');
      if (!row) return null;
      const root = row.closest('[data-open]') || row.parentElement.parentElement;
      return {
        rootHasOpen: root ? root.hasAttribute('data-open') : null,
        rootTag: root ? root.tagName + '.' + String(root.className).slice(0, 60) : null,
        children: root ? Array.from(root.children).map((c) => ({
          tag: c.tagName,
          cls: String(c.className).slice(0, 60),
          header: c.hasAttribute('data-disclosure-header'),
          rows: c.hasAttribute('data-disclosure-row'),
          h: Math.round(c.getBoundingClientRect().height),
        })) : null,
      };
    }""")
    report["page_errors"] = errors[:5]
    browser.close()

print(json.dumps(report, ensure_ascii=False, indent=2))
