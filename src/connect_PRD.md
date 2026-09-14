I WANT YOU TO AUDIT, FIX AND FULLY CONNECT THE FOLLOWING MODULES IN MY COLLEGE MANAGEMENT SYSTEM:

1. Attendance
2. Assignment
3. Fees
4. Test & Exam
5. Notice
6. Progress
7. Reports
8. History
9. Study Material

============================================================
🚨 MOST IMPORTANT RULE — DO NOT CHANGE THE UI
============================================================

THIS IS A FUNCTIONALITY + DATA + PERMISSION + DATABASE INTEGRATION TASK.

DO NOT REDESIGN THE UI.

DO NOT CHANGE:

- Existing layouts
- Existing cards
- Existing tables
- Existing colors
- Existing fonts
- Existing buttons
- Existing icons
- Existing sidebar design
- Existing header
- Existing spacing
- Existing responsive design
- Existing modals
- Existing filters
- Existing navigation style
- Existing Progress UI
- Existing History UI
- Existing Reports UI

The current UI must remain visually the same.

Only fix/add the minimum controls or data connections that are absolutely required for functionality.

Do not rebuild working pages from scratch.

Before changing anything, inspect the current implementation and reuse existing components, stores, database tables and APIs wherever possible.

============================================================
GLOBAL DATA + SECURITY RULE
============================================================

Supabase must remain the SINGLE SOURCE OF TRUTH.

Do NOT use:

- Hardcoded data
- Dummy data
- Mock students
- Static attendance
- Fake fees
- Fake marks
- Fake notices
- Fake assignments
- Fake progress
- Fake reports
- localStorage as the main database

All information must come from actual Supabase records.

All access restrictions MUST be enforced through Supabase RLS/backend.

Do NOT rely only on hiding things from the frontend.

College isolation must remain active.

College A must never access College B data.

============================================================
ROLE DEFINITIONS
============================================================

ADMIN:
Full management within own college.

TEACHER:
Only assigned class/classes.

STUDENT:
Only their own information.

PARENT:
Only their linked child's information.

Never identify access only using name/email.
Use actual IDs and relationships such as:

college_id
student_id
teacher_id
class_id
etc.

============================================================
1. ATTENDANCE SYSTEM
============================================================

Make Attendance fully functional.

ADMIN:

Admin can manage attendance for ALL classes in their college.

Admin can:

- Select Course
- Branch
- Year
- Semester
- Section/Class
- Date
- Students
- Mark Present/Absent
- Edit attendance where permitted
- View attendance history
- View date-wise attendance
- View percentage

TEACHER:

Teacher can manage attendance ONLY for their assigned class/classes.

Teacher must NOT access attendance of unrelated classes.

STUDENT:

Student can see ONLY their own attendance.

PARENT:

Parent can see ONLY their linked student's attendance.

============================================================
ATTENDANCE DATA
============================================================

Attendance must be saved automatically in Supabase.

Every attendance record should be associated with the correct:

- college_id
- student_id
- class/course
- branch
- year
- semester
- section
- date
- attendance status
- marked_by
- timestamps

Do not create duplicate attendance records for the same student/date/class/lecture where the existing system defines uniqueness.

If attendance already exists for a date, load the existing record instead of creating another record unnecessarily.

============================================================
DATE-WISE ATTENDANCE
============================================================

In Student Attendance panel:

Student should be able to see:

Date
Status
Present/Absent
Percentage

Example:

01 Sep → Present
02 Sep → Present
03 Sep → Absent
04 Sep → Present

Also show the existing attendance percentage UI/calculation.

Do NOT change the existing UI design.

Only connect it properly to actual database data.

Parent Attendance panel should show the SAME type of date-wise attendance for the linked child.

Student and Parent should NEVER see another student's attendance.

============================================================
ATTENDANCE PERCENTAGE
============================================================

Calculate attendance from actual attendance records.

Do NOT hardcode percentage.

If:

Total working/recorded attendance days = 20
Present = 17

Percentage should be calculated from actual records.

Use the existing application's attendance calculation rules if already implemented.

Do not create a second attendance calculation system.

============================================================
2. ASSIGNMENT SYSTEM
============================================================

Make Assignment fully functional for:

