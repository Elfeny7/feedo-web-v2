"use client";

type TabItem<T extends string> = {
    label: string;
    value: T;
};

type TabsProps<T extends string> = {
    tabs: TabItem<T>[];
    activeTab: T;
    onTabChange: (value: T) => void;
};

export function Tabs<T extends string>({
    tabs,
    activeTab,
    onTabChange,
}: TabsProps<T>) {
    return (
        <div className="sticky top-15 z-10 grid border-b border-border bg-background/80 backdrop-blur-md"
            style={{
                gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
            }}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.value;

                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onTabChange(tab.value)}
                        className={`relative flex min-h-12 cursor-pointer items-center justify-center px-4 text-sm font-semibold transition-colors hover:bg-muted/50 sm:text-base ${
                            isActive
                                ? "text-foreground"
                                : "text-muted-foreground"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {tab.label}

                        {isActive && (
                            <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-primary sm:inset-x-10" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}