"use client";
import ItemList from "@/components/shared/item-list/itemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import DMConversationItems from "./_components/DMConversationItems";

type Props = React.PropsWithChildren<{}>;

function Layout({ children }: Props) {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemList title="Conversations">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No Conversations Found
            </p>
          ) : (conversations.map((conversations)=>{
            return conversations.conversation.isGroup ? null : <DMConversationItems id={conversations.conversation._id} username={conversations.otherMember?.username || ""} imageUrl={conversations.otherMember?.imageUrl || ""}/>
          }))
        ) : (
          <Loader2 />
        )}
      </ItemList>
      {children}
    </>
  );
}

export default Layout;
