import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { client } from "@/lib/fetcher";

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () => client.post("api/auth/logout"),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["me"] });
            queryClient.setQueryData(["me"], null);
            //do clear cache manually eg. me, posts, etc
            router.replace("/login");
            router.refresh();
        }
    })
}