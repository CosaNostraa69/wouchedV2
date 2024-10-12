'use client';

import { SetStateAction, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        router.push('/');
        toast({
          title: "Success",
          description: "You have successfully signed in.",
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-destructive-foreground">
      <Card className="w-full max-w-md rounded-lg shadow-lg bg-white p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">Sign In</CardTitle>
          <CardDescription className="text-center text-gray-600">Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 ease-in-out"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 ease-in-out"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-150 ease-in-out">
              Sign In
            </Button>
            <p className="mt-4 text-gray-600 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
