# 🌈 RainbowName

A Tampermonkey userscript that cycles your name color through the rainbow on miniblox.io. Works with Legend, Immortal, MOD, Builder, YT, and any other rank that supports the command /color

---

## Installation

### 1. Install Tampermonkey
- Go to [tampermonkey.net](https://www.tampermonkey.net/) and click the download link for your browser
- Click **Add Extension** (or **Add to Chrome/Firefox/Edge**) when prompted
- Once installed, the Tampermonkey icon (a dark square with two circles) should appear in your browser toolbar
- If you don't see it, click the puzzle piece icon in your toolbar and pin Tampermonkey

### 2. Create a New Script
- Click the Tampermonkey icon in your toolbar
- Select **Create a new script...** from the dropdown
- A code editor will open with some auto-generated placeholder text

### 3. Paste in the Script
- Open [`user.js`](./user.js) from this repo and copy all of its contents
- Back in the Tampermonkey editor, select everything (**Ctrl+A** / **Cmd+A**) and delete it
- Paste in the copied code (**Ctrl+V** / **Cmd+V**)
- Save with **Ctrl+S** (or **Cmd+S** on Mac) — the tab title should change to show the script name

### 4. Allow UserScripts
- Click the icon that looks like a puzzle piece in your toolbar
- Click on the 3 dots next to Tampermonkey
- Click Manage Extension 
- Find **Allow UserScripts** and make sure it is set to **Enabled** otherwise THIS WILL NOT WORK
- Make sure it is ON (blue circle) 

### 5. Launch the Game
- Go to [miniblox.io](https://miniblox.io) (or refresh the tab if you already had it open)
- Once you're in the game, you should see a **🌈 Rainbow: OFF** button in the bottom-right corner of your screen
- Click it to start the effect!
- You are good to go!

> **Something not working?** Click the Tampermonkey icon and check that the **Rainbow Name Color** script is listed and its toggle is switched **on**. Also make sure you're on exactly `https://miniblox.io/` — the script won't run on any other URL.

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
