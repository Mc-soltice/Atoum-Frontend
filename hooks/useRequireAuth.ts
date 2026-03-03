import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function useRequireAuth(redirectTo = "/login") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      localStorage.setItem("redirect_after_login", window.location.pathname);
      router.replace(redirectTo);
    }
  }, [user, loading, redirectTo, router]);

  return { user, loading };
}
