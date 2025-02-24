import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Check, User, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  id: Id<"requests">;
  image_url: string;
  username: string;
  email: string;
};

function Request(props: Props) {
  const { id, image_url, username, email } = props;
  const {mutate: denyRequest, pending: denying} = useMutationState(api.request.deny);
  const {mutate: acceptRequest, pending: accepting} = useMutationState(api.request.accept);
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
        <Button size="icon" disabled={accepting || denying} onClick={() => {
            acceptRequest({id}).then(()=>{toast.success("Request accepted")}).catch((error)=>{
                toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred")
            })
        }}>
          <Check />
        </Button>
        <Button size="icon" disabled={accepting || denying} variant="destructive" onClick={() => {
            denyRequest({id}).then(()=>{toast.success("Request denied")}).catch((error)=>{
                toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred")
            })
        }}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default Request;
