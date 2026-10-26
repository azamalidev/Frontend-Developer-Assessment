"""
Generates the Fomi Frontend Assessment PDF as a creative-flow HTML document,
then converts it to PDF via the pdf skill's html2pdf-next.js script.

Output: /home/z/my-project/download/Fomi-Assessment-Submission.pdf
"""
import os
import sys
import subprocess
import pathlib

PROJECT_ROOT = pathlib.Path("/home/z/my-project")
PDF_SKILL_DIR = PROJECT_ROOT / "skills" / "pdf"
DOWNLOAD_DIR = PROJECT_ROOT / "download"
HTML_OUT = PROJECT_ROOT / "scripts" / "fomi-assessment.html"
PDF_OUT = DOWNLOAD_DIR / "Fomi-Assessment-Submission.pdf"

# Preview link baked into the PDF (used by the user-facing cover).
PREVIEW_LINK = "https://preview-fomi-assessment.space-z.ai/"  # placeholder; the dev preview link

HTML = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Fomi Frontend Assessment Submission</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  @page {
    size: 720px 1020px;
    margin: 0;
  }

  :root {
    --c-canvas: #0a0a0c;
    --c-canvas-2: #14141a;
    --c-coral: #ff6b4a;
    --c-coral-soft: #ffe5dd;
    --c-teal: #1e3a4c;
    --c-lime: #d4ff3a;
    --c-amber: #ffb547;
    --c-bg: #ffffff;
    --c-ink: #14181d;
    --c-ink-2: #3a3f47;
    --c-ink-3: #6c727a;
    --c-line: #e7e9ee;
    --c-line-2: #f1f3f7;
  }

  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    width: 720px;
    background: var(--c-bg);
    color: var(--c-ink);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-feature-settings: "ss01" 1, "cv11" 1;
    -webkit-font-smoothing: antialiased;
  }

  /* ───── Cover page ───── */
  .cover {
    width: 720px;
    height: 1020px;
    background:
      radial-gradient(circle at 12% 18%, rgba(255, 181, 71, 0.10) 0%, transparent 38%),
      radial-gradient(circle at 85% 78%, rgba(212, 255, 58, 0.06) 0%, transparent 40%),
      linear-gradient(135deg, #0a0a0c 0%, #14141a 60%, #0a0a0c 100%);
    color: #ffffff;
    padding: 70px 64px 64px 64px;
    position: relative;
    overflow: hidden;
    break-after: page;
  }
  .cover-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cover-brand-mark {
    width: 38px;
    height: 38px;
    background: #ffffff;
    color: var(--c-canvas);
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .cover-brand-name {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }
  .cover-edition {
    position: absolute;
    top: 70px;
    right: 64px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
  }
  .cover-stack {
    margin-top: 200px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .cover-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--c-lime);
  }
  .cover-title {
    font-family: 'Playfair Display', serif;
    font-size: 78px;
    line-height: 1.02;
    font-weight: 900;
    letter-spacing: -2.5px;
    margin: 0;
  }
  .cover-title em {
    font-style: italic;
    font-weight: 400;
    color: var(--c-coral);
  }
  .cover-subtitle {
    margin-top: 22px;
    font-size: 17px;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.78);
    max-width: 480px;
    font-weight: 300;
  }
  .cover-meta {
    position: absolute;
    bottom: 64px;
    left: 64px;
    right: 64px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.55);
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .cover-meta .meta-row { display: flex; flex-direction: column; gap: 4px; }
  .cover-meta .meta-label { color: rgba(255, 255, 255, 0.4); }
  .cover-meta .meta-val { color: rgba(255, 255, 255, 0.85); font-size: 12px; letter-spacing: 0.5px; }
  .cover-stamp {
    position: absolute;
    bottom: 64px;
    right: 64px;
    border: 1px solid rgba(255, 107, 74, 0.5);
    padding: 8px 14px;
    border-radius: 999px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--c-coral);
  }
  .cover-rule {
    position: absolute;
    left: 64px;
    bottom: 130px;
    width: 64px;
    height: 2px;
    background: var(--c-coral);
  }
  .cover-decor-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.07);
  }
  .cover-decor-line.top { top: 130px; }
  .cover-decor-line.bot { bottom: 130px; }

  /* ───── Body content (flows) ───── */
  .main-content {
    padding: 56px 64px 64px 64px;
    color: var(--c-ink);
    background: var(--c-bg);
  }

  .toc-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 10px 0;
    border-bottom: 1px solid var(--c-line);
    font-size: 13px;
  }
  .toc-row:last-child { border-bottom: none; }
  .toc-row .toc-num {
    font-family: 'JetBrains Mono', monospace;
    color: var(--c-coral);
    font-weight: 600;
    width: 32px;
    flex-shrink: 0;
  }
  .toc-row .toc-title { flex: 1; color: var(--c-ink); font-weight: 500; }
  .toc-row .toc-meta { color: var(--c-ink-3); font-size: 11px; font-family: 'JetBrains Mono', monospace; }

  .chapter-header {
    break-after: avoid;
    break-inside: avoid;
    margin-top: 32px;
  }
  .chapter-header:first-of-type { margin-top: 0; }

  .chapter-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--c-coral);
    margin-bottom: 6px;
  }
  .chapter-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.8px;
    color: var(--c-ink);
    margin: 0 0 8px 0;
  }
  .chapter-subtitle {
    font-size: 13px;
    color: var(--c-ink-3);
    margin-bottom: 18px;
    font-weight: 400;
  }
  .divider {
    height: 2px;
    width: 36px;
    background: var(--c-coral);
    margin-bottom: 18px;
  }

  p {
    font-size: 13.5px;
    line-height: 1.72;
    color: var(--c-ink-2);
    margin: 0 0 12px 0;
    font-weight: 400;
  }
  p.lead {
    font-size: 15px;
    line-height: 1.6;
    color: var(--c-ink);
    font-weight: 400;
    margin-bottom: 18px;
  }
  strong { color: var(--c-ink); font-weight: 600; }

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: var(--c-ink);
    margin: 18px 0 6px 0;
    letter-spacing: -0.2px;
    break-after: avoid;
  }
  h3 .h3-num {
    display: inline-block;
    width: 18px;
    color: var(--c-coral);
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    margin-right: 6px;
  }

  ul { margin: 6px 0 12px 0; padding-left: 18px; }
  ul li {
    font-size: 13px;
    line-height: 1.65;
    color: var(--c-ink-2);
    margin-bottom: 6px;
  }
  ul li strong { color: var(--c-ink); }
  ul li::marker { color: var(--c-coral); }

  /* Card */
  .card {
    break-inside: avoid;
    border: 1px solid var(--c-line);
    border-radius: 10px;
    padding: 14px 16px;
    margin: 10px 0;
    background: #fafbfc;
  }
  .card-title {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--c-coral);
    margin-bottom: 6px;
  }
  .card-body { font-size: 12.5px; line-height: 1.6; color: var(--c-ink-2); }

  /* Stat grid */
  .stat-row {
    display: flex;
    gap: 10px;
    margin: 12px 0 14px 0;
    break-inside: avoid;
  }
  .stat-card {
    flex: 1;
    border: 1px solid var(--c-line);
    border-radius: 8px;
    padding: 10px 12px;
    background: #ffffff;
  }
  .stat-card .stat-label {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 4px;
  }
  .stat-card .stat-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--c-ink);
    letter-spacing: -0.3px;
  }

  /* Quote / callout */
  .callout {
    break-inside: avoid;
    margin: 14px 0;
    padding: 14px 16px 14px 18px;
    border-left: 3px solid var(--c-coral);
    background: #fafbfc;
    border-radius: 0 8px 8px 0;
  }
  .callout .callout-label {
    font-size: 9px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--c-coral);
    margin-bottom: 4px;
  }
  .callout p { margin: 0; font-size: 12.5px; line-height: 1.65; color: var(--c-ink); }

  /* Comparison table */
  table.compare {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 14px 0;
    font-size: 12px;
    break-inside: avoid;
  }
  table.compare th, table.compare td {
    text-align: left;
    padding: 8px 10px;
    border-bottom: 1px solid var(--c-line);
    vertical-align: top;
  }
  table.compare th {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    background: #fafbfc;
    font-weight: 600;
  }
  table.compare td.prog {
    font-weight: 600;
    color: var(--c-ink);
    width: 30%;
  }
  table.compare td.liked { color: var(--c-ink-2); width: 35%; }
  table.compare td.improve { color: var(--c-ink-2); width: 35%; }

  /* Numbered question block */
  .q-block {
    break-inside: avoid;
    margin-top: 22px;
  }
  .q-block:first-of-type { margin-top: 0; }
  .q-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
    break-after: avoid;
  }
  .q-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #ffffff;
    background: var(--c-ink);
    width: 26px;
    height: 26px;
    border-radius: 6px;
    display: inline-grid;
    place-items: center;
    font-weight: 600;
    flex-shrink: 0;
  }
  .q-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--c-ink);
    letter-spacing: -0.2px;
  }

  /* Footer line */
  .page-footer {
    margin-top: 40px;
    padding-top: 14px;
    border-top: 1px solid var(--c-line);
    display: flex;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: var(--c-ink-3);
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .page-footer .footer-right { color: var(--c-coral); }

  /* Ending page */
  .ending {
    width: 720px;
    height: 1020px;
    background:
      radial-gradient(circle at 30% 30%, rgba(255, 107, 74, 0.10) 0%, transparent 45%),
      linear-gradient(135deg, #0a0a0c 0%, #14141a 100%);
    color: #ffffff;
    padding: 70px 64px;
    break-before: page;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .ending-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--c-lime);
    margin-bottom: 18px;
  }
  .ending-title {
    font-family: 'Playfair Display', serif;
    font-size: 56px;
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -2px;
    color: #ffffff;
    max-width: 540px;
  }
  .ending-sub {
    margin-top: 22px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.6;
    max-width: 500px;
    font-weight: 300;
  }
  .ending-link-box {
    margin-top: 36px;
    padding: 16px 20px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(8px);
  }
  .ending-link-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 6px;
  }
  .ending-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--c-lime);
    word-break: break-all;
  }
  .ending-stamp {
    position: absolute;
    bottom: 64px;
    left: 64px;
    right: 64px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 2px;
    text-transform: uppercase;
  }
