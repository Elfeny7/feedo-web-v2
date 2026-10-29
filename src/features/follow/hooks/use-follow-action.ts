"use client";

import { useState } from "react";
import { useToggleFollow } from "@/features/follow/hooks/use-toggle-follow";

type UseFollowActionOptions = {
    isFollowed: boolean;
    targetHandle: string;
};

export function useFollowAction({
    isFollowed,
    targetHandle,
}: UseFollowActionOptions) {

    const [isUnfollowModalOpen, setIsUnfollowModalOpen] = useState(false);
    const { mutate, isPending } = useToggleFollow();

    function handleFollowClick() {
        if (isFollowed) {
            setIsUnfollowModalOpen(true);
            return;
        }

        mutate(targetHandle);
    }

    function handleUnfollowConfirm() {
        mutate(targetHandle, {
            onSuccess: () => setIsUnfollowModalOpen(false),
        });
    }

    return {
        handleFollowClick,
        handleUnfollowConfirm,
        isUnfollowModalOpen,
        setIsUnfollowModalOpen,
        isPending
    };
}