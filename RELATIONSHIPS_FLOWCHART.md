# Entity Relationships & Data Integrity Flowchart

## Core Entities

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │         │   College    │         │   Platform  │
│             │         │              │         │    Admin    │
└─────────────┘         └──────────────┘         └─────────────┘
```

## User Model Fields

```
User {
  role: 'user' | 'college_admin' | 'platform_admin'
  managedCollege: ObjectId (only if role='college_admin')
  userProfile.miningColleges: [{
    college: ObjectId,
    addedAt: Date,
    referredUsers: [...]
  }]
}
```

## College Model Fields

```
College {
  admin: ObjectId (references User, only one admin per college)
  status: 'Unaffiliated' | 'Waitlist' | 'Building' | 'Live'
}
```

## CRITICAL DATA INTEGRITY RULES

### Rule 1: Bidirectional Consistency
```
IF College.admin = User._id
THEN User.role = 'college_admin' AND User.managedCollege = College._id

IF User.role = 'college_admin' AND User.managedCollege = College._id
THEN College.admin = User._id
```

### Rule 2: One-to-One Relationship
```
- One College can have AT MOST ONE admin (College.admin is single ObjectId)
- One User with role='college_admin' can manage AT MOST ONE college (User.managedCollege is single ObjectId)
```

### Rule 3: Role Consistency
```
IF User.role = 'college_admin'
THEN User.managedCollege MUST be set (cannot be null)

