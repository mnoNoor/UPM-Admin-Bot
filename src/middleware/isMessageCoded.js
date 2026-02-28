const bannedCharRegex = /[ڪטּﻳﺗ]/u;

const isMessageCoded = async (ctx, next) => {
  try {
    if (!ctx.message?.text) return next();

    const text = ctx.message.text;

    const isGroup =
      ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";

    if (bannedCharRegex.test(text)) {
      if (!isGroup) {
        await ctx.reply("I can't ban you in a private chat :(");
        return;
      }
      await ctx.deleteMessage();
      await ctx.telegram.banChatMember(ctx.chat.id, ctx.from.id);
      const username = ctx.from.username
        ? `@${ctx.from.username}`
        : "unknown user";
      console.log(
        `${ctx.from.id}, (${username}) got banned because of coded message`,
      );
      return;
    }

    await next();
  } catch (error) {
    console.log("Error in isMessageCoded:", error);
    await next();
  }
};

module.exports = { isMessageCoded };
