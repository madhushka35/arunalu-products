# Arunalu Products – Project Instructions

## 1. Project Overview

Build a professional corporate website and administration system for Arunalu Products, a Sri Lankan preserved seafood and dried seafood manufacturer and supplier.

Project root:
`D:\Projects\arunalu-products`

GitHub:
`https://github.com/madhushka35/arunalu-products`

## 2. Documentation Authority and Design Source of Truth

Follow these sources in this order. If they conflict, report the conflict before making changes.

1. Approved Figma UI/UX design (file key `7VDLHEgQ8QoC0Bh9kSJVHO`): source of truth for visual design.
2. Project Documentation & Development Report (`documentation/Arunalu_Products_Project_Documentation_Report_v1.0.pdf`): source of truth for business requirements, scope, architecture and roadmap.
3. Existing source code and the latest audit: source of truth for actual implementation status.
4. This CLAUDE.md: project-specific coding instructions, kept in sync with the report.

Progress and decisions are tracked in `documentation/PROGRESS.md`.

IMPORTANT:
- Do not redesign existing approved screens.
- Follow Figma layouts, colors, typography, spacing, responsive behavior and interactions.
- Inspect the relevant Figma frames before implementing each page (see the Figma access note in section 9).
- Do not invent alternative UI designs.
- Preserve the approved brand identity.
- Design tokens are the Figma design-system tokens implemented in `frontend/src/app/globals.css` (navy #0B1F33, ocean #123F5A, teal #16B8B0, sand #E8D8B5, surface #F4F7F8, ink #172B3A). The different palette listed in report section 8.1 is NOT used (decision D-01).

## 3. Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui (Base UI)
- GSAP
- Framer Motion
- Three.js
- React Three Fiber
- Lucide React

### Backend
- Laravel 13
- PHP 8.3+
- MySQL 8
- Laravel Sanctum
- Spatie Laravel Permission
- REST API

### Development Tools
- VS Code
- Claude Code
- Git
- GitHub

## 4. Project Structure

```text
arunalu-products/
├── frontend/
├── backend/
├── documentation/
├── CLAUDE.md
└── .gitignore
```

Keep frontend, backend and documentation separated.

## 5. Business Requirements

- Public website: https://arunaluproducts.lk
- Admin panel: https://admin.arunaluproducts.lk
- Backend API: https://api.arunaluproducts.lk

These are planned production addresses.

Website language: English.

The website supports:
- Corporate information
- Product catalogue
- Product details
- Order requests
- Export inquiries
- Contact inquiries
- Company process and quality information
- News and gallery

No customer registration or login.
No online payment or checkout system.

Order requests are inquiries, not confirmed or paid orders.

Only authorized staff can access the administration panel.

Proposed admin roles (report section 5; enforce server-side): Super Admin, Admin, Sales Manager, Content Editor, Viewer.

Order request statuses: New, Reviewing, Contacted, Quotation Sent, Completed, Closed (Figma admin enum: REJECTED_CLOSED; final naming decided in the admin stage).

Product categories are many-to-many (`product_category` pivot in the proposed blueprint).

## 6. Business Information

Company: Arunalu Products

Phone / WhatsApp: +94 77 364 4890

Email: arunalu5782@yahoo.com

Address:
No. 30/7, Torington Estate,
Pahala Kandawala,
Thimbirigaskatuwa,
Sri Lanka.

Products:
- Head-on Sprats 200g
- Dried Prawns 100g
- Headless Sprats 200g
- Ready-to-Cook Sprats 200g
- Baby Shrimp 100g

Do not invent company certifications, export markets, supermarket partnerships, production capacity, prices, nutritional values or other unverified claims.

## 7. Coding Standards

- Use TypeScript strictly.
- Prefer reusable components.
- Follow the existing folder structure.
- Maintain responsive layouts.
- Use accessible UI components.
- Optimize images and performance.
- Avoid unnecessary dependencies.
- Keep components maintainable.
- Follow Next.js App Router conventions.
- Never expose credentials or secrets.

## 8. Git Workflow

Branches:

- main: Stable production code.
- develop: Active development.
- feature/*: Individual development tasks.

Current development branch: develop.

Before making major changes:
1. Check current Git status.
2. Review existing implementation.
3. Understand the relevant Figma design.
4. Implement only the requested scope.
5. Run relevant tests and checks.
6. Review the final changes.

Do not commit, push, reset, rebase or delete files without user authorization.

Never commit:
- .env files
- API keys
- Passwords
- Database credentials
- Private certificates
- node_modules
- Build output

## 9. Development Progress

Last updated: 2026-11-21. Full roadmap (stages 01–11): report section 15 and `documentation/PROGRESS.md`.

| Stage | Status | Notes |
| --- | --- | --- |
| Stage 1 – Frontend Audit | Completed | Lint fix (use-mobile), Manrope + Inter fonts, brand tokens in globals.css |
| Stage 2 – Public Layout | Implemented | Header (transparent → solid), Products mega menu, mobile menu, footer. Verified in a sandbox build; user visual review not yet recorded |
| Stage 3 – Homepage | Implemented – Visual Review Pending | 11 sections in `src/app/(public)/page.tsx`. Not yet compared with live Figma frames (Figma MCP limit reached) |
| Stage 4 – Products Listing & Product Details | Implemented – Visual Review Pending | `/products` and `/products/[slug]`. Sandbox: tsc, ESLint, build, Playwright 1440/768/390 |
| Stage 5 – Order / Export / Contact forms | Implemented – Visual Review Pending | Not connected to the API yet (preview / unavailable modes). Sandbox: tsc, ESLint, build, Playwright with a mock API |
| Stage 6 – Remaining public pages | Implemented – Visual Review Pending | About, Our Process, Quality, Export, Gallery, News, Privacy Policy, Terms. News/legal show pending notices (no invented content). Sandbox: tsc, ESLint, build, Playwright 1440/768/390 |
| Stage 7 – Admin panel | Implemented – Visual Review Pending | All Figma admin screens (UI only, sample data, nothing saved): shell, Login, Dashboard, Notifications; Products + form, Categories; Order / Export / Contact requests + details; Gallery, News + article editor, Website content, Settings; Users (invite only — no passwords in the UI), Roles & permissions matrix, Activity logs, My profile. `/admin` served only in development or with `ADMIN_PREVIEW=true` (`src/proxy.ts` 404 otherwise). Real auth + server-side permissions come with Laravel (Stage 8/9). |
| Stage 8 – Laravel backend | Next | Migration plan must be reviewed before any database is created |

Not started: admin panel, Laravel backend, database (migration plan must be reviewed first), deployment.

### Decisions made

| ID | Date | Decision |
| --- | --- | --- |
| D-01 | 2026-11-20 | Keep the Figma design-system tokens; the palette in report 8.1 is not used. |
| D-02 | 2026-11-20 | Products page category filter = All + the 4 categories (Dried Fish, Dried Sprats, Dried Prawns, Dried Seafood), many-to-many. |
| D-03 | 2026-11-20 | Products sort options: Featured (default), Name A–Z, Name Z–A. |
| D-04 | 2026-11-20 | Product details gallery shows the enhanced photo and the original product photo (as in Figma). |
| D-05 | 2026-11-20 | Category URL format stays `/products?category=<slug>`. |
| D-15 | 2026-11-21 | Admin UI built before the backend with labelled sample data; `/admin` gated by `src/proxy.ts` + layout (dev or `ADMIN_PREVIEW=true` only). This gate is not access control; Laravel enforces auth and permissions server-side (Stage 8/9). |
| D-10 – D-14 | 2026-11-21 | Shared Figma process stages; Packaging options → `/#packaging`; gallery = real product photos only; pending notices for news/legal; `/export` includes the inquiry form. Details in `documentation/PROGRESS.md`. |
| D-06 – D-09 | 2026-11-21 | Forms: Server Actions → Laravel API; export allows several products, order one; "Request a quote" → `/request-order`; honeypot anti-spam. Details in `documentation/PROGRESS.md`. |

### Outstanding decisions (need user / client input)

- Mobile header search button (omitted until search scope is defined).
- Approval of the reversed (white) logo.
- Confirmation of the "Custom & private label" packaging offer and the word "Premium" in the hero line.
- Reuse of approved pillar / quality sentences for capability cards and journey stages.

### Incomplete items

- 11 AI illustrative images are not in the project (homepage shows placeholder tones). Export from Figma → `frontend/public/images/illustrative/<key>.jpg` and set paths in `src/features/home/content.ts`. Replace with real Arunalu photography before launch.
- Destination pages do not exist yet (links return 404): /about, /our-process, /quality, /export, /gallery, /news, /privacy-policy, /terms.
- Missing verified content: descriptions for "Local wholesale supply" and "International export", stage details for Inspection, Quality Inspection and Distribution, verified statistics (statistics band hidden), product descriptions and storage information (product sections hidden until supplied).
- Empty placeholder folders: app/admin, components/admin, features/{gallery,inquiries,news,orders}, services, types, backend/, documentation/.
- `next-themes` and GSAP are installed but not used.

### Figma access

The Figma MCP Starter-plan call limit is reached. Live frames cannot be inspected until the limit resets or the plan is upgraded. Until then the design reference is the Figma builder plugin source (exact builder specs) and the Public Website / Admin PDFs exported from Figma.

Do not repeat completed stages unnecessarily.

## 10. Important Instructions

- Work incrementally.
- Inspect files before modifying them.
- Do not overwrite existing working code without reviewing it.
- Do not make assumptions about completed features.
- Explain important changes.
- Report files created or modified.
- Report errors and test results honestly.
- Ask for clarification when requirements or Figma details are unclear.
- Preserve existing approved design decisions.