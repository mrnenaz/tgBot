import {
  findGiveaway,
  getActiveGiveaways,
  getEndedGiveaways,
  getGiveawaInfo,
  // getMemberCount,
  Giveaway,
  updateGiveaway,
} from "../db/models/Giveaway";
import { BOT_EVENT_NAMES, CMD_TEXT, SCENE_NAMES } from "../constants";
import { Markup, Scenes } from "telegraf";
import { getRandomInt } from "../db/utils";

export const getGiveawaysInfo: any = new Scenes.BaseScene(
  SCENE_NAMES.GET_GIVEAWAYS_INFO
);

getGiveawaysInfo.enter(async (ctx: any) => {
  await ctx.reply(
    "Какие конкурсы показать?",
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          CMD_TEXT.giveawaysTexts.all,
          BOT_EVENT_NAMES.giveaways.all
        ),
      ],
      [
        Markup.button.callback(
          CMD_TEXT.giveawaysTexts.active,
          BOT_EVENT_NAMES.giveaways.active
        ),
        Markup.button.callback(
          CMD_TEXT.giveawaysTexts.ended,
          BOT_EVENT_NAMES.giveaways.ended
        ),
      ],
      [Markup.button.callback(CMD_TEXT.cansel2, BOT_EVENT_NAMES.cancel)],
    ])
  );
});

getGiveawaysInfo.action(BOT_EVENT_NAMES.giveaways.active, async (ctx: any) => {
  // ctx.scene.state.giveaways = "all";
  console.log(BOT_EVENT_NAMES.giveaways.active);
  const activeGiveaways = await getActiveGiveaways();
  const markupButtons = activeGiveaways.map((item: Giveaway) => {
    return [
      Markup.button.callback(item.title, `giveaway_active ${item.messageId}`),
    ];
  });
  await ctx.sendMessage("Выбрать из активных конкурсов", {
    reply_markup: {
      inline_keyboard: [...markupButtons],
    },
  });
});

getGiveawaysInfo.action(BOT_EVENT_NAMES.giveaways.all, async (ctx: any) => {
  ctx.scene.state.giveaways = "active";
  console.log(BOT_EVENT_NAMES.giveaways.active);
  ctx.reply("Все конкурсы");
});

getGiveawaysInfo.action(BOT_EVENT_NAMES.giveaways.ended, async (ctx: any) => {
  // ctx.scene.state.giveaways = "ended";
  // console.log(BOT_EVENT_NAMES.giveaways.ended);
  // ctx.reply("Завершенные конкурсы");
  console.log(BOT_EVENT_NAMES.giveaways.active);
  const activeGiveaways = await getEndedGiveaways();
  const markupButtons = activeGiveaways.map((item: Giveaway) => {
    return [Markup.button.callback(item.title, `giveaway_ended ${item.id}`)];
  });
  await ctx.sendMessage("Выбрать из завершенных конкурсов", {
    reply_markup: {
      inline_keyboard: [...markupButtons],
    },
  });
});

// обработка нажатия кнопки выбора конкурса
getGiveawaysInfo.action(/giveaway_active (.+)/, async (ctx: any) => {
  const giveawayId = ctx.match[1];
  ctx.scene.state.giveaway = giveawayId;
  console.log("giveawayId", giveawayId);
  const giveaway = await findGiveaway(giveawayId);
  console.log("giveaway", giveaway);
  await ctx.reply(
    "Выбрать действие: ",
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          CMD_TEXT.giveawaysTexts.actions.users,
          BOT_EVENT_NAMES.giveaways.actions.users
        ),
      ],
      [
        Markup.button.callback(
          CMD_TEXT.giveawaysTexts.actions.finally,
          BOT_EVENT_NAMES.giveaways.actions.finally
        ),
      ],
      [
        Markup.button.callback(
          CMD_TEXT.giveawaysTexts.actions.close,
          BOT_EVENT_NAMES.giveaways.actions.close
        ),
      ],
      [Markup.button.callback(CMD_TEXT.back, BOT_EVENT_NAMES.cancel)],
    ])
  );
});

// завершить конкурс
getGiveawaysInfo.action(BOT_EVENT_NAMES.giveaways.actions.finally, (ctx) => {
  ctx.reply("Завершить конкурс?", {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(CMD_TEXT.yes, BOT_EVENT_NAMES.yes)],
        [Markup.button.callback(CMD_TEXT.no, BOT_EVENT_NAMES.back)],
      ],
    },
  });
});

// ДА, завершить конкурс
getGiveawaysInfo.action(BOT_EVENT_NAMES.yes, async (ctx) => {
  const info: any[] = await getGiveawaInfo(ctx.scene.state.giveaway);
  const membersCount = info[0].memberInfo.length;

  if (membersCount === 0) {
    await ctx.reply("Никто не участвует в конкурсе");
  } else if (membersCount === 1) {
    await ctx.reply(`Победитель: ${info[0].memberInfo[0].username}`);
  } else {
    const number: number = getRandomInt(0, membersCount);
    await ctx.reply(`Победитель: ${info[0].memberInfo[number].username}`);
  }
  await updateGiveaway(ctx.scene.state.giveaway);
  await ctx.reply(`Конкурс "${info[0].title}" завершен`);
  return ctx.scene.leave();
});

// BOT_EVENT_NAMES.giveaways.actions.users

getGiveawaysInfo.action(BOT_EVENT_NAMES.cancel, (ctx) => {
  ctx.reply("Отмена");
  return ctx.scene.leave();
});
