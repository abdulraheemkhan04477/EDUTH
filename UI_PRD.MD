# EduFlow — Google antigravity Prompt Pack (Vite + React + TypeScript + Tailwind + Supabase)

Stitch generates in batches of up to 5 connected screens per run, and its code export (HTML/CSS, **Tailwind**, **React/JSX**) is what you'll pull into your Vite + React + TS project. So this pack is split into:

1. **One "Design System" seed prompt** — paste this first, in its own generation, to lock in the brand/tokens. Every later batch references it so screens stay visually consistent.
2. **Six screen batches** (≤5 screens each) — paste one batch per Stitch generation, in order.

Every prompt ends with the same **stack directive** so Stitch's code export comes out usable:
> *"Export using Tailwind CSS utility classes only (no inline styles), and keep every section visually modular — stat cards, tables, modals, and forms as clearly separable blocks — so each maps directly to a reusable React + TypeScript component in a Vite project. Backend is Supabase (Postgres + Auth + Storage), so forms should map cleanly to database fields (no decorative-only fields)."*

Copy each block exactly as-is into Stitch.

---

## 0. Design System seed prompt (run this first)

```
Create the visual design system for a web app called "EduFlow" — a school
management system used daily by school admins, teachers, students, and
parents. Desktop-first, responsive down to mobile.

BRAND & MOOD: warm, confident, efficient "school office" feel — not
playful/childish, not corporate-cold. Trustworthy and fast to scan.

COLOR TOKENS:
- Primary/brand: #E4572E (buttons, active nav, links, focus states),
  hover/pressed #C8441E, gradient partner #F0784F, tint background #FDEAE2
- Ink: headings #1E1B1A, body text #5C5654, muted/placeholder #948C89
- Surfaces: cards/panels #FFFFFF, page background #FAF8F6, hairline
  borders #ECE7E4
- Semantic status colors (use for pills/badges, always paired with text,
  never color alone): success #1F9254 on #E4F6EC (Paid / Present /
  Completed), warning #D98A1E on #FDF1DD (Pending / Medium priority),
  danger #D6402F on #FBE5E2 (Absent / Overdue / High priority), info
  #2A6FE0 on #E7EFFD (neutral stat highlight)

TYPOGRAPHY: Headings in "Sora" (600/700 weight), body and UI text in
"Inter" (400/500/600). Big stat numbers use Sora with tabular numerals.
Type scale 12/13/14/16/20/24/32px.

SHAPE & ELEVATION: 8px radius on buttons/inputs, 12px radius on cards,
16px radius on modals. Soft two-layer shadow on cards and modals only
(no heavy drop shadows). 4px spacing base (4/8/12/16/24/32/48).

SIGNATURE ELEMENT: stat cards (attendance %, fee collection %, homework
completion %) use a slim circular progress ring around or beside the
number instead of a flat number-in-a-box — this is the one recurring
"flourish" of the whole product; everything else stays flat and quiet.

LAYOUT SHELL: left sidebar, 240px wide, brand-colored logo mark "EduFlow"
+ wordmark at top, below it a vertical nav list (icon + label per item),
active item has a light orange background (#FDEAE2), brand-colored text,
and a 3px accent bar on the left edge. Bottom of sidebar is pinned:
circular avatar with initials, user name, role label, small "Logout"
link. Top bar spans the remaining width: a search input on the left,
a notification bell and user avatar dropdown on the right. Page content
area has a page title (Sora, 24px) with a one-line gray description
under it, then the page body.

COMPONENTS TO DEFINE: primary button (filled brand orange, white text,
8px radius), secondary/ghost button (outline, ink text), status pill
(colored background + colored text + small icon, pill-shaped), data
table (sticky header row, hover row highlight, right-aligned numeric
columns, small icon actions on the right: pencil = edit, trash = delete),
modal (centered, white, 16px radius, header + scrollable body + sticky
footer with Cancel ghost button + primary filled button), stat card
(white rounded card, colored icon badge top-left, big number, label,
optional progress ring), empty state (centered icon + one sentence +
primary button).

Generate one clean example screen showing this system applied: a generic
"Dashboard" with 4 stat cards in a row (using the progress-ring style)
and a simple two-column chart section below.

Export using Tailwind CSS utility classes only (no inline styles), and
keep every section visually modular — stat cards, tables, modals, and
forms as clearly separable blocks — so each maps directly to a reusable
React + TypeScript component in a Vite project. Backend is Supabase
(Postgres + Auth + Storage), so forms should map cleanly to database
fields (no decorative-only fields).
```

