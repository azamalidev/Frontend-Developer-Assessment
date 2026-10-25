"use client";

import * as React from "react";
import {
  EditIcon,
  GalleryIcon,
  HomeIcon,
  ImageIcon,
  MusicIcon,
  SearchIcon,
  SupportIcon,
  UserIcon,
  VideoIcon,
} from "@/components/fomi/icons/FomiIcons";
import { FOMI_BRAND } from "@/components/fomi/lib/constants";

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
};

/** Top navigation bar for Part A — faithful recreation of the mockup.
 *  Renders logo, primary nav rail, search field, and user avatar. */
const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "video", label: "Video", icon: VideoIcon },
  { id: "edit", label: "Edit", icon: EditIcon },
  { id: "music", label: "Music", icon: MusicIcon },
  { id: "gallery", label: "Gallery", icon: GalleryIcon },
  { id: "support", label: "Support", icon: SupportIcon },
];

export function TopNav({
  activeId,
  onChange,
  onAvatarClick,
}: {
  activeId: string;
  onChange: (id: string) => void;
  onAvatarClick?: () => void;
}) {
  return (
    <header
      className="sticky top-0 z-40 h-16 flex items-center justify-between px-3 sm:px-5 lg:px-6 bg-white/95 backdrop-blur-md border-b border-black/5"
      role="banner"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <FomiMark />
        <span className="text-[22px] font-semibold tracking-tight text-fomi-teal">
          {FOMI_BRAND.name}
        </span>
      </div>

      {/* Primary nav rail — horizontal scroll on small screens */}
      <nav
        aria-label="Primary"
        className="hidden md:flex items-center gap-0.5 mx-auto"
      >
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={activeId === item.id}
            onClick={() => onChange(item.id)}
          />
        ))}
      </nav>

      {/* Right cluster: search + avatar */}
      <div className="flex items-center gap-2 shrink-0">
        <label className="relative hidden sm:flex items-center">
          <span className="sr-only">Search</span>
          <SearchIcon
            size={16}
            className="absolute left-3 text-black/40 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search"
            className="h-9 w-32 sm:w-44 pl-9 pr-3 text-sm rounded-full bg-black/5 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-fomi-coral/50 transition"
          />
        </label>

        <button
          onClick={onAvatarClick}
          aria-label="Open account menu"
          className="h-9 w-9 rounded-full bg-fomi-teal text-white grid place-items-center text-sm font-semibold ring-focus hover:ring-2 hover:ring-fomi-coral/40 transition"
        >
          <UserIcon size={16} />
        </button>
      </div>
    </header>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative h-10 px-3 lg:px-4 flex items-center gap-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? "text-fomi-coral"
          : "text-black/65 hover:text-black hover:bg-black/[0.04]"
      }`}
    >
      <Icon size={18} />
      <span>{item.label}</span>
      {active && (
        <span
          aria-hidden
          className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full bg-fomi-coral"
        />
      )}
    </button>
  );
}

/** Fomi brand mark — geometric "F" with a coral accent dot. */
function FomiMark() {
  return (
    <div className="relative h-9 w-9 rounded-xl bg-fomi-teal text-white grid place-items-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 4h11M6 12h8M6 20h6"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="17.5" cy="19" r="2.2" fill="#ff6b4a" />
      </svg>
    </div>
  );
}
