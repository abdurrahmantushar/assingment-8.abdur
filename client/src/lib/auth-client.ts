"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [jwtClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export type SessionUser = typeof authClient.$Infer.Session.user & {
  role: string;
};