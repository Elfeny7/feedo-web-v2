import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/api/auth-api";
import { queryKeys } from "@/lib/query-keys";

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
            queryClient.setQueryData(queryKeys.auth.currentUser, null);
            //do clear cache manually eg. me, posts, etc
            router.replace("/login");
            router.refresh();
        }
    })
}