const NumberModel = require("../models/Number");
const { normalizeNumber } = require("../normalization/normalizeNumber");

const isAllowedNumber = async (ctx, next) => {
  if (!ctx.message?.text) return next();
  const messageText = ctx.message.text;

  const isGroupChat =
    ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";

  const textWithoutUrls = messageText.replace(/https?:\/\/\S+/gi, " ");

  const numberSequences = textWithoutUrls.match(/\d+/g) || [];

  const hasLongSequence = numberSequences.some((seq) => seq.length >= 8);

  if (!hasLongSequence) return next();

  const allowed = await NumberModel.find();
  const allowedSet = new Set(
    allowed.map((n) => normalizeNumber(n.value.toString())),
  );

  let containsAllowed = false;
  for (const num of allowedSet) {
    for (const seq of numberSequences) {
      if (seq.includes(num)) {
        containsAllowed = true;
        break;
      }
    }
    if (containsAllowed) break;
  }

  if (!containsAllowed && hasLongSequence) {
    try {
      if (!isGroupChat) {
        await ctx.deleteMessage();
        await ctx.reply("I can't ban you in a private chat :(");
        return;
      }
      await ctx.deleteMessage();
      await ctx.telegram.banChatMember(ctx.chat.id, ctx.from.id);

      const username = ctx.from.username
        ? `@${ctx.from.username}`
        : "unknown user";

      console.log(
        `${ctx.from.id}, (${username}) got banned because of sending unallowed number`,
      );
      return;
    } catch (error) {
      console.error("Error deleting message:", error);
      return next();
    }
  }

  await next();
};

module.exports = { isAllowedNumber };
