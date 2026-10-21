import type { UserData } from "@/types/auth";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

interface UserItemProps {
  suggestedUser: UserData;
  onFollowClick: (handle: string) => void;
}

export function UserItem({ suggestedUser, onFollowClick }: UserItemProps) {
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();
  const isSameUser = currentUser?.id === suggestedUser.id;

  const handleUserClick = () => {
    router.push(`/${suggestedUser.handle}`);
  };

  return (
    <article
      className="p-4 sm:px-6 border-b border-border hover:bg-muted/50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
    >
      <div className="flex items-center gap-4 flex-1" onClick={handleUserClick}>
        <Avatar name={suggestedUser.name} className="w-12 h-12 text-lg" />
        <div className="flex flex-col">
          <h2 className="font-bold hover:underline truncate">{suggestedUser.name}</h2>
          <span className="text-muted-foreground text-[15px] truncate">@{suggestedUser.handle}</span>
          {suggestedUser.bio && (
            <p className="mt-1 text-[14px] text-foreground line-clamp-1">{suggestedUser.bio}</p>
          )}
        </div>
      </div>

      {/* Show Follow button if it's not the current user */}
      {!isSameUser && (
        <button
          onClick={() => onFollowClick(suggestedUser.handle)}
          className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer text-sm ${suggestedUser.is_followed
            ? "bg-transparent border border-border hover:border-destructive hover:text-destructive hover:bg-destructive/10 text-foreground"
            : "bg-foreground text-background hover:bg-foreground/90"
            }`}
        >
          {suggestedUser.is_followed ? "Following" : "Follow"}
        </button>
      )}
    </article>
  );
}
