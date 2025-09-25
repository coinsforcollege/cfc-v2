# **Complete Website Scope of Work**

## **USER NAVIGATION STRUCTURE**

### **Public Users (No Login)**

* Landing Page → Student Signup OR College Admin Signup OR Browse Colleges

  ### **Students (Logged In)**

* Dashboard → My College → Leaderboard → Referrals → Profile Settings

  ### **College Admins (Logged In)**

* Dashboard → Students → Token Settings → Profile Settings

  ### **Platform Admins (Internal)**

* Admin Dashboard → User Management → College Management → Analytics → System Settings  
  ---

  ## **A. PUBLIC PAGES (No Login Required)**

  ### **A1. Landing Page \- Home**

**Header Section:**

* Logo on top left  
* Navigation menu: "How It Works" | "Browse Colleges" | "Login" | "Sign Up"  
* Sign up button highlighted in different color

**Hero Section:**

* Headline: "Start Mining Your College Token Today"  
* Subheading explaining the concept in 1 sentence  
* Two call-to-action buttons: "Join as Student" | "Join as College"  
* Live counter showing total students mining (updates every 5 seconds)

**Live Activity Feed:**

* Box showing recent activities scrolling every 3 seconds  
* Format: "\[Student Name\] from \[College\] just started mining"  
* "\[College Name\] just joined the waitlist"  
* Shows 5 most recent activities at any time

**Real-Time Statistics Display:**

* Total students mining (large number)  
* Total colleges participating (large number)  
* Countries represented (large number)  
* Updates every 30 seconds automatically

**Interactive Map:**

* World map with dots representing colleges  
* Dot sizes based on number of students mining  
* Hover over dot shows: College name, student count, city/state  
* Pulsing animation for colleges with recent activity

**Top Colleges Leaderboard:**

* Table showing top 10 colleges by student interest  
* Columns: Rank, College Name, Students Mining, Growth (24h), Status  
* Status shows: "Students Only" | "Admin Verified" | "Token Configured"  
* Updates every 60 seconds

**How It Works Section:**

* 3 columns explaining process for students  
* 3 columns explaining process for colleges  
* Simple icons and 1-2 sentences each

  ### **A2. Browse Colleges Page**

**Search and Filter:**

* Search bar: "Find your college"  
* Filter dropdowns: State, College Type (Public/Private), Student Count Range  
* Sort options: "Most Students" | "Recently Joined" | "A-Z" | "Most Active"

**College Grid Display:**

* Each college shows: Logo, name, location, student count mining, admin status  
* Status badges: "Hot" (admin verified), "New" (joined last 7 days), "Growing" (50%+ growth)  
* Click on college goes to individual college page

**Statistics Summary:**

* Total colleges with students mining  
* Total colleges with verified admins  
* Average students per college  
* Most popular state

  ### **A3. Individual College Page (Public View)**

**College Header:**

* Logo, full name, location, website link  
* Admin status badge  
* "Join Mining" button (if user not logged in) or "Switch to This College" (if logged in to different college)

**Mining Statistics:**

* Total students mining tokens for this college  
* Daily/weekly growth chart  
* Ranking among all colleges  
* Average daily active miners

**Token Details (if configured by admin):**

* Token name and ticker symbol  
* Max supply planned  
* Use cases on campus  
* How students can earn tokens  
* How students can spend tokens  
* Launch timeline

**Student Activity:**

* Recent students who joined (first name \+ last initial)  
* Top miners leaderboard for this college  
* Mining activity chart (last 30 days)

**Compare with Similar Colleges:**

* 3-5 similar colleges (by size/type/location)  
* Quick comparison of student mining counts

  ### **A4. Public Statistics Page** {#a4.-public-statistics-page}

**Global Network Stats:**

* Total students mining (real-time counter)  
* Total colleges participating  
* Total tokens mined across all colleges  
* Countries represented

**Growth Trends:**

* Network growth chart (total users over time)  
* New colleges joining over time  
* Geographic expansion map

