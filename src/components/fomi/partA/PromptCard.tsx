"use client";

import * as React from "react";
import {
  ADVANCED_FIELDS,
  ASPECT_RATIOS,
  IMAGE_COUNTS,
  MODELS,
  STYLE_PRESETS,
  DEFAULT_PROMPT_PLACEHOLDER,
} from "@/components/fomi/lib/constants";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PaletteIcon,
  SlidersIcon,
  SparkleIcon,
  SpinnerIcon,
} from "@/components/fomi/icons/FomiIcons";

interface PromptCardProps {
  prompt: string;
  onPromptChange: (v: string) => void;
  count: number;
  onCountChange: (n: number) => void;
  modelId: string;
  onModelChange: (id: string) => void;
  styleId: string;
  onStyleChange: (id: string) => void;
  aspectId: string;
  onAspectChange: (id: string) => void;
  seed?: number;
  onSeedChange: (n: number | undefined) => void;
  steps: number;
  onStepsChange: (n: number) => void;
  guidance: number;
  onGuidanceChange: (n: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

/** Left sidebar containing the prompt textarea, Generate CTA, and the four
 *  accordions from the mockup: "4 Images", "Model Name", "Advance", "Styles".
 *  Collapses to a sticky sheet on mobile. */
export function PromptCard(props: PromptCardProps) {
  const [advanceOpen, setAdvanceOpen] = React.useState(false);
  const [stylesOpen, setStylesOpen] = React.useState(true);

  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-black/[0.06] shadow-smooth">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fomi-teal">
          Create Image
        </h2>
        <span className="text-[10px] uppercase tracking-widest text-black/40">
          Workspace
        </span>
      </div>

      {/* Prompt textarea */}
      <label className="block">
        <span className="sr-only">Prompt</span>
        <textarea
          value={props.prompt}
          onChange={(e) => props.onPromptChange(e.target.value)}
          placeholder={DEFAULT_PROMPT_PLACEHOLDER}
          rows={5}
          className="w-full px-3 py-2.5 text-sm rounded-xl bg-black/[0.03] border border-black/5 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-fomi-coral/40 focus:bg-white transition resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              props.onGenerate();
            }
          }}
        />
        <span className="block mt-1 text-[11px] text-black/45">
          ⌘/Ctrl + Enter to generate
        </span>
      </label>

      {/* Generate button */}
      <GenerateButton
        disabled={!props.prompt.trim() || props.isGenerating}
        onClick={props.onGenerate}
        loading={props.isGenerating}
      />

      {/* Inline quick controls */}
      <div className="grid grid-cols-2 gap-2">
        <CountPicker
          value={props.count}
          onChange={props.onCountChange}
        />
        <ModelPicker
          value={props.modelId}
          onChange={props.onModelChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <AspectPicker
          value={props.aspectId}
          onChange={props.onAspectChange}
        />
        <StylePicker
          value={props.styleId}
          onChange={props.onStyleChange}
        />
      </div>

      {/* Advance accordion */}
      <Accordion
        open={advanceOpen}
        onToggle={() => setAdvanceOpen((o) => !o)}
        icon={<SlidersIcon size={14} />}
        title="Advance"
        subtitle="Steps · Guidance · Seed"
      >
        <div className="grid gap-3">
          {ADVANCED_FIELDS.map((field) => {
            if ("placeholder" in field) {
              return (
                <NumberField
                  key={field.id}
                  label={field.name}
                  value={props.seed}
                  placeholder={field.placeholder}
                  onChange={(v) => props.onSeedChange(v)}
                />
              );
            }
            const value =
              field.id === "steps" ? props.steps : props.guidance;
            const onChange =
              field.id === "steps"
                ? props.onStepsChange
                : props.onGuidanceChange;
            return (
              <SliderField
                key={field.id}
                label={field.name}
                value={value}
                min={field.min}
                max={field.max}
                step={field.step}
                unit={field.unit}
                onChange={onChange}
              />
            );
          })}
        </div>
      </Accordion>

      {/* Styles accordion */}
      <Accordion
        open={stylesOpen}
        onToggle={() => setStylesOpen((o) => !o)}
        icon={<PaletteIcon size={14} />}
        title="Styles"
        subtitle={`${STYLE_PRESETS.length} curated presets`}
      >
        <div className="grid grid-cols-4 gap-2">
          {STYLE_PRESETS.map((s) => (
            <StyleChip
              key={s.id}
              swatch={s.swatch}
              label={s.name}
              active={props.styleId === s.id}
              onClick={() => props.onStyleChange(s.id)}
            />
          ))}
        </div>
      </Accordion>
    </div>
  );
}

function GenerateButton({
  disabled,
  onClick,
  loading,
}: {
  disabled: boolean;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-busy={loading}
      className={`relative h-11 w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-all
        ${
          disabled
            ? "bg-black/30 cursor-not-allowed"
            : "bg-fomi-coral hover:brightness-110 active:scale-[0.99] shadow-[0_4px_20px_-4px_rgba(255,107,74,0.6)]"
        }
      `}
    >
      {loading ? (
        <SpinnerIcon size={16} />
      ) : (
        <SparkleIcon size={16} />
      )}
      <span>{loading ? "Generating..." : "Generate"}</span>
    </button>
  );
}

function CountPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dropdown
      label={`${value} ${value === 1 ? "Image" : "Images"}`}
      open={open}
      onToggle={() => setOpen((o) => !o)}
    >
      {IMAGE_COUNTS.map((n) => (
        <DropdownItem
          key={n}
          active={n === value}
          onClick={() => {
            onChange(n);
            setOpen(false);
          }}
        >
          {n} {n === 1 ? "Image" : "Images"}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

function ModelPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const active = MODELS.find((m) => m.id === value);
  return (
    <Dropdown
      label={active?.name ?? "Model"}
      open={open}
      onToggle={() => setOpen((o) => !o)}
    >
      {MODELS.map((m) => (
        <DropdownItem
          key={m.id}
          active={m.id === value}
          onClick={() => {
            onChange(m.id);
            setOpen(false);
          }}
          hint={m.description}
        >
          {m.name}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

function AspectPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const active = ASPECT_RATIOS.find((r) => r.id === value);
  return (
    <Dropdown
      label={active?.label ?? "Aspect"}
      open={open}
      onToggle={() => setOpen((o) => !o)}
    >
      {ASPECT_RATIOS.map((r) => (
        <DropdownItem
          key={r.id}
          active={r.id === value}
          onClick={() => {
            onChange(r.id);
            setOpen(false);
          }}
          hint={r.hint}
        >
          {r.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

function StylePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const active = STYLE_PRESETS.find((s) => s.id === value);
  return (
    <Dropdown
      label={active?.name ?? "Style"}
      open={open}
      onToggle={() => setOpen((o) => !o)}
    >
      {STYLE_PRESETS.map((s) => (
        <DropdownItem
          key={s.id}
          active={s.id === value}
          onClick={() => {
            onChange(s.id);
            setOpen(false);
          }}
          swatch={s.swatch}
        >
          {s.name}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

function Accordion({
  open,
  onToggle,
  icon,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-white">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
      >
        <span className="flex items-center gap-2">
          <span className="text-black/45">{icon}</span>
          <span className="text-[13px] font-semibold text-fomi-teal">
            {title}
          </span>
          {subtitle && (
            <span className="text-[10px] uppercase tracking-widest text-black/35">
              {subtitle}
            </span>
          )}
        </span>
        <ChevronDownIcon
          size={14}
          className={`text-black/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-black/60">{label}</label>
        <span className="text-xs font-mono text-fomi-teal">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-fomi-coral h-1.5 cursor-pointer"
        aria-label={label}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value?: number;
  placeholder: string;
  onChange: (n: number | undefined) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-black/60 mb-1.5">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value.trim();
            if (!v) onChange(undefined);
            else onChange(parseInt(v, 10));
          }}
          className="flex-1 px-2 py-1.5 text-sm rounded-lg bg-black/[0.03] border border-black/5 focus:outline-none focus:ring-2 focus:ring-fomi-coral/40"
        />
        <button
          onClick={() => onChange(undefined)}
          className="text-[10px] uppercase tracking-widest text-black/45 hover:text-fomi-coral px-2 py-1"
        >
          rand
        </button>
      </div>
    </div>
  );
}

function StyleChip({
  swatch,
  label,
  active,
  onClick,
}: {
  swatch: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg border text-[10px] transition-all
        ${
          active
            ? "border-fomi-coral/60 bg-fomi-coral-soft"
            : "border-black/5 hover:border-black/15 bg-white"
        }
      `}
    >
      <span
        className="h-7 w-7 rounded-full ring-1 ring-black/10"
        style={{ background: swatch }}
      />
      <span className="text-black/70 font-medium">{label}</span>
    </button>
  );
}

/* === Internal dropdown primitives === */

function Dropdown({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full h-10 flex items-center justify-between px-3 rounded-xl bg-black/[0.03] border border-black/5 text-sm hover:bg-black/[0.05] transition"
      >
        <span className="truncate">{label}</span>
        <ChevronDownIcon
          size={14}
          className={`text-black/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 left-0 right-0 min-w-[180px] p-1 rounded-xl bg-white border border-black/10 shadow-lg animate-in fade-in slide-in-from-top-2 max-h-72 overflow-auto scrollbar-thin-light">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  active,
  onClick,
  children,
  hint,
  swatch,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: string;
  swatch?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors
        ${
          active
            ? "bg-fomi-coral-soft text-fomi-teal"
            : "hover:bg-black/[0.04] text-black/80"
        }
      `}
    >
      {swatch && (
        <span
          className="mt-0.5 h-3.5 w-3.5 rounded-full ring-1 ring-black/10 shrink-0"
          style={{ background: swatch }}
        />
      )}
      <span className="flex-1 min-w-0">
        <span className="block truncate font-medium">{children}</span>
        {hint && (
          <span className="block text-[11px] text-black/45 mt-0.5 line-clamp-2">
            {hint}
          </span>
        )}
      </span>
      {active && <ChevronRightIcon size={14} className="text-fomi-coral shrink-0 mt-0.5" />}
    </button>
  );
}
