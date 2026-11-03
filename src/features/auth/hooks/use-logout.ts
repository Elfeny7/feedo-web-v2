import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/api/auth-api";

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["me"] });
            queryClient.setQueryData(["me"], null);
            //do clear cache manually eg. me, posts, etc
            router.replace("/login");
            router.refresh();
        }
    })
}