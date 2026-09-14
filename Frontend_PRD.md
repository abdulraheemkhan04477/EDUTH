# EduFlow — Frontend PRD for Antigravity Agent

> This document is written to be dropped straight into an Antigravity
> workspace and executed. It follows Antigravity's own recommended loop:
> **Explore → Plan → Execute → Verify**, broken into milestones small
> enough for one Implementation Plan artifact each. Section 1 is meant to
> become (or be pasted into) your `AGENTS.md` / `.agents/rules/` files so
> every agent run in this repo inherits the same constraints.

---

## 1. Agent rules (put this in `AGENTS.md` at repo root)

```md
# AGENTS.md — EduFlow frontend

## Stack (do not deviate without explicit human approval)
- Build tool: Vite
- Framework: React 18, function components + hooks only (no class components)
- Language: TypeScript, strict mode on — no `any` without a `// TODO(justify)` comment
- Styling: Tailwind CSS only — no CSS-in-JS, no separate .css files beyond
  index.css (tokens/base layer)
- Data/backend: Supabase JS client (@supabase/supabase-js) — Postgres,
  Auth, Storage, Realtime, Edge Functions. No custom Node/Express backend.
- Routing: react-router-dom v6, role-guarded route trees
- Server state: @tanstack/react-query — every Supabase read/write goes
  through a query/mutation hook, never a raw useEffect fetch
- Charts: recharts
- Forms: react-hook-form + zod for validation
- Icons: lucide-react
- Deployment target: Vercel (build command `npm run build`, output `dist`)
- Source control: GitHub — every task ends with a commit; do not force-push

## Non-negotiable rules
1. Never hardcode a Supabase service-role key or any secret in frontend
   code. Only the public anon key + URL go in `import.meta.env`.
2. Every table query must assume Row-Level Security is ON. Do not write
   client-side "filter by school_id" logic as a substitute for RLS —
   RLS is defined server-side (separate migration repo/task); the
   frontend just calls `.select()/.insert()/.update()` normally and
   trusts Postgres to scope it.
3. Every new screen must reuse the shared `components/ui/*` primitives
   (see §5) instead of writing one-off buttons/cards/tables.
4. Every list/table screen needs a loading (skeleton), empty, and error
   state — do not ship a screen that only handles the happy path.
5. Every form needs client-side zod validation AND must handle a Supabase
   error response (unique constraint, RLS denial, network) with a visible
   inline or toast message — never a silent failure.
6. Money values are always formatted via a single shared `formatCurrency()`
   util — never inline `₹${amount}` string interpolation.
7. Run `npm run typecheck && npm run lint && npm run build` before
   considering any milestone done. Do not mark a task complete if any of
   these fail.
8. Do not introduce a new npm dependency without listing it in the
   Implementation Plan artifact first — dependency creep is treated as a
   scope change.

## Verification commands (use these — do not invent alternatives)
- Type check: `npm run typecheck`  (tsc --noEmit)
- Lint: `npm run lint`  (eslint .)
- Build: `npm run build`  (vite build)
- Dev server for browser-agent verification: `npm run dev` (default port 5173)

