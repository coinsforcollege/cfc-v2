# College Admin Registration Implementation

## Overview

This implementation creates a complete multi-step college admin registration system according to the scope of work requirements. The system includes college verification, personal information collection, college profile setup, and optional token configuration.

## New API Endpoints

### Admin Registration Flow

#### Step 1: College Verification
```
POST /api/v1/auth/admin/register/step1
```
**Purpose**: Verify college and work email  
**Body**:
```json
{
  "workEmail": "admin@university.edu",
  "position": "Director of Student Affairs",
  "collegeId": "college_object_id",
  "createNewCollege": false,
  "newCollegeData": {  // Only if createNewCollege: true
    "name": "New University",
    "shortName": "NU",
    "city": "City Name",
    "state": "State",
    "zipCode": "12345",
    "country": "United States",
    "type": "public",
    "website": "https://university.edu",
    "email": "info@university.edu"
  }
}
```

#### Step 2: Personal Information
```
POST /api/v1/auth/admin/register/step2
```
**Purpose**: Create user account with personal details  
**Body**:
```json
{
  "tempToken": "session_token_from_step1",
  "collegeId": "college_object_id",
  "workEmail": "admin@university.edu",
  "firstName": "John",
  "lastName": "Doe",
  "workPhone": "+1234567890",
  "password": "securepassword",
  "position": "Director of Student Affairs",
  "department": "Student Services"
}
```

#### Step 3: College Profile Setup
```
POST /api/v1/auth/admin/register/step3
```
**Purpose**: Update college profile information  
**Requires**: Email verification  
**Body**:
```json
{
  "tempToken": "session_token",
  "collegeId": "college_object_id",
  "logo": "logo_url_or_path",
  "description": "College description",
  "establishedYear": 1950,
  "enrollment": {
    "total": 15000,
    "undergraduate": 12000,
    "graduate": 3000
  },
  "socialMedia": {
    "facebook": "https://facebook.com/university",
    "twitter": "https://twitter.com/university"
  },
  "colors": {
    "primary": "#003366",
    "secondary": "#FF6600"
  }
}
```

#### Step 4: Token Configuration (Optional)
```
POST /api/v1/auth/admin/register/step4
```
**Purpose**: Configure college token or skip  
**Body**:
```json
{
  "tempToken": "session_token",
  "collegeId": "college_object_id",
  "skipTokenConfig": false,
  "tokenName": "University Token",
  "tokenSymbol": "UNI",
  "tokenDescription": "Token for university services",
  "maxSupply": 1000000,
  "earnMethods": ["daily_login", "event_attendance"],
  "spendMethods": ["dining", "bookstore"],
  "customEarnMethods": ["Custom earn method"],
  "customSpendMethods": ["Custom spend method"],
  "launchTimeline": "q2_2024",
  "tokenIcon": "token_icon_url",
  "colorScheme": "blue"
}
```

#### Complete Registration (Skip Token)
```
POST /api/v1/auth/admin/register/complete
```
**Purpose**: Complete registration without token configuration  
**Body**:
```json
{
  "tempToken": "session_token",
  "collegeId": "college_object_id"
}
```

### Admin Verification (Platform Admin Only)

#### Get Pending Verifications
```
GET /api/v1/admin/pending-verifications?page=1&limit=20
```
**Purpose**: List all pending admin verifications  
**Access**: Platform Admin only

#### Verify Admin
```
POST /api/v1/admin/verify-admin/:userId
```
**Purpose**: Approve or reject admin verification  
**Body**:
```json
{
  "approved": true,
  "reason": "Optional reason for approval/rejection"
}
```

#### Get Verification Details
```
GET /api/v1/admin/verification/:userId
```
**Purpose**: Get detailed information about admin verification

#### Get Verification Statistics
```
GET /api/v1/admin/verification-stats
```
**Purpose**: Get verification statistics dashboard data

## Model Changes

### User Model Updates
Added new fields for college admins:
- `workPhone`: Work phone number
- `workEmail`: Work email address (separate from personal)
- `department`: Department within the college
- `adminVerificationSubmittedAt`: When verification was submitted
- `adminVerificationDocuments`: Array of document paths

### College Model
No changes needed - existing structure supports all requirements.

## Middleware Updates

### Enhanced Email Validation
Updated `validateCollegeEmail` middleware to:
- Enforce `.edu` requirement for college admins
- Provide better domain matching logic
- Handle edge cases with invalid college websites
- Only validate college admin emails

## Key Features Implemented

