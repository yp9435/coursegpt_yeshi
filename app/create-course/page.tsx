"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

const STEPS = {
  CATEGORY: 0,
  TOPIC: 1,
  OPTIONS: 2,
}

interface CourseData {
  category: string;
  customCategory: string;
  topic: string;
  description: string;
  difficulty: string;
  duration: string;
  includeYoutube: boolean;
  chapterCount: number;
}

/**
 * The `CreateCoursePage` component provides a multi-step wizard interface for creating a course.
 * It allows users to select a category, specify a topic and description, and configure additional options
 * such as difficulty, duration, chapter count, and whether to include YouTube videos.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered course creation wizard.
 *
 * @remarks
 * - The component uses `useRouter` for navigation and `useToast` for displaying notifications.
 * - It requires user authentication via `useAuth` to create a course.
 * - The wizard consists of three steps: Category, Topic, and Options.
 * - The course data is submitted to the `/api/generateLesson` endpoint.
 *
 * @example
 * ```tsx
 * import CreateCoursePage from './create-course/page';
 *
 * function App() {
 *   return <CreateCoursePage />;
 * }
 * ```
 *
 * @state
 * - `step` (`STEPS`): Tracks the current step in the wizard.
 * - `isLoading` (`boolean`): Indicates whether the course creation process is in progress.
 * - `courseData` (`object`): Stores the course details entered by the user.
 *
 * @methods
 * - `updateCourseData(data: Partial<CourseData>): void` - Updates the `courseData` state with partial data.
 * - `handleNext(): void` - Advances to the next step in the wizard.
 * - `handleBack(): void` - Returns to the previous step in the wizard.
 * - `handleSubmit(): Promise<void>` - Submits the course data to the server and handles the response.
 *
 * @dependencies
 * - `useRouter` from `next/router` for navigation.
 * - `useToast` for displaying notifications.
 * - `useAuth` for accessing the authenticated user.
 *
 * @styles
 * - Uses NES.css classes for styling the wizard interface.
 * - Includes conditional styling for active and completed steps.
 */
