"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface CourseStructure {
  id: string
  userId: string
  courseName: string
  description: string
  category: string
  topic: string
  level: string
  duration: string
  noOfChapters: number
  chapters: {
    chapterName: string
    about: string
    duration: string
  }[]
  status: string
  createdAt: Date
  updatedAt: Date
}

export default function CourseDetailsPage({
  params,
}: {
  params: { courseId: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [course, setCourse] = useState<CourseStructure | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user) {
        router.push("/sign-in")
        return
      }

      try {
        const courseRef = doc(db, "courses", params.courseId)
        const courseSnap = await getDoc(courseRef)

        if (courseSnap.exists()) {
          const courseData = courseSnap.data() as CourseStructure

          if (courseData.userId !== user.uid) {
            toast({
              title: "Access denied",
              description: "You don't have permission to view this course",
              variant: "destructive",
            })
            router.push("/dashboard")
            return
          }

          setCourse({ ...courseData, id: courseSnap.id })
        } else {
          toast({
            title: "Course not found",
            description: "The requested course could not be found",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        toast({
          title: "Error loading course",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [params.courseId, router, toast, user])

  const handleEditCourse = () => {
    router.push(`/create-course/${params.courseId}/edit`)
  }

  const handleFinishCourse = () => {
    router.push(`/create-course/${params.courseId}/finish`)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="nes-text is-primary">Loading course details...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="nes-container is-rounded with-title">
        <p className="title">Error</p>
        <p>Course not found. Please try again or create a new course.</p>
        <button
          onClick={() => router.push("/create-course")}
          className="nes-btn is-primary mt-4"
        >
          Create New Course
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="nes-container with-title is-rounded">
        <p className="title">Course Preview</p>

        <div className="mb-6">
          <h1 className="nes-text is-primary text-2xl font-bold">{course.courseName}</h1>
          <p className="mt-2">{course.description}</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <p><span className="font-bold">Category:</span> {course.category}</p>
            <p><span className="font-bold">Difficulty:</span> {course.level}</p>
            <p><span className="font-bold">Duration:</span> {course.duration}</p>
          </div>
        </div>

        <div className="my-8">
          <h2 className="mb-4 text-xl font-bold">Chapters</h2>
          {course.chapters.length > 0 ? (
            <ul className="list-disc pl-5 space-y-4">
              {course.chapters.map((chapter, index) => (
                <li key={index} className="nes-container is-rounded">
                  <p className="font-bold">{chapter.chapterName}</p>
                  <p className="text-sm">{chapter.about}</p>
                  <p className="text-xs text-gray-600">Duration: {chapter.duration}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No chapters added yet.</p>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button onClick={handleEditCourse} className="nes-btn">
            Edit Course
          </button>
          <button onClick={handleFinishCourse} className="nes-btn is-success">
            Finish & Publish
          </button>
        </div>
      </div>
    </div>
  )
}
