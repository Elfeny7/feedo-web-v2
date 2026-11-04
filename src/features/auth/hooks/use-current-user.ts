import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth-api";
import { queryKeys } from "@/lib/query-keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async () => {
      const responseData = await authApi.getCurrentUser();
      const user = responseData?.data;

      if (!user) {
        return null;
      }

      return user;
    },
    staleTime: 5 * 10 * 1000,
    retry: false,
  });
}