IF User.role = 'user'
THEN User.managedCollege MUST be null
```

## OPERATION FLOWCHARTS

### 1. ASSIGN COLLEGE ADMIN (Platform Admin Action)

```
START: assignCollegeAdmin(userId, collegeId)
│
├─ CHECK: User exists?
│  └─ NO → ERROR: User not found
│
├─ CHECK: User.role != 'college_admin'?
│  └─ NO → ERROR: Already a college admin
│
├─ CHECK: College exists?
│  └─ NO → ERROR: College not found
│
├─ CHECK: College.admin == null?
│  └─ NO → ERROR: College already has admin
│
├─ TRANSACTION START
│  │
│  ├─ SET User.role = 'college_admin'
│  ├─ SET User.managedCollege = collegeId
│  ├─ SAVE User
│  │
│  ├─ SET College.admin = userId
│  ├─ IF College.status == 'Unaffiliated' → SET status = 'Waitlist'
│  ├─ SAVE College
│  │
│  └─ TRANSACTION END
│
└─ SUCCESS
```

### 2. REMOVE COLLEGE ADMIN (Platform Admin Action)

```
START: removeCollegeAdmin(userId)
│
├─ CHECK: User exists AND User.role == 'college_admin'?
│  └─ NO → ERROR: College admin not found
│
├─ FIND: All colleges where College.admin == userId
│  (This handles data inconsistencies)
│
├─ TRANSACTION START
│  │
│  ├─ FOR EACH college in collegesWithThisAdmin:
│  │  ├─ SET College.admin = null
│  │  ├─ IF College.status IN ['Waitlist', 'Building'] → SET status = 'Unaffiliated'
│  │  └─ SAVE College
│  │
│  ├─ SET User.role = 'user'
│  ├─ SET User.managedCollege = null
│  ├─ INITIALIZE User.userProfile (if missing)
│  ├─ SAVE User
│  │
│  └─ TRANSACTION END
│
└─ SUCCESS
```

### 3. DELETE COLLEGE ADMIN (Platform Admin Action)

```
START: deleteCollegeAdmin(userId)
│
├─ CHECK: User exists AND User.role == 'college_admin'?
│  └─ NO → ERROR: College admin not found
│
├─ FIND: All colleges where College.admin == userId
│
├─ TRANSACTION START
│  │
│  ├─ FOR EACH college in collegesWithThisAdmin:
│  │  ├─ SET College.admin = null
│  │  ├─ IF College.status IN ['Waitlist', 'Building'] → SET status = 'Unaffiliated'
│  │  └─ SAVE College
│  │
│  ├─ DELETE User
│  │
│  └─ TRANSACTION END
│
└─ SUCCESS
```

### 4. REASSIGN COLLEGE ADMIN (Platform Admin Action)

```
START: reassignCollegeAdmin(userId, newCollegeId)
│
├─ CHECK: User exists AND User.role == 'college_admin'?
│  └─ NO → ERROR: College admin not found
│
├─ CHECK: User.managedCollege exists?
│  └─ NO → ERROR: Admin not managing any college
│
├─ CHECK: newCollege exists?
│  └─ NO → ERROR: New college not found
│
├─ CHECK: newCollege.admin == null?
│  └─ NO → ERROR: New college already has admin
│
├─ TRANSACTION START
│  │
│  ├─ OLD COLLEGE:
│  │  ├─ SET College.admin = null
│  │  ├─ IF College.status IN ['Waitlist', 'Building'] → SET status = 'Unaffiliated'
│  │  └─ SAVE College
│  │
│  ├─ USER:
│  │  ├─ SET User.managedCollege = newCollegeId
│  │  └─ SAVE User
│  │
│  ├─ NEW COLLEGE:
│  │  ├─ SET College.admin = userId
│  │  ├─ IF College.status == 'Unaffiliated' → SET status = 'Waitlist'
│  │  └─ SAVE College
│  │
│  └─ TRANSACTION END
│
└─ SUCCESS
```

### 5. COLLEGE ADMIN REGISTRATION (Self-Registration)

```
START: registerCollegeAdmin(email, name, phone, password, collegeId)
│
├─ VERIFY: OTP token valid
│
├─ CHECK: User doesn't already exist
│
├─ IF collegeId provided:
│  ├─ CHECK: College exists
│  ├─ CHECK: College.admin == null
│  └─ IF NO → ERROR: College already has admin
│
├─ CREATE: New User
│  ├─ role = 'college_admin'
│  ├─ managedCollege = collegeId (if provided)
│  └─ SAVE User
│
├─ IF collegeId provided:
│  ├─ SET College.admin = User._id
│  ├─ IF College.status == 'Unaffiliated' → SET status = 'Waitlist'
│  └─ SAVE College
│
└─ SUCCESS
```

## DATA INTEGRITY VALIDATION

### Validation Rule: College Admin Consistency Check

```
FOR EACH College WHERE College.admin != null:
│
├─ CHECK: User exists WHERE User._id == College.admin?
│  └─ NO → CLEAR College.admin = null, SET status = 'Unaffiliated'
│
├─ CHECK: User.role == 'college_admin'?
│  └─ NO → CLEAR College.admin = null, SET status = 'Unaffiliated'
│
├─ CHECK: User.managedCollege == College._id?
│  └─ NO → CLEAR College.admin = null, SET status = 'Unaffiliated'
│
└─ VALID → Keep relationship
```

## RELATIONSHIP DIAGRAM

```
                    ┌─────────────────┐
                    │     College     │
                    │                 │
                    │  admin: UserId  │──┐
                    └─────────────────┘  │
                           ▲              │
                           │              │
                           │              │ ONE-TO-ONE
                           │              │ RELATIONSHIP
                           │              │
                    ┌──────┴──────────────┴──────┐
                    │                             │
                    │         User                 │
                    │                             │
                    │  role: 'college_admin'      │
                    │  managedCollege: CollegeId   │◄──┘
                    └─────────────────────────────┘
                           │
                           │
                    ┌──────┴──────────────┐
                    │                     │
                    │  userProfile: {     │
                    │    miningColleges: [│
                    │      { college: ... }│
                    │    ]                │
                    │  }                  │
                    │                     │
                    └─────────────────────┘
                           │
                           │ MANY-TO-MANY
                           │ (Users can mine multiple colleges)
                           │
                    ┌──────▼──────────────┐
                    │     College         │
                    │                     │
                    │  (Users mine this)  │
                    └─────────────────────┘
