const express = require("express");
const { Telegraf } = require("telegraf");
const { readmessages } = require("./middleware/readMessagesAndDelete");
const { spamHandler } = require("./middleware/spamHandler");
const { isAllowedNumber } = require("./middleware/allowedNumbers");
const { isMessageCoded } = require("./middleware/isMessageCoded.js");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
const port = process.env.PORT || 3000;

app.use(express.json());

const WEBHOOK_URL = `${process.env.WEBHOOK_BASE_URL}/webhook/${process.env.BOT_TOKEN}`;

bot.start((ctx) => ctx.reply("Welcome to UPM Admin Bot!"));
bot.on("text", readmessages, spamHandler, isAllowedNumber, isMessageCoded);

app.post(`/webhook/${process.env.BOT_TOKEN}`, (req, res) => {
  bot
    .handleUpdate(req.body, res)
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error("Failed to handle update:", err);
      res.status(500).end();
    });
});

app.get("/", (_, res) => {
  res.send("UPM Admin Bot is running!");
});

app.listen(port, async () => {
  console.log(`Bot is running on http://localhost:${port}`);

  try {
    await bot.telegram.setWebhook(WEBHOOK_URL);
    console.log(`Webhook set to ${WEBHOOK_URL}`);
  } catch (err) {
    console.error("Error setting webhook:", err);
  }
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
