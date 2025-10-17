import React, { createContext, useContext, useState } from 'react';

const TourContext = createContext({
  tourActive: false,
  tourStep: null,
  isMobileTour: false,
  startTour: () => {},
  nextStep: () => {},
  completeTour: () => {},
  setTourStep: () => {},
});

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(null);
  const [isMobileTour, setIsMobileTour] = useState(false);

  const startTour = (mobile = false) => {
    setTourActive(true);
    setIsMobileTour(mobile);
    setTourStep('welcome');
  };

  const nextStep = () => {
    // Mobile tour flow: welcome -> navigate-mobile -> mining -> success
    // Desktop tour flow: welcome -> navigate -> mining -> success
    switch (tourStep) {
      case 'welcome':
        setTourStep(isMobileTour ? 'navigate-mobile' : 'navigate');
        break;
      case 'navigate':
      case 'navigate-mobile':
        // User clicked View Colleges, will navigate to colleges page
        setTourStep('mining');
        break;
      case 'mining':
        // User clicked Start Mining
        setTourStep('success');
        break;
      case 'success':
        completeTour();
        break;
      default:
        break;
    }
  };

  const completeTour = () => {
    setTourActive(false);
    setTourStep(null);
    setIsMobileTour(false);
  };

  const value = {
    tourActive,
    tourStep,
    isMobileTour,
    startTour,
    nextStep,
    completeTour,
    setTourStep,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};
