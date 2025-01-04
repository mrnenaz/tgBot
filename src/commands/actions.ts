import { SCENE_NAMES } from "../constants";

export const handleCallbackBtnClick = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.CALLBACK);
};

export const handleGiveAwayCallbackBtnClick = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.CALLBACK_GIVEAWAY);
};
