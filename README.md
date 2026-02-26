# UPM Admin Bot

Telegram moderation bot with spam detection, banned words, and phone number filtering.

## Features

- 🛡️ Multi-layer protection: banned words, phone numbers, spam, coded messages
- 👮 Admin panel (private chat): add banned words / allowed numbers
- 🤖 Auto-superAdmin on first use
- 🌐 Webhook (prod) & polling (dev) support

## Quick Start

```bash
npm install
```

**.env**

```env
BOT_TOKEN=xxx
MONGO_URI=xxx
NODE_ENV=development
PORT=3000
```

```bash
node addAdmin.js  # creates superAdmin (edit ID in file)
npm run dev       # polling mode
```

## Deploy on Render

1. Push code to GitHub
2. Create new **Web Service** on Render
3. Connect repo, set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables:
   - `BOT_TOKEN`
   - `MONGO_URI`
   - `NODE_ENV=production`
   - `WEBHOOK_BASE_URL=https://your-app.onrender.com`
5. Deploy ✅

Bot auto-configures webhook on startup.

## Moderation Flow

Messages checked for: banned words → spam (3+ repeats) → unapproved numbers → coded chars → shared contacts → username violations.

**Groups:** violators banned • **Private:** message deleted + warning

## Commands

- `/admin` – open admin panel (private only)
- Keyboard buttons to add banned words & allowed numbers

## Structure

```
index.js                # entry
server.js               # webhook/polling setup
src/
├── admin/
│   └── adminCommands.js
├── middleware/          # 6 moderation layers
├── models/              # Admin, BanWord, Number
├── normalization/       # Arabic/text cleaners
└── config/
    └── db.js
```

---

## License:

[MIT License](LICENSE)
