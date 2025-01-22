import { Format, Markup, Scenes } from "telegraf";
import { BOT_EVENT_NAMES, SCENE_NAMES } from "../constants";
import {
  findAllGiveaway,
  findGiveaway,
  getGiveawayItemInfo,
  getGiveawayItemMemberInfo,
  updateGiveawayMemberInfo,
} from "../db/models/Giveaway";
import { getDateDDMMYYYY, getDateTime } from "../utils";

// let count = 0;

export const giveAwayCallbackScene: any = new Scenes.BaseScene(
  SCENE_NAMES.CALLBACK_GIVEAWAY
);

giveAwayCallbackScene.enter(async (ctx: any) => {
  const msgID = ctx.match[1];
  const member = await ctx.getChatMember(ctx.from.id);
  // найти текущий конкурс
  const item = await findGiveaway(msgID);
  // есть ли текущий пользователь в списке участников в текущем конкурсе
  const hasMember = await getGiveawayItemInfo(msgID, member.user.id);
  console.log("hasMember", hasMember);
  if (item[0].isActive === false) {
    const newMessage = "Конкурс завершен";
    if (item[0].type === "text") {
      try {
        await ctx.telegram.editMessageText(
          process.env.CHAT_ID,
          ctx.callbackQuery.message.message_id,
          null,
          newMessage
          // options
        );
      } catch (error) {
        console.log(error);
      }
    } else if (item[0].type === "photo") {
      try {
        await ctx.telegram.editMessageCaption(
          process.env.CHAT_ID,
          ctx.callbackQuery.message.message_id,
          null,
          newMessage
          // options
        );
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    if (hasMember.length === 0) {
      const newMember = {
        id: member.user.id,
        status: member.status,
        first_name: member.user.first_name,
        username: member.user.username,
      };
      // обновить список участников для текущего конкурса
      await updateGiveawayMemberInfo(msgID, newMember);
      await ctx.answerCbQuery("Участвую", {
        show_alert: true,
      });
    } else {
      await ctx.answerCbQuery("Уже участвуете", {
        show_alert: true,
      });
    }

    const dbMember = await getGiveawayItemMemberInfo(
      msgID,
      String(member.user.id)
    );

    // обновить данные о конкурсе после добавления участника
    const itemUPD = await findGiveaway(msgID);
    // найти количество участников
    const count = itemUPD[0].memberInfo.length;

    const humanDate = getDateTime();
    if (dbMember) {
      const newMessage = `${itemUPD[0].description}\n(${count})Участвуют на ${humanDate}\nЗавершение ${itemUPD[0].dateTo}`;
      // ctx.reply(
      //   Format.fmt(
      //     [
      //       Format.italic("Введите описание c фото или без."),
      //       "Это описание будет отображаться при публикации",
      //       Format.bold("Пример:"),
      //     ],
      //     " "
      //   )
      // );
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              Markup.button.callback(
                "Участвовать",
                `${BOT_EVENT_NAMES.participation} ${msgID}`
              ),
            ],
          ],
        },
        parse_mode: "HTML",
      };
      if (itemUPD[0].type === "text") {
        try {
          await ctx.telegram.editMessageText(
            process.env.CHAT_ID,
            ctx.callbackQuery.message.message_id,
            null,
            newMessage,
            options
          );
        } catch (error) {
          console.log(error);
        }
      } else if (itemUPD[0].type === "photo") {
        try {
          await ctx.telegram.editMessageCaption(
            process.env.CHAT_ID,
            ctx.callbackQuery.message.message_id,
            null,
            newMessage,
            options
          );
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      console.log("!!!dbMember");
    }
  }
});
