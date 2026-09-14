# EDUTH — COMPLETE COLLEGE MANAGEMENT SYSTEM

## Admin ↔ Teacher ↔ Student Real-Time Data Integration & Role-Based System
do not change any tupe of ui and other function the project is propely working

You are working on my existing project **Eduth**, which is a **College Management System**, NOT a School Management System.

Your task is to properly connect the existing **Admin Panel, Teacher Panel and Student Panel** into one real, production-ready college management system using the existing backend/database architecture.

This is NOT a request to redesign the project from scratch.

The existing UI/design should be preserved as much as possible. The main objective is to make the existing panels and modules **actually connected to real backend data and to each other**.

---

# 1. MOST IMPORTANT REQUIREMENT

The entire Eduth system must have **one central source of truth**.

Admin creates/manages data.

Teacher and Student panels should automatically receive the data they are allowed to access based on their academic/role mapping.

Do NOT create separate dummy/static data for Teacher or Student panels.

Do NOT create duplicate independent records just for displaying something on another panel.

Everything must come from the same database.

The flow should be:

ADMIN
↓
College / Academic Structure
↓
Course
↓
Branch
↓
Semester
↓
Section / Class
↓
Students + Teachers
↓
Attendance / Fees / Tests / Exams / Assignments / Study Material / Notices / Progress / Reports
↓
Student & Teacher Panels

---

# 2. EXISTING UI MUST NOT BE BROKEN

Before making changes:

1. Inspect the entire existing project.
2. Understand the current routes.
3. Understand the existing components.
4. Understand the current Supabase schema.
5. Understand existing authentication.
6. Understand existing roles.
7. Understand existing RLS policies.
8. Understand existing sidebar/navigation.
9. Understand existing Admin, Teacher and Student pages.
10. Reuse existing components wherever possible.

DO NOT unnecessarily redesign existing pages.

DO NOT replace working UI with a completely different design.

DO NOT remove existing functionality unless it directly conflicts with the requirements below.

The goal is:

**Existing UI + Real Backend + Correct Relationships + Correct Permissions + Automatic Data**

---

# 3. BACKEND MUST BE THE SOURCE OF TRUTH

Use the existing **Supabase/Postgres** backend properly.

All important data must persist after:

* page refresh
* logout/login
* browser restart
* navigation
* reopening the application

There must be NO production dependency on:

* dummy arrays
* mock JSON
* hardcoded students
* hardcoded fees
* hardcoded attendance
* fake tests
* fake exams
* fake notices
* fake assignments
* fake study materials
* fake progress

If demo data already exists, clearly separate/remove it from production logic.

---

# 4. COLLEGE STRUCTURE

Eduth is a college management system.

The academic hierarchy must support:

College
→ Course
→ Branch
→ Semester
→ Section/Class
→ Students

Courses currently include:

* B.Tech
* Diploma
* MBA

Semester structure:

B.Tech:

* Semester 1–8

Diploma:

* Semester 1–6

MBA:

* Semester 1–4

Branches include:

* ECE
* CSE
* IT
* CSD
* AI/ML
* MECH
* CIVIL
* BIOTECH
* EE

Do not unnecessarily hardcode these throughout the frontend.

They should preferably come from the database/configuration structure.

---

# 5. COLLEGE ID / DATA ISOLATION

The system must maintain proper college-level isolation.

Use the existing college relationship architecture:

* internal UUID `college_id`
* human-readable unique `college_code`

Relevant records should be associated with the correct college.

A user must never be able to access another college's data.

This must be enforced at backend/database/RLS level, not merely by hiding frontend elements.

---

# 6. STUDENT ACADEMIC MAPPING

Every student must have a clear academic mapping.

At minimum:

Student
→ College
→ Course
→ Branch
→ Semester
→ Section/Class
→ Academic Year where applicable

Example:

Student:
Rahul

Course:
B.Tech

Branch:
ECE

Semester:
5

Section:
A

The system should know this automatically after the student's profile/class assignment is created.

---

# 7. TEACHER CLASS MAPPING

