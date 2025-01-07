import { Format, Markup, Scenes, Telegraf } from "telegraf";
import { BOT_EVENT_NAMES, CMD_TEXT, SCENE_NAMES } from "../constants";
import { Giveaway, insertGiveaway } from "../db/models/Giveaway";
import { v4 as uuidv4 } from "uuid";
import { canselPost } from "../bottoms/bottoms";
import { parse } from "path";

const stepOne = Telegraf.on("text", async (ctx: any) => {
  console.log("stepOne", ctx.message);
  ctx.scene.state.giveaway.title = ctx.message.text;
  ctx.reply(
    Format.fmt(
      [
        Format.italic("Введите описание c фото или без."),
        "Это описание будет отображаться при публикации",
        Format.bold("Пример:"),
      ],
      " "
    )
  );
  return ctx.wizard.next();
});

const stepTwo = Telegraf.on("message", async (ctx: any) => {
  console.log("stepOne");
  if (ctx.message.photo) {
    ctx.scene.state.giveaway.photo = ctx.message.photo[0].file_id;
    ctx.scene.state.giveaway.description = ctx.message.caption;
    ctx.scene.state.giveaway.type = "photo";
  } else if (ctx.message.text) {
    ctx.scene.state.giveaway.description = ctx.message.text;
    ctx.scene.state.giveaway.type = "text";
  }
  ctx.reply(
    `Введите дату окончания "${ctx.scene.state.giveaway.title}" в формате дд.мм.гггг`,
    Markup.inlineKeyboard([
      [Markup.button.callback(CMD_TEXT.cansel, BOT_EVENT_NAMES.cancel)],
    ])
  );
  return ctx.wizard.next();
});

const stepThree = Telegraf.on("text", async (ctx: any) => {
  console.log("stepThree");
  ctx.scene.state.giveaway.dateTo = ctx.message.text;
  ctx.reply(
    "Конкурс запустится сразу после публикации",
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          CMD_TEXT.giveawayPublish,
          BOT_EVENT_NAMES.publication
        ),
      ],
      [Markup.button.callback(CMD_TEXT.cansel, BOT_EVENT_NAMES.cancel)],
    ])
  );
});

export const createGiveaway: any = new Scenes.WizardScene(
  SCENE_NAMES.CREATE_GIVEAWAY,
  stepOne,
  stepTwo,
  stepThree
);

createGiveaway.enter(async (ctx: any) => {
  await ctx.reply(
    "Создать Giveaway?",
    Markup.inlineKeyboard([
      [Markup.button.callback(CMD_TEXT.createGiveaway, BOT_EVENT_NAMES.create)],
      [Markup.button.callback(CMD_TEXT.cansel, BOT_EVENT_NAMES.cancel)],
    ])
  );
});

createGiveaway.action(BOT_EVENT_NAMES.create, async (ctx) => {
  ctx.scene.state.giveaway = {};
  console.log(BOT_EVENT_NAMES.create);
  ctx.reply(
    "Введите название События. Не будет показано пользователям",
    canselPost
  );
});

createGiveaway.action(BOT_EVENT_NAMES.publication, async (ctx) => {
  const oprosUid = uuidv4();
  // console.log("oprosUid", oprosUid);
  if (ctx.scene.state.giveaway.type === "text") {
    // const title = Format.spoiler(ctx.scene.state.giveaway.title);
    console.log("title", Format.bold(ctx.scene.state.giveaway.title, "bold"));
    // ctx.sendMessage(
    //   Format.bold(ctx.scene.state.giveaway.title, "bold") +
    //     "\n\n" +
    //     ctx.scene.state.giveaway.description,
    //   {
    //     chat_id: process.env.CHAT_ID,
    //     caption: ctx.scene.state.giveaway.title,
    //     text:
    //       Format.bold(ctx.scene.state.giveaway.title) +
    //       "\n\n" +
    //       ctx.scene.state.giveaway.description,
    //     // type: ctx.scene.state.giveaway.type,
    //     reply_markup: {
    //       inline_keyboard: [
    //         [
    //           Markup.button.callback(
    //             "Участвовать",
    //             `${BOT_EVENT_NAMES.participation} ${oprosUid}`
    //           ),
    //         ],
    //       ],
    //     },
    //   }
    // );
    await ctx.telegram.sendMessage(
      process.env.CHAT_ID,
      `<b>${ctx.scene.state.giveaway.title}</b>\n\n${ctx.scene.state.giveaway.description}`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              Markup.button.callback(
                "Участвовать",
                `${BOT_EVENT_NAMES.participation} ${oprosUid}`
              ),
            ],
          ],
        },
      }
    );
  } else if (ctx.scene.state.giveaway.type === "photo") {
    await ctx.telegram.sendPhoto(
      process.env.CHAT_ID,
      ctx.scene.state.giveaway.photo,
      {
        caption: `<b>${ctx.scene.state.giveaway.title}</b>\n\n${ctx.scene.state.giveaway.description}`,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              Markup.button.callback(
                "Участвовать",
                `${BOT_EVENT_NAMES.participation} ${oprosUid}`
              ),
            ],
          ],
        },
      }
    );
    // await ctx.sendPhoto(ctx.scene.state.giveaway.photo, {
    //   chat_id: process.env.CHAT_ID,
    //   caption: ctx.scene.state.giveaway.title,
    //   text: ctx.scene.state.giveaway.title,
    //   type: ctx.scene.state.giveaway.type,
    //   reply_markup: {
    //     inline_keyboard: [
    //       [
    //         Markup.button.callback(
    //           "Участвовать",
    //           `${BOT_EVENT_NAMES.participation} ${oprosUid}`
    //         ),
    //       ],
    //     ],
    //   },
    // });
  }
  const data: Giveaway = {
    id: uuidv4(),
    messageId: oprosUid,
    title: ctx.scene.state.giveaway.title,
    description: ctx.scene.state.giveaway.description,
    dateTo: ctx.scene.state.giveaway.dateTo,
    isActive: true,
    memberInfo: [],
    type: ctx.scene.state.giveaway.type,
  };
  console.log("data", data);
  insertGiveaway(data);
  ctx.reply("Успешно");
  return ctx.scene.leave();
});

createGiveaway.action(BOT_EVENT_NAMES.cancel, (ctx) => {
  ctx.reply("Отмена");
  return ctx.scene.leave();
});
