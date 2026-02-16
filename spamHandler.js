const max_Spam_Count = 3;
const spamTracker = new Map();

const spamHandler = async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text.trim();

  const data = spamTracker.get(userId) || {
    lastText: null,
    count: 0,
  };

  if (data.lastText === text) {
    data.count += 1;
  } else {
    data.lastText = text;
    data.count = 1;
  }

  spamTracker.set(userId, data);

  if (data.count >= max_Spam_Count) {
    try {
      await ctx.telegram.banChatMember(ctx.chat.id, userId);
      await ctx.reply(`User banned for repeating spam.`);
      spamTracker.delete(userId);
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = { spamHandler };
