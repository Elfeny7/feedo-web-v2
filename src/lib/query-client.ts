import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 detik
        gcTime: 5 * 60 * 1000, // 5 menit

        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,

        retry: 1,
      },

      mutations: {
        retry: 0,
      },
    },
  });
}
