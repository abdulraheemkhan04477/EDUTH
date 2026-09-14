# Product Requirements Document (PRD)
## EduFlow — School Management System

| | |
|---|---|
| **Document owner** | Product/Engineering (you) |
| **Status** | Draft v1.0 |
| **Last updated** | August 28, 2026 |
| **Target stack** | Vite + React + TypeScript (frontend), Supabase (Postgres + Auth + Storage + Realtime), GitHub (source control), Vercel (hosting/CI-CD) |

---

## 1. Overview

### 1.1 Problem statement
Schools currently run attendance, fees, homework, timetables, exams, and
parent communication across a mix of paper registers, WhatsApp groups, and
spreadsheets. This causes: attendance and fee records that don't reconcile,
parents who find out about dues or exam schedules late, teachers who
duplicate work across notebooks and messaging apps, and admins who have no
single live view of the school.

### 1.2 Product vision
EduFlow is a single, multi-tenant web application where **one school
account (tenant)** gets one connected system for academics, attendance,
fees, and communication — used daily by four kinds of people: **School
Admins, Teachers, Students, and Parents**, each with a role-scoped view of
the same underlying data.

### 1.3 Goals
- Give admins one live dashboard instead of five disconnected tools.
- Cut attendance and fee-status lookup time from "ask around" to "one screen."
- Make homework, timetable, exam schedules, and notices visible to students
  and parents in real time, without a separate messaging app.
- Ship a system that a single small team can build, operate, and extend —
  favoring a managed backend (Supabase) over custom infrastructure.

### 1.4 Non-goals (for v1)
- Payment gateway integration (fee "collection" is recorded, not processed
  online, in v1 — see §5.7).
- Native mobile apps (responsive web only).
- Multi-language UI (English only in v1; content is structured so i18n can
  be added later).
- Transport/hostel/library management modules.

---

## 2. Target users & personas

| Persona | Role | Primary needs |
|---|---|---|
| **Anjali Singh** — School Admin | `admin` | Enroll students/teachers, configure classes/subjects/fees, see school-wide reports, post notices, control who can do what |
| **Samar Ali** — Class Teacher | `teacher` | Mark attendance fast, set homework, enter exam marks, see only their own classes |
| **Rohit Verma** — Student | `student` | Check today's timetable, submit homework, see attendance/results, get notices |
| **Yash Verma** — Parent | `parent` | See child's attendance/fees/results, pay fees, get notices, switch between multiple children |

### 2.1 Role hierarchy & tenancy
- A **school** is the tenant boundary. All data (students, teachers,
  classes, fees, etc.) is scoped to `school_id`.
- A school is created via **self-serve registration**, which creates the
  `schools` row and the first `admin` profile together.
- An admin invites/creates teacher, student, and parent accounts from
  inside the product (no further public self-registration).
- One parent account can be linked to **more than one student** (siblings).
- One student always belongs to exactly one class at a time.

---

## 3. Scope

### 3.1 In-scope modules (v1)
Auth & school registration · Dashboard (per role) · Students · Teachers ·
Classes · Attendance · Fees (structure, collection, reports) · Homework ·
Timetable · Notice Board · Communication (in-app messaging) · Reports ·
AI Assistant (Tutor / Quiz Generator / Homework Helper) · Roles &
Permissions · Subject & Class assignment · Tests & Exams (create,
result entry, publish) · Study Materials · Settings · Report Card ·
Progress tracking (student).

### 3.2 Phasing

| Phase | Scope | Goal |
|---|---|---|
| **MVP (Phase 1)** | Auth, Students, Teachers, Classes, Attendance, Notice Board, Timetable, basic Admin Dashboard | A school can onboard, take attendance, and communicate |
| **Phase 2** | Fees (structure/collection/reports), Homework, Study Materials, Communication | Money and daily academic workflow live in-app |
| **Phase 3** | Tests & Exams, Report Card, Progress, Reports (school-wide analytics) | Full academic-results lifecycle |
| **Phase 4** | Roles & Permissions (granular), AI Assistant, Settings polish | Fine-grained control + AI-assisted study tools |

This PRD documents the **full v1 product** (all four phases); phasing is
the recommended build order, not a scope cut.

---

## 4. Roles & permissions matrix

