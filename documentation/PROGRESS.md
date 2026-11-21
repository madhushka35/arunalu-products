# Arunalu Products – Development Progress

Living progress log for the Project Documentation & Development Report
(`Arunalu_Products_Project_Documentation_Report_v1.0.pdf`, version 1.0, 20 Nov 2026).
Update this file at the end of every stage. A new report version should be issued when this log diverges materially from the PDF.

Status terms (report, Document Guide): **Implemented** = code exists · **Verified** = tested against stated criteria · **Planned** = approved direction not yet built · **Pending** = requires work or a decision.

## Roadmap status

| Stage | Workstream | Status | Evidence |
| --- | --- | --- | --- |
| 01 | Frontend audit | Implemented (audit fixes) | Sandbox: tsc, ESLint, next build |
| 02 | Public layout | Implemented | Sandbox: tsc, ESLint, build, Playwright 1440/1280/1024/390 |
| 03 | Homepage | Implemented – visual review pending | Sandbox: tsc, ESLint, build, Playwright 1440/1280/1024/768/390, 3D gating, reduced motion |
| 04 | Products listing and details | Implemented – visual review pending | Sandbox: tsc, ESLint, build (5 product pages prerendered), Playwright 1440/768/390: filters, search, sort, URL deep links, mega-menu link, gallery, lightbox, mobile action bar |
| 05 | Order / export / contact forms | Implemented – visual review pending (API not connected) | Sandbox: tsc, ESLint, build; Playwright 1440/768/390 against a mock API: client + server validation, blur/typing checks, 422 field mapping, references, preview and unavailable modes, no-JavaScript submit, honeypot, product preselect |
| 06 | Remaining public pages / routes | Implemented – visual review pending | Sandbox: tsc, ESLint, build (22 routes static), Playwright 1440/768/390 on 9 pages: no overflow, no console errors, internal links resolve, gallery lightbox (keys, counter, close), process scroll-linked stage nav |
| 07 | Admin panel | In progress – 7a + 7b implemented, visual review pending | 7a: shell, login, dashboard, notifications. 7b: products list / add / edit, categories + drawer. Sandbox: tsc, ESLint, build, Playwright 1440/768/390 (no overflow or console errors; search + filters; delete confirm modal; form validation; image type/size check; slug auto-generation and duplicate check); production build without ADMIN_PREVIEW returns 404 for /admin |
| 08 | Laravel backend / database | Pending (backend folder empty; blueprint needs review) | – |
| 09 | API integration | Pending | – |
| 10 | QA / security / performance | Planned | – |
| 11 | Deployment / launch | Pending | – |

All test evidence so far comes from a sandbox copy of the frontend, not from the developer's local machine.

## Decisions

