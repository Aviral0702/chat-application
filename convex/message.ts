import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) {
      throw new Error("User not found");
    }
    const membership = await ctx.db.query("conversationMembers").withIndex("by_conversationId_memberId",(q)=>q.eq("conversationId",args.conversationId).eq("memberId",currentUser._id)).unique();
    if(!membership){
        throw new ConvexError("You are not a member of this conversation");
    }
    const messageId = await ctx.db.insert("messages",{
        senderId: currentUser._id,
        ...args
    });     
    await ctx.db.patch(args.conversationId,{
        lastMessageId:messageId,
    });
    return messageId;
  },
});
