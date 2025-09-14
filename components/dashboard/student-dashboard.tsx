"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Award, TrendingUp, Search, Play } from "lucide-react"
import { CourseBrowser } from "@/components/courses/course-browser"
import { StudentCourseDetail } from "@/components/courses/student-course-detail"
import { getStudentEnrollments } from "@/lib/enrollments"
import { getCourseById, getStudentProgress, getLecturesByCourse } from "@/lib/courses"

export function StudentDashboard() {
  const { user, signOut } = useAuth()
  const [currentView, setCurrentView] = useState<"dashboard" | "browse" | "course-detail">("dashboard")
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [totalProgress, setTotalProgress] = useState({ completed: 0, total: 0 })

  useEffect(() => {
    if (user) {
      const enrollments = getStudentEnrollments(user.id)
      const coursesWithProgress = enrollments
        .map((enrollment) => {
          const course = getCourseById(enrollment.courseId)
          if (!course) return null

          const lectures = getLecturesByCourse(course.id)
          const progress = getStudentProgress(user.id, course.id)
          const completedLectures = progress.filter((p) => p.completed).length

          return {
            ...course,
            enrolledAt: enrollment.enrolledAt,
            totalLectures: lectures.length,
            completedLectures,
            progressPercentage: lectures.length > 0 ? (completedLectures / lectures.length) * 100 : 0,
          }
        })
        .filter(Boolean)

      setEnrolledCourses(coursesWithProgress)

      // Calculate total progress
      const totalLectures = coursesWithProgress.reduce((sum, course) => sum + course.totalLectures, 0)
      const totalCompleted = coursesWithProgress.reduce((sum, course) => sum + course.completedLectures, 0)
      setTotalProgress({ completed: totalCompleted, total: totalLectures })
    }
  }, [user, currentView])

  const handleViewCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
    setCurrentView("course-detail")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedCourseId(null)
  }

  if (currentView === "course-detail" && selectedCourseId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduPlatform</h1>
                <span className="ml-4 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                  Student
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StudentCourseDetail courseId={selectedCourseId} onBack={handleBackToDashboard} />
        </main>
      </div>
    )
  }

  if (currentView === "browse") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduPlatform</h1>
                <span className="ml-4 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                  Student
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CourseBrowser onBack={handleBackToDashboard} onViewCourse={handleViewCourse} />
        </main>
      </div>
    )
  }

  const overallProgress = totalProgress.total > 0 ? (totalProgress.completed / totalProgress.total) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduPlatform</h1>
              <span className="ml-4 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                Student
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                {enrolledCourses.length === 0 ? "No enrollments yet" : "Active courses"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lectures Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProgress.completed}</div>
              <p className="text-xs text-muted-foreground">
                {totalProgress.total > 0
                  ? `${totalProgress.total - totalProgress.completed} remaining`
                  : "Start learning today"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrolledCourses.filter((course) => course.progressPercentage === 100).length}
              </div>
              <p className="text-xs text-muted-foreground">Complete courses to earn</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
              <p className="text-xs text-muted-foreground">Overall completion</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Continue learning from your enrolled courses</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No courses enrolled</p>
                  <p className="text-sm mb-4">Browse available courses to start learning</p>
                  <Button onClick={() => setCurrentView("browse")}>
                    <Search className="mr-2 h-4 w-4" />
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.slice(0, 3).map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium line-clamp-1">{course.title}</h4>
                          <Button size="sm" onClick={() => handleViewCourse(course.id)}>
                            <Play className="mr-2 h-4 w-4" />
                            Continue
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span>{Math.round(course.progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${course.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {enrolledCourses.length > 3 && (
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Courses ({enrolledCourses.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discover New Courses</CardTitle>
              <CardDescription>Expand your knowledge with new courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to learn something new?</h3>
                <p className="text-muted-foreground mb-4">
                  Browse our course catalog and find your next learning adventure
                </p>
                <Button onClick={() => setCurrentView("browse")} className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Browse All Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