**Top Performers:**

* Top 20 colleges by student count  
* Fastest growing colleges (weekly)  
* Most active mining colleges (daily)

**Real-Time Activity:**

* Live feed of mining activities across all colleges  
* New student joins  
* New college admin signups  
* Recent token configurations

  ### **A5. How It Works Pages**

**For Students Page:**

* Step by step process with screenshots  
* "What is token mining?" explanation  
* "What can I do with tokens?" section  
* "How do referrals work?" section  
* FAQ section with common questions

**For Colleges Page:**

* Admin signup process explanation  
* Token configuration walkthrough  
* Student data and analytics overview  
* "Why should colleges participate?" section  
* Case studies or examples  
* FAQ for administrators  
  ---

  ## **B. STUDENT USER FLOW**

  ### **B1. Student Signup Process**

**Step 1 \- Basic Information:**

* Email address input (required)  
* Password input with strength indicator (required)  
* Confirm password (required)  
* First name (required)  
* Last name (required)  
* Phone number (required)  
* Checkbox: "I agree to terms and conditions"  
* "Continue" button

**Step 2 \- College Selection:**

* Search bar: "Type your college name"  
* Dropdown suggestions as user types  
* If college not found: "Don't see your college? Add it here" link  
* Shows selected college with logo and basic info  
* "My graduation year" dropdown (2024-2030)  
* "Continue" button

**Step 3 \- Verification:**

* "Enter the 6-digit code sent to your email"  
* 6 input boxes for verification code  
* "Resend code" link (disabled for 60 seconds after sending)  
* Phone verification: "Enter code sent to your phone"  
* 6 input boxes for phone code  
* "Verify and Create Account" button

**Step 4 \- Referral (Optional):**

* "Were you referred by someone?"  
* Input field for referral code  
* "Skip this step" link  
* "Complete Registration" button

**Success Page:**

* "Welcome\! Your account is ready"  
* "Start mining your \[College Name\] tokens"  
* Button: "Go to Dashboard"  
* Shows current mining rate and explains 24-hour cycles

  ### **B2. Student Dashboard (Main Page After Login)**

**Navigation Bar:**

* Logo | "Dashboard" | "My College" | "Leaderboard" | "Referrals" | Profile dropdown

**Mining Status Card:**

* Large circular progress indicator showing time until next mining session  
* "Mine Now" button (when available) or countdown timer  
* Daily streak counter: "Day 5 of mining"  
* Total tokens mined to date

**My College Information:**

* College name and logo  
* Current student count mining this college  
* Your rank among students at this college  
* College status: "Waitlist" | "Admin Joined" | "Token Configured"

**Referral Section:**

* "Invite Friends" button  
* Your referral code displayed  
* Number of successful referrals  
* Bonus tokens earned from referrals  
* Share buttons for social media with pre-filled text

**Recent Activity:**

* Your mining history (last 10 sessions)  
* Date, time, tokens earned per session  
* Bonus tokens received

**College Leaderboard (Top 10):**

* Rank, student name (first name \+ last initial), tokens mined  
* Your position highlighted if in top 10  
* "View Full Leaderboard" link

  ### **B3. My College Page (Student View- same as public view)**

**College Header:**

* College logo, name, location  
* Official website link  
* Social media links if available

**Token Information:**

* Token name and ticker (if set by college admin)  
* Token description (if set by college admin)  
* Planned use cases (if set by college admin)  
* Launch timeline (if set by college admin)

**Student Community:**

* Total students mining this college token  
* Growth chart (last 30 days)  
* Recent joiners (names and join dates)  
* Top miners for this college

**College Admin Status:**

* "No admin yet" | "Admin joined" | "Admin verified" | "Token configured"  
* If no admin: "Know someone at \[College\]? Invite them\!" with share tools

  ### **B4. Leaderboard Page**