---

## Batch 1 — Auth + Admin core

```
Using the EduFlow design system already established (warm orange
#E4572E brand, Sora headings, Inter body, rounded cards, status pills),
generate these 5 connected screens for a school management web app:

1. LOGIN — split screen. Left half: full-height brand gradient panel
(#F0784F to #C8441E), "EduFlow" logo mark top-left, headline "Manage
your school with confidence", one supporting line, and 3 small stat
chips near the bottom (e.g. "2,847 Students", "184 Teachers",
"12 Schools"). Right half: white background, centered card with
"Welcome back" heading, "Select your role and sign in" subtext, Email
field, Password field (with show/hide icon), a primary button that
reads "Sign in as Admin", a text link below it "New school? Register
School", then a 2x2 grid of role-selector tiles labeled Admin, Teacher,
Student, Parent (Admin tile shown selected/highlighted in brand color).

2. REGISTER SCHOOL — centered modal on a dimmed backdrop. Title
"Register Your School" with a close icon top-right. Fields: School
Name, School Address, School Phone. Then a divider labeled "ADMIN
ACCOUNT" with fields: Your Name, Email, Password (helper text "min. 8
characters"), Phone. Full-width primary button "Register School" at
the bottom.

3. ADMIN DASHBOARD — sidebar (Dashboard active) + topbar as defined in
the design system. Page title "Dashboard". Row of 4 stat cards with
progress rings: Total Students, Total Teachers, Total Classes, Fee
Collected (currency). Below, a two-column row: left a line chart card
titled "Attendance Trend", right a bar chart card titled "Fee
Collection — Collected vs Pending" (two-color bars, green=collected,
orange=pending).

4. STUDENTS LIST — sidebar (Students active). Page title "Students"
with a primary "+ Add Student" button top-right. Filter bar: class
dropdown, status dropdown, search input. Data table columns: Student
(avatar initials + name), Class-Roll, Attendance % (small ring), Fee
Status (pill), Actions (edit/delete icons). 8 sample rows. Pagination
footer.

5. ADD/EDIT STUDENT MODAL — modal over the students list. Title "Add
New Student". Two-column form: Full Name, Class & Roll No (two selects
side by side), Date of Birth, Gender (select), Blood Group, Address
(full width), then a divider "PARENT DETAILS": Parent Name, Parent
Email, Parent Phone. Footer: Cancel (ghost) + "Add Student" (primary).

Export using Tailwind CSS utility classes only (no inline styles), and
keep every section visually modular — stat cards, tables, modals, and
forms as clearly separable blocks — so each maps directly to a reusable
React + TypeScript component in a Vite project. Backend is Supabase
(Postgres + Auth + Storage), so forms should map cleanly to database
fields (no decorative-only fields).
```

---

## Batch 2 — Teachers, Classes, Attendance, Fees

