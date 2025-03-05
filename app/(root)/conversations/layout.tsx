"use client";
import ItemList from "@/components/shared/item-list/itemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import DMConversationItems from "./_components/DMConversationItems";
import CreateGroupDialog from "./_components/CreateGroupDialog";

type Props = React.PropsWithChildren<{}>;

function Layout({ children }: Props) {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemList title="Conversations" action={<CreateGroupDialog/>}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No Conversations Found
            </p>
          ) : (
            conversations.map((conversations) => {
              return conversations.conversation.isGroup ? null : (
                <DMConversationItems
                  id={conversations.conversation._id}
                  username={conversations.otherMember?.username || ""}
                  imageUrl={conversations.otherMember?.imageUrl || ""}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                />
              );
            })
          )
        ) : (
          <Loader2 />
        )}
      </ItemList>
      {children}
    </>
  );
}

export default Layout;
