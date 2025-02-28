import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
    args: {
        id: v.id("conversations")
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
      const membership = await ctx.db.query("conversationMembers").withIndex("by_conversationId_memberId",(q)=>q.eq("conversationId",args.id)).filter((q)=>q.eq(q.field("memberId"),currentUser._id)).unique();
      if(!membership){
        throw new ConvexError("You are not a member of this conversation");
      }
      const messages = await ctx.db.query("messages").withIndex("by_conversationId",(q)=>q.eq("conversationId",args.id)).order("desc").collect();
      const messagesWithUser = await Promise.all(messages.map(async (message)=>{
        const messageSender = await ctx.db.get(message.senderId);
        if(!messageSender){
            throw new ConvexError("Message sender not found");
        }
        return {
            message,
            senderImage: messageSender.imageUrl,
            senderName: messageSender.username,
            isCurrentUser: message.senderId === currentUser._id,
        }
      }))
      return messagesWithUser;
    
    },
  });