```
Using the same EduFlow design system, generate these 5 connected
screens:

1. TEACHERS LIST — sidebar (Teachers active). Page title "Teachers",
"+ Add Teacher" button top-right. Table columns: Teacher (avatar +
name), Subject, Contact, Classes Assigned (small chips), Status
(active/inactive toggle switch), Actions.

2. ADD TEACHER MODAL — Title "Add New Teacher". Two-column form: Full
Name, Subject (select); Email, Phone; Qualification (full width text,
placeholder "e.g. BSc, MSc"). Below, a labeled section "Assign Classes"
with a wrapped grid of selectable class chips (1-A, 1-B, 2-A, 2-B ...
up to 10-B), multi-select style with brand-colored border when selected.
Footer: Cancel + "Add Teacher" primary button.

3. ATTENDANCE MARKING — sidebar (Attendance active). Page title
"Attendance". Top controls: Class select, Date picker, "Mark all
present" secondary button. Below, a roster list: each row has avatar
initials, student name, roll number, and a 3-way segmented toggle
(Present / Absent / Late) with Present pre-selected in green. Sticky
bottom bar with attendance summary counts (Present/Absent/Late) and a
primary "Save Attendance" button.

4. FEES DASHBOARD — sidebar (Fees active). Page title "Fee Management"
with subtitle "Class-wise fee structure, collection & reports". Tab bar:
Dashboard (active) / Fee Structure / Collect Fee / Reports /
Concessions. Below tabs: 4 stat cards — Paid Students (green, count),
Pending Students (orange, count), Total Collected (blue, currency),
Total Pending (teal, currency). Below that, a "Class-wise Fee Status"
table: Student, Class, Student ID, Total Due, Paid, Pending, Status
(pill), Action (a small "Collect" button per row, brand colored).

5. COLLECT FEE MODAL — modal titled "Pay Fee" with a close icon. Under
the title, a summary line: "Tuition Fee — Quarter 2 (2026-27)" with
"Total: Rs. 4,500 · Remaining: Rs. 2,200 · Due: 22 Jul 2026" as small
gray text. Form fields: "Amount to Pay (Rs.)" numeric input pre-filled
with the remaining amount, "Payment Method" select (Cash / Online
Transfer / Cheque), "Transaction ID (optional)" text input. Footer:
Cancel (ghost) + "Submit Payment" (primary, brand orange).

Export using Tailwind CSS utility classes only (no inline styles), and
keep every section visually modular — stat cards, tables, modals, and
forms as clearly separable blocks — so each maps directly to a reusable
React + TypeScript component in a Vite project. Backend is Supabase
(Postgres + Auth + Storage), so forms should map cleanly to database
fields (no decorative-only fields).
```

---

## Batch 3 — Homework, Timetable, Notice Board, Communication, Reports

```
Using the same EduFlow design system, generate these 5 connected
screens:

1. HOMEWORK LIST — sidebar (Homework active). Page title "Homework"
with subtitle "4 assignments total", "+ New Assignment" button
top-right. Filter row: class dropdown, status dropdown, search. Below,
a card grid (3 columns) of assignment cards: subject tag, title,
one-line description, due date with calendar icon, class + teacher
name, a thin progress bar showing "Submissions: 5/27", and a status
pill (Active in orange / Overdue in red / Completed in green) top-right
of each card.

2. TIMETABLE — sidebar (Timetable active). Page title "Weekly
Timetable" with subtitle "View and manage class schedules", a class
selector dropdown and "Manage Periods" button top-right. Below, a row
of subject filter chips (Art & Craft, Computer Science, English,
Environmental Studies, General Knowledge, Hindi, Islamic Studies,
Mathematics). Then a weekly grid: rows = Period 1 through Period 5 plus
a visually distinct "Short Break" and "Lunch Break" row (gray
background, no click), columns = Monday through Saturday. Each cell
shows a subject name and teacher name in small text, with a subtle
colored left border per subject.

3. EDIT TIMETABLE ENTRY DRAWER — a right-side slide-in panel over the
timetable, titled "Edit Entry — Monday, Period 1" with a close icon.
Fields: Subject (select, showing a subject code chip like "ENG"),
Teacher (optional, select). Footer row: a ghost "Clear" button on the
left, Cancel + "Save" (primary) on the right.

4. NOTICE BOARD — sidebar (Notice Board active). Page title "Notice
Board" with subtitle "13 announcements posted", "+ Create Notice"
button top-right. Below, a vertical list of notice cards: each has a
priority pill top-right (High=red, Medium=orange, Low=gray), a bold
title, 2-line description, and a footer line "📅 2026-07-29 · By Samar
Ali" in small gray text, with edit/delete icons on hover.

5. REPORTS — sidebar (Reports active). Page title "Reports" with
subtitle "Live data across attendance, exams and finance". Tab bar:
Overview (active) / Attendance / Exam Results / Finance. Below: 4 stat
cards (Active Students, Active Teachers, Total Collected, Fee Pending).
Below that, a card titled "Monthly Fee Overview" with an "Export" link
top-right, containing a two-color bar chart (green=Collected,
orange=Pending) across months Jan–Dec.

Export using Tailwind CSS utility classes only (no inline styles), and
keep every section visually modular — stat cards, tables, modals, and
forms as clearly separable blocks — so each maps directly to a reusable
React + TypeScript component in a Vite project. Backend is Supabase
(Postgres + Auth + Storage), so forms should map cleanly to database
fields (no decorative-only fields).
```

