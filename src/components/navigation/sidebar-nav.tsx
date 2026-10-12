"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SearchIcon, ProfileIcon } from "@/components/icons";
import { useCurrentUser } from "@/hooks/use-current-user";

export function SidebarNav() {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();

  //Sembunyikan navigasi jika pengguna adalah guest atau sesi sedang dimuat
  if (isLoading || !user) {
    return null;
  }

  const userHandle = user.handle;
  const myProfilePath = userHandle ? `/${userHandle}` : "/home";

  const navItems = [
    { name: "Home", href: "/home", icon: <HomeIcon /> },
    { name: "Search", href: "/search", icon: <SearchIcon /> },
    { name: "Profile", href: myProfilePath, icon: <ProfileIcon /> }
  ];

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item, idx) => {
        const isProfile = item.name === "Profile";
        const isActive = isProfile
          ? Boolean(userHandle && pathname === `/${userHandle}`)
          : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + '/'));

        return (
          <Link 
            key={idx} 
            href={item.href} 
            className={`flex items-center justify-center xl:justify-start gap-4 p-3 xl:px-4 rounded-full transition-all duration-200 hover:bg-muted ${
              isActive ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'
            }`}
          >
            {item.icon}
            <span className="hidden xl:block text-xl">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
