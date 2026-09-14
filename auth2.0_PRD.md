COMPLETE MULTI-ROLE AUTHENTICATION + USER CREATION + COLLEGE ISOLATION
TEACHER + STUDENT + PARENT
SUPABASE BACKEND
DO NOT CHANGE EXISTING UI/DESIGN

============================================================
IMPORTANT — READ BEFORE MAKING ANY CHANGES
============================================================

The existing Super Admin and Admin authentication system is already
working correctly.

The following must NOT be broken:

1. Super Admin login
2. Super Admin Panel
3. College creation
4. Multiple College creation
5. Admin creation during College creation
6. Admin credentials
7. Admin login
8. Admin Dashboard
9. Existing UI/design

DO NOT redesign the application.

DO NOT change the existing UI.

DO NOT change colors, layouts, sidebar, cards, tables, forms,
spacing, typography, icons, responsive design or dashboard design.

This task is primarily:

AUTHENTICATION
DATABASE
ROLE MANAGEMENT
COLLEGE ISOLATION
USER CREATION
PROFILE MAPPING
PARENT-STUDENT RELATIONSHIP
ROLE-BASED ROUTING
SECURITY
ERROR HANDLING

============================================================
CURRENT PROBLEMS
============================================================

There are currently problems with Teacher and Student authentication.

1. Teacher creation sometimes works and sometimes does not.
2. Student creation is not working reliably.
3. Student Add form does not currently have:
   - Password
   - Confirm Password
4. Teacher credentials sometimes produce:
   "Database error querying schema"
5. Teacher credentials can incorrectly open the Admin interface.
6. Teacher and Student Auth accounts/profile records are not
   consistently connected.
7. There is a risk of role mismatch.
8. There is a risk of College mismatch in a multi-college system.
9. Parent currently does not have a proper authentication flow.
10. Parent must be linked to the specific Student whose details
    were entered during Student creation.

The goal is to completely fix this architecture.

============================================================
CORE RULE
============================================================

AUTHENTICATION AND APPLICATION ROLE ARE TWO DIFFERENT THINGS.

Supabase Authentication determines:

"Is this email/password valid?"

The application database determines:

"What role does this authenticated user have?"

The role must NEVER be determined from email address.

The role must NEVER default to Admin.

The role must NEVER be inferred from which login button was used.

The role must come from the authenticated user's database profile.

============================================================
SUPPORTED ROLES
============================================================

The system must support exactly these application roles:

superadmin
admin
teacher
student
parent

Expected routing:

superadmin → Super Admin Panel

admin → Admin Panel

teacher → Teacher Panel

student → Student Panel

parent → Parent Panel

If the authenticated user has no valid profile or role:

DO NOT open Admin Panel.

DO NOT guess the role.

DO NOT fallback to Admin.

Show a proper authentication/profile configuration error.

============================================================
COLLEGE ARCHITECTURE
============================================================

This is a MULTI-COLLEGE system.

Every Admin, Teacher, Student and Parent must belong to exactly
one College.

The College relationship must be maintained using the internal
unique college_id.

college_code may be used for display/identification, but
college_id must be the primary database relationship.

Expected:

User
 ↓
college_id
 ↓
College

Example:

College A
college_id = A_UUID
college_code = COL001

College B
college_id = B_UUID
college_code = COL002

A Teacher created by College A Admin MUST receive:

college_id = A_UUID

A Student created by College B Admin MUST receive:

college_id = B_UUID

There must never be accidental cross-college assignment.

============================================================
ADMIN CREATES TEACHER
============================================================

Admin must be able to create Teacher directly from the existing
Admin Panel.

Admin must NOT need to manually visit:

Supabase → Authentication → Users

Teacher creation must automatically create the Supabase Auth user.

Existing Teacher Add UI should remain unchanged.

If Password and Confirm Password already exist in Teacher Add,
keep them.

Teacher creation flow:

Admin Login
 ↓
Admin's authenticated user
 ↓
Admin profile
 ↓
Admin's college_id
 ↓
