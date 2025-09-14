"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen, Clock, Award, Play } from "lucide-react"
import { type Course, type Lecture, getCourseById, getLecturesByCourse, getStudentProgress } from "@/lib/courses"
import { LectureViewer } from "@/components/lectures/lecture-viewer"
import { useAuth } from "@/hooks/use-auth"

interface StudentCourseDetailProps {
  courseId: string
  onBack: () => void
}

export function StudentCourseDetail({ courseId, onBack }: StudentCourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [currentView, setCurrentView] = useState<"overview" | "lecture">("overview")
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null)
  const [progress, setProgress] = useState<any[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const courseData = getCourseById(courseId)
    setCourse(courseData)

    if (courseData) {
      const courseLectures = getLecturesByCourse(courseId)
      setLectures(courseLectures)
    }

    if (user) {
      const studentProgress = getStudentProgress(user.id, courseId)
      setProgress(studentProgress)
    }
  }, [courseId, user])

  const handleViewLecture = (lectureId: string) => {
    setSelectedLectureId(lectureId)
    setCurrentView("lecture")
  }

  const handleBackToOverview = () => {
    setCurrentView("overview")
    setSelectedLectureId(null)
    // Refresh progress when returning from lecture
    if (user) {
      const studentProgress = getStudentProgress(user.id, courseId)
      setProgress(studentProgress)
    }
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

  const completedLectures = progress.filter((p) => p.completed).length
  const progressPercentage = lectures.length > 0 ? (completedLectures / lectures.length) * 100 : 0

  const canAccessLecture = (index: number) => {
    if (index === 0) return true
    return progress.some((p) => p.lectureId === lectures[index - 1]?.id && p.completed)
  }

  const isLectureCompleted = (lectureId: string) => {
    return progress.some((p) => p.lectureId === lectureId && p.completed)
  }

  const readingLectures = lectures.filter((l) => l.type === "reading").length
  const quizLectures = lectures.filter((l) => l.type === "quiz").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
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
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Course Progress</span>
                    <span className="text-muted-foreground">
                      {completedLectures}/{lectures.length} completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="w-full" />
                  <p className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% complete</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                  <div className="space-y-3">
                    {lectures.map((lecture, index) => {
                      const canAccess = canAccessLecture(index)
                      const isCompleted = isLectureCompleted(lecture.id)

                      return (
                        <Card key={lecture.id} className={!canAccess ? "opacity-50" : ""}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-muted-foreground">Lecture {index + 1}</span>
                                  <Badge
                                    variant={lecture.type === "reading" ? "secondary" : "default"}
                                    className="text-xs"
                                  >
                                    {lecture.type === "reading" ? (
                                      <>
                                        <BookOpen className="mr-1 h-3 w-3" />
                                        Reading
                                      </>
                                    ) : (
                                      <>
                                        <Award className="mr-1 h-3 w-3" />
                                        Quiz
                                      </>
                                    )}
                                  </Badge>
                                  {isCompleted && (
                                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                      ✓ Complete
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleViewLecture(lecture.id)}
                                disabled={!canAccess}
                                variant={canAccess ? "default" : "ghost"}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                {isCompleted ? "Review" : "Start"}
                              </Button>
                            </div>
                            <div className="mt-2">
                              <h4 className="font-medium">{lecture.title}</h4>
                              {!canAccess && index > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Complete previous lecture to unlock
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{Math.round(progressPercentage)}%</div>
                <p className="text-sm text-muted-foreground">Course completion</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Completed</span>
                  <span className="font-medium">{completedLectures}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Remaining</span>
                  <span className="font-medium">{lectures.length - completedLectures}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Info</CardTitle>
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
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Instructor</span>
                </div>
                <span className="font-medium">{course.instructorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="font-medium">{new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
