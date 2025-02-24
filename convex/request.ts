import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity) {
            throw new ConvexError("Unauthorized")
        }

        if(args.email === identity.email) {
            throw new ConvexError("Cannot send request to yourself")
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject
        })

        if(!currentUser) {
            throw new ConvexError("User not found")
        }

        const reciever = await ctx.db.query("users").withIndex("by_email",(q)=>q.eq("email",args.email)).unique();
        if(!reciever) {
            throw new ConvexError("User not found")
        }

        const requestAlreadySent = await ctx.db.query("requests").withIndex("by_reciever_sender", (q)=>q.eq("reciever",reciever._id).eq("sender",currentUser._id)).unique();
        if(requestAlreadySent) {
            throw new ConvexError("Request already sent")
        }

        const requestAlreadyReceived = await ctx.db.query("requests").withIndex("by_reciever_sender", (q)=>q.eq("reciever",currentUser._id).eq("sender",reciever._id)).unique();
        if(requestAlreadyReceived) {
            throw new ConvexError("Request already received")
        }

        const request = await ctx.db.insert("requests",{
            sender: currentUser._id,
            reciever: reciever._id
        })

        return request;
    }
})

export const deny = mutation({
    args: {
        id: v.id("requests")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity) {
            throw new ConvexError("Unauthorized")
        }


        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject
        })

        if(!currentUser) {
            throw new ConvexError("User not found")
        }

        const currentRequest = await ctx.db.get(args.id);
        if(!currentRequest || currentRequest.reciever !== currentUser._id) {
            throw new ConvexError("There was an error denying the request")
        }

        await ctx.db.delete(args.id);

        return true;
    }
})