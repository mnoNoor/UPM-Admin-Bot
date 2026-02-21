const { normalize } = require("../normalizedText");
const wordsData = require("../wordsData.json");

const blockedWords = wordsData.blockedWords;

const readmessages = async (ctx, next) => {
  const messageText = ctx.message.text.toLowerCase();
  const normalizedText = normalize(messageText);

  for (const word of blockedWords) {
    if (normalizedText.includes(word)) {
      try {
        await ctx.deleteMessage();
        await ctx.telegram.banChatMember(ctx.chat.id, ctx.from.id);
        return;
      } catch (error) {
        console.error("Error deleting message:", error);
        await ctx.reply(
          "An error occurred while trying to delete your message",
        );
      }
    }
  }
  await next();
};

module.exports = { readmessages };
