"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useCurrentUser } from "@/features/users/hooks/use-current-user";
import { HomeIcon, SearchIcon, ProfileIcon, LogoutIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { useLogout } from "@/features/auth/hooks/use-logout";

export function MobileNav() {
  const pathname = usePathname();
  const { mutate: logout, isPending } = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

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
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border flex justify-around p-2 pb-safe z-50">
      {navItems.map((item, idx) => {
        const isProfile = item.name === "Profile";
        const isActive = isProfile
          ? Boolean(userHandle && pathname === `/${userHandle}`)
          : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + '/'));

        return (
          <Link
            key={idx}
            href={item.href}
            className={`p-3 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-muted-foreground'
              } hover:bg-muted active:scale-95`}
          >
            {item.icon}
          </Link>
        );
      })}

      {/* Profil Pengguna & Logout Popup (Mobile) */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`p-3 rounded-xl transition-all ${showDropdown ? 'bg-muted' : ''} hover:bg-muted active:scale-95 cursor-pointer`}
          >
            <Avatar
              name={user.name}
              className="w-7 h-7 shadow-md text-primary-foreground bg-primary text-xs"
              fallbackClassName="bg-primary text-primary-foreground"
            />
          </button>

          {showDropdown && (
            <div className="absolute bottom-[calc(100%+0.5rem)] right-0 min-w-50 bg-card border border-border rounded-xl shadow-lg shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-4 border-b border-border flex flex-col items-start text-left">
                <span className="font-bold text-[15px] leading-tight truncate w-full">{user.name}</span>
                <span className="text-muted-foreground text-[15px] truncate w-full">{user.handle}</span>
              </div>
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors text-destructive font-bold text-[15px] cursor-pointer"
                disabled={isPending}
              >
                <LogoutIcon />
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
