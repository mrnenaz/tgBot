// import { Random } from "random";
import random from "random";
import { TGLogs, TGPosts } from "./models";
import { Giveaway, TGGiveaway } from "./models/Giveaway";

export const findPost = async (id: any) =>
  TGPosts.find({
    [`buttons.${id}`]: {
      $exists: true,
    },
  });

export const findLogs = async (id: any) =>
  TGLogs.find({
    [`buttons.${id}`]: {
      $exists: true,
    },
  });

export const updateLogs = async (id: any, data: any) =>
  TGLogs.updateMany({ id }, data);

export const insertMemberInfo = async (data: any) => TGLogs.insertMany([data]);

export const insertPost = async (data) => TGPosts.insertMany([data]);

export const findAllPosts = async () => TGPosts.find({});

export const findLogsWithClicks = async () => {
  const posts = await findAllPosts();
  const ids = posts.map((item) => item.id);
  const findResult = await TGLogs.find({
    id: {
      $in: ids,
    },
  });
  return findResult;
};

// export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min));
export const getRandomInt = (min: number, max: number) => random.int(0, 100);
