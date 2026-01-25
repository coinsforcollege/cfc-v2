# College Scholarship & Offer System - Implementation Plan

## Overview

Build a complete scholarship offer system where college admins can browse students, send scholarship offers, and students can view/accept/reject offers via the rfe-app mobile application. Additionally, implement a Google Drive-like documents management system for students.

---

## Phase 1: Database Schema

### 1.1 User Model Additions

**File:** `/server/src/models/User.js`

Add to `userProfile` schema:
```javascript
country: { type: String, trim: true, default: null },
gradeLevel: {
  type: String,
  enum: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', null],
  default: null
}
```

### 1.2 New Models to Create

| Model | File | Purpose |
|-------|------|---------|
| Folder | `/server/src/models/Folder.js` | Folder organization for docs |
| Document | `/server/src/models/Document.js` | Student document storage |
| ScholarshipOffer | `/server/src/models/ScholarshipOffer.js` | Scholarship offers from colleges |
| StudentOfferResponse | `/server/src/models/StudentOfferResponse.js` | Student responses to offers |

**ScholarshipOffer Fields:**
- college (ref: College)
- createdBy (ref: User)
- title, totalValue, currency, terms, description
- formalLetter (editable template)
- requiredDocuments (array: name, description, required)
- targeting: { type, students[], countries[], gradeLevels[], pointsRange: {min, max} }
- status (draft/active/expired/cancelled)
- expiryDate, isRecommended (Boolean - college gets 5 recommended slots per month)

**StudentOfferResponse Fields:**
- student (ref: User)
- offer (ref: ScholarshipOffer)
- status (pending/accepted/rejected)
- submittedDocuments (array: requiredDocId, document ref, submittedAt)
- respondedAt, rejectionReason

**Document Fields:**
- user (ref: User)
- folder (ref: Folder, null = root)
- name, url, fileType, mimeType, size (max 25MB)
- source (upload/offer/task_submission)
- sourceReference, sourceModel
- isPublic (Boolean, default: true) - Toggle for college visibility

**Folder Fields:**
- user (ref: User)
- name, parent (ref: Folder), path

---

## Phase 2: Backend Endpoints

### 2.1 College Admin Routes (extend `/server/src/routes/collegeAdmin.routes.js`)

**Student Browsing:**
- `GET /students` - Browse students with filters (country, grade, points range)
- `GET /students/:id` - Student details with scholarship wallet
- `GET /students/:id/points-history` - Earning breakdown
- `GET /students/:id/documents` - View student documents

**Offer Management:**
- `GET /offers` - List college's offers
- `POST /offers` - Create offer (with targeting)
- `GET /offers/:id` - Offer details with responses
- `PUT /offers/:id` - Update offer
- `DELETE /offers/:id` - Cancel offer
- `GET /offers/:id/responses` - All student responses
- `GET /letter-template` - Auto-generated template

### 2.2 Student Offer Routes (new: `/server/src/routes/studentOffer.routes.js`)

- `GET /` - My offers (query: status=active|accepted|rejected)
- `GET /recommended` - Single random recommended offer
- `GET /:id` - Offer details
- `POST /:id/accept` - Accept with documents
- `POST /:id/reject` - Reject offer

### 2.3 Student Document Routes (new: `/server/src/routes/studentDocument.routes.js`)

- `GET /` - Documents in folder (query: folderId)
- `GET /folders` - All folders
- `POST /folders` - Create folder
- `PUT /folders/:id` - Rename folder
- `DELETE /folders/:id` - Delete folder + contents
- `POST /upload` - Upload files (max 25MB each)
- `GET /:id` - Document details
- `PUT /:id` - Update metadata/move
- `DELETE /:id` - Delete document
- `POST /move` - Bulk move documents

### 2.4 New Middleware

**File:** `/server/src/middlewares/documentUpload.js`
- 25MB file size limit
- Storage: `/public/documents/student-docs/`, `/public/images/student-docs/`, `/public/videos/student-docs/`

---

## Phase 3: Mobile App (rfe-app)

### 3.1 New API Files

| File | Purpose |
|------|---------|
| `/rfe-app/src/api/offers.api.ts` | Offer endpoints |
| `/rfe-app/src/api/documents.api.ts` | Document endpoints |

### 3.2 Offers Screen (`/rfe-app/app/(app)/offers.tsx`)

**Structure (following tasks.tsx pattern):**
- Header with search, user avatar
- Tab bar: Active | Accepted | Rejected
- Country filter chips
- Recommended offer card (top of Active tab)
- OfferListSection with FlatList

### 3.3 Offer Detail Screen (`/rfe-app/app/(app)/offers/[id].tsx`)

**Structure (following tasks/[id].tsx pattern):**
- Cover image with college logo
- Scholarship value display
- College info section
- Offer details + terms
- Required documents list
- Formal letter (expandable)
- Accept/Reject buttons
- AcceptOfferSheet (bottom sheet for document selection)

