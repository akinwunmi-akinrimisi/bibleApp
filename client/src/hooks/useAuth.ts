import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        return await apiRequest("/api/auth/me");
      } catch (error) {
        // If the request fails with 401, the user is not authenticated
        return null;
      }
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}