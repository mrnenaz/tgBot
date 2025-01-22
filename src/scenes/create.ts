import { Scenes, Telegraf, Composer, Markup } from "telegraf";
import { v4 as uuidv4 } from "uuid";
import { BOT_EVENT_NAMES, CMD_TEXT, SCENE_NAMES } from "../constants";
import {
  addPhoto,
  CallbackButtons,
  canselPost,
  createPostBtn,
  publicStepBtn,
} from "../bottoms/bottoms";
import { channelAccessCheck } from "../helpers/accessCheck";
import {
  findLogs,
  findPost,
  insertMemberInfo,
  insertPost,
  updateLogs,
} from "../db/utils";

let buttonsCount = 0;

// post title
const stepTitle = new Composer();
stepTitle.on("text", async (ctx: any) => {
  ctx.reply("Введите название поста (не будет отображаться)", canselPost);
  // console.log("numberText", numberText);
  // const uuid = uuidv4();
  ctx.scene.state.post = {};
  return ctx.wizard.next();
});
// const stepOne = Telegraf.on("text", async (ctx: any) => {
//   const msg = ctx.message;
//   const numberText = msg.text;
//   ctx.reply("Введите название поста (не будет отображаться)", canselPost);
//   // console.log("numberText", numberText);
//   // ctx.scene.state.title = numberText;
//   ctx.wizard.next();
// });

// post description
const stepTwo = Telegraf.on("text", async (ctx: any) => {
  const msg = ctx.message;
  ctx.scene.state.post.id = uuidv4();
  ctx.scene.state.post.title = msg.text;
  console.log("stepTwo msg", msg);
  await ctx.reply("Введете текст поста", canselPost);
  return await ctx.wizard.next();
});

// post photo
const stepThree = Telegraf.on("text", async (ctx: any) => {
  const msg = ctx.message;
  ctx.scene.state.post.description = msg.text;
  // console.log("ctx.scene.state", ctx.scene.state);
  await ctx.reply("Теперь добавьте картинку", canselPost);
  return await ctx.wizard.next();
});

const stepFour = Telegraf.on("photo", async (ctx: any) => {
  console.log("stepFour", ctx.message.photo[0].file_id);
  ctx.scene.state.post.photo = ctx.message.photo[0].file_id;
  return await ctx.reply("Добавить кнопки к посту?", CallbackButtons);
  // return ctx.wizard.next();
});

const stepFive = Telegraf.on("text", async (ctx: any) => {
  console.log("stepFive");
  // ctx.scene.state[`button_${buttonsCount}_Caption`] = {
  //   // id: ctx.update.message.message_id,
  //   text: ctx.message.text,
  // };
  // ctx.scene.state.post[`button_${buttonsCount}_Caption`] = ctx.message.text;
  ctx.scene.state.post.buttonCaption = ctx.message.text;
  await ctx.reply("Введите текст который будет показан при нажатии");
  return await ctx.wizard.next();
});

