const { normalize } = require("../normalizedText");
const wordsData = require("../wordsData.json");

const blockedWords = wordsData.blockedWords;

const readmessages = async (ctx, next) => {
  if (!ctx.message?.text) return next();

  const messageText = ctx.message.text.toLowerCase();
  const normalizedText = normalize(messageText);

  const isPrivate = ctx.chat?.type === "private";

  for (const word of blockedWords) {
    if (normalizedText.includes(word)) {
      if (isPrivate) {
        await ctx.reply("I can't ban you in a private chat :(");
        return;
      }

      try {
        await ctx.deleteMessage();
        await ctx.telegram.banChatMember(ctx.chat.id, ctx.from.id);
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

module.exports = { readmessages };
