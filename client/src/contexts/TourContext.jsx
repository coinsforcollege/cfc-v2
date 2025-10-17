import React, { createContext, useContext, useState } from 'react';

const TourContext = createContext({
  tourActive: false,
  tourStep: null,
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

  const startTour = () => {
    setTourActive(true);
    setTourStep('welcome');
  };

  const nextStep = () => {
    switch (tourStep) {
      case 'welcome':
        setTourStep('navigate');
        break;
      case 'navigate':
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
  };

  const value = {
    tourActive,
    tourStep,
    startTour,
    nextStep,
    completeTour,
    setTourStep,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};
