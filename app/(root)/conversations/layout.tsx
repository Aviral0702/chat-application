import ItemList from "@/components/shared/item-list/itemList";
import React from "react";

type Props = React.PropsWithChildren<{}>;

function Layout({ children }: Props) {
  return <>
  <ItemList title="Conversations">Conversations Page</ItemList>
  {children}
  </>;
}

export default Layout;
