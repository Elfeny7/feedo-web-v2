"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrentUser } from "@/features/users/hooks/use-current-user";
import { Avatar } from "@/components/ui/avatar";
import { LogoutIcon, MoreIcon } from "@/components/icons";
import { useLogout } from "@/features/auth/hooks/use-logout";

export function UserProfileMenu() {
  const { data: user } = useCurrentUser();
  const { mutate: logout, isPending } = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown saat pengguna mengklik di luar area menu
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

  // Jangan render tombol jika sesi pengguna belum dimuat
  if (!user) {
    return null;
  }

  return (
    <div className="mt-auto mb-4 relative" ref={dropdownRef}>
      {/* Popover Dropdown Menu */}
      {showDropdown && (
        <div className="absolute bottom-full mb-2 left-0 w-full bg-card border border-border rounded-xl shadow-lg shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => { logout() }}
            className="w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors text-destructive font-bold text-[15px] cursor-pointer"
            disabled={isPending}
          >
            <LogoutIcon />
            <span className="hidden xl:inline">Log out {user.handle}</span>
          </button>
        </div>
      )}

      {/* Tombol Profil Pengguna */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full flex items-center justify-between p-3 rounded-full transition-all duration-200 hover:bg-muted cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Avatar
            name={user.name}
            className="w-10 h-10 shadow-md text-primary-foreground bg-primary text-lg"
            fallbackClassName="bg-primary text-primary-foreground"
          />
          <div className="hidden xl:flex flex-col items-start text-left overflow-hidden">
            <span className="font-bold text-[15px] leading-tight truncate w-full">{user.name}</span>
            <span className="text-muted-foreground text-[15px] truncate w-full">{user.handle || ""}</span>
          </div>
        </div>
        <div className="hidden xl:flex text-muted-foreground">
          <MoreIcon />
        </div>
      </button>
    </div>
  );
}
