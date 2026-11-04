import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/features/profile/api/profile-api";
import type { UpdateProfilePayload } from "@/types/user";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateProfile(handle: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => profileApi.updateProfile(payload),
        onSuccess: async () => await Promise.all([
            queryClient.invalidateQueries({
                queryKey: queryKeys.users.detail(handle),
            }),
            queryClient.invalidateQueries({
                queryKey: queryKeys.users.posts(handle),
            }),
        ]),
    });
}