const stepSix = Telegraf.on("text", async (ctx: any) => {
  console.log("stepSix");
  ctx.scene.state.post.buttonText = ctx.message.text;
  // ctx.scene.state.post[`button_${buttonsCount}_Text`] = ctx.message.text;
  // ctx.scene.state[`button_${buttonsCount}_Text`] = {
  //   // id: ctx.update.message.message_id,
  //   text: ctx.message.text,
  // };
  // buttonsCount++;

  // const uuid = uuidv4();
  // POST_DATA.buttons = {
  //   ...POST_DATA.buttons,
  //   [uuid]: {
  //     button: Markup.button.callback(buttonCaption, `send ${uuid}`),
  //     callbackText: buttonText,
  //   },
  // };
  const buttonCaption = ctx.scene.state.post.buttonCaption;
  const buttonText = ctx.scene.state.post.buttonText;
  // ctx.scene.state.buttons = {
  //   ...ctx.scene.state.buttons,
  //   [uuid]: {
  //     button: Markup.button.callback(buttonCaption, `send ${uuid}`),
  //     callbackText: buttonText,
  //   },
  // };
  const uuid = uuidv4();
  ctx.scene.state.post.buttons = {
    ...ctx.scene.state.post.buttons,
    [uuid]: {
      button: Markup.button.callback(buttonCaption, `send ${uuid}`),
      callbackText: buttonText,
    },
  };

  await ctx.reply("Кнопка создана и будет добавлена к посту");
  buttonsCount++;
  console.log("ctx.wizard.cursor", ctx.wizard.cursor);
  ctx.wizard.selectStep(ctx.wizard.cursor - 2);
  return await ctx.reply(
    "Добавить кнопки к посту?",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("Добавить", BOT_EVENT_NAMES.addButton),
        Markup.button.callback("Продолжить", BOT_EVENT_NAMES.next),
      ],
      [Markup.button.callback(CMD_TEXT.cansel, BOT_EVENT_NAMES.cancel)],
    ])
  );
  // return await ctx.wizard.back();
  //   ctx.scene.state[`button_${buttonsCount}_Caption`] = {
  //     id: ctx.update.message.message_id,
  //     text: ctx.message.text,
  //   };
  //   // ctx.scene.state.buttonCaption = ctx.message.text;
  //   ctx.reply("Введите текст который будет показан при нажатии");
  //   return ctx.wizard.next();
});

const stepSeven = Telegraf.on("text", async (ctx: any) => {
  console.log("stepSeven");
  await ctx.reply("Опубликовать?", {
    reply_markup: {
      inline_keyboard: [
        Markup.button.callback("Опубликовать", BOT_EVENT_NAMES.publication),
        Markup.button.callback("Предпросмотр", BOT_EVENT_NAMES.preview),
        Markup.button.callback("Cбросить публикацию", BOT_EVENT_NAMES.reset),
      ],
    },
  });
});

// const stepEight = Telegraf.on("text", async (ctx: any) => {
//   console.log("stepEight");
// });

export const createScene: any = new Scenes.WizardScene(
  SCENE_NAMES.CREATE,
  stepTitle,
  stepTwo,
  stepThree,
  stepFour,
  stepFive,
  stepSix,
  stepSeven
  // stepEight
);

const wizsteps = {};

createScene.enter = async (ctx) => {
  await ctx.reply("rexff");
};

createScene.action(BOT_EVENT_NAMES.skip, (ctx) => {
  // console.log("ctx.wizard", ctx.wizard);
  // return ctx.wizard.next(stepFive, { skip: true });
});

createScene.action(BOT_EVENT_NAMES.addButton, async (ctx) => {
  ctx.reply("Введите заголовок кнопки");
  return ctx.wizard.next();
});

createScene.action(BOT_EVENT_NAMES.next, async (ctx) => {
  console.log("BOT_EVENT_NAMES.next");
  console.log("ctx.wizard.cursor", ctx);
  await ctx.reply(
    "Опубликовать?",
    Markup.inlineKeyboard([
      Markup.button.callback("Опубликовать", BOT_EVENT_NAMES.publication),
      Markup.button.callback("Предпросмотр", BOT_EVENT_NAMES.preview),
      Markup.button.callback("Cбросить публикацию", BOT_EVENT_NAMES.reset),
    ])
  );
  // console.log("ctx.state", ctx.scene.state);

  // console.log("ctx.wizard.cursor", ctx.wizard.setC);
  // ctx.reply("Введите заголовок кнопки");
  // return ctx.wizard.next();
  // ctx.telegraf.action(BOT_EVENT_NAMES.publication, ctx);
  // return ctx.wizard.next();
});

