// Authentication utilities and types
export interface User {
  id: string
  email: string
  name: string
  role: "instructor" | "student"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Mock user storage (in production, this would be a database)
const USERS_KEY = "learning_platform_users"
const CURRENT_USER_KEY = "learning_platform_current_user"

export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function storeUser(user: User): void {
  if (typeof window === "undefined") return
  const users = getStoredUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(CURRENT_USER_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function signUp(email: string, password: string, name: string, role: "instructor" | "student"): Promise<User> {
  return new Promise((resolve, reject) => {
    const users = getStoredUsers()

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      reject(new Error("User with this email already exists"))
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    }

    storeUser(newUser)
    setCurrentUser(newUser)
    resolve(newUser)
  })
}

export function signIn(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    const users = getStoredUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      reject(new Error("Invalid email or password"))
      return
    }

    setCurrentUser(user)
    resolve(user)
  })
}

export function signOut(): void {
  setCurrentUser(null)
}