Every teacher must have proper class assignment.

Example:

Teacher:
Mr. Ahmed

Assigned Classes:

B.Tech
ECE
Semester 5
Section A

and possibly:

B.Tech
ECE
Semester 6
Section B

Teacher should not have to repeatedly select these filters on every page.

The system already knows the teacher's assigned classes.

---

# 8. AUTOMATIC FILTERING — CRITICAL

This is one of the most important requirements.

### STUDENT SIDE

A student should NOT have to select:

Course
Branch
Semester
Section

to see their own data.

The backend should automatically determine their academic mapping.

Example:

Student belongs to:

B.Tech → ECE → Semester 5 → Section A

When the student opens:

Study Material

the system automatically shows materials applicable to:

B.Tech → ECE → Semester 5 → Section A

No manual filter should be necessary.

The same principle applies to:

* Attendance
* Fees
* Tests
* Exams
* Notices
* Study Material
* Assignments
* Progress
* Report Card

---

# 9. TEACHER SIDE — AUTOMATIC CLASS CONTEXT

Teacher should also not repeatedly filter Course/Branch/Semester/Section.

The system should automatically identify the classes assigned to the logged-in teacher.

For example:

Teacher logs in.

Instead of:

Select Course
Select Branch
Select Semester
Select Section
Apply Filter

show:

MY CLASSES

B.Tech — ECE — Semester 5 — Section A
B.Tech — ECE — Semester 6 — Section B

Teacher selects a class only when necessary.

After selecting the class, every related page should automatically use that class context.

Do not make teachers repeat the same filters on every page.

---

# 10. STUDENT PANEL

Connect every existing Student Panel module to real Admin/backend data.

## Student Dashboard

Show real information such as:

* Student name
* Roll number
* Course
* Branch
* Semester
* Section
* Attendance summary
* Fee summary
* Upcoming tests
* Upcoming exams
* Pending assignments
* Recent notices
* Recent study materials
* Academic progress

All values must come from the database.

---

# 11. STUDENT ATTENDANCE

Student should see only their own attendance.

Attendance must be linked to the actual attendance records created/managed from the Admin/Teacher side.

Student should be able to see:

* Overall attendance
* Subject-wise attendance where available
* Present
* Absent
* Percentage
* Attendance history
* Relevant dates

Do not create separate student attendance records.

Use the same attendance records.

Teacher/Admin changes should reflect in the Student Panel.

---

# 12. ATTENDANCE TEACHER SIDE

Teacher should see students belonging only to their assigned class/classes.

Example:

Teacher assigned to:

B.Tech → ECE → Semester 5 → Section A

Then attendance should automatically show the students of that class.

Teacher can:

* Mark attendance
* View attendance
* View history
* Correct attendance where their permissions allow

Existing attendance rules and Admin-only historical editing permissions must remain respected.

Do not break the existing attendance functionality.

---

# 13. FEES — ADMIN SIDE

The Fees module must keep exactly these sections:

1. Dashboard
2. Fee Structure
3. Student Fees
4. Payment

Do NOT add the old separate "Report" section inside Fees.

The main/global Report module remains separate.

### Fees Dashboard

Should work as an overview/monitoring page.

Show information such as:

* Total fees
* Paid
* Due
* Partial
* Overdue
* Due date
* Days remaining
* Last payment
* relevant summary statistics

### Student Fees

This is detailed individual fee management.

It should include:

* Student name
* Roll number
* Course
* Branch
* Year
* Semester
* Fee structure
* Installments
* Total fee
* Paid amount
* Due amount
* Payment history

### Payment

Authorized Admin/Finance users can record/manage payments.

---

# 14. STUDENT FEES

Student should automatically see their own fee information.

No manual student filter should be required.

Example:

Student logs in.

Fees page automatically loads:

Total Fee
Paid
Due
Partial/Paid status
Installments
Payment history
Due dates

This must be based on the logged-in student's identity.

Student must NOT be able to modify financial records.

---

# 15. TEACHER FEE ACCESS — VIEW ONLY

This requirement is mandatory.

