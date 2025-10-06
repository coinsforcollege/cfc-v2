# Coins For College - Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Create Environment File
Create a `.env` file in the `/server` directory with the following variables:

```env
NODE_ENV=development
PORT=4000

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://aman:sujata12@cfc2demo.dqzhcd7.mongodb.net/?retryWrites=true&w=majority&appName=cfc2demo

# JWT Secret (use a strong random string)
JWT_SECRET=cfc2_super_secret_jwt_key_12345_make_it_very_long_and_secure

# JWT Token Expiry
JWT_EXPIRE=30d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 3. Run the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:4000`

## API Endpoints

### Authentication

#### Register Student
- **POST** `/api/auth/register/student`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "collegeId": "optional_existing_college_id",
  "newCollege": {
    "name": "Harvard University",
    "country": "USA",
    "logo": "optional_logo_url"
  },
  "referralCode": "optional_referral_code"
}
```

#### Register College Admin
- **POST** `/api/auth/register/college`
- **Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@college.edu",
  "phone": "9876543210",
  "password": "password123",
  "collegeId": "optional_existing_college_id",
  "newCollege": {
    "name": "MIT",
    "country": "USA",
    "logo": "optional_logo_url"
  }
}
```

#### Login (All User Types)
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Platform Admin Login:**
```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

#### Logout
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`

### Colleges

#### Get All Colleges
- **GET** `/api/colleges?search=harvard&country=USA&page=1&limit=50`

#### Search Colleges (Autocomplete)
- **GET** `/api/colleges/search?q=har`

#### Get Single College
- **GET** `/api/colleges/:id`

### Health Check
- **GET** `/api/health`

## Testing with Postman

1. Test health check: `GET http://localhost:4000/api/health`
2. Register a student: `POST http://localhost:4000/api/auth/register/student`
3. Login: `POST http://localhost:4000/api/auth/login`
4. Copy the token from login response
5. Test protected route: `GET http://localhost:4000/api/auth/me` with header `Authorization: Bearer <token>`

## Database Models

### User
- Students (role: 'student')
- College Admins (role: 'college_admin')
- Platform Admin (role: 'platform_admin')

### College
- College information
- Token preferences
- Statistics (miners, tokens mined)

### MiningSession
- Tracks active mining sessions
- Earning rates and tokens earned

### Wallet
- Student token balances per college

