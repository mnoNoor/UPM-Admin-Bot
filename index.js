const express = require("express");
const { Telegraf } = require("telegraf");
const { stripSmall, stripTatweel } = require("arajs");
// import blockedWordsData from "./BlokckedWords.json" with { type: "json" };

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
const port = process.env.PORT;

const TASHKEEL = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const PUNCTUATION = /[.,$…!?؛،:"'()\[\]{}<>@#%^&*_+=\\\/|-]/g;

const normalize = (text = "") => {
  return stripSmall(
    stripTatweel(
      text.replace(TASHKEEL, "").replace(PUNCTUATION, " ").replace(/\s+/g, " "),
    ),
  )
    .toLowerCase()
    .trim();
};

bot.start((ctx) => ctx.reply("Welcome to UPM Admin Bot!"));
bot.hears("Hi", (ctx) => ctx.reply("Hi"));
bot.on("text", async (ctx) => {
  ctx.reply(normalize(ctx.message.text));
});

/*
  bot.on("text", async (ctx) => {
    const blockedWords = blockedWordsData.blockedWords;
    const messageText = ctx.message.text.toLowerCase();

    for (const word of blockedWords) {
      if (messageText.includes(word.toLowerCase())) {
        await ctx.deleteMessage();
        return;
      }
    }
  });
*/
bot.launch();

app.listen(port, () => {
  console.log(`Bot is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("UPM Admin Bot is running!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
