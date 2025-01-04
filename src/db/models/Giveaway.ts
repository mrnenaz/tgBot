import mongoose from "mongoose";

const Schema = mongoose.Schema;

type MemberInfo = {
  id: {
    type: String;
    required: false;
  };
  first_name: {
    type: String;
    required: false;
  };
  username: {
    type: String;
    required: false;
  };
  status: {
    type: String;
    required: false;
  };
};

export interface Giveaway {
  id: string;
  // messageId: number;
  type: string;
  messageId: string;
  title: string;
  description: string;
  dateTo: string;
  isActive: boolean;
  memberInfo: [MemberInfo] | [];
}

const TGGiveawaySchema = new Schema<Giveaway>({
  id: String,
  messageId: String,
  title: String,
  description: String,
  dateTo: String,
  isActive: Boolean,
  type: String,
  memberInfo: [
    {
      id: String,
      first_name: String,
      username: String,
      status: String,
    },
  ],
});

export const TGGiveaway = mongoose.model("TGGiveaways", TGGiveawaySchema);

export const insertGiveaway = async (data: Giveaway) =>
  await TGGiveaway.insertMany([data]);

export const findGiveaway = async (id: any) =>
  TGGiveaway.find({
    messageId: id,
  });

export const findAllGiveaway = async () => TGGiveaway.find({});

export const updateGiveawayMemberInfo = async (id: any, data: any) => {
  console.log("updateGiveawayMemberInfo", id, data);
  return TGGiveaway.updateOne(
    { messageId: id },
    { $push: { memberInfo: data } }
  );
};
// export const updateGiveawayMemberInfo = async (id: any, data: any) => {
//   console.log("updateGiveawayMemberInfo", id, data);
//   return TGGiveaway.updateMany({ messageId: id }, data);
// };

export const getGiveawayItemInfo = async (msgID: string, id: any) =>
  TGGiveaway.find({ messageId: msgID, "memberInfo.id": id });

export const getGiveawayItemMemberInfo = async (msgID: string, id: string) => {
  const item = await TGGiveaway.find({ messageId: msgID, "memberInfo.id": id });
  console.log("item", item);
  console.log("id", id);
  const member = item[0].memberInfo.find((memInf: any) => {
    console.log("memInf", memInf);
    return memInf.id === id;
  });
  console.log("member", member);
  return member;
};

export const getMemberCount = async (msgID: string, id: any) =>
  await TGGiveaway.find({
    messageId: msgID,
    memberInfo: { $elemMatch: { id: id } },
  });
