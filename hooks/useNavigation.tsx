import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const useNavigation = () => {
  const pathname = usePathname();
  const requestCount = useQuery(api.requests.count);
  const conversations = useQuery(api.conversations.get);
  const unseenMsgs = useMemo(() => {
    return conversations?.reduce((acc, curr) => {
      return acc + curr.unseenCount;
    }, 0);
  }, [conversations]);
  const paths = useMemo(
    () => [
      {
        name: "Conversations",
        href: "/conversations",
        icon: <MessageSquare />,
        active: pathname.startsWith("/conversations"),
        count: unseenMsgs,
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <Users />,
        active: pathname === "/friends",
        count: requestCount,
      },
    ],
    [pathname, requestCount, unseenMsgs]
  );

  return paths;
};

export default useNavigation;
