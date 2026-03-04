# 🌈 RainbowName

A Tampermonkey userscript that cycles your name color through the rainbow on miniblox.io. Works with Legend, Immortal, MOD, Builder, YT, and any other rank that supports the command /color

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Open the Tampermonkey dashboard and create a new script
3. Paste in the contents of `user.js` and save
4. Jump into [miniblox.io](https://miniblox.io) — you're good to go

---

## Usage

Toggle the rainbow effect two different ways:

| Method | Action |
|--------|--------|
| 🖱️ Button | Click the **🌈 Rainbow** button in the bottom-right corner |
| 💬 Chat | Type `/color rainbow` in chat |

---

## Configuration

At the top of `user.js` you'll find two values you can tweak:
```js
const INTERVAL_MS = 80;  // how often the color updates (ms)
const HUE_STEP = 4;      // how many degrees to shift the hue each tick
```
 
Lower `INTERVAL_MS` or raise `HUE_STEP` for a faster cycle, and vice versa. (Be aware this could increase ping/fps)

---

## Notes

- The `/color #xxxxxx` commands sent under the hood are automatically hidden from your chat so it doesn't get spammed
- The effect turns off on page refresh — just toggle it back on with the ui button

---

## Credits

Made by **TheM1ddleM1n** and **joudaALT**
