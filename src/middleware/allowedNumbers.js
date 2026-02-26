const NumberModel = require("../models/Number");
const { normalizeNumber } = require("../normalization/normalizeNumber");

const isAllowedNumber = async (ctx, next) => {
  if (!ctx.message?.text) return next();
  const messageText = ctx.message.text;

  const isGroupChat =
    ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";

  const textWithoutUrls = messageText.replace(/https?:\/\/\S+/gi, " ");

  const normalizedMessage = normalizeNumber(textWithoutUrls);

  if (!normalizedMessage) return next();

  const allowed = await NumberModel.find();
  const allowedSet = new Set(
    allowed.map((n) => normalizeNumber(n.value.toString())),
  );

  let containsAllowed = false;
  for (const num of allowedSet) {
    if (normalizedMessage.includes(num)) {
      containsAllowed = true;
      break;
    }
  }

  if (!containsAllowed && /\d/.test(normalizedMessage)) {
    try {
      if (!isGroupChat) {
        await ctx.deleteMessage();
        await ctx.reply("I can't ban you in a private chat :(");
        return;
      }
      await ctx.deleteMessage();
      await ctx.telegram.banChatMember(ctx.chat.id, ctx.from.id);
      return;
    } catch (error) {
      console.error("Error deleting message:", error);
      return next();
    }
  }

  await next();
};

module.exports = { isAllowedNumber };
