"use client";

import * as React from "react";
import {
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  GridIcon,
  PlusIcon,
  SearchIcon,
  SparkleIcon,
  SpinnerIcon,
  StarIcon,
} from "@/components/fomi/icons/FomiIcons";
import { FOMI_BRAND } from "@/components/fomi/lib/constants";
import { MOCK_PROJECTS, Project } from "@/components/fomi/lib/mock-data";

/** Session rail — the left column listing the user's projects.
 *  Collapses to icons-only on smaller viewports. */
export function SessionRail({
  collapsed,
  onToggleCollapsed,
  activeProjectId,
  onProjectChange,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  activeProjectId: string;
  onProjectChange: (id: string) => void;
}) {
  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-canvas-darker border-r border-white/5 transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[260px]"
      }`}
      aria-label="Projects"
    >
      {/* Brand + collapse toggle */}
      <div className="h-14 flex items-center px-3 border-b border-white/5">
        <button
          onClick={onToggleCollapsed}
          aria-label="Toggle project rail"
          className="flex items-center gap-2 text-white/90 flex-1 min-w-0"
        >
          <BrandMark />
          {!collapsed && (
            <span className="text-sm font-semibold truncate">
              {FOMI_BRAND.name}
            </span>
          )}
        </button>
      </div>

      {/* New project button */}
      <div className="p-2">
        <button
          className={`flex items-center gap-2 h-9 w-full rounded-lg bg-white/5 hover:bg-white/10 text-white/85 text-sm transition
            ${collapsed ? "justify-center" : "px-3"}`}
          aria-label="New project"
        >
          <PlusIcon size={14} />
          {!collapsed && <span>New project</span>}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <label className="px-2 block">
          <span className="sr-only">Search projects</span>
          <div className="relative">
            <SearchIcon
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="search"
              placeholder="Search projects"
              className="w-full h-8 pl-8 pr-2 rounded-lg bg-white/5 text-white/85 placeholder:text-white/35 text-sm focus:outline-none focus:ring-1 focus:ring-fomi-lime/40"
            />
          </div>
        </label>
      )}

      {/* Project list */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
        {!collapsed && (
          <div className="px-2 mt-2 mb-1 text-[10px] uppercase tracking-widest text-white/35">
            Projects
          </div>
        )}
        {MOCK_PROJECTS.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            active={project.id === activeProjectId}
            collapsed={collapsed}
            onClick={() => onProjectChange(project.id)}
          />
        ))}
      </nav>

      {/* Bottom: storage + settings */}
      <div className="p-2 border-t border-white/5">
        {!collapsed ? (
          <div className="px-2 py-2">
            <div className="flex items-center justify-between text-[11px] text-white/55 mb-1">
              <span>Storage</span>
              <span>4.2 / 20 GB</span>
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[21%] bg-fomi-lime rounded-full" />
            </div>
          </div>
        ) : (
          <div className="grid place-items-center py-1">
            <div className="h-7 w-7 rounded-full bg-white/5 grid place-items-center text-white/60">
              <GridIcon size={14} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function ProjectRow({
  project,
  active,
  collapsed,
  onClick,
}: {
  project: Project;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={project.name}
      className={`group w-full flex items-center gap-2.5 rounded-lg text-left transition-colors
        ${
          active
            ? "bg-white/10 text-white"
            : "text-white/65 hover:bg-white/5 hover:text-white"
        }
        ${collapsed ? "justify-center p-2" : "p-2"}
      `}
    >
      <span
        className="relative h-9 w-9 shrink-0 rounded-md overflow-hidden ring-1 ring-white/10"
        style={{ background: `${project.accent}22` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.thumbnail}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </span>
      {!collapsed && (
        <span className="flex-1 min-w-0">
          <span className="block text-sm truncate font-medium">
            {project.name}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-white/45">
            <ClockIcon size={10} />
            <span className="truncate">{relativeTime(project.updatedAt)}</span>
            <span>· {project.shotCount}</span>
          </span>
        </span>
      )}
      {!collapsed && active && (
        <ChevronRightIcon size={14} className="text-white/40" />
      )}
    </button>
  );
}

function BrandMark() {
  return (
    <div className="h-9 w-9 shrink-0 rounded-xl bg-white text-canvas-dark grid place-items-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 4h11M6 12h8M6 20h6"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="17.5" cy="19" r="2.2" fill="#d4ff3a" />
      </svg>
    </div>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