Permissions are enforced at two levels: **Supabase Row-Level Security**
(hard boundary, cannot be bypassed from the client) and **UI-level
show/hide** (convenience, not a security boundary). Admins can additionally
fine-tune a **per-teacher permission override** (see §5.13) that narrows a
specific teacher's access below the default "teacher" role — e.g. a teacher
who can view but not create exams.

| Capability | Admin | Teacher (default) | Student | Parent |
|---|---|---|---|---|
| Manage students/teachers/classes | ✅ full CRUD | ❌ | ❌ | ❌ |
| Mark attendance | ✅ any class | ✅ own class(es) only | ❌ (view own) | ❌ (view child's) |
| Manage fee structure / collect fees | ✅ | ❌ | ❌ | 👁️ view + pay own child's |
| Create/edit homework | ✅ | ✅ own classes | 👁️ view + submit | 👁️ view |
| Manage timetable | ✅ | 👁️ view own | 👁️ view own | 👁️ view child's |
| Post notices | ✅ school-wide | ✅ own class | 👁️ view | 👁️ view |
| Create/publish exams, enter marks | ✅ | ✅ own subject/class | 👁️ view results | 👁️ view child's results |
| Roles & Permissions | ✅ | ❌ | ❌ | ❌ |
| Reports (school-wide) | ✅ | 👁️ own class subset | ❌ | ❌ |
| AI Assistant | ✅ | ✅ | ✅ | ❌ (v1) |
| Study Materials | ✅ upload/manage | ✅ upload own subject | 👁️ view/download | 👁️ view/download |

Legend: ✅ = create/edit, 👁️ = read-only or scoped subset.

---

## 5. Functional requirements

Each module below lists: purpose, key user stories, functional
requirements, and edge cases to handle.

### 5.1 Authentication & School Registration
**Purpose:** get a school and its first admin into the system, and let all
four roles sign in securely.

- FR-1: Public **Register School** flow creates a `schools` row and a
  `profiles` row (role=admin) in a single transaction; fails atomically if
  either insert fails.
- FR-2: **Login** screen lets a user pick their role (Admin/Teacher/
  Student/Parent) before entering credentials; the selected role only
  affects which post-login redirect/dashboard is used — the *actual* role
  enforced is the one stored in `profiles.role`, never the client-side
  selection, so a mismatched selection just redirects correctly after
  Supabase Auth confirms identity.
- FR-3: Passwords minimum 8 characters; Supabase Auth handles hashing/
  session tokens.
- FR-4: "Forgot password" sends a Supabase Auth reset email.
- FR-5: Session persists via Supabase Auth's refresh token; auto-logout
  after token invalidation.
- Edge cases: duplicate school-name registration (allow — schools aren't
  deduplicated by name), email already in use (clear inline error), role
  mismatch at login (e.g. a teacher selects "Admin" tile — sign-in should
  still succeed and redirect to the teacher dashboard, with a one-time
  toast noting the correct role).

### 5.2 Dashboard (role-specific)
- FR-6: Admin dashboard shows live counts (students, teachers, classes,
  fee collected) and two charts (attendance trend, fee collected vs
  pending).
- FR-7: Teacher dashboard shows today's periods and 3 quick stats (my
  classes, my students, pending-to-grade count).
- FR-8: Student dashboard shows attendance %, fees (total/pending),
  upcoming exam count, today's timetable, upcoming exams list, and recent
  notices.
- FR-9: Parent dashboard shows the same shape as the student dashboard but
  scoped to the **currently selected child**, with a child-switcher control
  visible whenever the parent has more than one linked student.
- All counts must be computed from live data (no cached/static numbers)
  and update within one page refresh of an underlying change.

### 5.3 Students
- FR-10: Admin can create/edit/delete a student: name, class+roll number,
  DOB, gender, blood group, address, and linked parent (name/email/phone —
  creating a student with a new parent email auto-creates a `parent`
  profile invite).
  Deletion is a **soft delete** (status flag), not a hard row delete
  — need to preserve historical attendance/fee/exam records.
- FR-11: Student list is filterable by class and fee status, and
  searchable by name/roll/ID.
- FR-12: Student detail page shows attendance %, points/streak (see
  gamification note below), and tabs for Overview / Attendance /
  Documents.
