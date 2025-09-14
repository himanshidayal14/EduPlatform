"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, HelpCircle, Play } from "lucide-react"
import type { Lecture } from "@/lib/courses"

interface LectureListProps {
  lectures: Lecture[]
  onViewLecture?: (lectureId: string) => void
  showViewButton?: boolean
}

export function LectureList({ lectures, onViewLecture, showViewButton = false }: LectureListProps) {
  if (lectures.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No lectures yet</h3>
        <p className="text-muted-foreground">Add your first lecture to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lectures.map((lecture, index) => (
        <Card key={lecture.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Lecture {index + 1}</span>
                  <Badge variant={lecture.type === "reading" ? "secondary" : "default"}>
                    {lecture.type === "reading" ? (
                      <>
                        <BookOpen className="mr-1 h-3 w-3" />
                        Reading
                      </>
                    ) : (
                      <>
                        <HelpCircle className="mr-1 h-3 w-3" />
                        Quiz
                      </>
                    )}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{lecture.title}</CardTitle>
                <CardDescription className="text-sm">
                  {lecture.type === "reading" ? "Reading material" : `${lecture.questions?.length || 0} questions`}
                </CardDescription>
              </div>
              {showViewButton && onViewLecture && (
                <Button size="sm" onClick={() => onViewLecture(lecture.id)}>
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
              )}
            </div>
          </CardHeader>
          {lecture.type === "reading" && lecture.content && (
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{lecture.content}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
