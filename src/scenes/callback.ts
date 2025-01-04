import { channelAccessCheck } from "../helpers/accessCheck";
import { SCENE_NAMES } from "../constants";
import { Composer, Scenes } from "telegraf";
import { findLogs, findPost, insertMemberInfo, updateLogs } from "../db/utils";

// const stepOne = new Composer();
// stepTitle.action("text", async (ctx: any) => {
//   ctx.reply("Введите название поста (не будет отображаться)", canselPost);
//   // console.log("numberText", numberText);
//   // ctx.scene.state.title = numberText;
//   return ctx.wizard.next();
// });

export const callbackScene: any = new Scenes.BaseScene(SCENE_NAMES.CALLBACK);

callbackScene.enter(async (ctx: any) => {
  console.log("выходим со сцены enter");
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

// callbackScene.hears(/send (.+)/, (ctx) => {
//   console.log("выходим со сцены on");
//   // ctx.scene.leave();
//   // return ctx.scene.leave();
// });

// callbackScene.action("text", (ctx) => {
//   console.log("выходим со сцены action");
//   // ctx.scene.leave();
//   return ctx.scene.leave();
// });
// callbackScene.on("text", (ctx) => {
//   console.log("выходим со сцены action");
//   // ctx.scene.leave();
//   return ctx.scene.leave();
// });