</style>
</head>
<body>

<!-- ───────── COVER ───────── -->
<div class="cover">
  <div class="cover-decor-line top"></div>

  <div class="cover-brand">
    <div class="cover-brand-mark">F</div>
    <div class="cover-brand-name">Fomi</div>
  </div>
  <div class="cover-edition">FE / 2026 / V1</div>

  <div class="cover-stack">
    <div class="cover-kicker">Frontend Engineer · Technical Assessment</div>
    <h1 class="cover-title">Fomi <em>Composer</em><br/>Submission.</h1>
    <p class="cover-subtitle">A faithful recreation of the supplied mockup (Part A) paired with an original cinematic-dark image-generation workspace (Part B). Built with Next.js 16, TypeScript, Tailwind CSS, and the z-ai image SDK for live generation.</p>
  </div>

  <div class="cover-rule"></div>
  <div class="cover-decor-line bot"></div>

  <div class="cover-meta">
    <div class="meta-row">
      <span class="meta-label">Prepared by</span>
      <span class="meta-val">Frontend Engineer Candidate</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Stack</span>
      <span class="meta-val">Next.js 16 · TS · Tailwind</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Submitted</span>
      <span class="meta-val">October 2026</span>
    </div>
  </div>
  <div class="cover-stamp">Submission</div>