ADMIN
TEACHER
STUDENT

ADMIN:

Admin can create an assignment for a specific academic class.

Assignment can target:

Course
Branch
Year
Semester
Section/Class
Subject where applicable

Once created for a specific class:

ONLY students belonging to that class should see it.

Example:

Assignment:

Course = B.Tech
Branch = ECE
Year = 2nd Year
Semester = 3
Section = A

Then ONLY B.Tech ECE 2nd Year Semester 3 Section A students should see it.

Students from:

CSE
IT
other semester
other section
other course

must NOT see it.

============================================================
TEACHER ASSIGNMENT
============================================================

Teacher can create/give assignments ONLY for their assigned class/classes.

Teacher must NOT create assignments for unrelated classes.

Teacher should automatically see assignments relevant to their assigned class/classes.

Teacher-created assignment should be saved in the same central Assignment system.

Do NOT create:

teacher_assignments
student_assignments
admin_assignments

separate systems if an existing assignment table can be reused.

============================================================
STUDENT ASSIGNMENT
============================================================

Student should automatically see only assignments applicable to their:

college
course
branch
year
semester
section/class

Student must not see assignments belonging to another class.

Make sure existing assignment functionality such as:

- View
- Details
- Due date
- Description
- Submission if already implemented

continues working.

Do NOT change the existing Assignment UI.

============================================================
3. FEES SYSTEM
============================================================

Fees must work as one centralized system.

ADMIN:

Admin can:

- Manage fee structure
- View student fees
- Collect/record payment
- View payment history
- Edit payment where permitted
- Manage fee information
- View reports

TEACHER:

Teacher can ONLY VIEW fee information for students belonging to their assigned class/classes.

Teacher must NOT:

- Collect payment
- Edit payments
- Delete payments
- Manage fee structure
- Access unrelated classes

Existing teacher fee functionality that already works must remain intact.

============================================================
STUDENT FEES
============================================================

CURRENT ISSUE:

Student and Parent fee panels are not properly showing payments.

FIX THIS.

Student Fee panel must show ALL actual payments made by that student.

For example:

Payment 1:
Date
Amount
Method
Receipt/Transaction ID
Fee Type
Status

Payment 2:
Date
Amount
Method
Receipt/Transaction ID
Fee Type
Status

etc.

Every payment the student has actually made must appear.

Do NOT show fake/demo payment data.

============================================================
PARENT FEES
============================================================

Parent should see exactly the fee/payment information of their linked student.

Parent must NOT see another student's fee information.

If the child has made 3 payments, Parent should see those same 3 real payments.

Use actual parent → student relationship.

============================================================
FEES TOTALS
============================================================

Student fee panel should correctly calculate/show existing:

- Total Fee
- Paid
- Due
- Partial if applicable
- Payment history

Use actual database records.

Do not create another fee calculation system.

Payment saved by Admin must automatically reflect in:

Admin Fees
Student Fees
Parent Fees
Fee History
Reports

============================================================
4. FEE HISTORY
============================================================

History → Fee History must be fully functional.

Every actual payment collected by Admin should appear in Fee History.

Show existing relevant information such as:

- Student
- Roll Number
- Course
- Branch
- Year
- Semester
- Payment Date
- Amount
- Payment Method
- Transaction/Receipt ID
- Fee Type
- Status
- Collected By

Use actual existing database data.

============================================================
EDIT PAYMENT FROM HISTORY
============================================================

Admin should be able to go to:

History
→ Fee History
→ Select payment
→ Edit

Editing must update the SAME payment record.

Do NOT create a duplicate payment.

After editing:

Student Fees
Parent Fees
Fee History
Reports

must automatically reflect the updated payment.

If deletion is already allowed by the application's permission model, handle it safely and update all dependent calculations.

============================================================
5. FEE REPORT
============================================================

Reports module must properly use real fee data.

Fee report should calculate from actual payments/fee records.

Do NOT use hardcoded numbers.

Existing Reports UI must remain unchanged.

Make sure report calculations correctly reflect:

- Total fee
- Total collected
- Due
- Partial
- Payment count
- Student-wise information
- Class-wise information
- Course/Branch-wise information where existing filters support them

