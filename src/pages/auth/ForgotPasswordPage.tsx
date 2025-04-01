import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import NavBar from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axios';
import { errHandler } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordPage: React.FC = () => {
  const toast = useToast();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axiosInstance.post('/auth/forgot-password', values);
      setIsSubmitted(true);
    } catch (err) {
      toast.toast({
        title: 'Failed to Send Reset Link',
        description: errHandler(err),
        variant: 'destructive',
      });
    }
  };

  if (isSubmitted) {
    return (
      <>
        <header>
          <NavBar />
        </header>
        <main className="grid place-items-center min-h-[80vh] px-4">
          <div className="text-center max-w-lg space-y-6">
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p>
              We've sent password reset instructions to your email address.
              Please check your inbox.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className="grid place-items-center min-h-[80vh] px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={form.formState.isSubmitting}
                className="w-full"
                type="submit"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex gap-2 items-center">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Please wait
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
};

export default ForgotPasswordPage;
