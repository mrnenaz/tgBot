import { connectDB } from "./db";
import { Scenes, session, Telegraf } from "telegraf";
import { COMMANDS } from "./constants";
// import { createScene } from "./scenes/create";

// export const init = async (token: string) => {
//   try {
//     await connectDB();
//     const bot = new Telegraf(token);
//     const stage = new Scenes.Stage([createScene]);
//     bot.telegram.setMyCommands(COMMANDS);
//     bot.use(session());
//     // bot.use(session({ collectionName: "sessions" }));
//     bot.use(stage.middleware());
//     bot.launch();
//     return bot;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };
