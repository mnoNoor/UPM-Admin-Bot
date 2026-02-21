const bannedCharRegex = /[ڪטּ]/u;

const isMessageCoded = async (ctx, next) => {
  try {
    const text = ctx.message?.text || "";

    if (bannedCharRegex.test(text)) {
      await ctx.deleteMessage();
      await ctx.telegram.banChatMember(ctx.chat.id, ctx.from.id);
      return;
    }

    await next();
  } catch (error) {
    console.log("Error in isMessageCoded:", error);
    await next();
  }
};

module.exports = { isMessageCoded };