Add Teacher
 ↓
Teacher details
 ↓
Email
 ↓
Password
 ↓
Confirm Password
 ↓
Create Supabase Auth user
 ↓
Receive auth_user_id
 ↓
Create Teacher profile
 ↓
role = teacher
 ↓
college_id = current Admin's college_id
 ↓
Teacher created successfully

============================================================
TEACHER DATABASE RELATIONSHIP
============================================================

Teacher profile must contain/maintain the necessary relationship:

auth_user_id
role
college_id
teacher_id
name
email
course
branch/department
position
assigned classes
other existing Teacher fields

The exact existing table/column names must be inspected first.

DO NOT create duplicate tables if an existing suitable table already
exists.

Use the existing schema wherever possible.

============================================================
ADMIN CREATES STUDENT
============================================================

Student creation must also happen directly from Admin Panel.

Student Add form must include the existing Student information PLUS:

Password
Confirm Password

Do NOT redesign the Student form.

Only add the missing fields in the existing design.

Student creation flow:

Admin Login
 ↓
Admin's college_id
 ↓
Add Student
 ↓
Student details
 ↓
Student Email
 ↓
Student Password
 ↓
Confirm Password
 ↓
Create Supabase Auth user
 ↓
Receive auth_user_id
 ↓
Create Student profile
 ↓
role = student
 ↓
college_id = current Admin's college_id
 ↓
Create Parent account
 ↓
Link Parent to this Student
 ↓
Student successfully created

============================================================
STUDENT DATABASE RELATIONSHIP
============================================================

Student profile should contain/maintain:

auth_user_id
role = student
college_id
student_id
roll_number
name
course
branch
year
semester
section
email
existing student fields

Use the existing schema if these fields already exist.

Do not duplicate existing information unnecessarily.

============================================================
PARENT SYSTEM
============================================================

IMPORTANT:

The current Admin Panel does not have a separate Parent management
section.

Therefore Parent creation must be part of the Student creation flow.

A Parent is NOT a Teacher.

A Parent is NOT a Student.

A Parent is a separate Auth user with:

role = parent

But the Parent must be linked to a specific Student.

============================================================
PARENT CREDENTIALS INSIDE STUDENT CREATION
============================================================

When Admin creates a Student, the Student form must also provide
Parent information.

Include:

Parent/Father Name
Parent Phone Number
Parent Email
Parent Password
Parent Confirm Password

Use the existing Student form/UI structure.

Do not redesign the page.

The Parent credentials entered here will be used for Parent login.

============================================================
PARENT AUTHENTICATION FLOW
============================================================

When Student is created:

Student Auth User
        ↓
Student Profile
        ↓
Student auth_user_id

AND

Parent Auth User
        ↓
Parent Profile
        ↓
Parent auth_user_id
        ↓
linked_student_id
        ↓
college_id

Example:

Student:
Abdul
student_id = STU001

Parent:
Father of Abdul

Parent database relationship:

role = parent
linked_student_id = STU001
college_id = same College as Student

============================================================
CRITICAL PARENT RULE
============================================================

Parent login must show ONLY the Student linked to that Parent account.

Example:

Parent A
 ↓
linked_student_id = Student A

Parent A can see:

Student A
Attendance
Fees
Results
Progress
Timetable
Assignments
Study Material
Notices
and other permitted information

Parent A MUST NOT see:

Student B
Student C
any other student

Do NOT show a general student list to Parent.

Do NOT determine the child using name/email.

Use linked_student_id.

============================================================
PARENT COLLEGE ISOLATION
============================================================

Parent must also have:

college_id

The relationship must be:

Parent
 ↓
college_id
 ↓
College

AND

Parent
 ↓
linked_student_id
 ↓
Student
 ↓
same college_id

Validate that the Parent and Student belong to the same College.

Never allow a Parent from College A to access a Student from
College B.

============================================================
AUTH USER VS PROFILE
============================================================

Creating a Supabase Auth user does NOT automatically mean the
application profile exists.

