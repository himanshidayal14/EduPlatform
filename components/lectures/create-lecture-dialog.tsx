"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, Plus } from "lucide-react"
import { createLecture, type QuizQuestion } from "@/lib/courses"
import { useToast } from "@/hooks/use-toast"

interface CreateLectureDialogProps {
  courseId: string
  onLectureCreated: () => void
}

export function CreateLectureDialog({ courseId, onLectureCreated }: CreateLectureDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"reading" | "quiz">("reading")
  const [content, setContent] = useState("")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setQuestions(updatedQuestions)
  }

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setTitle("")
    setType("reading")
    setContent("")
    setQuestions([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (type === "quiz" && questions.length === 0) {
        toast({
          title: "Error",
          description: "Quiz lectures must have at least one question.",
          variant: "destructive",
        })
        return
      }

      if (type === "quiz") {
        // Validate questions
        for (const question of questions) {
          if (!question.question.trim()) {
            toast({
              title: "Error",
              description: "All questions must have question text.",
              variant: "destructive",
            })
            return
          }
          if (question.options.some((opt) => !opt.trim())) {
            toast({
              title: "Error",
              description: "All answer options must be filled.",
              variant: "destructive",
            })
            return
          }
        }
      }

      createLecture(
        courseId,
        title,
        type,
        type === "reading" ? content : undefined,
        type === "quiz" ? questions : undefined,
      )

      toast({
        title: "Lecture created!",
        description: `Your ${type} lecture has been created successfully.`,
      })

      resetForm()
      setOpen(false)
      onLectureCreated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lecture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Lecture
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lecture</DialogTitle>
          <DialogDescription>Add a new reading or quiz lecture to your course.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lecture Title</Label>
              <Input
                id="title"
                placeholder="Enter lecture title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Lecture Type</Label>
              <RadioGroup value={type} onValueChange={(value: "reading" | "quiz") => setType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reading" id="reading" />
                  <Label htmlFor="reading">Reading Lecture</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quiz" id="quiz" />
                  <Label htmlFor="quiz">Quiz Lecture</Label>
                </div>
              </RadioGroup>
            </div>

            {type === "reading" && (
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the reading content or paste a URL"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={6}
                />
              </div>
            )}

            {type === "quiz" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Quiz Questions</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </div>

                {questions.map((question, questionIndex) => (
                  <Card key={question.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Question {questionIndex + 1}</CardTitle>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(questionIndex)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor={`question-${questionIndex}`}>Question</Label>
                        <Input
                          id={`question-${questionIndex}`}
                          placeholder="Enter your question"
                          value={question.question}
                          onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Answer Options</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroup
                              value={question.correctAnswer.toString()}
                              onValueChange={(value) =>
                                updateQuestion(questionIndex, "correctAnswer", Number.parseInt(value))
                              }
                            >
                              <RadioGroupItem
                                value={optionIndex.toString()}
                                id={`q${questionIndex}-opt${optionIndex}`}
                              />
                            </RadioGroup>
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                              required
                            />
                            <Label
                              htmlFor={`q${questionIndex}-opt${optionIndex}`}
                              className="text-xs text-muted-foreground"
                            >
                              {optionIndex === question.correctAnswer ? "Correct" : ""}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {questions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No questions added yet</p>
                    <p className="text-sm">Click "Add Question" to create your first quiz question</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Lecture"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