createScene.action(BOT_EVENT_NAMES.publication, async (ctx) => {
  // console.log("ctx.state", ctx.scene.state);
  // ctx.reply("Введите заголовок кнопки");
  // return ctx.wizard.next();
  const buttons = ctx.scene.state.post.buttons;
  const allBtn = Object.values(buttons).map((button: any) => button.button);
  console.log("allBtn", allBtn);
  await ctx.sendPhoto(ctx.scene.state.post.photo, {
    chat_id: process.env.CHAT_ID,
    caption: ctx.scene.state.post.title,
    text: ctx.scene.state.post.description,
    reply_markup: {
      inline_keyboard: [[...allBtn]],
    },
  });
  console.log("ctx.scene.state.post", ctx.scene.state.post);
  await insertPost(ctx.scene.state.post);
  ctx.reply("Добавлено!");
  return ctx.scene.leave();
});

createScene.action(BOT_EVENT_NAMES.cancel, (ctx) => {
  console.log("BOT_EVENT_NAMES.cancel");
  ctx.reply("Публикация отменена");
  return ctx.scene.leave();
});

createScene.action(/send (.+)/, async (ctx) => {
  console.log("send");
  const useHasAccess = await channelAccessCheck(ctx);
  if (useHasAccess) {
    const member = await ctx.getChatMember(ctx.from.id);
    let msgID = ctx.match[1];
    const btnData = await findPost(msgID);

    const logsData = await findLogs(msgID);

    if (logsData.length > 0) {
      const buttonClickObject = logsData[0];
      if (
        buttonClickObject.buttons[msgID].memberInfo &&
        buttonClickObject.buttons[msgID].memberInfo.length
      ) {
        buttonClickObject.buttons[msgID].memberInfo.push(member);
      } else {
        buttonClickObject.buttons[msgID].memberInfo = [member];
      }
      if (buttonClickObject.memberInfo && buttonClickObject.memberInfo.length) {
        buttonClickObject.memberInfo.push(member);
      } else {
        buttonClickObject.memberInfo = [member];
      }
      await updateLogs(buttonClickObject.id, buttonClickObject);
    } else {
      const buttonClickObject = {
        id: btnData[0].id,
        title: btnData[0].title,
        description: btnData[0].description,
        buttons: {
          ...btnData[0].buttons,
        },
        memberInfo: [],
      };
      buttonClickObject.buttons[msgID].memberInfo = [member];
      buttonClickObject.memberInfo = [member];
      await insertMemberInfo(buttonClickObject);
    }

    const buttons = ctx.scene.state.buttons;

    if (btnData && btnData.length > 0) {
      await ctx.answerCbQuery(btnData[0].buttons[msgID].callbackText, {
        show_alert: true,
      });
    } else {
      await ctx.answerCbQuery(buttons[msgID].callbackText, {
        show_alert: true,
      });
    }
  } else {
    await ctx.answerCbQuery("Для просмотра подпишитесь на канал", {
      show_alert: true,
    });
  }
});

createScene.leave(async (ctx) => {
  return ctx.scene.leave();
});

// createScene.action(BOT_EVENT_NAMES.createPostBtn, async (ctx) => {
//   ctx.reply("Кнопка создана и будет добавлена к посту");
//   // return ctx.reply("Добавить кнопку к посту?", createPostBtn);
//   // ctx.wizard.selectStep();
//   // ctx.action(BOT_EVENT_NAMES.createPostBtn);
//   // return ctx.wizard.selectStep([ctx.wizard.cursor - 1]);
//   createScene.reenter();
// });

// createScene.on("text", (ctx) => {
//   console.log("ctx.message", ctx.message);
// });
// export const createScene = new Scenes.WizardScene(SCENE_NAMES.CREATE);

// createScene.enter(async (ctx) => {
//   await ctx.reply("Создать пост?", {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "Создать",
//             callback_data: BOT_EVENT_NAMES.create,
//           },
//           {
//             text: "Нет",
//             callback_data: BOT_EVENT_NAMES.cancel,
//           },
//         ],
//       ],
//     },
//   });
// });

// const stepOne = Telegraf.on("text", async (ctx) => {
//   await ctx.reply("Введете текст поста");
// });

// createScene.on("text", async (ctx: any) => {
//   await ctx.reply("Введете текст поста");
// });

// createScene.hears(CMD_TEXT.menu, (ctx: any) => {
//   ctx.scene.leave();
// });