---

## Batch 4 — AI Assistant, Roles & Permissions, Subject & Class, Tests & Exams, Study Materials

```
Using the same EduFlow design system, generate these 5 connected
screens:

1. AI ASSISTANT — sidebar (AI Assistant active). Page title "AI
Assistant" with a small sparkle icon, subtitle "Supercharge your school
experience with AI-powered tools". Below, a labeled "AI TOOLS" section:
a left rail with 3 selectable tool cards stacked vertically — "AI
Tutor", "Quiz Generator", "Homework Helper" (Homework Helper shown
selected, brand-colored outline). Right side: a form panel for the
selected tool titled "Homework Helper" with description "Get
step-by-step explanations for your assignments", fields "Pick from
assigned homework" (select), "Subject (optional)" (text), "Your
Question" (textarea), and a primary button "Get Help".

2. ROLES & PERMISSIONS — sidebar (Roles & Permissions active). Page
title "Roles & Permissions" with subtitle "Control what each role can
access". A role selector tab bar: Admin / Teacher / Student / Parent.
Below, permission rows grouped under module headings (e.g. "Students",
"Fees", "Attendance"), each row showing the permission name on the left
and an on/off toggle switch on the right (brand orange when on).

3. SUBJECT & CLASS ASSIGNMENT — sidebar (Subject & Class active). Page
title "Subject & Class Assignment" with subtitle "Manage subjects and
assign them to existing classes". Tab bar: Subjects (active) / Assign
Subjects / Summary. Below: "Subjects" header with count "15 subject(s)"
and a "+ Add Subject" button, then a table: Subject Name, Code,
Description, Actions (edit/delete).

4. TESTS & EXAMS — CREATE EXAM — sidebar (Tests & Exams active). Page
title "Tests & Exams" with subtitle "Schedule unit tests and
multi-subject exams for classes". Tab bar: Tests / Exams (active) /
Results. Below a section titled "Create Exam" with subtitle
"Multi-subject scheduled exam for one class", a form: Exam Title (with
placeholder "e.g. Mid-Term Examination 2025"), Exam Type (select),
Class (select), Start Date and End Date (two date pickers side by
side), Description (textarea, placeholder "Optional instructions or
notes..."), and a primary "+ Create Exam" button.

5. STUDY MATERIALS — sidebar (Study Materials active). Page title
"Study Materials" with a "+ Upload Material" button top-right. Filter
chip row: Class, Subject, Type (Notes/Video/PDF). Below, a card grid (4
columns) of material cards: a colored file-type icon top, title,
subject + class tags, uploader name, small download icon bottom-right.

Export using Tailwind CSS utility classes only (no inline styles), and
keep every section visually modular — stat cards, tables, modals, and
forms as clearly separable blocks — so each maps directly to a reusable
React + TypeScript component in a Vite project. Backend is Supabase
(Postgres + Auth + Storage), so forms should map cleanly to database
fields (no decorative-only fields).
```

---

## Batch 5 — Teacher & role-scoped screens

