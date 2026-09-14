# Authentication & Authorization PRD
# College Management System

**Document:** auth_PRD.md  
**Version:** 1.0  
**Status:** Final  
**Product:** Multi-College Management System

---

# 1. PURPOSE

This document defines the complete Authentication, Authorization, Role Management, College Isolation, User Access Control, and Account Management requirements for the College Management System.

The system is a MULTI-COLLEGE management platform.

The system must support:

- Multiple colleges
- One Super Admin controlling multiple colleges
- One Admin managing one college
- Teachers belonging to a specific college
- Students belonging to a specific college
- Parents belonging to a specific college
- Role-based access
- Permission-based access
- Teacher class-based access
- Student own-data access
- Parent child-data access
- College-level data isolation
- Protected routes
- Secure authentication
- Future Supabase / Node.js / Express.js compatibility

---

# 2. CORE PRINCIPLE

The most important rule of the entire authentication architecture is:

> A user must only be able to access the data they are authorized to access.

Access must be determined by:

1. User Identity
2. Role
3. College ID
4. Permissions
5. Relationship / Assignment

The basic authorization flow is:

USER
↓
IDENTITY
↓
ROLE
↓
COLLEGE ID
↓
PERMISSIONS
↓
RELATIONSHIP / ASSIGNMENT
↓
ALLOWED DATA

---

# 3. SYSTEM ROLES

The system has five logical roles:

1. Super Admin
2. Admin
3. Teacher
4. Student
5. Parent

However, only four roles must appear on the normal login interface:

- Admin
- Teacher
- Student
- Parent

Super Admin must NOT appear on the normal login page.

---

# 4. SUPER ADMIN

## 4.1 Purpose

Super Admin is the highest-level system administrator.

Super Admin is NOT a normal college user.

Super Admin operates at the platform level and manages colleges.

---

## 4.2 Super Admin Login

Super Admin must have a separate authentication entry point.

Suggested route:

`/veneyd07744`

This route is only the entry point to the Super Admin authentication interface.

IMPORTANT:

The URL itself is NOT considered a security mechanism.

Actual Super Admin security must be enforced by:

- Authentication
- Role verification
- Backend authorization
- Database security
- Session validation

---

## 4.3 Super Admin Credentials

The system must have a dedicated Super Admin account.

Example:

Email:
`superadmin@example.com`

Password:
Secure password

The actual credentials must NOT be hardcoded into frontend source code.

Credentials must be stored securely through the authentication system.

Passwords must never be stored as plain text.

---

# 5. SUPER ADMIN CAPABILITIES

Super Admin can:

- Login to Super Admin panel
- Create/Register new colleges
- View colleges
- Manage colleges
- Activate colleges
- Deactivate/suspend colleges
- Manage college administrators
- View college-level information
- Control platform-level college access

Super Admin does NOT appear as a normal college role.

---

# 6. COLLEGE REGISTRATION

Only Super Admin can register a new college.

No normal Admin, Teacher, Student, or Parent can create a new college.

---

## 6.1 Registration Flow

The flow must be:

Normal Login Page
↓
Register New College
↓
Super Admin Credential Verification
↓
Super Admin Authentication
↓
Register New College Interface
↓
Enter College Information
↓
Create College
↓
Create College Admin
↓
College becomes available to the system

---

# 7. REGISTER NEW COLLEGE

When the user clicks:

`Register New College`

the system must NOT immediately show the college creation form.

First show:

### Super Admin Verification

Fields:

- Super Admin Email
- Super Admin Password

Then:

`Verify`

Only after successful verification should the College Registration interface open.

---

# 8. COLLEGE INFORMATION

The College Registration form should support information such as:

- College Name
- College Code
- Official Email
- Official Phone
- Address
- City
- State
- Country
- College Logo
- Website (optional)
- Other required institutional information

---

# 9. UNIQUE COLLEGE ID

Every college must receive a unique `college_id`.

Example:

