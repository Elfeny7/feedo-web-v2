interface StatItemProps {
    value: number;
    label: string;
    onClick?: () => void;
}

function StatItem({ value, label, onClick }: StatItemProps) {
    return (
        <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity w-20" onClick={onClick}>
            <span className="font-extrabold text-lg text-foreground">{value}</span>
            <span className="text-[13px] text-muted-foreground mt-0.5 font-medium">{label}</span>
        </div>
    );
}

export interface ProfileStatsProps {
    followingsCount?: number;
    followersCount?: number;
    postsCount?: number;
    onFollowingClick?: () => void;
    onFollowersClick?: () => void;
}

export function ProfileStats({
    followingsCount = 0,
    followersCount = 0,
    postsCount = 0,
    onFollowingClick,
    onFollowersClick,
}: ProfileStatsProps) {
    return (
        <div className="flex justify-evenly items-center w-full mt-6 mb-2">
            <StatItem value={followingsCount} label="Following" onClick={onFollowingClick}/>
            <div className="w-px bg-border/80 h-8"></div>
            <StatItem value={followersCount} label="Followers" onClick={onFollowersClick}/>
            <div className="w-px bg-border/80 h-8"></div>
            <StatItem value={postsCount} label="Posts" />
        </div>
    );
}