Teacher can see fee details of students who belong to the teacher's assigned classes.

Teacher can view:

* Student name
* Roll number
* Fee structure
* Total fee
* Paid amount
* Due amount
* Partial status
* Payment history
* Due information

BUT:

Teacher MUST NOT:

* edit fee structure
* edit fee amount
* edit payment
* delete payment
* collect payment
* mark payment as paid
* change payment status
* create payment
* modify financial records

There should be no working backend permission for these actions.

Simply hiding buttons is NOT sufficient.

Enforce this through Supabase RLS/backend authorization.

---

# 16. STUDY MATERIAL

Study Material must be connected between Admin/Teacher and Student.

When Admin creates material:

Example:

Course:
B.Tech

Branch:
ECE

Semester:
5

Title:
Digital Signal Processing

Subject:
DSP

Content:
PDF / Link

the appropriate students should automatically see it.

Student should NOT have to filter the material manually.

The system should determine visibility from the student's academic mapping.

If material is common for multiple relevant classes, support an appropriate common/targeting mechanism.

Do not expose material to unrelated students.

---

# 17. TEACHER STUDY MATERIAL

Teacher should be able to see/manage study material only according to their permissions and assigned classes.

If Teacher is allowed to add material:

Teacher creates material for their assigned class/class context.

Do not allow a teacher to create material for an unrelated class unless Admin has explicitly granted that permission.

---

# 18. ASSIGNMENTS

Assignments must be connected to actual classes.

Existing Assignment requirements should support:

* Course
* Branch
* Semester
* Title
* Date
* Description

Where the existing design supports Section/Class, use it for proper targeting.

Example:

Teacher creates:

DBMS Assignment
B.Tech
CSE
Semester 5
Section A

Students belonging to that class automatically see the assignment.

Student should see:

* Assignment title
* Description
* Date
* Due date where available
* Submission status
* Submission information where supported

Teacher should see assignments related to their classes and their students.

---

# 19. TEST SYSTEM

Tests must be connected to actual academic/class data.

A test should not be created for one random hardcoded class.

Test targeting should support the appropriate:

* Course
* Branch
* Semester
* Section/Class where applicable
* Subject
* Test details

After creation, the relevant students automatically see the test.

Test results/marks should feed into:

* Student Test section
* Progress
* Report Card where applicable

---

# 20. EXAM SYSTEM

Exam system should follow the same centralized architecture.

Exam creation is based on:

* Course
* Year (optional where applicable)

and the appropriate academic mapping.

Do not unnecessarily force a specific class filter if the exam is designed at course/year level.

After an exam is created:

Relevant students automatically see it.

Marks/results should connect to:

* Student Exam Result
* Progress
* Report Card
* Admin reports

---

# 21. PROGRESS

Progress must NOT be a separate dummy dashboard.

It must aggregate real academic data.

Student Progress can include:

* Attendance
* Test performance
* Exam performance
* Assignment performance where applicable
* Overall academic performance

Example:

Overall Progress
Attendance
Tests
Exams
Assignments

All numbers must be calculated from actual database records.

When Admin/Teacher updates marks or attendance, the student's progress should reflect the updated data.

---

# 22. NOTICE SYSTEM

Notice Board must be connected to Admin-created notices.

Admin can create notices and target them appropriately.

Possible targeting:

* Entire college
* Course
* Branch
* Semester
* Section/Class
* Teachers
* Students
* Other supported audience

Example:

Notice:

"ECE Semester 5 internal assessment schedule"

Target:

B.Tech → ECE → Semester 5

Only relevant users should see it.

Student should not need to manually filter notices.

Teacher should automatically see notices relevant to them and their assigned classes.

---

# 23. REPORT CARD

Report Card should use actual data.

It should connect relevant:

* Attendance
* Test results
* Exam results
* Academic information
* Financial information where the existing design requires it

Do not duplicate data unnecessarily.

Use relationships to existing records.

Reports should remain connected to the global Report module.

---

# 24. TEACHER DASHBOARD

Teacher dashboard should be based on the logged-in teacher.

