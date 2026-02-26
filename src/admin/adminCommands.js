const BanWord = require("../models/BanWord");
const Admin = require("../models/Admin");
const NumberModel = require("../models/Number");
const { Markup } = require("telegraf");

const adminCommands = (bot) => {
  const waitingForBanPhrase = {};
  const waitingForAllowedNumber = {};

  const getAdmin = async (userId) => {
    let admin = await Admin.findOne({ telegramId: userId });
    const totalAdmins = await Admin.countDocuments();

    if (!admin && totalAdmins === 0) {
      await Admin.create({ telegramId: userId, role: "superAdmin" });
      admin = await Admin.findOne({ telegramId: userId });
    }

    return admin;
  };

  const getAdminKeyboard = () => {
    return Markup.keyboard([
      ["➕ Add a word to ban"],
      ["➕ Add allowed number"],
    ]).resize();
  };

  bot.command("admin", async (ctx) => {
    if (ctx.chat.type !== "private") return;

    const admin = await getAdmin(ctx.from.id);
    if (!admin) return ctx.reply("❌ You are not an admin.");

    await ctx.reply("⚙️ Admin Panel", getAdminKeyboard());
  });

  // Add ban word
  bot.hears("➕ Add a word to ban", async (ctx) => {
    if (ctx.chat.type !== "private") return;

    const admin = await getAdmin(ctx.from.id);
    if (!admin) return ctx.reply("❌ Not authorized.");

    waitingForBanPhrase[ctx.from.id] = true;

    await ctx.reply(
      "✍️ Send the word or phrase you want to ban:",
      Markup.inlineKeyboard([
        Markup.button.callback("❌ Cancel", "cancel_ban"),
      ]),
    );
  });

  // Add allowed number
  bot.hears("➕ Add allowed number", async (ctx) => {
    if (ctx.chat.type !== "private") return;

    const admin = await getAdmin(ctx.from.id);
    if (!admin) return ctx.reply("❌ Not authorized.");

    waitingForAllowedNumber[ctx.from.id] = true;

    await ctx.reply(
      "🔢 Send the number you want to allow:",
      Markup.inlineKeyboard([
        Markup.button.callback("❌ Cancel", "cancel_number"),
      ]),
    );
  });

  // Cancel ban word
  bot.action("cancel_ban", async (ctx) => {
    const userId = ctx.from.id;

    if (waitingForBanPhrase[userId]) {
      delete waitingForBanPhrase[userId];
      await ctx.answerCbQuery("Cancelled");
      await ctx.editMessageReplyMarkup();
      await ctx.reply("✅ Action cancelled.", getAdminKeyboard());
    } else {
      await ctx.answerCbQuery("Nothing to cancel");
    }
  });

  // Cancel allowed number
  bot.action("cancel_number", async (ctx) => {
    const userId = ctx.from.id;

    if (waitingForAllowedNumber[userId]) {
      delete waitingForAllowedNumber[userId];
      await ctx.answerCbQuery("Cancelled");
      await ctx.editMessageReplyMarkup();
      await ctx.reply("✅ Action cancelled.", getAdminKeyboard());
    } else {
      await ctx.answerCbQuery("Nothing to cancel");
    }
  });

  // Text handler
  bot.on("text", async (ctx, next) => {
    if (ctx.chat.type !== "private") return next();

    const userId = ctx.from.id;

    // Ban word
    if (waitingForBanPhrase[userId]) {
      const admin = await getAdmin(userId);
      if (!admin) {
        delete waitingForBanPhrase[userId];
        return ctx.reply("❌ Not authorized.", getAdminKeyboard());
      }

      const phrase = ctx.message.text.trim().toLowerCase();

      try {
        await BanWord.create({ word: phrase });
        await ctx.reply(`✅ Phrase added:\n"${phrase}"`);
      } catch (error) {
        if (error.code === 11000) await ctx.reply("⚠️ Phrase already exists.");
        else {
          await ctx.reply("❌ Failed to save phrase.");
          console.log(error);
        }
      }

      delete waitingForBanPhrase[userId];
      return;
    }

    // Allowed number
    if (waitingForAllowedNumber[userId]) {
      const admin = await getAdmin(userId);
      if (!admin) {
        delete waitingForAllowedNumber[userId];
        return ctx.reply("❌ Not authorized.", getAdminKeyboard());
      }

      const numberValue = Number(ctx.message.text.trim());

      if (isNaN(numberValue)) {
        return ctx.reply("❌ Please send a valid number.");
      }

      try {
        await NumberModel.create({ value: numberValue });
        await ctx.reply(`✅ Number ${numberValue} allowed.`);
      } catch (error) {
        if (error.code === 11000)
          await ctx.reply("⚠️ This number is already allowed.");
        else {
          await ctx.reply("❌ Failed to save number.");
          console.log(error);
        }
      }

      delete waitingForAllowedNumber[userId];
      return;
    }

    return next();
  });
};

module.exports = { adminCommands };
