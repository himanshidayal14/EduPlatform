// Student enrollment utilities and types
export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  enrolledAt: string
}

const ENROLLMENTS_KEY = "learning_platform_enrollments"

export function getStoredEnrollments(): Enrollment[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ENROLLMENTS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function storeEnrollment(enrollment: Enrollment): void {
  if (typeof window === "undefined") return
  const enrollments = getStoredEnrollments()
  const existingIndex = enrollments.findIndex((e) => e.id === enrollment.id)

  if (existingIndex >= 0) {
    enrollments[existingIndex] = enrollment
  } else {
    enrollments.push(enrollment)
  }

  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments))
}

export function enrollStudent(studentId: string, courseId: string): Enrollment {
  const enrollment: Enrollment = {
    id: `${studentId}-${courseId}`,
    studentId,
    courseId,
    enrolledAt: new Date().toISOString(),
  }

  storeEnrollment(enrollment)
  return enrollment
}

export function getStudentEnrollments(studentId: string): Enrollment[] {
  return getStoredEnrollments().filter((enrollment) => enrollment.studentId === studentId)
}

export function isStudentEnrolled(studentId: string, courseId: string): boolean {
  return getStoredEnrollments().some((e) => e.studentId === studentId && e.courseId === courseId)
}

export function getEnrollmentsByCourse(courseId: string): Enrollment[] {
  return getStoredEnrollments().filter((enrollment) => enrollment.courseId === courseId)
}