```

## IDEAL BEHAVIOR SUMMARY

1. **Assignment**: Always update BOTH User.managedCollege AND College.admin atomically
2. **Removal**: Always clear BOTH User.managedCollege AND College.admin
3. **Deletion**: Always clear College.admin before deleting User
4. **Validation**: Check consistency on read operations (getAllColleges)
5. **Transactions**: Use database transactions for multi-document updates
6. **Status Updates**: Update college status when admin is assigned/removed

## CURRENT ISSUES

1. ❌ No database transactions - updates can be partial
2. ❌ Validation runs on every getAllColleges request (performance issue)
3. ❌ No proactive validation - only reactive cleanup
4. ❌ No constraints at database level

---

# UI STRUCTURE AUDIT

## PLATFORM ADMIN UI - FRAGMENTED STRUCTURE

### Current Pages:
```
/platform-admin/
├── dashboard (PlatformAdminDashboard.jsx)
├── users (Users.jsx) - List view with modals
├── users/:id (UserView.jsx) - Individual user view
├── college-admins/:id (CollegeAdminView.jsx) - Individual admin view
├── colleges (Colleges.jsx) - Table view with modals
├── colleges/create (CollegeCreate.jsx) - Create form
├── colleges/:id/edit (CollegeEdit.jsx) - Edit form
├── colleges/bulk-import-* (3 pages for bulk import)
├── ambassadors (Ambassadors.jsx)
└── subscribers (Subscribers.jsx)
```

### Issues:
1. ❌ **No dedicated college view page** - Only modal dialogs
   - Cannot see full college details in dedicated page
   - Cannot see: admin info, miners list, mining sessions, wallet data, history
   - Modal is limited and doesn't show comprehensive data

2. ❌ **College edit page doesn't sync with all items**
   - Platform admin can edit college (CollegeEdit.jsx)
   - College admin can also edit college (CollegeProfile.jsx)
   - No clear indication of who can edit what fields
   - No conflict resolution if both edit simultaneously
   - Status field editable by platform admin but not synced with admin assignment

3. ❌ **Fragmented admin management**
   - College admins shown in Users page with filter
   - No dedicated "College Admins" section
   - Cannot see which admin manages which college easily
   - Cannot see orphaned colleges (colleges with invalid admin references)

4. ❌ **No college detail view**
   - Missing: `/platform-admin/colleges/:id` route
   - Should show: admin info, miners, sessions, stats, edit history, etc.

## COLLEGE ADMIN UI

### Current Pages:
```
/college-admin/
├── dashboard (CollegeAdminDashboard.jsx)
├── overview (Overview.jsx)
├── college (CollegeProfile.jsx) - Edit college details
├── token (TokenPreferences.jsx) - Edit token preferences
├── leaderboard (Leaderboard.jsx)
├── community (Community.jsx)
└── settings (Settings.jsx)
```

### Issues:
1. ❌ **College selection flow**
   - After registration, admin must select college via `/auth/college-admin-selection`
   - If admin is removed, they're redirected to selection page
   - But if college.admin is set but user.managedCollege is null, college shows as "claimed"

2. ❌ **No visibility into admin status**
   - College admin cannot see if they're properly assigned
   - Cannot see if college status matches their assignment

## USER UI - COLLEGE SELECTION

### Current Flow:
```
User Registration → /auth/college-selection → Select colleges to mine
```

### Issues:
1. ❌ **Shows "claimed" colleges incorrectly**
   - If College.admin is set but User doesn't exist or is invalid, college still shows as "claimed"
   - User cannot select it even though it's actually unclaimed

2. ❌ **No indication of why college is unavailable**
   - Doesn't show: "Already has admin: [name]"
   - Doesn't show: "Status: Waitlist/Building/Live"

## COLLEGE ADMIN SELECTION FLOW

### Current Flow:
```
College Admin Registration → OTP Verification → /auth/college-admin-selection → Select/Create College
```

### Issues:
1. ❌ **Shows "claimed" colleges incorrectly**
   - Same issue as user selection - shows claimed even if admin is invalid

2. ❌ **No way to see who claimed a college**
   - Admin cannot see which admin user claimed a college
   - Cannot request transfer or contact existing admin

---

# EDGE CASES & WHAT HAPPENS

## 1. ORPHANED COLLEGE (College.admin points to deleted/non-existent user)

### Current Behavior:
- ✅ `getAllColleges` validates and clears invalid admin references
- ❌ But this happens on EVERY request (performance issue)
- ❌ College shows as "claimed" until next getAllColleges call
- ❌ No proactive cleanup

### What Should Happen:
- ✅ Database-level constraint or trigger
- ✅ Background job to validate and fix orphaned references
- ✅ UI should show "Unclaimed" immediately after admin deletion

### Backend Code:
```javascript
// server/src/controllers/college.controller.js:64-112
// Validates admin references on every getAllColleges call
// Clears invalid references and resets status
```

## 2. DELETED COLLEGE

### Current Behavior (deleteCollege):
```javascript
// server/src/controllers/platformAdmin.controller.js:373-469
1. ✅ Stops all active mining sessions
2. ✅ Removes college from all users' miningColleges arrays
3. ✅ Preserves wallet data (soft delete)
4. ✅ Sends notifications to affected miners
5. ✅ Clears admin's managedCollege if college had admin
6. ✅ Deletes college document
```

### What Happens to Miners:
- ✅ Mining sessions stopped
- ✅ College removed from mining list
- ✅ Wallet balances preserved
- ✅ Notifications sent
- ✅ Can continue mining other colleges

### What Happens to Admin:
- ✅ Admin's `managedCollege` set to null
- ❌ Admin's `role` NOT changed to 'user' (should it be?)
- ❌ Admin redirected to college selection page on next login

### Issues:
1. ❌ Admin role remains 'college_admin' but has no college
2. ❌ No clear path for admin after college deletion
3. ❌ Admin should be notified about college deletion

## 3. ADMIN REMOVED FROM COLLEGE

### Current Behavior (removeCollegeAdmin):
```javascript
// server/src/controllers/platformAdmin.controller.js:1020-1115
1. ✅ Finds ALL colleges with this admin (handles inconsistencies)
2. ✅ Clears College.admin for all found colleges
3. ✅ Resets college status to 'Unaffiliated' if Waitlist/Building
4. ✅ Changes User.role to 'user'
5. ✅ Clears User.managedCollege
6. ✅ Sends email notification
```

### What Happens to College:
- ✅ Status reset to 'Unaffiliated'
- ✅ Admin field cleared
- ✅ College becomes available for new admin

### What Happens to Admin:
- ✅ Role changed to 'user'
- ✅ Can now mine colleges like regular users
- ✅ Email notification sent

### Issues:
1. ❌ No UI indication that admin was removed
2. ❌ Admin might still see college in their dashboard until refresh
3. ❌ No redirect to user dashboard after removal

## 4. ADMIN DELETED (User account deleted)

### Current Behavior (deleteCollegeAdmin):
```javascript
// server/src/controllers/platformAdmin.controller.js:926-976
1. ✅ Finds ALL colleges with this admin
2. ✅ Clears College.admin for all found colleges
3. ✅ Resets college status to 'Unaffiliated' if Waitlist/Building
4. ✅ Deletes User document
```

### What Happens to College:
- ✅ Admin field cleared
- ✅ Status reset to 'Unaffiliated'
- ✅ College becomes available

### Issues:
1. ❌ No notification to college's miners about admin change
2. ❌ No audit trail of who deleted the admin

## 5. COLLEGE WITH INVALID ADMIN REFERENCE

### Current Behavior:
- ✅ `getAllColleges` validates on every request
- ✅ Clears invalid references automatically
- ❌ Performance impact (validates all colleges on every request)

### What Should Happen:
- ✅ Database-level validation
- ✅ Background job for cleanup
- ✅ Immediate UI update after fix

## 6. SIMULTANEOUS EDITS (Platform Admin + College Admin)

### Current Behavior:
- ❌ No conflict detection
- ❌ Last save wins
- ❌ No version control or locking

### What Should Happen:
- ✅ Optimistic locking (version field)
- ✅ Conflict detection and resolution
- ✅ Clear ownership: Platform admin can edit all fields, College admin limited fields

## 7. COLLEGE STATUS VS ADMIN ASSIGNMENT MISMATCH

### Current Issues:
- ❌ Platform admin can manually set status in CollegeEdit.jsx
- ❌ Status can be "Waitlist" but college has no admin
- ❌ Status can be "Unaffiliated" but college has admin
- ❌ No validation that status matches admin state

### What Should Happen:
- ✅ Status should be derived from admin assignment:
  - `Unaffiliated` = no admin
  - `Waitlist` = has admin
  - `Building` = admin sets this
  - `Live` = admin sets this
- ✅ Status field should be read-only for platform admin (or auto-updated)

---

# MISSING FEATURES

## Platform Admin:
1. ❌ Dedicated college view page (`/platform-admin/colleges/:id`)
   - Show: Admin info, Miners list, Active sessions, Stats, Edit history
2. ❌ College admin management page
   - List all college admins with their colleges
   - See orphaned colleges
   - Bulk operations
3. ❌ Audit trail
   - Who edited what and when
   - Who assigned/removed admins
4. ❌ Conflict resolution for simultaneous edits
5. ❌ Status validation (status must match admin state)

## College Admin:
1. ❌ Visibility into admin assignment status
2. ❌ Cannot see who else might be assigned (if bug occurs)
3. ❌ No way to request college transfer

## Users:
1. ❌ Cannot see why college is unavailable
2. ❌ Cannot see college admin name
3. ❌ No indication of college status

---

# IDEAL UI STRUCTURE

## Platform Admin:
```
/platform-admin/
├── dashboard
├── colleges/
│   ├── / (list with filters, search, bulk actions)
│   ├── /create
│   ├── /:id (DEDICATED VIEW PAGE - MISSING)
│   │   ├── Overview (stats, admin info)
│   │   ├── Miners (list of all miners)
│   │   ├── Sessions (active/inactive mining sessions)
│   │   ├── Settings (edit form)
│   │   └── History (audit trail)
│   └── /:id/edit
├── college-admins/ (DEDICATED SECTION - MISSING)
│   ├── / (list all admins with colleges)
│   ├── /:id (admin details + college info)
│   └── /assign (assign admin to college)
└── users/
```

## College Admin:
```
/college-admin/
├── dashboard
├── college/ (edit college - limited fields)
├── miners/ (view all miners for their college)
├── sessions/ (view all mining sessions)
└── settings
```

## Users:
```
/user/
├── dashboard
├── colleges/ (list of colleges they're mining)
└── college/:id (view college details, start mining)
```

---

# RECOMMENDATIONS

1. **Create dedicated college view page** for platform admin
2. **Create college admin management section** separate from users
3. **Add database transactions** for all admin assignment/removal operations
4. **Add background job** for orphaned reference cleanup (instead of on every request)
5. **Add status validation** - status must match admin assignment state
6. **Add conflict detection** for simultaneous edits
7. **Add audit trail** for all admin operations
8. **Fix UI to show accurate "claimed" status** based on validated data
9. **Add notifications** for admins when their college is deleted or they're removed
10. **Add redirect logic** after admin removal/deletion


---

# IMPLEMENTATION DECISIONS

**Priority Order**: 
1. Data integrity fixes first (transactions, validation) - prevents corruption
2. UI improvements second (college view page, admin management) - improves usability
3. Nice-to-haves last (audit trail, optimistic locking)

**Admin Role After College Deletion**: Change admin role to 'user' when college is deleted. Clear managedCollege. Send email + in-app notification. Redirect to user dashboard on next login.

**Status Field Ownership**: 
- Unaffiliated/Waitlist: Auto-managed (changes when admin assigned/removed)
- Building/Live: Can be set by college admin or platform admin, but validated that admin exists
- Platform admin can manually override but gets warning if status doesn't match admin state

**College Selection Display**: 
- Show "Claimed by [Admin Name]" for claimed colleges
- Show status badge (Waitlist/Building/Live)
- Show admin email on hover/tooltip
- Only show colleges with valid admin references (use validated data)

**Audit Trail Scope**: 
- Log all admin operations (assign/remove/delete/reassign) with before/after
- Log all college field edits (which fields changed, old/new values)
- Include: userId, timestamp, ipAddress, userAgent

**Background Job Frequency**: Every 10 minutes. Validates all colleges, fixes orphaned references, logs fixes.

**Notifications**: 
- Admin removal/deletion: Email + in-app to admin
- College deletion: Email + in-app to admin AND all miners
- Admin changes: In-app notification to all miners of that college

**College Admin Edit Permissions**: 
- Can edit: description, about, mission, vision, contact info, social media, departments, student life, logo, cover image, video
- Cannot edit: name, country, status, baseRate, referralBonusRate
- Platform admin can edit everything

**Build Order**: 
1. Data integrity fixes (transactions, validation job)
2. College view page
3. College admin management section
4. UI fixes (selection pages, status display)
5. Audit trail
6. Optimistic locking (if needed)

