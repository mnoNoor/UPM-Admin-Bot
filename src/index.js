const express = require("express");
const { Telegraf } = require("telegraf");
const { startServer } = require("./server.js");
const { adminCommands } = require("./admin/adminCommands.js");

const { readMessages } = require("./middleware/readMessagesAndDelete.js");
const { spamHandler } = require("./middleware/spamHandler.js");
const { isAllowedNumber } = require("./middleware/allowedNumbers.js");
const { isMessageCoded } = require("./middleware/isMessageCoded.js");
const { isAllowedContact } = require("./middleware/allowedContact.js");
const { checkUserName } = require("./middleware/checkUserName.js");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
const port = process.env.PORT || 3000;

app.use(express.json());

bot.start((ctx) => ctx.reply("Welcome to UPM Admin Bot!"));

bot.on(
  "message",
  readMessages,
  spamHandler,
  isAllowedNumber,
  isMessageCoded,
  isAllowedContact,
  checkUserName,
);

adminCommands(bot);
startServer(app, bot, port); // server.js

app.get("/", (_, res) => {
  res.send("UPM Admin Bot is running!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
