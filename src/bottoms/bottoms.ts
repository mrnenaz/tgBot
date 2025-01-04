import { BOT_EVENT_NAMES, CMD_TEXT } from "../constants";
import { Markup } from "telegraf";

export const mainMenu = Markup.inlineKeyboard([
  // Markup.button.callback("Опубликовать", BOT_EVENT_NAMES.publication),
  // Markup.button.callback("Cбросить публикацию", BOT_EVENT_NAMES.reset),
  Markup.button.callback(CMD_TEXT.create, BOT_EVENT_NAMES.create),
  Markup.button.callback(CMD_TEXT.cansel, BOT_EVENT_NAMES.cancel),
]);

export const addPhoto = Markup.inlineKeyboard([
  // Markup.button.callback("Пропустить", BOT_EVENT_NAMES.skip),
  Markup.button.callback(CMD_TEXT.no, BOT_EVENT_NAMES.cancel),
]);

export const canselPost = Markup.inlineKeyboard([
  // Markup.button.callback("Пропустить", BOT_EVENT_NAMES.skip),
  Markup.button.callback(CMD_TEXT.cansel, BOT_EVENT_NAMES.cancel),
]);

export const CallbackButtons = Markup.inlineKeyboard([
  [
    Markup.button.callback("Добавить", BOT_EVENT_NAMES.addButton),
    Markup.button.callback("Продолжить", BOT_EVENT_NAMES.next),
  ],
  [Markup.button.callback(CMD_TEXT.cansel, BOT_EVENT_NAMES.cancel)],
]);

export const createPostBtn = Markup.inlineKeyboard([
  Markup.button.callback("Добавить", BOT_EVENT_NAMES.createPostBtn),
]);

export const publicStepBtn = Markup.inlineKeyboard([
  Markup.button.callback("Опубликовать", BOT_EVENT_NAMES.publication),
  Markup.button.callback("Предпросмотр", BOT_EVENT_NAMES.preview),
  Markup.button.callback("Cбросить публикацию", BOT_EVENT_NAMES.reset),
]);