Do not create a separate report database.

============================================================
6. TEST & EXAM SYSTEM
============================================================

Use the exam architecture discussed earlier.

Exam creation:

Admin creates a central Exam/Test.

Example:

Sessional Test - 1
Course = B.Tech
Year = optional

Do NOT require:

- Student
- Branch
- Semester
- Section
- Subject

during basic exam creation unless the existing system specifically requires an optional academic scope.

Subjects should NOT be manually entered while creating the exam.

============================================================
MARK ENTRY
============================================================

When Admin/authorized Teacher opens an existing Exam:

Select:

Course
→ Branch
→ Year
→ Semester
→ Section
→ Student

Then automatically load the subjects actually assigned to that student's class.

Example:

Student:
Rahul

Class:
B.Tech ECE 2nd Year Semester 3 Section A

Automatically show all subjects assigned to that class.

Admin/Teacher enters marks.

Save marks to Supabase.

============================================================
EXAM MARK PERMISSIONS
============================================================

ADMIN:

Can:

- Create exam
- Enter marks
- Edit marks
- Publish
- View all own-college results
- Manage results

TEACHER:

Can:

- NOT create exam
- Open existing exam
- Enter marks for assigned class
- Edit marks where permitted
- Publish if the existing permission model allows it

Teacher cannot access unrelated classes.

STUDENT:

Can only:

- View own published marks/results
- Filter by Exam Name
- Filter by Exam Type if available
- View subject-wise marks
- View total
- View percentage
- View grade
- View pass/fail

Student cannot:

- Edit
- Delete
- Publish
- Create exam

PARENT:

Can view ONLY linked student's published marks.

Parent cannot edit/delete/publish.

============================================================
EXAM PERSISTENCE
============================================================

When Admin/Teacher saves marks:

They must remain permanently stored.

Refreshing page must NOT remove them.

Logging out and logging in again must NOT remove them.

Opening the same Exam later must show the saved marks.

Do NOT store marks only in frontend state.

============================================================
EXAM PUBLISHING
============================================================

Before publishing:

Student/Parent cannot see marks.

After Admin/authorized Teacher publishes:

Student can see result.

Parent can see linked child's result.

Use real database publication state.

============================================================
7. EXAM HISTORY
============================================================

History → Exam History must use the SAME exam/result records.

Admin can:

History
→ Exam History
→ Select Exam
→ Course
→ Branch
→ Semester
→ Section
→ Student
→ Edit Marks

When Admin edits marks from History:

Update the original result record.

Do NOT create a second result.

After edit:

Exam Result
Progress
History
Reports

must automatically show updated data.

============================================================
8. EXAM REPORT / RESULT ANALYSIS
============================================================

Reports/Result Analysis must use real exam data.

Use actual:

- Students
- Exams
- Subjects
- Marks
- Published results

Calculate correctly:

- Average
- Highest
- Lowest
- Pass
- Fail
- Pass percentage
- Subject performance
- Class performance

according to existing UI and filters.

Do not use dummy statistics.

============================================================
9. NOTICE SYSTEM
============================================================

Notice should be simple and fully functional.

ADMIN:

Can create notices for appropriate academic target/class.

TEACHER:

Can create notices ONLY for their assigned class/classes.

Teacher cannot create a notice for another class.

============================================================
NOTICE VISIBILITY
============================================================

If Admin creates notice for:

B.Tech
ECE
2nd Year
Semester 3
Section A

then ONLY matching students should see it.

Teacher-created class notice should also appear to those students.

Student:
Only their relevant notices.

Parent:
Only notices relevant to their linked child.

Use actual academic relationships.

============================================================
NOTICE DATABASE
============================================================

Notice must be saved permanently in Supabase.

Do not use dummy notices.

Do not duplicate notice systems for admin/teacher/student.

============================================================
IMPORTANT NOTICE CHANGE
============================================================

REMOVE "NOTICE REPORT" FROM THE REPORT MODULE.

Do NOT delete the actual Notice module.

Only remove Notice Report from Reports.

Notice functionality itself must continue working.

============================================================
10. PROGRESS SYSTEM
============================================================

Progress is an IMPORTANT CENTRAL VIEW.

