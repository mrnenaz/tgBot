import { ROLES } from "./constanst";

export const channelAccessCheck = async (ctx: any) => {
  const member = await ctx.getChatMember(ctx.from.id);

  if (
    member.status !== ROLES.ADMIN &&
    member.status !== ROLES.MEMBER &&
    member.status !== ROLES.CREATOR
  ) {
    console.log("Не подписан");

    return false;
  } else {
    console.log("Подписан");
    console.log("member", member);
    return true;
  }
};
