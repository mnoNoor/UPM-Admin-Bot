const max_Spam_Count = 3;
const spamTracker = new Map();

const spamHandler = async (ctx, next) => {
  const userId = ctx.from.id;
  const messageId = ctx.message.message_id;
  const text = ctx.message.text?.trim();

  if (!text) {
    return next();
  }

  const data = spamTracker.get(userId) || {
    lastText: null,
    count: 0,
    messageIds: [],
  };

  if (data.lastText === text) {
    data.count += 1;
    data.messageIds.push(messageId);
  } else {
    data.lastText = text;
    data.count = 1;
    data.messageIds = [messageId];
  }

  spamTracker.set(userId, data);

  if (data.count >= max_Spam_Count) {
    try {
      await ctx.telegram.banChatMember(ctx.chat.id, userId);
      for (const id of data.messageIds) {
        try {
          await ctx.telegram.deleteMessage(ctx.chat.id, id);
        } catch (err) {
          console.error(`Failed to delete message ${id}:`, err);
        }
      }

      spamTracker.delete(userId);
      return;
    } catch (error) {
      console.error(error);
    }
  }

  await next();
};

module.exports = { spamHandler };
