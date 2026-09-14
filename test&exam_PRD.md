============================================================
COLLEGE MANAGEMENT SYSTEM
TEST & EXAM MODULE — COMPLETE IMPLEMENTATION
============================================================

You are working on an EXISTING College Management System.

The Test & Exam module currently needs to be upgraded into a complete,
professional, production-style college examination management system.

FINAL SIDEBAR STRUCTURE — EXACTLY 7 SECTIONS:

1. Dashboard
2. Exam
3. Exam Schedule
4. Marks Entry
5. Exam Result
6. Publish Result
7. Result Analysis

IMPORTANT:
Do not add unnecessary extra sidebar sections.

Do NOT add:
- Admit Card as a separate sidebar item
- Marksheet as a separate sidebar item
- Report as a separate sidebar item
- Re-Exam as a separate sidebar item

If required, those features can be available through actions inside the relevant sections.

============================================================
1. MOST IMPORTANT UI RULE
============================================================

The existing College Management System already has an established UI/design.

DO NOT redesign the entire application.

Preserve the existing:
- Theme
- Colors
- Sidebar
- Header
- Typography
- Cards
- Tables
- Buttons
- Icons
- Dropdown style
- Modal style
- Form style
- Spacing
- Border radius
- Responsive behavior
- Navigation structure

The new Test & Exam module should look like it belongs to the SAME application.

Create a GOOD, CLEAN, PROFESSIONAL college-management UI, but follow the existing design language.

Do NOT introduce a completely different visual style.

If an existing component can be reused, reuse it.

============================================================
2. SUPABASE IS THE REAL BACKEND
============================================================

This module MUST be fully connected to Supabase.

Do NOT use:
- Dummy exam data
- Static arrays
- Hardcoded students
- Hardcoded marks
- Hardcoded results
- Hardcoded dashboard statistics
- LocalStorage as the primary database
- Fake API responses

Supabase must be the SINGLE SOURCE OF TRUTH.

Every operation must persist in Supabase.

The system must work after:
- Refresh
- Logout/login
- Reopening browser
- Different devices

============================================================
3. FIRST INSPECT EXISTING PROJECT
============================================================

Before modifying code:

Inspect the existing project.

Understand:

- React architecture
- Routes
- Components
- Hooks
- Supabase client
- Authentication
- Profiles
- Roles
- College structure
- Students
- Teachers
- Courses
- Branches
- Classes
- Semesters
- Existing Reports
- Existing permissions
- Existing RLS policies

DO NOT create duplicate tables if equivalent tables already exist.

Reuse existing:
- students
- teachers
- classes
- courses
- branches
- semesters
- colleges
- profiles/users

where appropriate.

============================================================
4. MULTI-COLLEGE SUPPORT
============================================================

This is a multi-college system.

Every examination record must belong to:

college_id

The current target demo college is:

RRIMT

college_id:

13695a78-0105-4bde-bc85-d664bb66637e

Do NOT modify examination data belonging to other colleges.

College A Admin must never see:

- College B exams
- College B schedules
- College B marks
- College B results

All college isolation must be enforced at database/RLS level.

Do not rely only on frontend filtering.

============================================================
5. ACADEMIC STRUCTURE
============================================================

Courses:

B.Tech
Diploma
MBA

B.Tech:
Years:
1st Year
2nd Year
3rd Year
4th Year

Semesters:
1–8

Diploma:
Years:
1st Year
2nd Year
3rd Year

Semesters:
1–6

MBA:
Years:
1st Year
2nd Year

Semesters:
1–4

Branches should use the existing normalized branch data.

Examples:

B.Tech:
ECE
CSE
IT
CSD
AI/ML
MECH
CIVIL
BIOTECH
EE

Diploma:
Civil
ME
IT
CS
EE
EC

MBA:
Finance
Marketing
HR
International Business
Business Analytics

Do not hardcode branch values in multiple frontend files.

Use the existing database/source of truth.

============================================================
6. EXAMINATION DATA MODEL
============================================================

If equivalent tables do not already exist, create a proper normalized structure.

Do NOT create one giant table containing everything.

