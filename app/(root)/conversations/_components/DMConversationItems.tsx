import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  id: Id<"conversations">;
  imageUrl: string;
  username: string;
  lastMessageSender?: string | undefined;
  lastMessageContent?: string | undefined;
  unseenCount?: number;
};

function DMConversationItems(props: Props) {
  const {
    id,
    imageUrl,
    username,
    lastMessageSender,
    lastMessageContent,
    unseenCount
  } = props;

  return (
    <Link href={`/conversations/${id}`} className="w-full ">
      <Card className="p-2 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar className="h-10 w-10">
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{username}</h4>
            {lastMessageSender && lastMessageContent ? (
              <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                <p className="font-semibold">
                  {lastMessageSender}{":"}&nbsp;
                </p>
                <p className="truncate overflow-ellipsis">
                  {lastMessageContent}
                </p>
              </span>
              
            ) : (
              <p className="text-sm text-muted-foreground truncate">
                Start the conversation
              </p>
            )}
            
          </div>
          
        </div>
        {unseenCount && unseenCount > 0 ? <Badge className="rounded-2xl">{unseenCount}</Badge> : null}
      </Card>
    </Link>
  );
}

export default DMConversationItems;
