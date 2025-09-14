"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { type User, type AuthState, getCurrentUser, signUp, signIn, signOut } from "@/lib/auth"

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, name: string, role: "instructor" | "student") => Promise<User>
  signIn: (email: string, password: string) => Promise<User>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const handleSignUp = async (email: string, password: string, name: string, role: "instructor" | "student") => {
    const newUser = await signUp(email, password, name, role)
    setUser(newUser)
    return newUser
  }

  const handleSignIn = async (email: string, password: string) => {
    const user = await signIn(email, password)
    setUser(user)
    return user
  }

  const handleSignOut = () => {
    signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