```
Using the same EduFlow design system, generate these 5 connected
screens for the TEACHER role (sidebar shows: Dashboard, Attendance,
Homework, Tests & Exams, Timetable, Notices, Communication, AI
Assistant, Study Materials — user avatar bottom-left shows teacher name
and "Teacher" role label):

1. TEACHER DASHBOARD — page title "Dashboard". A "Today's Classes" card
listing 3-4 period rows (time, class, subject). Beside it, 3 stat cards:
My Classes, My Students, Pending to Grade.

2. TEACHER RESULT ENTRY — sidebar (Tests & Exams active). Page title
"Tests & Exams", tab bar Tests / Exams / Results (active). A "Result
Entry" section: "Select a class and exam — all subjects load together
for bulk mark entry." Fields: Class (select, e.g. "5-B"), Source Type
(select, "Scheduled Exam"), Select Exam (select, showing "Half Yearly
Examination 2026-27"). Below, a loading row "Loading all subjects..."
with a spinner, to show the loading state.

3. COMMUNICATION (Teacher) — sidebar (Communication active). Page title
"Communication". A two-panel layout: left panel is a list of
conversations/announcements (name/class + last message preview + time),
right panel is the open thread with message bubbles and a message
composer bar at the bottom with an audience selector chip ("To: Class
5-B") and a Send button.

4. TEACHER HOMEWORK CREATE — sidebar (Homework active). A modal titled
"Add New Homework" over the homework list. Form: Title, Subject
(select); Class (select), Due Date (date picker); Description
(textarea). Footer: Cancel + "Create Assignment" primary button.

5. STUDY MATERIALS UPLOAD (Teacher) — a modal titled "Upload Study
Material". Form: Title, Subject (select), Class (select), a file
dropzone area with dashed border and an upload-cloud icon, "Drag and
drop or click to upload" text. Footer: Cancel + "Upload" primary
button.

Export using Tailwind CSS utility classes only (no inline styles), and
keep every section visually modular — stat cards, tables, modals, and
forms as clearly separable blocks — so each maps directly to a reusable
React + TypeScript component in a Vite project. Backend is Supabase
(Postgres + Auth + Storage), so forms should map cleanly to database
fields (no decorative-only fields).
```

---

## Batch 6 — Student & Parent screens

```
Using the same EduFlow design system, generate these 5 connected
screens:

1. STUDENT DASHBOARD — sidebar for STUDENT role (Dashboard, Attendance,
Homework, Tests & Exams, Notices, Communication, Report Card, Progress,
AI Assistant, Study Materials), avatar shows student name + "Student"
label. Page title "Dashboard". 4 stat cards with progress rings:
Attendance % (e.g. 88%), Points (e.g. 238), Streak Days (e.g. 14),
Rank/Percentile. Below, an "Recent Activity" list card.

2. STUDENT HOMEWORK LIST — sidebar (Homework active). Page title
"Homework". A segmented filter: All / Active / Overdue / Submitted.
Card list: each card has subject tag, title, due date, teacher name,
a status pill, and a "Submit" or "View Submission" button depending on
status.

3. STUDENT PROGRESS — sidebar (Progress active). Page title "My
Progress". A line chart card showing performance trend across terms,
with a legend for 2-3 subjects (different colors). Below, a small table
of term-wise average scores.

4. PARENT DASHBOARD — sidebar for PARENT role (Dashboard, Attendance,
Fees, Results, Notices). At the top of the sidebar, above the nav, a
"child switcher" pill showing the currently selected child's avatar +
name with a small dropdown chevron (for parents with multiple children).
Page title "Dashboard". Stat cards for the selected child: Attendance
%, Fees Due (currency, orange if pending), Latest Result (grade/%).
Below, a small attendance trend chart and a "Recent Notices" list card.

5. PARENT FEE DETAILS — sidebar (Fees active). Page title "Fee
Details". 3 stat cards: Total (blue), Paid (green), Pending (orange).
Below, an itemized list of fee terms: term name, due date, amount,
status pill, and a "Pay Now" button per pending item (opens the same
Pay Fee modal style used in the Admin batch, brand-colored primary
button "Submit Payment").

Export using Tailwind CSS utility classes only (no inline styles), and
keep every section visually modular — stat cards, tables, modals, and
forms as clearly separable blocks — so each maps directly to a reusable
React + TypeScript component in a Vite project. Backend is Supabase
(Postgres + Auth + Storage), so forms should map cleanly to database
fields (no decorative-only fields).
```

---

## After Stitch generates each batch

1. **Export → React/JSX + Tailwind** for each screen (Stitch's code export supports React/Tailwind as of the 2026 update — pick that over plain HTML/CSS so you get JSX-shaped output).
2. Drop the exported components into `src/features/<module>/components/` in your Vite project, then:
   - Replace any hardcoded sample data with real props/types.
   - Replace `<img>`/static avatars with your `AvatarInitials` component.
   - Wire form `onSubmit` handlers to Supabase (`supabase.from('students').insert(...)`, etc.).
   - Wire tables to `useQuery`/`useEffect` + Supabase `select()` calls instead of the static rows Stitch generates.
3. Keep the seed prompt's tokens (§0) as your actual `tailwind.config.ts` `theme.extend` values — that's what keeps every batch visually consistent even though they're separate Stitch generations.