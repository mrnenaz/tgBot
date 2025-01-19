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
import { parse } from "path";

export const getGiveawaysInfo: any = new Scenes.BaseScene(
  SCENE_NAMES.GET_GIVEAWAYS_INFO
);

getGiveawaysInfo.enter(async (ctx: any) => {
  await ctx.reply(
    "Какие конкурсы показать?",
    Markup.inlineKeyboard([
      // [
      //   Markup.button.callback(
      //     `(Не работает) ${CMD_TEXT.giveawaysTexts.all}`,
      //     BOT_EVENT_NAMES.giveaways.all
      //   ),
      // ],
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
  const activeGiveaways = await getActiveGiveaways();
  const markupButtons = activeGiveaways.map((item: Giveaway) => {
    return [
      Markup.button.callback(item.title, `giveaway_active ${item.messageId}`),
    ];
  });
  await ctx.sendMessage("Выбрать из активных конкурсов", {
    reply_markup: {
      inline_keyboard: [
        ...markupButtons,
        [Markup.button.callback(CMD_TEXT.back, BOT_EVENT_NAMES.back)],
      ],
    },
  });
});

getGiveawaysInfo.action(BOT_EVENT_NAMES.giveaways.all, async (ctx: any) => {
  ctx.scene.state.giveaways = "active";
  console.log(BOT_EVENT_NAMES.giveaways.active);
  ctx.reply("Все конкурсы");
});

getGiveawaysInfo.action(BOT_EVENT_NAMES.giveaways.ended, async (ctx: any) => {
  const activeGiveaways = await getEndedGiveaways();
  const markupButtons = activeGiveaways.map((item: Giveaway) => {
    return [
      Markup.button.callback(item.title, `giveaway_ended ${item.messageId}`),
    ];
  });
  await ctx.sendMessage("Выбрать из завершенных конкурсов", {
    reply_markup: {
      inline_keyboard: [
        ...markupButtons,
        [Markup.button.callback(CMD_TEXT.back, BOT_EVENT_NAMES.back)],
      ],
    },
  });
});

// обработка нажатия кнопки выбора АКТИВНОГО конкурса
getGiveawaysInfo.action(/giveaway_active (.+)/, async (ctx: any) => {
  const giveawayId = ctx.match[1];
  ctx.scene.state.giveaway = giveawayId;
  console.log("giveawayId", giveawayId);
  const giveaway = await findGiveaway(giveawayId);
  console.log("giveaway", giveaway);
  await ctx.reply(
    `Выбрать действие над ${giveaway[0].title}:`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          CMD_TEXT.giveawaysTexts.actions.info,
          BOT_EVENT_NAMES.giveaways.actions.info
        ),
      ],
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
      [Markup.button.callback(CMD_TEXT.back, BOT_EVENT_NAMES.back)],
    ])
  );
});

// обработка нажатия кнопки выбора ЗАВЕРШЕННОГО конкурса
getGiveawaysInfo.action(/giveaway_ended (.+)/, async (ctx: any) => {
  const giveawayId = ctx.match[1];
  const giveaway = await findGiveaway(giveawayId);
  console.log("giveaway[0]", giveaway[0]);
  const winner =
    typeof giveaway[0].winner === "string"
      ? giveaway[0].winner
      : giveaway[0].winner.username;
  await ctx.sendMessage(
    `<b>Конкурс:</b> ${giveaway[0].title}\n<b>Дата завершения:</b> ${giveaway[0].endDate}\n<b>Победитель:</b> ${winner}`,
    {
      parse_mode: "HTML",
    }
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
  let member = null;

  if (membersCount === 0) {
    await ctx.reply("Никто не участвует в конкурсе");
  } else if (membersCount === 1) {
    member = info[0].memberInfo[0];
    await ctx.reply(`Победитель: ${member.username}`);
  } else {
    const num: number = getRandomInt(0, membersCount);
    member = info[0].memberInfo[num];
    await ctx.reply(`Победитель: ${member.username}`);
  }
  const winner = member ? member : "Никто не участвовал в конкурсе";
  await updateGiveaway(ctx.scene.state.giveaway, {
    isActive: false,
    winner,
  });
  await ctx.reply(`Конкурс "${info[0].title}" завершен`);
  return ctx.scene.leave();
});

getGiveawaysInfo.action(BOT_EVENT_NAMES.giveaways.actions.info, async (ctx) => {
  const info: any[] = await getGiveawaInfo(ctx.scene.state.giveaway);
  ctx.reply(
    `<b>Конкурс:</b> ${info[0].title}\n<b>Предполагаемая дата завершения:</b> ${info[0].dateTo}\n<b>Количество участников:</b> ${info[0].memberInfo.length}`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(CMD_TEXT.back, BOT_EVENT_NAMES.back)],
        ],
      },
    }
  );
});

getGiveawaysInfo.action(
  BOT_EVENT_NAMES.giveaways.actions.users,
  async (ctx) => {
    const info: any[] = await getGiveawaInfo(ctx.scene.state.giveaway);
    ctx.reply(
      `<b>Конкурс:</b> ${info[0].title}\n<b>Участники:</b> ${info[0].memberInfo
        .map((member) => member.username)
        .join("\n")}`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(CMD_TEXT.back, BOT_EVENT_NAMES.back)],
          ],
        },
      }
    );
  }
);

// завершить конкурс досрочно
getGiveawaysInfo.action(
  BOT_EVENT_NAMES.giveaways.actions.close,
  async (ctx) => {
    ctx.reply("Завершить конкурс досрочно?", {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(CMD_TEXT.yes, BOT_EVENT_NAMES.yes_force)],
          [Markup.button.callback(CMD_TEXT.no, BOT_EVENT_NAMES.back)],
        ],
      },
    });
  }
);

// ДА, завершить досрочно
getGiveawaysInfo.action(BOT_EVENT_NAMES.yes_force, async (ctx) => {
  await updateGiveaway(ctx.scene.state.giveaway, {
    isActive: false,
    winner: "Досрочное завершение",
  });
  await ctx.reply(`Конкурс "${ctx.scene.state.giveaway}" завершен`);
  return ctx.scene.leave();
});

getGiveawaysInfo.action(BOT_EVENT_NAMES.back, async (ctx) => {
  console.log("BOT_EVENT_NAMES.back");
  await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
});

getGiveawaysInfo.action(BOT_EVENT_NAMES.cancel, async (ctx) => {
  await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  ctx.reply(CMD_TEXT.cansel3);
  return ctx.scene.leave();
});
