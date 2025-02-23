"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipTrigger,TooltipContent } from "@/components/ui/tooltip";
import useNavigation from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import  Link  from "next/link";
import React from "react";

function DesktopNav() {
  const paths = useNavigation();

  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <nav>
        <ul className="flex flex-col items-center gap-4">
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
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-4">
        <UserButton />
      </div>
    </Card>
  );
}

export default DesktopNav;
