"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreateCourseDialog } from "./create-course-dialog"
import { CourseCard } from "./course-card"
import { type Course, getCoursesByInstructor } from "@/lib/courses"
import { useAuth } from "@/hooks/use-auth"
import { BookOpen, ArrowLeft } from "lucide-react"

interface CourseManagementProps {
  onViewCourse: (courseId: string) => void
  onBack: () => void
}

export function CourseManagement({ onViewCourse, onBack }: CourseManagementProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const { user } = useAuth()

  const loadCourses = () => {
    if (user) {
      const instructorCourses = getCoursesByInstructor(user.id)
      setCourses(instructorCourses)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Course Management</h2>
            <p className="text-muted-foreground">Create and manage your courses</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Create and manage your courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CreateCourseDialog onCourseCreated={loadCourses} />
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Courses ({courses.length})</CardTitle>
              <CardDescription>Manage your existing courses and lectures</CardDescription>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first course to start teaching students</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} onViewCourse={onViewCourse} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
