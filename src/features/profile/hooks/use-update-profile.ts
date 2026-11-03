import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/features/profile/api/profile-api";
import type { UpdateProfilePayload } from "@/types/user";

export function useUpdateProfile(handle: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => profileApi.updateProfile(payload),
        onSuccess: async () => await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ["user-profile", handle],
            }),
            queryClient.invalidateQueries({
                queryKey: ["user-posts", handle],
            }),
        ]),
    });
}