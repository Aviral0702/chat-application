"use client";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@radix-ui/react-avatar";
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "convex/react";
import { CirclePlus, X } from "lucide-react";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createGroupFormSchema = z.object({
  name: z.string().min(1, { message: "This field can't be empty" }),
  members: z
    .string()
    .array()
    .min(1, { message: "you must select at least one member" }),
});

function CreateGroupDialog() {
  const friends = useQuery(api.friends.get);
  const { mutate: createGroup, pending } = useMutationState(
    api.conversation.createGroup
  );
  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });
  const members = form.watch("members");
  const unselectedFriends = useMemo(() => {
    return friends
      ? friends.filter((friend) => !members.includes(friend._id))
      : [];
  }, [members.length, friends?.length]);
  const handleSubmit = async (
    values: z.infer<typeof createGroupFormSchema>
  ) => {
    await createGroup({
      name: values.name,
      members: values.members,
    })
      .then(() => {
        form.reset();
        toast.success("Group created successfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <DialogTrigger>
            <Button size="icon" variant="outline">
              <CirclePlus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create a new group</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="block">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>Add your friends to get started</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Group Name..." {...field}></Input>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="members"
              render={({}) => {
                return (
                  <FormItem>
                    <FormLabel>Friends</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={unselectedFriends.length === 0}
                        >
                          <Button className="w-full" variant="outline">
                            Select
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          {unselectedFriends.map((friend) => (
                            <DropdownMenuCheckboxItem
                              key={friend._id}
                              className="flex items-center gap-2 w-fll p-2"
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  form.setValue("members", [
                                    ...members,
                                    friend._id,
                                  ]);
                                }
                              }}
                            >
                              <Avatar className="w-8 h-8 rounded-2xl">
                                <AvatarImage
                                  src={friend.imageUrl}
                                  className="rounded-2xl"
                                />
                                <AvatarFallback>
                                  {friend.username.substring(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <h4 className="truncate">{friend.username}</h4>
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                );
              }}
            />
            {members && members.length ? (
              <Card className="flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar">
                {friends?.filter(friend => members.includes(friend._id)).map((friend => {
                  return (
                     <div key={friend._id} className="flex flex-col items-center gap-1">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={friend.imageUrl} className="h-8 w-8 rounded-2xl" />
                          <AvatarFallback>{friend.username.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <X className="text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer"
                          onClick={() => form.setValue("members", members.filter(member => member !== friend._id))}
                        />
                      </div>
                      <p className="truncate text-sm" >
                        {friend.username.split(" ")[0]}
                      </p>
                     </div>
                  )
                }))} 
              </Card>
            ) : null}
            <DialogFooter>
              <Button type="submit" disabled={pending} className="w-full">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateGroupDialog;
