'use client'

import {  SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [companyName, setCompanyName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, companyName }),
      })
      if (res.ok) {
        router.push('/auth/signin')
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account to get started.</CardDescription>
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
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit">Register</Button>
        </CardFooter>
      </form>
    </Card>
  )
}