# 🔍 LinkLens

> AI-powered Chrome extension that generates personalized cold messages for any LinkedIn profile — in one click.

---

## How It Works

1. Open any LinkedIn profile
2. Click the LinkLens icon in your toolbar
3. Click **Generate Message**
4. LinkLens takes a screenshot of the profile and sends it to Gemini Vision
5. AI reads the profile visually and writes a personalized cold message
6. Refine it via the built-in chat — *"make it shorter"*, *"I'm applying for a SWE internship"*
7. Copy and send

No scraping. No APIs. Just a screenshot + AI.

---

## Features

- **Vision-based** — reads profiles like a human, not a scraper. LinkedIn can't block it.
- **One click** — no copy-pasting, no manual input
- **Refine with chat** — tell the AI to tweak the message in plain English
- **Bring your own key** — uses your Gemini API key, stored locally. Zero server costs, complete privacy.
- **Regenerate** — not happy? Generate a fresh version instantly

---

## Installation

### Step 1 — Clone the repo
```bash
git clone https://github.com/michelle409/linklens
```

### Step 2 — Load into Chrome
1. Open Chrome and go to `chrome://extensions`
2. Toggle **Developer Mode** ON (top right)
3. Click **Load unpacked**
4. Select the `linklens` folder

### Step 3 — Get a Gemini API key
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API key** → **Create API key**
3. Copy the key

### Step 4 — Use it
1. Go to any LinkedIn profile
2. Click the LinkLens icon in your toolbar
3. Paste your Gemini API key when prompted (only once — saved locally)
4. Click **Generate Message**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Extension | Chrome Manifest V3 |
| AI | Google Gemini 2.5 Flash Vision |
| Language | Vanilla JavaScript |
| Styling | CSS3 |

---

## Privacy

- Your Gemini API key is stored in Chrome's local storage — never sent to any server
- Screenshots are sent directly from your browser to Google's Gemini API
- No data is collected or stored anywhere.

## Project Structure

| File | Purpose |
|------|---------|
| `manifest.json` | Extension config and permissions |
| `background.js` | Gemini Vision API calls |
| `content.js` | Runs on LinkedIn pages |
| `popup.html` | Extension UI |
| `popup.css` | Styling |
| `popup.js` | UI logic and event handling |
| `icons/` | Extension icons |

---

Built by [michelle409](https://github.com/michelle409)