[**Simply link to A4. Public Statistics Page**](#a4.-public-statistics-page)

### **B5. Referrals Page**

**Referral Statistics:**

* Total people referred  
* Successful referrals (verified accounts)  
* Bonus tokens earned  
* Current referral rate/bonus amount

**Referral Tools:**

* Your unique referral code (large, copyable)  
* Pre-written messages for different platforms  
* Share buttons for: Email, WhatsApp, Twitter, Facebook, Instagram  
* Custom message composer

**Referral History:**

* Table showing: Person referred, date, status (pending/verified), bonus earned  
* Status updates: "Email sent" | "Verified" | "Mining started"

  ### **B6. Student Profile Settings**

**Personal Information:**

* First name, last name editing  
* Email address (requires verification if changed)  
* Phone number (requires verification if changed)  
* Graduation year

**Account Settings:**

* Password change form  
* College switch option (with confirmation popup)  
* Account deletion option (with multiple confirmations)

**Notification Preferences:**

* Email mining reminders toggle  
* Referral success notifications toggle  
* College admin updates toggle  
* Weekly summary emails toggle  
  ---

  ## **C. COLLEGE ADMIN USER FLOW**

  ### **C1. College Admin Signup Process**

**Step 1 \- College Verification:**

* "Find your college" search bar  
* Select from dropdown suggestions  
* If not found: "Add new college" with form  
* "I work at this college" checkbox  
* Official college email required (@collegename.edu format)  
* Position/title at college  
* "Continue" button

**Step 2 \- Personal Information:**

* First name, last name  
* Work phone number  
* Password creation  
* "Verify Email" sends code to college email  
* Email verification required to proceed

**Step 3 \- College Profile Setup:**

* Upload college logo  
* Verify/edit college information (address, website, etc.)  
* Select college type: Public/Private/Community College/Other  
* Estimated enrollment numbers  
* "Save and Continue"

**Step 4 \- Token Configuration (Optional):**

* "Configure your future token now or skip and do later"  
* Token name input  
* Token ticker symbol (3-5 characters)  
* Max supply (dropdown with common options)  
* Brief description of planned use cases  
* "Save Configuration" or "Skip for Now"

  ### **C2. College Admin Dashboard (Main Page After Login)**

**Navigation Bar:**

* Logo | "Dashboard" | "Students" | "Token Settings" | Profile dropdown

**Overview Cards:**

* Students interested in your college (large number)  
* Daily growth rate  
* Your ranking among colleges  
* Days since admin account created

**Student Interest Data:**

* Total students mining your college token  
* Growth chart (customizable time range)  
* Geographic distribution of students (map or chart)  
* Graduation year breakdown of interested students

**Token Configuration Status:**

* Progress indicator showing completion percentage  
* Quick edit buttons for: Name, ticker, supply, description, use cases  
* "Preview how this looks to students" button

  ### **C3. Students Page (College Admin)**

**Student List:**

* Table of students mining your token: Name, email, join date, mining streak, total tokens  
* Export button for CSV download  
* Filter options: graduation year, join date range, activity level  
* Search functionality by name or email

**Engagement Tools:**

* "Send message to all students" (email composer)  
* "Create announcement" for college page  
* "Update token launch timeline"

**Student Analytics Summary:**

* Total students count  
* Active students (mined in last 7 days)  
* Average mining streak  
* Referral success rate among your students

  ### **C4. Token Settings Page**

**Basic Token Information:**

* Token name input  
* Ticker symbol input (3-5 characters, auto-uppercase)  
* Token description (500 character limit)  
* Max supply dropdown: 1M, 10M, 100M, 1B, 10B, Custom

**Use Cases Configuration:**

* "How will students earn tokens?" (checkboxes \+ custom text)  
  * Daily login rewards  
  * Attending events  
  * Academic achievements  
  * Community service  
  * Custom option  
* "How will students spend tokens?" (checkboxes \+ custom text)  
  * Campus dining  
  * Bookstore purchases  
  * Event tickets  
  * Parking fees  
  * Custom option

**Visual Customization:**

* Upload token icon/logo  
* Choose color scheme (dropdown of preset options)  
* Preview how token appears to students

**Launch Timeline:**

* "When do you plan to launch?" dropdown: Q1 2024, Q2 2024, etc., "Not sure yet"  
* "Pre-launch preparation needed?" checklist items  
* Save button

  ### **C5. College Admin Profile Settings**

**Personal Information:**

* First name, last name editing  
* Work email (requires verification if changed)  
* Work phone number  
* Position/title at college

**College Information:**

* College logo upload/change  
* College description editing  
* Website and social media links  
* Contact information updates

**Account Settings:**

* Password change  
* Admin role transfer (to another verified college email)  
* Account security settings  
  ---

  ## **D. PLATFORM ADMIN BACKEND (Internal Management)**

  ### **D1. Platform Admin Dashboard**

**System Overview:**

* Total registered students (real-time)  
* Total college admins (real-time)  
* Total colleges in system  
* Daily active users  
* System health indicators

**Recent Activity:**

* Latest user registrations  
* New college admin signups  
* Recent college additions  
* System alerts and notifications

**Quick Actions:**

* Verify pending college admins  
* Review flagged content  
* Send system announcements  
* Export platform data

  ### **D2. User Management**

**Student Management:**

* Search students by name, email, college  
* View student profiles and activity  
* Suspend/activate student accounts  
* View referral networks  
* Export student data

**College Admin Management:**

* List all college admins with verification status  
* Verify college admin accounts manually  
* View admin activity and engagement  
* Suspend/activate admin accounts  
* Transfer admin rights between users

**Bulk Actions:**

* Send emails to user segments  
* Export user lists  
* Apply account actions to multiple users

  ### **D3. College Management**

**College Database:**

* List all colleges with status indicators  
* Add new colleges manually  
* Edit college information  
* Merge duplicate college entries  
* Set college verification requirements

**College Analytics:**

* View individual college performance  
* Compare colleges by metrics  
* Identify high-performing colleges  
* Track college admin engagement  
* Export college data

**Content Management:**

* Review college profiles for accuracy  
* Moderate college announcements  
* Manage college logo uploads  
* Set content guidelines

  ### **D4. Platform Analytics**

**Growth Metrics:**

* User acquisition trends  
* Geographic expansion data  
* Retention rates by user type  
* Viral coefficient tracking  
* Revenue projections

**Engagement Analytics:**

* Daily/weekly/monthly active users  
* Feature usage statistics  
* User journey analysis  
* Drop-off points identification  
* A/B test results

**College Performance:**

* Top performing colleges  
* Admin engagement rates  
* Student-to-admin conversion  
* Token configuration completion rates

  ### **D5. System Settings**

**Platform Configuration:**

* Mining reward rates  
* Referral bonus amounts  
* Verification requirements  
* Email templates  
* System announcements

**Security Settings:**

* User authentication policies  
* Rate limiting configuration  
* Spam detection settings  
* Account verification rules

**Integration Management:**

* Email service configuration  
* SMS service settings  
* Analytics tracking setup  
* Backup and recovery settings  
  ---

  ## **E. AUTHENTICATION & SECURITY (All User Types)**

  ### **E1. Login Flow**

* Email/password form  
* "Forgot password?" link  
* "Remember me" checkbox  
* Account type detection (student/admin/platform admin)  
* Redirect to appropriate dashboard

  ### **E2. Password Reset**

* Email input form  
* Verification code sent to email  
* New password creation form  
* Automatic login after reset

  ### **E3. Account Security**

* Login history display  
* Active sessions management  
* Security settings page  
* Two-factor authentication setup (optional for admins)  
  ---

  ## **F. NOTIFICATION SYSTEM**

  ### **F1. Email Notifications**

* Mining reminders (daily for students)  
* Referral success confirmations  
* College admin updates for students  
* Weekly mining summaries  
* Admin verification confirmations  
* System announcements

  ### **F2. In-App Notifications**

* Mining availability alerts  
* Referral bonuses earned  
* College leaderboard position changes  
* Admin status updates  
* New feature announcements  
  