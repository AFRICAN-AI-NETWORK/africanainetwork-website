import React, { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import NavBar from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axios';
import { errHandler } from '@/lib/utils';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);

  const resendVerification = async () => {
    try {
      const email = searchParams.get('email');
      if (!email) {
        navigate('/auth/login');
        return;
      }

      setLoading(true);
      await axiosInstance.post('/auth/resend-verification', { email });
      toast.toast({
        title: 'Verification Email Sent',
        description: 'Please check your email for the verification link.',
        variant: 'success',
      });
    } catch (err) {
      toast.toast({
        title: 'Failed to Resend',
        description: errHandler(err),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = useCallback(async (token: string) => {
    try {
      if (!token) return;

      await axiosInstance.post(`/auth/verify/email`, { token });
      toast.toast({
        title: 'Email Verified',
        description: 'Your email has been verified.',
        variant: 'success',
      });
      navigate('/');
    } catch (err) {
      toast.toast({
        title: 'Verification Failed',
        description: errHandler(err),
        variant: 'destructive',
      });
    }
  }, []);

  React.useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    }
  }, [searchParams, verifyEmail]);

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className="grid place-items-center min-h-[80vh] px-4">
        <div className="text-center max-w-lg space-y-6">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p>
            We've sent a verification link to your email. Please check your
            inbox and click the link to verify your account.
          </p>
          <Button
            disabled={loading}
            onClick={resendVerification}
            className={loading ? 'opacity-50' : ''}
          >
            {loading ? 'Resending...' : 'Resend Verification Email'}
          </Button>
        </div>
      </main>
    </>
  );
};

export default VerifyEmailPage;