Therefore ensure both operations are handled correctly.

Teacher:

Supabase Auth User
 ↓
auth_user_id
 ↓
Teacher Profile

Student:

Supabase Auth User
 ↓
auth_user_id
 ↓
Student Profile

Parent:

Supabase Auth User
 ↓
auth_user_id
 ↓
Parent Profile
 ↓
linked_student_id

If Auth creation succeeds but profile creation fails:

DO NOT show "Created Successfully".

Handle the error properly.

If profile creation succeeds but Auth creation fails:

Do not leave an invalid/incomplete user relationship.

Use a safe creation strategy and clean up incomplete records
where appropriate.

============================================================
DUPLICATE EMAIL
============================================================

Handle duplicate email addresses properly.

If email already exists in Supabase Auth:

Do not create another user.

Show a clear error:

"This email is already registered."

Do not silently fail.

Also validate:

- invalid email
- empty email
- password too short/invalid
- password mismatch
- duplicate Teacher ID
- duplicate Student Roll Number
- invalid college
- missing required fields

Use the existing UI's error presentation.

============================================================
PASSWORD SECURITY
============================================================

NEVER store plaintext passwords in:

profiles
teachers
students
parents
localStorage
sessionStorage
frontend state after submission
logs
console

Passwords must be handled by Supabase Authentication.

The database should only store the Auth User ID and application
profile information.

============================================================
TEACHER LOGIN
============================================================

Teacher enters:

Teacher Email
+
Teacher Password

Flow:

Login
 ↓
Supabase Auth
 ↓
auth_user_id
 ↓
Find profile by auth_user_id
 ↓
Verify role
 ↓
role MUST equal teacher
 ↓
Verify college_id
 ↓
Load Teacher Panel

Teacher credentials MUST NEVER open Admin Panel.

============================================================
STUDENT LOGIN
============================================================

Student enters:

Student Email
+
Student Password

Flow:

Login
 ↓
Supabase Auth
 ↓
auth_user_id
 ↓
Find profile
 ↓
Verify role
 ↓
role MUST equal student
 ↓
Verify college_id
 ↓
Student Panel

Student credentials MUST NEVER open Admin Panel.

============================================================
PARENT LOGIN
============================================================

Parent enters:

Parent Email
+
Parent Password

Flow:

Login
 ↓
Supabase Auth
 ↓
auth_user_id
 ↓
Find Parent profile
 ↓
Verify role = parent
 ↓
Get linked_student_id
 ↓
Verify Student exists
 ↓
Verify Student belongs to same college_id
 ↓
Load Parent Panel
 ↓
Show ONLY linked Student

============================================================
ADMIN LOGIN
============================================================

DO NOT modify the existing working Admin authentication unless
required for compatibility.

Admin:

Supabase Auth
 ↓
Admin profile
 ↓
role = admin
 ↓
college_id
 ↓
Admin Panel

============================================================
SUPER ADMIN LOGIN
============================================================

DO NOT modify the existing working Super Admin authentication.

Super Admin remains separate from College Admin users.

Super Admin is allowed to create/manage Colleges.

Super Admin role:

role = superadmin

Super Admin Panel remains separate.

Existing Super Admin route/link must remain unchanged.

============================================================
CRITICAL ROLE SECURITY
============================================================

NEVER use:

if profile not found → Admin

NEVER use:

if role unknown → Admin

NEVER use:

if email contains something → Admin

NEVER use:

defaultRole = admin

Instead:

if role === "superadmin"
    → Super Admin

if role === "admin"
    → Admin

if role === "teacher"
    → Teacher

if role === "student"
    → Student

if role === "parent"
    → Parent

if role missing/invalid
    → authentication/profile error
    → logout safely
    → DO NOT open any dashboard

============================================================
FIX "DATABASE ERROR QUERYING SCHEMA"
============================================================

Teacher login currently produces:

"Database error querying schema"

This must be completely investigated.

Do NOT assume the problem.

Inspect the actual existing implementation.

Check:

