const wordsData = require("../wordsData.json");

const normalizeNumber = (text) => text.replace(/\D/g, "");

const allowedNumbers = new Set(wordsData.allowedNumbers.map(normalizeNumber));

const isGroup = (ctx) =>
  ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";

const punish = async (ctx) => {
  if (!isGroup(ctx)) {
    await ctx.deleteMessage();
    await ctx.reply("I can't ban you in a private chat :(");
    return;
  }

  try {
    await ctx.deleteMessage();
    await ctx.telegram.banChatMember(ctx.chat.id, ctx.from.id);
    await ctx.reply("you are bad");
  } catch (err) {
    console.error("Moderation error:", err);
  }
};

const checkContactNumber = async (ctx) => {
  const phone = ctx.message?.contact?.phone_number;
  if (!phone) return false;

  const normalized = normalizeNumber(phone);

  if (!allowedNumbers.has(normalized)) {
    await punish(ctx);
    return true;
  }

  return false;
};

const isAllowedContact = async (ctx, next) => {
  if (await checkContactNumber(ctx)) return;

  await next();
};

module.exports = { isAllowedContact };
