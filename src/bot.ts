import { Telegraf, Markup, Scenes, Context, session } from "telegraf";
// import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { inspect } from "util";
import {
  BOT_EVENT_NAMES,
  CMD_TEXT,
  COMMANDS,
  COMMAND_NAMES,
  SCENE_NAMES,
} from "./constants";
import { connectDB, TGPosts, TGLogs } from "./db";
import { uniqueItems } from "./utils";
// import { init } from "./init";
import { CreateCommand } from "./commands/create";
import { whatWeatherNotIScene } from "./scenes/create";
import {
  SceneContextScene,
  SceneSession,
  SceneSessionData,
} from "telegraf/typings/scenes";
import { Update } from "telegraf/typings/core/types/typegram";
import { SessionContext } from "telegraf/typings/session";
import {
  start,
  startCreateGiveAway,
  startWhatWeather,
} from "./commands/commands";
import {
  handleCallbackBtnClick,
  handleGiveAwayCallbackBtnClick,
} from "./commands/actions";
import { callbackScene } from "./scenes/callback";
import { createGiveaway } from "./scenes/giveaway";
import { giveAwayCallbackScene } from "./scenes/giveawayCallback";
// import { session } from "telegraf-session-mongoose";
// import { Update } from 'telegraf/types'
// ts-ignore
// (async () => {
// dotenv.config();
// await connectDB();
export const setupBot = async () => {
  const bot = new Telegraf(process.env.WebAppsNenazBot);
  const stage = new Scenes.Stage<any>([
    whatWeatherNotIScene,
    callbackScene,
    createGiveaway,
    giveAwayCallbackScene,
  ]);
  // const stage = new Scenes.Stage([
  //   // new Scenes.BaseScene("create", async (ctx: any) => {
  //   //   await ctx.reply("Welcome to the bot!");
  //   //   return ctx.scene.enter("create");
  //   // }),
  //   new Scenes.BaseScene("create")
  // ]);
  // const stage = new Scenes.BaseScene<
  //   SessionContext<SceneSession> & {
  //   scene: SceneContextScene<Context<Update>, SceneSessionData>;
  // }>([
  //   new Scenes.BaseScene<Context>(SCENE_NAMES.CREATE, async (ctx: any) => {
  //     await ctx.reply("Welcome to the bot!");
  //     return ctx.scene.enter("create");
  // ]);
  bot.telegram.setMyCommands(COMMANDS);

  bot.use(session());
  bot.use(stage.middleware());

  bot.use((ctx, next) => {
    return next();
  });

  bot.command(COMMAND_NAMES.CREATE, async (ctx: any) => {
    return startWhatWeather(ctx);
  });

  bot.action(/send (.+)/, async (ctx) => {
    await handleCallbackBtnClick(ctx);
  });

  bot.action(/participation (.+)/, async (ctx) => {
    // console.log("ctx", ctx.callbackQuery.message.message_id);
    return handleGiveAwayCallbackBtnClick(ctx);
  });

  bot.command(COMMAND_NAMES.CREATE_GIVEAWAY, async (ctx: any) => {
    return startCreateGiveAway(ctx);
  });
  // bot.hears(CMD_TEXT.create, startWhatWeather);
  // bot.hears(CMD_TEXT.weaterI, startWhatWeather);
  // bot.action(BOT_EVENT_NAMES.create, (ctx) => {
  //   console.log("ctx", ctx);
  //   return startWhatWeather(ctx);
  // });

  // const POST_DATA = {};
  // const bot = await init(process.env.WebAppsNenazBot);
  // const stage = new Telegraf.Stage([createScene]);
  // bot.telegram.getWebhookInfo().then((info: any) => {
  //   console.log("webhook inf2", info);
  //   if (info.ok) {
  //     console.log("webhook info", info);
  //   }
  // });
  // bot.command(COMMAND_NAMES.CREATE, async (ctx) => {
  //   console.log(COMMAND_NAMES.CREATE);
  //   // await CreateCommand(ctx);
  // });
  // bot.on('callback_query', async (ctx) => {
  //   await createScene.enter(ctx);
  // }
  // bot.launch();
  // })();
  return bot;
};
