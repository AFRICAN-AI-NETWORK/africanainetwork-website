import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Track page views
export const trackPageView = (page_title: string, page_path: string) => {
  logEvent(analytics, 'page_view', {
    page_title,
    page_path,
  });
};

// Track user properties
export const setUserProfile = (properties: Record<string, unknown>) => {
  setUserProperties(analytics, properties);
};

// Track session start
export const trackSessionStart = () => {
  const isReturningUser = localStorage.getItem('aan_previous_visit');

  if (isReturningUser) {
    trackEvent('returning_user');
  } else {
    trackEvent('first_time_user');
    localStorage.setItem('aan_previous_visit', 'true');
  }

  trackEvent('session_start', {
    timestamp: new Date().toISOString(),
  });
};

// Track errors
export const trackError = (error: Error, context?: string) => {
  trackEvent('error', {
    error_name: error.name,
    error_message: error.message,
    error_context: context,
  });
};

export const trackEvent = (eventName: string, eventParams = {}) => {
  logEvent(analytics, eventName, eventParams);
};

export const trackLinkClick = (linkName: string, url: string) => {
  trackEvent('link_click', {
    link_name: linkName,
    link_url: url,
  });
};
