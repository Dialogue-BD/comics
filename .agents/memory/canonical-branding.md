---
name: Canonical branding
description: User's standing rule for official brand assets and ongoing freshness
---

Site branding must always be tied to the most recent assets in
`Dialogue-BD/dialogue-brand-identity`. Use Primary Lockup Studio Modern on every
page displaying a brand logo and 03A — Breakout Concentric Logomark "D" (Full
Color on Light) as the favicon.
Use the appropriate official motion graphic from that repository for logo hover
animations throughout the website, rather than inventing a separate animation.
Each time someone hovers over a Dialogue logo, play the motion animation once.

**Why:** The user explicitly requested these variants and ongoing alignment with
the latest assets in the official repository, including its motion graphics.

**How to apply:** Preserve this source of truth during future syncs and branding
work. Do not replace the official assets with generated approximations or let
independent legacy logo copies become authoritative.

Browser-critical motion players must be bundled with the published site rather
than served solely from an installed dependency directory.

**Why:** The published motion-player URL returned 404 while the same URL worked
in development, making logo hover appear to do nothing.

**How to apply:** Verify the public player URL after publishing, not only the
preview. Treat actual mouse/pen hover events as intent; a device's primary-pointer
capability report can incorrectly exclude hybrid devices.
