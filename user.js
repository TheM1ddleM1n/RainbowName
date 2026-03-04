// ==UserScript==
// @name         Rainbow Name Color!
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  Rainbow name color cycler for miniblox.io (Legend, Immortal, MOD, Builder, YT, etc)
// @match        *://miniblox.io/*
// @author       TheMoneyMan
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const INTERVAL_MS = 700;
    const HUE_STEP = 8;

    let rainbowInterval = null;
    let hue = 0;
    let gameRef = null;
    let gameSocket = null;
    let PacketMessage = null;
    let chatPatched = false;
    let socketHooked = false;

    // ─── Color ───────────────────────────────────────────────────────────────────

    function hslToHex(h) {
        const s = 1, l = 0.55;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * c).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    // ─── Game ────────────────────────────────────────────────────────────────────

    function getGame() {
        try {
            const root = document.querySelector('#react');
            if (!root) return null;
            return Object.values(root)[0]?.updateQueue?.baseState?.element?.props?.game ?? null;
        } catch (_) { return null; }
    }

    // ─── Socket hook ─────────────────────────────────────────────────────────────

    // Game-specific packets (not party). Updating gameSocket from movement packets
    // means it's always current — no need to wait for a chat message on new servers.
    const GAME_PACKETS = new Set([
        'SPacketPlayerInput',
        'SPacketPlayerPosLook',
        'SPacketPing',
        'SPacketMessage',
    ]);

    function installSocketHook(anySocket) {
        if (socketHooked) return;
        socketHooked = true;

        const SocketProto = Object.getPrototypeOf(anySocket);
        const origEmit = SocketProto.emit;

        SocketProto.emit = function (event, ...args) {
            // Always keep gameSocket fresh from any game packet
            if (GAME_PACKETS.has(event)) {
                gameSocket = this;
            }

            if (event === 'SPacketMessage' && args[0]) {
                // Capture constructor once
                if (!PacketMessage) {
                    PacketMessage = args[0].constructor;
                    console.log('[Rainbow] Captured PacketMessage constructor');
                }

                // Intercept /color rainbow — swallow it
                const text = (args[0].text ?? '').trim().toLowerCase();
                if (text === '/color rainbow') {
                    toggle();
                    return;
                }
            }

            return origEmit.apply(this, arguments);
        };

        console.log('[Rainbow] Socket proto hooked');
    }

    // ─── Patch addChat ───────────────────────────────────────────────────────────

    function shouldSuppress(arg) {
        const text = (typeof arg === 'string') ? arg : (arg?.text ?? '');
        return /\/color\s+#[0-9a-fA-F]{6}/i.test(text) ||
               /your name color has been set to/i.test(text);
    }

    function patchChat(chat) {
        if (chatPatched) return;
        chatPatched = true;
        const proto = Object.getPrototypeOf(chat);
        const original = proto.addChat;
        proto.addChat = function (...args) {
            if (shouldSuppress(args[0])) return;
            return original.apply(this, args);
        };
        console.log('[Rainbow] addChat patched');
    }

    // ─── Send color ───────────────────────────────────────────────────────────────

    function sendColor(hex) {
        if (!gameSocket || !PacketMessage) return;
        try {
            gameSocket.emit('SPacketMessage', new PacketMessage({ text: `/color ${hex}` }));
        } catch (e) {
            console.warn('[Rainbow] sendColor failed:', e);
        }
    }

    // ─── Rainbow loop ─────────────────────────────────────────────────────────────

    function startRainbow() {
        if (rainbowInterval) return;
        console.log('[Rainbow] Started');
        rainbowInterval = setInterval(() => {
            // PacketMessage captured yet? If not, wait silently
            if (!gameSocket || !PacketMessage) return;
            sendColor(hslToHex(hue));
            hue = (hue + HUE_STEP) % 360;
        }, INTERVAL_MS);
        updateButton();
    }

    function stopRainbow() {
        clearInterval(rainbowInterval);
        rainbowInterval = null;
        hue = 0;
        console.log('[Rainbow] Stopped');
        updateButton();
    }

    // ─── UI ───────────────────────────────────────────────────────────────────────

    let btn;

    function updateButton() {
        if (!btn) return;
        if (rainbowInterval) {
            btn.textContent = '🌈 Rainbow: ON';
            btn.style.background = 'linear-gradient(135deg, #f72585, #7209b7, #3a86ff)';
        } else {
            btn.textContent = '🌈 Rainbow: OFF';
            btn.style.background = '#1a1a2e';
        }
    }

    function createUI() {
        btn = document.createElement('button');
        btn.textContent = '🌈 Rainbow: OFF';
        btn.title = 'Toggle with button, F8, or /color rainbow in chat';
        btn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 99999;
            padding: 8px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);
            background: #1a1a2e; color: #fff; font-size: 13px; font-family: sans-serif;
            cursor: pointer; opacity: 0.9; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transition: background 0.3s;
        `;
        btn.addEventListener('click', toggle);
        document.body.appendChild(btn);
    }

    function toggle() {
        rainbowInterval ? stopRainbow() : startRainbow();
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'F8') { e.preventDefault(); toggle(); }
    });

    // ─── Init ─────────────────────────────────────────────────────────────────────

    function init() {
        createUI();
        const poller = setInterval(() => {
            const game = getGame();
            if (game?.chat?.submit) {
                gameRef = game;
                if (game.party?.io) installSocketHook(game.party.io);
                patchChat(game.chat);
                clearInterval(poller);
                console.log('[Rainbow] Ready — /color rainbow, F8, or button to toggle');
            }
        }, 500);
    }

    window.addEventListener('load', init);

})();
