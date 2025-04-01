import LoadingSpinner from '@/components/ui/loading-spinner';
import { validateAuth } from '@/lib/auth';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import HomePage from '@/pages/HomePage';
import React, { lazy, Suspense } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

const AboutPage = lazy(() => import('@/pages/AboutPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const AiToolsPage = lazy(() => import('@/pages/AiToolsPage'));
const AiToolPage = lazy(() => import('@/pages/AiToolPage'));
const AiToolCategoryPage = lazy(() => import('@/pages/AiToolCategoryPage'));
const ResourcePage = lazy(() => import('@/pages/ResourcePage'));
const CountriesPage = lazy(() => import('@/pages/CountriesPage'));
const CountryPage = lazy(() => import('@/pages/CountryPage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      const auth = await validateAuth();
      console.log(auth, location.pathname);

      if (!auth.isValid) {
        console.log('REDIRECTING TO LOGIN');
        // Redirect to login if not authenticated
        navigate('/auth/login', { state: { from: location }, replace: true });
      } else if (
        !auth.isVerified &&
        location.pathname !== '/auth/verify-email'
      ) {
        console.log('NAVIGATING TO VERIFY EMAIL');
        // Redirect to verify email if not verified
        navigate(
          auth.user && auth.user.email
            ? `/auth/verify-email?email=${encodeURIComponent(auth.user.email)}`
            : `/auth/verify-email`
        );
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
};

const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      const auth = await validateAuth();
      console.log(auth, location.pathname);

      if (auth.isValid && auth.isVerified) {
        // Redirect to home if already authenticated and verified
        navigate('/', { replace: true });
      } else if (
        auth.isValid &&
        !auth.isVerified &&
        location.pathname !== '/auth/verify-email'
      ) {
        console.log('here');
        // Redirect to verify email if not verified
        navigate(
          auth.user && auth.user.email
            ? `/auth/verify-email?email=${encodeURIComponent(auth.user.email)}`
            : `/auth/verify-email`
        );
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/auth/*"
            element={
              <Routes>
                <Route
                  path="login"
                  element={
                    <RedirectIfAuthenticated>
                      <LoginPage />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route
                  path="signup"
                  element={
                    <RedirectIfAuthenticated>
                      <SignupPage />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route
                  path="reset-password"
                  element={
                    <RedirectIfAuthenticated>
                      <ResetPasswordPage />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route
                  path="forgot-password"
                  element={
                    <RedirectIfAuthenticated>
                      <ForgotPasswordPage />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route
                  path="verify-email"
                  element={
                    <RequireAuth>
                      <VerifyEmailPage />
                    </RequireAuth>
                  }
                />
              </Routes>
            }
          />
          <Route
            path="/ai-tools"
            element={
              <RequireAuth>
                <AiToolsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/ai-tools/:slug"
            element={
              <RequireAuth>
                <AiToolPage />
              </RequireAuth>
            }
          />
          <Route
            path="/ai-tool-categories/:title"
            element={
              <RequireAuth>
                <AiToolCategoryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/resources/:slug"
            element={
              <RequireAuth>
                <ResourcePage />
              </RequireAuth>
            }
          />
          <Route
            path="/countries"
            element={
              <RequireAuth>
                <CountriesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/countries/:name"
            element={
              <RequireAuth>
                <CountryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/courses"
            element={
              <RequireAuth>
                <CoursesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/events"
            element={
              <RequireAuth>
                <EventsPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
