                                                                                                         
 Overview                                                                                                
                                                                                                         
 Build a College Readiness page linked from "College Prep" button on home. The feature collects student  
 data, generates an AI-powered personalized checklist, and tracks completion with document uploads.      
                                                                                                         
 ---                                                                                                     
 Phase 1: Backend - Data Models                                                                          
                                                                                                         
 1.1 Create CollegeReadinessChecklist Model                                                              
                                                                                                         
 File: /server/src/models/CollegeReadinessChecklist.js                                                   
                                                                                                         
 Schema structure:                                                                                       
 - user (ref: User, indexed)                                                                             
 - formData: { fieldOfStudy, targetTier, languagesKnown[], preferredColleges[] }                         
 - profileSnapshot: { gradeLevel, country, desiredCollegeCountries[] }                                   
 - sections[]: { sectionId, name, icon, order, items[] }                                                 
   - items[]: { itemId, title, description, actionType, linkedDocumentCategory, linkedDocument,          
 calculationData, externalLink, isCompleted, completedAt, priority, deadline, notes }                    
 - progress: { totalItems, completedItems, percentage }                                                  
 - aiGeneration: { prompt, model, generatedAt, tokensUsed }                                              
 - version (for regeneration tracking)                                                                   
 - lastGeneratedAt (for rate limiting - once per week)                                                   
                                                                                                         
 Action types: checkbox, file_upload, link, calculation, info                                            
                                                                                                         
 1.2 Update User Model                                                                                   
                                                                                                         
 File: /server/src/models/User.js                                                                        
                                                                                                         
 Add to userProfile:                                                                                     
 collegeReadiness: {                                                                                     
   hasGeneratedChecklist: Boolean (default: false),                                                      
   lastChecklistGeneratedAt: Date,                                                                       
   activeChecklistId: ObjectId (ref: CollegeReadinessChecklist)                                          
 }                                                                                                       
                                                                                                         
 ---                                                                                                     
 Phase 2: Backend - API Endpoints                                                                        
                                                                                                         
 2.1 Create Routes                                                                                       
                                                                                                         
 File: /server/src/routes/collegeReadiness.routes.js                                                     
 Method: GET                                                                                             
 Endpoint: /check-basic-data                                                                             
 Purpose: Check if user has grade, country, desiredCollegeCountries                                      
 ────────────────────────────────────────                                                                
 Method: PUT                                                                                             
 Endpoint: /basic-data                                                                                   
 Purpose: Update missing basic profile data                                                              
 ────────────────────────────────────────                                                                
 Method: GET                                                                                             
 Endpoint: /form-options                                                                                 
 Purpose: Get fields of study, tiers, common languages                                                   
 ────────────────────────────────────────                                                                
 Method: GET                                                                                             
 Endpoint: /search-colleges                                                                              
 Purpose: Search colleges for preferred selection                                                        
 ────────────────────────────────────────                                                                
 Method: POST                                                                                            
 Endpoint: /generate                                                                                     
 Purpose: Generate checklist via OpenAI                                                                  
 ────────────────────────────────────────                                                                
 Method: GET                                                                                             
 Endpoint: /checklist                                                                                    
 Purpose: Get active checklist                                                                           
 ────────────────────────────────────────                                                                
 Method: GET                                                                                             
 Endpoint: /history                                                                                      
 Purpose: Get past checklists                                                                            
 ────────────────────────────────────────                                                                
 Method: PUT                                                                                             
 Endpoint: /checklist/:id/items/:itemId                                                                  
 Purpose: Update item (complete, notes)                                                                  
 ────────────────────────────────────────                                                                
 Method: POST                                                                                            
 Endpoint: /checklist/:id/items/:itemId/link-document                                                    
 Purpose: Link document to item                                                                          
 ────────────────────────────────────────                                                                
 Method: POST                                                                                            
 Endpoint: /regenerate                                                                                   
 Purpose: Regenerate checklist (rate limited: once per week)                                             
 2.2 Create Controller                                                                                   
                                                                                                         
 File: /server/src/controllers/collegeReadiness.controller.js                                            
                                                                                                         
 2.3 Create OpenAI Service                                                                               
                                                                                                         
 File: /server/src/utils/openai.js                                                                       
                                                                                                         
 Initialize OpenAI client using env OPENAI_API_KEY                                                       
 - Model: gpt-4o (user preference for higher quality)                                                    
 - Use structured JSON output with response_format: { type: "json_object" }                              
                                                                                                         
 2.4 Register Routes                                                                                     
                                                                                                         
 File: /server/src/app.js                                                                                
                                                                                                         
 Add: app.use('/api/college-readiness', collegeReadinessRoutes);                                         
                                                                                                         
 ---                                                                                                     
 Phase 3: AI Prompt Design                                                                               
                                                                                                         
 System Prompt                                                                                           
                                                                                                         
 Instruct AI to return structured JSON with sections:                                                    
 1. Immigration & Visa                                                                                   
 2. Language Qualifications                                                                              
 3. Academic Documents                                                                                   
 4. Finance & Scholarships                                                                               
 5. Living Abroad Preparation                                                                            
                                                                                                         
 User Prompt Inputs                                                                                      
                                                                                                         
 - Current grade level                                                                                   
 - Country of residence                                                                                  
 - Target destination countries                                                                          
 - Field of study                                                                                        
 - Target tier (with weekly SP rate context)                                                             
 - Languages known                                                                                       
 - Preferred colleges (if any)                                                                           
 - Current scholarship points                                                                            
 - Weeks until typical application deadline                                                              
                                                                                                         
 Response Structure                                                                                      
                                                                                                         
 JSON with sections containing items with:                                                               
 - actionType: determines UI behavior                                                                    
 - linkedDocumentCategory: for file_upload items (e.g., "transcript", "recommendation_letter")           
 - calculationData: for finance items (weekly SP needed, target amount)                                  
 - priority: critical/high/medium/low                                                                    
 - deadline: if applicable                                                                               
                                                                                                         
 Cost Estimates                                                                                          
                                                                                                         
 AI provides general tuition and living cost estimates based on destination country and tier level (no   
 database lookups required).                                                                             
                                                                                                         
 ---                                                                                                     
 Phase 4: Frontend - Pages                                                                               
                                                                                                         
 4.1 Main Entry Page                                                                                     
                                                                                                         
 File: /rfe-app/app/(app)/college-prep.tsx                                                               
                                                                                                         
 Flow states: loading -> basic-data -> ready                                                             
 - On mount: Check for existing checklist                                                                
 - If checklist exists: Navigate to checklist view                                                       
 - If no basic data: Show BasicDataSheet                                                                 
 - If ready: Show options to generate or view history                                                    
                                                                                                         
 4.2 Multi-Step Form                                                                                     
                                                                                                         
 File: /rfe-app/app/(app)/college-prep/form.tsx                                                          
                                                                                                         
 Steps:                                                                                                  
 1. Field of Study - Single select from predefined list                                                  
 2. Tier Selection - Reuse tier selector pattern from scholarship-points                                 
 3. Languages Known - Multi-value input (type and enter)                                                 
 4. Preferred Colleges - Optional, search + manual entry                                                 
                                                                                                         
 Pattern: Follow delete-account.tsx step management approach                                             
                                                                                                         
 4.3 Generating Screen                                                                                   
                                                                                                         
 File: /rfe-app/app/(app)/college-prep/generating.tsx                                                    
                                                                                                         
 - Animated colorful beam along device edges (react-native-reanimated)                                   
 - Cycling loading messages                                                                              
 - Poll for completion or use callback                                                                   
                                                                                                         
 4.4 Checklist Display                                                                                   
                                                                                                         
 File: /rfe-app/app/(app)/college-prep/checklist.tsx                                                     
                                                                                                         
 - Overall progress bar at top                                                                           
 - Expandable sections (Immigration, Language, Finance, etc.)                                            
 - Each item shows: checkbox, title, description, action button                                          
 - Action button behavior by type:                                                                       
   - file_upload: Opens document picker/link sheet                                                       
   - link: Opens external URL                                                                            
   - calculation: Shows SP earning suggestion                                                            
   - checkbox/info: Simple completion toggle                                                             
                                                                                                         
 ---                                                                                                     
 Phase 5: Frontend - Components                                                                          
                                                                                                         
 Directory: /rfe-app/components/college-readiness/                                                       
 ┌─────────────────────────┬─────────────────────────────────────────┐                                   
 │        Component        │                 Purpose                 │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ BasicDataSheet.tsx      │ Bottom sheet for missing profile data   │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ StepIndicator.tsx       │ Form progress indicator                 │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ FieldOfStudyPicker.tsx  │ Field selection grid                    │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ TierSelector.tsx        │ Horizontal tier buttons (reuse pattern) │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ LanguageInput.tsx       │ Tag-style multi-value input             │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ CollegeSearchInput.tsx  │ Search with manual entry option         │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ GeneratingAnimation.tsx │ Colorful beam animation                 │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ ChecklistSection.tsx    │ Expandable section with items           │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ ChecklistItem.tsx       │ Individual item with action handling    │                                   
 ├─────────────────────────┼─────────────────────────────────────────┤                                   
 │ DocumentLinkSheet.tsx   │ Link existing or upload new document    │                                   
 └─────────────────────────┴─────────────────────────────────────────┘                                   
 ---                                                                                                     
 Phase 6: Frontend - API Client                                                                          
                                                                                                         
 File: /rfe-app/src/api/collegeReadiness.api.ts                                                          
                                                                                                         
 Types and functions matching backend endpoints.                                                         
 Follow pattern from scholarship.api.ts.                                                                 
                                                                                                         
 ---                                                                                                     
 Implementation Order                                                                                    
                                                                                                         
 Backend (build-test chunks):                                                                            
                                                                                                         
 1. Create CollegeReadinessChecklist model -> test with Postman                                          
 2. Update User model with collegeReadiness field                                                        
 3. Create routes + checkBasicData endpoint -> test                                                      
 4. Create updateBasicData endpoint -> test                                                              
 5. Create getFormOptions endpoint -> test                                                               
 6. Create searchColleges endpoint -> test                                                               
 7. Create OpenAI service utility                                                                        
 8. Create generate endpoint -> test with various inputs                                                 
 9. Create getChecklist endpoint -> test                                                                 
 10. Create updateChecklistItem endpoint -> test                                                         
 11. Create linkDocumentToItem endpoint -> test                                                          
                                                                                                         
 Frontend (build-test chunks):                                                                           
                                                                                                         
 12. Create API client file                                                                              
 13. Create college-prep.tsx main page with basic data check                                             
 14. Create BasicDataSheet component -> test flow                                                        
 15. Create form.tsx with step 1 (field of study) -> test                                                
 16. Add step 2 (tier selection) -> test                                                                 
 17. Add step 3 (languages) -> test                                                                      
 18. Add step 4 (colleges) -> test submission                                                            
 19. Create generating.tsx with animation -> test                                                        
 20. Create checklist.tsx display -> test                                                                
 21. Add item completion functionality -> test                                                           
 22. Add document linking functionality -> test                                                          
                                                                                                         
 ---                                                                                                     
 Fields of Study Options                                                                                 
                                                                                                         
 - Humanities                                                                                            
 - Science                                                                                               
 - Business & Finance                                                                                    
 - Computer Science                                                                                      
 - Engineering                                                                                           
 - Medical                                                                                               
 - Media & Entertainment                                                                                 
 - Photography & Filmmaking                                                                              
 - Arts & Craft                                                                                          
 - Skill Based Education                                                                                 
                                                                                                         
 Tier Configs (from existing)                                                                            
                                                                                                         
 - Ivy League: 300 SP/week                                                                               
 - Tier 1: 200 SP/week                                                                                   
 - Tier 2: 100 SP/week                                                                                   
 - Regional: 50 SP/week                                                                                  
                                                                                                         
 ---                                                                                                     
 Key Files Reference                                                                                     
 ┌─────────────────────────┬───────────────────────────────────────────────────────┐                     
 │         Purpose         │                         Path                          │                     
 ├─────────────────────────┼───────────────────────────────────────────────────────┤                     
 │ User model              │ /server/src/models/User.js                            │                     
 ├─────────────────────────┼───────────────────────────────────────────────────────┤                     
 │ Multi-step pattern      │ /rfe-app/app/(app)/delete-account.tsx                 │                     
 ├─────────────────────────┼───────────────────────────────────────────────────────┤                     
 │ Bottom sheet pattern    │ /rfe-app/components/documents/DocumentActionSheet.tsx │                     
 ├─────────────────────────┼───────────────────────────────────────────────────────┤                     
 │ Tier configs            │ /rfe-app/src/api/scholarship.api.ts                   │                     
 ├─────────────────────────┼───────────────────────────────────────────────────────┤                     
 │ API pattern             │ /rfe-app/src/api/student.api.ts                       │                     
 ├─────────────────────────┼───────────────────────────────────────────────────────┤                     
 │ Home page (entry point) │ /rfe-app/app/(app)/index.tsx                          │                     
 └─────────────────────────┴───────────────────────────────────────────────────────┘                     
 ---                                                                                                     
 Verification Plan                                                                                       
                                                                                                         
 1. Backend testing: Each endpoint tested via Postman before moving to next                              
 2. AI output: Verify JSON structure is parseable and contains all required fields                       
 3. Frontend flow: Test complete user journey from home -> form -> generating -> checklist               
 4. Item actions: Test checkbox completion, document linking, external links                             
 5. Persistence: Verify checklist persists across app restarts                                           
 6. Edge cases: Missing profile data, AI generation failure, network errors                              
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