It should show:

* Teacher profile
* Assigned classes
* Total assigned students
* Today's attendance-related information
* Upcoming tests
* Upcoming exams
* Assignments
* Relevant notices
* Study materials
* Student academic overview

Do NOT show unrelated college-wide student data.

---

# 25. MY STUDENTS

Teacher should have a proper "My Students" experience.

It should automatically show students belonging to the teacher's assigned class/classes.

Teacher should not have to search through all college students.

For each student, teacher can view appropriate information such as:

* Name
* Roll number
* Course
* Branch
* Semester
* Section
* Attendance
* Academic progress
* Test performance
* Exam performance
* Fee details (VIEW ONLY)

Teacher cannot access students outside their assigned classes.

---

# 26. ROLE-BASED ACCESS CONTROL

Permissions must exist at both:

1. Frontend/UI level
2. Backend/database/RLS level

Do NOT rely only on hiding buttons.

### SUPER ADMIN / ADMIN

Depending on existing role structure, authorized Admin users can manage:

* Students
* Teachers
* Classes
* Courses
* Branches
* Semesters
* Sections
* Attendance
* Fees
* Payments
* Tests
* Exams
* Assignments
* Study Material
* Notices
* Reports
* Roles & Permissions

### TEACHER

Teacher gets access only to assigned classes/students and permitted academic operations.

### STUDENT

Student gets access only to their own information and information targeted to their class/course/academic mapping.

---

# 27. SECURITY

Use Supabase RLS and proper authorization.

Examples:

Student:

Can read own fee record.

Cannot update fee record.

Teacher:

Can read fees of assigned students.

Cannot insert/update/delete payment records.

Teacher:

Can read students assigned to their classes.

Cannot read all college students.

Student:

Can read study materials targeted to their academic mapping.

Cannot read unrelated branch/semester materials.

Student:

Can read relevant notices.

Cannot modify Admin notices.

These restrictions must work even if someone directly attempts an API/database request.

---

# 28. AUTHENTICATED USER → PROFILE MAPPING

When a user logs in, the system should identify their role and associated profile.

For example:

Auth User
↓
Profile
↓
Role
↓
Student/Teacher/Admin record
↓
Academic/College mapping

Do not make the user manually select their identity after login.

A logged-in student should automatically load their student record.

A logged-in teacher should automatically load their teacher record and assigned classes.

---

# 29. DATA FLOW EXAMPLES

## Example 1 — Admin adds study material

Admin:

B.Tech → ECE → Semester 5 → Material

↓

Database stores target mapping

↓

Student logs in

↓

System checks student's:

Course + Branch + Semester + Section

↓

Matching material automatically appears.

---

## Example 2 — Teacher marks attendance

Teacher:

Assigned class = B.Tech ECE Sem 5 Section A

↓

Marks attendance

↓

Database attendance record updates

↓

Student Dashboard/Attendance updates

↓

Progress updates if attendance is part of progress.

---

## Example 3 — Admin records payment

Admin records:

Student = Rahul
Payment = ₹10,000

↓

Payment saved to database

↓

Student Fees updates

↓

Student Dashboard fee summary updates

↓

Teacher can see updated payment information if Rahul belongs to the teacher's assigned class

↓

Teacher still cannot edit/collect payment.

---

## Example 4 — Teacher creates assignment

Teacher assigned to:

B.Tech → CSE → Semester 5 → Section A

↓

Creates assignment

↓

Assignment target saved

↓

Only matching students see assignment

↓

Teacher sees submissions/status of their students.

---

## Example 5 — Admin creates notice

Admin creates notice for:

B.Tech → ECE → Semester 5

↓

All matching students/teachers automatically see it.

No manual filtering on their dashboards.

---

# 30. REMOVE UNNECESSARY FILTERS FROM STUDENT PANEL

Student panel should be personalized.

Avoid UI like:

Select Course
Select Branch
Select Semester
Apply Filter

when the student is only trying to see their own data.

Instead show:

My Attendance
My Fees
My Tests
My Exams
My Assignments
My Study Material
My Notices
My Progress

