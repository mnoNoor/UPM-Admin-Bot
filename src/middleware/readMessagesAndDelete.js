const BanWord = require("../models/BanWord");
const { normalize } = require("../normalization/normalizedText");

const readMessages = async (ctx, next) => {
  if (!ctx.message?.text) return next();

  const messageText = ctx.message.text.toLowerCase();
  const normalizedText = normalize(messageText);

  const isPrivate = ctx.chat?.type === "private";

  const blockedWordsDocs = await BanWord.find();
  const blockedWords = blockedWordsDocs.map((b) => b.word.toLowerCase());

  for (const word of blockedWords) {
    if (normalizedText.includes(word)) {
      if (isPrivate) {
        await ctx.reply("I can't ban you in a private chat :(");
        return;
      }

      try {
        await ctx.deleteMessage();
        await ctx.telegram.banChatMember(ctx.chat.id, ctx.from.id);
        const username = ctx.from.username
          ? `@${ctx.from.username}`
          : "unknown user";
        console.log(
          `${ctx.from.id}, (${username}) got banned because of blocked word: ${word} in message`,
        );
        return;
      } catch (error) {
        console.error("Error deleting message:", error);
        await ctx.reply("An error occurred while moderating message");
        return;
      }
    }
  }

  await next();
};

module.exports = { readMessages };
