"use client";

import { UserIcon } from "@/components/icons";
import { ActionModal } from "@/components/modal/action-modal";

export interface UnfollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isPending?: boolean;
  buttonLayout?: "vertical" | "horizontal";
}

export function UnfollowModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isPending = false,
  buttonLayout = "horizontal",
}: UnfollowModalProps) {
  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Unfollow ${userName}?`}
      description={`Their posts will no longer appear in your Following feed.`}
      icon={
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground ring-8 ring-muted/40">
          <UserIcon className="h-7 w-7" />
        </div>
      }
      buttonLayout={buttonLayout}
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full cursor-pointer rounded-full border border-border px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full cursor-pointer rounded-full bg-black px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Unfollowing..." : "Unfollow"}
          </button>
        </>
      }
    />
  );
}