## Definition of Done (applies to every task in this PRD)
- [ ] Code matches the stack rules above
- [ ] `npm run typecheck`, `npm run lint`, `npm run build` all pass
- [ ] Screen has loading/empty/error states where it reads data
- [ ] Screen is responsive at 375px, 768px, 1280px (verify via browser agent)
- [ ] No console errors/warnings in the browser agent's verification run
- [ ] Commit made with a message referencing the milestone/task ID below
```

---

## 2. Project summary (context for the agent, not a rule)

EduFlow is a multi-tenant school management web app: four roles (Admin,
Teacher, Student, Parent) share one React SPA, routed into role-scoped
trees after Supabase Auth login. This PRD covers **frontend only** — the
Supabase schema/RLS/Edge Functions are assumed to exist already (or are
tracked in a separate backend PRD/migration repo); where the frontend
needs a table/column that may not exist yet, it's called out explicitly
so the agent can flag it rather than silently stub it.

Companion documents already produced (use these as the source of truth
for visual/content detail — this PRD should not restate every field):
- `eduflow-prd.md` — full product PRD (all modules, FR-1..FR-56)
- `eduflow-frontend-ui-prompt.md` — design tokens + full screen spec
- `eduflow-stitch-prompts.md` + `eduflow-stitch-prompts-full-coverage.md`
  — per-screen visual references (if Stitch-exported components exist,
  reuse/adapt them into `components/ui` and `features/*` rather than
  rebuilding from scratch)

---

## 3. Target repository structure

```
eduflow-frontend/
  .agents/rules/            # split rules if AGENTS.md grows past 12k chars
  src/
    app/
      App.tsx                # router + providers root
      providers/              # QueryClientProvider, AuthProvider, ThemeProvider
    routes/
      admin/                  # /admin/* route tree
      teacher/                # /teacher/*
      student/                # /student/*
      parent/                 # /parent/*
      auth/                   # /login, /register-school
      RoleGuard.tsx
    components/ui/            # Button, Modal, Drawer, DataTable, StatCard,
                               # StatusPill, Tabs, FormField, AvatarInitials,
                               # NoticeCard, Chart wrappers, EmptyState,
                               # Skeleton, Toast
    features/
      auth/
      dashboard/
      students/
      teachers/
      classes/
      attendance/
      fees/
      homework/
      timetable/
      notices/
      communication/
      reports/
      ai-assistant/
      roles-permissions/
      subjects/
      exams/
      study-materials/
      settings/
      report-card/
      progress/
      # each feature folder: components/, hooks/ (react-query hooks),
      # types.ts, index.ts
    lib/
      supabase.ts              # client init from env vars
      formatCurrency.ts
      formatDate.ts
      queryKeys.ts              # centralized react-query key factory
    types/
      database.types.ts         # generated via `supabase gen types typescript`
      domain.ts                 # hand-written types not covered by generated schema
    styles/
      index.css                 # Tailwind layers + CSS variable tokens
  tailwind.config.ts
  vite.config.ts
  tsconfig.json
  .env.example
  package.json
```

**Task 0.1 — Verify/create this structure.** If the repo doesn't exist
yet, scaffold with `npm create vite@latest . -- --template react-ts`,
then add Tailwind, react-router-dom, @tanstack/react-query,
@supabase/supabase-js, recharts, react-hook-form, zod, lucide-react.

---

## 4. Design tokens → `tailwind.config.ts`

Pull these directly from `eduflow-frontend-ui-prompt.md` §2. Summarized
for the agent's `theme.extend`:

```ts
colors: {
  brand: { 100: '#FDEAE2', 500: '#F0784F', 600: '#E4572E', 700: '#C8441E' },
  ink:   { 900: '#1E1B1A', 600: '#5C5654', 400: '#948C89' },
  surface: '#FFFFFF', canvas: '#FAF8F6', border: '#ECE7E4',
  success: { 100: '#E4F6EC', 600: '#1F9254' },
  warning: { 100: '#FDF1DD', 600: '#D98A1E' },
  danger:  { 100: '#FBE5E2', 600: '#D6402F' },
  info:    { 100: '#E7EFFD', 600: '#2A6FE0' },
},
fontFamily: { display: ['Sora', 'sans-serif'], sans: ['Inter', 'sans-serif'] },
borderRadius: { DEFAULT: '8px', card: '12px', modal: '16px' },
boxShadow: { soft: '0 1px 2px rgba(20,16,14,0.04), 0 8px 24px rgba(20,16,14,0.06)' },
```

**Task 0.2 — Implement tokens.** Add fonts (Sora, Inter) via
`@fontsource` or a Google Fonts `<link>`, wire the config above, and
build one throwaway `/design-check` route rendering a Button, StatCard,
StatusPill, and DataTable so the agent (and human) can visually verify
tokens before building real screens. Delete/hide this route before
production build, or gate it behind `import.meta.env.DEV`.

---

## 5. Shared component contracts (`components/ui`)

Build these once; every feature imports from here. Define explicit
TypeScript prop interfaces — do not use `any` or implicit props.

| Component | Minimum props |
|---|---|
| `Button` | `variant: 'primary'\|'ghost'\|'danger'`, `size`, `isLoading?`, standard button attrs |
| `StatCard` | `label`, `value`, `icon`, `tone: 'brand'\|'success'\|'warning'\|'info'`, `progressPercent?`, `caption?` |
| `StatusPill` | `status: 'success'\|'warning'\|'danger'\|'info'\|'neutral'`, `label` |
| `DataTable<T>` | `columns`, `rows: T[]`, `isLoading`, `emptyState`, `onRowAction?`, pagination props |
| `Modal` | `isOpen`, `onClose`, `title`, `children`, `footer` |
| `Drawer` | same shape as Modal, `side: 'right'` |
| `Tabs` | `tabs: {id,label}[]`, `activeId`, `onChange` |
| `FormField` | `label`, `error?`, `helperText?`, wraps an input/select/textarea child |
| `AvatarInitials` | `name`, `size?` — deterministic color from name hash |
| `NoticeCard` | `title`, `body`, `priority`, `author`, `date` |
| `EmptyState` | `icon`, `title`, `description`, `actionLabel?`, `onAction?` |
| `Skeleton` | `variant: 'row'\|'card'\|'text'` |
| `Toast` | via a `useToast()` hook + provider, not a prop-drilled component |

**Task 1.x — one task per component above.** Each is its own small,
independently verifiable task (build it, render it in `/design-check`,
confirm responsive + accessible focus states, commit).

---

## 6. Auth & routing architecture

**Task 2.1 — Supabase client + env.** `lib/supabase.ts` reads
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from env; fail loudly
(thrown error, not silent undefined) if missing. Add `.env.example` with
both keys blank.

**Task 2.2 — Auth context/provider.** On mount, restore session via
`supabase.auth.getSession()`, subscribe to `onAuthStateChange`, and once
authenticated, fetch the caller's `profiles` row (id, role, school_id,
name) — this is the single source of truth for role, never trust a
client-side "selected role" from the login screen.

**Task 2.3 — RoleGuard + route trees.** A `<RoleGuard allow={['admin']}>`
wrapper redirects to `/login` if unauthenticated, or to the caller's own
role's dashboard if authenticated but role doesn't match. Build the four
route trees (`/admin/*`, `/teacher/*`, `/student/*`, `/parent/*`) as
lazy-loaded route modules (`React.lazy`) so each role's bundle isn't
loaded for other roles.

**Task 2.4 — Login screen.** Per `eduflow-frontend-ui-prompt.md` §5.1.
Role tiles only affect the post-login redirect guess (still corrected by
the real `profiles.role` after auth — see PRD FR-2). Wire to
`supabase.auth.signInWithPassword`.

**Task 2.5 — Register School screen.** Two-step Supabase call: create
`schools` row, then `supabase.auth.signUp` + `profiles` insert
(role='admin', school_id=new school). **Flag to human:** confirm whether
this is done via a single Postgres function (RPC) for atomicity, or two
sequential client calls with manual rollback-on-failure — recommend an
RPC (`register_school(...)`) if not already defined server-side, and
call `supabase.rpc('register_school', {...})` instead of raw inserts.

---

## 7. Milestones (build order, each = one Antigravity Implementation Plan)

Build in this order — each milestone should be its own plan/execute/
verify loop, not one giant task.

### M0 — Project setup
Tasks 0.1–0.2 above. **Definition of Done:** `npm run dev` shows the
`/design-check` route with correct tokens; `npm run build` succeeds.

### M1 — Auth + App Shell
Tasks 2.1–2.5, plus: Sidebar (collapsible, role-specific nav per PRD §2.1
role table), Topbar (search input — can be non-functional stub in this
milestone, notification bell — stub, avatar menu with working Logout).
**DoD:** can register a school, log in as the resulting admin, see an
empty-state Admin Dashboard, and log out.

### M2 — Admin core: Students, Teachers, Classes
- Students list (`features/students`): filter bar, DataTable, empty
  state, pagination. Bind to `students` table joined with `profiles` and
  `classes`.
- Add/Edit Student modal: react-hook-form + zod schema matching PRD
  §5.3/FR-10 fields exactly (name, class+roll, DOB, gender, blood group,
  address, parent name/email/phone).
- Student detail page: header card + Overview/Attendance/Documents tabs
  (Documents tab can be a placeholder `EmptyState` if Storage bucket
  isn't wired yet — flag it, don't fake data).
- Teachers list + Add/Edit Teacher modal (name, subject, email, phone,
  qualification, Assign Classes multi-select chips).
- Classes list + assign class teacher + view roster.
**DoD:** admin can fully CRUD a student and a teacher against real
Supabase tables; UI matches `eduflow-frontend-ui-prompt.md` §5.2.

### M3 — Attendance + Timetable
- Attendance marking screen: class+date pickers, roster with 3-way
  toggle, bulk "mark all present," sticky save bar, optimistic UI update
  via react-query mutation, handle the "already marked today" case (PRD
  FR-21) with an explicit edit confirmation.
- Timetable weekly grid (admin: editable via drawer; teacher/student/
  parent: read-only filtered views per PRD FR-33–36).
- Manage Periods modal.
**DoD:** admin can mark a full class present/absent/late and it persists;
timetable grid renders real `timetable_entries` data for at least one
class.

### M4 — Fees
Dashboard tab, Fee Structure tab + Add Fee Head modal, Collect Fee flow
(admin) + Pay Fee flow (parent, reuses the same modal component with a
role-conditioned title/copy), Reports sub-tabs (Day Book/Class Report/
Defaulters/Student Ledger). All money values through `formatCurrency()`.
**DoD:** recording a payment updates the student's computed fee status
(Paid/Pending/Overdue) visible immediately in both the admin table and
(if a parent test account exists) the parent's Fee Details screen.

### M5 — Homework, Notice Board, Communication, Study Materials
- Homework: card grid, create/edit form, status computed client-side
  from due_date + submission state (not stored as a separate enum column
  unless the backend already has one — flag if unsure).
- Notice Board: list + create/edit modal, priority sort.
- Communication: conversation list + thread + composer, wired to
  Supabase Realtime for live message delivery + unread badge.
- Study Materials: upload (Supabase Storage) + filterable grid +
  download.
**DoD:** a teacher can post homework and a notice that a student account
can see; a message sent from teacher→student appears in near-real-time
without a manual refresh.

### M6 — Tests & Exams, Report Card, Progress, Reports
- Create Exam form, Result Entry bulk-marks table (Save All / Publish
  All / Unpublish All per PRD FR-47), Results tab.
- Student Report Card (Exam Results + My Fees tabs) and Progress
  (GPA/rank stat cards + trend + subject-vs-average chart) — both must
  read only **published** results (PRD FR-48).
- Admin Reports (Overview/Attendance/Exam Results/Finance tabs, charts
  via recharts, explicit empty-data handling per PRD FR-42).
**DoD:** publishing an exam's results makes them appear on the
corresponding student's Report Card and Progress without additional data
entry.

### M7 — Roles & Permissions, Subject & Class, AI Assistant, Settings
- Roles & Permissions: per-teacher toggle rail (PRD FR-43 — note this is
  **per teacher**, not per role-tab).
- Subject & Class Assignment: Subjects tab, Assign Subjects tab, Summary
  tab.
- AI Assistant: tool rail (AI Tutor/Quiz Generator/Homework Helper) +
  form, calling a Supabase Edge Function (never call an LLM provider
  directly from the client — PRD FR-52). If the Edge Function doesn't
  exist yet, stub the call behind a clearly labeled `// TODO: backend
  edge function pending` and show a "coming soon" state rather than
  faking a response.
- Settings: school profile form + config toggles.
**DoD:** every remaining sidebar item in every role's nav resolves to a
real screen (no dead links), even if AI Assistant is in its stubbed
"coming soon" state pending the backend.

### M8 — Polish pass
Full responsive audit (375/768/1280), accessibility audit (focus rings,
color+text status pairing, keyboard nav through every modal), loading/
empty/error state audit across all screens, Lighthouse pass for
performance, remove the `/design-check` dev-only route from production
build, final `npm run typecheck && npm run lint && npm run build`.
**DoD:** ready to open a PR from a feature branch into `main`; Vercel
preview deploy is clean.

---

## 8. Data contracts the frontend needs from Supabase

Run `npx supabase gen types typescript --project-id <id> > src/types/database.types.ts`
at the start of M2 and re-run it any time the schema changes — **do not
hand-maintain these types**. The high-level tables the frontend binds to
are listed in `eduflow-prd.md` §10; if a screen in this PRD needs a
column/table that generated types don't have, stop and flag it as a
backend gap rather than inventing a client-side workaround.

---

## 9. Non-functional constraints (frontend-specific)

- Bundle: role-based code-splitting (§6, Task 2.3) — no role should
  download another role's route bundle.
- Every Supabase read wrapped in a react-query hook with a sane
  `staleTime` (default 30s) so switching tabs doesn't cause redundant
  refetches; mutations invalidate the relevant query keys from
  `lib/queryKeys.ts`.
- Images/avatars lazy-loaded; large tables paginate at 50 rows
  server-side (`.range()`), never fetch-all-then-paginate-client-side.
- All dates rendered through one `formatDate()` util (school timezone
  aware — PRD §12 assumption).
- Follow WCAG 2.1 AA floor from `eduflow-prd.md` §6 — this applies to
  every component in §5, not just top-level pages.

## 10. Explicit out-of-scope (do not build unprompted)

Payment gateway integration, native mobile app, non-English UI, group
broadcast beyond Notice Board, chat read receipts/typing indicators,
transport/hostel/library modules — matches `eduflow-prd.md` §1.4/§5.11.
If the agent notices a gap that seems to require one of these, it should
flag it in the Implementation Plan rather than building around it
silently.