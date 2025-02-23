"use client";

import LoadingLogin from "@/components/shared/LoadingLogin";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { Authenticated, AuthLoading, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

type Props = {
    children: React.ReactNode;
}

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

const convex = new ConvexReactClient(CONVEX_URL);

export const ConvexClientProvider = ({children}: Props) => {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <Authenticated>{children}</Authenticated>
                <AuthLoading><LoadingLogin/></AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}
