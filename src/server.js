const { connectDB } = require("./config/db.js");

const startServer = async (app, bot, port) => {
  try {
    await connectDB();

    if (process.env.NODE_ENV === "production") {
      const WEBHOOK_PATH = "/telegram-webhook";
      const WEBHOOK_URL = `${process.env.WEBHOOK_BASE_URL}${WEBHOOK_PATH}`;

      app.post(WEBHOOK_PATH, (req, res) => {
        bot.handleUpdate(req.body);
        res.sendStatus(200);
      });

      await bot.telegram.setWebhook(WEBHOOK_URL);
      console.log(`Webhook set to ${WEBHOOK_URL}`);
    } else {
      bot.launch();
      console.log("Bot running in polling mode");
    }

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
};

module.exports = { startServer };
