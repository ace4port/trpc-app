"use client";

import { SessionProvider } from "next-auth/react";
import { api } from "./api";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default api.withTRPC(Providers);
