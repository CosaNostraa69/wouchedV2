'use client';

import { SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [companyName, setCompanyName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, companyName }),
      });

      console.log('Registration response:', await res.json());

      if (res.ok) {
        router.push('/auth/signin');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-destructive-foreground">
      <Card className="w-full max-w-md rounded-lg shadow-lg bg-white p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">Register</CardTitle>
          <CardDescription className="text-center text-gray-600">Create a new account to get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setName(e.target.value)}
                required
                className="border-gray-300 focus:border-gray-600 focus:ring focus:ring-gray-200 transition duration-150 ease-in-out"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-gray-600 focus:ring focus:ring-gray-200 transition duration-150 ease-in-out"
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
                className="border-gray-300 focus:border-gray-600 focus:ring focus:ring-gray-200 transition duration-150 ease-in-out"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="EMPLOYER">Employer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === 'EMPLOYER' && (
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setCompanyName(e.target.value)}
                  required
                  className="border-gray-300 focus:border-gray-600 focus:ring focus:ring-gray-200 transition duration-150 ease-in-out"
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-md transition duration-150 ease-in-out">
              Register
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
