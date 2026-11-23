#!/usr/bin/env python3
"""Headless Chromium end-to-end smoke test for the modular Minecraft Enchant & Anvil Optimizer."""

import functools
import http.server
import os
import socketserver
import sys
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO_ROOT = Path(__file__).resolve().parent.parent
SCREENSHOT_DIR = os.environ.get("MC_SCREENSHOT_DIR", "")


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def start_server():
    handler = functools.partial(QuietHandler, directory=str(REPO_ROOT))
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd, port


def run_tests():
    httpd, port = start_server()
    url = f"http://127.0.0.1:{port}/index.html"
    errors = []

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                executable_path="/usr/bin/google-chrome",
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage"],
            )
            page = browser.new_page(viewport={"width": 1280, "height": 900})
            page.on("pageerror", lambda err: errors.append(f"PAGEERROR: {err}"))
            page.on(
                "console",
                lambda msg: errors.append(f"CONSOLE_ERROR: {msg.text}")
                if msg.type == "error"
                else None,
            )

            page.goto(url, wait_until="networkidle")

            # 0. Verify redundant boxes were removed cleanly
            assert page.locator("#stage1-enchant-table-box").count() == 0
            assert page.locator("#interlude-before-enchants").count() == 0
            assert page.locator("#interlude-before-reroll").count() == 0
            assert page.locator("#stage-3-5").count() == 0

            # 1. Verify authentic 16x16 pixel-art recoloring across materials
            assert "Pico de Diamante" in page.locator("#live-strip-name").text_content()
            diamond_svg = page.locator("#selected-item-icon").inner_html()
            assert "#62ede8" in diamond_svg, "Expected diamond 16x16 palette on pickaxe"

            page.select_option("#material-select", "netherite")
            assert "Pico de Netherita" in page.locator("#live-strip-name").text_content()
            netherite_svg = page.locator("#selected-item-icon").inner_html()
            assert "#70656b" in netherite_svg, "Expected netherite 16x16 palette"

            page.select_option("#material-select", "gold")
            gold_svg = page.locator("#selected-item-icon").inner_html()
            assert "#fcee4b" in gold_svg, "Expected gold 16x16 palette"

            # 2. Switch to Sword (Diamond) & verify dynamic route detail panel for A / B / C
            page.select_option("#item-select", "sword")
            page.select_option("#material-select", "diamond")
            assert "Espada de Diamante" in page.locator("#live-strip-name").text_content()

            page.locator("#rad-clean-base").check()
            assert "Ruta A" in page.locator("#route-detail-panel").text_content()

            page.locator("#rad-villager-base").check()
            route_b_txt = page.locator("#route-detail-panel").text_content()
            assert "Ruta B" in route_b_txt
            # Unified Stage 3 must contain equipment villager odds (Lv.1 & Full Pack) + Librarian books
            stage3_b = page.locator("#stage3-unified-showcase").text_content()
            assert "HERRERO DE ARMAS" in stage3_b
            assert "Pack vista completa" in stage3_b
            assert "BIBLIOTECARIO" in stage3_b

            if SCREENSHOT_DIR:
                os.makedirs(SCREENSHOT_DIR, exist_ok=True)
                page.evaluate("window.scrollTo(0, 0)")
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "v2_desktop_stage1.png"))
                page.locator("#route-recommendation-section").scroll_into_view_if_needed()
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "v2_desktop_route_b.png"))
                page.locator("#stage-3").scroll_into_view_if_needed()
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "v2_desktop_stage3_unified.png"))

            page.locator("#rad-gold-trick").check()
            route_c_txt = page.locator("#route-detail-panel").text_content()
            assert "Ruta C" in route_c_txt
            stage3_c = page.locator("#stage3-unified-showcase").text_content()
            assert "MESA DE ENCANTAMIENTOS" in stage3_c

            # 3. Contextual inspectors & animated actor click speech bubble
            page.locator('[data-action="inspect-enchant"][data-key="sharpness"]').click()
            assert page.locator("#inspector-ench-sharpness").is_visible()

            page.locator("#rad-clean-base").check()
            page.locator('[data-action="inspect-step"][data-step="0"]').first.click()
            assert page.locator("#inspector-step-0").is_visible()

            page.locator('[data-action="poke-actor"][data-actor="librarian"]').click()
            assert page.locator(".mc-speech-bubble").is_visible()

            # 4. Bedrock auto-disables Sweeping Edge
            page.locator("#btn-ed-bedrock").click()
            assert "BEDROCK EDITION" in page.locator("#reroll-ed-badge").text_content()
            assert "Filo Arrasador" in page.locator("#item-origin-box").text_content()

            # 5. Tabs 2, 3, 4 reactive checks
            page.select_option("#item-select", "elytra")
            page.locator("#tab-btn-villagers").click()
            page.locator('[data-action="inspect-villager"][data-villager="librarian"]').first.click()
            assert page.locator("#inspector-villager-librarian").is_visible()

            page.locator("#tab-btn-theory").click()
            assert "Élitros" in page.locator("#theory-live-context").text_content()

            page.locator("#tab-btn-rust").click()
            assert "Élitros" in page.locator("#rust-code-block").text_content()

            # 6. Mobile responsiveness check (390px)
            page.set_viewport_size({"width": 390, "height": 844})
            page.locator("#tab-btn-calc").click()
            page.select_option("#item-select", "pickaxe")
            overflow = page.evaluate(
                "document.documentElement.scrollWidth > document.documentElement.clientWidth + 2"
            )
            assert not overflow, "Detected horizontal overflow on 390px mobile viewport!"

            browser.close()
    finally:
        httpd.shutdown()

    if errors:
        print("ERRORS FOUND:\n" + "\n".join(errors), file=sys.stderr)
        sys.exit(1)

    print("UI SMOKE TESTS PASSED: 0 console errors, 16x16 sprites, dynamic routes A/B/C & unified Stage 3 verified!")


if __name__ == "__main__":
    run_tests()
