import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

// Import local components
import NavBar from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Import services and utilities
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axios';
import { errHandler } from '@/lib/utils';

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters' })
      .max(50),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters' })
      .max(50),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        fatal: true,
        path: ['confirmPassword'],
      });

      return z.NEVER;
    }
  });

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axiosInstance.post('/auth/register', {
        name: `${values.firstName.trim()} ${values.lastName.trim()}`,
        email: values.email,
        password: values.password,
      });

      toast.toast({
        title: 'Signup Successful',
        description: 'Please check your email to verify your account.',
        variant: 'success',
      });
      navigate(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      console.error('An error occurred while trying to sign up', err);
      toast.toast({
        title: 'Signup Failed',
        description: errHandler(err),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <header>
        <NavBar />
      </header>

      <main className="grid justify-items-center px-5 lg:px-20 py-[150px] xl:pt-[100px] 2xl:pt-[150px] pb-[200px]">
        <div className="text-center">
          <h1 className="mb-1 text-xl lg:text-3xl font-semibold">
            Sign Up for an Account
          </h1>
          <h2 className="lg:text-lg opacity-80">
            Let's get you all set so you can start creating your first
            onboarding experience
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-14 w-full lg:max-w-[80%] space-y-6"
          >
            <div className="grid gap-y-6 gap-x-3 lg:grid-flow-col">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        aria-label="First name"
                        placeholder="Your first name"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        aria-label="Last name"
                        placeholder="Your last name"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      aria-label="Email"
                      placeholder="Enter your email"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        aria-label="Password"
                        autoComplete="new-password"
                        placeholder="Enter your password"
                        {...field}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        aria-label="Confirm Password"
                        placeholder="Confirm your password"
                        {...field}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        title={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(value: boolean) => setTermsAccepted(value)}
                required
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept African AI Network's Terms and Conditions
              </label>
            </div>

            <Button
              disabled={
                form.formState.isSubmitting ||
                Object.keys(form.formState.errors).length > 0 ||
                !termsAccepted
              }
              className="font-bold w-full"
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <span className="flex gap-2 items-center">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Please wait
                </span>
              ) : (
                'SIGN UP'
              )}
            </Button>
          </form>
        </Form>
      </main>

      <footer className="bg-primary text-primary-foreground min-h-[400px] grid text-center place-items-center">
        <div className="flex flex-col gap-3 text-xl lg:text-2xl lg:max-w-[500px] px-2">
          <h3 className="font-bold">Already Signed Up?</h3>
          <p className="text-lg lg:text-xl">
            Log in to your account so you can continue your AI Onboarding
            experience
          </p>

          <Button
            asChild
            className="font-bold w-fit mx-auto border-white bg-transparent"
            size="lg"
            variant="outline"
          >
            <a href="/auth/login">LOG IN</a>
          </Button>
        </div>
      </footer>
    </>
  );
};

export default SignupPage;
