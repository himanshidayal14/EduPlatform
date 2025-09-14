"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock } from "lucide-react"
import { type Course, getLecturesByCourse } from "@/lib/courses"

interface CourseCardProps {
  course: Course
  onViewCourse: (courseId: string) => void
  showEnrollButton?: boolean
}

export function CourseCard({ course, onViewCourse, showEnrollButton = false }: CourseCardProps) {
  const lectures = getLecturesByCourse(course.id)
  const lectureCount = lectures.length

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">by {course.instructorName}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {lectureCount} {lectureCount === 1 ? "lecture" : "lectures"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{course.description}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            {lectureCount} lectures
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(course.createdAt).toLocaleDateString()}
          </div>
        </div>

        <Button
          onClick={() => onViewCourse(course.id)}
          className="w-full"
          variant={showEnrollButton ? "default" : "outline"}
        >
          {showEnrollButton ? "Enroll Now" : "Manage Course"}
        </Button>
      </CardContent>
    </Card>
  )
}
