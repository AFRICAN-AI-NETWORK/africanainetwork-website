import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const trackEvent = (eventName: string, eventParams = {}) => {
  logEvent(analytics, eventName, eventParams);
};

export const trackLinkClick = (linkName: string, url: string) => {
  trackEvent('link_click', {
    link_name: linkName,
    link_url: url,
  });
};
