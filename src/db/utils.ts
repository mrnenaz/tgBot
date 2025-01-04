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
