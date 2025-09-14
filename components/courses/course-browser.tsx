"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, ArrowLeft } from "lucide-react"
import { type Course, getStoredCourses, getLecturesByCourse } from "@/lib/courses"
import { enrollStudent, isStudentEnrolled } from "@/lib/enrollments"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface CourseBrowserProps {
  onBack: () => void
  onViewCourse: (courseId: string) => void
}

export function CourseBrowser({ onBack, onViewCourse }: CourseBrowserProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const allCourses = getStoredCourses()
    setCourses(allCourses)
    setFilteredCourses(allCourses)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses)
    } else {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructorName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCourses(filtered)
    }
  }, [searchQuery, courses])

  const handleEnroll = (courseId: string) => {
    if (!user) return

    try {
      enrollStudent(user.id, courseId)
      toast({
        title: "Enrolled successfully!",
        description: "You have been enrolled in the course.",
      })
      // Refresh the filtered courses to update enrollment status
      setFilteredCourses([...filteredCourses])
    } catch (error) {
      toast({
        title: "Enrollment failed",
        description: "Failed to enroll in the course. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Browse Courses</h2>
            <p className="text-muted-foreground">Discover and enroll in available courses</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Courses</CardTitle>
          <CardDescription>Find courses by title, description, or instructor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{searchQuery ? "No courses found" : "No courses available"}</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "Check back later for new courses"}
            </p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const lectures = getLecturesByCourse(course.id)
            const isEnrolled = user ? isStudentEnrolled(user.id, course.id) : false

            return (
              <Card key={course.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        by {course.instructorName}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-2">
                      <Badge variant="secondary" className="text-xs">
                        {lectures.length} lectures
                      </Badge>
                      {isEnrolled && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                          Enrolled
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{course.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {lectures.length} lectures
                    </div>
                    <div>{new Date(course.createdAt).toLocaleDateString()}</div>
                  </div>

                  {isEnrolled ? (
                    <Button onClick={() => onViewCourse(course.id)} className="w-full">
                      Continue Learning
                    </Button>
                  ) : (
                    <Button onClick={() => handleEnroll(course.id)} variant="outline" className="w-full">
                      Enroll Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