- FR-13: A student's `class_id` can be changed (promotion/transfer) —
  changing class must not retroactively alter past attendance/exam
  records tied to the old class.

### 5.4 Teachers
- FR-14: Admin can create/edit/deactivate a teacher: name, primary
  subject, email, phone, qualification, and an **Assign Classes**
  multi-select.
- FR-15: Deactivating a teacher revokes login but preserves their
  historical attendance/marks/homework entries (soft delete, same pattern
  as students).
- FR-16: A teacher can only mark attendance/enter marks/set homework for
  classes they are assigned to (enforced by RLS, not just UI).

### 5.5 Classes & Subject Assignment
- FR-17: Admin manages the class list (e.g. "1-A", "5-B") each with an
  assigned class teacher and roster.
- FR-18: Admin manages a school-wide **Subjects** catalogue (name, code,
  description) and assigns subjects to classes, either per-class
  ("Single Assignment") or in bulk.
- FR-19: A **Summary** view shows, per class, which subjects and teachers
  are assigned — used to spot gaps (a class with no teacher assigned to a
  subject) before the term starts.

### 5.6 Attendance
- FR-20: Teacher/admin selects a class + date, sees the full roster, and
  marks each student **Present / Absent / Late** via a per-row toggle, with
  a "mark all present" bulk action.
- FR-21: Attendance for a given class+date can only be submitted once per
  day by default; re-opening an already-marked day shows the existing
  marks and requires an explicit "edit" action (audit-logged: who changed
  it and when).
- FR-22: Attendance % shown anywhere in the product (dashboards, student
  detail, reports) is always computed the same way:
  `present_days / total_school_days_so_far`, with Late counted as present
  for the percentage but tracked separately in the breakdown.
- FR-23: Students/parents see a read-only calendar view of attendance
  history with color-coded days.

### 5.7 Fees
- FR-24: Admin defines a **Fee Structure** per class: fee heads (e.g.
  Tuition, Admission), amount, frequency (monthly/quarterly/yearly/
  one-time), academic year, optional description.
- FR-25: **Collect Fee**: admin (or parent, self-service) records a
  payment against a student's due fee head — amount, payment method
  (Cash/Online Transfer/Cheque), optional transaction ID. This is a
  **record-keeping** action in v1, not a live payment gateway charge (see
  §1.4 non-goals) — "Online Transfer" just logs that the transfer happened
  outside the app.
  *(Payment-gateway integration, e.g. Razorpay/Stripe, is an explicit
  Phase 5+ candidate, not built in v1.)*
- FR-26: Fee status per student is always one of **Paid / Pending /
  Overdue** (Overdue = pending past the due date), computed, not manually
  set.
- FR-27: Fees module exposes 4 report views: Dashboard (aggregate stats +
  monthly chart), Day Book (chronological transaction log), Class Report
  (per-class due/paid/balance table), Defaulters (students past due
  date), Student Ledger (single student's full payment history).
- FR-28: Parent can view and pay (record payment for) only their own
  linked child(ren)'s fees; cannot see other students' fee data (RLS
  enforced).

### 5.8 Homework
- FR-29: Teacher creates homework: title, subject, class, due date,
  description; optional attachment.
- FR-30: Homework has a computed status: **Active** (before due date),
  **Overdue** (past due, not submitted), **Completed/Submitted**.
- FR-31: Student can submit homework (text and/or file upload via Supabase
  Storage); teacher sees a submissions count (`submitted/total`) per
  assignment.
- FR-32: Students filter their homework list by All/Active/Overdue/
  Submitted.

### 5.9 Timetable
- FR-33: Admin defines the school's **period structure** (period label,
  start/end time, and a flag for breaks/lunch which are non-editable,
  purely visual rows in the grid).
- FR-34: Admin builds a weekly grid per class: each cell (day × period)
  can be assigned a subject + optional teacher via a quick-edit
  drawer. A "Clear" action empties a cell.
- FR-35: The system should warn (not block, unless later required) when
  the same teacher is assigned to two different classes in the same day+
  period slot (a scheduling conflict).
- FR-36: Teachers see a read-only version of the grid filtered to their
  own periods; students/parents see their class's grid.

### 5.10 Notice Board
- FR-37: Admin/teacher create notices: title, description, priority
  (High/Medium/Low), author (defaults to the poster), and audience scope
  (school-wide for admin, own-class for teacher).
