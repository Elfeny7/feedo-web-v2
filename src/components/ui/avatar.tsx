import React from 'react';

export interface AvatarProps {
  name?: string | null;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function Avatar({ 
  name, 
  imageUrl, 
  className = "w-12 h-12", 
  fallbackClassName = "bg-muted text-foreground" 
}: AvatarProps) {
  if (imageUrl) {
    return (
      <div className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={name || "Avatar"} className="w-full h-full object-cover" />
      </div>
    );
  }

  if (!name) {
    return (
      <div className={`rounded-full bg-muted animate-pulse shrink-0 ${className}`} />
    );
  }

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`rounded-full flex items-center justify-center shrink-0 font-bold ${fallbackClassName} ${className}`}>
      {initial}
    </div>
  );
}
