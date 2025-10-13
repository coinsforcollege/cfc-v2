# UI Layout Audit

## Header Specifications
- Position: fixed
- Height: 64px (all devices)
- Z-index: 1000
- File: client/src/components/layout/Header.jsx:69-88

## Broken Pages

### Auth Pages - Content Hidden Behind Header
**Issue:** minHeight: 100vh + alignItems: center + py: 4 (32px on all devices)
**Affected devices:** Phone, Tablet, Desktop

1. client/src/pages/auth/Login.jsx:62-71
2. client/src/pages/auth/StudentRegistration.jsx:84-93
3. client/src/pages/auth/CollegeRegistration.jsx:101-109

## Working Pages

### Using pt: { xs: 12, md: 14 } (96px phone/tablet, 112px desktop)
**Works on:** Phone, Tablet, Desktop
- client/src/pages/public/BlogList.jsx:139-144
- client/src/pages/public/BlogPost.jsx:180-185
- client/src/pages/public/CollegeBrowse.jsx:215-220
- client/src/pages/public/CollegeView.jsx:210
- client/src/pages/public/NetworkMap.jsx:215-220
- client/src/pages/public/AmbassadorApply.jsx:206

### Using pt: 8 (64px all devices)
**Works on:** Phone, Tablet, Desktop
- client/src/pages/auth/CollegeSelection.jsx:242-249
- client/src/pages/auth/CollegeAdminSelection.jsx:236-243
- client/src/pages/public/HowItWorksColleges.jsx:240

### Designed for Overlap (minHeight: 100vh + position: relative)
**Works on:** Phone, Tablet, Desktop
- client/src/pages/public/Home.jsx:15-31
- client/src/components/sections/HeroSection.jsx:143-178

## Missing Files
- client/src/pages/public/Contact.jsx (does not exist)

## Summary
- Total pages: 16
- Broken: 4 (3 on all devices, 1 on phone/tablet only)
- Working: 11 (all devices)
- Missing: 1
