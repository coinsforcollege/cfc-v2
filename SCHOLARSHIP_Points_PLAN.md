Implement the following plan:                                                                          
                                                                                                         
  # Scholarship Points Detail Page - Implementation Plan                                                 
                                                                                                         
  ## Overview                                                                                            
  Build a detailed Scholarship Points page with trajectory chart, tier comparison, category              
  breakdown, and transaction history.                                                                    
                                                                                                         
  ## Tier Standards                                                                                      
  | Tier | Weekly Rate | Color |                                                                         
  |------|-------------|-------|                                                                         
  | Ivy League (default) | 300 SP/week | Blue |                                                          
  | Tier 1 | 200 SP/week | Purple |                                                                      
  | Tier 2 | 100 SP/week | Green |                                                                       
  | Regional | 50 SP/week | Orange |                                                                     
                                                                                                         
  ---                                                                                                    
                                                                                                         
  ## Phase 1: Backend Changes                                                                            
                                                                                                         
  ### Step 1: Create Shared Utility for Points Awarding                                                  
  **File:** `server/src/utils/scholarshipPoints.js` (NEW)                                                
                                                                                                         
  - Extract `awardScholarshipPoints` from both controllers (currently duplicated)                        
  - Add `metadata` parameter to store category info                                                      
  - Metadata structure: `{ parentCategory, parentCategoryId, category, categoryId }`                     
                                                                                                         
  ### Step 2: Update Task Submission Flow                                                                
  **File:** `server/src/controllers/studentTask.controller.js`                                           
                                                                                                         
  - Import shared utility                                                                                
  - When awarding points, populate task categories and pass to metadata                                  
  - Store parent category name/ID in transaction                                                         
                                                                                                         
  ### Step 3: Update Task Approval Flow                                                                  
  **File:** `server/src/controllers/taskReview.controller.js`                                            
                                                                                                         
  - Import shared utility                                                                                
  - When approving, populate task categories and pass to metadata                                        
                                                                                                         
  ### Step 4: Create Analytics Endpoint                                                                  
  **File:** `server/src/controllers/scholarshipWallet.controller.js`                                     
                                                                                                         
  **Endpoint:** `GET /api/scholarship/analytics`                                                         
                                                                                                         
  **Response:**                                                                                          
  ```json                                                                                                
  {                                                                                                      
  "accountCreatedAt": "2024-06-15T10:30:00Z",                                                            
  "currentBalance": 1250,                                                                                
  "totalEarned": 1500,                                                                                   
  "chartData": [                                                                                         
  { "date": "2024-06-15", "balance": 0 },                                                                
  { "date": "2024-06-22", "balance": 150 }                                                               
  ],                                                                                                     
  "categoryBreakdown": [                                                                                 
  { "category": "Academic", "totalPoints": 500, "transactionCount": 15 }                                 
  ]                                                                                                      
  }                                                                                                      
  ```                                                                                                    
                                                                                                         
  **Aggregation Logic (for efficiency with years of data):**                                             
  - Last 30 days: daily data points                                                                      
  - 31-90 days: weekly aggregates                                                                        
  - 90+ days: monthly aggregates                                                                         
  - Max ~100 data points regardless of time span                                                         
                                                                                                         
  ### Step 5: Update Routes                                                                              
  **File:** `server/src/routes/scholarshipWallet.routes.js`                                              
                                                                                                         
  Add: `router.get('/analytics', protect, getScholarshipAnalytics);`                                     
                                                                                                         
  ---                                                                                                    
                                                                                                         
  ## Phase 2: Frontend Setup                                                                             
                                                                                                         
  ### Step 6: Install Chart Library                                                                      
  ```bash                                                                                                
  cd rfe-app && npx expo install react-native-chart-kit                                                  
  ```                                                                                                    
                                                                                                         
  ### Step 7: Create Scholarship API Client                                                              
  **File:** `rfe-app/src/api/scholarship.api.ts` (NEW)                                                   
                                                                                                         
  - Types: ScholarshipAnalytics, ChartDataPoint, CategoryBreakdown, ScholarshipTransaction               
  - Tier config constants                                                                                
  - Methods: getWallet(), getTransactions(), getAnalytics()                                              
                                                                                                         
  ### Step 8: Add Tier Storage                                                                           
  **File:** `rfe-app/src/utils/storage.ts`                                                               
                                                                                                         
  - Add `getScholarshipTier()` and `setScholarshipTier()` methods                                        
  - Key: `@rfe_scholarship_tier`                                                                         
                                                                                                         
  ---                                                                                                    
                                                                                                         
  ## Phase 3: Scholarship Points Page                                                                    
                                                                                                         
  ### Step 9: Create Page                                                                                
  **File:** `rfe-app/app/(app)/scholarship-points.tsx` (NEW)                                             
                                                                                                         
  **Layout:**                                                                                            
  ```                                                                                                    
  Header (Back, Title, Current Balance)                                                                  
  |                                                                                                      
  TierSelector (Horizontal scroll of tier chips)                                                         
  |                                                                                                      
  PointsChart (LineChart with Expected vs Actual)                                                        
  |                                                                                                      
  CategoryBreakdown (Progress bars per category)                                                         
  |                                                                                                      
  Transaction History (FlatList with infinite scroll)                                                    
  ```                                                                                                    
                                                                                                         
  **Components:**                                                                                        
  1. **TierSelector** - Horizontal scroll, selected tier highlighted, shows weekly rate                  
  2. **PointsChart** - react-native-chart-kit LineChart                                                  
  - Blue dashed line: Expected trajectory (based on selected tier)                                       
  - Yellow solid line: Actual trajectory (from chartData)                                                
  - Legend at bottom                                                                                     
  3. **CategoryBreakdown** - List with colored bars and percentages                                      
  4. **TransactionCard** - Icon, description, date, category, amount, balance after                      
                                                                                                         
  **State:**                                                                                             
  - `selectedTier` - from AsyncStorage, default 'ivy'                                                    
  - `analytics` - from API                                                                               
  - `transactions` - paginated list                                                                      
  - `loading`, `refreshing`, `loadingMore` states                                                        
                                                                                                         
  ---                                                                                                    
                                                                                                         
  ## Phase 4: Homepage Integration                                                                       
                                                                                                         
  ### Step 10: Update Homepage                                                                           
  **File:** `rfe-app/app/(app)/index.tsx`                                                                
                                                                                                         
  - Remove `MOCK_BALANCE` constant                                                                       
  - Fetch real balance from `scholarshipApi.getWallet()`                                                 
  - Make PointsRow pressable -> navigates to `/(app)/scholarship-points`                                 
  - Add chevron icon to indicate tappable                                                                
                                                                                                         
  ---                                                                                                    
                                                                                                         
  ## File Summary                                                                                        
                                                                                                         
  | File | Action |                                                                                      
  |------|--------|                                                                                      
  | `server/src/utils/scholarshipPoints.js` | CREATE |                                                   
  | `server/src/controllers/studentTask.controller.js` | MODIFY |                                        
  | `server/src/controllers/taskReview.controller.js` | MODIFY |                                         
  | `server/src/controllers/scholarshipWallet.controller.js` | MODIFY |                                  
  | `server/src/routes/scholarshipWallet.routes.js` | MODIFY |                                           
  | `rfe-app/src/api/scholarship.api.ts` | CREATE |                                                      
  | `rfe-app/src/utils/storage.ts` | MODIFY (if exists) or handle in page |                              
  | `rfe-app/app/(app)/scholarship-points.tsx` | CREATE |                                                
  | `rfe-app/app/(app)/index.tsx` | MODIFY |                                                             
                                                                                                         
  ---                                                                                                    
                                                                                                         
  ## Build-Test Sequence                                                                                 
                                                                                                         
  1. **Backend Step 1-3**: Create utility, update both controllers                                       
  - Test: Submit/approve a task, verify transaction has category metadata                                
                                                                                                         
  2. **Backend Step 4-5**: Create analytics endpoint                                                     
  - Test with Postman: `GET /api/scholarship/analytics`                                                  
                                                                                                         
  3. **Frontend Step 6-8**: Install chart lib, create API client                                         
  - Test: Import and log API response                                                                    
                                                                                                         
  4. **Frontend Step 9**: Create scholarship-points page                                                 
  - Test: Navigate, verify all sections render                                                           
                                                                                                         
  5. **Frontend Step 10**: Connect homepage                                                              
  - Test: Tap points, navigate to detail page                                                            
                                                                                                         
  ---                                                                                                    
                                                                                                         
  ## Verification                                                                                        
                                                                                                         
  1. Create account -> navigate to points page -> should show chart starting from account creation       
  2. Complete a task -> verify:                                                                          
  - Transaction appears in history with category                                                         
  - Chart updates with new data point                                                                    
  - Category breakdown updates                                                                           
  3. Switch tiers -> expected line should recalculate                                                    
  4. Scroll transaction list -> verify infinite scroll loads more                                        
  5. Pull to refresh -> all data should refresh                                                          
                                                                                                         
                                                                                                         
  If you need specific details from before exiting plan mode (like exact code snippets, error            
  messages, or content you generated), read the full transcript at: /Users/amankumar/.claude/project     
  s/-Users-amankumar-WebDev-cfc2/9655ce42-79ec-4951-8f54-bdc019a913b6.jsonl  