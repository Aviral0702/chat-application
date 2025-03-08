import { AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar } from "@radix-ui/react-avatar";
import { GroupIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  id: Id<"conversations">;
  name: string;
  lastMessageSender?: string | undefined;
  lastMessageContent?: string | undefined;
  unseenCount?: number;
};

function GroupConversationItems(props: Props) {
  const {
    id,
    name,
    lastMessageSender,
    lastMessageContent,
    unseenCount,
  } = props;

  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              <GroupIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{name}</h4>
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

export default GroupConversationItems;
