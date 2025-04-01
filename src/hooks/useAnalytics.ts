import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackSessionStart } from '@/utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Track session start only once when the app loads
    if (isFirstMount.current) {
      trackSessionStart();
      isFirstMount.current = false;
    }

    // Track page views
    trackPageView(
      document.title,
      location.pathname + location.search + location.hash
    );
  }, [location]);
};