- AuthContext
- AuthProvider
- login function
- profile lookup
- role lookup
- Teacher query
- Student query
- Parent query
- protected routes
- role-based routing
- Supabase queries
- database tables
- columns
- foreign keys
- relationships
- RLS policies
- migrations
- schema metadata

Find the exact query causing the error.

Verify that every referenced table and column actually exists.

Do not hide the error with try/catch.

Do not redirect to Admin when the query fails.

============================================================
RLS SECURITY
============================================================

Keep Row Level Security enabled.

Do NOT disable RLS.

Do NOT use:

USING (true)

just to make authentication work.

Create/repair only the necessary policies.

Users must only access data they are authorized to access.

Teacher:
Only permitted Teacher data and assigned class data.

Student:
Only their own permitted data.

Parent:
Only linked Student data.

Admin:
Only their College's data.

Super Admin:
College-management privileges according to the existing system.

============================================================
MULTI-COLLEGE DATA ISOLATION
============================================================

This is mandatory.

Example:

College A
 ├── Admin A
 ├── Teacher A
 ├── Student A
 └── Parent A

College B
 ├── Admin B
 ├── Teacher B
 ├── Student B
 └── Parent B

College A Admin MUST NOT see:

College B Teachers
College B Students
College B Parents

College B Admin MUST NOT see:

College A Teachers
College A Students
College A Parents

Teacher A cannot access College B data.

Student A cannot access College B data.

Parent A cannot access College B data.

============================================================
TEACHER CLASS ACCESS
============================================================

Teacher must only see students from classes assigned to that Teacher.

Teacher should not automatically receive every Student in the
College.

Teacher access should be based on:

teacher_id
+
assigned class/classes
+
college_id

Use the existing Classes/Teacher assignment architecture.

Do not redesign the Teacher UI.

============================================================
STUDENT ACCESS
============================================================

Student must only see their own:

Attendance
Fees
Results
Progress
Timetable
Assignments
Study Material
Notices
Profile

Do not show other students' private information.

============================================================
PARENT ACCESS
============================================================

Parent must only see their linked student's information.

The Parent should never receive a complete Student list.

============================================================
USER CREATION TRANSACTION / CONSISTENCY
============================================================

Teacher/Student/Parent creation must be reliable.

Do not create situations where:

Auth user exists
but profile does not exist.

Or:

Profile exists
but Auth user does not exist.

Or:

Teacher exists under wrong college.

Or:

Parent is linked to wrong Student.

After creation, verify:

Auth user created
Profile created
Role correct
College correct
Relationships correct

Only then show success.

============================================================
EXISTING USERS
============================================================

There may already be Teacher records in the database.

DO NOT delete existing users/data automatically.

Inspect existing records.

Determine whether their:

auth_user_id
role
college_id
profile

are correctly mapped.

If existing Teacher records are incomplete, provide a safe migration
or repair strategy instead of deleting them.

============================================================
EXISTING ADMIN SYSTEM
============================================================

The existing Admin authentication is already working.

Do NOT rewrite it unnecessarily.

Do NOT break:

- Admin login
- College creation
- Multiple College support
- Admin Dashboard
- Super Admin authentication

============================================================
UI REQUIREMENT
============================================================

ABSOLUTELY NO UI REDESIGN.

Do not change:

- Login page design
- Admin dashboard
- Teacher dashboard
- Student dashboard
- Existing sidebar
- Cards
- Tables
- Navigation
- Colors
- Fonts
- Buttons
- Spacing
- Responsive layout

Only make functional changes required for:

Student Password
Student Confirm Password
Parent credentials inside Student creation

Use the existing design system.

============================================================
TESTING REQUIREMENTS
============================================================

After implementation, test the complete system.

TEST 1:

Create College A.

Create Admin A.

Admin A login.

Expected:
Admin A → Admin Panel.

TEST 2:

Admin A creates Teacher A.

Verify:
Auth user exists.
Teacher profile exists.
role = teacher.
college_id = College A.

TEST 3:

Login using Teacher A credentials.