export default function CreateCoursePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [step, setStep] = useState(STEPS.CATEGORY)
  const [isLoading, setIsLoading] = useState(false)

  const [courseData, setCourseData] = useState({
    category: "",
    customCategory: "",
    topic: "",
    description: "",
    difficulty: "Beginner",
    duration: "1 Hour",
    includeYoutube: true,
    chapterCount: 5,
  })

  const updateCourseData = (data: Partial<CourseData>) => {
    setCourseData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (step < STEPS.OPTIONS) {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (step > STEPS.CATEGORY) {
      setStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a course",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch("/api/generateLesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          category: courseData.category === "Others" ? courseData.customCategory : courseData.category,
          topic: courseData.topic,
          description: courseData.description,
          difficulty: courseData.difficulty,
          duration: courseData.duration,
          includeYoutube: courseData.includeYoutube,
          chapterCount: courseData.chapterCount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate course")
      }

      const data = await response.json()

      toast({
        title: "Course created successfully!",
        description: "Redirecting to your new course...",
      })

      router.push(`/create-course/${data.courseId}`)
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error creating course",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="nes-container with-title is-rounded">
        <p className="title">Course Creation Wizard</p>

        <div className="mb-8 flex justify-between">
          {[0, 1, 2].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex flex-col items-center ${step === stepNumber ? "text-black" : "text-gray-400"}`}
            >
              <div className={`nes-badge ${step >= stepNumber ? "is-primary" : ""}`}>
                <span className={step >= stepNumber ? "is-primary" : "is-dark"}>{stepNumber + 1}</span>
              </div>
              <span className="mt-2 text-xs">
                {stepNumber === STEPS.CATEGORY && "Category"}
                {stepNumber === STEPS.TOPIC && "Topic"}
                {stepNumber === STEPS.OPTIONS && "Options"}
              </span>
            </div>
          ))}
        </div>

        {step === STEPS.CATEGORY && (
          <div className="space-y-6">
            <label className="block text-lg mb-4">Select Category:</label>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                className={`nes-container is-rounded p-4 flex flex-col items-center justify-center h-32 hover:opacity-80 transition-opacity ${courseData.category === "Development" ? "border-4 is-dark" : ""}`}
                onClick={() => updateCourseData({ category: "Development" })}
              >
                <i className="nes-icon coin is-large mb-2"></i>
                <span className="text-center">Development</span>
              </button>
              
              <button 
                type="button"
                className={`nes-container is-rounded p-4 flex flex-col items-center justify-center h-32 hover:opacity-80 transition-opacity ${courseData.category === "Design" ? "border-4 is-dark" : ""}`}
                onClick={() => updateCourseData({ category: "Design" })}
              >
                <i className="nes-icon star is-large mb-2"></i>
                <span className="text-center">Design</span>
              </button>
              
              <button 
                type="button"
                className={`nes-container is-rounded p-4 flex flex-col items-center justify-center h-32 hover:opacity-80 transition-opacity ${courseData.category === "Marketing" ? "border-4 is-dark" : ""}`}
                onClick={() => updateCourseData({ category: "Marketing" })}
              >
                <i className="nes-icon trophy is-large mb-2"></i>
                <span className="text-center">Marketing</span>
              </button>
              
              <button 
                type="button"
                className={`nes-container is-rounded p-4 flex flex-col items-center justify-center h-32 hover:opacity-80 transition-opacity ${courseData.category === "Others" ? "border-4 is-dark" : ""}`}
                onClick={() => updateCourseData({ category: "Others" })}
              >
                <i className="nes-icon heart is-large mb-2"></i>
                <span className="text-center">Others</span>
              </button>
            </div>
            
            {courseData.category === "Others" && (
              <div className="mt-4">
                <label className="block mb-2">Custom Category:</label>
                <input
                  type="text"
                  className="nes-input"
                  placeholder="Enter custom category name"
                  value={courseData.customCategory}
                  onChange={(e) => updateCourseData({ customCategory: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        {step === STEPS.TOPIC && (
          <div className="space-y-4">
            <label className="block">Topic:</label>
            <input
              type="text"
              className="nes-input"
              placeholder="Enter topic"
              value={courseData.topic}
              onChange={(e) => updateCourseData({ topic: e.target.value })}
            />
            <label className="block">Description:</label>
            <textarea
              className="nes-textarea"
              placeholder="Brief description..."
              value={courseData.description}
              onChange={(e) => updateCourseData({ description: e.target.value })}
            />
          </div>
        )}

        {step === STEPS.OPTIONS && (
          <div className="space-y-4">
            <label className="block">Difficulty:</label>
            <div className="nes-select">
              <select
                value={courseData.difficulty}
                onChange={(e) => updateCourseData({ difficulty: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <label className="block">Duration:</label>
            <input
              type="text"
              className="nes-input"
              value={courseData.duration}
              onChange={(e) => updateCourseData({ duration: e.target.value })}
            />

            <label className="block">Chapter Count:</label>
            <input
              type="number"
              className="nes-input"
              value={courseData.chapterCount}
              min={1}
              max={20}
              onChange={(e) => updateCourseData({ chapterCount: parseInt(e.target.value) })}
            />

            <label className="block">
              <input
                type="checkbox"
                className="nes-checkbox"
                checked={courseData.includeYoutube}
                onChange={(e) => updateCourseData({ includeYoutube: e.target.checked })}
              />
              <span> Include YouTube videos</span>
            </label>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === STEPS.CATEGORY}
            className="nes-btn"
          >
            Back
          </button>

          {step < STEPS.OPTIONS ? (
            <button
              onClick={handleNext}
              disabled={
                (step === STEPS.CATEGORY && !courseData.category) || (step === STEPS.TOPIC && !courseData.topic)
              }
              className="nes-btn is-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="nes-btn is-success"
            >
              {isLoading ? "Creating..." : "Create Course"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
