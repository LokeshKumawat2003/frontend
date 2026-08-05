
"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

function AuthSync() {
  const { data: session, status } = useSession();
  const setAuth = useAppStore((state) => state.setAuth);
  const clearAuth = useAppStore((state) => state.clearAuth);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as {
        accessToken?: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
      };
      setAuth(user.accessToken ?? null, user);
    } else if (status === "unauthenticated") {
      clearAuth();
    }
  }, [clearAuth, session, setAuth, status]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync />
      {children}
    </SessionProvider>
  );
}