The system already knows who the student is.

---

# 31. REMOVE UNNECESSARY FILTERS FROM TEACHER PANEL

Teacher should work from:

My Classes
My Students
My Assignments
My Study Material
My Tests
My Attendance

The teacher's class assignments should automatically control what appears.

Filters can exist only where genuinely useful, such as switching between multiple assigned classes.

Do NOT force teachers to repeatedly select the same Course/Branch/Semester/Section on every page.

---

# 32. DO NOT BREAK EXISTING ADMIN PANEL

The Admin Panel remains the central management system.

Existing Admin modules and their UI should remain intact unless a change is necessary for proper integration.

When Admin adds/edits/deletes a record:

the change must propagate correctly to the relevant Teacher/Student views.

---

# 33. CRUD MUST BE REAL

For every module that supports CRUD:

Create
Read
Update
Delete

must actually communicate with Supabase.

After CRUD:

* refresh page
* logout
* login again

and verify that the data remains correct.

No fake success messages.

If a database operation fails, show the real appropriate error state.

---

# 34. LOADING / ERROR / EMPTY STATES

Every connected page should properly handle:

* Loading
* Empty state
* Error state
* Success state

Do not show a blank white page.

Do not silently fail.

Do not use fake loading forever.

Do not display incorrect data while a query is loading.

---

# 35. DATABASE RELATIONSHIPS

Before writing new code, inspect the existing schema.

Reuse existing tables where they are correct.

Only create/modify tables when necessary.

Maintain proper foreign-key relationships.

Avoid duplicate versions of the same entity.

Important relationships should conceptually follow:

College
→ Users/Profiles
→ Students
→ Teachers
→ Courses
→ Branches
→ Semesters
→ Sections
→ Academic assignments
→ Attendance
→ Fees
→ Payments
→ Tests
→ Test Results
→ Exams
→ Exam Results
→ Assignments
→ Study Materials
→ Notices

Do not blindly create duplicate tables if equivalent tables already exist.

---

# 36. SUPABASE RLS

Inspect all current RLS policies.

Do not assume existing policies are correct.

Verify:

* Admin access
* Teacher access
* Student access
* College isolation
* Fee restrictions
* Payment restrictions
* Attendance restrictions
* Test restrictions
* Exam restrictions
* Assignment restrictions
* Study material restrictions
* Notice restrictions

Make sure policies work with authenticated users.

Do not solve an RLS problem by disabling RLS.

Do not expose service-role credentials to the frontend.

---

# 37. EXISTING AUTHENTICATION MUST REMAIN STABLE

Do not break:

* Login
* Logout
* Session handling
* Role detection
* Profile loading
* Existing authentication flows

If there is an existing authentication issue, fix it carefully without breaking other roles.

After login:

Admin → Admin Panel

Teacher → Teacher Panel

Student → Student Panel

according to the existing role architecture.

---

# 38. UI RULES

Keep the existing Eduth visual identity.

Do not unnecessarily change:

* Sidebar structure
* Cards
* Buttons
* Typography
* Spacing
* Existing layouts
* Existing navigation
* Existing theme

Only make UI changes required to support the new functionality.

If a page currently looks correct, keep it.

Focus on functionality and data integration.

---

# 39. IMPORTANT — DO NOT MAKE A FRONTEND-ONLY SOLUTION

Do NOT do this:

```text
Frontend:
if role === teacher
show fee
hide edit button
```

and consider the task complete.

The backend must also enforce:

Teacher = read-only fee access.

Similarly:

Student = own data only.

Teacher = assigned students only.

Admin = authorized management access.

---

# 40. TEST THE COMPLETE DATA FLOW

After implementation, test the system using realistic scenarios.

### TEST A — STUDENT

Create/identify:

B.Tech
ECE
Semester 5
Section A
Student A

Then create:

Study Material
Assignment
Notice
Test
Exam
Attendance
Fee

for that academic mapping.

Login as Student A.

Verify everything appears automatically.

No manual filtering should be necessary.

---