- FR-38: Notices are listed newest-first; students/parents see a
  read-only feed; high-priority notices are visually emphasized (not just
  color — also sort order, appearing above medium/low).

### 5.11 Communication
- FR-39: In-app messaging (chat-style: conversation list + thread +
  composer), scoped so admins/teachers can message students/parents/each
  other within the same school; students/parents can message their
  teachers.
- FR-40: Message delivery should be near-real-time (Supabase Realtime
  channel per conversation) with an unread-count badge in the topbar bell.
- Out of scope for v1: group broadcast threads beyond notices, read
  receipts, file attachments in chat (attachments live in Study
  Materials/Homework instead).

### 5.12 Reports
- FR-41: Admin-only school-wide reports across 4 tabs: Overview
  (aggregate stat cards), Attendance (trend chart), Exam Results
  (distribution chart), Finance (collected vs pending over time, with
  export).
- FR-42: All report charts must handle the empty-data case explicitly
  (e.g. a brand-new school with no exams yet) rather than rendering a
  broken/empty chart.

### 5.13 Roles & Permissions
- FR-43: Admin can, per individual teacher, toggle granular permissions
  grouped by module (Students: View All/Create/Edit/Delete; Attendance:
  View/Mark; Exams & Results: View/Create/Enter Marks; Homework:
  View/Assign; Notice Board: ...). These toggles **narrow** a teacher's
  default role permissions — they cannot grant a teacher admin-level
  access.
- FR-44: Changes take effect immediately (no re-login required) —
  implemented via a permissions row checked by RLS policies and/or a
  short-lived client-side permissions cache invalidated on save.

