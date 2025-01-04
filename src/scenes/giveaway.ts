import { Markup, Scenes, Telegraf } from "telegraf";
import { BOT_EVENT_NAMES, CMD_TEXT, SCENE_NAMES } from "../constants";
import { Giveaway, insertGiveaway } from "../db/models/Giveaway";
import { v4 as uuidv4 } from "uuid";

const stepOne = Telegraf.on("text", async (ctx: any) => {
  console.log("stepOne");
  ctx.scene.state.giveaway.title = ctx.message.text;
  ctx.reply(
    "Введите описание c фото или без. Это описание будет отображаться при публикации"
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
    `Введите дату окончания ${ctx.scene.state.giveaway.title} в формате дд.мм.гггг`
  );
  return ctx.wizard.next();
});

const stepThree = Telegraf.on("text", async (ctx: any) => {
  console.log("stepThree");
  ctx.scene.state.giveaway.dateTo = ctx.message.text;
  ctx.reply(
    "Конкурс запустится сразу после публикации",
    Markup.inlineKeyboard([
      Markup.button.callback(
        CMD_TEXT.giveawayPublish,
        BOT_EVENT_NAMES.publication
      ),
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
      Markup.button.callback(CMD_TEXT.createGiveaway, BOT_EVENT_NAMES.create),
    ])
  );
});

createGiveaway.action(BOT_EVENT_NAMES.create, async (ctx) => {
  ctx.scene.state.giveaway = {};
  console.log(BOT_EVENT_NAMES.create);
  ctx.reply("Введите название События. Не будет показано пользователям");
});

createGiveaway.action(BOT_EVENT_NAMES.publication, async (ctx) => {
  const oprosUid = uuidv4();
  // console.log("oprosUid", oprosUid);
  if (ctx.scene.state.giveaway.type === "text") {
    ctx.sendMessage(ctx.scene.state.giveaway.description, {
      chat_id: process.env.CHAT_ID,
      caption: ctx.scene.state.giveaway.description,
      text: ctx.scene.state.giveaway.description,
      type: ctx.scene.state.giveaway.type,
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
    });
  } else if (ctx.scene.state.giveaway.type === "photo") {
    await ctx.sendPhoto(ctx.scene.state.giveaway.photo, {
      chat_id: process.env.CHAT_ID,
      caption: ctx.scene.state.giveaway.description,
      text: ctx.scene.state.giveaway.title,
      type: ctx.scene.state.giveaway.type,
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
    });
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
