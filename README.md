# Lumora

A TypeScript-first Vue admin and application template for commerce, learning, and private-course booking.

Lumora brings together the information hierarchy and chart patterns of **Sneat Free** with the backgrounds, sidebar, and card layouts of **Materio Free**. It adds a sapphire-blue identity, practical application pages, and interactive workflows you can explore before connecting a backend.

Built on the TypeScript editions of ThemeSelection's templates. No JavaScript template edition or paid Pro features are included.

> This is a frontend template with browser-local demo data—not a production commerce platform, authentication service, or live booking system. The documentation is in English; most application controls currently use Indonesian, and commerce prices use IDR.

## Contents

- [Highlights](#highlights)
- [Technology](#technology)
- [Getting started](#getting-started)
- [Commands](#commands)
- [Pages and navigation](#pages-and-navigation)
- [Demo workflows](#demo-workflows)
- [Inventory model](#inventory-model)
- [Private-course availability](#private-course-availability)
- [Local data and privacy](#local-data-and-privacy)
- [Project structure](#project-structure)
- [Customization](#customization)
- [Build and deployment](#build-and-deployment)
- [Testing and troubleshooting](#testing-and-troubleshooting)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License and asset credits](#license-and-asset-credits)

## Highlights

- Responsive admin and customer layouts with grouped navigation, page search, and an icon-only desktop sidebar.
- Light and dark themes, a Lumora-branded loader, and a blue/slate palette.
- Dashboard and analytics examples using bar, line, area, donut, radial, and sparkline charts.
- Reusable tables with search, sorting, a filter dialog, active filter chips, pagination, and empty states.
- Product and category management, JSON import/export, order details, customer profiles, and store settings.
- A dedicated stock-management page with incoming/outgoing movements and an auditable history in the demo UI.
- Customer-facing product discovery, cart, checkout, course enrollment, lessons, progress, and reviews.
- Private-course booking with visible availability, multiple selected sessions, overlap prevention, and cancellation.
- Helpful form labels, icon-action tooltips, confirmation dialogs, and unsaved-change warnings on selected forms.

## Technology

| Responsibility | Tools |
| --- | --- |
| Application | Vue 3, TypeScript, Vue Router |
| UI and styles | Vuetify 3, Sass |
| State and browser utilities | Pinia, VueUse |
| Charts | ApexCharts, vue3-apexcharts |
| Icons | Iconify, Remix Icons, Boxicons |
| Development and builds | Vite, pnpm |
| Checks and tests | vue-tsc, Node test runner through tsx, ESLint |
| Commit prompts | Commitizen, cz-conventional-changelog |

Exact dependency versions are recorded in [package.json](package.json) and [pnpm-lock.yaml](pnpm-lock.yaml).

## Getting started

### Requirements

- Node.js 20 or later.
- pnpm 10.
- Git for contributing and using the commit helper.

The included `.nvmrc` follows the installed Node LTS channel. Use the same Node and pnpm versions across your team for reproducible development.

### Install and run

From this workspace:

```sh
cd lumora
pnpm install --frozen-lockfile
pnpm dev
```

If Lumora is checked out as its own repository, start in the directory containing its `package.json` instead.

Open the local URL printed by Vite. No API key, database, backend service, or environment file is required for the bundled demo. Installation runs `postinstall` to generate the icon CSS bundle.

The original Sneat and Materio folders are reference sources in this workspace; Lumora does not require them to run.

## Commands

Run these commands from the Lumora application directory.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite development server |
| `pnpm typecheck` | Check Vue and TypeScript types without emitting files |
| `pnpm test` | Run all automated booking and inventory unit tests |
| `pnpm test:booking` | Run availability and multi-session validation tests |
| `pnpm test:inventory` | Run stock-balance, migration, and movement-validation tests |
| `pnpm build` | Generate the production build in `dist/` |
| `pnpm preview` | Preview the build locally on port 5050 |
| `pnpm build:icons` | Regenerate the icon bundle after changing icon sources |
| `pnpm lint` | Run the inherited ESLint configuration **with auto-fixes** |
| `pnpm commit` | Start the guided Conventional Commit prompt |

Review the diff after running `pnpm lint`, because it changes files. To check only specific files without auto-fixing, use `pnpm exec eslint path/to/file.ts -c .eslintrc.cjs`.

## Pages and navigation

Switch between admin and customer modes using the control above the sidebar. These modes change navigation; they do **not** enforce permissions.

Navigation groups expand and collapse. On desktop, collapsing the sidebar leaves icons and group flyout menus; mobile uses a full drawer. Page search in the header provides shortcuts, while individual detail pages are reached from their lists.

| Area | Routes |
| --- | --- |
| Overview | `/dashboard`, `/analytics` |
| Products | `/products`, `/products/add`, `/products/:id`, `/products/:id/edit` |
| Inventory | `/inventory` |
| Categories | `/categories` |
| Orders | `/orders`, `/orders/:id` |
| Customers | `/customers`, `/customers/:id` |
| Store settings | `/settings/store`, `/settings/payments`, `/settings/locations` |
| Shopping | `/shop/products`, `/shop/products/:id`, `/shop/cart`, `/shop/checkout` |
| Customer order details | `/shop/orders/:id` |
| Learning | `/learn/courses`, `/learn/my-courses`, `/learn/courses/:id`, `/learn/ratings` |
| Private-course booking | `/booking` |
| Account settings | `/account-settings` |
| UI examples | `/cards`, `/typography`, `/icons`, `/tables`, `/form-layouts` |
| Authentication examples | `/login`, `/register` |

The root redirects to `/dashboard`; unmatched routes display an error page.

## Demo workflows

### Products and categories

1. Create a product with a unique SKU, category, price, description, sample photo, and Draft or Active status.
2. Save it, then record incoming stock through **Inventory**. A new product starts with zero stock.
3. Open the customer catalog to browse Active products.
4. Edit the product when needed. The edit form's save button remains disabled until something changes.

Categories can be created and edited. Only categories without products can be deleted. Stock is displayed as a derived balance, never an editable product field.

### Product import and export

Export downloads the product catalog as JSON. Import accepts an array of 1–500 products, up to 1 MB, validates the file, and presents a summary before applying changes.

Required fields:

```json
[
  {
    "name": "Studio Headphones",
    "sku": "LM-AU-001",
    "categoryId": 1,
    "price": 895000,
    "status": "Active",
    "description": "Comfortable over-ear headphones."
  }
]
```

- `categoryId` must identify an existing category; `status` must be `Active` or `Draft`.
- Price must be a finite, non-negative number. SKU values must be unique within the file.
- Matching SKUs update existing products while retaining their IDs; new SKUs create products.
- A legacy `stock` field is ignored. Importing metadata never creates stock movements or changes balances.
- Catalog export is **not a full backup**: it excludes orders, inventory history, bookings, and other local state.

Use a fresh export as your starting format, and keep a backup before bulk changes.

### Shopping, orders, and customers

Customers can search products, open a filter dialog, sort by price, add items to the cart, adjust quantities, and undo cart removals.

Checkout validates availability, creates a local customer/order record, records the linked stock-out movements, and clears the cart in one state update. Product names and prices are copied into order items so later catalog edits do not rewrite historical order details.

Admin order pages support payment and fulfillment status updates. Cancellation returns stock associated with that order once; a cancelled order cannot be reactivated. Historical sample orders without linked stock-out movements do not create artificial stock returns.

Customer pages provide contact information, editable details, order history, and totals for paid, non-cancelled orders.

All payments and fulfillment are simulated. There is no real charge, shipment, email, or automated refund.

### Store settings

- Store identity appears in the storefront.
- Payment settings control the demo checkout methods.
- Locations support create, edit, and delete, with at least one location retained.
- Pickup is a configuration example; checkout uses standard shipping of IDR 20,000.

### Learning and reviews

Browse and filter courses, enroll in the free demo, read lesson content, and track completed lessons. The local “You” profile can publish and update one review per enrolled course.

There is no paid enrollment, video-conferencing service, certificate delivery, or isolated learner account behind these screens.

## Inventory model

The balance shown in product lists and the storefront is a read model:

```text
Available stock = sum(incoming movements) − sum(outgoing movements)
```

- `data.products` stores catalog metadata without a persisted `stock` field.
- `store.products` combines that metadata with balances derived from `inventoryMovements`. Do not assign to its computed stock values.
- `recordStock` validates the product, movement reason, and positive integer quantity. A stock-out movement cannot make the balance negative.
- The inventory form previews the resulting balance and accepts a reason, optional reference, and notes.
- Checkout creates linked `sale` movements; order cancellation creates linked `return` movements.
- The UI does not edit or delete historical movements. Use a new adjustment movement to correct a balance and explain the correction in its notes.
- Search, modal filters, and pagination are available for balances and movement history. Order-linked references open their order details.

### Existing-data migration

The one-time `inventoryVersion: 1` migration converts legacy product stock snapshots into opening-balance movements and removes the stored product stock field. It preserves catalog/order data and does not replay historical sales.

This is an in-browser demonstration of a ledger approach, not a tamper-proof accounting system. Production needs server-side validation, durable append-only records, atomic database transactions, idempotency, and concurrency controls. localStorage cannot guarantee consistent multi-user or multi-tab transactions.

## Private-course availability

1. Choose an enrolled course and a 30-, 60-, or 90-minute session duration.
2. Select a calendar date and inspect the available, booked, past, or closing-time-limited slots.
3. Select one or several non-overlapping starts, such as **09:00–10:00 and 10:00–11:00**.
4. Review every interval, the session count, total duration, and optional shared notes.
5. Confirm the batch. Each selected start becomes an individual session that can be cancelled separately.

Adjacent sessions are allowed; overlapping selections are disabled. Changing the date, course, or duration clears the selection. Every requested session is revalidated before any are saved, so a conflict does not produce a partially saved batch.

Availability uses:

- Service hours of **09:00–18:00**, with start times offered every 30 minutes.
- The browser's time zone, displayed on the booking page.
- Existing confirmed learner bookings, including conflicts with other instructors.
- Sample instructor reservations for 14 days from initial demo-data creation.

Cancelled sessions release their times unless another reservation still conflicts. Sample reservations are not a rolling, live instructor calendar; there is no external calendar synchronization or actual instructor confirmation.

## Local data and privacy

Demo state is stored in the current browser and origin.

| localStorage key | Contents |
| --- | --- |
| `lumora-demo-v1` | Catalog, inventory movements, customers, orders, enrollments/progress, reviews, bookings, and store settings |
| `lumora-profile-v1` | Demo account profile and preferences |
| `lumora-theme` | Selected light/dark theme |
| `lumora-sidebar-collapsed` | Desktop sidebar preference |

Course definitions are supplied by the source code; enrollments and progress are persisted with the demo state.

No server backup or cross-device account sync is provided. A different hostname or port has separate data. Avoid entering real personal information, payment details, credentials, or other sensitive data.

To reset, open browser developer tools and remove only the relevant keys from localStorage, then reload. Removing `lumora-demo-v1` permanently discards local demo edits, orders, stock history, and bookings and regenerates sample data. Export or back up anything you need first; product export alone cannot restore the full demo.

## Project structure

```text
lumora/
├── public/
│   ├── images/                 # Local sample photos and attribution
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── @core/                  # Shared template UI, styles, and utilities
│   ├── @layouts/               # Navigation and layout primitives
│   ├── assets/                 # Application styles and bundled assets
│   ├── components/             # Reusable Lumora components
│   ├── layouts/                # App shells, sidebar, header, and footer
│   ├── pages/
│   │   ├── commerce/           # Admin products, inventory, orders, settings
│   │   ├── learn/              # Courses, reviews, and booking
│   │   └── shop/               # Catalog, cart, and checkout
│   ├── plugins/                # Router, Vuetify, and icon configuration
│   ├── stores/                 # Demo domain state and local profile
│   ├── utils/                  # Availability, inventory, media, UI helpers
│   ├── views/
│   │   ├── dashboard/          # Materio-based analytics components
│   │   └── sneat/              # Sneat-based dashboard components
│   └── navigation.ts           # Shared menu groups and page-search options
├── tests/                      # Booking and inventory unit tests
├── .czrc                       # Commitizen adapter selection
├── LICENSE
├── package.json
├── pnpm-lock.yaml
└── vite.config.ts
```

Notable reusable components include `ExplorerTable.vue`, `PageHeader.vue`, `ProductArt.vue`, `ShoppingSteps.vue`, and `UnsavedChangesGuard.vue` in `src/components/`.

## Customization

### Branding and appearance

- Change theme colors in `src/plugins/vuetify/theme.ts`. Lumora uses sapphire `#315DA8`, light slate `#F3F5F9`, and dark navy `#111A29`.
- Adjust borders, card treatment, spacing, and page styling in `src/assets/styles/styles.scss`.
- Review `public/logo.png`, `public/favicon.ico`, the initial loader in `index.html`, and the layout branding when replacing Lumora's identity.
- Keep chart, loader, navigation, and component colors consistent in light and dark modes.

### Navigation and pages

Add menu entries and page-search shortcuts through `src/navigation.ts`; register routes in `src/plugins/router/routes.ts`. Customer routes use `meta.customer` to choose the customer navigation, not to authorize access.

Vue, Vue Router, Pinia, and selected VueUse helpers are auto-imported by Vite. Components in `src/components/` and `src/@core/components/` are auto-registered. Configuration is in `vite.config.ts`.

### Data, images, and icons

- Domain models, sample data, and actions live in `src/stores/demo.ts`; local account preferences live in `src/stores/profile.ts`.
- Keep inventory and booking rules in `src/utils/inventory.ts` and `src/utils/bookingAvailability.ts`, with matching tests.
- Product/course photo mappings and picker options live in `src/utils/media.ts`. Local photos live in `public/images/` and have a visual fallback.
- Update `src/plugins/iconify/build-icons.ts` when changing icon sources, then run `pnpm build:icons`. Its generated CSS is ignored by Git.
- UI copy currently lives in components and pages; a translation framework is not configured.

## Build and deployment

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

Deploy the contents of `dist/` to a static host. The router uses HTML5 history mode, so configure the host to serve `index.html` for application routes while serving actual assets normally. Otherwise, refreshing `/products` or another nested URL may return a 404.

If hosting under a subdirectory, configure Vite's `base` and verify routing and public image URLs under that path. Root hosting is the default. `pnpm preview` is for local build inspection, not a production server.

### Before using this in production

Implement and review:

- Real authentication, server-enforced authorization, and customer/account isolation.
- Backend APIs, durable storage, input validation, and appropriate privacy controls.
- Atomic inventory/order operations, concurrency protection, and idempotent retries.
- A real availability service with an explicit time-zone policy and reliable conflict checks.
- Payment, refund, delivery, email, or calendar integrations your application actually requires.
- Monitoring, backups, accessibility, security, and end-to-end tests.

Admin/customer navigation, local flags, and frontend validation are not security boundaries. Dashboard figures and inherited demo controls are illustrative; not every chart or period selector is connected to commerce state.

## Testing and troubleshooting

The unit suite covers availability, overlapping and adjacent sessions, booking-batch validation, opening-stock migration, inventory balances, and movement quantities. It does not replace browser or end-to-end tests.

When changing workflows, also verify the affected screens on desktop and mobile, keyboard operation, light/dark themes, filter cancellation, empty states, reload persistence, and failure paths.

| Symptom | What to check |
| --- | --- |
| Icons are missing after installation | Run `pnpm build:icons`; installation may have skipped lifecycle scripts |
| A nested route fails on refresh after deployment | Configure the static host's SPA fallback to `index.html` |
| Demo edits are missing on a new URL, port, or browser | localStorage is scoped to that browser and origin |
| A newly created product cannot be purchased | Set it to Active and record incoming stock in Inventory |
| A booking start is unavailable | Check the date, browser time zone, duration, instructor reservations, and learner bookings |
| Build succeeds but type errors were missed | Run `pnpm typecheck` separately; `pnpm build` does not run vue-tsc |
| Commit prompts cannot find a Git repository | Run them inside a Git checkout, from the Lumora directory |

Do not clear browser data as the first troubleshooting step; doing so can delete local work.

## Contributing

Contributions are warmly welcome—whether you are improving a label, fixing a bug, writing a test, or building a thoughtful new workflow. Small, focused contributions are just as valuable as larger features.

### Start a conversation

For bugs, open an issue in the repository hosting your copy of Lumora. Include reproduction steps, expected and actual behavior, browser/Node/pnpm versions, and screenshots or a minimal example when useful. Remove personal information and secrets.

For substantial features or new dependencies, discuss the scope in an issue first. Explain the user need and the proposed behavior so the work stays aligned with Lumora's goals. Do not open Lumora-specific issues in the upstream ThemeSelection repositories.

Good contribution areas include accessibility, responsive layouts, clearer UX, translation support, validation, tests, documentation, and well-scoped integration examples.

### Development workflow

1. Fork the repository and clone your fork.
2. Install dependencies from the Lumora directory using the committed pnpm lockfile.
3. Create a descriptive branch, such as `feat/inventory-filters` or `fix/booking-overlap`.
4. Make a focused change and add or update relevant tests and documentation.
5. Run `pnpm typecheck`, `pnpm test`, and `pnpm build`. Check lint on the files you changed; avoid unrelated auto-formatting.
6. Review your diff, commit with a clear message, and open a pull request against the project's default branch.

Use TypeScript and existing Vue/Vuetify patterns. Reuse shared components, preserve saved-data compatibility, and avoid bypassing the stock ledger or booking validation. Keep original license notices and document sources/licenses for new assets. Never commit secrets, personal data, `node_modules/`, build output, or generated icon CSS.

### Commit messages

Lumora uses the [Commitizen CLI](https://github.com/commitizen/cz-cli) with the [cz-conventional-changelog adapter](https://github.com/commitizen/cz-conventional-changelog). The adapter is selected in [`.czrc`](.czrc), and both packages are installed locally for contributors.

Stage only the intended files, then launch the prompt:

```sh
git add README.md
pnpm commit
```

This command creates a Git commit after completing the prompts; it is not a validation-only command.

Use an English, concise, imperative subject and a relevant scope when helpful:

```text
feat(inventory): add movement reference filters
fix(booking): reject overlapping selected sessions
docs(readme): explain local data persistence
test(inventory): cover insufficient stock
```

Typical types include `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`. Describe breaking changes and required migrations in the prompt's breaking-change section. The helper does not install commit hooks, enforce messages in CI, publish releases, or generate changelogs automatically.

### Pull request checklist

- Explain **what changed and why**, linking the relevant issue if one exists.
- Include screenshots for UI changes and describe mobile/light/dark checks.
- List the checks you ran, their results, and any known limitations.
- Add regression coverage for changed inventory or availability behavior.
- Document data migrations or breaking changes explicitly.
- Keep the diff focused and respond constructively during review.

Please be respectful, assume good intent, and offer specific, actionable feedback. If you are new to contributing, a documentation fix or a reproducible bug report is a great place to begin. Thank you for helping make Lumora more useful.

For a suspected security issue, avoid posting exploit details or sensitive data publicly. Use the repository's private reporting channel if one is available, or ask a maintainer for a private contact route.

## Acknowledgements

A sincere thank you to **[ThemeSelection](https://themeselection.com/)** for sharing the free, MIT-licensed templates that serve as Lumora's primary foundation and design reference:

- [Sneat Free — Vuetify Vue.js Admin Template](https://github.com/themeselection/sneat-vuetify-vuejs-admin-template-free): information presentation, dashboard structure, and chart patterns.
- [Materio Free — Vuetify Vue.js Admin Template](https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free): backgrounds, navigation, card concepts, and UI components.

Their work made it possible to focus on bringing these ideas together and extending them into Lumora's application workflows. If you find this project helpful, please consider visiting and supporting the original projects too.

Lumora is an independent adaptation, not an official ThemeSelection product or a claim of endorsement. Original authorship and copyright notices are retained.

## License and asset credits

Code is distributed under the [MIT License](LICENSE), retaining ThemeSelection's original copyright notice. Lumora branding does not replace upstream ownership or licensing obligations.

The 14 bundled product/course photographs have separate licensing. See [image sources and credits](public/images/CREDITS.md) for their Unsplash sources and license reference; they are **not covered by the code's MIT license**. Photos illustrate dummy data and do not imply brand affiliation or exact product specifications.

Preserve relevant notices when redistributing the template, and review the terms of any third-party assets or dependencies you add.
