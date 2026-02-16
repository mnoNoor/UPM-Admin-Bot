const { normalize } = require("./normalizedText");
const wordsData = require("./wordsData.json");

const blockedWords = wordsData.blockedWords;

const readmessages = async (ctx) => {
  const messageText = ctx.message.text.toLowerCase();
  const normalizedText = normalize(messageText);

  for (const word of blockedWords) {
    if (normalizedText.includes(word.toLowerCase())) {
      try {
        await ctx.deleteMessage();
        await ctx.reply(
          "Your message contains inappropriate content and has been removed.",
        );
        return;
      } catch (error) {
        console.error("Error deleting message:", error);
        await ctx.reply(
          "An error occurred while trying to delete your message. Please be mindful of the content you share.",
        );
      }
    }
  }
};

module.exports = { readmessages };