Recommended logical entities:

------------------------------------------
EXAMS
------------------------------------------

exam_id
college_id
exam_name
exam_type
course
branch
year
semester
academic_session
start_date
end_date
description
status
created_by
created_at
updated_at

Exam types can include:

- Test
- Sessional
- PUT
- Mid Term
- End Semester

Use existing terminology if the current UI already defines exam types.

Status can include:

- Draft
- Scheduled
- Ongoing
- Completed
- Results Pending
- Published

------------------------------------------
EXAM SUBJECTS / PAPERS
------------------------------------------

exam_subject_id
exam_id
subject_name
subject_code
course
branch
year
semester
exam_date
start_time
end_time
room_number
maximum_marks
passing_marks
created_at
updated_at

------------------------------------------
EXAM MARKS
------------------------------------------

mark_id
college_id
exam_id
exam_subject_id
student_id
maximum_marks
obtained_marks
grade
grade_point
remarks
entered_by
created_at
updated_at

------------------------------------------
EXAM RESULTS
------------------------------------------

result_id
college_id
exam_id
student_id
total_marks
obtained_marks
percentage
grade
result_status
published
published_at
created_at
updated_at

IMPORTANT:

If the existing database already has equivalent tables,
adapt the implementation to those tables instead of creating duplicates.

============================================================
7. DASHBOARD
============================================================

Create a professional Exam Dashboard.

Do not overload it.

Show real-time data from Supabase.

Possible summary cards:

- Total Exams
- Upcoming Exams
- Ongoing Exams
- Completed Exams
- Results Pending
- Published Results

Use actual database calculations.

No hardcoded values.

Below the cards, show useful information such as:

Upcoming Exams

Columns:

Exam
Exam Type
Course
Branch
Year
Semester
Date
Status
Action

Also show:

Recent Exams

with existing UI style.

Dashboard should help Admin understand the current examination situation immediately.

============================================================
8. EXAM SECTION
============================================================

This section is for creating and managing examinations.

Admin should be able to:

- Create Exam
- View Exam
- Edit Exam
- Delete Exam where safe
- Search Exam
- Filter Exam
- Manage exam subjects/papers

Exam creation should support:

Exam Name
Exam Type
Course
Branch
Year
Semester
Academic Session
Start Date
End Date
Description

Then add subjects/papers.

For each subject:

Subject Name
Subject Code
Exam Date
Start Time
End Time
Room Number
Maximum Marks
Passing Marks

Example:

B.Tech
ECE
2nd Year
Semester 3

Sessional Exam

Subject:
Digital Electronics

Date:
15 Sep 2026

Time:
10:00 AM – 11:00 AM

Max Marks:
30

Passing:
12

============================================================
9. EXAM FILTERING
============================================================

Filters should work using real database data.

Recommended:

Course
→ Branch
→ Year
→ Semester
→ Academic Session
→ Exam Type
→ Status

Do not load unrelated data and simply hide it on frontend.

Query the appropriate Supabase records.

Dependent filters should behave properly.

Example:

Select B.Tech

→ only B.Tech branches

Select ECE

→ only ECE years/classes

Select 2nd Year

→ only relevant semester/exam data

============================================================
10. EXAM SCHEDULE
============================================================

Create a dedicated:

Exam Schedule

section.

Purpose:

Manage and view complete examination timetable/date sheet.

Show:

- Exam
- Subject
- Subject Code
- Course
- Branch
- Year
- Semester
- Exam Date
- Start Time
- End Time
- Room
- Status

Allow Admin to:

- Add schedule
- Edit schedule
- Delete schedule
- Filter schedule
- Search schedule
- Sort schedule

Do NOT duplicate schedule data unnecessarily.

The schedule should use the subject/paper records connected to the exam.

============================================================
11. MARKS ENTRY
============================================================

This is one of the most important modules.

Create a clean marks-entry workflow.

Flow:

Select Course
→ Branch
→ Year
→ Semester
→ Exam
→ Subject

After selection:

Load ONLY students belonging to that class/course/branch/year/semester.

Display:

