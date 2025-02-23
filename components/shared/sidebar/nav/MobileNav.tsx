"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useNavigation from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

function MobileNav() {
  const paths = useNavigation();

  return (
    <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden">
      <nav className="w-full">
        <ul className="flex justify-evenly items-center">
          {paths.map((path, id) => {
            return (
              <li key={id} className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={path.href}>
                      <Button
                        size="icon"
                        variant={path.active ? "default" : "outline"}
                      >
                        {path.icon}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{path.name}</TooltipContent>
                </Tooltip>
              </li>
            );
          })}
          <li>
            <UserButton />
          </li>
        </ul>
      </nav>
    </Card>
  );
}

export default MobileNav;