### 3.4 Documents Screen (`/rfe-app/app/(app)/documents.tsx`)

**Structure:**
- **Storage bar** at top (used/1GB with visual progress)
- Breadcrumb navigation
- Grid/List toggle
- FlatList (folders first, then files)
- FAB for upload/new folder
- File type icons, thumbnails for images
- **Visibility toggle** on each file (public/private icon)
- Long-press multi-select
- Action sheet (rename, move, delete, toggle visibility)

### 3.5 New Components

```
rfe-app/components/offers/
  OfferCard.tsx
  OfferListSection.tsx
  RecommendedOfferCard.tsx
  AcceptOfferSheet.tsx
  DocumentPickerSheet.tsx

rfe-app/components/documents/
  DocumentCard.tsx
  FolderCard.tsx
  DocumentListSection.tsx
  FolderBreadcrumb.tsx
  CreateFolderSheet.tsx
  DocumentActionSheet.tsx
  MoveToSheet.tsx
  FilePreviewModal.tsx
```

---

## Phase 4: College Admin Web Dashboard

### 4.1 New Pages (in `/client/src/pages/collegeAdmin/`)

| Page | Purpose |
|------|---------|
| `Students.jsx` | Browse students with filters (country, grade, points range) |
| `StudentView.jsx` | View student profile, points history, documents |
| `Offers.jsx` | List all college offers with tabs (Active/Draft/Expired) |
| `OfferCreate.jsx` | Create/edit offer form with targeting options |
| `OfferView.jsx` | View offer details and student responses |

### 4.2 Key Components (in `/client/src/components/collegeAdmin/`)

- `StudentCard.jsx` - Card for student list
- `StudentFilters.jsx` - Country, grade, points range filters
- `PointsHistoryTable.jsx` - Scholarship transaction history
- `DocumentBrowser.jsx` - View student's public documents
- `OfferCard.jsx` - Card for offer list
- `OfferForm.jsx` - Create/edit offer form
- `TargetingSelector.jsx` - Select targeting criteria
- `LetterEditor.jsx` - Rich text editor for formal letter
- `ResponsesList.jsx` - List of student responses

### 4.3 Navigation

Add to college admin sidebar (`DashboardSidebar.jsx`):
- Students (new)
- Offers (new)

---

## Phase 5: Notifications

Add to Notification model types:
- `scholarship_offer_received` - Student gets new offer
- `scholarship_offer_expiring` - 7 days before expiry
- `scholarship_offer_accepted` - College: student accepted
- `scholarship_offer_rejected` - College: student rejected

---

## Implementation Sequence

### Backend First (with Postman testing after each endpoint):

**Chunk 1: User Model + Document Models**
1. Add country, gradeLevel to User model
2. Create Folder model
3. Create Document model
4. Test schema validation

**Chunk 2: Document API**
5. Create documentUpload middleware
6. Create studentDocument routes + controller
7. Implement: getFolders, createFolder, renameFolder, deleteFolder
8. Test with Postman
9. Implement: getDocuments, uploadDocuments, getDocument
10. Test with Postman
11. Implement: updateDocument, deleteDocument, moveDocuments
12. Test with Postman

**Chunk 3: Offer Models**
13. Create ScholarshipOffer model
14. Create StudentOfferResponse model
15. Test schema validation

**Chunk 4: College Admin Student Browsing**
16. Implement getStudents endpoint
17. Test with Postman
18. Implement getStudentDetails endpoint
19. Test with Postman
20. Implement getStudentPointsHistory endpoint
21. Test with Postman
22. Implement getStudentDocuments endpoint
23. Test with Postman

**Chunk 5: College Admin Offer Management**
24. Implement createOffer + letter template
25. Test with Postman
26. Implement getOffers, getOfferDetails
27. Test with Postman
28. Implement updateOffer, deleteOffer
29. Test with Postman
30. Implement getOfferResponses
31. Test with Postman

**Chunk 6: Student Offer API**
32. Create studentOffer routes + controller
33. Implement getMyOffers
34. Test with Postman
35. Implement getRecommendedOffer
36. Test with Postman
37. Implement getOfferDetails
38. Test with Postman
39. Implement acceptOffer (with document handling)
40. Test with Postman
41. Implement rejectOffer
42. Test with Postman

### Frontend (after backend is tested):

**Chunk 7: Documents API + Screen**
43. Create documents.api.ts
44. Create DocumentCard, FolderCard components
45. Create DocumentListSection component
46. Implement documents.tsx screen
47. Test document listing and navigation

**Chunk 8: Document CRUD UI**
48. Create CreateFolderSheet
49. Create DocumentActionSheet
50. Implement upload, rename, delete
51. Test all operations
52. Create MoveToSheet
53. Implement move functionality
54. Test move