Serial No
Roll Number
Student Name
Maximum Marks
Obtained Marks
Grade
Remarks

Example:

1
BT24ECE001
Rahul Kumar
30
24
A
Good

Marks must be manually entered by authorized Admin.

Do NOT show students from unrelated classes.

============================================================
12. MARK VALIDATION
============================================================

Validate marks.

Obtained marks:

>= 0

and:

<= Maximum Marks

Do not allow:

- Negative marks
- Marks above maximum
- Invalid student
- Wrong exam
- Wrong subject

Show proper validation messages.

Do not silently save invalid marks.

============================================================
13. MARKS SAVE
============================================================

When Admin clicks Save:

Store marks in Supabase.

Use:

college_id
exam_id
exam_subject_id
student_id

to maintain correct relationships.

Prevent duplicate mark records for:

College
+
Exam
+
Subject
+
Student

If marks already exist:

Update them rather than creating duplicates.

Use an appropriate unique constraint or upsert strategy.

After saving:

- Show success message
- Refresh data correctly
- Data must remain after page refresh

============================================================
14. EXAM RESULT
============================================================

Exam Result is for viewing/managing calculated results.

Results should be generated from actual marks.

Do NOT manually hardcode total/percentage.

For a student:

Total Marks =
sum of subject maximum marks

Obtained Marks =
sum of obtained marks

Percentage:

Obtained Marks / Total Maximum Marks × 100

Example:

Obtained:
420

Maximum:
500

Percentage:
84%

Calculate dynamically.

============================================================
15. RESULT STATUS
============================================================

Determine result status according to configured passing marks.

Possible:

- Pass
- Fail
- Absent
- Pending

Use subject-level marks where applicable.

If required, a student fails if they fail one or more required subjects.

Do not hardcode a universal rule if the existing college configuration supports another rule.

============================================================
16. GRADE CALCULATION
============================================================

Grade calculation should be centralized.

Do NOT write separate grade logic in multiple React components.

Use one consistent grading rule.

If the college has configurable grading rules, support them.

Otherwise use a sensible centralized default.

Example:

90–100 = A+
80–89 = A
70–79 = B+
60–69 = B
50–59 = C
40–49 = D
Below 40 = F

IMPORTANT:

Do not blindly apply this if an existing grading system already exists in the project.

Reuse existing grading logic if available.

============================================================
17. EXAM RESULT UI
============================================================

Show professional result table.

Possible columns:

Roll Number
Student
Course
Branch
Year
Semester
Total Marks
Obtained Marks
Percentage
Grade
Result Status
Action

Action can include:

- View Result
- View Details
- Download/Print Result where existing UI supports it

Do not create a separate Result/Marksheet sidebar item.

============================================================
18. PUBLISH RESULT
============================================================

Publishing is separate from calculating results.

Result lifecycle:

Marks Entry
↓
Result Generated
↓
Admin Reviews
↓
Publish Result
↓
Student/Parent Can View

Before publishing:

Student/Parent must NOT see unpublished results.

Admin can:

- Review results
- Select result
- Publish result
- Publish multiple results
- View publication status

Show:

Draft
Published

where appropriate.

Store:

published
published_at
published_by

in the database.

============================================================
19. UNPUBLISH / EDIT SAFETY
============================================================

If the existing permission system allows unpublishing:

Admin can unpublish.

Otherwise do not expose it.

If marks are changed after publishing:

The system must handle result consistency safely.

Do not leave an old published result while marks have changed without recalculation.

============================================================
20. STUDENT RESULT ACCESS
============================================================

Student can only view their OWN result.

Student must NOT be able to:

- Enter marks
- Edit marks
- Delete marks
- Publish results
- View another student's result

RLS must enforce this.

Frontend hiding is NOT enough.

============================================================
21. PARENT RESULT ACCESS
============================================================

Parent is linked to exactly one student.

Parent can only view the linked student's:

- Results
- Marks
- Percentage
- Grade
- Result status

Only PUBLISHED results should be visible to Parent.

Parent must NOT see another student's result.

Use actual parent → student relationship.

Do not hardcode student ID.

