// // 1. Change the import from NextAuthOptions to AuthOptions
// import NextAuth, { type AuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { supabaseAdmin } from "./supabase"
// import { compare } from "bcryptjs"
// import { type JWT } from "next-auth/jwt"
// import { type Session, type User } from "next-auth"

// // 2. Change satisfies NextAuthOptions to satisfies AuthOptions
// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "admin@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         // 👇 แปลง credentials ให้มี type ที่แน่นอน
//         const { email, password } = credentials as {
//           email?: string
//           password?: string
//         }

//         if (!email || !password) return null

//         const { data: admin, error } = await supabaseAdmin
//           .from("admins")
//           .select("*")
//           .eq("email", email)
//           .maybeSingle()

//         if (error) {
//           console.error("Supabase error:", error)
//           return null
//         }

//         if (!admin) {
//           console.warn("Admin not found:", email)
//           return null
//         }

//         const passwordMatch =
//           admin.password === password || (await compare(password, admin.password))

//         if (!passwordMatch) {
//           console.warn("Invalid password for:", email)
//           return null
//         }

//         return {
//           id: admin.id,
//           email: admin.email,
//           name: admin.name,
//         }
//       },
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//   },

//   callbacks: {
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         token.id = user.id
//         token.email = user.email
//         token.name = user.name
//       }
//       return token
//     },

//     async session({ session, token }: { session: Session; token: JWT }) {
//       if (token && session.user) {
//         session.user.id = token.id as string
//         session.user.email = token.email as string
//         session.user.name = token.name as string
//       }
//       return session
//     },
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// } satisfies AuthOptions // <-- CHANGE HERE

// export default NextAuth(authOptions)

// // These module declarations are correct and do not need to be changed.
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string
//       name?: string | null
//       email?: string | null
//       image?: string | null
//     }
//   }

//   interface User {
//     id: string
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id?: string
//   }
// }

import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase, supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // ค้นหา admin จากตาราง admins
          const { data: admin, error } = await supabaseAdmin
            .from('admins')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (error || !admin) {
            console.error('Admin not found:', error)
            return null
          }

          // ตรวจสอบรหัสผ่าน
          const isPasswordValid = await bcrypt.compare(credentials.password, admin.password)
          
          if (!isPasswordValid) {
            console.error('Invalid password')
            return null
          }

          // Return user object สำหรับ NextAuth
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: 'admin'
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 10 * 60, // 10 minutes
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // ครั้งแรกที่ลงชื่อเข้าใช้
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // อัพเดทข้อมูล admin จาก database
      if (token.email) {
        try {
          const { data: admin } = await supabaseAdmin
            .from('admins')
            .select('*')
            .eq('email', token.email)
            .single()

          if (admin) {
            token.name = admin.name
            token.role = 'admin'
          }
        } catch (error) {
          console.error('Error fetching admin data:', error)
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      
      return session
    },

    async redirect({ url, baseUrl }) {
      // กำหนดให้ redirect ไปยังหน้า dashboard หลังจากลงชื่อเข้าใช้
      if (url === `${baseUrl}/auth/signin`) {
        return `${baseUrl}/dashboard`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    }
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  debug: process.env.NODE_ENV === 'development',
}

// Type extensions for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }

  interface User {
    id: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
  }
}