**Chunk 9: Offers API + Screen**
55. Create offers.api.ts
56. Create OfferCard, OfferListSection components
57. Create RecommendedOfferCard component
58. Implement offers.tsx screen with tabs
59. Test offers list

**Chunk 10: Offer Detail + Accept/Reject**
60. Create offers/[id].tsx screen
61. Create AcceptOfferSheet
62. Create DocumentPickerSheet
63. Implement accept/reject flow
64. Test complete flow

**Chunk 11: College Admin Web - Students**
65. Create Students.jsx page with filters
66. Test student browsing
67. Create StudentView.jsx page
68. Test student details view

**Chunk 12: College Admin Web - Offers**
69. Create Offers.jsx page with tabs
70. Test offer listing
71. Create OfferCreate.jsx with form
72. Test offer creation
73. Create OfferView.jsx with responses
74. Test offer viewing

**Chunk 13: Notifications**
75. Add notification types
76. Create offer notification service
77. Integrate with offer actions
78. Test notifications

---

## Critical Files Reference

**Patterns to follow:**
- `/rfe-app/app/(app)/tasks.tsx` - Tab-based screen with filters
- `/rfe-app/app/(app)/tasks/[id].tsx` - Detail screen pattern
- `/rfe-app/components/tasks/TaskListSection.tsx` - FlatList with pagination
- `/rfe-app/components/tasks/SubmissionSheet.tsx` - File picker integration
- `/server/src/middlewares/submissionUpload.js` - Multer pattern
- `/server/src/controllers/studentTask.controller.js` - File upload handling

**Files to modify:**
- `/server/src/models/User.js` - Add userProfile fields
- `/server/src/routes/collegeAdmin.routes.js` - Add new routes
- `/server/src/controllers/collegeAdmin.controller.js` - Add new functions
- `/server/src/models/Notification.js` - Add notification types
- `/rfe-app/app/(app)/offers.tsx` - Replace placeholder
- `/rfe-app/app/(app)/documents.tsx` - Replace placeholder

**New files to create:**
- `/server/src/models/Folder.js`
- `/server/src/models/Document.js`
- `/server/src/models/ScholarshipOffer.js`
- `/server/src/models/StudentOfferResponse.js`
- `/server/src/routes/studentOffer.routes.js`
- `/server/src/routes/studentDocument.routes.js`
- `/server/src/controllers/studentOffer.controller.js`
- `/server/src/controllers/studentDocument.controller.js`
- `/server/src/middlewares/documentUpload.js`
- `/rfe-app/src/api/offers.api.ts`
- `/rfe-app/src/api/documents.api.ts`
- `/rfe-app/app/(app)/offers/[id].tsx`
- All components listed in Phase 3.5
- `/client/src/pages/collegeAdmin/Students.jsx`
- `/client/src/pages/collegeAdmin/StudentView.jsx`
- `/client/src/pages/collegeAdmin/Offers.jsx`
- `/client/src/pages/collegeAdmin/OfferCreate.jsx`
- `/client/src/pages/collegeAdmin/OfferView.jsx`
- All components listed in Phase 4.2

---

## Verification Plan

1. **Backend testing:** Each endpoint tested via Postman before moving to next
2. **Document upload:** Test 25MB limit, 1GB total limit, file type validation
3. **Document visibility:** Test public/private toggle, verify colleges see only public docs
4. **Offer targeting:** Test each targeting type (individual, all, country, grade, points)
5. **Recommended offers:** Test 5 per month limit per college
6. **Accept flow:** Test document selection (existing + new upload)
7. **Mobile screens:** Test on both iOS and Android
8. **Web dashboard:** Test all college admin pages in browser
9. **End-to-end flow:**
   - College browses students on web dashboard
   - College creates offer with targeting
   - Student receives notification in app
   - Student views offer details
   - Student accepts with documents (existing + new)
   - Documents appear in student's Docs tab
   - College sees response with documents

---

## Key Business Rules (Clarified)

### Recommended Offers
- Each college gets **5 recommended offer slots per month**
- College admin decides which offers to mark as recommended
- Track usage: `recommendedOffersUsedThisMonth` in College model
- Reset monthly (cron job or on-demand check)

### Document Visibility
- **Default: PUBLIC** - All files visible to any college by default
- Students can toggle individual files to **private**
- Documents submitted when accepting an offer are **always visible** to that specific college (regardless of toggle)
- College admins can browse public documents from any student's profile

### Storage Limits
- **1GB total** storage per student
- **25MB per file** maximum
- Show **storage usage bar** on documents page
- Track: `storageUsed` field in User model or calculate on demand

### College Admin UI
- **Web dashboard only** - No mobile app for college admins
- Add new pages to existing `/pages/collegeAdmin/` directory
