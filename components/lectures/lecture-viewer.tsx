"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, BookOpen, HelpCircle, CheckCircle } from "lucide-react"
import { type Lecture, getLecturesByCourse, markLectureComplete, getStudentProgress } from "@/lib/courses"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface LectureViewerProps {
  courseId: string
  lectureId: string
  onBack: () => void
}

export function LectureViewer({ courseId, lectureId, onBack }: LectureViewerProps) {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: number }>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [progress, setProgress] = useState<any[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const courseLectures = getLecturesByCourse(courseId)
    setLectures(courseLectures)

    const lectureIndex = courseLectures.findIndex((l) => l.id === lectureId)
    if (lectureIndex >= 0) {
      setCurrentIndex(lectureIndex)
      setCurrentLecture(courseLectures[lectureIndex])
    }

    if (user) {
      const studentProgress = getStudentProgress(user.id, courseId)
      setProgress(studentProgress)
    }
  }, [courseId, lectureId, user])

  const isLectureCompleted = (lectureId: string) => {
    return progress.some((p) => p.lectureId === lectureId && p.completed)
  }

  const canAccessLecture = (index: number) => {
    if (index === 0) return true
    return isLectureCompleted(lectures[index - 1]?.id)
  }

  const handleReadingComplete = () => {
    if (!user || !currentLecture) return

    markLectureComplete(user.id, courseId, currentLecture.id)
    toast({
      title: "Lecture completed!",
      description: "You have successfully completed this reading.",
    })

    // Refresh progress
    const studentProgress = getStudentProgress(user.id, courseId)
    setProgress(studentProgress)
  }

  const handleQuizSubmit = () => {
    if (!currentLecture || !currentLecture.questions) return

    let correctAnswers = 0
    const totalQuestions = currentLecture.questions.length

    currentLecture.questions.forEach((question) => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / totalQuestions) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)

    const passed = score >= 70 // 70% passing grade

    if (passed && user) {
      markLectureComplete(user.id, courseId, currentLecture.id, score)
      toast({
        title: "Quiz completed!",
        description: `You scored ${score}% and passed the quiz.`,
      })

      // Refresh progress
      const studentProgress = getStudentProgress(user.id, courseId)
      setProgress(studentProgress)
    } else {
      toast({
        title: "Quiz completed",
        description: `You scored ${score}%. You need 70% to pass.`,
        variant: "destructive",
      })
    }
  }

  const navigateToLecture = (index: number) => {
    if (index >= 0 && index < lectures.length && canAccessLecture(index)) {
      setCurrentIndex(index)
      setCurrentLecture(lectures[index])
      setQuizAnswers({})
      setQuizSubmitted(false)
      setQuizScore(null)
    }
  }

  const completedLectures = progress.filter((p) => p.completed).length
  const progressPercentage = lectures.length > 0 ? (completedLectures / lectures.length) * 100 : 0

  if (!currentLecture) {
    return (
      <div className="text-center py-12">
        <p>Lecture not found</p>
        <Button onClick={onBack} className="mt-4">
          Back to Course
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
        <div className="text-sm text-muted-foreground">
          Lecture {currentIndex + 1} of {lectures.length}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant={currentLecture.type === "reading" ? "secondary" : "default"}>
                {currentLecture.type === "reading" ? (
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
              {isLectureCompleted(currentLecture.id) && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{currentLecture.title}</CardTitle>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Course Progress</span>
                <span>
                  {completedLectures}/{lectures.length} lectures completed
                </span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentLecture.type === "reading" ? (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{currentLecture.content}</p>
              </div>
              {!isLectureCompleted(currentLecture.id) && (
                <Button onClick={handleReadingComplete} className="w-full">
                  Mark as Complete
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {currentLecture.questions?.map((question, questionIndex) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                    <CardDescription>{question.question}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={quizAnswers[question.id]?.toString() || ""}
                      onValueChange={(value) =>
                        setQuizAnswers({ ...quizAnswers, [question.id]: Number.parseInt(value) })
                      }
                      disabled={quizSubmitted}
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-${optionIndex}`} />
                          <Label
                            htmlFor={`${question.id}-${optionIndex}`}
                            className={`flex-1 ${
                              quizSubmitted
                                ? optionIndex === question.correctAnswer
                                  ? "text-green-600 font-medium"
                                  : quizAnswers[question.id] === optionIndex && optionIndex !== question.correctAnswer
                                    ? "text-red-600"
                                    : ""
                                : ""
                            }`}
                          >
                            {option}
                            {quizSubmitted && optionIndex === question.correctAnswer && (
                              <CheckCircle className="ml-2 h-4 w-4 text-green-600" />
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}

              {quizSubmitted && quizScore !== null && (
                <Card className={quizScore >= 70 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Quiz Results</h3>
                      <p className="text-2xl font-bold mb-2">{quizScore}%</p>
                      <p className={quizScore >= 70 ? "text-green-600" : "text-red-600"}>
                        {quizScore >= 70 ? "Congratulations! You passed the quiz." : "You need 70% to pass. Try again!"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!quizSubmitted && (
                <Button
                  onClick={handleQuizSubmit}
                  className="w-full"
                  disabled={
                    !currentLecture.questions || currentLecture.questions.some((q) => quizAnswers[q.id] === undefined)
                  }
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigateToLecture(currentIndex - 1)} disabled={currentIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Lecture
        </Button>
        <Button
          onClick={() => navigateToLecture(currentIndex + 1)}
          disabled={currentIndex === lectures.length - 1 || !canAccessLecture(currentIndex + 1)}
        >
          Next Lecture
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
