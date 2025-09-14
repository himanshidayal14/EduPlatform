// Course management utilities and types
export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  instructorName: string
  createdAt: string
  updatedAt: string
}

export interface Lecture {
  id: string
  courseId: string
  title: string
  type: "reading" | "quiz"
  order: number
  content?: string // For reading lectures
  questions?: QuizQuestion[] // For quiz lectures
  createdAt: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // Index of correct option
}

export interface StudentProgress {
  id: string
  studentId: string
  courseId: string
  lectureId: string
  completed: boolean
  score?: number // For quiz lectures
  completedAt?: string
}

// Storage keys
const COURSES_KEY = "learning_platform_courses"
const LECTURES_KEY = "learning_platform_lectures"
const PROGRESS_KEY = "learning_platform_progress"

// Course management functions
export function getStoredCourses(): Course[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(COURSES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function storeCourse(course: Course): void {
  if (typeof window === "undefined") return
  const courses = getStoredCourses()
  const existingIndex = courses.findIndex((c) => c.id === course.id)

  if (existingIndex >= 0) {
    courses[existingIndex] = course
  } else {
    courses.push(course)
  }

  localStorage.setItem(COURSES_KEY, JSON.stringify(courses))
}

export function createCourse(title: string, description: string, instructorId: string, instructorName: string): Course {
  const newCourse: Course = {
    id: Date.now().toString(),
    title,
    description,
    instructorId,
    instructorName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  storeCourse(newCourse)
  return newCourse
}

export function getCoursesByInstructor(instructorId: string): Course[] {
  return getStoredCourses().filter((course) => course.instructorId === instructorId)
}

export function getCourseById(courseId: string): Course | null {
  return getStoredCourses().find((course) => course.id === courseId) || null
}

// Lecture management functions
export function getStoredLectures(): Lecture[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(LECTURES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function storeLecture(lecture: Lecture): void {
  if (typeof window === "undefined") return
  const lectures = getStoredLectures()
  const existingIndex = lectures.findIndex((l) => l.id === lecture.id)

  if (existingIndex >= 0) {
    lectures[existingIndex] = lecture
  } else {
    lectures.push(lecture)
  }

  localStorage.setItem(LECTURES_KEY, JSON.stringify(lectures))
}

export function createLecture(
  courseId: string,
  title: string,
  type: "reading" | "quiz",
  content?: string,
  questions?: QuizQuestion[],
): Lecture {
  const existingLectures = getLecturesByCourse(courseId)
  const order = existingLectures.length + 1

  const newLecture: Lecture = {
    id: Date.now().toString(),
    courseId,
    title,
    type,
    order,
    content: type === "reading" ? content : undefined,
    questions: type === "quiz" ? questions : undefined,
    createdAt: new Date().toISOString(),
  }

  storeLecture(newLecture)
  return newLecture
}

export function getLecturesByCourse(courseId: string): Lecture[] {
  return getStoredLectures()
    .filter((lecture) => lecture.courseId === courseId)
    .sort((a, b) => a.order - b.order)
}

export function getLectureById(lectureId: string): Lecture | null {
  return getStoredLectures().find((lecture) => lecture.id === lectureId) || null
}

// Progress tracking functions
export function getStoredProgress(): StudentProgress[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(PROGRESS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function storeProgress(progress: StudentProgress): void {
  if (typeof window === "undefined") return
  const allProgress = getStoredProgress()
  const existingIndex = allProgress.findIndex(
    (p) => p.studentId === progress.studentId && p.lectureId === progress.lectureId,
  )

  if (existingIndex >= 0) {
    allProgress[existingIndex] = progress
  } else {
    allProgress.push(progress)
  }

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))
}

export function getStudentProgress(studentId: string, courseId: string): StudentProgress[] {
  return getStoredProgress().filter((p) => p.studentId === studentId && p.courseId === courseId)
}

export function markLectureComplete(studentId: string, courseId: string, lectureId: string, score?: number): void {
  const progress: StudentProgress = {
    id: `${studentId}-${lectureId}`,
    studentId,
    courseId,
    lectureId,
    completed: true,
    score,
    completedAt: new Date().toISOString(),
  }

  storeProgress(progress)
}