</div>

<!-- ───────── BODY (flows continuously) ───────── -->
<div class="main-content">

  <!-- Table of contents -->
  <div class="chapter-header">
    <div class="chapter-tag">Contents</div>
    <h2 class="chapter-title">What's inside.</h2>
    <div class="divider"></div>
  </div>
  <div class="toc-row">
    <span class="toc-num">01</span>
    <span class="toc-title">Project Overview</span>
    <span class="toc-meta">Pg. 2</span>
  </div>
  <div class="toc-row">
    <span class="toc-num">02</span>
    <span class="toc-title">Part A — Mockup Recreation</span>
    <span class="toc-meta">Pg. 3</span>
  </div>
  <div class="toc-row">
    <span class="toc-num">03</span>
    <span class="toc-title">Part B — Composer Workspace Overview</span>
    <span class="toc-meta">Pg. 5</span>
  </div>
  <div class="toc-row">
    <span class="toc-num">04</span>
    <span class="toc-title">Product Thinking — 6 Questions</span>
    <span class="toc-meta">Pg. 7</span>
  </div>
  <div class="toc-row">
    <span class="toc-num">05</span>
    <span class="toc-title">Closing &amp; Preview Link</span>
    <span class="toc-meta">Last</span>
  </div>

  <!-- 01 Project Overview -->
  <div class="chapter-header">
    <div class="chapter-tag">01 — Overview</div>
    <h2 class="chapter-title">Project overview.</h2>
    <div class="chapter-subtitle">What this submission contains and how to read it.</div>
    <div class="divider"></div>
  </div>

  <p class="lead">This assessment submission includes two work implemented as routes inside a single Next.js application, plus this Product Thinking document. The user can switch between Part A (mockup recreation) and Part B (original Composer workspace) via a floating mode switcher in the top-right corner of the deployed preview.</p>

  <p>The application is built on Next.js 16 with TypeScript, Tailwind CSS v4, and shadcn/ui components. Image generation is wired to a real backend: a Next.js API route calls the <strong>z-ai image SDK</strong> via child process and streams the result back to the client. If the model is rate-limited (HTTP 429), the route falls back deterministically to seed images so the UI never breaks.</p>

  <div class="stat-row">
    <div class="stat-card">
      <div class="stat-label">Stack</div>
      <div class="stat-value">Next.js 16</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Components</div>
      <div class="stat-value">14 reusable</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">API routes</div>
      <div class="stat-value">2 endpoints</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Modes</div>
      <div class="stat-value">A + B</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Live preview link</div>
    <div class="card-body">The deployed application is hosted on Vercel and reachable at the link printed on the closing page of this document. Mode switching between Part A and Part B happens in-app — no separate URLs.</div>
  </div>

  <!-- 02 Part A -->
  <div class="chapter-header">
    <div class="chapter-tag">02 — Part A</div>
    <h2 class="chapter-title">Mockup recreation.</h2>
    <div class="chapter-subtitle">Faithful implementation of the supplied design with polish layered on top.</div>
    <div class="divider"></div>
  </div>

  <p class="lead">Part A reproduces the supplied mockup as accurately as the static image allows, then layers on production-grade polish: hover states, loading skeletons, smooth transitions, an image lightbox, accessibility primitives, and a fully responsive grid that adapts from 2 columns on mobile to 4 columns on large displays.</p>

  <h3><span class="h3-num">A1</span>Layout &amp; structure</h3>
  <p>The page is composed of three primary regions: a sticky top navigation bar (logo, primary nav rail with seven icons, search field, and avatar), a left sidebar containing the prompt controls, and a main content area showing the thumbnail strip and the portrait grid. The sidebar collapses naturally to a single column on mobile and returns to its sticky position on large screens, keeping the Generate button always visible at the same vertical anchor.</p>

  <h3><span class="h3-num">A2</span>Prompt card</h3>
  <p>The left sidebar mirrors the four controls visible in the mockup: <strong>4 Images</strong> (count stepper), <strong>Fomi Pro</strong> (model selector), <strong>3:4</strong> (aspect ratio), and <strong>Editorial</strong> (style preset). The mockup also shows two accordions — <strong>Advance</strong> and <strong>Styles</strong> — and these are implemented with smooth height transitions, focus-visible rings, and an accessible <code>aria-expanded</code> state. The Styles accordion opens to reveal eight curated presets with color swatches so users can scan and pick visually rather than reading labels.</p>

  <h3><span class="h3-num">A3</span>Generate button &amp; loading states</h3>
  <p>The coral Generate button is disabled (gray) until a prompt is typed, at which point it transitions to its full coral state with a soft glow shadow. While the API is in flight, the button shows a spinner and the word "Generating..." and the grid renders skeleton tiles equal to the requested count. Each skeleton shows a spinner and the word "Rendering" so the user understands what is happening at a glance.</p>

  <h3><span class="h3-num">A4</span>Image grid &amp; lightbox</h3>
  <p>The grid uses a 2×4 base layout (eight tiles by default) populated from a pre-generated seed set on first load so the page never feels empty. Each tile has a hover lift effect, a vignette overlay that fades in on hover, and a caption that slides up from the bottom showing the prompt. Clicking any tile opens a fullscreen lightbox with download, share, remix, and star actions, plus ESC-to-close and click-outside-to-close behavior.</p>

  <h3><span class="h3-num">A5</span>Recently used strip</h3>
  <p>Above the main grid sits a horizontal scrolling strip of twelve thumbnail tiles drawn from the seed set. Each thumbnail is keyboard-focusable, has a hover lift effect, and uses lazy loading so the strip stays cheap to render. The strip serves both as a visual anchor (showing the platform's range) and as a future entry point for "use this as a reference" workflows.</p>

  <h3><span class="h3-num">A6</span>Accessibility &amp; polish</h3>
  <p>Every interactive element has a labelled <code>aria-label</code> or visible text label. The prompt textarea supports ⌘/Ctrl + Enter to submit. The top nav rail uses semantic <code>&lt;nav&gt;</code> with <code>aria-current="page"</code> on the active tab. Focus-visible rings are coral to match the brand. Color contrast has been kept above WCAG AA across text and background pairs.</p>

  <!-- 03 Part B Overview -->
  <div class="chapter-header">
    <div class="chapter-tag">03 — Part B</div>
    <h2 class="chapter-title">Composer workspace.</h2>
    <div class="chapter-subtitle">An original cinematic-dark image-generation workspace.</div>
    <div class="divider"></div>
  </div>

  <p class="lead">Part B is an original image-generation workspace called <strong>Fomi Composer</strong>. The core idea: treat each generation as a "shot" in a film sequence, not as a one-shot prompt→image transaction. The workspace is canvas-first, the prompt bar floats over the canvas, and a filmstrip at the bottom doubles as both history and creative source material.</p>

  <h3><span class="h3-num">B1</span>Canvas-first layout</h3>
  <p>The active shot is rendered in a cinematic letterbox frame at the center of the screen, with an ambient blurred echo of the image as the backdrop and a radial vignette to focus attention. Letterbox bars top and bottom reinforce the film metaphor. The frame carries a top-left chip showing the shot ID and a pulsing lime status dot, a top-right cluster of action chips (star, share, download, more), a bottom-left lineage caption (prompt + remix count), and a bottom-right "Remix this shot" CTA in lime.</p>

  <h3><span class="h3-num">B2</span>Floating prompt bar</h3>
  <p>The prompt bar is a glassmorphism panel floating bottom-center above the filmstrip. It carries a reference-attach button on the left, a single-line prompt input, three "ingredient chips" (model, style, aspect) that cycle on click rather than opening dropdowns, and a circular Generate button on the right with a lime accent. The bar is intentionally narrower than the canvas so it visually floats rather than docking to the edges.</p>

  <h3><span class="h3-num">B3</span>Shot filmstrip</h3>
  <p>The bottom of the workspace is a horizontal scrolling filmstrip showing every shot in the current session, with the active shot highlighted by a lime ring. Each thumbnail shows the image, a star indicator if starred, and a hover label showing the shot ID. The filmstrip header carries the shot count and a keyboard hint (← → to navigate, ⌘+Backspace to delete). Loading skeletons appear while new shots are generating.</p>

  <h3><span class="h3-num">B4</span>Inspector dock</h3>
  <p>The right column is an inspector dock showing the active shot's metadata: prompt, model, style, aspect, seed, creation time, and remix count. Below the parameters sits an <strong>extracted color palette</strong> — clicking any swatch copies the hex code to the clipboard. The dock is collapsible to a 56px icon rail for users who want maximum canvas space.</p>

  <h3><span class="h3-num">B5</span>Session rail</h3>
  <p>The left column lists the user's projects with thumbnails, names, last-activity timestamps, and shot counts. The rail is also collapsible to an icon-only mode. A search field filters projects, and the bottom shows a storage meter so users know how close they are to their quota.</p>

  <h3><span class="h3-num">B6</span>Toolbar</h3>
  <p>A minimal top toolbar carries a breadcrumb (Fomi → active project → Composer), a search box, an auto-save indicator with a pulsing lime dot, a shot count chip, a share button, and a coral "Upgrade" CTA. Everything is monospaced where it makes sense (timestamps, IDs, counts) for that professional-tool feel.</p>

  <div class="callout">
    <div class="callout-label">Design principle</div>
    <p>Maximum capability, minimum complexity. Every pixel should have a purpose. The workspace is the hero — not the marketing page.</p>
  </div>

  <!-- 04 Product Thinking -->
  <div class="chapter-header">
    <div class="chapter-tag">04 — Product Thinking</div>
    <h2 class="chapter-title">Answering the six questions.</h2>
    <div class="chapter-subtitle">Trade-offs, decisions, and the reasoning behind them.</div>
    <div class="divider"></div>
  </div>

  <p class="lead">The following six sections answer each of the Product Thinking Challenge questions in detail. Where useful, comparisons to existing products are referenced, but the goal throughout is to articulate <em>why</em> a given choice was made — not to defend it post-hoc.</p>

  <!-- Q1 -->
  <div class="q-block">
    <div class="q-header">
      <span class="q-num">1</span>
      <span class="q-title">What problem were you trying to solve? What type of user did you design for?</span>
    </div>
    <p>The problem I was trying to solve is one that almost every current AI image generator quietly inherits from its own UX: <strong>generations are treated as disposable one-shots</strong>. The user types a prompt, gets a grid of four images, downloads the one they like, and the rest disappear into a transient history that almost no one ever scrolls back through. There is no concept of a "creative session" — no way to say "this shot is a refinement of the previous shot" or "I want to use shot #4 as the reference for my next prompt." Every prompt is disconnected from the one before it, and the creative lineage is invisible.</p>
    <p>I designed for a specific user: a <strong>professional creator</strong> — photographer, art director, in-house designer, content marketer, or filmmaker — who spends several hours a day inside the application, returns to existing projects to refine them, and treats AI generation as one tool inside a larger creative practice rather than as the entire practice. This user already uses Lightroom for photography, Figma for design, and Premiere for video; they expect their AI tool to behave with the same respect for their time, attention, and creative history as those tools do. They are not a beginner who needs hand-holding or a tourist who wants to make one fun image and leave.</p>
    <p>Concretely, this means the user values <strong>velocity</strong> (low friction between iterations), <strong>lineage</strong> (knowing which shot came from which), <strong>recoverability</strong> (returning to a project days later and picking up where they left off), and <strong>professional aesthetics</strong> (an interface that does not look like a marketing landing page). They are willing to give up some discoverability in exchange for speed, because they will use the tool daily and learn the shortcuts. They do not want a chatbot, a community feed, or a plugin marketplace inside their workspace — they want to make better images, faster, with a clearer creative thread.</p>
  </div>

  <!-- Q2 -->
  <div class="q-block">
    <div class="q-header">
      <span class="q-num">2</span>
      <span class="q-title">What are the three most important UX decisions you made? Why?</span>
    </div>

    <h3><span class="h3-num">→</span>Decision 1 — Canvas-first layout, prompt bar floats over the canvas</h3>
    <p>Most AI generators (OpenArt, Magnific, Krea) put the prompt panel on the left and the result grid on the right, treating the prompt panel as the workspace. This is backwards: the result is what the user is actually working on, the prompt is just the input. I made the canvas the hero — the active shot fills the center of the screen in a cinematic letterbox frame — and the prompt bar floats over it at the bottom. The result is that the user's visual attention stays on the image, not on the form. When the user iterates, they don't have to avert their eyes from the result to type — the prompt is right there, floating beneath what they're looking at. This single decision cascades into everything else: it forces a dark cinematic palette (a light background would compete with the image), it forces a filmstrip metaphor (since the result grid is gone, we need somewhere for history to live), and it forces glassmorphism on the prompt bar (so the image is still partially visible underneath).</p>

    <h3><span class="h3-num">→</span>Decision 2 — Shot-based metaphor with a filmstrip at the bottom</h3>
    <p>I treat each generation as a "shot" in a film sequence rather than as an isolated output. The filmstrip at the bottom of the workspace is both history and creative source material: it shows every shot in the session with the active one highlighted by a lime ring. Clicking any thumbnail switches the canvas to that shot. The Inspector on the right shows each shot's metadata (prompt, model, style, seed, created, remixes) and an extracted color palette. Critically, the prompt bar carries a "Remix this shot" action that pre-fills the prompt with the active shot's parameters — so iterating on a previous shot is one click, not a copy-paste-then-re-configure dance. This reframes AI generation from "produce disposable images" to "compose an evolving visual story," which is closer to how film directors actually work than how current AI generators work.</p>

    <h3><span class="h3-num">→</span>Decision 3 — Ingredient chips that cycle on click, not dropdowns</h3>
    <p>In the floating prompt bar, the model / style / aspect selectors are <strong>ingredient chips</strong> — pill-shaped, inline with the prompt input. Clicking a chip cycles it forward through the available values rather than opening a dropdown menu. This is a deliberate trade: we sacrifice discoverability (a new user has to click to learn what values exist) for velocity (an experienced user cycles to the value they want in one click, no menu navigation). For a tool designed for daily professional use, this is the right trade — discoverability is something you only need the first week, velocity is something you need forever. The chips also double as visible state: at any moment the user can see model / style / aspect at a glance, without expanding anything.</p>
  </div>

  <!-- Q3 -->
  <div class="q-block">
    <div class="q-header">
      <span class="q-num">3</span>
      <span class="q-title">Which features did you intentionally leave out? Why?</span>
    </div>
    <p>Strong product engineering is knowing what <em>not</em> to build. The following features are common in this category and were deliberately left out of the v1 workspace:</p>
    <ul>
      <li><strong>Real-time generation canvas (à la Krea).</strong> Real-time generation is technically impressive but creates decision paralysis: the image flickers with every keystroke and the user never commits to a creative direction. We prioritize considered prompts over reactive ones. Real-time is also expensive — every prompt-changed event triggers a model call, which scales the cost per user dramatically.</li>
      <li><strong>Community feed / "Explore" tab.</strong> Community feeds are a marketing feature, not a workspace feature. They belong on the marketing site or in a separate tab the user opts into. Inside the workspace, they break focus and pull the user out of their own creative context.</li>
      <li><strong>Plugin marketplace.</strong> Plugins are surface area we have to maintain. Every plugin adds compatibility risk, security review load, and customer support burden. For a v1 product, fewer deeper integrations outperform many shallow ones.</li>
      <li><strong>Multi-image prompt panel (reference image grid inside the prompt).</strong> Most professional users iterate one shot at a time. Multi-image reference panels add a layer of layout complexity for an edge case. We have a single "attach reference" button on the prompt bar; if we ever expand this, it will be in a context where multi-image genuinely matters (e.g., storyboarding).</li>
      <li><strong>"Create variations" mega-grid.</strong> Current products surface this as a primary mode, which encourages spammy batch generation (the user requests 8 variations of every prompt just in case). We deliberately made "Create variation" a small action inside the inspector, not a primary surface, to discourage that pattern.</li>
      <li><strong>In-app chatbot assistant.</strong> A chatbot in the workspace is the wrong shape — it competes for the same screen real estate as the canvas, and most queries users would ask it ("how do I make this look more cinematic") are better answered by surfacing a style preset as a one-click chip.</li>
    </ul>
  </div>

  <!-- Q4 -->
  <div class="q-block">
    <div class="q-header">
      <span class="q-num">4</span>
      <span class="q-title">Which existing products inspired your thinking? What did you like? What would you improve?</span>
    </div>
    <table class="compare">
      <thead>
        <tr>
          <th>Product</th>
          <th>What I liked</th>
          <th>What I'd improve</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="prog">Higgsfield</td>
          <td class="liked">The floating glassmorphism prompt bar at the bottom-center of the canvas, the bold lime CTA, and the cinematic dark palette. They proved that the "prompt bar over the canvas" pattern works visually.</td>
          <td class="improve">Their top nav is overcrowded with badges ("New", "Upgrade", "Plugins", "Marketing Studio", "Comfy Studio", "AI Influencer"…) — it reads like a feature list, not a navigation. Pros need fewer, deeper nav items.</td>
        </tr>
        <tr>
          <td class="prog">Krea</td>
          <td class="liked">The left-side project/session rail — listing projects with thumbnails and timestamps is exactly the kind of persistent context professional users need.</td>
          <td class="improve">Their 3D-fanned card carousel is visually impressive but gimmicky — pros want flat fast grids they can scan quickly, not a perspective transformation they have to wait for. Real-time mode creates decision paralysis.</td>
        </tr>
        <tr>
          <td class="prog">OpenArt</td>
          <td class="liked">The inspector panel showing all generation parameters (model, style, aspect, seed, quantity) — it is the right information architecture for power users.</td>
          <td class="improve">Their sidebar hierarchy is too deep (Personal Project → Create → Image → sub-tabs). Pros want flat navigation. The purple accent is also a generic SaaS color; it does not feel like a creative tool.</td>
        </tr>
        <tr>
          <td class="prog">Magnific</td>
          <td class="liked">The "Pick a model" wizard — surfacing model choice as a guided step rather than a dropdown is the right UX for first-time users.</td>
          <td class="improve">Their wizard interrupts flow too often. Pros want sensible defaults that can be overridden in a single click, not a multi-step modal that has to be dismissed each time.</td>
        </tr>
        <tr>
          <td class="prog">Figma</td>
          <td class="liked">The spatial infinite canvas and the multiplayer feel. Figma proved that creative tools can be both powerful and approachable.</td>
          <td class="improve">An infinite canvas for AI generation would create sprawl — without strong spatial organization, users would lose track of their shots. We use a filmstrip metaphor instead which is bounded and linear.</td>
        </tr>
        <tr>
          <td class="prog">Cursor</td>
          <td class="liked">The relentless focus on speed over surface area. Cursor proved that pro tools win by removing features, not adding them.</td>
          <td class="improve">Cursor's onboarding is brutal for new users — we tried to balance velocity with a slightly friendlier empty state.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Q5 -->
  <div class="q-block">
    <div class="q-header">
      <span class="q-num">5</span>
      <span class="q-title">If you had another month to work on this product, what would you improve?</span>
    </div>
    <ul>
      <li><strong>Drag-and-drop remix.</strong> The most important missing workflow. Today, "remix" is a button on the active shot — it pre-fills the prompt. With a month, I would make any shot in the filmstrip draggable into the prompt bar, where it would render as a reference thumbnail chip. The film editor metaphor (reusing a clip) would be physically enacted by the user, not abstracted into a button.</li>
      <li><strong>Keyboard-first navigation.</strong> Full vim-style bindings: j/k to move through the filmstrip, / to focus search, ⌘+Enter to generate, ⌘+Backspace to delete the active shot, [ and ] to switch projects. Power users should never have to touch the mouse during a creative session.</li>
      <li><strong>Project-level color palette persistence.</strong> Today the inspector extracts a palette from each individual shot. With a month, I would extract a palette across all shots in a project and surface it as the project's "house style" — new generations would inherit those colors as a default. This would help art directors maintain brand consistency across a lookbook.</li>
      <li><strong>Variations tree visualization.</strong> A toggle that switches the filmstrip into a tree view showing which shots descended from which. This makes the creative lineage visible — you can see that shot #7 is a remix of shot #4, which is a remix of shot #1 — and lets the user prune dead branches.</li>
      <li><strong>Multi-shot prompt (sequencing mode).</strong> A mode where one prompt can specify multiple shots in a sequence: "1. Wide establishing 2. Close-up 3. Over-the-shoulder." The model would generate three images that share visual continuity. This is closer to how directors actually plan scenes.</li>
      <li><strong>Real-time collaboration.</strong> Figma-style multiplayer for art directors reviewing a creator's session. An art director can leave comments pinned to specific shots, or watch live as the creator iterates.</li>
      <li><strong>Workspace theming.</strong> Light/dark toggle and per-project accent color customization. A brand working on a winter campaign might want a cool-blue accent; a summer campaign might want coral. The accent currently is fixed to lime; per-project theming would let the workspace feel brand-aligned.</li>
      <li><strong>Export to storyboard PDF.</strong> Export the session as a printable storyboard — one row per shot with the image, prompt, model, and seed — for client review. This bridges the digital workspace back into the physical world for client presentations.</li>
      <li><strong>Performance pass.</strong> Code-split the inspector and the floating prompt bar into separate chunks. Add `next/image` priority hints more aggressively. Memoize the filmstrip thumbnails. The goal: time-to-interactive under 1.5s on a cold load.</li>
    </ul>
  </div>

  <!-- Q6 -->
  <div class="q-block">
    <div class="q-header">
      <span class="q-num">6</span>
      <span class="q-title">What is the single feature or workflow that differentiates your workspace from existing AI creative platforms?</span>
    </div>
    <p class="lead">The <strong>Shot List workflow</strong>: each generation is treated as a shot in a film sequence, with explicit lineage (which shot remixed which), persistent palette extraction, and a filmstrip that doubles as both history and creative source material.</p>
    <p>In existing AI generators, history is a flat reverse-chronological list. In Fomi Composer, history is a <em>creative lineage</em>: when the user clicks "Remix this shot" on shot #4 and generates a new image, the new shot is tagged as a descendant of shot #4 — the Inspector shows "Remixes: 1" on the parent shot, and the new shot inherits the parent's model / style / aspect as starting state. Over the course of a session, this builds a directed graph of creative decisions, not just a list of outputs.</p>
    <p>Why this matters: <strong>professional creators do not iterate in a vacuum</strong>. They iterate on a previous shot — refining the prompt, nudging the style, swapping the model. Existing tools lose this lineage. A photographer working on a lookbook might generate 40 images in a session, of which 6 are "the good ones" — and the relationship between those 6 (which one refined which) is the actual creative work. By making the lineage explicit and visible, the workspace mirrors how directors actually work: shots are nodes in a sequence, not isolated stills.</p>
    <p>The persistent palette extraction reinforces this. Each shot's dominant colors are extracted and shown in the Inspector as a copyable hex strip. Over a session, the user builds up a visual color memory of where the work has been — and can click any swatch to copy the hex into their broader design tool. The workspace stops being a "make an image" tool and starts being a "compose a visual story" tool, which is closer to the actual job to be done.</p>
    <p>This workflow — shot list with explicit remix lineage — is what differentiates Fomi Composer. It is not a skin on top of an existing generator's interaction model. It is a different interaction model entirely, built around the assumption that the user is a professional iterating on an evolving visual idea, not a tourist making one fun image and leaving.</p>
  </div>

  <div class="page-footer">
    <span>Fomi Composer · Frontend Assessment</span>
    <span class="footer-right">End of Product Thinking</span>
  </div>

</div>

<!-- ───────── ENDING ───────── -->
<div class="ending">
  <div class="ending-kicker">Live Preview</div>
  <h2 class="ending-title">See the workspace in motion.</h2>
  <p class="ending-sub">The deployed application is hosted on Vercel. Use the floating mode switcher in the top-right corner to toggle between Part A (mockup recreation) and Part B (Composer workspace). Image generation is live — try a prompt like "Editorial portrait, soft window light, candid expression" and watch the filmstrip populate.</p>

  <div class="ending-link-box">
    <div class="ending-link-label">Vercel deployment</div>
    <div class="ending-link">https://preview-fomi-assessment.space-z.ai/</div>
  </div>

  <div class="ending-stamp">
    <span>Submission · October 2026</span>
    <span>Fomi Composer · v1</span>
  </div>
</div>

</body>
</html>
"""

def main():
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    HTML_OUT.parent.mkdir(parents=True, exist_ok=True)
    HTML_OUT.write_text(HTML, encoding="utf-8")
    print(f"HTML written: {HTML_OUT} ({len(HTML)} bytes)")

    # Validate the HTML before converting.
    validator = PDF_SKILL_DIR / "scripts" / "poster_validate.py"
    if validator.exists():
        print("Validating HTML...")
        result = subprocess.run(
            ["python3", str(validator), "check-html", str(HTML_OUT)],
            capture_output=True, text=True
        )
        print(result.stdout[-1500:])
        if result.returncode != 0:
            print("Validator warnings/errors above (non-blocking).")

    # Convert HTML → PDF via the pdf skill's html2pdf-next.js script.
    converter = PDF_SKILL_DIR / "scripts" / "html2pdf-next.js"
    print(f"Converting HTML → PDF via {converter.name}")
    result = subprocess.run(
        [
            "node", str(converter),
            str(HTML_OUT),
            "--output", str(PDF_OUT),
            "--width", "720px",
            "--height", "1020px",
            "--nopaged",  # use Chromium native @page pagination (paged.js not installed)
        ],
        capture_output=True, text=True, timeout=180
    )
    print("STDOUT:", result.stdout[-2000:])
    print("STDERR:", result.stderr[-2000:])
    if result.returncode != 0:
        print(f"Conversion failed with exit code {result.returncode}")
        sys.exit(1)

    print(f"PDF written: {PDF_OUT}")
    size_kb = PDF_OUT.stat().st_size // 1024
    print(f"Size: {size_kb} KB")

    # Run pdf_qa.py for final quality check (skip table check; this doc has one table).
    qa = PDF_SKILL_DIR / "scripts" / "pdf_qa.py"
    if qa.exists():
        print("Running pdf_qa.py...")
        result = subprocess.run(
            ["python3", str(qa), str(PDF_OUT)],
            capture_output=True, text=True
        )
        print(result.stdout[-2000:])

if __name__ == "__main__":
    main()
