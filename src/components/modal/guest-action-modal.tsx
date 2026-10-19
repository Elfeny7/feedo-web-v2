"use client";

import Link from "next/link";
import { HeartIcon, LockIcon, UserIcon } from "@/components/icons";
import { ActionModal } from "@/components/modal/action-modal";

export type GuestAction = "like" | "follow" | "post" | "custom";

export interface GuestActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: GuestAction;
  targetName?: string;
  title?: string;
  description?: string;
  redirectUrl?: string;
  buttonLayout?: "vertical" | "horizontal";
}

export function GuestActionModal({
  isOpen,
  onClose,
  action = "like",
  targetName,
  title,
  description,
  redirectUrl,
  buttonLayout = "vertical",
}: GuestActionModalProps) {
  let defaultTitle = "Join Feedo today";
  let defaultDescription = "Log in or sign up to interact with posts and follow your favorite creators.";
  let icon = (
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
      <LockIcon className="h-7 w-7" />
    </div>
  );

  if (action === "like") {
    defaultTitle = "Like this post to show love";
    defaultDescription = targetName
      ? `Join Feedo to let ${targetName} know you liked their post, and join the conversation.`
      : "Join Feedo to like posts, reply, and connect with creators you care about.";
    icon = (
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
        <HeartIcon className="h-7 w-7" filled />
      </div>
    );
  } else if (action === "follow") {
    defaultTitle = targetName ? `Follow ${targetName}` : "Follow creators";
    defaultDescription = targetName
      ? `Don't miss any updates from ${targetName}. Log in or create an account to start following.`
      : "Stay updated with your favorite creators by logging in to follow them.";
    icon = (
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
        <UserIcon className="h-7 w-7" />
      </div>
    );
  }

  const loginHref = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login";
  const registerHref = redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register";

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || defaultTitle}
      description={description || defaultDescription}
      icon={icon}
      buttonLayout={buttonLayout}
      actions={
        <>
          <Link href={loginHref} className="w-full cursor-pointer rounded-full bg-foreground px-4 py-3 text-center text-sm font-bold text-background shadow-sm transition-all hover:opacity-90">
            Log In
          </Link>
          <Link href={registerHref} className="w-full cursor-pointer rounded-full border border-border px-4 py-3 text-center text-sm font-bold text-foreground transition-all hover:bg-muted">
            Sign Up
          </Link>
        </>
      }
    />
  );
}