### 1. Multi-Step Registration Process
✅ **4-step process as per requirements**:
- Step 1: College verification with optional college creation
- Step 2: Personal information with account creation
- Step 3: College profile setup (requires email verification)
- Step 4: Optional token configuration

### 2. College Email Validation
✅ **Strict .edu requirement** for college admins
✅ **Domain matching** with college website (when available)
✅ **Proper error handling** for edge cases

### 3. College Creation Integration
✅ **Add new college** during admin signup
✅ **Duplicate prevention** with case-insensitive name checking
✅ **Proper college status** management (pending → active)

### 4. Token Configuration
✅ **Optional step** in registration flow
✅ **Complete token setup** with all required fields
✅ **Skip option** with ability to configure later

### 5. Admin Verification Workflow
✅ **Platform admin verification** system
✅ **Email notifications** for approval/rejection
✅ **Verification statistics** and dashboard
✅ **Detailed admin profiles** for verification

### 6. Security & Validation
✅ **Comprehensive input validation** for all steps
✅ **Email verification requirement** before profile setup
✅ **Session management** with temporary tokens
✅ **Role-based access control**

## Breaking Changes

### Student Registration Only
The existing `/api/v1/auth/register` endpoint now **only accepts student registrations**. College admins attempting to use this endpoint will receive an error directing them to the multi-step process.

### Validation Updates
- Removed `college_admin` from allowed roles in general registration
- Updated validation rules to reflect student-only registration

## File Structure

### New Files Created:
- `server/src/controllers/adminAuth.controllers.js` - Multi-step admin registration
- `server/src/routes/adminAuth.routes.js` - Admin registration routes
- `server/src/controllers/adminVerification.controllers.js` - Platform admin verification
- `server/src/routes/adminVerification.routes.js` - Verification management routes

### Modified Files:
- `server/src/models/userModels.js` - Added admin-specific fields
- `server/src/middlewares/auth.middlewares.js` - Enhanced email validation
- `server/src/controllers/auth.controllers.js` - Restricted to student registration
- `server/src/routes/auth.routes.js` - Updated validation rules
- `server/src/app.js` - Added new route handlers

## Usage Examples

### Frontend Implementation Flow

1. **College Search/Creation**:
   ```javascript
   // Step 1: Search for college or create new one
   const response = await fetch('/api/v1/auth/admin/register/step1', {
     method: 'POST',
     body: JSON.stringify({
       workEmail: 'admin@university.edu',
       position: 'Director',
       collegeId: selectedCollegeId,
       createNewCollege: false
     })
   });
   ```

2. **Account Creation**:
   ```javascript
   // Step 2: Create admin account
   const { tempToken, collegeId } = step1Response.data;
   await fetch('/api/v1/auth/admin/register/step2', {
     method: 'POST',
     body: JSON.stringify({
       tempToken,
       collegeId,
       firstName: 'John',
       lastName: 'Doe',
       // ... other fields
     })
   });
   ```

3. **Email Verification Required**:
   ```javascript
   // User must verify email before proceeding to step 3
   // Verification happens via email link
   ```

4. **Profile Setup**:
   ```javascript
   // Step 3: Setup college profile
   await fetch('/api/v1/auth/admin/register/step3', {
     method: 'POST',
     headers: { Authorization: `Bearer ${userToken}` },
     body: JSON.stringify({
       tempToken,
       collegeId,
       logo: logoUrl,
       description: 'College description'
     })
   });
   ```

5. **Token Configuration or Complete**:
   ```javascript
   // Step 4: Configure token or skip
   await fetch('/api/v1/auth/admin/register/step4', {
     method: 'POST',
     headers: { Authorization: `Bearer ${userToken}` },
     body: JSON.stringify({
       tempToken,
       collegeId,
       skipTokenConfig: false,
       tokenName: 'University Token',
       tokenSymbol: 'UNI'
     })
   });
   ```

## Compliance with Scope of Work

This implementation fully addresses the requirements outlined in **Section C1. College Admin Signup Process**:

✅ **Step 1** - College Verification: ✓ Implemented  
✅ **Step 2** - Personal Information: ✓ Implemented  
✅ **Step 3** - College Profile Setup: ✓ Implemented  
✅ **Step 4** - Token Configuration: ✓ Implemented  

Additional features implemented beyond requirements:
- Platform admin verification system
- Enhanced security with email validation
- College creation during signup
- Comprehensive error handling
- Activity logging and analytics

## Next Steps

1. **Frontend Integration**: Implement the multi-step UI components
2. **File Upload**: Add logo and document upload functionality
3. **Email Templates**: Create branded email templates
4. **Testing**: Add comprehensive test coverage
5. **Documentation**: Create API documentation for frontend team
