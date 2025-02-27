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
      const conversation  = await ctx.db.get(args.id);
      if(!conversation){
        throw new ConvexError("Conversation not found");
      }
      const membership = await ctx.db.query("conversationMembers").withIndex("by_conversationId_memberId",(q)=>q.eq("conversationId",args.id)).filter((q)=>q.eq(q.field("memberId"),currentUser._id)).unique();
      if(!membership){
        throw new ConvexError("You are not a member of this conversation");
      }

      const allConversationMemberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId",(q)=>q.eq("conversationId",args.id)).collect();
      if(!conversation.isGroup){
        const otherMembership = allConversationMemberships.filter(membership => membership.memberId === currentUser._id)[0]
        const otherMember = await ctx.db.get(otherMembership.memberId);
        return {
            ...conversation,
            otherMember: {
                ...otherMember,
                lastSeenMessageId: otherMembership.lastSeenMessage
            },
            otherMembers: null
        }
    }
  
    
    },
  });