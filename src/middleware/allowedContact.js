const NumberModel = require("../models/Number");
const { normalizeNumber } = require("../normalization/normalizeNumber");

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
  } catch (err) {
    console.error("Moderation error:", err);
  }
};

const checkContactNumber = async (ctx) => {
  const phone = ctx.message?.contact?.phone_number;
  if (!phone) return false;

  const normalized = normalizeNumber(phone);

  const allowed = await NumberModel.find();
  const allowedSet = new Set(
    allowed.map((n) => normalizeNumber(n.value.toString())),
  );

  if (!allowedSet.has(normalized)) {
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