Enforce using Supabase RLS.

============================================================
22. TEACHER ACCESS
============================================================

Follow the existing Roles & Permissions system.

Do NOT automatically give Teachers Admin examination permissions.

If teachers are allowed to enter marks in the current system:

They should only be allowed for their assigned classes/subjects.

Teacher must NOT access unrelated classes or students.

Backend/RLS must enforce this.

If only Admin is currently allowed to enter marks, preserve that behavior.

============================================================
23. RESULT ANALYSIS
============================================================

Create a professional Result Analysis section.

This is for Admin/authorized users.

Use actual Supabase marks/results.

Show:

Overall:
- Total Students
- Appeared
- Passed
- Failed
- Pass Percentage
- Class Average
- Highest Marks
- Lowest Marks

Subject-wise:

- Subject
- Students Appeared
- Average Marks
- Highest
- Lowest
- Pass %
- Fail %

Grade distribution:

- A+
- A
- B+
- B
- C
- D
- F

Use charts/visualizations only if they fit the existing UI design.

Do NOT over-design the page.

All numbers must come from real data.

============================================================
24. RESULT ANALYSIS FILTERS
============================================================

Filters:

Course
Branch
Year
Semester
Exam
Subject

Selecting filters must update all statistics.

Example:

B.Tech
ECE
2nd Year
Semester 3
Sessional Exam

should analyze only that dataset.

Do not mix students from other branches/classes.

============================================================
25. EXAM SCHEDULE CONSISTENCY
============================================================

Avoid duplicate schedules.

Prevent:

same exam
+
same subject
+
same date/time
+
same class

from being inserted accidentally.

If a room/time conflict is detectable, show a warning.

Do not silently overwrite unrelated schedules.

============================================================
26. STUDENT RELATIONSHIP
============================================================

Use the existing student records.

Do NOT create a second student table just for exams.

Use:

student_id

connected to the existing Students table.

Student's:

- Course
- Branch
- Year
- Semester
- Class

must come from actual student/class data.

============================================================
27. CLASS RELATIONSHIP
============================================================

Use actual class relationships.

When an exam is created for:

B.Tech
ECE
2nd Year
Semester 3

only students belonging to that academic group/class should appear in Marks Entry.

Do NOT assume a fixed number of students.

If there are:

5 students
12 students
45 students
60 students

load exactly that many actual students.

============================================================
28. DATABASE SECURITY / RLS
============================================================

Implement proper Supabase RLS.

Every examination table must respect:

college_id

Admin:
Own college examination management.

Teacher:
Only authorized classes/subjects if permitted.

Student:
Own published results only.

Parent:
Linked student's published results only.

Super Admin:
Global college management according to existing architecture.

Never use insecure policies such as:

USING (true)

for protected exam data.

Do not disable RLS.

Do not expose service-role keys to frontend.

============================================================
29. ROLE SECURITY
============================================================

Never determine authorization from:

- Email
- Frontend route
- URL
- LocalStorage role
- Hidden buttons

Use authenticated profile/role and database authorization.

Even if a Student manually changes:

/student/exam-result

to another route or manipulates student_id,

they must still be unable to access another student's data.

============================================================
30. COLLEGE ISOLATION TEST
============================================================

Test:

College A Admin
→ creates Exam A

College B Admin
→ must NOT see Exam A.

College B creates Exam B.

College A
→ must NOT see Exam B.

This must work at database level.

============================================================
31. AUDIT INFORMATION
============================================================

Where appropriate, maintain:

created_by
updated_by
published_by
created_at
updated_at
published_at

This is useful for college administration.

Do not add unnecessary fields to UI unless required.

============================================================
32. DELETE SAFETY
============================================================

Deleting an exam must not accidentally delete:

- Students
- Teachers
- Classes
- Attendance
- Fees
- Study Material
- Assignments
- Parents

Handle foreign-key relationships safely.

If marks/results/schedules depend on an exam, either:

- prevent unsafe deletion
OR
- delete only the related exam records in a controlled transaction

according to the existing application's behavior.

