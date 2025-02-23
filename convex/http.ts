import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayload = async (req: Request): Promise<WebhookEvent | undefined> => {
  try {
    const payload = await req.text();
    const svixHeaders = {
      "svix-id": req.headers.get("svix-id")!,
      "svix-timestamp": req.headers.get("svix-timestamp")!,
      "svix-signature": req.headers.get("svix-signature")!,
    };

    if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
      console.error("Missing Svix headers");
      return undefined;
    }

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
    return webhook.verify(payload, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error("Clerk webhook verification failed", error);
    return undefined;
  }
};

const handleClerkWebhook = httpAction(
  async (ctx, req: Request): Promise<Response> => {
    const event = await validatePayload(req);
    if (!event) {
      return new Response("Could not validate Clerk webhook", { status: 400 });
    }

    try {
      switch (event.type) {
        case "user.created": {
          const user = await ctx.runQuery(internal.user.get, {
            clerkId: event.data.id,
          });

          if (user) {
            console.log(`Updating existing user ${event.data.id}`);
          }
          // Intentional fallthrough to user.updated logic
        }
        case "user.updated": {
          console.log(`Creating/Updating user: ${event.data.id}`);

          if (event.data.email_addresses.length === 0) {
            console.error(`User ${event.data.id} has no email addresses`);
            return new Response("No email found", { status: 400 });
          }

          await ctx.runMutation(internal.user.create, {
            username: `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim(),
            imageUrl: event.data.image_url || "",
            clerkId: event.data.id,
            email: event.data.email_addresses[0]?.email_address || "",
          });

          break;
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Internal Server Error", { status: 500 });
    }

    return new Response(null, { status: 200 });
  }
);

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
