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

            # 1. Verify initial render & live strip
            assert "Pico de Diamante" in page.locator("#live-strip-name").text_content()
            diamond_svg = page.locator("#selected-item-icon").inner_html()
            assert "#4ae4f7" in diamond_svg, "Expected diamond pixel palette on initial pickaxe"

            # 2. Switch material to Netherite and Gold -> verify dynamic pixel-art recoloring
            page.select_option("#material-select", "netherite")
            assert "Pico de Netherita" in page.locator("#live-strip-name").text_content()
            netherite_svg = page.locator("#selected-item-icon").inner_html()
            assert "#6a6066" in netherite_svg, "Expected netherite pixel palette"

            page.select_option("#material-select", "gold")
            gold_svg = page.locator("#selected-item-icon").inner_html()
            assert "#fde047" in gold_svg, "Expected gold pixel palette"

            # 3. Switch item to Sword (Diamond), test Bedrock switching disables sweeping_edge
            page.select_option("#item-select", "sword")
            page.select_option("#material-select", "diamond")
            assert "Espada de Diamante" in page.locator("#live-strip-name").text_content()

            # Open enchantment contextual inspector
            page.locator('[data-action="inspect-enchant"][data-key="sharpness"]').click()
            assert page.locator("#inspector-ench-sharpness").is_visible()

            # Open anvil step inspector (force clean route to ensure multiple steps)
            page.locator("#rad-clean-base").check()
            page.locator('[data-action="inspect-step"][data-step="0"]').first.click()
            assert page.locator("#inspector-step-0").is_visible()
            assert "Fórmula exacta" in page.locator("#inspector-step-0").text_content()

            # Poke animated librarian actor -> verify contextual speech bubble
            poke_btn = page.locator('[data-action="poke-actor"][data-actor="librarian"]')
            assert poke_btn.is_visible()
            poke_btn.click()
            assert page.locator(".mc-speech-bubble").is_visible()

            if SCREENSHOT_DIR:
                os.makedirs(SCREENSHOT_DIR, exist_ok=True)
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_top.png"))
                page.locator("#stage-4").scroll_into_view_if_needed()
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_anvil.png"))

            # Switch to Bedrock -> verify sweeping_edge auto-removed & notice shown
            page.locator("#btn-ed-bedrock").click()
            assert "BEDROCK EDITION" in page.locator("#reroll-ed-badge").text_content()
            assert "Filo Arrasador" in page.locator("#item-origin-box").text_content()

            # 4. Switch to Elytra -> verify interlude 0 dynamically says no enchanting table
            page.select_option("#item-select", "elytra")
            interlude0 = page.locator("#interlude-before-enchants").text_content()
            assert "Sin Mesa de Encantamientos" in interlude0

            # 5. Test Tab 2 (Villagers) reactive highlight & inspector
            page.locator("#tab-btn-villagers").click()
            assert page.locator("#tab-villagers").is_visible()
            page.locator('[data-action="inspect-villager"][data-villager="librarian"]').first.click()
            assert page.locator("#inspector-villager-librarian").is_visible()

            # 6. Test Tab 3 (Theory) reactive context
            page.locator("#tab-btn-theory").click()
            assert "Élitros" in page.locator("#theory-live-context").text_content()

            # 7. Test Tab 4 (Rust) dynamic main() sync
            page.locator("#tab-btn-rust").click()
            rust_txt = page.locator("#rust-code-block").text_content()
            assert "Élitros" in rust_txt

            # 8. Mobile responsiveness check (390px) -> no horizontal overflow
            page.set_viewport_size({"width": 390, "height": 844})
            page.locator("#tab-btn-calc").click()
            page.select_option("#item-select", "pickaxe")
            overflow = page.evaluate(
                "document.documentElement.scrollWidth > document.documentElement.clientWidth + 2"
            )
            assert not overflow, "Detected horizontal overflow on 390px mobile viewport!"

            if SCREENSHOT_DIR:
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "mobile_top.png"))

            browser.close()
    finally:
        httpd.shutdown()

    if errors:
        print("ERRORS FOUND:\n" + "\n".join(errors), file=sys.stderr)
        sys.exit(1)

    print("UI SMOKE TESTS PASSED: 0 console errors, all reactive & pixel-art flows verified!")


if __name__ == "__main__":
    run_tests()