============================================================
33. LOADING / ERROR / EMPTY STATES
============================================================

Every section must handle:

Loading
Empty
Error
Success

Examples:

No exams found.

No students found for this class.

No marks entered yet.

No published results.

No analysis data available.

Do not show blank white pages.

Use the existing application's loading/error UI style.

============================================================
34. SEARCH
============================================================

Where the existing UI contains search:

Search real database data.

For students, allow search by:

- Name
- Roll Number

Do not search only the currently hardcoded frontend array.

============================================================
35. RESPONSIVE DESIGN
============================================================

The module must remain responsive.

Desktop:
Full tables and dashboard.

Smaller screens:
Use the existing responsive behavior/components.

Do NOT introduce horizontal overflow unnecessarily.

============================================================
36. PERFORMANCE
============================================================

Do not fetch the entire college database unnecessarily.

Use appropriate:

- filters
- joins
- pagination
- indexed columns
- selective queries

especially for:

- students
- marks
- results
- analysis

============================================================
37. DATABASE INDEXES
============================================================

Where appropriate, create indexes for frequently queried fields such as:

college_id
exam_id
student_id
course
branch
year
semester
academic_session
exam_date

Do not create redundant indexes.

============================================================
38. TRANSACTION / CONSISTENCY
============================================================

Operations involving multiple related records should be handled safely.

For example:

Publishing results should not partially publish only some records due to an error.

Marks update and result recalculation must remain consistent.

Use Supabase RPC/database functions where appropriate.

Do not try to simulate database transactions purely in React.

============================================================
39. EXISTING REPORT MODULE
============================================================

Do NOT create a new "Report" sidebar section under Test & Exam.

The existing MAIN Report module must remain unchanged.

If exam reports are later required, integrate them into the existing Report module.

Do not duplicate the Report navigation.

============================================================
40. ADMIT CARD / MARKSHEET
============================================================

Do NOT create separate sidebar sections.

If needed:

Exam Schedule / Exam section can provide:

Generate Admit Card

Exam Result can provide:

View Result
Print Result
Download Marksheet

Only add these as actions if they fit the existing UI.

============================================================
41. FINAL SIDEBAR
============================================================

The final Test & Exam sidebar MUST contain exactly:

Dashboard
Exam
Exam Schedule
Marks Entry
Exam Result
Publish Result
Result Analysis

No additional Test & Exam sidebar items.

============================================================
42. END-TO-END WORKFLOW
============================================================

The complete system should work like this:

ADMIN:

Dashboard
↓
Exam
↓
Create Exam
↓
Add Subjects/Papers
↓
Exam Schedule
↓
Schedule exam dates/times/rooms
↓
Marks Entry
↓
Select Course/Branch/Year/Semester
↓
Select Exam
↓
Select Subject
↓
Load actual students
↓
Enter marks
↓
Save
↓
Exam Result
↓
Generate/calculate result
↓
Review
↓
Publish Result
↓
Student/Parent can view published result
↓
Result Analysis
↓
Analyze actual performance

============================================================
43. DATA FLOW
============================================================

Exam:

Supabase
↓
Exam

Schedule:

Exam
↓
Exam Subject/Paper
↓
Schedule

Marks:

Exam
+
Subject
+
Student
↓
Exam Marks

Result:

Exam Marks
↓
Calculation
↓
Exam Result

Publish:

Exam Result
↓
published = true
↓
Student/Parent access

Analysis:

Exam Marks / Results
↓
Aggregations
↓
Dashboard/Charts/Statistics

Do not maintain unrelated duplicate data.

============================================================
44. IMPORTANT CALCULATION RULE
============================================================

Never hardcode:

- Student count
- Exam count
- Marks
- Percentage
- Pass percentage
- Average
- Highest
- Lowest
- Grade distribution

Everything must be calculated from actual Supabase records.

============================================================
45. UI QUALITY
============================================================

The new module should feel like a professional college ERP.

Use:

- Clear hierarchy
- Clean cards
- Proper spacing
- Consistent tables
- Good filters
- Clear status badges
- Useful actions
- Proper empty states
- Proper validation
- Professional confirmation dialogs

