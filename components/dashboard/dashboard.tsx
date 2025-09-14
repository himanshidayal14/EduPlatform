"use client"

import { useAuth } from "@/hooks/use-auth"
import { InstructorDashboard } from "./instructor-dashboard"
import { StudentDashboard } from "./student-dashboard"

export function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  return user.role === "instructor" ? <InstructorDashboard /> : <StudentDashboard />
}
