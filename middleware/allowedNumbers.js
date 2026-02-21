const wordsData = require("../wordsData.json");

const normalizeNumber = (text) => text.replace(/\D/g, "");

const allowedNumbers = new Set(wordsData.allowedNumbers.map(normalizeNumber));

const isAllowedNumber = async (ctx, next) => {
  const messageText = ctx.message.text;

  const matches = messageText.match(/[+\d][\d\s().-]{7,}/g);

  if (!matches) return next();

  for (const m of matches) {
    const normalized = normalizeNumber(m);

    if (!allowedNumbers.has(normalized)) {
      try {
        await ctx.deleteMessage();
        await ctx.telegram.banChatMember(ctx.chat.id, ctx.from.id);
        return;
      } catch (error) {
        console.error("Error deleting message:", error);
        return;
      }
    }
  }

  await next();
};

module.exports = { isAllowedNumber };