Expected:
Teacher Panel.

NOT Admin Panel.

NOT Student Panel.

NOT blank screen.

NOT database schema error.

TEST 4:

Admin A creates Student A.

Student form must contain:

Password
Confirm Password

Verify:
Auth user exists.
Student profile exists.
role = student.
college_id = College A.

TEST 5:

Login using Student A credentials.

Expected:
Student Panel.

NOT Admin Panel.

TEST 6:

Student A creation also creates Parent A account.

Verify:

Parent Auth user exists.
Parent profile exists.
role = parent.
linked_student_id = Student A.
college_id = College A.

TEST 7:

Login using Parent A credentials.

Expected:

Parent Panel.

Only Student A should be visible.

TEST 8:

Create College B.

Create Admin B.

Create Teacher B.

Create Student B.

Create Parent B.

Verify:

College A Admin cannot see College B users.

College B Admin cannot see College A users.

Parent A cannot see Student B.

Parent B cannot see Student A.

Teacher A cannot access Teacher B's assigned students.

============================================================
ERROR HANDLING TEST
============================================================

Test invalid credentials.

Expected:

Proper login error.

Do not open another role's dashboard.

Test an Auth user with no application profile.

Expected:

Profile configuration error.

DO NOT open Admin Panel.

Test invalid/missing role.

Expected:

Role configuration error.

DO NOT open Admin Panel.

Test duplicate email.

Expected:

Clear duplicate email error.

============================================================
IMPORTANT DEBUGGING RULE
============================================================

Before modifying database schema:

Inspect the existing schema.

Before creating a new table:

Check whether an existing table already serves the purpose.

Before creating a new role system:

Inspect the existing role system.

Before changing RLS:

Inspect current policies.

Before changing routing:

Trace current authentication flow.

Do not create duplicate systems.

============================================================
FINAL ACCEPTANCE CRITERIA
============================================================

The implementation is complete only when:

✓ Super Admin login works
✓ College creation works
✓ Multiple Colleges work
✓ Admin creation works
✓ Admin login works
✓ Teacher creation works reliably
✓ Student creation works reliably
✓ Teacher Password works
✓ Teacher Confirm Password works
✓ Student Password field exists
✓ Student Confirm Password field exists
✓ Student authentication works
✓ Teacher authentication works
✓ Parent authentication works
✓ Teacher role is correctly identified
✓ Student role is correctly identified
✓ Parent role is correctly identified
✓ Teacher credentials NEVER open Admin Panel
✓ Student credentials NEVER open Admin Panel
✓ Parent credentials NEVER open Admin Panel
✓ Admin credentials NEVER open Teacher/Student/Parent Panel
✓ No role is determined by email
✓ No role defaults to Admin
✓ No "Database error querying schema"
✓ No HTTP 500 caused by invalid profile/schema queries
✓ Auth user and profile remain synchronized
✓ Teacher gets correct college_id
✓ Student gets correct college_id
✓ Parent gets correct college_id
✓ Parent gets correct linked_student_id
✓ Parent sees ONLY linked Student
✓ Teacher sees only permitted/assigned class students
✓ Student sees only own information
✓ College A data is isolated from College B
✓ Duplicate emails are handled
✓ Passwords are never stored as plaintext
✓ RLS remains enabled
✓ Existing Super Admin/Admin functionality remains working
✓ Existing UI/design remains unchanged

============================================================
FINAL INSTRUCTION
============================================================

DO NOT claim that the system is fixed just because the code compiles.

Actually test:

CREATE → AUTH → PROFILE → ROLE → COLLEGE → LOGIN → ROUTING

for:

Teacher
Student
Parent

Also test multi-college isolation.

If any step fails, identify and fix the actual root cause.

DO NOT hide errors.

DO NOT use Admin as a fallback role.

DO NOT modify the UI unnecessarily.

The final system must have a clean, consistent:

AUTH USER
+
PROFILE
+
ROLE
+
COLLEGE
+
STUDENT-PARENT RELATIONSHIP

architecture.