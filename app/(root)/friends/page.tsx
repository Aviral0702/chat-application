"use client";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import ItemList from "@/components/shared/item-list/itemList";
import React from "react";
import AddFriendDialogBox from "./_components/AddFriendDialogBox";

type Props = {};

function Page(props: Props) {
  return (
    <>
      <ItemList title="Friends" action={<AddFriendDialogBox/>}>Friends Page</ItemList>
      <ConversationFallback />
    </>
  );
}

export default Page;
