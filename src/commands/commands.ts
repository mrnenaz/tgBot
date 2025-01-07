import { SCENE_NAMES } from "../constants";
import { mainMenu } from "../bottoms/bottoms";
import { v4 as uuidv4 } from "uuid";
import { findLogsWithClicks } from "../db/utils";
import { Markup } from "telegraf";

export const backMenu = (ctx) => {
  ctx.reply(`✅ Ты находишься в меню`, {
    disable_web_page_preview: true,
    parse_mode: "HTML",
    ...mainMenu,
  });
};

export const start = async (ctx: any) => {
  console.log("start");
  await ctx.reply(
    `
      ❤️ Привет, ${ctx.update.message.from.first_name}!
  `,
    {
      disable_web_page_preview: true,
      parse_mode: "HTML",
      ...mainMenu,
    }
  );
};

export const startWhatWeather = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.CREATE);
};

export const startCreateGiveAway = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.CREATE_GIVEAWAY);
};

export const startGetGiveawaysInfo = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.GET_GIVEAWAYS_INFO);
};

export const startGetInfo = async (ctx: any) => {
  const posts = await findLogsWithClicks();
  console.log("posts", posts.length);
  const markupButtons = posts.map((post) => {
    return [
      Markup.button.callback(post.description, `get_post_stat ${post.id}`),
    ];
  });

  await ctx.sendMessage("Выбрать пост", {
    reply_markup: {
      inline_keyboard: [...markupButtons],
    },
  });
};