### 5.14 Tests & Exams
- FR-45: Three-tab module: **Tests** (lightweight, single-subject,
  class-scoped), **Exams** (multi-subject, scheduled, e.g. "Half Yearly
  Examination"), **Results** (entry + publishing).
- FR-46: Creating an exam requires: title, type, class, start date, end
  date, optional description; subjects/dates-per-subject are configured
  once the exam is created.
- FR-47: **Result Entry** is bulk: select class + exam, all subjects for
  that exam load together; teacher enters marks per student per subject in
  an editable table with computed grade + pass/fail, then **Save All**
  (draft) or **Publish All** (makes results visible to students/parents;
  irreversible without an explicit "Unpublish All").
- FR-48: Published results feed the Report Card and Progress modules
  automatically — no duplicate data entry.

### 5.15 Study Materials
- FR-49: Teachers/admins upload materials (file to Supabase Storage +
  metadata: title, subject, class, type). Students/parents can browse/
  filter (by class, subject, type) and download.
- FR-50: Storage access is gated by Supabase Storage RLS matching the
  requester's class/role — a student cannot access another class's
  materials via a guessed URL.

### 5.16 AI Assistant
- FR-51: Three tools, consistent pattern (left rail tool picker + right
  form): **AI Tutor** (open Q&A), **Quiz Generator** (topic → generated
  quiz), **Homework Helper** (pick an assigned homework, optional subject,
  ask a question → step-by-step help, not the final answer outright).
- FR-52: Available to Admin, Teacher, and Student roles in v1 (not
  Parent). Backed by an LLM API call server-side (never expose the LLM API
  key client-side) — implement as a Supabase Edge Function that proxies
  the request.
- FR-53: Must show a clear loading state and handle failures gracefully
  (retry affordance, no silent failure).

### 5.17 Report Card & Progress (Student)
- FR-54: Report Card: Exam Results tab (aggregate stats + full results
  table, sourced from published exam results) and My Fees tab (own fee
  ledger, read-only mirror of §5.7 scoped to self).
- FR-55: Progress: GPA/rank/subject-count/avg-score stat cards, a
  performance-trend line chart over time, and a subject-vs-class-average
  comparison chart, computed from published results + attendance.

### 5.18 Settings
- FR-56: Admin edits school profile (name, address, phone, logo) and
  toggles school-level configuration (e.g. enable/disable AI Assistant,
  notification preferences).

---

## 6. Non-functional requirements

| Category | Requirement |
|---|---|
| **Performance** | First contentful paint < 2s on a typical broadband connection; list views (students, fees) paginate server-side past 50 rows rather than loading everything client-side |
| **Security** | All data access enforced via Supabase RLS keyed on `school_id` + role, not just UI hiding; no service-role key ever shipped to the client; file uploads virus/type-checked at the edge function level before storage |
| **Availability** | Target 99.5% uptime, inherited from Supabase + Vercel SLAs; no self-hosted single points of failure |
| **Scalability** | Schema must support many schools (multi-tenant) without cross-tenant data leakage; indexes on `school_id`, `class_id`, `student_id` foreign keys |
| **Accessibility** | WCAG 2.1 AA floor: visible focus states, color never the sole status signal, keyboard-navigable modals, alt text on meaningful images |
| **Browser support** | Latest 2 versions of Chrome, Edge, Safari, Firefox; responsive down to 375px width |
| **Data retention** | Soft-deleted records (students, teachers) retained indefinitely unless an admin explicitly purges them, to preserve historical reports |
| **Auditability** | Attendance edits, fee collection, and result publishing are logged with actor + timestamp |
| **Internationalization readiness** | All user-facing strings centralized (even though only English ships in v1) |

---

## 7. Technical architecture

```
┌────────────────────────────┐        ┌──────────────────────────────┐
│  Vite + React + TypeScript │  HTTPS │  Supabase                     │
│  (Vercel-hosted SPA)       │◄──────►│  - Postgres (RLS per table)   │
│  - Tailwind CSS            │        │  - Auth (email/password)      │
│  - React Router (role-     │        │  - Storage (materials,        │
│    guarded route trees)    │        │    homework attachments)      │
│  - Supabase JS client      │        │  - Realtime (Communication,   │
│  - Recharts (charts)       │        │    notification badges)       │
└────────────────────────────┘        │  - Edge Functions (AI         │
                                        │    Assistant proxy, invite    │
                                        │    emails)                    │
                                        └──────────────────────────────┘
        │
        ▼
   GitHub repo → Vercel (CI/CD: preview deploy per PR, production on merge to main)
```

- **State/data fetching:** TanStack Query (React Query) over the Supabase
  client for caching, refetch-on-focus, and optimistic updates (e.g.
  attendance toggles).
- **Auth guard:** a route-level wrapper checks `profiles.role` (fetched
  once at login, cached in context) before rendering role-specific route
  trees (`/admin/*`, `/teacher/*`, `/student/*`, `/parent/*`).
- **Multi-tenancy:** every table carries `school_id`; RLS policies join
  through `profiles.school_id = auth.uid()`'s school to scope all reads/
  writes — this is the single most important security control in the
  system and must be tested per table, not assumed.
- **File storage:** Supabase Storage buckets separated by purpose
  (`study-materials`, `homework-submissions`, `avatars`), each with its own
  RLS policy.
- **AI Assistant:** Supabase Edge Function holds the LLM API key and
  forwards a scoped prompt; the client never talks to the LLM provider
  directly.

---

## 8. Key user flows

### 8.1 School onboarding
Register School → Admin auto-logged in → Admin adds Classes → adds
Subjects → adds Teachers (assign classes) → adds Students (auto-invites
parents) → sets Fee Structure → sets Timetable → school is "live."

### 8.2 Daily teacher flow
Login → Dashboard (today's periods) → open Attendance for current period's
class → mark roster → Save → (later) open Homework → create assignment →
(later) Communication to answer a parent message.

### 8.3 Fee collection
Admin/Parent opens Fees → Collect Fee (admin) or Pay Fee (parent) → enters
amount + method (+ transaction ID) → Submit → student's fee status
recomputes → reflected instantly on Admin Fees dashboard and Parent Fee
Details.

### 8.4 Exam-to-report-card
Admin/Teacher creates Exam → schedules per-subject dates → Teacher does
Result Entry (bulk marks) → Save All (draft, not visible to students) →
Publish All → Student's Report Card and Progress update automatically →
Parent sees updated Results.

---

## 9. UI/UX requirements

Full design system, screen-by-screen spec, and component library are
defined in the companion documents:
- `eduflow-frontend-ui-prompt.md` — design tokens + screen specs
- `eduflow-stitch-prompts.md` + `eduflow-stitch-prompts-full-coverage.md`
  — ready-to-paste Stitch generation prompts for every screen

This PRD's functional requirements (§5) and that design spec must stay in
sync — if a field is added here, it must be reflected in the corresponding
form spec, and vice versa.

---

## 10. Data model (high-level entities)

`schools` · `profiles` (id, school_id, role, name, email, phone) ·
`classes` (school_id, name, class_teacher_id) · `subjects` (school_id,
name, code) · `class_subjects` (class_id, subject_id, teacher_id) ·
`students` (profile_id, class_id, roll_no, dob, gender, blood_group,
address, parent_id, status) · `teachers` (profile_id, qualification,
status) · `attendance` (student_id, class_id, date, status, marked_by) ·
`fee_heads` (school_id, class_id, title, amount, frequency, academic_year)
· `fee_payments` (student_id, fee_head_id, amount, method, transaction_id,
paid_at, recorded_by) · `homework` (class_id, subject_id, teacher_id,
title, description, due_date) · `homework_submissions` (homework_id,
student_id, submitted_at, file_url) · `periods` (school_id, label,
start_time, end_time, is_break) · `timetable_entries` (class_id, day,
period_id, subject_id, teacher_id) · `notices` (school_id, author_id,
title, description, priority, audience_scope) · `messages` +
`conversations` (participant ids, school_id) · `exams` (class_id, title,
type, start_date, end_date) · `exam_subjects` (exam_id, subject_id, date,
max_marks) · `results` (exam_subject_id, student_id, marks, grade,
published) · `study_materials` (school_id, class_id, subject_id, title,
file_url, uploaded_by) · `permissions_overrides` (teacher_id, module,
action, allowed).

*(Full column-level schema + RLS policies to be produced as a separate
Supabase migration document when build starts.)*

---

## 11. Success metrics (KPIs)

| Metric | Target (3 months post-launch, per school) |
|---|---|
| Daily active teachers marking attendance | ≥ 90% of assigned school days |
| Time from fee payment to status update visible to parent | < 5 minutes |
| Notices read within 24h (student/parent) | ≥ 70% |
| Homework submission rate | ≥ 80% before due date |
| Admin-reported "single source of truth" satisfaction (survey) | ≥ 4/5 |

---

## 12. Assumptions & constraints

- Each school operates in a single timezone (stored per school).
- Academic year and terms are configured by the admin; the system does not
  hardcode a specific country's academic calendar.
- Fee amounts are stored in a single currency per school (no multi-currency
  in v1); currency symbol is a school-level setting.
- Parents access via email/password (no social login in v1).
- Class sizes assumed ≤ ~60 students; UI (bulk attendance, bulk result
  entry) is designed around that scale, not thousands of rows per class.

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| RLS misconfiguration leaks cross-school data | Write RLS policy tests per table before shipping any module; never rely on client-side filtering alone |
| Fee "payment recording" mistaken for real payment processing by users | Clear UI copy ("Record Payment", method field, no card-entry UI) to avoid implying a live charge |
| Teacher permission overrides silently break core workflows | Overrides can only narrow, never grant beyond role defaults; default role always has a safe minimum |
| AI Assistant cost/abuse | Rate-limit per user via the Edge Function; log usage per school |
| Scope creep from the reference (92-page) demo | This PRD locks the v1 feature set; new asks go into an explicit backlog, not directly into build |

## 14. Open questions

- Will fee payments eventually need a real payment gateway (Razorpay/
  Stripe) in a later phase, and does that change the `fee_payments` schema
  now to ease migration later?
- Should "Late" attendance count toward a fee-linked attendance-incentive
  scheme, or is it purely informational in v1?
- Does Communication need read receipts / typing indicators, or does the
  v1 scope (send/receive + unread badge) suffice for launch?
- Single-school-per-deployment vs. true multi-tenant SaaS (many schools on
  one deployed instance) — this PRD assumes the latter; confirm before
  finalizing billing/plan structure if one is planned.

---

## 15. Appendix — glossary

- **Tenant/School** — the top-level account boundary; all data is scoped
  to one school.
- **RLS** — Row-Level Security, Postgres/Supabase's per-row access control,
  the primary security boundary in this system.
- **Soft delete** — marking a record inactive instead of removing it, to
  preserve historical reports.
- **Published (results)** — the point at which entered marks become
  visible to students/parents; before publishing, marks are a private
  draft.