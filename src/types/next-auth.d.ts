import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      [x: string]: undefined
      id: string
      name: string
      email: string
      role: string
      companyId?: string
    }
  }

  interface User {
    role: string
    companyId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    companyId?: string
  }
}