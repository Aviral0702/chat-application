import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
    args: {},
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
  
       const friendship1 = await ctx.db.query("friends").withIndex("by_user1",(q)=>q.eq("user1",currentUser._id)).collect();
       const friendship2 = await ctx.db.query("friends").withIndex("by_user2",(q)=>q.eq("user2",currentUser._id)).collect();
       const friendships = [...friendship1,...friendship2];
       const friends = await Promise.all(
        friendships.map(async friendship=> {
            const friend = await ctx.db.get(friendship.user1===currentUser._id?friendship.user2:friendship.user1);
            if(!friend) {
                throw new ConvexError("Friend could not be found");
            }
            return friend;
        })
       )
       return friends;
    },
  });

  
