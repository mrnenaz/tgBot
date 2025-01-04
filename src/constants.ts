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
};

export const COMMANDS = [
  {
    command: COMMAND_NAMES.CREATE,
    description: "Create",
  },
  {
    command: COMMAND_NAMES.CREATE_GIVEAWAY,
    description: "Провести конкурс",
  },
  // {
  //   command: COMMAND_NAMES.DESTROY,
  //   description: "Destroy",
  // },
  {
    command: COMMAND_NAMES.GET_INFO,
    description: "Запросить Инфо",
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
};

export const CMD_TEXT = {
  weaterI: "🌏 Узнать погоду у себя",
  weatherNotI: "🏕 Погода в другом месте",
  menu: "✅ В меню",
  create: "Создать пост",
  createGiveaway: "Создать",
  no: "Нет",
  cansel: "Отмена публикации",
  giveawayPublish: "Опубликовать?",
};

export const SCENE_NAMES = {
  CREATE: "create",
  CALLBACK: "callback",
  CREATE_GIVEAWAY: "creategiveaway",
  CALLBACK_GIVEAWAY: "callbackgiveaway",
};
