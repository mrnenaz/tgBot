import { Telegraf, Markup, Scenes, Context, session } from "telegraf";
import { COMMANDS, COMMAND_NAMES } from "./constants";
import { whatWeatherNotIScene } from "./scenes/create";
import {
  start,
  startCreateGiveAway,
  startGetGiveawaysInfo,
  startGetInfo,
  startWhatWeather,
} from "./commands/commands";
import {
  handleCallbackBtnClick,
  handleGiveAwayCallbackBtnClick,
} from "./commands/actions";
import { callbackScene } from "./scenes/callback";
import { createGiveaway } from "./scenes/giveaway";
import { giveAwayCallbackScene } from "./scenes/giveawayCallback";
import { getGiveawaysInfo } from "./scenes/getGiveawaysInfo";
// import schedule from "node-schedule";

export const setupBot = async () => {
  const bot = new Telegraf(process.env.WebAppsNenazBot);
  const stage = new Scenes.Stage<any>([
    whatWeatherNotIScene,
    callbackScene,
    createGiveaway,
    giveAwayCallbackScene,
    getGiveawaysInfo,
  ]);
  bot.telegram.setMyCommands(COMMANDS);

  bot.use(session());
  bot.use(stage.middleware());

  bot.use((ctx, next) => {
    return next();
  });

  bot.command(COMMAND_NAMES.CREATE, async (ctx: any) => {
    const chatId = ctx.chat.id;
    console.log(`ID группы: ${chatId}`);
    return startWhatWeather(ctx);
  });

  bot.action(/send (.+)/, async (ctx) => {
    await handleCallbackBtnClick(ctx);
  });

  bot.action(/participation (.+)/, async (ctx) => {
    return handleGiveAwayCallbackBtnClick(ctx);
  });

  bot.command(COMMAND_NAMES.GET_INFO, async (ctx) => {
    return startGetInfo(ctx);
  });

  bot.command(COMMAND_NAMES.CREATE_GIVEAWAY, async (ctx: any) => {
    return startCreateGiveAway(ctx);
  });

  bot.command(COMMAND_NAMES.GET_GIVEAWAYS_INFO, async (ctx: any) => {
    return startGetGiveawaysInfo(ctx);
  });

  // const channel = -1002187274257;
  // const date = new Date(2025, 0, 9, 3, 44, 0);
  // const job = schedule.scheduleJob(date, function () {
  //   console.log("scheduleJob");
  //   bot.telegram.sendMessage(channel, "Событие сработало!");
  // });
  // console.log("job", job);

  return bot;
};