Do NOT redesign the Progress UI.

Keep the current UI exactly as it is.

But make the data fully functional.

Student Progress should automatically use real:

1. Attendance
2. Exam/Test performance
3. Suspension information if applicable

============================================================
ATTENDANCE IN PROGRESS
============================================================

Show the student's actual attendance performance.

Use the same centralized Attendance records.

Do NOT maintain separate progress attendance.

============================================================
EXAM PERFORMANCE IN PROGRESS
============================================================

Show actual published exam performance.

Use:

Exam
Exam Subject
Results/Marks

Calculate performance from real data.

If marks are edited from:

Exam
or
History

Progress must automatically update.

============================================================
BEST SUBJECT / SUBJECT PERFORMANCE
============================================================

If the current Progress UI has:

Best Subject
Subject performance
Average
etc.

calculate these from actual exam marks.

Do NOT hardcode.

Use only available/published result data according to the existing logic.

============================================================
SUSPENSION IN PROGRESS
============================================================

If a student has a suspension record:

Progress should show relevant suspension information according to the existing Progress UI.

For example:

- Active
- Completed/Inactive
- Suspension date
- Reason/category
- Relevant action/status

If the student has never been suspended, do not show fake suspension information.

Student should see ONLY their own suspension information.

Parent should see ONLY their linked child's relevant information.

Admin has appropriate college-wide access.

Teacher should only see what their assigned-class permissions allow.

============================================================
11. REPORTS SYSTEM
============================================================

Reports must use REAL data.

Do NOT redesign Reports UI.

Fix only the underlying functionality/calculations/data connections.

Reports should correctly work with actual:

- Students
- Attendance
- Fees
- Exams/Results
- Academic data
- Progress where applicable

============================================================
REMOVE THESE REPORT OPTIONS
============================================================

Remove the following from Reports:

1. Class Report
2. Timetable Report
3. Notice Report
4. Academic Progress Report

IMPORTANT:

Only remove these report options.

Do NOT delete the actual:

- Class module
- Timetable module
- Notice module
- Progress module

Those modules must continue working normally.

============================================================
12. HISTORY SYSTEM
============================================================

Final History options should remain:

1. Attendance History
2. Fee History
3. Exam History
4. Suspension History

Do NOT add unrelated history modules.

Do NOT create separate data storage for History.

History must be a view/control layer over the original records.

Attendance History:
Existing functionality is working.
DO NOT break it.

Fee History:
Use real fee/payment records.

Exam History:
Use real exam/result records.

Suspension History:
Use real suspension records.

============================================================
13. SUSPENSION HISTORY
============================================================

Admin can create/manage suspension records.

Use actual student ID and college ID.

Relevant information:

- Student
- Roll Number
- Course
- Branch
- Year
- Semester
- Start Date
- End Date/Until
- Reason/Category
- Description
- Status
- Action Taken
- Created By
- Created At
- Updated At

Possible reasons:

- Disciplinary Violation
- Misconduct
- Attendance Related
- Examination Malpractice
- Anti-Ragging
- Damage to Property
- Other

Status:

- Active
- Completed
- Cancelled

Student:
Only own record.

Parent:
Only linked child's record.

Admin:
Full own-college access.

Teacher:
Only according to existing permission model.

============================================================
14. STUDY MATERIAL
============================================================

Study Material must be completely class-aware.

ADMIN:

Admin can add/manage material for appropriate academic targets.

TEACHER:

Teacher should ONLY see material belonging to:

- Their assigned class/classes
- Common material applicable to their assigned class/classes

Teacher must NOT see unrelated class material.

============================================================
STUDENT STUDY MATERIAL
============================================================

This is VERY IMPORTANT.

Student must ONLY see Study Material relevant to their OWN academic class.

Use:

college
Course
Branch
Year
Semester
Section
Subject where applicable

Example:

Student:

B.Tech
ECE
2nd Year
Semester 3
Section A

Student should see:

1. Material specifically assigned to:
B.Tech ECE 2nd Year Sem 3 Section A

AND

2. Common material intended for the student's applicable academic group.

Student must NOT see:

CSE material
IT material
different semester material
different year material
unrelated section material
another college's material

============================================================
COMMON MATERIAL
============================================================

