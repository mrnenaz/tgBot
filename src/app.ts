import dotenv from "dotenv";
import { connectDB } from "./db";
import { setupBot } from "./bot";

(async () => {
  try {
    dotenv.config();
    await connectDB();
    const bot: any = await setupBot();
    bot.launch();
    console.log("</ Бот успешно запущен >");
  } catch (error) {
    console.log("Ошибка запуска: ", error);
  }
})();
