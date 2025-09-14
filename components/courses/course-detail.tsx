"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Clock, BookOpen } from "lucide-react"
import { type Course, type Lecture, getCourseById, getLecturesByCourse } from "@/lib/courses"
import { CreateLectureDialog } from "@/components/lectures/create-lecture-dialog"
import { LectureList } from "@/components/lectures/lecture-list"
import { LectureViewer } from "@/components/lectures/lecture-viewer"
import { useAuth } from "@/hooks/use-auth"

interface CourseDetailProps {
  courseId: string
  onBack: () => void
}

export function CourseDetail({ courseId, onBack }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [currentView, setCurrentView] = useState<"overview" | "lecture">("overview")
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null)
  const { user } = useAuth()

  const loadCourseData = () => {
    const courseData = getCourseById(courseId)
    setCourse(courseData)

    if (courseData) {
      const courseLectures = getLecturesByCourse(courseId)
      setLectures(courseLectures)
    }
  }

  useEffect(() => {
    loadCourseData()
  }, [courseId])

  const handleViewLecture = (lectureId: string) => {
    setSelectedLectureId(lectureId)
    setCurrentView("lecture")
  }

  const handleBackToOverview = () => {
    setCurrentView("overview")
    setSelectedLectureId(null)
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p>Course not found</p>
        <Button onClick={onBack} className="mt-4">
          Back to Courses
        </Button>
      </div>
    )
  }

  if (currentView === "lecture" && selectedLectureId) {
    return <LectureViewer courseId={courseId} lectureId={selectedLectureId} onBack={handleBackToOverview} />
  }

  const isInstructor = user?.role === "instructor" && user?.id === course.instructorId
  const readingLectures = lectures.filter((l) => l.type === "reading").length
  const quizLectures = lectures.filter((l) => l.type === "quiz").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {isInstructor ? "Courses" : "Dashboard"}
        </Button>
        {isInstructor && <CreateLectureDialog courseId={courseId} onLectureCreated={loadCourseData} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{lectures.length} lectures</Badge>
                  <Badge variant="secondary">by {course.instructorName}</Badge>
                </div>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
                <CardDescription className="text-base">{course.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{lectures.length}</div>
                  <div className="text-sm text-muted-foreground">Total Lectures</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{readingLectures}</div>
                  <div className="text-sm text-muted-foreground">Reading</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{quizLectures}</div>
                  <div className="text-sm text-muted-foreground">Quizzes</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Course Content</h3>
                <LectureList lectures={lectures} onViewLecture={handleViewLecture} showViewButton={!isInstructor} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Lectures</span>
                </div>
                <span className="font-medium">{lectures.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Students</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="font-medium">{new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {!isInstructor && (
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-2xl font-bold mb-2">0%</div>
                  <p className="text-sm text-muted-foreground">Start your first lecture to begin</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
