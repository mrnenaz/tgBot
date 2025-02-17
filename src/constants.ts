export const COMMAND_NAMES = {
  GREETER: "greeter",
  START: "start",
  ECHO: "echo",
  CREATE: "create_post",
  ADD_BTN: "addbutton",
  DESTROY: "destroy",
  LOCATION: "location",
  GET_INFO: "get_info",
  CREATE_GIVEAWAY: "create_giveaway",
  GET_GIVEAWAYS_INFO: "get_giveaways_info",
};

export const COMMANDS = [
  {
    command: COMMAND_NAMES.CREATE,
    description: "Create",
  },
  {
    command: COMMAND_NAMES.GET_INFO,
    description: "Запросить Инфо",
  },
  {
    command: COMMAND_NAMES.CREATE_GIVEAWAY,
    description: "Провести конкурс",
  },
  {
    command: COMMAND_NAMES.GET_GIVEAWAYS_INFO,
    description: "Информация о конкурсах",
  },
];

export const BOT_EVENT_NAMES = {
  create: "create",
  cancel: "cancel",
  skip: "skip",
  addButton: "addButton",
  next: "next",
  createPostBtn: "createPostBtn",
  publication: "publication",
  reset: "reset",
  preview: "preview",
  destroy: "destroy",
  location: "location",
  get_post_stat: "get_post_stat",
  participation: "participation",
  notParticipation: "notParticipation",
  yes: "yes",
  yes_force: "yes_force",
  no_force: "no_force",
  back: "back",
  giveaways: {
    all: "all",
    active: "active",
    ended: "ended",
    actions: {
      users: "users",
      info: "info",
      finally: "finally",
      close: "close",
    },
  },
};

export const CMD_TEXT = {
  create: "Создать пост",
  createGiveaway: "Создать",
  no: "Нет",
  yes: "Да",
  cansel: "Отмена публикации",
  cansel2: "Отменить",
  cansel3: "Отмена",
  back: "Назад",
  giveawayPublish: "Опубликовать?",
  giveawaysTexts: {
    all: "Все",
    active: "Активные",
    ended: "Завершенные",
    actions: {
      users: "Участники",
      info: "Информация",
      finally: "Завершить",
      close: "Закрыть",
    },
  },
};

export const SCENE_NAMES = {
  CREATE: "create",
  CALLBACK: "callback",
  CREATE_GIVEAWAY: "creategiveaway",
  CALLBACK_GIVEAWAY: "callbackgiveaway",
  GET_GIVEAWAYS_INFO: "getgiveawaysinfo",
  POST_STAT: "poststat",
};

export const dateMask = /^\d{2}\.\d{2}\.\d{4}$/;
