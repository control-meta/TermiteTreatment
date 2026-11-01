# Project cleanup report

Date: 31 October 2026  
Project: `/home/raagneet/Desktop/RajuSoni/TermitePestControl/opencode`

## Result

Removed **1,002,589,496 bytes (956.1 MiB; approximately 1 GB)** from audited targets: **3 directories and 14 standalone files**, containing **17,353 files** in total. This measures logical file sizes before removal; filesystem allocation and live cache sizes differ. Regenerated caches cleared after verification are not counted twice.

The application source, current visual assets, package dependencies, lockfile, Git history, environment-owned folders and hosting metadata were retained. All **44 source/style files** were reachable; no orphan components, libraries or styles were found. **20 referenced WebP assets** remain, byte-for-byte unchanged.

## Removed directories and files

| Path | Files inside target | Original size | Reason |
| --- | ---: | ---: | --- |
| `.sites-checkout` | 17,193 | 700.29 MiB | Unused legacy staging checkout; private source/history backup required |
| `out` | 105 | 27.49 MiB | Stale generated static export; current Next.js configuration uses a server build |
| `.next/cache` | 41 | 205.54 MiB | Disposable build cache |
| `tsconfig.tsbuildinfo` | 1 | 197.3 KiB | Regenerable TypeScript incremental cache |
| `public/images/termiguard-family.png` | 1 | 2.13 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-difference-identification-v2.png` | 1 | 2.13 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-difference-inspection.png` | 1 | 2.06 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-difference-main.png` | 1 | 2.54 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-difference-plan-v2.png` | 1 | 2.16 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-difference-specialist-v2.png` | 1 | 2.03 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-difference-timber.png` | 1 | 2.88 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-difference-treatment-v2.png` | 1 | 1.99 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-difference-treatment.png` | 1 | 2.19 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-services-closeup-v2.png` | 1 | 2.17 MiB | Unused original PNG; application uses the retained optimized WebP image set. |
| `public/images/termite-difference-main.webp` | 1 | 276.0 KiB | Unused superseded WebP image |
| `public/images/termite-difference-treatment.webp` | 1 | 29.5 KiB | Unused superseded WebP image |
| `public/images/termite-difference-timber.webp` | 1 | 51.1 KiB | Unused superseded WebP image |

The old staging checkout had no running server and was not the active project. The removed `out/` was an old static export. The current `next.config.mjs` produces a server build in `.next/`, which is served with `npm start`.

## Recovery backup

Before removing the staging checkout, its source and Git history were archived outside the project:

- Archive: `/tmp/termite-project-cleanup-2026-10-31/legacy-staging-source.tar.gz`
- Size: **6,479,726 bytes**; **313 archive members**.
- SHA-256: `c100ea14059655cd3f982b63e1dadaa8395d88cef6064417ed5b0e987f7a5a61`
- Includes the staging checkout's local differences: modified `app/page.tsx` and untracked `components/TermiteLogoMark.tsx`.
- Excludes regenerable `node_modules/`, `.next/`, `out/` and TypeScript build caches.
- Restricted local permissions: archive `0600`, containing directory `0700`. This temporary backup is not part of the website or repository.

The deleted tracked image originals remain recoverable from the root repository's Git history. Cache and export artifacts can be regenerated as needed; static export requires a suitable export configuration.

## Retained folders

Sizes below are logical file sizes at report generation. Managed development/build output can grow while the server runs. The CSV lists maintained project files individually; dependency, Git and generated-output internals are summarized here.

| Folder | Files | Size | Purpose |
| --- | ---: | ---: | --- |
| `app/` | 15 | 216.0 KiB | Active pages, layouts, CSS, robots and sitemap; all retained. |
| `components/` | 26 | 110.2 KiB | Shared navigation, footer, sections, forms and UI; all retained. |
| `lib/` | 3 | 22.9 KiB | Company/service data and termite animation modules; all retained. |
| `public/` | 20 | 2.15 MiB | 20 referenced, optimized WebP images; original and superseded images removed. |
| `docs/` | 8 | 37.2 KiB | Research, asset provenance, performance notes and this cleanup report/inventory. |
| `.openai/` | 1 | 0.1 KiB | Existing hosting metadata; retained unchanged. |
| `node_modules/` | 16,535 | 544.57 MiB | Installed dependencies, including required optional platform adapters; retained. |
| `.next/` | 1,000 | 312.05 MiB | Fresh production output and live development output; disposable root build cache cleared. |
| `.git/` | 154 | 24.21 MiB | Repository history and working-tree metadata; retained unchanged by cleanup. |
| `.agents/` | 0 | 0.0 KiB | Environment-owned empty folder; retained. |
| `.aws/` | 0 | 0.0 KiB | Environment-owned empty folder; retained. |
| `.codex/` | 0 | 0.0 KiB | Environment-owned empty folder; retained. |

## Root files and organization

| File | Purpose |
| --- | --- |
| `README.md` | Current setup, commands, structure and build-mode documentation |
| `AGENTS.md` | Next.js-generated agent guidance; preserved |
| `ASSET-PROMPT.md` | Image provenance and generation history; historical-path cleanup note |
| `package.json` | Application dependencies and commands; unchanged by cleanup |
| `package-lock.json` | Reproducible dependency versions; unchanged by cleanup |
| `next.config.mjs` | Current development origins and Next.js configuration; unchanged |
| `next-env.d.ts` | Framework-generated TypeScript declarations; preserved |
| `tsconfig.json` | TypeScript configuration; unchanged |
| `.gitignore` | Dependency, build, export, environment and cache exclusions; preserved |

No declared package was removed: runtime packages are used, and typing/build dependencies support the application. Sharp platform fallbacks present in the lockfile were kept. `node_modules/` was not manually pruned.

`README.md` now documents the current server build and links this report. Image prompt documents identify removed original-output paths as historical. Their prompts remain useful provenance and are not runtime dependencies.

## Verification

| Check | Result |
| --- | --- |
| Source/import graph | 44 of 44 source/style files reachable; no unresolved local imports |
| Production build | `npm run build` passed in the host environment; 13 static outputs generated |
| TypeScript | `npm run typecheck -- --incremental false` passed |
| Website routes | All 9 website pages returned HTTP 200 |
| Metadata routes | `/robots.txt` and `/sitemap.xml` returned HTTP 200 |
| Retained images | All 20 returned HTTP 200 and matched baseline SHA-256 hashes |
| Image processing runtime | Native Sharp loaded successfully |
| Removal verification | All 17 audited target paths absent immediately after final cache clearing |
| Recovery archive | Archive members inspected and SHA-256 verified |

The restricted runner initially failed to parse TypeScript `--showConfig` during the build. The standard build then passed in the host environment without changing configuration to bypass validation. No cleanup edits were made to application code, styles or configuration. No visual redesign, dependency upgrade, deployment or server restart was performed.

Concurrent application edits detected during the audit were preserved:
- `app/(company)/pages.css`
- `app/page.tsx`
- `app/responsive.css`

The existing development server on port 3000 remains running. `.next/dev/` was intentionally retained. Build and TypeScript caches can be recreated automatically by later commands.

## Hosting note

`.openai/hosting.json` is unchanged and points to a static `out/` directory. That directory is not generated by the current server-build configuration; publishing through that static workflow requires generating a fresh static export with appropriate configuration. The stale export was removed, and no hosting change was made as part of cleanup.

## Complete file inventory

See [project-file-inventory.csv](project-file-inventory.csv) for every maintained source, configuration, documentation and image file, with category and byte size. Generated `.next/`, installed `node_modules/`, Git internals and empty environment-owned folders are excluded from individual rows and summarized above.