```text
ABC College of Engineering
college_id = COL001
10. COLLEGE ID PURPOSE

College ID is one of the most important identifiers in the system.

It tells the system:

Which college does this user/data belong to?

Every college-specific entity must be associated with a college_id.

Examples:

Student → college_id
Teacher → college_id
Parent → college_id
Admin → college_id
Class → college_id
Attendance → college_id
Fee → college_id
Exam → college_id
Result → college_id
Timetable → college_id
Assignment → college_id
Study Material → college_id
Notice → college_id
Report → college_id
11. MULTI-COLLEGE DATA ISOLATION

The system must strictly isolate college data.

Example:

College A
college_id = COL001

College B
college_id = COL002

A user belonging to COL001 must never be able to access data belonging to COL002.

This restriction must NOT depend only on frontend filtering.

It must eventually be enforced at:

Backend/API level
Database level
Row-level security where applicable
Authorization layer
12. COLLEGE ADMIN

When Super Admin creates a college, the system should allow creation of the initial College Admin.

Example:

College:
ABC College

College ID:
COL001

Admin Name:
Admin Name

Admin Email:
admin@abc.com

Password:
Temporary secure password

The Admin receives:

role = admin
college_id = COL001
13. ADMIN ACCESS

Admin is a College-Level Administrator.

Admin has management access to their own college.

Admin can manage, according to configured permissions:

Students
Teachers
Parents
Classes
Academic Structure
Attendance
Fees
Exams
Results
Timetable
Assignments
Study Materials
Notices
Reports
Role & Permissions
College settings
14. ADMIN COLLEGE RESTRICTION

Admin must only manage their own college.

Example:

Admin A
college_id = COL001

Admin A can access:

COL001

Admin A cannot access:

COL002
COL003
COL004

even if those records exist.

15. TEACHER ACCOUNT

Teachers are created/managed by the College Admin.

A teacher account must contain:

teacher_id
user_id
college_id
email
role
password/authentication identity
course
branch
position
assigned classes

Example:

teacher_id = TCH001
college_id = COL001
role = teacher
16. TEACHER LOGIN

Teacher logs in using the email assigned by the college.

Example:

Email:
teacher@gmail.com

Password:
********

After successful authentication:

role = teacher
teacher_id = TCH001
college_id = COL001

Teacher must be redirected to:

/teacher/dashboard

or the existing Teacher Dashboard route.

17. TEACHER ACCESS MODEL

Teacher access is based on:

Teacher
+
College
+
Assigned Classes
+
Permissions

Teacher must NOT automatically receive access to every student in the college.

18. TEACHER CLASS ASSIGNMENT

A teacher can be assigned one or multiple classes.

Example:

Teacher:
TCH001

Assigned Classes:

CLASS001
CLASS005
CLASS008

The teacher's accessible students must be calculated through those classes.

Flow:

Teacher
↓
Assigned Class IDs
↓
Classes
↓
Student IDs
↓
Students
19. TEACHER STUDENT ACCESS

Teacher can only see students belonging to their assigned classes.

Example:

TCH001

Assigned:
CLASS001
CLASS002

Then teacher can see:

Students of CLASS001
+
Students of CLASS002

Teacher must NOT see:

Students of other classes
Students assigned to another teacher
Students from unrelated branches
Students from unrelated courses
Students from unrelated years
Students from unrelated sections

unless an explicit permission/assignment allows it.

20. CLASS TEACHER

The system must support a primary/class teacher relationship.

Example:

CLASS001

Class Teacher:
TCH001

The Class Teacher is the main teacher responsible for that class.

21. ASSIGNED TEACHER

The system may also support teachers assigned to a class for specific teaching responsibilities.

Therefore a class may have:

classTeacherId
assignedTeacherIds[]

where appropriate.

22. STUDENT ACCOUNT

Students are created/managed by the College Admin.

A student account must contain:

user_id
student_id
college_id
email
role
course
branch
year
semester
section
class_id

Example:

student_id = STU001
college_id = COL001
role = student
class_id = CLASS001
23. STUDENT LOGIN

Student logs in using the email assigned to their account.

Example:

Email:
student@gmail.com

Password:
********

After login:

role = student
student_id = STU001
college_id = COL001

Student is redirected to:

/student/dashboard

or the existing Student Dashboard route.

24. STUDENT ACCESS MODEL

Student access is based on:

Student Identity
+
College ID
+
Own Student ID
+
Permissions

Student must only access their own private academic data.

25. STUDENT OWN-DATA ACCESS

If the logged-in student is:

STU001

then the system must only return data belonging to:

STU001

for private student records.

This includes:

Profile
Attendance
Fees
Payments
Exam Results
Progress
Timetable
Assignments
Relevant notices
Relevant study materials

Student must not access:

STU002
STU003
STU004

private data.

26. PARENT ACCOUNT

Parents are created/managed by the College Admin.

A parent account must contain:

parent_id
user_id
college_id
email
role
linked child/student relationship

Example:

parent_id = PAR001
college_id = COL001
role = parent
27. PARENT-CHILD RELATIONSHIP

Parent must be explicitly connected to a student.

Example:

PARENT001
      ↓
STU001

A parent may support multiple children in the future.

Therefore the data model should preferably support:

parent_id
child_student_ids[]

or an equivalent relationship table.

28. PARENT LOGIN

Parent logs in using their assigned email/password.

After authentication:

role = parent
parent_id = PAR001
college_id = COL001

Parent is redirected to:

/parent/dashboard

or the existing Parent Dashboard route.

29. PARENT ACCESS MODEL

Parent access is based on:

Parent Identity
+
College ID
+
Linked Child Student ID(s)
+
Permissions

Parent can only see data of their linked child/children.

30. PARENT DATA ACCESS

If:

PARENT001

is linked to:

STU001

then Parent can access:

Child Attendance
Child Fees
Child Payment History
Child Exam Results
Child Progress
Child Timetable
Child Assignments
Relevant Notices
Other permitted child-related information

Parent must NOT access unrelated students.

31. NORMAL LOGIN PAGE

The normal login page must support only:

Admin
Teacher
Student
Parent

Super Admin must NOT appear as a selectable normal role.

32. LOGIN FLOW

General login:

Login Page
↓
Email
↓
Password
↓
Authenticate
↓
Identify User
↓
Identify Role
↓
Identify College ID
↓
Load Permissions
↓
Load Relationship/Assignment
↓
Redirect to Correct Dashboard
33. ROLE-BASED REDIRECTION

After login:

Admin
Admin
↓
Admin Dashboard
Teacher
Teacher
↓
Teacher Dashboard
Student
Student
↓
Student Dashboard
Parent
Parent
↓
Parent Dashboard
Super Admin
Super Admin
↓
Super Admin Panel

Super Admin must never be redirected into the normal college Admin Dashboard.

34. ROLE-BASED ROUTE PROTECTION

Routes must be protected.

Example:

A Student must not access:

/admin/students
/admin/teachers
/admin/fees
/admin/settings

A Teacher must not access:

/admin/settings
/admin/roles

unless explicitly permitted.

A Parent must not access:

/admin/*
/teacher/*

A normal Admin must not access:

/super-admin/*

A Student must not access another student's private route/data.

35. SIDEBAR ACCESS CONTROL

Sidebar visibility must follow role and permission.

Do not show modules that a user is not allowed to access.

However, hiding a sidebar item is NOT sufficient security.

Even if a user manually enters the URL, the backend must deny unauthorized access.

36. CURRENT SIDEBAR RULES
Admin

Admin has the complete approved Admin sidebar.

Teacher

Teacher must NOT have:

Classes
Progress

Teacher still has:

Students
Other approved Teacher modules

Do not re-add removed modules.

Student

Student must NOT have:

AI Assistant

Student must retain other approved modules including:

Assignments
Time Table
Fees
Report
Attendance
Exam/Result
Progress
Study Material
Notice
Profile
Settings
Other currently approved modules
Parent

Parent should only see currently approved Parent modules.

37. ROLE VS PERMISSION

Role and Permission are separate concepts.

Role defines the general category:

admin
teacher
student
parent

Permission defines what the user is allowed to do.

Example:

Teacher

does not automatically mean:

edit_every_student
38. PERMISSION EXAMPLES

Possible permissions include:

students.view
students.create
students.edit
students.delete

teachers.view
teachers.create
teachers.edit
teachers.delete

attendance.view
attendance.create
attendance.edit
attendance.delete

fees.view
fees.create
fees.edit
fees.delete

exams.view
exams.create
exams.edit
exams.delete

results.view
results.enter
results.edit
results.publish

timetable.view
timetable.create
timetable.edit
timetable.delete

assignments.view
assignments.create
assignments.edit
assignments.delete

study_material.view
study_material.create
study_material.edit
study_material.delete

notices.view
notices.create
notices.edit
notices.delete

reports.view
reports.export

roles.view
roles.manage

The exact permission list may expand later.

39. PERMISSION PRINCIPLE

Every sensitive operation must verify permission.

Example:

User Role:
Teacher

Permission:
attendance.create

Relationship:
Teacher is assigned to CLASS001

Result:
ALLOW

But:

Teacher
attendance.create

Class:
CLASS999

Teacher is NOT assigned to CLASS999

Result:
DENY
40. COLLEGE-SCOPED PERMISSIONS

Even if a user has permission:

students.view

the user must only view students belonging to their authorized college.

Example:

Admin
college_id = COL001
permission = students.view

This means:

Can view students of COL001

NOT:

Can view students of all colleges
41. DATA OWNERSHIP RULES

Different roles have different ownership scopes.

Super Admin

Scope:

All Colleges
Admin

Scope:

Own College
Teacher

Scope:

Own College
+
Assigned Classes
Student

Scope:

Own College
+
Own Student Record
Parent

Scope:

Own College
+
Linked Child/Children
42. ACADEMIC CLASS RELATIONSHIP

Students must be connected to a real academic class.

Example:

Course:
B.Tech

Branch:
ECE

Year:
2nd Year

Semester:
3

Section:
A

Class:
CLASS001

Student:

STU001
↓
CLASS001

Teacher:

TCH001
↓
CLASS001

This relationship must be used across the application.

43. ATTENDANCE AUTHORIZATION

Attendance must respect role and relationship.

Admin

Can view/manage attendance for authorized college data.

Teacher

Can manage attendance only for assigned classes.

Student

Can view only their own attendance.

Parent

Can view only linked child's attendance.

44. ATTENDANCE DATA RELATIONSHIP

Attendance should reference:

attendance_id
college_id
class_id
student_id
date
status
lecture/subject

Example:

Attendance:
ATT001

College:
COL001

Class:
CLASS001

Student:
STU001

Status:
Present

This same record must be used by:

Admin
Teacher
Student
Parent

according to their permissions.

45. FEES AUTHORIZATION
Admin

Can manage authorized college fee data.

Student

Can view only their own fees.

Parent

Can view linked child's fees.

Teacher

No fee access unless explicitly permitted.

46. EXAM AND RESULT AUTHORIZATION
Admin

Can create exams and manage results according to permissions.

Teacher

Can access results of permitted classes/students.

Student

Can view own results.

Parent

Can view linked child's results.

47. TIMETABLE AUTHORIZATION
Admin

Can manage college timetable according to permissions.

Teacher

Can view timetable relevant to assigned classes.

Student

Can view timetable relevant to own class.

Parent

Can view timetable relevant to linked child.

48. ASSIGNMENT AUTHORIZATION

Assignments must be connected to academic targeting.

Targeting can include:

Course
Branch
Year
Semester
Section
Class

Students should only see assignments relevant to their academic class.

Teachers should only create/manage assignments for authorized classes.

49. STUDY MATERIAL AUTHORIZATION

Study material must support:

Course
Branch
Semester
Subject
Common Subject
Category
Access Type

Access Type:

Free
Premium

Students should see only material relevant to their:

Course
+
Branch
+
Semester

Common subjects should be available according to configured academic targeting.

50. NOTICE AUTHORIZATION

Notices can target:

All Colleges where applicable to Super Admin
Specific College
Course
Multiple Courses
Branch
Multiple Branches
General/All

Branch may be optional.

Users should only see notices relevant to their scope.

51. LOGOUT

Every authenticated user must have a working Logout action.

Logout must:

Destroy/invalidate the active session
Clear authenticated user state
Clear sensitive client-side state
Redirect to the correct login page
52. SESSION MANAGEMENT

The authentication system must support secure sessions.

The application should:

Detect authenticated sessions
Restore valid sessions after refresh
Detect expired sessions
Redirect unauthenticated users to login
Prevent access to protected routes
Properly terminate sessions on logout
53. FORGOT PASSWORD

Authentication should support:

Forgot Password
↓
Enter Email
↓
Verification / Reset Flow
↓
Set New Password
↓
Login

Exact implementation will depend on the authentication provider.

54. CHANGE PASSWORD

Authenticated users should be able to change their password.

Flow:

Current Password
↓
New Password
↓
Confirm New Password
↓
Update Password

Password rules should be configurable.

55. INITIAL / TEMPORARY PASSWORD

When Admin creates a Teacher, Student, or Parent account, the system may generate or assign a temporary password.

Recommended production flow:

Admin Creates Account
↓
Temporary Password / Invitation
↓
User First Login
↓
Force Password Change
↓
Normal Account

Passwords must never be stored or displayed as plain text after secure account creation.

56. PASSWORD SECURITY

Passwords must:

Never be stored as plain text
Never be returned through normal API responses
Never be exposed in frontend source code
Never be stored in localStorage as plain text
Never be logged in console
Never be included in URLs

Use the authentication provider's secure password handling.

57. EMAIL UNIQUENESS

Email handling must prevent accidental duplicate accounts according to the authentication model.

The system must correctly handle:

Existing email
Invalid email
Unverified email where applicable
Duplicate account attempts
58. ACCOUNT STATUS

Accounts should support status such as:

Active
Inactive
Suspended

If an account is inactive/suspended:

the user must not be allowed to access protected modules.

59. COLLEGE STATUS

College should support status such as:

Active
Suspended
Inactive

If a college is suspended:

normal college users belonging to that college should not be allowed to access the college management system.

Super Admin should still be able to manage the college.

60. DEACTIVATING A USER

If Admin deactivates a:

Teacher
Student
Parent

the account should no longer be able to authenticate/access protected resources according to the account status rules.

Do not delete historical academic records simply because a user is deactivated.

61. SOFT DELETE

Where appropriate, use soft deletion for important academic entities.

For example:

Instead of permanently deleting a student immediately:

status = inactive

or equivalent.

Historical:

Attendance
Fees
Results
Reports

should remain consistent.

The exact deletion strategy will be finalized during database implementation.

62. SUPER ADMIN SECURITY

Super Admin is the highest privileged role.

Super Admin access must be protected using:

Strong authentication
Role verification
Separate protected routes
Backend authorization
Secure session handling
Database-level authorization

The /veneyd07744 path must NOT be treated as the actual security layer.

63. NORMAL USER MUST NOT BECOME SUPER ADMIN

A normal user must never be able to:

Change their role to Super Admin
Modify their own college_id
Change another user's role to Super Admin
Create a Super Admin account
Access Super Admin APIs
Access another college's administrative data
64. COLLEGE ID MUST NOT BE USER-CONTROLLABLE

A normal user must not be able to simply modify:

college_id = COL002

in a frontend request and gain access to College B.

The backend/database authorization layer must determine the user's real college.

The client must never be trusted for authorization.

65. USER ID VS STUDENT ID VS TEACHER ID

The system should distinguish between:

Authentication User ID

Unique identity from the authentication system.

Example:

user_id = AUTH123
Student ID

Application-specific student identifier:

student_id = STU001
Teacher ID
teacher_id = TCH001
Parent ID
parent_id = PAR001
College ID
college_id = COL001

These identifiers must not be confused.

66. EXAMPLE: COMPLETE STUDENT IDENTITY

Example:

Authentication User ID:
AUTH123

Student ID:
STU001

Role:
student

College ID:
COL001

Class ID:
CLASS001

This means:

AUTH123
↓
STU001
↓
COL001
↓
CLASS001
67. EXAMPLE: COMPLETE TEACHER IDENTITY
Authentication User ID:
AUTH456

Teacher ID:
TCH001

Role:
teacher

College ID:
COL001

Assigned Classes:
CLASS001
CLASS005

Teacher can access students through those classes.

68. EXAMPLE: COMPLETE PARENT IDENTITY
Authentication User ID:
AUTH789

Parent ID:
PAR001

Role:
parent

College ID:
COL001

Linked Child:
STU001

Parent can access STU001's permitted information.

69. COMPLETE MULTI-COLLEGE EXAMPLE
Super Admin
SUPER ADMIN

Controls:

COL001
COL002
COL003
College A
ABC College

college_id = COL001

Admin:

ADMIN001
college_id = COL001

Teacher:

TCH001
college_id = COL001

Student:

STU001
college_id = COL001

Parent:

PAR001
college_id = COL001
child = STU001
College B
XYZ College

college_id = COL002

Admin:

ADMIN002
college_id = COL002

Teacher:

TCH050
college_id = COL002

Student:

STU100
college_id = COL002

Parent:

PAR100
college_id = COL002
child = STU100
70. COLLEGE ISOLATION EXAMPLE

If:

ADMIN001
college_id = COL001

requests:

Students

the system returns:

COL001 students only

It must NOT return:

COL002 students
COL003 students
71. TEACHER ISOLATION EXAMPLE

Teacher:

TCH001
college_id = COL001

Assigned:

CLASS001

Class:

CLASS001

contains:

STU001
STU002
STU003
STU004

Teacher sees:

STU001
STU002
STU003
STU004

Teacher does NOT see:

STU005
STU006

if those students belong to another class.

72. STUDENT ISOLATION EXAMPLE

Student:

STU001

requests attendance.

System returns:

Attendance where student_id = STU001

It must NOT return:

STU002 attendance
STU003 attendance
73. PARENT ISOLATION EXAMPLE

Parent:

PAR001

linked to:

STU001

Parent requests fees.

System returns:

STU001 fees

It must NOT return:

STU002 fees
STU003 fees
74. FRONTEND AUTHENTICATION CONTEXT

Frontend should have a centralized authentication state.

Example conceptual structure:

currentUser = {
    userId,
    role,
    collegeId,
    adminId?,
    teacherId?,
    studentId?,
    parentId?
}

Do not scatter user identity information throughout components.

75. AUTH CONTEXT / SESSION STORE

Use one centralized authentication/session provider.

Possible implementation:

AuthContext

or:

authStore

or another suitable architecture.

It should provide:

Current user
Current role
Current college
Authentication status
Login
Logout
Session restoration
Permission checks
76. PERMISSION CHECKING

Provide centralized permission functions such as:

hasPermission()

and role checks such as:

hasRole()

Example:

hasPermission("attendance.create")

Do not duplicate authorization logic in every component.

77. ROUTE GUARDS

Protected routes should use a centralized route guard.

Conceptually:

ProtectedRoute

should check:

Is user authenticated?
What is the user's role?
What college do they belong to?
Does the role have permission?
Does the user have the required relationship/assignment?

If not authorized:

DENY

and redirect appropriately.

78. FRONTEND SECURITY LIMITATION

Frontend authorization is for user experience and navigation.

It is NOT the final security layer.

Real security must be implemented later through:

Backend/API authorization
Database authorization
Row Level Security where applicable
Server-side permission checks
79. FUTURE SUPABASE COMPATIBILITY

The authentication architecture must be compatible with Supabase Auth.

The future system may use:

Supabase Auth
+
PostgreSQL Database
+
RLS

The application-specific profile tables should reference the authenticated user's ID.

Conceptually:

auth.users
     ↓
profiles
     ↓
role
     ↓
college_id
80. FUTURE NODE.JS / EXPRESS COMPATIBILITY

The system should also remain compatible with:

React
+
Node.js
+
Express.js
+
Supabase/PostgreSQL

Authentication and authorization should be separated from UI components.

Do not tightly couple UI components to a specific backend implementation.

81. AUTHENTICATION SERVICE LAYER

Use an abstraction such as:

authService

with methods such as:

login()
logout()
getCurrentUser()
getSession()
forgotPassword()
resetPassword()
changePassword()

The exact implementation can later use Supabase Auth or another authentication provider.

82. USER SERVICE

Use a user service/repository abstraction where appropriate.

Examples:

userService.getUser()
userService.createUser()
userService.updateUser()
userService.deactivateUser()

The exact service structure can be adjusted during implementation.

83. COLLEGE SERVICE

Super Admin should use a dedicated college management layer.

Examples:

collegeService.createCollege()
collegeService.getColleges()
collegeService.updateCollege()
collegeService.activateCollege()
collegeService.suspendCollege()
84. INVITATION / ACCOUNT CREATION

For production implementation, Admin-created accounts should preferably use a secure invitation or temporary-password process.

Example:

Admin
↓
Create Student
↓
Email + Account Creation
↓
Temporary Access
↓
Student First Login
↓
Set Password

Same concept can apply to:

Teacher
Parent
85. LOGIN ERROR HANDLING

Login must properly handle:

Invalid email
Invalid password
Inactive account
Suspended account
Suspended college
Unverified account where applicable
Network error
Authentication service failure

Do not expose sensitive information through error messages.

Avoid revealing whether a particular email exists where inappropriate.

86. UNAUTHORIZED ACCESS

If a user attempts to access unauthorized data:

return a safe authorization error.

Examples:

Access Denied

or:

You do not have permission to access this resource.

Do not expose internal database details.

87. CROSS-COLLEGE ACCESS TEST

The system must be tested with at least two colleges.

Example:

COL001
COL002

Create users in both.

Verify:

COL001 Admin

Cannot access COL002.

COL001 Teacher

Cannot access COL002.

COL001 Student

Cannot access COL002.

COL001 Parent

Cannot access COL002.

Repeat for COL002.

88. ROLE ACCESS TEST

Test all four normal roles:

Admin
Teacher
Student
Parent

and the Super Admin separately.

89. SUPER ADMIN TEST

Verify:

Super Admin login works
Super Admin route is protected
Super Admin can create college
New College ID is unique
New Admin can be created
Super Admin can manage college status
Super Admin is not shown on normal login
Normal users cannot access Super Admin panel
90. ADMIN TEST

Verify:

Admin login works
Admin is redirected to Admin Dashboard
Admin can access authorized modules
Admin cannot access another college
Admin can manage users of own college
Admin permissions work
Admin logout works
91. TEACHER TEST

Verify:

Teacher login works
Teacher goes to Teacher Dashboard
Teacher sees only assigned classes
Teacher sees only assigned students
Teacher attendance access is restricted
Teacher cannot access unrelated students
Teacher cannot access another college
Teacher permissions work
Teacher logout works
92. STUDENT TEST

Verify:

Student login works
Student goes to Student Dashboard
Student sees own profile
Student sees own attendance
Student sees own fees
Student sees own results
Student sees own progress
Student sees own timetable
Student sees relevant assignments
Student sees relevant study material
Student cannot see another student's data
Student cannot access Admin/Teacher resources
Student logout works
93. PARENT TEST

Verify:

Parent login works
Parent goes to Parent Dashboard
Parent sees linked child's data
Parent sees child's attendance
Parent sees child's fees
Parent sees child's results
Parent sees child's progress
Parent sees child's timetable
Parent sees child's assignments
Parent cannot see another child unless explicitly linked
Parent cannot access Admin/Teacher resources
Parent logout works
94. DATA CONSISTENCY TEST

Use one student:

STU001

Verify the same student is connected across:

Student
Class
Teacher
Attendance
Fees
Exam
Result
Progress
Assignment
Parent
Reports
Timetable

The student's:

Name
Roll Number
Course
Branch
Year
Semester
Section
Class

must remain consistent.

95. ATTENDANCE CONSISTENCY TEST

Teacher marks:

STU001 = Present

Verify the same attendance record is visible to:

Admin
Teacher
STU001
STU001's Parent

according to permissions.

Do NOT maintain separate attendance copies.

96. FEE CONSISTENCY TEST

Admin records a payment for:

STU001

Verify:

Admin Fees
Student Fees
Parent Fees

reflect the same record.

97. RESULT CONSISTENCY TEST

Admin/authorized teacher enters a result for:

STU001

After publishing:

Student
Parent
Authorized Teacher
Admin

must see the same result according to their permissions.

98. AUTHENTICATION DATA MODEL

The future database should conceptually contain:

users/auth identities
profiles
colleges
roles
permissions
role_permissions
user_permissions (if required)
student_profiles
teacher_profiles
parent_profiles
admin_profiles

The exact schema will be finalized during database implementation.

99. COLLEGE RELATIONSHIP MODEL

Conceptually:

College
│
├── Admin
├── Teachers
├── Students
├── Parents
├── Classes
├── Attendance
├── Fees
├── Exams
├── Results
├── Timetable
├── Assignments
├── Study Materials
├── Notices
└── Reports

All college-specific records must be scoped to the correct college.

100. FINAL ACCESS MATRIX
Feature	Super Admin	Admin	Teacher	Student	Parent
Manage Colleges	YES	NO	NO	NO	NO
Manage College Admin	YES	Own College	NO	NO	NO
Students	All/Platform	Own College	Assigned Classes	Own Data	Linked Child
Teachers	All/Platform	Own College	Own Profile	NO	NO
Classes	All/Platform	Own College	Assigned	Own Class	Child's Class
Attendance	All/Platform	Own College	Assigned Classes	Own	Child
Fees	All/Platform	Own College	No/Permission	Own	Child
Exams	All/Platform	Own College	Authorized	Own	Child
Results	All/Platform	Own College	Authorized	Own	Child
Timetable	All/Platform	Own College	Assigned	Own Class	Child
Assignments	All/Platform	Own College	Assigned Classes	Relevant	Child
Study Material	All/Platform	Own College	Authorized	Relevant	Relevant
Notices	All/Platform	Own College	Relevant	Relevant	Relevant
Reports	All/Platform	Own College	Authorized	Own	Child
Roles & Permissions	Platform	Own College	No	No	No
101. CRITICAL SECURITY RULES

The following rules are NON-NEGOTIABLE:

Never trust frontend role information.
Never trust frontend college_id.
Never allow a normal user to change their own role.
Never allow a normal user to change their own college_id.
Never allow a normal user to become Super Admin.
Never expose Super Admin in normal login.
Never store passwords in plain text.
Never store passwords in frontend source code.
Never use /veneyd07744 as the only security mechanism.
Always enforce authorization server-side.
Enforce college isolation at database/API level.
Teacher access must be assignment-based.
Student access must be own-data based.
Parent access must be child-relationship based.
Admin access must be college-scoped.
Super Admin access must be platform-scoped.
Do not expose another user's private information.
Do not expose another college's data.
Do not rely only on hiding sidebar items.
Protected routes must be enforced.
API/database authorization must be enforced.
Historical academic data must remain consistent.
102. FRONTEND IMPLEMENTATION PHASE

At the frontend implementation stage:

Implement:

Auth state
Mock authentication if backend is not connected
Role detection
College detection
Protected routes
Role-based dashboard redirection
Role-based sidebar
Permission checks
Teacher assigned-class filtering
Student own-data filtering
Parent child-data filtering

Do not change the approved UI design.

103. BACKEND IMPLEMENTATION PHASE

When the backend is implemented later:

Replace mock authentication with the real authentication provider.

Recommended architecture:

React Frontend
       ↓
Authentication
       ↓
Backend/API
       ↓
Authorization
       ↓
Database

or, if using Supabase directly where appropriate:

React
 ↓
Supabase Auth
 ↓
PostgreSQL
 ↓
RLS / Authorization
104. DATABASE SECURITY

When database implementation begins, every sensitive query must be scoped by authorization.

For example:

Admin:

user.college_id = record.college_id

Teacher:

teacher.college_id = record.college_id
AND
record.class_id IN teacher.assigned_classes

Student:

record.student_id = authenticated_student_id

Parent:

record.student_id IN authenticated_parent_linked_children

These rules must be enforced server-side/database-side.

105. NO CROSS-COLLEGE DATA LEAK

This must be treated as a critical security requirement.

No API endpoint, database query, frontend request, or direct database operation should allow:

COL001 user
→
COL002 data

unless the user is an authorized Super Admin.

106. FUTURE SCALABILITY

The authentication architecture must support:

1 Super Admin
↓
100+ Colleges
↓
Each College
↓
Multiple Admins
↓
Hundreds of Teachers
↓
Thousands of Students
↓
Parents

The system must not rely on hardcoded college IDs, roles, users, or passwords.

107. APPROVED ROLE HIERARCHY

Final hierarchy:

SUPER ADMIN
│
├── College A
│   ├── Admin
│   ├── Teachers
│   ├── Students
│   └── Parents
│
├── College B
│   ├── Admin
│   ├── Teachers
│   ├── Students
│   └── Parents
│
└── College C
    ├── Admin
    ├── Teachers
    ├── Students
    └── Parents
108. FINAL AUTHENTICATION FLOW
Super Admin
/veneyd07744
↓
Super Admin Login
↓
Authenticate
↓
Verify Super Admin Role
↓
Super Admin Panel
↓
Create / Manage Colleges
Admin
Normal Login
↓
Email + Password
↓
Authenticate
↓
Role = Admin
↓
College ID = COL001
↓
Admin Dashboard
↓
Own College Data
Teacher
Normal Login
↓
Email + Password
↓
Authenticate
↓
Role = Teacher
↓
College ID
↓
Teacher ID
↓
Assigned Classes
↓
Teacher Dashboard
↓
Assigned Students/Data
Student
Normal Login
↓
Email + Password
↓
Authenticate
↓
Role = Student
↓
College ID
↓
Student ID
↓
Student Dashboard
↓
Own Data
Parent
Normal Login
↓
Email + Password
↓
Authenticate
↓
Role = Parent
↓
College ID
↓
Parent ID
↓
Linked Child
↓
Parent Dashboard
↓
Child Data
109. FINAL ACCEPTANCE CRITERIA

Authentication implementation will be considered successful only when:

Super Admin
 Separate login works
 /veneyd07744 is protected
 Super Admin is absent from normal login
 Super Admin can create colleges
 College IDs are unique
 Super Admin can manage colleges
 Super Admin can create/manage initial College Admin
Admin
 Admin login works
 Admin reaches Admin Dashboard
 Admin is restricted to own college
 Admin can manage authorized modules
 Admin permissions work
Teacher
 Teacher login works
 Teacher reaches Teacher Dashboard
 Teacher belongs to a college
 Teacher only sees assigned classes
 Teacher only sees students from assigned classes
 Teacher cannot access unrelated college data
 Teacher permissions work
Student
 Student login works
 Student reaches Student Dashboard
 Student sees only own data
 Student cannot access another student's private data
 Student is restricted to own college
Parent
 Parent login works
 Parent reaches Parent Dashboard
 Parent is linked to child/children
 Parent sees only linked child data
 Parent cannot access unrelated students
 Parent is restricted to own college
Security
 Passwords are securely handled
 No passwords are hardcoded
 College ID cannot be manipulated by normal users
 Role cannot be manipulated by normal users
 Protected routes work
 Unauthorized access is denied
 Cross-college access is blocked
 Backend/database authorization is planned and enforceable
 Frontend does not act as the only security layer
110. FINAL PRODUCT PRINCIPLE

The entire authentication and authorization system must follow this principle:

WHO ARE YOU?
     ↓
WHAT IS YOUR ROLE?
     ↓
WHICH COLLEGE DO YOU BELONG TO?
     ↓
WHAT PERMISSIONS DO YOU HAVE?
     ↓
WHAT ARE YOU ASSIGNED OR LINKED TO?
     ↓
WHAT DATA ARE YOU ALLOWED TO ACCESS?

Final access model:

SUPER ADMIN
→ ALL COLLEGES

ADMIN
→ OWN COLLEGE

TEACHER
→ OWN COLLEGE + ASSIGNED CLASSES/STUDENTS

STUDENT
→ OWN COLLEGE + OWN DATA

PARENT
→ OWN COLLEGE + LINKED CHILD DATA

The most important rule is:

ONE USER MUST ONLY ACCESS THE DATA THAT THEIR ROLE, COLLEGE, PERMISSIONS, AND RELATIONSHIPS AUTHORIZE.

This architecture must remain compatible with the future implementation of:

Supabase Authentication
PostgreSQL
Row Level Security
Node.js
Express.js
Secure API authorization
College-level multi-tenancy

The UI must remain unchanged unless explicitly requested.