| ID | Date | Decision | Reason |
| --- | --- | --- | --- |
| D-01 | 2026-11-20 | Keep the Figma design-system tokens (navy #0B1F33, ocean #123F5A, teal #16B8B0, sand #E8D8B5, surface #F4F7F8, ink #172B3A). The report 8.1 palette is not used. | Figma is the visual source of truth; the code already uses the Figma tokens. |
| D-02 | 2026-11-20 | Products filter = All + 4 categories (Dried Fish, Dried Sprats, Dried Prawns, Dried Seafood). | Keeps homepage, mega menu and footer category links working; matches the admin Categories design (many-to-many). |
| D-03 | 2026-11-20 | Sort options: Featured (default), Name A–Z, Name Z–A. | Figma shows "Sort: Featured"; no price/date data exists to sort by. |
| D-04 | 2026-11-20 | Product details gallery: enhanced photo + original photo thumbnails. | As designed in Figma (Thumb 1 / Thumb 2 · original photo). |
| D-05 | 2026-11-20 | Category URL format: `/products?category=<slug>`. | Already used by existing links; filtering is client-side on one static page. |
| D-06 | 2026-11-21 | Forms submit through Next.js Server Actions that validate and forward to the Laravel API (`API_BASE_URL`, server-only). | Same validation on the server, works without JavaScript, API URL and CORS not exposed to browsers. |
| D-07 | 2026-11-21 | Export inquiry allows several products (report "product(s)"); order request has one product (Figma). | Report 6.1 / blueprint `export_inquiry_products`; Figma order flow. |
| D-08 | 2026-11-21 | Header / footer "Request a quote" goes to `/request-order`; `/export-inquiry` is a standalone page reused on `/export` later. | Figma prototype links; existing links. |
| D-09 | 2026-11-21 | Anti-spam: honeypot now; throttling in Laravel; Turnstile decided at deployment. | No extra third-party script before launch decisions. |
| D-10 | 2026-11-21 | Process stages use the Figma STAGES copy, shared by the homepage journey and `/our-process` (`features/process/stages.ts`). | One source; replaces the earlier unapproved stage texts. |
| D-11 | 2026-11-21 | "Packaging options" link → homepage Packaging section (`/#packaging`). | No packaging page in Figma. |
| D-12 | 2026-11-21 | Gallery shows only real product photos (enhanced + original). Production/facility/team items and the video gallery appear when real media is supplied. | Report §4: AI images must not be shown as real facilities or staff. |
| D-13 | 2026-11-21 | News, Privacy Policy and Terms show an honest "being prepared / contact us" notice; Privacy and Terms are `noindex`. No article detail route until articles exist. | No approved content; nothing invented. |
| D-14 | 2026-11-21 | `/export` includes the export inquiry form (`#inquiry`); `/export-inquiry` stays as a standalone page. | Figma Export page has the form; existing links keep working. |
| D-15 | 2026-11-21 | Admin UI (Stage 7) is built before the backend, with labelled sample data from the Figma frames. `/admin` is served only in development or when `ADMIN_PREVIEW=true` (set at build and run time); `src/proxy.ts` answers 404 otherwise. Sign-in shows a "not connected" notice. | No backend yet; the gate is not access control — Laravel will enforce auth and role permissions server-side. |
| D-16 | 2026-11-21 | Admin product form uses category checkboxes (many-to-many, D-02) instead of the single Figma category dropdown. Descriptions, available forms and specification values start empty (no approved data); delete and save show a "preview only" notice. | Matches the data model; no invented product facts. |

## Report vs implementation – known differences

| Report section | Difference | Resolution |
| --- | --- | --- |
| 8.1 Palette | Report lists a different palette from the Figma tokens. | D-01 |
| 6.2 / 10.2 Status | "Closed" vs Figma admin enum `REJECTED_CLOSED`. | Decide in the admin stage. |
| 10 Pivot name | `product_category` (report) vs Laravel default `category_product`. | Decide in the migration review. |
| 13.1 Evidence | Report lists only Stage 1/2 evidence. | Stage 3 evidence recorded above. |

## Outstanding items (from the 20 Nov 2026 audit)

- Homepage visual review against Figma on desktop, tablet and mobile (Figma MCP limit reached; use exported frames / design PDF).
- 11 AI illustrative images to export from Figma into `frontend/public/images/illustrative/` (illustrative only; not to be presented as real facilities or staff).
- Business-approved copy: capability descriptions (Local wholesale supply, International export), journey stages (Inspection, Quality Inspection, Distribution), product descriptions and storage information, verified statistics.
- Confirm "Custom & private label" offer and the word "Premium" in the hero line.
- Decide mobile search scope, reversed logo approval.
- Review whether GSAP and next-themes are needed.
- Stage 6 content gaps: About Team section and Quality certifications are omitted (no data); About supermarket / export-destination claims need client confirmation; Our Process, Quality and About use illustrative placeholders until the AI images are exported; news articles, privacy policy and terms text needed.
- Forms are not connected to a backend. Without `API_BASE_URL`: development shows a labelled preview (nothing stored or sent); production shows "temporarily unavailable" with phone / WhatsApp / email.
- Form option lists are working defaults pending client confirmation: quantity units (kg, packs), packaging (retail, bulk wholesale, custom), contact subjects (5).
- Contact map and business hours are hidden (no approved data). No privacy consent text until legal review. Customer confirmation email wording omitted until the backend sends one.
- Unknown product slugs show the 404 page with `noindex`, but the HTTP status is 200 (Partial Prerendering streams the shell first). Revisit before launch (e.g. a proxy check against known slugs).
- Product descriptions and storage information: sections are hidden until approved copy is supplied.

## Change log

| Date | Change |
| --- | --- |
| 2026-11-21 | Stage 5 implemented: `/request-order` (3 steps, review, submitting, success; mobile progress + sticky bar; summary card), `/export-inquiry` (multi-product select, preselect from product page), `/contact` (business info cards + form). Shared form components, validation module, server actions, API service, `.env.example`. |
| 2026-11-21 | Stage 4 implemented: `/products` (category chips All + 4, search, sort, URL state, empty state, desktop inquiry CTA) and `/products/[slug]` (static params for 5 products, gallery with original photo, zoom lightbox, verified spec rows, related products, mobile action bar, Product + BreadcrumbList JSON-LD). Catalogue extended with categories and a many-to-many `productCategories` list. |
| 2026-11-20 | Report v1.0 added to `documentation/`. CLAUDE.md synced (authority order, roles, statuses, decisions). `frontend/.gitignore` now allows `.env.example`. |
| 2026-11-21 | Stage 6 implemented: `/about`, `/our-process` (interactive journey), `/quality`, `/export` (with inquiry form), `/gallery` (filter + lightbox), `/news`, `/privacy-policy`, `/terms`. Shared process stages; Packaging options → `/#packaging`. |
| 2026-11-21 | Stage 7a implemented: admin shell (sidebar ≥1280, icon rail 768–1279, mobile header + drawer), `/admin/login`, `/admin` dashboard, `/admin/notifications`, placeholders for the 7b–7e screens, `src/proxy.ts` preview gate, `ADMIN_PREVIEW` in `.env.example`. |
| 2026-11-21 | Stage 7b implemented: `/admin/products`, `/admin/products/new`, `/admin/products/[slug]/edit`, `/admin/categories` (drawer); shared admin controls (IconAction, AdminSearch, FilterSelect, ChipFilter, ConfirmDialog, ImageUpload). |
