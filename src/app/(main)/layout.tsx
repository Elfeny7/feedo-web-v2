import React from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { UserProfileMenu } from "@/features/users/components/user-profile-menu";
import { MobileNav } from "@/components/navigation/mobile-nav";


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center selection:bg-primary/30">
      <div className="w-full max-w-7xl flex relative justify-center">
        
        {/* --- LEFT SIDEBAR (Desktop/Tablet) --- */}
        <aside className="hidden sm:flex flex-col w-20 xl:w-72 h-screen sticky top-0 border-r border-border px-2 xl:px-6 py-6">
          {/* Logo */}
          <Link 
            href="/home" 
            className="flex items-center justify-center xl:justify-start xl:gap-4 mb-8 px-2 cursor-pointer transition-opacity hover:opacity-80"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-primary-foreground font-bold text-xl shrink-0">
              F
            </div>
            <span className="hidden xl:block text-2xl font-black tracking-tighter">feedo.</span>
          </Link>

          {/* Navigasi Sidebar */}
          <SidebarNav />

          {/* Menu Profil Pengguna di Bagian Bawah */}
          <UserProfileMenu />
        </aside>

        {/* --- MAIN CONTENT (Middle) --- */}
        <main className="flex-1 max-w-150 w-full border-r border-border min-h-screen pb-20 sm:pb-0 relative">
          {children}
        </main>

        {/* --- RIGHT SIDEBAR (Desktop only) --- */}
        <aside className="hidden lg:block w-87.5 sticky top-0 h-screen p-6">
          {/* <WhoToFollow /> */}
        </aside>

        {/* --- BOTTOM NAV (Mobile Only) --- */}
        <MobileNav />

      </div>
    </div>
  );
}
