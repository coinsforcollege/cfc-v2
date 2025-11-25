import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = '767976432962165';

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  // Only initialize in production or if explicitly enabled in development
  const isDev = import.meta.env.DEV;
  const enableInDev = import.meta.env.VITE_FB_PIXEL_DEV === 'true';
  
  if (!isDev || enableInDev) {
    ReactPixel.init(PIXEL_ID, {}, {
      autoConfig: true,
      debug: isDev, // Show debug logs in development
    });
    console.log('Facebook Pixel initialized:', PIXEL_ID);
  } else {
    console.log('Facebook Pixel disabled in development. Set VITE_FB_PIXEL_DEV=true in .env.local to enable.');
  }
};

// Track page view
export const trackPageView = () => {
  ReactPixel.pageView();
};

// Track standard events
export const trackEvent = (eventName, data = {}) => {
  ReactPixel.track(eventName, data);
};

// Specific event trackers for convenience
export const trackCompleteRegistration = (userType = 'user') => {
  ReactPixel.track('CompleteRegistration', {
    content_name: `${userType} Registration`,
    status: 'completed',
  });
};

export const trackLead = (source = 'unknown') => {
  ReactPixel.track('Lead', {
    content_name: source,
    status: 'submitted',
  });
};

export const trackContact = (topic = 'general') => {
  ReactPixel.track('Contact', {
    content_name: 'Contact Form',
    content_category: topic,
  });
};

// Custom events
export const trackLogin = (role = 'user') => {
  ReactPixel.trackCustom('Login', {
    user_role: role,
  });
};

export const trackCollegeSelection = (collegeName, collegeId) => {
  ReactPixel.trackCustom('CollegeSelected', {
    college_name: collegeName,
    college_id: collegeId,
  });
};

export default {
  init: initFacebookPixel,
  pageView: trackPageView,
  event: trackEvent,
  completeRegistration: trackCompleteRegistration,
  lead: trackLead,
  contact: trackContact,
  login: trackLogin,
  collegeSelection: trackCollegeSelection,
};
