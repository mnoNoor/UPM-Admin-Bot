const express = require("express");
const { Telegraf } = require("telegraf");
const { readmessages } = require("./readMessagesAndDelete");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
const port = process.env.PORT || 3000;

bot.start((ctx) => ctx.reply("Welcome to UPM Admin Bot!"));
bot.hears("Hi", (ctx) => ctx.reply("Hi"));
bot.on("text", readmessages);

bot.launch();

app.get("/", (_, res) => {
  res.send("UPM Admin Bot is running!");
});

app.listen(port, () => {
  console.log(`Bot is running on http://localhost:${port}`);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
