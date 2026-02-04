import { Telegraf } from "telegraf";
import express from "express";

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

const port = process.env.PORT;

bot.start((ctx) => ctx.reply("Welcome to UPM Admin Bot!"));
bot.hears("Hi", (ctx) => ctx.reply("Hi"));

bot.on("text", (ctx) => {
  const blockedWords = require("./BlokckedWords.json").blockedWords;
  const messageText = ctx.message.text.toLowerCase();

  for (const word of blockedWords) {
    if (messageText.includes(word)) {
      ctx.deleteMessage();
      return;
    }
  }
});

bot.launch();

app.listen(port, () => {
  console.log(`bot now is running: http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("UPM Admin Bot is running!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
