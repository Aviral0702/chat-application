import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { Check, User, X } from "lucide-react";
import React from "react";

type Props = {
  id: Id<"requests">;
  image_url: string;
  username: string;
  email: string;
};

function Request(props: Props) {
  const { id, image_url, username, email } = props;

  return (
    <Card className="w-full p-2 flex flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={image_url} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate font-semibold">{username}</h4>
          <p className="truncate text-xs text-muted-foreground text-gray-500">
            {email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" onClick={() => {}}>
          <Check />
        </Button>
        <Button size="icon" variant="destructive" onClick={() => {}}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default Request;