### TEST B — UNRELATED STUDENT

Create Student B:

B.Tech
CSE
Semester 5
Section A

Login as Student B.

Verify that ECE-only material/assignment/notice/test/etc. does NOT appear.

---

### TEST C — TEACHER

Assign Teacher A to:

B.Tech
ECE
Semester 5
Section A

Login as Teacher A.

Verify Teacher A automatically sees:

* assigned class
* assigned students
* attendance
* assignments
* study material
* tests
* exams
* progress
* relevant notices
* student fee details

---

### TEST D — TEACHER FEE SECURITY

Login as Teacher A.

Open assigned student's Fees.

Verify:

Teacher CAN VIEW.

Teacher CANNOT:

* edit
* delete
* collect
* create payment
* modify payment status

Attempt the backend/API operation as well.

It must be rejected.

---

### TEST E — DATA PERSISTENCE

Create/update records.

Refresh.

Logout.

Login again.

Verify records remain correct.

---

# 41. PERFORMANCE

Avoid unnecessary database queries.

Do not fetch all students/materials/fees and then filter everything in React.

Prefer backend queries that return only the records the user is allowed to access.

Avoid N+1 query patterns.

Use proper indexes for frequently queried relationships such as:

* college_id
* student_id
* teacher_id
* course_id
* branch_id
* semester
* section_id

where appropriate.

---

# 42. FINAL IMPLEMENTATION STANDARD

The finished Eduth application should behave like a real college ERP/CMS.

ADMIN manages the system.

TEACHER manages/monitors only their assigned academic responsibilities.

STUDENT sees their own academic and financial information plus the content relevant to their class.

Nobody should have to repeatedly filter themselves into their own class.

The system should already know:

WHO the user is
+
WHICH college they belong to
+
WHAT role they have
+
WHICH course/branch/semester/section they belong to
+
WHICH classes a teacher is assigned to

and use that information automatically.

---

# 43. BEFORE CODING

First inspect the entire existing codebase.

Identify:

* current routes
* current components
* current pages
* current Supabase client
* current database schema
* current auth flow
* current role system
* current RLS
* current Admin panel
* current Teacher panel
* current Student panel
* existing Attendance implementation
* existing Fees implementation
* existing Test/Exam implementation
* existing Notice implementation
* existing Study Material implementation
* existing Assignment implementation
* existing Report implementation

Then make a plan based on the EXISTING architecture.

Do not blindly replace working code.

---

# 44. IMPLEMENTATION APPROACH

Implement in a safe order:

### STEP 1

Understand existing architecture.

### STEP 2

Fix/confirm core College + User + Role + Academic mapping.

### STEP 3

Connect Student identity to their academic record.

### STEP 4

Connect Teacher identity to assigned classes.

### STEP 5

Connect Student Dashboard.

### STEP 6

Connect Attendance.

### STEP 7

Connect Fees.

### STEP 8

Connect Study Material.

### STEP 9

Connect Assignments.

### STEP 10

Connect Tests.

### STEP 11

Connect Exams.

### STEP 12

Connect Notices.

### STEP 13

Connect Progress.

### STEP 14

Connect Report Card/Reports.

### STEP 15

Implement and verify RLS/permissions.

### STEP 16

Remove unnecessary Student/Teacher filters.

### STEP 17

Test all roles and data flows.

---

# 45. FINAL RULE

Do not tell me that the system is "connected" merely because the pages load.

It is considered complete only when:

ADMIN CREATES DATA
↓
DATA IS SAVED IN SUPABASE
↓
DATABASE RELATIONSHIP IDENTIFIES THE TARGET USERS
↓
TEACHER/STUDENT LOGS IN
↓
CORRECT DATA AUTOMATICALLY APPEARS
↓
PERMISSIONS ARE ENFORCED
↓
UPDATES ARE REFLECTED
↓
REFRESH/RELOGIN DOES NOT LOSE DATA

The goal is a **real, interconnected, production-ready Eduth College Management System**, not a collection of visually connected pages.

Do not compromise existing working functionality or UI while implementing this integration.
