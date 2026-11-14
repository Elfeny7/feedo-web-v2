import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/api";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 detik
        gcTime: 5 * 60 * 1000, // 5 menit

        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,

        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status === 404) {
            return false;
          }
          return failureCount < 1;
        },
      },

      mutations: {
        retry: 0,
      },
    },
  });
}