If a material is marked as Common/All Branches:

It should be visible only to students who match the remaining academic scope.

Example:

Course = B.Tech
Year = 2nd Year
Semester = 3
Branch = Common

Then all applicable B.Tech 2nd Year Semester 3 branches can see it.

But a B.Tech 4th Year student should NOT see it.

Do not interpret "Common" as "visible to every student in every course/year".

============================================================
STUDY MATERIAL SECURITY
============================================================

Filtering must happen at backend/RLS level.

Do not fetch all study materials and simply hide them using frontend JavaScript.

Student should receive only authorized records.

Teacher should receive only authorized records.

College isolation must remain active.

============================================================
15. CROSS-MODULE DATA FLOW
============================================================

Make sure these modules are actually connected.

ATTENDANCE:

Attendance
→ Student Attendance
→ Parent Attendance
→ Progress
→ Reports
→ History

FEES:

Admin Payment
→ Student Fees
→ Parent Fees
→ Fee History
→ Reports

EXAM:

Exam
→ Marks Entry
→ Saved Results
→ Publish
→ Student Result
→ Parent Result
→ Exam History
→ Progress
→ Reports/Result Analysis

ASSIGNMENT:

Admin/Teacher Assignment
→ Correct Class
→ Student Assignment panel

NOTICE:

Admin/Teacher Notice
→ Correct Class
→ Student Notice
→ Parent Notice

SUSPENSION:

Suspension
→ Suspension History
→ Progress

STUDY MATERIAL:

Admin/Teacher Material
→ Correct academic class
→ Student/Teacher authorized material

============================================================
16. NO DUPLICATE DATABASE SYSTEMS
============================================================

Before creating anything new, inspect existing schema.

Reuse existing tables such as:

students
teachers
parents
classes
courses
branches
subjects
attendance
assignments
fees
payments
exams
exam_subjects
results
notices
study_materials
suspensions

where they already exist.

Do NOT create duplicate tables just because a frontend feature currently doesn't work.

Enhance existing schema if appropriate.

============================================================
17. DATA INTEGRITY
============================================================

Every relevant record must have proper:

college_id

and correct relationship IDs.

Do not identify students/classes by display name only.

Use:

student_id
teacher_id
class_id
course_id
branch_id
subject_id
exam_id
etc.

where available.

============================================================
18. RLS / SECURITY
============================================================

Review all RLS policies.

ADMIN:
Own college.

TEACHER:
Assigned classes only.

STUDENT:
Own data only.

PARENT:
Linked student only.

Do not allow:

Student A → Student B data
Parent A → Parent B child data
Teacher A → Teacher B class data
College A → College B data

Do not rely on frontend filtering.

============================================================
19. PERFORMANCE
============================================================

While fixing these modules, do NOT introduce unnecessary queries.

Avoid:

- select('*') where unnecessary
- fetching all students for every student login
- fetching all attendance for every user
- fetching all fees for every user
- fetching all exam results for every student
- fetching all study materials and filtering in frontend

Use precise queries and proper relationships/indexes.

Keep the performance optimization from the previous task intact.

============================================================
20. EXISTING UI = SOURCE OF TRUTH
============================================================

Before modifying any page:

Inspect the existing UI.

If the UI already has:

- Filters
- Tables
- Cards
- Tabs
- Modals
- Search
- Dropdowns

reuse them.

Do not replace them with a new design.

Only connect them to the correct backend data.

============================================================
21. DO NOT BREAK EXISTING WORKING FEATURES
============================================================

Particularly verify:

- Attendance History already works → DO NOT break it.
- Teacher fee information already works → DO NOT break it.
- Existing Exam sections → keep them.
- Existing Progress UI → keep it.
- Existing History UI → keep it.
- Existing Reports UI → keep it.
- Existing Study Material UI → keep it.

Fix functionality underneath.

============================================================
22. TESTING REQUIREMENT
============================================================

After implementation test every role.

ADMIN TEST:

- Attendance all classes
- Assignment class targeting
- Fees
- Payment
- Fee History edit
- Exam creation
- Marks Entry
- Publish
- Exam History edit
- Notice
- Progress
- Reports
- Suspension
- Study Material

