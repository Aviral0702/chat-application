import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import ConversationPage from "./conversationPage";
export default async function Page({params} : {params: Promise<{conversationId: Id<"conversations">}>}){
    const {conversationId} = await params;
    return <ConversationPage conversationId={conversationId}/>
}
