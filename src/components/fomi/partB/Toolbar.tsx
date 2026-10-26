"use client";

import * as React from "react";
import {
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  SearchIcon,
  ShareIcon,
  SparkleIcon,
} from "@/components/fomi/icons/FomiIcons";
import { FOMI_BRAND } from "@/components/fomi/lib/constants";

/**
 * Toolbar — top of the Part B workspace.
 * Minimal, dark, breadcrumb style. Carries project name, share, and credit chip.
 */
export function Toolbar({
  projectName,
  shotCount,
  onShare,
}: {
  projectName: string;
  shotCount: number;
  onShare: () => void;
}) {
  return (
    <header
      className="h-14 shrink-0 flex items-center justify-between px-3 sm:px-5 bg-canvas-darker border-b border-white/5"
      role="banner"
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-white/60 min-w-0"
      >
        <FolderIcon size={14} className="text-white/45 shrink-0" />
        <span className="hidden sm:inline truncate">{FOMI_BRAND.name}</span>
        <ChevronRightIcon size={12} className="text-white/25 shrink-0" />
        <span className="text-white/85 font-medium truncate">
          {projectName}
        </span>
        <span className="ml-2 hidden md:inline text-[10px] uppercase tracking-widest text-white/30">
          Composer
        </span>
      </nav>

      {/* Right cluster */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <label className="relative hidden md:flex items-center">
          <span className="sr-only">Search shots</span>
          <SearchIcon
            size={14}
            className="absolute left-2.5 text-white/40 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search this project"
            className="h-9 w-44 lg:w-56 pl-8 pr-2 rounded-full bg-white/5 text-white/85 placeholder:text-white/40 text-sm focus:outline-none focus:ring-1 focus:ring-fomi-lime/40"
          />
        </label>

        {/* Auto-save indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-white/50 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-fomi-lime animate-pulse" />
          <span className="hidden lg:inline">Auto-saved</span>
        </div>

        {/* Shot count chip */}
        <div className="hidden md:flex items-center gap-1.5 h-9 px-2.5 rounded-full bg-white/5 text-white/65 text-xs">
          <ClockIcon size={12} />
          <span>{shotCount} shots</span>
        </div>

        {/* Share button */}
        <button
          onClick={onShare}
          className="h-9 px-3 inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/85 text-sm transition"
        >
          <ShareIcon size={14} />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Upgrade chip */}
        <button className="hidden md:inline-flex h-9 px-3 items-center gap-1.5 rounded-full bg-fomi-lime text-canvas-dark text-sm font-semibold hover:brightness-110 transition">
          <SparkleIcon size={14} />
          <span>Upgrade</span>
        </button>
      </div>
    </header>
  );
}
