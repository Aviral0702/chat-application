"use client";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { useConversation } from "@/hooks/useConversation";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }),
});

export default function ChatInput() {
  // const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { conversationId } = useConversation();
  console.log(conversationId);
  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );
  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });
  const handleSubmit = (values: z.infer<typeof chatMessageSchema>) => {
    createMessage({
      conversationId,
      type: "text",
      content: [values.content],
    })
      .then(() => {
        form.reset();
        console.log("Message sent");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError ? error.message : "Something went wrong"
        );
      });
  };
  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;
    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };
  const handleKeyDown = async (event: any) => {
    if(event.key==="Enter" && !event.shiftKey){
        event.preventDefault();
        await form.handleSubmit(handleSubmit)();
    }
  };
   return (
    <Card className="w-full rounded-lg p-2 relative">
      <div className="flex gap-2 items-center w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormControl>
                      <TextareaAutosize
                        onKeyDown={handleKeyDown}
                        rows={1}
                        maxRows={3}
                        {...field}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                        placeholder="Type a message"
                        className="w-full h-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <Button type="submit" disabled={pending} size="icon"><SendHorizonal/></Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}
