import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import { UserData } from "@/types/auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const responseData = await client.get<UserData>("/api/auth/me");
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