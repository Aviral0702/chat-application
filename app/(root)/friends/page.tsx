import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import ItemList from "@/components/shared/item-list/itemList";
import React from "react";

type Props = {};

function Page(props: Props) {
  return (
    <>
      <ItemList title="Friends">Friends Page</ItemList>
      <ConversationFallback />
    </>
  );
}

export default Page;
