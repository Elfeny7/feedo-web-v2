"use client";

import { TrashIcon } from "@/components/icons";
import { ActionModal } from "@/components/modal/action-modal";

export interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  buttonLayout?: "vertical" | "horizontal";
}

export function DeletePostModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  buttonLayout = "horizontal",
}: DeletePostModalProps) {
  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete post?"
      description="This can't be undone and it will be removed from your profile and the feed."
      icon={
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
          <TrashIcon className="h-7 w-7" />
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
            className="w-full cursor-pointer rounded-full bg-destructive px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </>
      }
    />
  );
}
