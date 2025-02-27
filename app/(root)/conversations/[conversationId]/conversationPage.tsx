"use client";
import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import Header from "./_components/Header";
import Body from "./_components/Body/Body";
import ChatInput from "./Input/ChatInput";

function ConversationPage({conversationId}: {conversationId: Id<"conversations">}) {
  const conversation = useQuery(api.conversation.get, {
    id: conversationId,
  });
  return conversation === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8" />
    </div>
  ) : conversation === null ? (
    <p className="w-full h-full flex items-center justify-center">
      Conversation not found
    </p>
  ) : (
    <ConversationContainer>
        <Header 
            imageUrl={conversation.isGroup ? undefined : conversation.otherMember.imageUrl || ""}
            name={conversation.isGroup ? conversation.name : conversation.otherMember.username || ""}
        />
        <Body/>
        <ChatInput/>
    </ConversationContainer>
  );
}

export default ConversationPage;
