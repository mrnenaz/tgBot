import { Markup } from "telegraf";
import { BOT_EVENT_NAMES } from "../constants";

export const CreateCommand = async (ctx: any) => {
  // POST_DATA.createCommandId = ctx.update.message.message_id;
  await ctx.reply("Создать пост?", {
    reply_markup: {
      inline_keyboard: [
        [
          Markup.button.callback("Создать", BOT_EVENT_NAMES.create),
          Markup.button.callback("Нет", BOT_EVENT_NAMES.cancel),
        ],
      ],
    },
  });
  // activeStep = "setPostTitle";
};