TEACHER TEST:

- Assigned class attendance
- Assignment for assigned class
- Assigned class fee information
- Existing exams
- Marks for assigned class
- Notice for assigned class
- Assigned study material
- Permissions/security

STUDENT TEST:

- Own attendance
- Date-wise attendance
- Attendance percentage
- Own assignments
- Own fees/payment history
- Own published exam marks
- Exam filters
- Own notices
- Own progress
- Own suspension information if applicable
- Own study material only

PARENT TEST:

- Linked child's attendance
- Date-wise attendance
- Attendance percentage
- Linked child's assignments if parent UI supports it
- Linked child's fees/payment history
- Linked child's published exam marks
- Linked child's notices
- Linked child's progress
- Linked child's suspension information where permitted
- Linked child's study material where applicable

============================================================
23. DATABASE TESTING
============================================================

Verify:

- Data persists after refresh.
- Data persists after logout/login.
- No duplicate payments.
- No duplicate exam marks.
- No duplicate attendance.
- Editing updates existing records.
- Publishing updates existing records.
- History uses original records.
- Progress uses original records.
- Reports use original records.
- RLS blocks unauthorized records.

============================================================
24. IMPORTANT OLD STUDENT DATA
============================================================

Remember the project previously had around 800 students.

Later around 400 students were intentionally removed.

Do NOT bring those removed students back.

Do NOT use old 800-student seed/mock data.

Check:

- Current Supabase students
- Seed files
- JSON
- CSV
- Mock data
- SQL inserts
- Migration files
- Hardcoded arrays
- Old IDs
- Old roll numbers

Do not blindly delete valid historical records.

Identify the current intended student dataset and make sure the application does not use the removed student dataset.

============================================================
25. IMPLEMENTATION APPROACH
============================================================

DO NOT immediately rewrite everything.

First:

1. Inspect current frontend.
2. Inspect current Supabase schema.
3. Inspect existing relationships.
4. Inspect current RLS policies.
5. Inspect existing stores/services.
6. Inspect current role permissions.
7. Identify broken functionality.
8. Identify duplicate/unused implementations.
9. Create a concise implementation plan.
10. Then implement.

Reuse existing code wherever possible.

============================================================
26. FINAL REPORT
============================================================

After completing the work, give me a clear report:

A. Attendance
- What was fixed
- Role permissions
- Date-wise data
- Percentage calculation

B. Assignment
- Class targeting
- Teacher assignment restriction
- Student visibility

C. Fees
- Student payment display
- Parent payment display
- History editing
- Report connection

D. Exam
- Exam persistence
- Marks entry
- Publishing
- Student/Parent results
- History editing
- Progress connection
- Report/analysis

E. Notice
- Class targeting
- Student visibility
- Parent visibility
- Notice Report removed

F. Progress
- Attendance
- Exam performance
- Suspension
- Real data connection

G. Reports
- Real calculations
- Removed:
  Class Report
  Timetable Report
  Notice Report
  Academic Progress Report

H. History
- Attendance History
- Fee History
- Exam History
- Suspension History

I. Study Material
- Teacher assigned-class filtering
- Common material
- Student own-class-only filtering
- RLS

J. Security
- RLS changes
- College isolation
- Role restrictions

K. Database
- Tables reused
- Tables modified
- Migrations added
- Indexes added if any

L. UI
Explicitly confirm:

"NO UNREQUESTED UI/DESIGN CHANGES WERE MADE."

============================================================
FINAL RULE
============================================================

THE GOAL IS NOT TO CREATE A NEW SYSTEM.

THE GOAL IS TO MAKE THE EXISTING COLLEGE MANAGEMENT SYSTEM ACTUALLY WORK END-TO-END USING THE EXISTING UI AND REAL SUPABASE DATA.

SAME UI
+
SAME FEATURES
+
SAME WORKFLOW
+
REAL SUPABASE DATA
+
CORRECT ROLE PERMISSIONS
+
CORRECT CLASS FILTERING
+
COLLEGE ISOLATION
+
HISTORY CONNECTION
+
PROGRESS CONNECTION
+
REPORT CONNECTION
+
NO DUMMY DATA
+
NO UNREQUESTED UI CHANGES.