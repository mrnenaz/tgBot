import { SCENE_NAMES } from "../constants";
import { mainMenu } from "../bottoms/bottoms";
import { v4 as uuidv4 } from "uuid";

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