BUT:

Do not introduce a completely different design language.

Follow the existing application UI.

============================================================
46. NO FUNCTIONALITY BREAKING
============================================================

Do NOT break existing:

- Authentication
- Super Admin
- Admin
- Teacher
- Student
- Parent
- Attendance
- Fees
- Study Material
- Assignment
- Timetable
- Notice
- Report
- Roles & Permissions

Before modifying shared components, check their usage across the project.

============================================================
47. IMPLEMENTATION PROCESS
============================================================

Follow this order:

STEP 1:
Inspect existing frontend.

STEP 2:
Inspect existing Supabase schema.

STEP 3:
Inspect existing RLS.

STEP 4:
Identify reusable tables/components.

STEP 5:
Create/update database schema only where required.

STEP 6:
Create proper relationships and constraints.

STEP 7:
Create RLS policies.

STEP 8:
Connect Exam section.

STEP 9:
Connect Exam Schedule.

STEP 10:
Connect Marks Entry.

STEP 11:
Connect Exam Result.

STEP 12:
Connect Publish Result.

STEP 13:
Connect Result Analysis.

STEP 14:
Connect Dashboard statistics.

STEP 15:
Test role permissions.

STEP 16:
Test college isolation.

STEP 17:
Test refresh persistence.

STEP 18:
Test complete end-to-end workflow.

============================================================
48. TEST CHECKLIST
============================================================

Test all of the following:

[ ] Admin can create exam.

[ ] Exam saves to Supabase.

[ ] Exam remains after refresh.

[ ] Admin can add subjects.

[ ] Schedule saves correctly.

[ ] Marks Entry loads only correct students.

[ ] Marks can be saved.

[ ] Existing marks are updated instead of duplicated.

[ ] Invalid marks are rejected.

[ ] Exam Result calculates correctly.

[ ] Percentage is correct.

[ ] Grade is correct.

[ ] Pass/Fail is correct.

[ ] Result can be published.

[ ] Published result remains after refresh.

[ ] Student sees own published result.

[ ] Student cannot see another student's result.

[ ] Student cannot edit marks.

[ ] Parent sees only linked student's published result.

[ ] Parent cannot access another student's result.

[ ] Teacher access follows assigned class/permission.

[ ] Result Analysis shows real statistics.

[ ] Filters work.

[ ] Search works.

[ ] Dashboard statistics are dynamic.

[ ] College A cannot access College B data.

[ ] RLS protects all relevant tables.

[ ] No dummy data remains.

[ ] No hardcoded statistics remain.

[ ] Existing UI is preserved.

[ ] Existing application functionality still works.

============================================================
49. FINAL ACCEPTANCE CRITERIA
============================================================

The Test & Exam module will be considered COMPLETE only when:

1. All 7 sections exist:

Dashboard
Exam
Exam Schedule
Marks Entry
Exam Result
Publish Result
Result Analysis

2. Every section is connected to Supabase.

3. No dummy data is used.

4. No hardcoded calculations are used.

5. Admin can manage examinations end-to-end.

6. Marks are connected to actual students.

7. Results are calculated from actual marks.

8. Publishing controls student/parent visibility.

9. Student sees only own published result.

10. Parent sees only linked student's published result.

11. Teacher access follows class/permission rules.

12. College isolation is enforced.

13. RLS is properly implemented.

14. Data survives refresh/login/logout.

15. Duplicate records are prevented.

16. Existing application UI/design is preserved.

17. Existing application functionality is not broken.

18. Existing MAIN Report module remains untouched.

============================================================
FINAL INSTRUCTION
============================================================

Do NOT treat this as a frontend-only task.

This is a complete College Management System backend integration task.

The implementation must work across:

UI
↓
React
↓
Supabase Client
↓
Supabase Database
↓
Relationships
↓
RLS
↓
Authentication
↓
Role Authorization
↓
Persistent Data

Before declaring the feature complete, actually verify the complete workflow with real Supabase data.

Do not say "implemented" simply because the UI renders.

The feature must actually save, retrieve, calculate, secure, and persist real data.