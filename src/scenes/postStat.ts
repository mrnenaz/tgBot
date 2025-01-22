import { SCENE_NAMES } from "../constants";
import { Scenes } from "telegraf";
import { findLogsById } from "../db/models/Losg";
import { uniqueItems } from "../utils";

export const postStatScene = new Scenes.BaseScene(SCENE_NAMES.POST_STAT);

postStatScene.enter(async (ctx: any) => {
  let postID = ctx.match[1];
  const post = await findLogsById(postID);
  const unicUsers = uniqueItems(post.memberInfo);
  const users = unicUsers.reduce((acc, item) => {
    const last_name = item.user.last_name
      ? `${item.user.last_name} \n\n`
      : "\n\n";
    acc += `${item.user.username} ${item.user.first_name} ${last_name}`;
    return acc;
  }, "");
  await ctx.sendMessage(users);
});

postStatScene.leave(async (ctx: any) => {
  return ctx.scene.leave();
});
